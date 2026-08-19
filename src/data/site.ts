export const site = {
  name: "BioAnlov",
  email: "info@bioanlov.com",
  phone: "(514) 447-4195",
  phoneHref: "tel:+15144474195",
  territory: "Île de Montréal, Laval, Lanaudière et Rive-Sud",
  hours: "Du lundi au vendredi, de 8 h à 17 h",
  tagline: "Immeubles et bureaux · CPE et garderies · Restaurants",
  facebook: "https://www.facebook.com/share/19ESbh113j/",
  instagram: "https://www.instagram.com/bioanlov.entretien",
} as const;

export const nav = [
  { label: "Accueil", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Secteurs", href: "/secteurs" },
  { label: "À propos", href: "/a-propos" },
  { label: "Soumission", href: "/soumission" },
  { label: "Contact", href: "/contact" },
] as const;
