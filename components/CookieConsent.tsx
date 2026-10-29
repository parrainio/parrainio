"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  COOKIE_CONSENT_KEY,
  COOKIE_CONSENT_UPDATED_EVENT,
  COOKIE_STORAGE_ERROR,
  COOKIE_SETTINGS_EVENT,
  createCookieConsentRecord,
  getCookieConsentSnapshot,
  getServerCookieConsentSnapshot,
  parseCookieConsentRecord,
  subscribeToCookieConsent,
  type CookieConsentDecision,
} from "@/lib/cookieConsent";
import styles from "./CookieConsent.module.css";

export default function CookieConsent() {
  const snapshot = useSyncExternalStore(
    subscribeToCookieConsent,
    getCookieConsentSnapshot,
    getServerCookieConsentSnapshot,
  );
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [writeError, setWriteError] = useState(false);

  useEffect(() => {
    const openSettings = () => {
      setSettingsOpen(true);
      setDetailsOpen(true);
    };
    window.addEventListener(COOKIE_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, openSettings);
  }, []);

  function saveDecision(decision: CookieConsentDecision) {
    const record = createCookieConsentRecord(decision);
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(record));
      setWriteError(false);
      window.dispatchEvent(new Event(COOKIE_CONSENT_UPDATED_EVENT));
      setSettingsOpen(false);
      setDetailsOpen(false);
    } catch {
      setWriteError(true);
    }
  }

  const consent =
    snapshot && snapshot !== COOKIE_STORAGE_ERROR
      ? parseCookieConsentRecord(snapshot)
      : null;
  const storageError = snapshot === COOKIE_STORAGE_ERROR || writeError;
  const consentExpiresAt = consent?.expiresAt;

  useEffect(() => {
    if (!consentExpiresAt) return;

    const timeout = window.setTimeout(() => {
      window.dispatchEvent(new Event(COOKIE_CONSENT_UPDATED_EVENT));
    }, Math.max(0, consentExpiresAt - Date.now()) + 1);

    return () => window.clearTimeout(timeout);
  }, [consentExpiresAt]);

  if (snapshot === null || (consent && !settingsOpen)) return null;

  const isInitialChoice = !consent;

  return (
    <aside
      className={styles.panel}
      aria-labelledby="cookie-consent-title"
    >
      <div className={styles.content}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Vos choix de confidentialité</p>
          <h2 id="cookie-consent-title">
            {isInitialChoice ? "Votre choix concernant les cookies" : "Gérer mes cookies"}
          </h2>
          <p>
            Parrainio utilise uniquement les éléments nécessaires à son fonctionnement et mémorise votre
            choix. Aucun outil d’audience ou de publicité n’est actuellement identifié sur le site.
          </p>
          <button
            className={styles.detailsButton}
            type="button"
            aria-expanded={detailsOpen}
            aria-controls="cookie-consent-details"
            onClick={() => setDetailsOpen((open) => !open)}
          >
            {detailsOpen ? "Masquer les détails" : "Personnaliser / en savoir plus"}
          </button>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.choiceButton}
            type="button"
            onClick={() => saveDecision("accepted")}
          >
            Accepter
          </button>
          <button
            className={styles.choiceButton}
            type="button"
            onClick={() => saveDecision("refused")}
          >
            Refuser
          </button>
          {!isInitialChoice && consent?.decision === "accepted" ? (
            <button
              className={styles.withdrawButton}
              type="button"
              onClick={() => saveDecision("refused")}
            >
              Retirer mon consentement
            </button>
          ) : null}
          {!isInitialChoice ? (
            <button
              className={styles.closeButton}
              type="button"
              onClick={() => setSettingsOpen(false)}
              aria-label="Fermer les paramètres des cookies"
            >
              Fermer
            </button>
          ) : null}
        </div>
      </div>

      {detailsOpen ? (
        <div className={styles.details} id="cookie-consent-details">
          <h3>Éléments utilisés actuellement</h3>
          <ul>
            <li>
              <strong>Fonctionnement nécessaire :</strong> le cookie de session d’administration{" "}
              <code>parrainio_admin</code> est limité à l’espace admin et n’est pas posé lors d’une visite
              publique.
            </li>
            <li>
              <strong>Fonctionnalités locales :</strong> les favoris restent dans le stockage local de votre
              navigateur; le choix exprimé ici y est également mémorisé pendant six mois.
            </li>
            <li>
              <strong>Audience et publicité :</strong> aucun outil ni traceur de ces catégories n’a été
              identifié dans le site.
            </li>
          </ul>
          <p>
            En conséquence, accepter ou refuser n’active ni ne désactive actuellement de traceur optionnel.
            La politique de confidentialité décrit ces éléments et les modalités de modification du choix.
          </p>
          {storageError ? (
            <p className={styles.error} role="alert">
              Le choix n’a pas pu être enregistré dans ce navigateur. Vérifiez ses paramètres de stockage
              puis réessayez.
            </p>
          ) : null}
          <a href="/confidentialite#cookies-traceurs">Consulter la politique de confidentialité</a>
        </div>
      ) : storageError ? (
        <p className={styles.error} role="alert">
          Le choix n’a pas pu être enregistré dans ce navigateur. Vérifiez ses paramètres de stockage puis
          réessayez.
        </p>
      ) : null}
    </aside>
  );
}
