import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { escapeHtml, sendConfirmation } from "./_lib/email";

/**
 * Réception du formulaire de contact et envoi du courriel via Resend.
 * Même principe que `soumission.ts`, avec moins de champs.
 */

const TO_EMAIL = process.env.QUOTE_TO_EMAIL || "info@bioanlov.com";
const FROM_EMAIL = process.env.QUOTE_FROM_EMAIL || "BioAnlov <onboarding@resend.dev>";

const FIELDS: { key: string; label: string }[] = [
  { key: "nom", label: "Nom" },
  { key: "courriel", label: "Courriel" },
  { key: "telephone", label: "Téléphone" },
  { key: "message", label: "Message" },
];

const REQUIRED = ["nom", "courriel", "message"];
const MAX_LENGTH = 5000;

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

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY manquante dans les variables d'environnement.");
    return res
      .status(500)
      .json({ error: "Le service d’envoi n’est pas configuré pour le moment." });
  }

  const body: Record<string, unknown> =
    typeof req.body === "string" ? safeParse(req.body) : ((req.body as Record<string, unknown>) ?? {});

  // Champ piège : s'il est rempli, le message vient d'un robot.
  if (asText(body.siteWeb)) {
    return res.status(200).json({ ok: true });
  }

  const missing = REQUIRED.filter((key) => !asText(body[key]));
  if (missing.length > 0) {
    return res.status(400).json({ error: "Veuillez remplir tous les champs obligatoires." });
  }

  const courriel = asText(body.courriel);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(courriel)) {
    return res.status(400).json({ error: "L’adresse courriel semble invalide." });
  }

  const nom = asText(body.nom);
  const rows = FIELDS.map((field) => ({
    label: field.label,
    value: asText(body[field.key]) || "—",
  }));

  const subject = `Message du site — ${nom}`;

  const text = [
    "Nouveau message reçu via le formulaire de contact de bioanlov.com",
    "",
    ...rows.map((row) => `${row.label} : ${row.value}`),
  ].join("\n");

  const html = `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:24px;background:#edf4ef;font-family:Arial,Helvetica,sans-serif;color:#17372f">
    <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #d8e2dc;border-radius:8px;overflow:hidden">
      <div style="padding:24px 28px;background:#153f35;color:#fff">
        <p style="margin:0;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#cce0d6">Nouveau message</p>
        <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:24px;font-weight:500">${escapeHtml(nom)}</h1>
      </div>
      <table style="width:100%;border-collapse:collapse">
        ${rows
          .map(
            (row, index) => `<tr style="background:${index % 2 ? "#f8f6ee" : "#fff"}">
          <td style="padding:12px 16px;border-bottom:1px solid #edf4ef;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:.04em;color:#5f6f69;width:34%;vertical-align:top">${escapeHtml(row.label)}</td>
          <td style="padding:12px 16px;border-bottom:1px solid #edf4ef;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(row.value)}</td>
        </tr>`,
          )
          .join("")}
      </table>
      <p style="margin:0;padding:18px 28px;font-size:12px;color:#5f6f69">
        Répondez directement à ce courriel pour joindre ${escapeHtml(nom)}.
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
    });

    if (error) {
      console.error("Erreur Resend :", error);
      return res
        .status(502)
        .json({ error: "Le message n’a pas pu être envoyé. Veuillez réessayer." });
    }

    // Accusé de réception au visiteur : envoi distinct, dont l'échec ne remet
    // pas en cause la notification déjà transmise à BioAnlov.
    const confirmed = await sendConfirmation(resend, {
      to: courriel,
      from: FROM_EMAIL,
      kind: "contact",
      name: nom,
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
