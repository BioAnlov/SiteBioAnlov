import { Link } from "react-router-dom";
import { PageHero } from "../components/PageHero";
import { usePageMeta } from "../hooks/usePageMeta";

export default function NotFound() {
  usePageMeta("Page introuvable — BioAnlov", "Cette page n’existe pas ou a été déplacée.");

  return (
    <>
      <PageHero
        eyebrow="Erreur 404"
        title="Cette page est introuvable."
        text="Le lien est peut-être désuet ou la page a été déplacée. Revenez à l’accueil ou consultez nos services."
      />
      <section className="content-section">
        <div className="contact-actions" style={{ marginTop: 0 }}>
          <Link className="button" to="/">
            Retour à l’accueil
          </Link>
          <Link className="button secondary-button" to="/services">
            Voir les services
          </Link>
          <Link className="button secondary-button" to="/soumission">
            Demander une soumission
          </Link>
        </div>
      </section>
    </>
  );
}
