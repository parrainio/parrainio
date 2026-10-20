import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { SELECTION_DU_MOMENT } from "@/data/featuredOffersConfig";
import {
  ADMIN_KV_KEYS,
  ensureAdminKvSeeded,
  getAdminFeaturedConfigCached,
  writeAdminKvJson,
} from "@/lib/adminKv";
import { getBoostedCampaignSelection } from "@/data/boostedCampaign";

const dataDir = join(process.cwd(), "data");
const featuredConfigPath = join(dataDir, "featured-config.json");

export type FeaturedOffersConfig = {
  featuredOfferSlugs: string[];
};

const defaultFeaturedOffersConfig: FeaturedOffersConfig = {
  featuredOfferSlugs: [...SELECTION_DU_MOMENT]
};

/**
 * Lecture de la config mise en avant — KV (persistant, éditable depuis
 * l'admin en production) avec repli JSON Git puis valeur par défaut.
 *
 * Pas de seed ici : lecteur de rendu (page d'accueil statique) — le seed
 * émet des fetch no-store, interdits pendant le rendu (React #441).
 */
export async function getFeaturedOffersAdmin(): Promise<FeaturedOffersConfig> {
  // Même source de vérité que l'accueil : la sélection de la campagne
  // administrable, afin que l'écran admin affiche exactement le bandeau servi.
  const campaignSlugs = await getBoostedCampaignSelection();
  if (campaignSlugs) return { featuredOfferSlugs: campaignSlugs };

  const stored = await getAdminFeaturedConfigCached();
  const config = stored as FeaturedOffersConfig | null;
  if (config && Array.isArray(config.featuredOfferSlugs)) return config;
  if (existsSync(featuredConfigPath)) {
    try {
      return JSON.parse(readFileSync(featuredConfigPath, "utf8")) as FeaturedOffersConfig;
    } catch {
      // Fall back to the canonical selection.
    }
  }
  return defaultFeaturedOffersConfig;
}

export async function saveFeaturedOffersConfig(config: FeaturedOffersConfig) {
  // Contexte dynamique (action admin) : le seed no-store est autorisé ici.
  await ensureAdminKvSeeded();
  const persisted = await writeAdminKvJson(ADMIN_KV_KEYS.featuredConfig, config);
  if (!persisted) {
    // Repli fichier en local uniquement — sur Vercel (FS lecture seule),
    // l'écriture lèverait EROFS : persisted=false suffit à l'appelant.
    if (process.env.VERCEL_ENV) return false;
    if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
    writeFileSync(featuredConfigPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
    // Écriture locale réussie : on la considère comme persistée.
  }
  return true;
}
