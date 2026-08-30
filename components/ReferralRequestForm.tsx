"use client";

import { FormEvent, useState } from "react";
import styles from "./ReferralRequestForm.module.css";

export default function ReferralRequestForm({ offerName }: { offerName: string }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className={styles.confirmation}>
        Votre demande pour {offerName} est prête. La connexion à l&apos;envoi doit encore être configurée.
      </p>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.intro}>
        <strong>Vous souhaitez profiter de cette offre ?</strong>
        <span>Demandez mon lien de parrainage</span>
      </div>
      <div className={styles.fields}>
        <label>
          Prénom
          <input name="firstName" required type="text" />
        </label>
        <label>
          Nom
          <input name="lastName" required type="text" />
        </label>
      </div>
      <label>
        E-mail
        <input name="email" required type="email" />
      </label>
      <button type="submit">Demander mon parrainage <span aria-hidden="true">→</span></button>
      <small>Le formulaire est prêt à être relié au système de contact Parrainio.</small>
    </form>
  );
}
