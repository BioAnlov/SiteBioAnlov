import { CTA } from "../components/CTA";
import { PageHero } from "../components/PageHero";
import { usePageMeta } from "../hooks/usePageMeta";

type Sector = {
  id: string;
  title: string;
  image: string;
  establishments?: string[];
  items: string[];
  note: string;
};

const sectors: Sector[] = [
  {
    id: "bureaux",
    title: "Immeubles et bureaux",
    image: "/images/bureaux.webp",
    establishments: [
      "Édifices à bureaux",
      "Édifices publics et parapublics",
      "Petites et grandes entreprises",
      "Immeubles en copropriété",
      "OBNL",
    ],
    items: [
      "Entrées et aires communes",
      "Corridors, escaliers et ascenseurs",
      "Bureaux et postes de travail dégagés",
      "Cuisines et salles de pause",
      "Sanitaires",
      "Tapis et planchers",
      "Poubelles, recyclage et compost",
    ],
    note: "BioAnlov ne déplace pas les documents, les effets personnels ni les appareils électroniques présents sur les bureaux.",
  },
  {
    id: "cpe",
    title: "CPE et garderies",
    image: "/images/cpe.webp",
    items: [
      "Entrées et espaces communs",
      "Salles de jeux",
      "Tables et chaises",
      "Surfaces fréquemment touchées",
      "Espaces et zones de repas",
      "Sanitaires et tables à langer",
      "Tapis et planchers",
      "Poubelles et contenants sanitaires",
    ],
    note: "La désinfection complète des jouets et le nettoyage des matelas de sieste sont ajoutés selon la fréquence convenue.",
  },
  {
    id: "restaurants",
    title: "Restaurants",
    image: "/images/restaurant.webp",
    items: [
      "Salle à manger",
      "Tables, chaises et banquettes",
      "Accueil et comptoirs accessibles",
      "Surfaces de préparation dégagées",
      "Éviers",
      "Planchers",
      "Sanitaires",
      "Déchets, recyclage et compost",
    ],
    note: "Le nettoyage des hottes, conduits, friteuses et équipements démontables n’est pas compris dans l’entretien régulier.",
  },
];

export default function Sectors() {
  usePageMeta(
    "Secteurs — BioAnlov",
    "Un entretien adapté à chaque environnement : immeubles et bureaux, CPE et garderies, restaurants.",
  );

  return (
    <>
      <PageHero
        eyebrow="Nos secteurs"
        title="Un entretien adapté à chaque environnement"
        text="Les méthodes et la fréquence sont établies selon l’usage réel de votre établissement."
      />
      <section className="content-section sector-list detailed-sectors">
        {sectors.map((sector, index) => (
          <article id={sector.id} key={sector.id} className={index % 2 ? "reverse" : ""}>
            <img src={sector.image} alt={`${sector.title} propre et bien entretenu`} />
            <div>
              <span>0{index + 1}</span>
              <h2>{sector.title}</h2>
              {sector.establishments && (
                <div className="sector-establishments">
                  <h3>Établissements desservis</h3>
                  <ul>
                    {sector.establishments.map((place) => (
                      <li key={place}>{place}</li>
                    ))}
                  </ul>
                </div>
              )}
              <h3 className="zones-title">Zones entretenues</h3>
              <ul className="sector-zones">
                {sector.items.map((item) => (
                  <li key={item}>✓ {item}</li>
                ))}
              </ul>
              <p className="sector-note">{sector.note}</p>
            </div>
          </article>
        ))}
      </section>
      <CTA />
    </>
  );
}
