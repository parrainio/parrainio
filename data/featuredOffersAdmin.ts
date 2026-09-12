import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { SELECTION_DU_MOMENT } from "@/data/featuredOffersConfig";
import {
  ADMIN_KV_KEYS,
  ensureAdminKvSeeded,
  getAdminFeaturedConfigCached,
  writeAdminKvJson,
} from "@/lib/adminKv";

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
 */
export async function getFeaturedOffersAdmin(): Promise<FeaturedOffersConfig> {
  await ensureAdminKvSeeded();
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
  await ensureAdminKvSeeded();
  const persisted = await writeAdminKvJson(ADMIN_KV_KEYS.featuredConfig, config);
  if (!persisted) {
    if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
    writeFileSync(featuredConfigPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
    return false;
  }
  return true;
}
