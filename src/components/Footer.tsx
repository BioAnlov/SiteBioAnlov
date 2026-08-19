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
        <span className="footer-social">
          <a
            href={site.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="BioAnlov sur Facebook"
            title="Facebook"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
              <path
                fill="currentColor"
                d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.91h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94Z"
              />
            </svg>
          </a>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="BioAnlov sur Instagram"
            title="Instagram"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
              <rect
                x="2.8"
                y="2.8"
                width="18.4"
                height="18.4"
                rx="5.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
              />
              <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.9" />
              <circle cx="17.3" cy="6.7" r="1.3" fill="currentColor" />
            </svg>
          </a>
        </span>
      </div>
      <small>© {new Date().getFullYear()} BioAnlov. Tous droits réservés.</small>
    </footer>
  );
}
