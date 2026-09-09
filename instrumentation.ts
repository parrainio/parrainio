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
 * - sans SMTP configuré, les changements sont détectés mais la référence
 *   n'avance PAS : dès le retour du SMTP, les abonnés reçoivent l'alerte
 *   (aucun changement mangé en silence).
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
      return result;
    } catch (error) {
      console.error("[alerts] vérification automatique échouée :", error instanceof Error ? error.message : error);
      return null;
    }
  })();

  const checkResult = (await globalScope.__parrainioAlertsCheck) as
    | { outcomes?: { slug: string; status: string; changedFields: string[] }[] }
    | null
    | undefined;

  /* ── IndexNow : soumission des URLs nouvelles/modifiées ───────────────────
     Consomme les mêmes outcomes (déjà idempotents : no-change → 0 soumission,
     aucun rejeu de déploiement ne re-soumet quoi que ce soit).
     - Production uniquement (VERCEL_ENV) : local/preview ne servent pas le
       domaine canonique ;
     - try/catch séparé : un échec IndexNow ne touche ni les alertes ni la
       référence KV (la vérification est déjà terminée à ce stade). */
  if (process.env.VERCEL_ENV === "production" && checkResult?.outcomes) {
    try {
      const { isIndexNowEnabled, urlsFromAlertOutcomes, submitIndexNow } = await import("@/lib/indexNow");
      if (isIndexNowEnabled()) {
        const urls = urlsFromAlertOutcomes(checkResult.outcomes);
        if (urls.length > 0) {
          await submitIndexNow(urls);
        } else {
          console.info("[indexnow] aucun changement d'offre : aucune URL soumise.");
        }
      }
    } catch (error) {
      console.warn("[indexnow] étape ignorée :", error instanceof Error ? error.message : error);
    }
  }
}
