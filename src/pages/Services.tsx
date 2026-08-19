import { CTA } from "../components/CTA";
import { PageHero } from "../components/PageHero";
import { usePageMeta } from "../hooks/usePageMeta";

type ServiceGroup = {
  title: string;
  intro?: string;
  items: string[];
  note?: string;
};

const groups: ServiceGroup[] = [
  {
    title: "Entretien ménager régulier",
    items: [
      "Époussetage des surfaces accessibles",
      "Vidage des poubelles, du recyclage et du compost",
      "Aspiration des tapis",
      "Balayage et lavage des planchers",
      "Désinfection des surfaces fréquemment touchées",
      "Entretien des cuisines et salles de pause",
      "Nettoyage et désinfection des sanitaires",
      "Remplissage des distributeurs",
    ],
  },
  {
    title: "Approvisionnement",
    intro: "Avec votre autorisation, BioAnlov peut fournir :",
    items: [
      "Papier hygiénique",
      "Papier essuie-mains",
      "Savon à mains",
      "Savon à vaisselle",
      "Assainissant",
      "Sacs à déchets, recyclage et compost",
    ],
    note: "Ces produits sont facturés séparément.",
  },
  {
    title: "Équipement des locaux",
    items: [
      "Distributeurs de savon",
      "Distributeurs de papier",
      "Poubelles",
      "Bacs de recyclage et de compost",
      "Contenants sanitaires",
      "Accessoires nécessaires à l’entretien",
    ],
  },
  {
    title: "Services spécialisés sur soumission",
    items: [
      "Grand ménage saisonnier ou ponctuel",
      "Nettoyage des tapis et meubles rembourrés",
      "Entretien approfondi des planchers",
      "Nettoyage après rénovation ou événement",
      "Nettoyage intérieur des électroménagers",
      "Autres travaux déterminés pendant la visite",
    ],
  },
];

export default function Services() {
  usePageMeta(
    "Services — BioAnlov",
    "Entretien ménager régulier, approvisionnement, équipement des locaux et services spécialisés sur soumission.",
  );

  return (
    <>
      <PageHero
        eyebrow="Nos services"
        title="Une base complète. Aucune zone oubliée"
        text="Chaque mandat est adapté à vos locaux, à votre horaire et à la fréquence souhaitée."
        image="/images/immeubles.webp"
        imageAlt="Immeuble commercial entretenu par BioAnlov"
      />
      <section className="content-section service-list detailed-services">
        {groups.map((group) => (
          <article key={group.title}>
            <h2>{group.title}</h2>
            {group.intro && <p className="service-intro">{group.intro}</p>}
            <ul>
              {group.items.map((item) => (
                <li key={item}>✓ {item}</li>
              ))}
            </ul>
            {group.note && <p className="service-note">{group.note}</p>}
          </article>
        ))}
      </section>
      <CTA />
    </>
  );
}
