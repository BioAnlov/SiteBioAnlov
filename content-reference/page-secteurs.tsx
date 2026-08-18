import { CTA, Footer, Header, PageHero } from "../components";

const sectors = [
  {
    id: "bureaux", title: "Immeubles et bureaux", image: "/images/bureaux.webp",
    items: ["Entrées et aires communes", "Corridors, escaliers et ascenseurs", "Bureaux et postes de travail dégagés", "Cuisines et salles de pause", "Sanitaires", "Tapis et planchers", "Poubelles, recyclage et compost"],
    note: "BioAnlov ne déplace pas les documents, les effets personnels ni les appareils électroniques présents sur les bureaux.",
  },
  {
    id: "cpe", title: "CPE et garderies", image: "/images/cpe.webp",
    items: ["Entrées et espaces communs", "Salles de jeux", "Tables et chaises", "Surfaces fréquemment touchées", "Espaces et zones de repas", "Sanitaires et tables à langer", "Tapis et planchers", "Poubelles et contenants sanitaires"],
    note: "La désinfection complète des jouets et le nettoyage des matelas de sieste sont ajoutés selon la fréquence convenue.",
  },
  {
    id: "restaurants", title: "Restaurants", image: "/images/restaurant.webp",
    items: ["Salle à manger", "Tables, chaises et banquettes", "Accueil et comptoirs accessibles", "Surfaces de préparation dégagées", "Éviers", "Planchers", "Sanitaires", "Déchets, recyclage et compost"],
    note: "Le nettoyage des hottes, conduits, friteuses et équipements démontables n’est pas compris dans l’entretien régulier.",
  },
];

export default function Sectors() {
  return <main><Header/><PageHero eyebrow="Nos secteurs" title="Un entretien adapté à chaque environnement." text="Les méthodes et la fréquence sont établies selon l’usage réel de votre établissement."/><section className="content-section sector-list detailed-sectors">{sectors.map((sector,index)=><article id={sector.id} key={sector.id} className={index%2?"reverse":""}><img src={sector.image} alt={`${sector.title} propre et bien entretenu`}/><div><span>0{index+1}</span><h2>{sector.title}</h2><ul>{sector.items.map(item=><li key={item}>✓ {item}</li>)}</ul><p className="sector-note">{sector.note}</p></div></article>)}</section><CTA/><Footer/></main>;
}
