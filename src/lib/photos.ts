/**
 * Préparation des photos jointes au formulaire de soumission.
 *
 * Les photos partent dans le corps JSON de la requête, or une fonction Vercel
 * refuse les corps de plus de 4,5 Mo et l'encodage base64 gonfle déjà les
 * fichiers d'un tiers. Une photo de téléphone pèse couramment 3 à 5 Mo : elles
 * sont donc redimensionnées et recompressées ici, avant l'envoi. Le visiteur
 * garde la liberté de choisir ses fichiers tels quels.
 */

/** Nombre maximal de photos acceptées. */
export const MAX_PHOTOS = 5;
/** Taille maximale d'une photo choisie, avant compression. */
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
/** Budget total après compression, marge gardée sous la limite de Vercel. */
export const MAX_TOTAL_BYTES = 3.5 * 1024 * 1024;
/** Types acceptés, repris tels quels par l'attribut `accept` du champ. */
export const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

/** Côté le plus long conservé, suffisant pour juger des lieux. */
const MAX_DIMENSION = 1600;
/** En dessous, la photo part telle quelle : la recompresser ne gagnerait rien. */
const COMPRESS_ABOVE_BYTES = 700 * 1024;

export type PreparedPhoto = {
  name: string;
  type: string;
  size: number;
  /** Contenu encodé en base64, sans le préfixe `data:`. */
  content: string;
};

/** « 2,4 Mo », « 812 ko ». */
export function describeSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} Mo`;
  return `${Math.round(bytes / 1024)} ko`;
}

/**
 * Filtre une sélection : type, taille et nombre. Retourne les fichiers retenus
 * et, le cas échéant, le premier problème rencontré à afficher au visiteur.
 */
export function validateSelection(
  existing: File[],
  added: File[],
): { accepted: File[]; error: string } {
  const accepted = [...existing];
  let error = "";

  for (const file of added) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      error = `« ${file.name} » n’est pas une image JPEG ou PNG.`;
      continue;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      error = `« ${file.name} » dépasse ${describeSize(MAX_PHOTO_BYTES)}.`;
      continue;
    }
    if (accepted.some((f) => f.name === file.name && f.size === file.size)) continue;
    if (accepted.length >= MAX_PHOTOS) {
      error = `Vous pouvez joindre au maximum ${MAX_PHOTOS} photos.`;
      break;
    }
    accepted.push(file);
  }

  return { accepted, error };
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`« ${file.name} » n’a pas pu être lue.`));
    };
    image.src = url;
  });
}

function toBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(new Error("La lecture du fichier a échoué."));
    reader.readAsDataURL(blob);
  });
}

/** Redimensionne et réencode en JPEG. Le PNG transparent est aplati sur blanc. */
async function compress(file: File, maxDimension: number, quality: number): Promise<Blob> {
  const image = await loadImage(file);
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Le navigateur n’a pas pu préparer les photos.");
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );
  if (!blob) throw new Error("Le navigateur n’a pas pu préparer les photos.");
  return blob;
}

async function prepareOne(
  file: File,
  maxDimension: number,
  quality: number,
): Promise<PreparedPhoto> {
  if (file.size <= COMPRESS_ABOVE_BYTES && maxDimension === MAX_DIMENSION) {
    return { name: file.name, type: file.type, size: file.size, content: await toBase64(file) };
  }

  const blob = await compress(file, maxDimension, quality);
  // La compression peut être contre-productive sur une image déjà optimisée.
  if (blob.size >= file.size) {
    return { name: file.name, type: file.type, size: file.size, content: await toBase64(file) };
  }

  const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return { name, type: "image/jpeg", size: blob.size, content: await toBase64(blob) };
}

/**
 * Prépare toutes les photos pour l'envoi. Si le lot reste trop lourd, une
 * seconde passe plus agressive est tentée avant d'abandonner.
 */
export async function preparePhotos(files: File[]): Promise<PreparedPhoto[]> {
  const passes: { maxDimension: number; quality: number }[] = [
    { maxDimension: MAX_DIMENSION, quality: 0.82 },
    { maxDimension: 1280, quality: 0.7 },
  ];

  let prepared: PreparedPhoto[] = [];
  for (const pass of passes) {
    prepared = [];
    for (const file of files) {
      prepared.push(await prepareOne(file, pass.maxDimension, pass.quality));
    }
    const total = prepared.reduce((sum, photo) => sum + photo.size, 0);
    if (total <= MAX_TOTAL_BYTES) return prepared;
  }

  throw new Error(
    `Les photos choisies restent trop volumineuses (maximum ${describeSize(MAX_TOTAL_BYTES)} au total). Retirez-en une ou deux, puis réessayez.`,
  );
}
