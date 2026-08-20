import type { VercelRequest } from "@vercel/node";

/**
 * Limite de fréquence par adresse IP, partagée par les formulaires.
 *
 * Seuls les courriels réellement transmis sont comptés : une réponse
 * anti-robot ratée ou un champ mal rempli ne consomme aucune place, afin
 * qu'un visiteur qui se reprend ne se retrouve pas bloqué.
 *
 * Le compteur vit en mémoire de l'instance ; il freine les rafales, sans
 * remplacer un vrai stockage partagé (voir README).
 */

const FENETRE_MS = 10 * 60 * 1000;
const MAX_ENVOIS = 3;

/** Adresse du visiteur derrière le proxy de Vercel. */
function adresseIp(req: VercelRequest): string {
  const entete = req.headers["x-forwarded-for"];
  const brut = Array.isArray(entete) ? entete[0] : entete;
  return (brut?.split(",")[0] || req.socket?.remoteAddress || "inconnue").trim();
}

/**
 * Crée un compteur indépendant. Chaque formulaire appelle cette fonction une
 * fois : ainsi une demande de soumission n'épuise pas le quota du formulaire
 * de contact, et inversement.
 */
export function creerLimite(max = MAX_ENVOIS, fenetreMs = FENETRE_MS) {
  const historique = new Map<string, number[]>();

  /** Envois de cette adresse encore dans la fenêtre, les plus anciens écartés. */
  function envoisRecents(ip: string, maintenant: number): number[] {
    return (historique.get(ip) || []).filter((t) => maintenant - t < fenetreMs);
  }

  return {
    /**
     * Vrai si le quota d'envois est déjà atteint. Ne consomme rien : appeler
     * cette fonction ne rapproche jamais un visiteur du blocage.
     */
    bloque(req: VercelRequest): boolean {
      const ip = adresseIp(req);
      const recents = envoisRecents(ip, Date.now());
      // Au passage, on oublie les adresses dont la fenêtre est écoulée.
      if (recents.length === 0) historique.delete(ip);
      else historique.set(ip, recents);
      return recents.length >= max;
    },

    /** À appeler une fois le courriel réellement transmis. */
    enregistrer(req: VercelRequest): void {
      const ip = adresseIp(req);
      const maintenant = Date.now();
      const recents = envoisRecents(ip, maintenant);
      recents.push(maintenant);
      historique.set(ip, recents);
    },
  };
}
