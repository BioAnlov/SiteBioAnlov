import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { nav } from "../data/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Le menu se referme dès qu'on change de page.
  useEffect(() => setOpen(false), [pathname]);

  // Échap referme le menu.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className={open ? "site-header nav-open" : "site-header"}>
      <Link className="brand brand-logo" to="/" aria-label="BioAnlov — Accueil">
        <img src="/images/bioanlov-logo.png" alt="BioAnlov — Entretien ménager commercial" />
      </Link>
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="navigation-principale"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true" />
      </button>
      <nav id="navigation-principale" aria-label="Navigation principale">
        {nav.map(({ label, href }) => (
          <NavLink key={href} to={href} end={href === "/"} onClick={() => setOpen(false)}>
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
