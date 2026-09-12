# Admin en production — architecture et exploitation

## Objectif

Modifier une offre depuis `https://www.parrainio.fr/admin` → **Enregistrer** →
modification visible immédiatement sur le site, **sans commit/push**.

## Architecture

- **Stockage persistant** : le KV Upstash déjà utilisé par les alertes
  (`ALERTS_KV_REST_API_URL` / `ALERTS_KV_REST_API_TOKEN`). Aucune nouvelle
  base, aucune nouvelle variable, aucun SDK (REST JSON, même pattern que
  `lib/alertSubscriptions.ts`).
- **Clés** (préfixe `admin:`, disjointes des clés alertes `alert:` / `alertsig:`) :
  - `admin:offer-overrides` — map slug → override (source du contenu des offres)
  - `admin:featured-config` — les 5 offres boostées
  - `admin:reviews` — la liste des avis (modération + soumission publique)
  - `admin:login-fail:<hash-ip>` — compteur de connexions échouées
- **Lectures** : via le fetch cache Next **tagué** (`next.tags` + TTL 60 s) —
  compatible rendu statique ; `unstable_cache` de Next 16.3 ne revalide pas
  par tag (constaté en test), le fetch tagué est le pattern documenté.
- **Écritures** : SET REST + `revalidateTag(tag, "max")` + `revalidatePath`
  des pages concernées → publication immédiate (fiche, catalogue, classement,
  hub de catégorie, homepage, sitemap).
- **Fallback** : si le KV est indisponible, lecture = JSON Git
  (`data/offer-overrides.json`, `data/featured-config.json`,
  `data/reviews.json`) puis données de base. Les écritures admin échouent
  avec un message explicite (jamais de fausse réussite).

## Variables Vercel (Production)

| Variable | Rôle |
|---|---|
| `ALERTS_KV_REST_API_URL` | déjà en place (alertes) — réutilisée |
| `ALERTS_KV_REST_API_TOKEN` | déjà en place (alertes) — réutilisée |
| `PARRAINIO_ADMIN_PASSWORD` | mot de passe admin (**≥ 16 caractères, fort**) |
| `PARRAINIO_ADMIN_SESSION_SECRET` | secret HMAC des sessions (long, aléatoire) |

Après ajout des 2 variables admin → **redeploy** (n'importe quel déploiement
les charge). Aucun secret n'est exposé au client (modules 100 % serveur).

## Migration des données (automatique, idempotente)

Au premier accès après déploiement, chaque clé ABSENTE est initialisée depuis
le JSON Git correspondant (seed single-flight par instance, `EXISTS` par clé).
Une clé existante n'est **jamais** écrasée par le seed : les modifications
admin faites entre-temps sont préservées. Le JSON Git reste en place et n'est
plus modifié par l'admin.

## Sauvegarde / rollback

- **Backup ponctuel** : `GET` de la valeur `admin:offer-overrides` (curl REST)
  et archivage du JSON — ou export JSON intégré à l'admin
  (`getOffersExportJson`).
- **Rollback complet** : supprimer/renommer les variables KV dans Vercel →
  les JSON Git redeviennent la source de vérité au prochain déploiement.
  Aucune donnée Git n'est supprimée par ce chantier.
- **Restauration d'une clé** : SET REST de la sauvegarde JSON.

## Comportements notables

- **Logos** : l'upload reste **local uniquement** (`VERCEL_ENV` défini →
  action refusée) ; le filesystem Vercel est éphémère. Les logos existants
  servent normalement depuis `public/logos/`.
- **IndexNow** : chaque sauvegarde d'offre soumet la fiche + `/offres` +
  classement via le module existant (no-op hors production, filtres
  canoniques inchangés).
- **Validation URLs** : `referralLink`, `officialWebsiteUrl`, `sourceUrl`
  doivent être des URL http(s) complètes (protocoles dangereux refusés).
- **Rate limit login** : 5 échecs / 15 min par IP (hash SHA-256), message de
  blocage affiché ; succès → remise à zéro.
- **Sitemap** : `lastModified` reflète désormais les vraies dates d'édition.
- **Avis** : la soumission publique passe par le KV (plus de perte lors des
  redéploiements) ; en cas de KV indisponible l'API répond 503 (jamais de
  perte silencieuse).

## Fichiers du chantier

- `lib/adminKv.ts` (nouveau) — accès KV, seed, tags
- `lib/adminRateLimit.ts` (nouveau) — rate limiting login
- `data/managedOffers.ts` — lecture/écriture KV + async
- `data/featuredOffersAdmin.ts`, `lib/featuredOffersServer.ts` — KV
- `lib/reviews.ts` — KV (modération + soumission publique)
- `app/admin/actions.ts` — actions async, validation, revalidations, IndexNow
- `app/api/reviews/route.ts` — écriture KV + 503 honnête
- Pages/API appelantes passées en `await` (~20 fichiers)
- `docs/admin-production.md` (ce fichier)

Aucune donnée commerciale (`data/offers.ts`, overrides, montants) modifiée.
