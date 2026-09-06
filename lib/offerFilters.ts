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

export const CONDITION_PREDICATES: Record<ConditionKey, (offer: Offer) => boolean> = {
  noDeposit: isNoDeposit,
  noMonthlyPayment: isNoMonthlyPayment,
  noCommitment: isNoCommitment,
  firstOrder: requiresFirstOrder,
  deposit100Plus: isDeposit100Plus,
  minPurchase: hasMinimumPurchase,
};

/* ── Prime : valeur numérique de l'avantage principal affiché ────────────────
   Uniquement les montants en € (un pourcentage n'est pas un montant de prime). */
export function primeValue(offer: Offer): number | null {
  const m = offer.partnerReward?.match(/(\d[\d\u00a0\u202f\s]*(?:[,.]\d+)?)\s*(?:€|euros)/);
  if (!m) return null;
  const value = Number.parseFloat(m[1].replace(/[\u00a0\u202f\s]/g, "").replace(",", "."));
  return Number.isFinite(value) ? value : null;
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
      const value = primeValue(offer);
      if (value === null || value <= primeThreshold) return false;
    }
    if (condition !== null && !CONDITION_PREDICATES[condition](offer)) return false;
    if (!query) return true;
    const searchable = normalizeOfferSearch(`${offer.name} ${offer.slug} ${offer.categoryGroup} ${offer.category}`);
    return searchable.includes(query);
  });
}
