"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/app/admin/actions";
import styles from "./login.module.css";

export default function LoginForm({ configured }: { configured: boolean }) {
  const [state, action] = useActionState(loginAdmin, null);

  return (
    <form action={action} className={styles.card}>
      <p className={styles.kicker}>Parrainio</p>
      <h1>Administration</h1>
      <p className={styles.lead}>
        Espace privé pour gérer les 120 offres. Il n’apparaît pas dans la navigation du site.
      </p>
      {configured ? (
        <>
          <label>
            Mot de passe
            <input autoFocus name="password" required type="password" />
          </label>
          {state?.error ? <p className={styles.error}>{state.error}</p> : null}
          <button type="submit">Entrer</button>
        </>
      ) : (
        <p className={styles.setup}>
          Ajoutez <code>PARRAINIO_ADMIN_PASSWORD</code> et{" "}
          <code>PARRAINIO_ADMIN_SESSION_SECRET</code> dans <code>.env.local</code>{" "}
          pour activer cet espace.
        </p>
      )}
    </form>
  );
}
