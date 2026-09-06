/**
 * Instrumentation Next.js — vérification automatique des offres au
 * démarrage du serveur (donc après chaque déploiement).
 *
 * Architecture (chantier « alertes automatiques ») :
 * - les données d'offre ne changent en production QUE via un déploiement
 *   (données dans le dépôt + offer-overrides.json versionné) ; comparer
 *   l'empreinte stockée avec les données courantes AU BOOT couvre donc
 *   réellement les changements de production, sans cron ni action manuelle ;
 * - single-flight : la vérification ne peut pas s'exécuter deux fois en
 *   parallèle (protection anti-doublon si plusieurs instances bootent) ;
 * - idempotent : un changement déjà traité met à jour l'empreinte de
 *   référence dans le KV — rejouer le même déploiement ne renvoie aucun
 *   e-mail en double ;
 * - honnête : sans KV configuré (ou en cas d'erreur), rien ne se passe et
 *   l'erreur est journalisée — aucune simulation d'envoi ;
 * - sans SMTP configuré, les changements sont détectés et enregistrés
 *   (l'empreinte avance), mais aucun e-mail n'est envoyé : les abonnés
 *   manquent ce changement plutôt que de recevoir de faux succès.
 */

export async function register() {
  // Ne s'exécute que côté serveur Node (pas au build, pas dans le navigateur).
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { getAlertsConfig } = await import("@/lib/alertsConfig");
  const config = getAlertsConfig();
  if (!config.storageReady) {
    console.info("[alerts] vérification d'offres ignorée : stockage non configuré (ALERTS_KV_REST_API_URL / ALERTS_KV_REST_API_TOKEN).");
    return;
  }

  // Single-flight : seule la première exécution lance la vérification.
  const globalScope = globalThis as typeof globalThis & { __parrainioAlertsCheck?: Promise<unknown> };
  if (globalScope.__parrainioAlertsCheck) return;

  globalScope.__parrainioAlertsCheck = (async () => {
    try {
      const { runOfferAlertCheck } = await import("@/lib/alertRunner");
      const result = await runOfferAlertCheck({});
      for (const outcome of result.outcomes) {
        if (outcome.status === "first-reference") {
          console.info(`[alerts] référence initiale enregistrée pour ${outcome.slug}.`);
        } else if (outcome.status === "notified") {
          console.info(`[alerts] ${outcome.slug} : ${outcome.changedFields.join(", ")} — ${outcome.notifiedCount} e-mail(s) envoyé(s).`);
        } else if (outcome.status === "notify-failed") {
          console.warn(`[alerts] ${outcome.slug} : changement détecté (${outcome.changedFields.join(", ")}) mais envoi échoué pour ${outcome.failedCount} destinataire(s).`);
        } else if (outcome.status === "changed-no-subscribers") {
          console.info(`[alerts] ${outcome.slug} : changement détecté (${outcome.changedFields.join(", ")}), aucun abonné actif.`);
        }
      }
      if (!result.smtpReady && result.outcomes.some((o) => o.changedFields.length > 0)) {
        console.warn("[alerts] SMTP non configuré : les changements détectés n'ont pas pu être notifiés par e-mail.");
      }
    } catch (error) {
      console.error("[alerts] vérification automatique échouée :", error instanceof Error ? error.message : error);
    }
  })();

  await globalScope.__parrainioAlertsCheck;
}
