import { Link } from "react-router-dom";
import { PageHero } from "../components/PageHero";
import { usePageMeta } from "../hooks/usePageMeta";
import { site } from "../data/site";

export default function Contact() {
  usePageMeta(
    "Contact — BioAnlov",
    `Joignez BioAnlov au ${site.phone} ou à ${site.email}. Territoire desservi : ${site.territory}.`,
  );

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Communiquer avec BioAnlov"
        text="Nous répondons à vos questions et planifions une visite de vos locaux."
        image="/images/restaurant.webp"
      />
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
            <strong>Réseaux sociaux :</strong> les liens seront ajoutés dès que les comptes
            BioAnlov seront créés.
          </p>
          <p>Vous pouvez également remplir directement le formulaire de soumission.</p>
        </div>
        <div className="contact-actions">
          <a className="button" href={site.phoneHref}>
            Appeler BioAnlov
          </a>
          <a className="button secondary-button" href={`mailto:${site.email}`}>
            Écrire à BioAnlov
          </a>
          <Link className="button secondary-button" to="/soumission">
            Demander une soumission
          </Link>
        </div>
      </section>
    </>
  );
}
