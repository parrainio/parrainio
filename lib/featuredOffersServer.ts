import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getAdminFeaturedConfigCached } from "@/lib/adminKv";
import { SELECTION_DU_MOMENT } from "@/data/featuredOffersConfig";
import { getBoostedCampaignSelection } from "@/data/boostedCampaign";

export type FeaturedOffersConfig = {
  featuredOfferSlugs: string[];
};

/**
 * Lecture serveur des offres mises en avant — KV (persistant) avec repli
 * JSON Git puis sélection canonique. Même contrat que l'ancienne version :
 * une liste de slugs, validée à l'usage par getFeaturedOffers().
 *
 * Pas de seed ici : lecteur de rendu (page d'accueil statique) — le seed
 * émet des fetch no-store, interdits pendant le rendu (React #441).
 */
/**
 * Sélection effective des offres mises en avant.
 *
 * SOURCE DE VÉRITÉ : la campagne administrable (`admin:boosted-campaign`)
 * lorsque sa sélection est complète. C'est elle qui pilote le bandeau de
 * l'accueil ; les hubs de catégorie et les offres liées doivent donc suivre
 * la même liste, sinon deux sélections divergentes coexistent.
 */
export async function getFeaturedOfferSlugsServer(): Promise<string[]> {
  const campaignSlugs = await getBoostedCampaignSelection();
  if (campaignSlugs) return campaignSlugs;

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
