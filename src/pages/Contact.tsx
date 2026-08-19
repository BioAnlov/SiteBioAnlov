import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/PageHero";
import { usePageMeta } from "../hooks/usePageMeta";
import { site } from "../data/site";

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  usePageMeta(
    "Contact — BioAnlov",
    `Joignez BioAnlov au ${site.phone} ou à ${site.email}. Territoire desservi : ${site.territory}.`,
  );

  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const formData = new FormData(event.currentTarget);
    const payload: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      if (typeof value !== "string") continue;
      payload[key] = value.trim();
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "L’envoi a échoué. Veuillez réessayer.");
      }

      formRef.current?.reset();
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : "L’envoi a échoué. Veuillez réessayer.",
      );
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Communiquer avec BioAnlov"
        text="Nous répondons à vos questions et planifions une visite de vos locaux."
        image="/images/restaurant.webp"
      />
      <section className="content-section quote-layout contact-form">
        <div className="quote-summary">
          <p className="eyebrow">
            <span aria-hidden="true" />
            Écrivez-nous
          </p>
          <h2>Une question ?</h2>
          <p>
            Écrivez-nous directement d’ici. Un membre de l’équipe vous répondra dans un délai de 1
            à 2 jours ouvrables, et vous recevrez un accusé de réception par courriel.
          </p>
          <strong>{site.email}</strong>
          <br />
          <a href={site.phoneHref}>{site.phone}</a>
        </div>

        {status === "success" ? (
          <div className="quote-sent" role="status" aria-live="polite">
            <span className="sent-mark" aria-hidden="true">
              ✓
            </span>
            <h2>Votre message a bien été envoyé</h2>
            <p>
              Merci. Un accusé de réception vient de vous être transmis par courriel. Un membre de
              l’équipe BioAnlov vous répondra dans un délai de 1 à 2 jours ouvrables.
            </p>
            <div className="quote-sent-actions">
              <button className="button" type="button" onClick={() => setStatus("idle")}>
                Écrire un autre message
              </button>
              <a className="button secondary-button" href={site.phoneHref}>
                Appeler BioAnlov
              </a>
            </div>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit}>
            <label className="full-field">
              Nom complet <span className="required-mark">*</span>
              <input name="nom" required autoComplete="name" />
            </label>
            <label>
              Courriel <span className="required-mark">*</span>
              <input name="courriel" type="email" required autoComplete="email" />
            </label>
            <label>
              Téléphone
              <input name="telephone" type="tel" autoComplete="tel" />
            </label>
            <label className="full-field">
              Message <span className="required-mark">*</span>
              <textarea
                name="message"
                rows={6}
                required
                placeholder="Décrivez votre besoin ou posez-nous votre question."
              />
            </label>

            {/* Champ piège anti-pourriel : invisible pour les visiteurs. */}
            <input
              type="text"
              name="siteWeb"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
            />

            {status === "error" && (
              <p className="form-status error" role="alert">
                <strong>L’envoi n’a pas fonctionné.</strong>
                {errorMessage} Vous pouvez aussi nous écrire à{" "}
                <a href={`mailto:${site.email}`}>{site.email}</a> ou appeler au{" "}
                <a href={site.phoneHref}>{site.phone}</a>.
              </p>
            )}

            <button className="button" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Envoi en cours…" : "Envoyer mon message ↗"}
            </button>
          </form>
        )}
      </section>

      <section className="content-section contact-details">
        <div className="contact-grid">
          <article>
            <span aria-hidden="true">✉</span>
            <small>Courriel</small>
            <h2>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </h2>
            <p>Écrivez-nous pour toute question concernant nos services.</p>
          </article>
          <article>
            <span aria-hidden="true">☎</span>
            <small>Téléphone</small>
            <h2>
              <a href={site.phoneHref}>{site.phone}</a>
            </h2>
            <p>Appelez-nous pour discuter de vos besoins ou planifier une visite.</p>
          </article>
          <article>
            <span aria-hidden="true">⌖</span>
            <small>Territoire desservi</small>
            <h2>{site.territory}</h2>
            <p>Les déplacements sont confirmés lors de la prise de rendez-vous.</p>
          </article>
          <article>
            <span aria-hidden="true">◷</span>
            <small>Heures de réponse</small>
            <h2>{site.hours}</h2>
            <p>
              Les messages reçus à l’extérieur de ces heures seront traités le jour ouvrable
              suivant.
            </p>
          </article>
        </div>
        <div className="contact-social">
          <p>
            <strong>Réseaux sociaux :</strong> suivez BioAnlov sur{" "}
            <a href={site.facebook} target="_blank" rel="noopener noreferrer">
              Facebook
            </a>{" "}
            et{" "}
            <a href={site.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            .
          </p>
          <p>Vous pouvez également remplir directement le formulaire de soumission.</p>
        </div>
        <div className="contact-actions">
          <a className="button" href={site.phoneHref}>
            Appeler BioAnlov
          </a>
          <Link className="button secondary-button" to="/soumission">
            Demander une soumission
          </Link>
        </div>
      </section>
    </>
  );
}
