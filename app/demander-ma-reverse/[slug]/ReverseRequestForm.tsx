"use client";

import { FormEvent, useState } from "react";
import styles from "./page.module.css";

export default function ReverseRequestForm({ offerSlug, offerName }: { offerSlug: string; offerName: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("RIB");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSending(true);
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/reverse-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: offerSlug,
          firstName: form.get("firstName"),
          lastName: form.get("lastName"),
          email: form.get("email"),
          reference: form.get("reference"),
          paymentMethod: form.get("paymentMethod"),
          paymentCoordinate: form.get("paymentCoordinate"),
          message: form.get("message"),
          website: form.get("website"),
        }),
      });

      if (!response.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Impossible d’envoyer votre demande pour le moment. Veuillez réessayer dans quelques instants.");
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <div className={styles.confirmation}>
        <h1>✅ Demande envoyée !</h1>
        <p>Votre demande de reverse a bien été transmise à Parrainio. Nous allons vérifier votre parrainage et revenir vers vous.</p>
      </div>
    );
  }

  return (
    <>
      <span className={styles.kicker}>Parrainio · {offerName}</span>
      <h1>Demander ma reverse Parrainio</h1>
      <p className={styles.intro}>Merci d’avoir utilisé Parrainio ! Remplissez ce formulaire pour nous transmettre votre demande de reverse.</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fields}>
          <label>Prénom<input name="firstName" required /></label>
          <label>Nom<input name="lastName" required /></label>
        </div>
        <label>Adresse e-mail<input name="email" required type="email" /></label>
        <label>Offre concernée<input value={offerName} readOnly /></label>
        <label>Numéro de contrat / référence (optionnel)<input name="reference" /></label>
        <fieldset>
          <legend>Mode de paiement</legend>
          <label className={styles.choice}><input type="radio" name="paymentMethod" value="RIB" checked={paymentMethod === "RIB"} onChange={() => setPaymentMethod("RIB")} />RIB</label>
          <label className={styles.choice}><input type="radio" name="paymentMethod" value="PayPal" checked={paymentMethod === "PayPal"} onChange={() => setPaymentMethod("PayPal")} />PayPal</label>
          <label className={styles.choice}><input type="radio" name="paymentMethod" value="Autre" checked={paymentMethod === "Autre"} onChange={() => setPaymentMethod("Autre")} />Autre</label>
        </fieldset>
        <label>Coordonnées de paiement (optionnel)<input name="paymentCoordinate" /><small>Vous pouvez les renseigner maintenant ou nous les transmettre plus tard si nécessaire.</small></label>
        <label>Message (optionnel)<textarea name="message" rows={4} /></label>
        <input className={styles.honeypot} name="website" tabIndex={-1} autoComplete="off" />
        {error ? <p className={styles.error} role="alert">{error}</p> : null}
        <button type="submit" disabled={sending}>{sending ? "Envoi en cours…" : "Envoyer ma demande →"}</button>
      </form>
    </>
  );
}
