"use client";

import { FormEvent, useRef, useState } from "react";
import styles from "./ReferralRequestForm.module.css";

type ReferralRequestFormProps = { offerName: string; offerSlug: string };

export default function ReferralRequestForm({ offerName, offerSlug }: ReferralRequestFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const submitting = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    submitting.current = true;
    setStatus("sending");
    setErrorMessage("");

    const formData = new FormData(form);
    const payload = {
      slug: offerSlug,
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      website: formData.get("website"),
    };

    try {
      const response = await fetch("/api/referral-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result: unknown = await response.json().catch(() => null);
      const responseBody =
        result && typeof result === "object" ? (result as { ok?: unknown; error?: unknown }) : null;

      if (!response.ok || responseBody?.ok !== true) {
        const message =
          typeof responseBody?.error === "string"
            ? responseBody.error
            : "Impossible d’envoyer votre demande pour le moment. Veuillez réessayer.";
        throw new Error(message);
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible d’envoyer votre demande pour le moment. Veuillez réessayer.",
      );
    } finally {
      submitting.current = false;
    }
  }

  if (status === "success") {
    return (
      <p className={styles.confirmation} role="status" aria-live="polite">
        Votre demande de parrainage pour {offerName} a bien été envoyée. Nous vous répondrons par e-mail.
      </p>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-busy={status === "sending"}>
      <div className={styles.intro}>
        <strong>Vous souhaitez profiter de cette offre ?</strong>
        <span>Demandez mon lien de parrainage</span>
      </div>
      <div className={styles.fields}>
        <label>
          Prénom
          <input name="firstName" autoComplete="given-name" maxLength={100} required type="text" />
        </label>
        <label>
          Nom
          <input name="lastName" autoComplete="family-name" maxLength={100} required type="text" />
        </label>
      </div>
      <label>
        E-mail
        <input name="email" autoComplete="email" maxLength={254} required type="email" />
      </label>
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={`referral-website-${offerSlug}`}>Ne pas remplir</label>
        <input id={`referral-website-${offerSlug}`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Envoi en cours…" : "Demander mon parrainage"} <span aria-hidden="true">→</span>
      </button>
      {status === "error" ? <p className={styles.error} role="alert">{errorMessage}</p> : null}
    </form>
  );
}
