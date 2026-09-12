import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ensureAdminKvSeeded, getAdminFeaturedConfigCached } from "@/lib/adminKv";
import { SELECTION_DU_MOMENT } from "@/data/featuredOffersConfig";

export type FeaturedOffersConfig = {
  featuredOfferSlugs: string[];
};

/**
 * Lecture serveur des offres mises en avant — KV (persistant) avec repli
 * JSON Git puis sélection canonique. Même contrat que l'ancienne version :
 * une liste de slugs, validée à l'usage par getFeaturedOffers().
 */
export async function getFeaturedOfferSlugsServer(): Promise<string[]> {
  await ensureAdminKvSeeded();
  const stored = await getAdminFeaturedConfigCached();
  const config = stored as FeaturedOffersConfig | null;
  if (config && Array.isArray(config.featuredOfferSlugs) && config.featuredOfferSlugs.length > 0) {
    return config.featuredOfferSlugs;
  }

  const legacyPath = join(process.cwd(), "data", "featured-config.json");
  if (existsSync(legacyPath)) {
    try {
      const config = JSON.parse(readFileSync(legacyPath, "utf8")) as FeaturedOffersConfig;
      if (config.featuredOfferSlugs && Array.isArray(config.featuredOfferSlugs)) {
        return config.featuredOfferSlugs;
      }
    } catch {
      // Fall back to the canonical selection.
    }
  }

  return [...SELECTION_DU_MOMENT];
}
