import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { PageHero } from "../components/PageHero";
import { usePageMeta } from "../hooks/usePageMeta";
import { site } from "../data/site";
import {
  ACCEPTED_TYPES,
  MAX_PHOTOS,
  MAX_PHOTO_BYTES,
  describeSize,
  preparePhotos,
  validateSelection,
  type PreparedPhoto,
} from "../lib/photos";

type Status = "idle" | "sending" | "success" | "error";

export default function Quote() {
  usePageMeta(
    "Demande de soumission — BioAnlov",
    "Remplissez le formulaire pour que BioAnlov puisse planifier une visite et préparer votre soumission.",
  );

  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoError, setPhotoError] = useState("");

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const { accepted, error } = validateSelection(photos, Array.from(event.target.files ?? []));
    setPhotos(accepted);
    setPhotoError(error);
    // Vidé pour que le visiteur puisse rechoisir un fichier qu'il vient de retirer.
    event.target.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((current) => current.filter((_, i) => i !== index));
    setPhotoError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const formData = new FormData(event.currentTarget);
    const payload: Record<string, string | boolean | PreparedPhoto[]> = {};
    for (const [key, value] of formData.entries()) {
      if (typeof value !== "string") continue;
      payload[key] = value.trim();
    }
    payload.approvisionnement = formData.get("approvisionnement") === "on";
    payload.equipement = formData.get("equipement") === "on";

    setStatus("sending");
    setErrorMessage("");

    try {
      if (photos.length > 0) {
        payload.photos = await preparePhotos(photos);
      }

      const response = await fetch("/api/soumission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "L’envoi a échoué. Veuillez réessayer.");
      }

      formRef.current?.reset();
      setPhotos([]);
      setPhotoError("");
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : "L’envoi a échoué. Veuillez réessayer.",
      );
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Soumission"
        title="Demande de soumission"
        text="Chaque soumission est préparée selon les caractéristiques de vos locaux et vos besoins. Remplissez ce formulaire afin que BioAnlov puisse communiquer avec vous et planifier une visite."
      />
      <section className="content-section quote-layout detailed-quote">
        <div className="quote-summary">
          <h2>Parlez-nous de vos locaux</h2>
          <p>
            Ces renseignements nous aideront à préparer la visite et à mieux évaluer vos besoins.
          </p>
          <strong>{site.email}</strong>
          <br />
          <a href={site.phoneHref}>{site.phone}</a>
        </div>

        {status === "success" ? (
          <div className="quote-sent" role="status" aria-live="polite">
            <span className="sent-mark" aria-hidden="true">
              ✓
            </span>
            <h2>Votre demande a bien été envoyée</h2>
            <p>
              Merci. Un courriel vient d’être transmis à l’équipe BioAnlov. Nous communiquerons
              avec vous afin de convenir d’une visite de vos locaux.
            </p>
            <p>
              Les demandes sont traitées du lundi au vendredi, de 8 h à 17 h. Pour une question
              urgente, joignez-nous au <a href={site.phoneHref}>{site.phone}</a>.
            </p>
            <div className="quote-sent-actions">
              <button className="button" type="button" onClick={() => setStatus("idle")}>
                Envoyer une autre demande
              </button>
              <a className="button secondary-button" href={site.phoneHref}>
                Appeler BioAnlov
              </a>
            </div>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit}>
            <label>
              Nom de l’entreprise <span className="required-mark">*</span>
              <input name="entreprise" required autoComplete="organization" />
            </label>
            <label>
              Personne responsable <span className="required-mark">*</span>
              <input name="responsable" required autoComplete="name" />
            </label>
            <label>
              Courriel <span className="required-mark">*</span>
              <input name="courriel" type="email" required autoComplete="email" />
            </label>
            <label>
              Téléphone <span className="required-mark">*</span>
              <input name="telephone" type="tel" required autoComplete="tel" />
            </label>
            <label className="full-field">
              Adresse des locaux <span className="required-mark">*</span>
              <input name="adresse" required autoComplete="street-address" />
            </label>
            <label>
              Type d’établissement <span className="required-mark">*</span>
              <select name="typeEtablissement" defaultValue="" required>
                <option value="" disabled>
                  Choisir une option
                </option>
                <option>Immeuble ou bureaux</option>
                <option>CPE ou garderie</option>
                <option>Restaurant</option>
                <option>Autre établissement commercial</option>
              </select>
            </label>
            <label>
              Superficie approximative
              <input name="superficie" placeholder="Ex. 2 500 pi²" />
            </label>
            <label>
              Nombre de bureaux ou de locaux
              <input name="nbBureaux" type="number" min="0" />
            </label>
            <label>
              Nombre de cuisines
              <input name="nbCuisines" type="number" min="0" />
            </label>
            <label>
              Nombre de sanitaires
              <input name="nbSanitaires" type="number" min="0" />
            </label>
            <label>
              Fréquence souhaitée
              <select name="frequence" defaultValue="">
                <option value="">À déterminer</option>
                <option>Une fois par semaine</option>
                <option>Deux à trois fois par semaine</option>
                <option>Chaque jour ouvrable</option>
                <option>Besoin ponctuel</option>
              </select>
            </label>
            <label>
              Journées ou heures préférées
              <input name="horaires" placeholder="Ex. vendredi soir" />
            </label>
            <label>
              Date souhaitée pour la visite
              <input name="dateVisite" type="date" />
            </label>

            <fieldset className="quote-options">
              <legend>Besoins complémentaires</legend>
              <label>
                <input type="checkbox" name="approvisionnement" /> Approvisionnement en produits
                consommables
              </label>
              <label>
                <input type="checkbox" name="equipement" /> Équipement des locaux
              </label>
            </fieldset>

            <label className="full-field">
              Services supplémentaires recherchés
              <textarea
                name="servicesSupplementaires"
                rows={4}
                placeholder="Grand ménage, tapis, planchers, nettoyage après rénovation ou autre besoin…"
              />
            </label>
            <label className="full-field">
              Message
              <textarea
                name="message"
                rows={6}
                placeholder="Ajoutez toute information utile concernant vos espaces ou vos attentes."
              />
            </label>

            {/* Champ piège anti-pourriel : invisible pour les visiteurs. */}
            <input
              type="text"
              name="siteWeb"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
            />

            <div className="photo-field full-field">
              <span className="photo-field-label">Photos des lieux</span>
              <span className="field-hint">
                Facultatif — JPEG ou PNG, jusqu’à {MAX_PHOTOS} photos de{" "}
                {describeSize(MAX_PHOTO_BYTES)} chacune
              </span>
              <input
                id="photos"
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                multiple
                onChange={handlePhotoChange}
                disabled={status === "sending"}
              />
              <p className="photo-note">
                Des photos de vos espaces nous aident à évaluer vos besoins avant la visite. Elles
                sont jointes directement à votre demande.
              </p>

              {photos.length > 0 && (
                <ul className="photo-list">
                  {photos.map((photo, index) => (
                    <li key={`${photo.name}-${photo.size}`}>
                      <span className="photo-name">{photo.name}</span>
                      <span className="photo-size">{describeSize(photo.size)}</span>
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        disabled={status === "sending"}
                        aria-label={`Retirer ${photo.name}`}
                      >
                        Retirer
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {photoError && (
                <p className="photo-error" role="alert">
                  {photoError}
                </p>
              )}
            </div>

            {status === "error" && (
              <p className="form-status error" role="alert">
                <strong>L’envoi n’a pas fonctionné.</strong>
                {errorMessage} Vous pouvez aussi nous écrire à{" "}
                <a href={`mailto:${site.email}`}>{site.email}</a> ou appeler au{" "}
                <a href={site.phoneHref}>{site.phone}</a>.
              </p>
            )}

            <button className="button" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Envoi en cours…" : "Envoyer ma demande ↗"}
            </button>
          </form>
        )}
      </section>
    </>
  );
}
