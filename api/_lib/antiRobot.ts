/**
 * Question anti-robot, partagée par les formulaires de soumission et de contact.
 *
 * Le navigateur affiche deux nombres au visiteur et les renvoie avec la réponse ;
 * le serveur refait le calcul. Un envoi automatisé qui ne passe pas par la page
 * ne connaît pas les nombres attendus.
 */

export const MESSAGE_ANTI_ROBOT = "La réponse à la question anti-robot est incorrecte.";

/** Bornes du tirage. Elles doivent rester alignées sur `src/components/AntiRobot.tsx`. */
const MIN = 1;
const MAX = 8;

/**
 * Convertit une valeur reçue en nombre. Renvoie `null` si le champ est absent
 * ou vide : sans cette distinction, un champ manquant vaudrait zéro et un envoi
 * dépourvu de toute réponse satisferait le calcul 0 + 0 = 0.
 */
function nombre(valeur: unknown): number | null {
  if (typeof valeur === "number") return Number.isFinite(valeur) ? valeur : null;
  if (typeof valeur !== "string") return null;
  const texte = valeur.trim();
  if (!texte) return null;
  const converti = Number(texte);
  return Number.isFinite(converti) ? converti : null;
}

/** Un nombre hors du tirage n'a pas été produit par le formulaire. */
function issuDuTirage(valeur: number): boolean {
  return Number.isInteger(valeur) && valeur >= MIN && valeur <= MAX;
}

export function reponseAntiRobotValide(body: Record<string, unknown>): boolean {
  const a = nombre(body.antiRobotA);
  const b = nombre(body.antiRobotB);
  const reponse = nombre(body.antiRobot);

  if (a === null || b === null || reponse === null) return false;
  if (!issuDuTirage(a) || !issuDuTirage(b)) return false;

  return reponse === a + b;
}
