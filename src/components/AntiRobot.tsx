import { useState } from "react";

/**
 * Question anti-robot partagée par les formulaires de soumission et de contact :
 * deux nombres tirés au hasard, dont la somme est demandée au visiteur.
 * La vérification qui compte est celle du serveur (`api/_lib/antiRobot.ts`) ;
 * celle d'ici évite seulement un aller-retour inutile.
 */

export const MESSAGE_ANTI_ROBOT = "La réponse à la question anti-robot est incorrecte.";

/** Bornes du tirage. Elles doivent rester alignées sur `api/_lib/antiRobot.ts`. */
const MIN = 1;
const MAX = 8;

function nouveauCalcul() {
  const tirer = () => MIN + Math.floor(Math.random() * (MAX - MIN + 1));
  return { a: tirer(), b: tirer() };
}

export function useAntiRobot() {
  const [calcul, setCalcul] = useState(nouveauCalcul);

  return {
    /** Le champ à placer dans le formulaire. */
    champ: (
      <label className="anti-robot full-field">
        Question anti-robot : combien font {calcul.a} + {calcul.b} ?{" "}
        <span className="required-mark">*</span>
        <input
          type="text"
          name="antiRobot"
          inputMode="numeric"
          autoComplete="off"
          required
          placeholder="Votre réponse"
        />
        <small className="field-hint">Cette question nous protège des envois automatisés.</small>
      </label>
    ),

    /** Les deux nombres à joindre à l'envoi, pour que le serveur refasse le calcul. */
    nombres: { antiRobotA: String(calcul.a), antiRobotB: String(calcul.b) },

    /** Vérifie la réponse saisie par le visiteur. */
    verifier(reponse: unknown): boolean {
      const saisie = String(reponse ?? "").trim();
      return saisie !== "" && Number(saisie) === calcul.a + calcul.b;
    },

    /** Nouveau tirage, à appeler après un envoi réussi. */
    renouveler() {
      setCalcul(nouveauCalcul());
    },
  };
}
