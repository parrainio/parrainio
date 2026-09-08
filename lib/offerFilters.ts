import type { Offer } from "@/data/offers";

/**
 * Filtres structurés du catalogue /offres — lecture pure de la source de
 * vérité existante (getManagedOffers). AUCUNE donnée d'offre n'est modifiée.
 *
 * Règle fondamentale : une offre n'est incluse dans un filtre de condition que
 * si ses conditions vérifiées le mentionnent EXPLICITEMENT. En l'absence
 * d'information, la valeur est « inconnue » → l'offre est exclue du résultat
 * positif (jamais de classification par devinette sur l'absence de texte).
 */

/** Normalisation insensible aux accents/casse pour la recherche. */
export function normalizeOfferSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export type PrimeThreshold = 5 | 10 | 20 | 50 | 100;

export const PRIME_THRESHOLDS: { value: PrimeThreshold; label: string }[] = [
  { value: 5, label: "Plus de 5 €" },
  { value: 10, label: "Plus de 10 €" },
  { value: 20, label: "Plus de 20 €" },
  { value: 50, label: "Plus de 50 €" },
  { value: 100, label: "Plus de 100 €" },
];

export type ConditionKey =
  | "noDeposit"
  | "noMonthlyPayment"
  | "noCommitment"
  | "firstOrder"
  | "deposit100Plus"
  | "minPurchase";

export const CONDITION_OPTIONS: { key: ConditionKey; label: string }[] = [
  { key: "noDeposit", label: "Sans dépôt ou 1 € maximum" },
  { key: "noMonthlyPayment", label: "Sans paiement mensuel" },
  { key: "noCommitment", label: "Sans engagement" },
  { key: "firstOrder", label: "Première commande" },
  { key: "deposit100Plus", label: "Dépôt de 100 € ou plus" },
  { key: "minPurchase", label: "Achat minimum requis" },
];

const SENTENCE_SPLIT = /(?<=[.!?])\s+/;

/** Extrait la valeur € d'une phrase (séparateurs fr : espaces fines, virgule). */
function euroAmount(sentence: string): number | null {
  const m = sentence.match(/(\d[\d\u00a0\u202f\s]*(?:[,.]\d+)?)\s*(?:€|euros)/i);
  if (!m) return null;
  const raw = m[1].replace(/[\u00a0\u202f\s]/g, "").replace(",", ".");
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : null;
}

/* ── Dépôts (versement/dépôt/recharge) ───────────────────────────────────────
   Une phrase ne compte que si elle exprime un MONTANT À DÉPOSER. On exclut
   les plafonds de prime (« plafonnée à 500 € ») qui décrivent le reversement,
   pas l'argent à déposer. */
const DEPOSIT_RE = /(?:versement|dépôt|depot|recharg\w*)[^.]{0,80}?\d[\d\u00a0\u202f\s]*(?:[,.]\d+)?\s*(?:€|euros)/i;
const PRIME_CAP_RE = /(plafonn\w*|jusqu['’]à)\s+(\d[\d\u00a0\u202f\s]*(?:[,.]\d+)?)\s*(?:€|euros)/i;

function depositSentences(offer: Offer): { text: string; amount: number }[] {
  const out: { text: string; amount: number }[] = [];
  for (const condition of offer.conditions ?? []) {
    for (const sentence of condition.split(SENTENCE_SPLIT)) {
      if (!DEPOSIT_RE.test(sentence)) continue;
      const amount = euroAmount(sentence);
      if (amount === null) continue;
      const cap = sentence.match(PRIME_CAP_RE);
      // Si le seul montant de la phrase est un plafond de prime → pas un dépôt.
      if (cap && Number.parseFloat(cap[2].replace(/[\u00a0\u202f\s]/g, "").replace(",", ".")) === amount) continue;
      out.push({ text: sentence, amount });
    }
  }
  return out;
}

/* ── « Sans dépôt ou 1 € maximum » ──────────────────────────────────────────
   Qualifie SI ET SEULEMENT SI les conditions mentionnent explicitement
   l'absence de dépôt (0 €) ou un versement de 1 € maximum. Sans mention
   explicite → inconnu → exclu. */
const NO_DEPOSIT_RE = /sans (?:aucun )?(?:dépôt|depot|versement)|aucun (?:dépôt|depot|versement)/i;

function isNoDeposit(offer: Offer): boolean {
  const text = (offer.conditions ?? []).join(" ");
  if (NO_DEPOSIT_RE.test(text)) return true;
  return depositSentences(offer).some(({ amount }) => amount <= 1);
}

/* ── Dépôt ≥ 100 € : au moins une condition de dépôt explicite ≥ 100 € ─────── */
function isDeposit100Plus(offer: Offer): boolean {
  return depositSentences(offer).some(({ amount }) => amount >= 100);
}

/* ── « Sans paiement mensuel » / « Sans engagement » ──────────────────────
   Filtres de NÉGATION : ils ne matchent que si les conditions vérifiées
   affirment EXPLICITEMENT l'absence (ex. « sans frais mensuels », « sans
   engagement »). L'absence de mention = inconnu → exclu (jamais de
   classification par déduction). Aujourd'hui aucune offre ne porte ces
   mentions : le filtre affiche un état vide honnête plutôt que de prétendre
   que 120 offres sont « sans engagement » sans vérification. */
const NO_MONTHLY_RE = /sans (?:frais|paiement|prélèvement|cotisation|abonnement)|gratuit[^.]{0,30}(?:sans|aucun)[^.]{0,20}(?:frais|cotisation|abonnement)/i;
const NO_COMMITMENT_RE = /sans engagement|sans période d'engagement/i;

function isNoMonthlyPayment(offer: Offer): boolean {
  return NO_MONTHLY_RE.test((offer.conditions ?? []).join(" "));
}

function isNoCommitment(offer: Offer): boolean {
  return NO_COMMITMENT_RE.test((offer.conditions ?? []).join(" "));
}

/* ── Première commande/réservation/transaction qualifiante ─────────────────── */
const FIRST_ORDER_RE =
  /premi[eè]re\s+(?:commande|course|livraison|réservation|transaction|box)|premier\s+(?:achat|versement qualifiant)|première souscription/i;

function requiresFirstOrder(offer: Offer): boolean {
  return FIRST_ORDER_RE.test((offer.conditions ?? []).join(" "));
}

/* ── Achat minimum : minimum de commande EXPLICITE (pas « éventuel ») ──────── */
const MIN_PURCHASE_RE =
  /(?:achat|commande|panier|livraison)[^.]{0,25}minimum|minimum[^.]{0,15}(?:d'achat|de commande|de panier)/i;
const OPTIONAL_MIN_RE = /éventuel\w*|pouvant être|selon (?:le|la|les) (?:campagne|code|partenaire)/i;

function hasMinimumPurchase(offer: Offer): boolean {
  for (const condition of offer.conditions ?? []) {
    for (const sentence of condition.split(SENTENCE_SPLIT)) {
      if (MIN_PURCHASE_RE.test(sentence) && !OPTIONAL_MIN_RE.test(sentence)) return true;
    }
  }
  return false;
}

/* ── Classification explicite validée (classement « catégories de conditions ») ──
   Source : classement validé offre par offre. Ce map est PRIORITAIRE sur la
   dérivation par regex ci-dessus pour les clés de USER_CONDITION_KEYS :
   - clé présente (true)  → l'offre est classée dans la catégorie ;
   - clé absente          → l'offre n'y est PAS classée, même si le texte de ses
     conditions la ferait dériver (ex. banques exclues de « Sans engagement ») ;
   - objet vide           → l'offre ne doit apparaître dans aucune de ces catégories.
   « minPurchase » (Achat minimum requis) ne fait pas partie de ce classement :
   il reste dérivé des conditions pour toutes les offres.
   AUCUNE donnée d'offre n'est modifiée. */

const USER_CONDITION_KEYS = [
  "noDeposit",
  "deposit100Plus",
  "noMonthlyPayment",
  "noCommitment",
  "firstOrder",
] as const satisfies readonly ConditionKey[];

const EXPLICIT_CONDITION_CLASSIFICATION: Partial<
  Record<string, Partial<Record<(typeof USER_CONDITION_KEYS)[number], true>>>
> = {
  /* Banques / Finance — règle : une banque n'est JAMAIS « Sans engagement » sauf Revolut. */
  boursobank: { noDeposit: true, noMonthlyPayment: true },
  fortuneo: { deposit100Plus: true },
  "hello-bank": { noDeposit: true },
  revolut: { noDeposit: true, noMonthlyPayment: true, noCommitment: true },
  "trade-republic": { noMonthlyPayment: true, noCommitment: true },
  n26: { noDeposit: true, noMonthlyPayment: true, noCommitment: true },
  "crypto-com": { deposit100Plus: true, noMonthlyPayment: true, noCommitment: true },
  swissborg: { deposit100Plus: true, noMonthlyPayment: true, noCommitment: true },
  monabanq: { noDeposit: true },
  etoro: { deposit100Plus: true, noMonthlyPayment: true, noCommitment: true },
  kraken: { deposit100Plus: true, noMonthlyPayment: true, noCommitment: true },
  bitpanda: { deposit100Plus: true, noMonthlyPayment: true, noCommitment: true },
  bybit: { deposit100Plus: true, noMonthlyPayment: true, noCommitment: true },
  coinhouse: { deposit100Plus: true, noMonthlyPayment: true, noCommitment: true },
  "revolut-business": { noMonthlyPayment: true, noCommitment: true },
  sumeria: { noMonthlyPayment: true, noCommitment: true },
  "assurancevie-com": { deposit100Plus: true, noCommitment: true },
  "caisse-depargne-loire-centre": { noDeposit: true, noMonthlyPayment: true },
  "credit-agricole-centre-loire": { noDeposit: true, noMonthlyPayment: true },

  /* Paris sportifs / jeux */
  winamax: { noMonthlyPayment: true, noCommitment: true },
  betclic: { noMonthlyPayment: true, noCommitment: true },
  unibet: { noMonthlyPayment: true, noCommitment: true },
  pmu: { noMonthlyPayment: true, noCommitment: true },
  betsson: { noMonthlyPayment: true, noCommitment: true },

  /* Shopping / services / autres */
  igraal: { noDeposit: true, noMonthlyPayment: true, noCommitment: true, firstOrder: true },
  paypal: { noCommitment: true, firstOrder: true },
  wise: { noMonthlyPayment: true, noCommitment: true },
  widilo: { noDeposit: true, noMonthlyPayment: true, noCommitment: true },
  fizzer: { firstOrder: true },
  topcashback: { noDeposit: true, noMonthlyPayment: true, noCommitment: true },
  "instant-gaming": { firstOrder: true },
  freecash: { noDeposit: true },
  "capital-koala": { noDeposit: true },
  "hello-watt": { noDeposit: true, noMonthlyPayment: true, noCommitment: true, firstOrder: true },
  "bebe-boutik": { firstOrder: true },
  "meilleurtaux-com": { firstOrder: true },
  whatnot: { firstOrder: true },
  "too-good-to-go": { firstOrder: true },
  placesdescartes: { firstOrder: true },
  sumup: { firstOrder: true },
  pourdebon: { firstOrder: true },
  nutripure: { firstOrder: true },
  becquet: { firstOrder: true },
  "systeme-io": { firstOrder: true },
  "liberte-watts": { firstOrder: true },
  klarna: { noMonthlyPayment: true, noCommitment: true },
  scrambly: { noDeposit: true, noMonthlyPayment: true, noCommitment: true },
  "splint-invest": { noDeposit: true, noMonthlyPayment: true, noCommitment: true },
  ludocortex: { firstOrder: true },

  /* Ne pas classer dans ces catégories (décision explicite, hors dérivation). */
  totalenergies: {},
  sfr: {},
  "macadam-4": {},
  "coupon-network": {},
  fidme: {},
  "private-sport-shop": {},
  reevolt: {},
  edf: {},
  engie: {},
  bricks: {},
};

/** Résout une catégorie pour une offre : map explicite d'abord, dérivation sinon.
 *  « minPurchase » reste toujours dérivé des conditions. */
export function resolveConditionCategory(offer: Offer, key: ConditionKey): boolean {
  if (key !== "minPurchase") {
    const explicit = EXPLICIT_CONDITION_CLASSIFICATION[offer.slug];
    if (explicit) return explicit[key] === true;
  }
  return DERIVED_PREDICATES[key](offer);
}

export const CONDITION_PREDICATES: Record<ConditionKey, (offer: Offer) => boolean> = {
  noDeposit: (offer) => resolveConditionCategory(offer, "noDeposit"),
  noMonthlyPayment: (offer) => resolveConditionCategory(offer, "noMonthlyPayment"),
  noCommitment: (offer) => resolveConditionCategory(offer, "noCommitment"),
  firstOrder: (offer) => resolveConditionCategory(offer, "firstOrder"),
  deposit100Plus: (offer) => resolveConditionCategory(offer, "deposit100Plus"),
  minPurchase: hasMinimumPurchase,
};

/* Prédicats dérivés des conditions textuelles (utilisés pour les offres hors
   classification explicite et pour « minPurchase »). */
const DERIVED_PREDICATES: Record<ConditionKey, (offer: Offer) => boolean> = {
  noDeposit: isNoDeposit,
  noMonthlyPayment: isNoMonthlyPayment,
  noCommitment: isNoCommitment,
  firstOrder: requiresFirstOrder,
  deposit100Plus: isDeposit100Plus,
  minPurchase: hasMinimumPurchase,
};

/* ── Avantage total (comparaison classement + filtres de montant) ────────────
   AVANTAGE TOTAL = prime filleul + Parraino reverse.

   Règle de lecture d'un champ de récompense : on retient la valeur € la plus
   élevée RÉELLEMENT ÉCRITE dans le texte (« jusqu'à 160 € » → 160, « entre 1 €
   et 50 € » → 50, « Fosfo : 17,50 € ; Gold : 27 € » → 27), sans jamais
   additionner ni inventer de montant. Les seuils d'achat (« 10 € dès 40 €
   d'achat ») ne sont pas des récompenses : ils sont ignorés au profit du
   montant de la récompense elle-même. Un pourcentage sans € ne compte pas. */
function rewardEuroMax(text: string | null | undefined): number | null {
  if (!text) return null;
  let max: number | null = null;
  const re = /(\d[\d\u00a0\u202f\s]*(?:[,.]\d+)?)\s*(?:€|euros)/gi;
  for (const m of text.matchAll(re)) {
    const start = m.index ?? 0;
    const before = text.slice(Math.max(0, start - 12), start);
    const after = text.slice(start + m[0].length, start + m[0].length + 16);
    // Seuil d'achat / de dépôt, pas une récompense (« 10 € dès 40 € d'achat »).
    if (/(?:dès|depuis)\s*$/i.test(before)) continue;
    if (/(?:dép[ôo]t|versement|recharge)\s+d[e']\s*$/i.test(before)) continue;
    if (/^\s*(?:d'achat|de commande|de dép[ôo]t|de recharge|minimum)/i.test(after)) continue;
    const value = Number.parseFloat(m[1].replace(/[\u00a0\u202f\s]/g, "").replace(",", "."));
    if (Number.isFinite(value) && (max === null || value > max)) max = value;
  }
  return max;
}

/** Valeur € de la prime filleul (max réellement représenté, seuils exclus). */
export function primeValue(offer: Pick<Offer, "partnerReward">): number | null {
  return rewardEuroMax(offer.partnerReward);
}

/** Valeur € du reversement Parrainio (null si absent ou non chiffré en €). */
export function reverseValue(offer: Pick<Offer, "parrainioReward">): number | null {
  return rewardEuroMax(offer.parrainioReward);
}

/** Avantages non assimilables à une prime (remise de frais, etc.) — exclus du
 *  classement et des filtres de montant, cohérent avec la fiche qui affiche
 *  l'avantage réel. */
export const NON_PRIME_SLUGS: ReadonlySet<string> = new Set(["wise"]);

/** Avantage total = prime filleul + Parraino reverse (valeurs maximales des
 *  données, sans invention). null uniquement si AUCUN des deux n'est chiffré
 *  en € ; une prime explicite à 0 € compte comme 0, pas comme null — une offre
 *  « 0 € + 40 € de reverse » vaut donc bien 40 € d'avantage total. */
export function getTotalBenefit(
  offer: Pick<Offer, "partnerReward" | "parrainioReward">,
): number | null {
  const prime = primeValue(offer);
  const reverse = reverseValue(offer);
  if (prime === null && reverse === null) return null;
  return (prime ?? 0) + (reverse ?? 0);
}

export type CatalogFilters = {
  search: string;
  primeThreshold: PrimeThreshold | null;
  condition: ConditionKey | null;
};

export function filterOffers(
  offers: Offer[],
  { search, primeThreshold, condition }: CatalogFilters,
): Offer[] {
  const query = normalizeOfferSearch(search);
  return offers.filter((offer) => {
    if (primeThreshold !== null) {
      // Les filtres de montant portent sur l'AVANTAGE TOTAL (prime + reverse).
      const total = NON_PRIME_SLUGS.has(offer.slug) ? null : getTotalBenefit(offer);
      if (total === null || total <= primeThreshold) return false;
    }
    if (condition !== null && !CONDITION_PREDICATES[condition](offer)) return false;
    if (!query) return true;
    const searchable = normalizeOfferSearch(`${offer.name} ${offer.slug} ${offer.categoryGroup} ${offer.category}`);
    return searchable.includes(query);
  });
}
