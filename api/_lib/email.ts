/**
 * Gabarits de courriel partagés par les points d'entrée de l'API.
 *
 * Le préfixe `_` du dossier empêche Vercel d'exposer ce fichier comme une
 * fonction : il est seulement importé par les autres.
 */
import type { Resend } from "resend";

export const CONTACT_PHONE = "(514) 447-4195";
export const CONTACT_EMAIL = "info@bioanlov.com";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Prénom seul, pour une salutation naturelle. Vide si le nom est absent. */
function firstName(fullName: string): string {
  const first = fullName.trim().split(/\s+/)[0] ?? "";
  return first.length > 1 && first.length <= 40 ? first : "";
}

export type ConfirmationKind = "soumission" | "contact";

/** Construit l'accusé de réception destiné au visiteur. */
export function buildConfirmation(kind: ConfirmationKind, name: string) {
  const prenom = firstName(name);
  const salutation = prenom ? `Bonjour ${prenom},` : "Bonjour,";
  const objetRecu =
    kind === "soumission" ? "votre demande de soumission" : "votre message";
  const subject =
    kind === "soumission"
      ? "Nous avons bien reçu votre demande — BioAnlov"
      : "Nous avons bien reçu votre message — BioAnlov";

  const suite =
    kind === "soumission"
      ? "Un membre de notre équipe communiquera avec vous dans un délai de 1 à 2 jours ouvrables afin de préciser vos besoins et de convenir d’une visite de vos locaux."
      : "Un membre de notre équipe communiquera avec vous dans un délai de 1 à 2 jours ouvrables afin de répondre à vos questions.";

  const text = [
    salutation,
    "",
    `Merci d’avoir communiqué avec BioAnlov. Nous avons bien reçu ${objetRecu} et nous vous remercions de la confiance que vous nous accordez.`,
    "",
    suite,
    "",
    "Entre-temps, si vous avez la moindre question, n’hésitez pas à nous joindre :",
    `Téléphone : ${CONTACT_PHONE}`,
    `Courriel : ${CONTACT_EMAIL}`,
    "",
    "Au plaisir de vous parler bientôt,",
    "L’équipe BioAnlov",
    "Entretien ménager commercial",
  ].join("\n");

  const html = `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:24px;background:#edf4ef;font-family:Arial,Helvetica,sans-serif;color:#17372f">
    <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #d8e2dc;border-radius:8px;overflow:hidden">
      <div style="padding:26px 30px;background:#153f35;color:#fff">
        <p style="margin:0;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#cce0d6">BioAnlov</p>
        <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:24px;font-weight:500">Merci de votre demande</h1>
      </div>
      <div style="padding:30px">
        <p style="margin:0 0 18px;font-size:15px;line-height:1.7">${escapeHtml(salutation)}</p>
        <p style="margin:0 0 18px;font-size:15px;line-height:1.7">
          Merci d’avoir communiqué avec BioAnlov. Nous avons bien reçu ${escapeHtml(objetRecu)} et nous vous
          remercions de la confiance que vous nous accordez.
        </p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.7">${escapeHtml(suite)}</p>
        <div style="margin:0 0 24px;padding:18px 20px;background:#edf4ef;border-left:3px solid #245f4d;border-radius:4px">
          <p style="margin:0 0 10px;font-size:12px;font-weight:bold;letter-spacing:.08em;text-transform:uppercase;color:#476057">
            Une question entre-temps ?
          </p>
          <p style="margin:0;font-size:15px;line-height:1.8">
            Téléphone : <a href="tel:+15144474195" style="color:#245f4d;font-weight:bold;text-decoration:none">${CONTACT_PHONE}</a><br />
            Courriel : <a href="mailto:${CONTACT_EMAIL}" style="color:#245f4d;font-weight:bold;text-decoration:none">${CONTACT_EMAIL}</a>
          </p>
        </div>
        <p style="margin:0;font-size:15px;line-height:1.7">
          Au plaisir de vous parler bientôt,<br />
          <strong>L’équipe BioAnlov</strong><br />
          <span style="color:#5f6f69;font-size:13px">Entretien ménager commercial</span>
        </p>
      </div>
    </div>
  </body>
</html>`;

  return { subject, text, html };
}

/**
 * Envoie l'accusé de réception au visiteur.
 *
 * Ne lève jamais : la notification interne a déjà été transmise à ce stade et
 * un accusé manqué ne doit pas transformer une demande reçue en erreur pour le
 * visiteur. L'échec est journalisé pour rester visible dans les journaux Vercel.
 */
export async function sendConfirmation(
  resend: Resend,
  options: { to: string; from: string; kind: ConfirmationKind; name: string },
): Promise<boolean> {
  const { subject, text, html } = buildConfirmation(options.kind, options.name);

  try {
    const { error } = await resend.emails.send({
      from: options.from,
      to: [options.to],
      replyTo: CONTACT_EMAIL,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("Accusé de réception non envoyé :", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Accusé de réception non envoyé :", err);
    return false;
  }
}
