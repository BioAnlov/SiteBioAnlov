import { Link, NavLink } from "react-router-dom";
import { nav } from "../data/site";

export function Header() {
  return (
    <header className="site-header">
      <Link className="brand brand-logo" to="/" aria-label="BioAnlov — Accueil">
        <img src="/images/bioanlov-logo.png" alt="BioAnlov — Entretien ménager commercial" />
      </Link>
      <nav aria-label="Navigation principale">
        {nav.map(({ label, href }) => (
          <NavLink key={href} to={href} end={href === "/"}>
            {label}
          </NavLink>
        ))}
      </nav>
      <Link className="button button-small" to="/soumission">
        Demander une visite
      </Link>
    </header>
  );
}
