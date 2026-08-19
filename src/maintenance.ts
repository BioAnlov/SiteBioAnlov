/**
 * Mode maintenance — page « Site en construction ».
 *
 * Pour AFFICHER la page d'entretien : mettre `actif: true`.
 * Pour REMETTRE le site normal      : mettre `actif: false`.
 *
 * Aucune page n'est supprimée : tout le site reste en place derrière.
 * Les textes ci-dessous se modifient librement.
 */
export const maintenance = {
  actif: false,

  /** Titre principal affiché en gros. */
  titre: "Notre site est temporairement en entretien",

  /** Phrase de rassurance sous le titre. */
  sousTitre: "Nous revenons bientôt",

  /** Date de retour. Laisser "" pour ne rien afficher. */
  retour: "",
};
