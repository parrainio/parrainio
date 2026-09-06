"use client";

import { FormEvent, useState } from "react";
import styles from "./OfferChangeAlert.module.css";

/**
 * « 🔔 Être alerté si cette offre évolue » — CTA discret + formulaire compact.
 *
 * - l'offre concernée est explicitement identifiée dans le formulaire
 *   (« Vous serez alerté des évolutions de l'offre … ») ;
 * - consentement DÉDIÉ aux alertes, case décochée par défaut (jamais
 *   pré-cochée, jamais fusionnée avec une newsletter) ;
 * - états gérés : initial, formulaire ouvert, e-mail invalide, consentement
 *   absent, chargement, succès avec confirmation, succès sans SMTP,
 *   déjà inscrit, erreur (dont service non activé) ;
 * - aucune donnée personnelle superflue demandée ;
 * - le slug de l'offre courante est transmis au serveur, qui le revalide.
 */

type Status =
  | { kind: "closed" }
  | { kind: "open" }
  | { kind: "loading" }
  | { kind: "confirmation-pending" }
  | { kind: "pending-no-email" }
  | { kind: "already-subscribed" }
  | { kind: "error"; message: string };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function OfferChangeAlert({ slug, offerName }: { slug: string; offerName: string }) {
  const [status, setStatus] = useState<Status>({ kind: "closed" });
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  function openForm() {
    setStatus({ kind: "open" });
    setClientError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setClientError(null);

    const trimmed = email.trim();
    if (!emailPattern.test(trimmed)) {
      setClientError("Veuillez saisir une adresse e-mail valide.");
      return;
    }
    if (!consent) {
      setClientError("Veuillez cocher la case de consentement pour créer votre alerte.");
      return;
    }

    setStatus({ kind: "loading" });
    try {
      const response = await fetch("/api/alerts/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, email: trimmed, consent, website: "" }),
      });
      const payload = (await response.json().catch(() => ({}))) as { status?: string; error?: string };
      if (response.ok && payload.status === "already-subscribed") {
        setStatus({ kind: "already-subscribed" });
        return;
      }
      if (response.ok && payload.status === "confirmation-pending") {
        setStatus({ kind: "confirmation-pending" });
        return;
      }
      if (response.ok && payload.status === "pending-no-email") {
        setStatus({ kind: "pending-no-email" });
        return;
      }
      setStatus({ kind: "error", message: payload.error ?? "Une erreur est survenue. Veuillez réessayer." });
    } catch {
      setStatus({ kind: "error", message: "Une erreur est survenue. Veuillez réessayer." });
    }
  }

  if (status.kind === "closed") {
    return (
      <div className={styles.wrapper}>
        <button type="button" className={styles.cta} onClick={openForm}>
          <span aria-hidden="true">🔔</span> Être alerté si cette offre évolue
        </button>
      </div>
    );
  }

  if (status.kind === "confirmation-pending" || status.kind === "pending-no-email" || status.kind === "already-subscribed") {
    return (
      <div className={styles.wrapper}>
        <p className={styles.success} role="status">
          {status.kind === "confirmation-pending" && "✓ Vérifiez votre boîte mail pour confirmer votre alerte."}
          {status.kind === "pending-no-email" && "✓ Votre demande d'alerte est enregistrée."}
          {status.kind === "already-subscribed" && "Cette adresse est déjà inscrite à l'alerte pour cette offre."}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <p className={styles.intro}>Recevez un email si cette offre évolue.</p>
        <p className={styles.offerLine}>
          Vous serez alerté des évolutions de l&apos;offre <strong>{offerName}</strong>.
        </p>

        <label className={styles.fieldLabel} htmlFor="alert-email">
          Email
        </label>
        <input
          id="alert-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          className={styles.input}
          placeholder="votre adresse email"
          value={email}
          maxLength={254}
          onChange={(event) => setEmail(event.target.value)}
          disabled={status.kind === "loading"}
        />

        {/* Honeypot anti-spam : champ invisible, doit rester vide. */}
        <div className={styles.hp} aria-hidden="true">
          <label>
            Site web
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <label className={styles.consent}>
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            disabled={status.kind === "loading"}
          />
          <span>
            J’accepte que mon adresse email soit utilisée par Parrainio pour m’envoyer des alertes concernant l’évolution de cette offre.
          </span>
        </label>

        {clientError && (
          <p className={styles.error} role="alert">
            {clientError}
          </p>
        )}
        {status.kind === "error" && (
          <p className={styles.error} role="alert">
            {status.message}
          </p>
        )}

        <button type="submit" className={styles.submit} disabled={status.kind === "loading"}>
          {status.kind === "loading" ? "Envoi…" : "Créer mon alerte"}
        </button>

        <small className={styles.note}>
          Votre adresse est utilisée uniquement pour cette alerte. Vous pouvez vous désabonner à tout moment via le lien présent dans chaque email.
        </small>
      </form>
    </div>
  );
}
