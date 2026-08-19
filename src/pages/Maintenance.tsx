import { useEffect } from "react";
import { site } from "../data/site";
import { maintenance } from "../maintenance";
import { usePageMeta } from "../hooks/usePageMeta";

/** Page affichée à la place du site entier quand `maintenance.actif` est vrai. */
export default function Maintenance() {
  usePageMeta(`${site.name} — Site en entretien`, maintenance.sousTitre);

  // Empêche Google d'indexer la page d'entretien à la place du vrai contenu.
  useEffect(() => {
    const tag = document.createElement("meta");
    tag.name = "robots";
    tag.content = "noindex";
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  const sujet = encodeURIComponent("Demande de soumission");

  return (
    <main className="maintenance">
      <div className="maintenance-card">
        <img src="/images/bioanlov-logo-2026.png" alt="BioAnlov — Entretien ménager commercial" />
        <p className="eyebrow">
          <span />
          Site en entretien
        </p>
        <h1>{maintenance.titre}</h1>
        <p className="maintenance-lead">{maintenance.sousTitre}</p>
        {maintenance.retour && <p className="maintenance-back">Retour prévu : {maintenance.retour}</p>}

        <div className="maintenance-contact">
          <a href={site.phoneHref}>{site.phone}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>

        <a className="button" href={`mailto:${site.email}?subject=${sujet}`}>
          Demander une soumission ↗
        </a>
        <p className="maintenance-note">{site.tagline}</p>
      </div>
    </main>
  );
}
