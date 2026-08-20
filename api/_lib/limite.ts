import type { VercelRequest } from "@vercel/node";

/**
 * Limite de fréquence par adresse IP, partagée par les formulaires.
 * Le compteur vit en mémoire de l'instance ; il freine les rafales, sans
 * remplacer un vrai stockage partagé (voir README).
 */

const FENETRE_MS = 10 * 60 * 1000;
const MAX_DEMANDES = 3;

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
export function creerLimite(max = MAX_DEMANDES, fenetreMs = FENETRE_MS) {
  const historique = new Map<string, number[]>();

  return function tropDeDemandes(req: VercelRequest): boolean {
    const ip = adresseIp(req);
    const maintenant = Date.now();
    const recentes = (historique.get(ip) || []).filter((t) => maintenant - t < fenetreMs);
    if (recentes.length >= max) {
      historique.set(ip, recentes);
      return true;
    }
    recentes.push(maintenant);
    historique.set(ip, recentes);
    return false;
  };
}
