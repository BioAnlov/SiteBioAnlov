import { Footer, Header, PageHero } from "../components";

export default function Quote() {
  return <main>
    <Header />
    <PageHero eyebrow="Soumission" title="Demande de soumission" text="Chaque soumission est préparée selon les caractéristiques de vos locaux et vos besoins. Remplissez ce formulaire afin que BioAnlov puisse communiquer avec vous et planifier une visite." />
    <section className="content-section quote-layout detailed-quote">
      <div className="quote-summary">
        <h2>Parlez-nous de vos locaux</h2>
        <p>Ces renseignements nous aideront à préparer la visite et à mieux évaluer vos besoins.</p>
        <strong>info@bioanlov.ca</strong>
        <a href="tel:+15144474195">(514) 447-4195</a>
      </div>
      <form action="mailto:info@bioanlov.ca" method="post" encType="text/plain">
        <label>Nom de l’entreprise<input name="Entreprise" required /></label>
        <label>Personne responsable<input name="Personne responsable" required /></label>
        <label>Courriel<input name="Courriel" type="email" required /></label>
        <label>Téléphone<input name="Téléphone" type="tel" required /></label>
        <label className="full-field">Adresse des locaux<input name="Adresse des locaux" required /></label>
        <label>Type d’établissement<select name="Type d’établissement" defaultValue="" required><option value="" disabled>Choisir une option</option><option>Immeuble ou bureaux</option><option>CPE ou garderie</option><option>Restaurant</option><option>Autre établissement commercial</option></select></label>
        <label>Superficie approximative<input name="Superficie approximative" placeholder="Ex. 2 500 pi²" /></label>
        <label>Nombre de bureaux ou de locaux<input name="Nombre de bureaux ou de locaux" type="number" min="0" /></label>
        <label>Nombre de cuisines<input name="Nombre de cuisines" type="number" min="0" /></label>
        <label>Nombre de sanitaires<input name="Nombre de sanitaires" type="number" min="0" /></label>
        <label>Fréquence souhaitée<select name="Fréquence souhaitée" defaultValue=""><option value="" disabled>À déterminer</option><option>Une fois par semaine</option><option>Deux à trois fois par semaine</option><option>Chaque jour ouvrable</option><option>Besoin ponctuel</option></select></label>
        <label>Journées ou heures préférées<input name="Journées ou heures préférées" placeholder="Ex. vendredi soir" /></label>
        <label>Date souhaitée pour la visite<input name="Date souhaitée pour la visite" type="date" /></label>
        <fieldset className="quote-options">
          <legend>Besoins complémentaires</legend>
          <label><input type="checkbox" name="Approvisionnement en produits consommables" value="Oui" /> Approvisionnement en produits consommables</label>
          <label><input type="checkbox" name="Équipement des locaux" value="Oui" /> Équipement des locaux</label>
        </fieldset>
        <label className="full-field">Services supplémentaires recherchés<textarea name="Services supplémentaires" rows={4} placeholder="Grand ménage, tapis, planchers, nettoyage après rénovation ou autre besoin…" /></label>
        <label className="full-field">Message<textarea name="Message" rows={6} placeholder="Ajoutez toute information utile concernant vos espaces ou vos attentes." /></label>
        <p className="photo-note full-field">Vous pourrez transmettre des photos des lieux directement par courriel lorsque nous communiquerons avec vous.</p>
        <button className="button" type="submit">Envoyer ma demande ↗</button>
      </form>
    </section>
    <Footer />
  </main>;
}
