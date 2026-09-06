"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import styles from "./page.module.css";
import { REVIEW_TEXT_MAX_LENGTH, REVIEW_PSEUDO_MAX_LENGTH } from "@/lib/reviewLimits";

export type ReviewFormOffer = { slug: string; name: string };

type Status = "idle" | "sending" | "sent" | "error";

export default function ReviewForm({ offers }: { offers: ReviewFormOffer[] }) {
  const pseudoId = useId();
  const offerId = useId();
  const textId = useId();
  const consentId = useId();

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [rating, setRating] = useState(10);
  const [ratingTouched, setRatingTouched] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const website = String(formData.get("website") ?? "");
    if (website) return; // honeypot — silently drop bot submissions

    if (!ratingTouched) {
      setErrorMessage("Veuillez choisir une note entre 1 et 10.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrorMessage("");
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website,
          pseudo: String(formData.get("pseudo") ?? ""),
          rating,
          text: String(formData.get("text") ?? ""),
          offerSlug: String(formData.get("offerSlug") ?? "") || null,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (response.ok && payload?.ok) {
        setStatus("sent");
        form.reset();
        setRating(10);
        setRatingTouched(false);
      } else {
        setErrorMessage(
          payload?.error ??
            "Impossible d’envoyer votre avis pour le moment. Veuillez réessayer dans quelques instants."
        );
        setStatus("error");
      }
    } catch {
      setErrorMessage(
        "Impossible d’envoyer votre avis pour le moment. Veuillez réessayer dans quelques instants."
      );
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className={styles.formCard} role="status">
        <p className={styles.formSuccessTitle}>Merci, votre avis a bien été envoyé !</p>
        <p className={styles.formSuccessText}>
          Il sera publié après validation, conformément à nos{" "}
          <a href="#regles-de-publication">règles de publication</a>.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.formCard} onSubmit={handleSubmit} noValidate>
      <div className={styles.formRow}>
        <div className={styles.formField}>
          <label htmlFor={pseudoId}>Pseudo *</label>
          <input
            id={pseudoId}
            name="pseudo"
            type="text"
            required
            maxLength={REVIEW_PSEUDO_MAX_LENGTH}
            autoComplete="off"
            placeholder="Votre pseudo public"
          />
        </div>
        <div className={styles.formField}>
          <label htmlFor={offerId}>Offre concernée (optionnel)</label>
          <select id={offerId} name="offerSlug" defaultValue="">
            <option value="">— Aucune offre sélectionnée —</option>
            {offers.map((offer) => (
              <option key={offer.slug} value={offer.slug}>
                {offer.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className={styles.ratingFieldset}>
        <legend>Votre note (1 à 10) *</legend>
        <div className={styles.ratingRow}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
            <label
              key={value}
              className={rating === value ? styles.ratingLabelActive : styles.ratingLabel}
            >
              <input
                type="radio"
                name="rating"
                value={value}
                checked={rating === value}
                onChange={() => {
                  setRating(value);
                  setRatingTouched(true);
                }}
              />
              {value}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.formField}>
        <label htmlFor={textId}>Votre avis *</label>
        <textarea
          id={textId}
          name="text"
          required
          rows={5}
          maxLength={REVIEW_TEXT_MAX_LENGTH}
          placeholder="Racontez votre expérience de parrainage…"
        />
      </div>

      <div className={styles.formField}>
        <label className={styles.consentLabel} htmlFor={consentId}>
          <input id={consentId} name="consent" type="checkbox" required />
          <span>J’accepte la publication de cet avis sur Parrainio.</span>
        </label>
      </div>

      {/* Honeypot (hidden from humans, filled by bots) */}
      <p className={styles.honeypot} aria-hidden="true">
        <label htmlFor="review-website">Ne pas remplir</label>
        <input id="review-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </p>

      {status === "error" && errorMessage ? (
        <p className={styles.formError} role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button className={styles.submitButton} type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Envoi…" : "Envoyer mon avis"}
      </button>
    </form>
  );
}
