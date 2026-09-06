import { getManagedOffers } from "@/data/managedOffers";
import { getSafeReferralUrl } from "@/lib/referralSafety";

/**
 * Offres contextuelles du Guide — correspondance explicite article → offres.
 *
 * - mapping validé, basé uniquement sur les catégories réelles du catalogue ;
 * - les données affichées (nom, logo, prime, reverse, lien) viennent
 *   exclusivement de getManagedOffers() — aucun montant ni lien codé en dur ;
 * - maximum 4 offres par article, moins si le sujet l'exige ;
 * - les articles sans module pertinent n'en ont pas.
 */

export type BlogContextOffer = {
  slug: string;
  name: string;
  category: string;
  partnerReward: string;
  parrainioReward: string | null;
  logo: string | null;
  color: string;
  logoLetter: string;
  /** Lien de parrainage géré (sécurisé) — null → CTA vers la fiche interne. */
  referralUrl: string | null;
};

export type BlogOfferContext = {
  label: string;
  offers: BlogContextOffer[];
};

/** Mapping validé — slugs d'articles → slugs d'offres, dans l'ordre d'affichage. */
const ARTICLE_OFFERS: Record<string, { label: string; offerSlugs: string[] }> = {
  "le-cashback-comment-ca-marche": {
    label: "Offres cashback",
    offerSlugs: ["topcashback", "igraal", "poulpeo", "widilo"],
  },
  "comment-utiliser-cashback-intelligemment": {
    label: "Offres cashback",
    offerSlugs: ["capital-koala", "naomi-1", "ebuyclub", "wanteeed"],
  },
  "changer-de-banque-prime-parrainage": {
    label: "Offres banque",
    offerSlugs: ["monabanq", "boursobank", "fortuneo", "hello-bank"],
  },
  "parrainage-energie": {
    label: "Offres énergie",
    offerSlugs: ["totalenergies", "edf", "engie", "primeo-energie"],
  },
  "parrainage-crypto-fonctionnement-risques": {
    label: "Offres crypto",
    offerSlugs: ["coinhouse", "bitpanda", "crypto-com", "bybit"],
  },
  "freebet-comment-ca-marche": {
    label: "Offres jeux & paris",
    offerSlugs: ["betclic", "betsson", "winamax", "unibet"],
  },
  // comment-trouver-des-filleuls : volontairement SANS module (hors sujet).
  "comment-economiser-au-quotidien": {
    label: "Offres associées",
    offerSlugs: ["igraal", "weward", "macadam-4", "shopmium"],
  },
  "comment-economiser-sur-ses-abonnements": {
    label: "Offres associées",
    offerSlugs: ["sfr", "hostinger"],
  },
  "comment-reduire-facture-telephone-internet": {
    label: "Offre associée",
    offerSlugs: ["sfr"],
  },
};

const MAX_OFFERS = 4;

/**
 * Contexte commercial d'un article, résolu côté serveur.
 * Retourne null quand l'article n'a pas de module (aucune offre forcée).
 * Seule l'entité demandée est extraite — jamais les 120 offres.
 */
export function getBlogOfferContext(articleSlug: string): BlogOfferContext | null {
  const mapping = ARTICLE_OFFERS[articleSlug];
  if (!mapping || mapping.offerSlugs.length === 0) return null;

  const managed = getManagedOffers();
  const offers = mapping.offerSlugs
    .slice(0, MAX_OFFERS)
    .map((offerSlug) => managed.find((offer) => offer.slug === offerSlug))
    .filter((offer): offer is (typeof managed)[number] => Boolean(offer))
    .map((offer) => ({
      slug: offer.slug,
      name: offer.name,
      category: offer.category,
      partnerReward: (offer.partnerReward ?? "").trim(),
      parrainioReward: offer.parrainioReward ?? null,
      logo: offer.logo ?? null,
      color: offer.color,
      logoLetter: offer.logoLetter,
      referralUrl: getSafeReferralUrl(offer.referralLink),
    }));

  if (offers.length === 0) return null;
  return { label: mapping.label, offers };
}
