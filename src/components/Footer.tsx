import { Link } from "react-router-dom";
import { site } from "../data/site";

export function Footer() {
  return (
    <footer>
      <Link className="brand brand-logo footer-logo" to="/" aria-label="BioAnlov — Accueil">
        <img src="/images/bioanlov-logo.png" alt="BioAnlov — Entretien ménager commercial" />
      </Link>
      <p>
        {site.tagline}
        <br />
        <a href={site.phoneHref}>{site.phone}</a> ·{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>
      <div>
        <Link to="/services">Services</Link>
        <Link to="/secteurs">Secteurs</Link>
        <Link to="/soumission">Soumission</Link>
      </div>
      <small>© {new Date().getFullYear()} BioAnlov. Tous droits réservés.</small>
    </footer>
  );
}
