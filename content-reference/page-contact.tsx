import Link from "next/link";
import { Footer, Header, PageHero } from "../components";

export default function Contact() {
  return <main>
    <Header />
    <PageHero eyebrow="Contact" title="Communiquer avec BioAnlov" text="Nous répondons à vos questions et planifions une visite de vos locaux." image="/images/restaurant.webp" />
    <section className="content-section contact-details">
      <div className="contact-grid">
        <article><span aria-hidden="true">✉</span><small>Courriel</small><h2>info@bioanlov.ca</h2><p>Écrivez-nous pour toute question concernant nos services.</p></article>
        <article><span aria-hidden="true">☎</span><small>Téléphone</small><h2><a href="tel:+15144474195">(514) 447-4195</a></h2><p>Appelez-nous pour discuter de vos besoins ou planifier une visite.</p></article>
        <article><span aria-hidden="true">⌖</span><small>Territoire desservi</small><h2>Île de Montréal, Laval, Lanaudière et Rive-Sud</h2><p>Les déplacements sont confirmés lors de la prise de rendez-vous.</p></article>
        <article><span aria-hidden="true">◷</span><small>Heures de réponse</small><h2>Du lundi au vendredi, de 8 h à 17 h</h2><p>Les messages reçus à l’extérieur de ces heures seront traités le jour ouvrable suivant.</p></article>
      </div>
      <div className="contact-social"><p><strong>Réseaux sociaux :</strong> les liens seront ajoutés dès que les comptes BioAnlov seront créés.</p><p>Vous pouvez également remplir directement le formulaire de soumission.</p></div>
      <div className="contact-actions"><a className="button" href="tel:+15144474195">Appeler BioAnlov</a><a className="button secondary-button" href="mailto:info@bioanlov.ca">Écrire à BioAnlov</a><Link className="button secondary-button" href="/soumission">Demander une soumission</Link></div>
    </section>
    <Footer />
  </main>;
}
