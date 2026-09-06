/**
 * Alertes de changement d'offre — configuration d'infrastructure.
 *
 * Règle stricte (chantier) : aucune persistance n'est simulée. Le stockage
 * n'existe QUE si les variables d'un KV managé (Vercel Upstash REST) sont
 * fournies. Sans elles, les points d'API répondent 503 avec un message
 * explicite, et l'UI affiche l'état « service non disponible ».
 *
 * Variables requises en production (toutes obligatoires, aucune valeur par
 * défaut) :
 *   ALERTS_KV_REST_API_URL   — URL REST du store (ex. Vercel Upstash)
 *   ALERTS_KV_REST_API_TOKEN — token du store
 *   SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASSWORD — envoi des e-mails
 *     d'alerte (au changement réel d'une offre ; même pattern que
 *     /api/reverse-request, déjà présent dans le projet)
 *   ALERTS_SIGNING_SECRET    — secret HMAC (tokens de désabonnement)
 *
 * Aucune credential n'est exposée au navigateur : ce module est serveur.
 */

export type AlertsConfig = {
  kvConfigured: boolean;
  smtpConfigured: boolean;
  signingConfigured: boolean;
  /** Prêt = stockage persistant + secret de signature. L'envoi d'e-mails est vérifié séparément. */
  storageReady: boolean;
  /** Tout est prêt pour créer une alerte (hors envoi — les e-mails ne partent qu'à l'évolution réelle d'une offre). */
  fullyOperational: boolean;
};

const env = process.env;

export function getAlertsConfig(): AlertsConfig {
  const kvConfigured = Boolean(env.ALERTS_KV_REST_API_URL && env.ALERTS_KV_REST_API_TOKEN);
  const smtpConfigured = Boolean(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASSWORD);
  const signingConfigured = Boolean(env.ALERTS_SIGNING_SECRET);
  const storageReady = kvConfigured && signingConfigured;
  return { kvConfigured, smtpConfigured, signingConfigured, storageReady, fullyOperational: storageReady && smtpConfigured };
}

/** Utilisé par l'UI pour afficher un état honnête si l'infrastructure manque. */
export function alertsUnavailableReason(): string {
  if (!getAlertsConfig().kvConfigured) {
    return "Le service d'alertes n'est pas encore activé. Veuillez réessayer plus tard.";
  }
  return "Le service d'alertes est momentanément indisponible. Veuillez réessayer plus tard.";
}
