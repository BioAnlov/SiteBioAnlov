import { Link } from "react-router-dom";
import { CTA } from "../components/CTA";
import { usePageMeta } from "../hooks/usePageMeta";

const sectorCards = [
  {
    number: "01",
    title: "Immeubles et bureaux",
    text: "Espaces de travail, aires communes, cuisines et sanitaires.",
    href: "/secteurs#bureaux",
  },
  {
    number: "02",
    title: "CPE et garderies",
    text: "Entretien adapté aux milieux fréquentés par les enfants.",
    href: "/secteurs#cpe",
  },
  {
    number: "03",
    title: "Restaurants",
    text: "Salles à manger, accueil et zones convenues avec votre équipe.",
    href: "/secteurs#restaurants",
  },
];

const steps = [
  ["1", "Visite des lieux", "Nous observons vos espaces et vos besoins."],
  ["2", "Soumission personnalisée", "Nous confirmons les tâches, la fréquence et le prix."],
  ["3", "Mise en service", "Nous validons l’horaire, les accès et les consignes."],
  ["4", "Suivi de qualité", "Nous assurons un service constant et bien encadré."],
];

export default function Home() {
  usePageMeta(
    "BioAnlov — Entretien ménager commercial",
    "Des espaces propres, sains et accueillants. BioAnlov prend soin de vos bureaux, CPE, garderies et restaurants avec rigueur et constance.",
  );

  return (
    <>
      <section className="home-hero">
        <div>
          <p className="eyebrow">
            <span />
            Entretien professionnel · Service personnalisé
          </p>
          <h1>
            Des espaces propres, <em>sains</em> et accueillants
          </h1>
          <p>
            BioAnlov prend soin de vos lieux avec rigueur, constance et une approche adaptée à
            votre réalité.
          </p>
          <div className="actions">
            <Link className="button" to="/soumission">
              Obtenir une soumission ↗
            </Link>
            <Link className="text-link" to="/services">
              Découvrir nos services →
            </Link>
          </div>
        </div>
        <img src="/images/bureaux.webp" alt="Bureau moderne propre et lumineux" />
      </section>

      <section className="home-intro">
        <p className="eyebrow">
          <span />
          Nos secteurs
        </p>
        <h2>Un service pensé pour votre milieu</h2>
        <div className="three-cards">
          {sectorCards.map((card) => (
            <Link key={card.href} to={card.href}>
              <b>{card.number}</b>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <span>Voir le secteur →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-split">
        <img src="/images/garderie.webp" alt="Garderie propre et bien entretenue" />
        <div>
          <p className="eyebrow">
            <span />
            Notre engagement
          </p>
          <h2>Une propreté qui se remarque</h2>
          <p>Des méthodes claires, des tâches confirmées et un suivi de qualité constant.</p>
          <Link className="text-link" to="/a-propos">
            Découvrir BioAnlov →
          </Link>
        </div>
      </section>

      <section className="content-section process home-process">
        <div className="process-heading">
          <p className="eyebrow">
            <span />
            Fonctionnement
          </p>
          <h2>Quatre étapes simples</h2>
          <p>
            De votre première demande au suivi régulier, vous savez toujours ce qui vient ensuite.
          </p>
        </div>
        <div className="process-grid">
          {steps.map(([number, title, text]) => (
            <article key={number}>
              <b>{number}</b>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <Link className="text-link process-link" to="/a-propos">
          En savoir plus sur notre approche →
        </Link>
      </section>

      <CTA />
    </>
  );
}
