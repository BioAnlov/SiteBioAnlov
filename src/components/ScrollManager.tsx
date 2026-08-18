import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Remet la page en haut à chaque changement de route et gère les ancres
 * (ex. /secteurs#cpe).
 *
 * Au premier chargement, les images ne sont pas encore mises en page quand
 * l'effet s'exécute : le document est trop court et le défilement demandé se
 * retrouve tronqué. On réajuste donc à quelques reprises, ainsi qu'au
 * chargement complet de la page, jusqu'à ce que l'ancre soit réellement
 * atteinte — et on s'arrête dès que le visiteur défile lui-même.
 */
const RETRY_DELAYS = [0, 60, 150, 300, 600, 1000, 1600];

export function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const target = hash ? document.querySelector(hash) : null;

    if (!target) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      return;
    }

    const timers: number[] = [];
    let cancelled = false;

    const userEvents = ["wheel", "touchstart", "keydown"] as const;

    const cleanup = () => {
      cancelled = true;
      for (const timer of timers) window.clearTimeout(timer);
      window.removeEventListener("load", align);
      for (const type of userEvents) window.removeEventListener(type, cleanup);
    };

    function align() {
      if (cancelled) return;

      const offset = Number.parseFloat(getComputedStyle(target!).scrollMarginTop) || 0;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

      // Position visée si le document avait déjà sa hauteur définitive…
      const desired = Math.max(0, target!.getBoundingClientRect().top + window.scrollY - offset);
      // …et ce qu'il est réellement possible d'atteindre pour l'instant.
      const reachable = Math.min(desired, maxScroll);

      if (Math.abs(window.scrollY - reachable) > 1) {
        window.scrollTo({ top: reachable, left: 0, behavior: "instant" as ScrollBehavior });
      }

      // Une fois l'ancre atteinte, plus rien à corriger.
      if (Math.abs(window.scrollY - desired) <= 1) cleanup();
    }

    for (const delay of RETRY_DELAYS) {
      timers.push(window.setTimeout(align, delay));
    }
    if (document.readyState !== "complete") window.addEventListener("load", align);
    for (const type of userEvents) {
      window.addEventListener(type, cleanup, { passive: true });
    }

    return cleanup;
  }, [pathname, hash]);

  return null;
}
