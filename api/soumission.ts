import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { escapeHtml, sendConfirmation } from "./_lib/email.js";
import { creerLimite } from "./_lib/limite.js";

/**
 * Réception du formulaire de soumission et envoi du courriel via Resend.
 * Remplace l'ancien `mailto:` qui dépendait du client courriel du visiteur.
 */

/** Limite de fréquence : 3 demandes par tranche de 10 minutes et par adresse IP. */
const tropDeDemandes = creerLimite();

const TO_EMAIL = process.env.QUOTE_TO_EMAIL || "info@bioanlov.com";
const FROM_EMAIL = process.env.QUOTE_FROM_EMAIL || "BioAnlov <onboarding@resend.dev>";

/** Champs affichés dans le courriel, dans l'ordre. */
const FIELDS: { key: string; label: string; type?: "bool" }[] = [
  { key: "entreprise", label: "Nom de l’entreprise" },
  { key: "responsable", label: "Personne responsable" },
  { key: "courriel", label: "Courriel" },
  { key: "telephone", label: "Téléphone" },
  { key: "adresse", label: "Adresse des locaux" },
  { key: "typeEtablissement", label: "Type d’établissement" },
  { key: "superficie", label: "Superficie approximative" },
  { key: "nbBureaux", label: "Nombre de bureaux ou de locaux" },
  { key: "nbCuisines", label: "Nombre de cuisines" },
  { key: "nbSanitaires", label: "Nombre de sanitaires" },
  { key: "frequence", label: "Fréquence souhaitée" },
  { key: "horaires", label: "Journées ou heures préférées" },
  { key: "dateVisite", label: "Date souhaitée pour la visite" },
  { key: "approvisionnement", label: "Approvisionnement en produits consommables", type: "bool" },
  { key: "equipement", label: "Équipement des locaux", type: "bool" },
  { key: "servicesSupplementaires", label: "Services supplémentaires recherchés" },
  { key: "message", label: "Message" },
];

const REQUIRED = [
  "entreprise",
  "responsable",
  "courriel",
  "telephone",
  "adresse",
  "typeEtablissement",
];

const MAX_LENGTH = 5000;

/** Limites des pièces jointes, alignées sur `src/lib/photos.ts`. */
const MAX_PHOTOS = 5;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const MAX_TOTAL_PHOTO_BYTES = 4 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png"]);

type Attachment = { filename: string; content: string };

/** Retire tout chemin et ne garde que des caractères sûrs pour un nom de fichier. */
function safeFileName(name: string, fallback: string): string {
  const base = name.split(/[\\/]/).pop() || "";
  const cleaned = base.replace(/[^\w.\- ]+/g, "").trim().slice(0, 80);
  return cleaned && /\.[a-z0-9]+$/i.test(cleaned) ? cleaned : fallback;
}

/**
 * Valide les photos reçues et les convertit en pièces jointes Resend.
 * Une erreur retournée ici est destinée au visiteur.
 */
function readPhotos(raw: unknown): { attachments: Attachment[]; names: string[]; error?: string } {
  if (raw === undefined || raw === null || raw === "") return { attachments: [], names: [] };
  if (!Array.isArray(raw)) return { attachments: [], names: [], error: "Photos illisibles." };
  if (raw.length > MAX_PHOTOS) {
    return { attachments: [], names: [], error: `Maximum ${MAX_PHOTOS} photos.` };
  }

  const attachments: Attachment[] = [];
  const names: string[] = [];
  let total = 0;

  for (const [index, entry] of raw.entries()) {
    const photo = (entry ?? {}) as Record<string, unknown>;
    const content = typeof photo.content === "string" ? photo.content : "";
    const type = asText(photo.type);

    if (!content) return { attachments: [], names: [], error: "Photos illisibles." };
    if (!ALLOWED_PHOTO_TYPES.has(type)) {
      return { attachments: [], names: [], error: "Seules les photos JPEG ou PNG sont acceptées." };
    }

    const bytes = Buffer.from(content, "base64");
    if (bytes.length === 0) return { attachments: [], names: [], error: "Photos illisibles." };
    if (bytes.length > MAX_PHOTO_BYTES) {
      return { attachments: [], names: [], error: "Une photo dépasse la taille autorisée." };
    }

    total += bytes.length;
    if (total > MAX_TOTAL_PHOTO_BYTES) {
      return { attachments: [], names: [], error: "Les photos dépassent la taille totale permise." };
    }

    const extension = type === "image/png" ? "png" : "jpg";
    const filename = safeFileName(asText(photo.name), `photo-${index + 1}.${extension}`);
    attachments.push({ filename, content });
    names.push(filename);
  }

  return { attachments, names };
}

function asText(value: unknown): string {
  if (typeof value === "string") return value.trim().slice(0, MAX_LENGTH);
  if (typeof value === "number") return String(value);
  return "";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  if (tropDeDemandes(req)) {
    return res.status(429).json({
      error: "Trop de demandes envoyées. Veuillez patienter quelques minutes ou nous téléphoner.",
    });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY manquante dans les variables d'environnement.");
    return res
      .status(500)
      .json({ error: "Le service d’envoi n’est pas configuré pour le moment." });
  }

  const body: Record<string, unknown> =
    typeof req.body === "string" ? safeParse(req.body) : ((req.body as Record<string, unknown>) ?? {});

  // Champ piège : s'il est rempli, la demande vient d'un robot.
  if (asText(body.siteWeb)) {
    return res.status(200).json({ ok: true });
  }

  // Question anti-robot : la réponse doit correspondre aux deux nombres affichés.
  const a = Number(asText(body.antiRobotA));
  const b = Number(asText(body.antiRobotB));
  const reponse = Number(asText(body.antiRobot));
  if (!Number.isFinite(a) || !Number.isFinite(b) || reponse !== a + b) {
    return res.status(400).json({ error: "La réponse à la question anti-robot est incorrecte." });
  }

  const missing = REQUIRED.filter((key) => !asText(body[key]));
  if (missing.length > 0) {
    return res.status(400).json({ error: "Veuillez remplir tous les champs obligatoires." });
  }

  const courriel = asText(body.courriel);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(courriel)) {
    return res.status(400).json({ error: "L’adresse courriel semble invalide." });
  }

  const { attachments, names, error: photoError } = readPhotos(body.photos);
  if (photoError) {
    return res.status(400).json({ error: photoError });
  }

  const rows = FIELDS.map((field) => {
    const raw = body[field.key];
    const value =
      field.type === "bool" ? (raw === true || raw === "true" ? "Oui" : "Non") : asText(raw);
    return { label: field.label, value: value || "—" };
  });

  rows.push({
    label: "Photos jointes",
    value: names.length ? `${names.length} — ${names.join(", ")}` : "—",
  });

  const entreprise = asText(body.entreprise);
  const subject = `Demande de soumission — ${entreprise}`;

  const text = [
    "Nouvelle demande de soumission reçue via bioanlov.com",
    "",
    ...rows.map((row) => `${row.label} : ${row.value}`),
  ].join("\n");

  const html = `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:24px;background:#edf4ef;font-family:Arial,Helvetica,sans-serif;color:#17372f">
    <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #d8e2dc;border-radius:8px;overflow:hidden">
      <div style="padding:24px 28px;background:#153f35;color:#fff">
        <p style="margin:0;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#cce0d6">Nouvelle demande</p>
        <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:24px;font-weight:500">${escapeHtml(entreprise)}</h1>
      </div>
      <table style="width:100%;border-collapse:collapse">
        ${rows
          .map(
            (row, index) => `<tr style="background:${index % 2 ? "#f8f6ee" : "#fff"}">
          <td style="padding:12px 16px;border-bottom:1px solid #edf4ef;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:.04em;color:#5f6f69;width:44%;vertical-align:top">${escapeHtml(row.label)}</td>
          <td style="padding:12px 16px;border-bottom:1px solid #edf4ef;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(row.value)}</td>
        </tr>`,
          )
          .join("")}
      </table>
      <p style="margin:0;padding:18px 28px;font-size:12px;color:#5f6f69">
        Répondez directement à ce courriel pour joindre ${escapeHtml(asText(body.responsable))}.
      </p>
    </div>
  </body>
</html>`;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: courriel,
      subject,
      text,
      html,
      ...(attachments.length > 0 ? { attachments } : {}),
    });

    if (error) {
      console.error("Erreur Resend :", error);
      return res
        .status(502)
        .json({ error: "Le courriel n’a pas pu être envoyé. Veuillez réessayer." });
    }

    // Accusé de réception au visiteur : envoi distinct, dont l'échec ne remet
    // pas en cause la notification déjà transmise à BioAnlov.
    const confirmed = await sendConfirmation(resend, {
      to: courriel,
      from: FROM_EMAIL,
      kind: "soumission",
      name: asText(body.responsable),
    });

    return res.status(200).json({ ok: true, id: data?.id, confirmation: confirmed });
  } catch (err) {
    console.error("Erreur d’envoi :", err);
    return res.status(500).json({ error: "Une erreur interne est survenue. Veuillez réessayer." });
  }
}

function safeParse(raw: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}
