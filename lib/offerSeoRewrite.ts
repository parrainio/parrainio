import type { Offer } from "@/data/offers";
import type { OfferSeoProfile } from "@/data/offer-seo";

/**
 * Réécriture SEO des fiches d'offres.
 *
 * Objectif : placer l'expression réellement recherchée (« code parrainage »,
 * « code promo », « code de réduction ») en tête de title et de H1, sans
 * inventer de mécanisme. Le vocabulaire dépend de ce que l'offre documente :
 * - un code de parrainage existe → « code parrainage » / « code promo » ;
 * - seul un lien existe → « parrainage » + « lien » ;
 * - ni code ni lien public → « offre de parrainage ».
 *
 * Les montants proviennent uniquement de `partnerReward` / `parrainioReward`
 * (données gérées et vérifiées). Aucune condition commerciale n'est modifiée.
 */

export type OfferSeoRewrite = {
  title: string;
  description: string;
  h1: string;
  /** Première phrase de l'introduction, avant le texte vérifié existant. */
  lead: string;
};

/** Catégories où « code promo » est l'expression naturelle. */
const PROMO_CATEGORIES = new Set([
  "Cashback",
  "Shopping & Courses",
  "Services numériques",
  "Voyage & Mobilité",
]);

/** Overrides manuels des pages à fort enjeu (GSC / intention dominante). */
const OVERRIDES: Record<string, Partial<OfferSeoRewrite>> = {
  igraal: {
    title: "Parrainage iGraal : 5 € et 10 % à vie",
    description:
      "Parrainage iGraal : le lien rattache le compte au parrain, sans code à saisir. 5 € de bonus après un premier cashback validé, puis 10 % des gains des filleuls à vie.",
    h1: "Parrainage iGraal : 5 € et 10 % des gains",
    lead:
      "Le lien de parrainage iGraal suffit : il rattache le compte au parrain, sans code à saisir. Le bonus de 5 € est déclenché après un premier cashback validé, puis 10 % des gains des filleuls à vie.",
  },
  alltricks: {
    title: "Code parrainage Alltricks : 10 € dès 100 €",
    description:
      "Code parrainage Alltricks : 10 € de remise pour le filleul dès 100 € de première commande, valable 2 mois et jusqu'à 5 filleuls. Conditions détaillées.",
    h1: "Code de parrainage Alltricks : 10 € dès 100 € d'achat",
    lead:
      "Le code de parrainage Alltricks donne 10 € de remise au filleul dès 100 € de première commande ; l'avantage est valable 2 mois et limité à 5 filleuls.",
  },
  "parions-sport": {
    title: "Parrainage Parions Sport : offre terminée",
    description:
      "Le parrainage Parions Sport en ligne est terminé : la marque a rejoint Unibet le 24 mars 2026. Cette page conserve l'historique, sans prime active.",
    h1: "Parions Sport : offre de parrainage terminée",
    lead:
      "Le parrainage Parions Sport en ligne est terminé : la marque a rejoint Unibet le 24 mars 2026. Cette page conserve l'historique du programme, sans prime active ni parcours d'inscription sous ce nom.",
  },
  "i-run-fr": {
    title: "Parrainage i-Run : 10 € chacun dès 60 € par e-mail",
    description:
      "i-Run : invitation par e-mail, 10 € de réduction pour le filleul dès 60 € de première commande et 10 € pour le parrain. Aucun code public à saisir.",
    h1: "i-Run : parrainage par e-mail, 10 € pour chacun",
    lead:
      "Le parrainage i-Run ne repose pas sur un code public : le parrain enregistre l'e-mail du filleul, qui reçoit ensuite son invitation. Le filleul doit ouvrir le lien reçu par e-mail avant de créer son compte, puis commander au moins 60 €.",
  },
  "bebe-boutik": {
    title: "Parrainage Bébé Boutik : 10 € de crédit par lien",
    description:
      "Bébé Boutik : le parrainage passe par le lien d'invitation, sans code à saisir. 10 € de crédit pour le parrain après la première commande du filleul.",
    h1: "Bébé Boutik : parrainage par lien, sans code",
    lead:
      "Le parrainage Bébé Boutik passe par le lien d'invitation : aucun code public n'est à saisir. Le parrain reçoit 10 € de crédit lorsque le filleul invité effectue sa première commande.",
  },
  "shoes-fr": {
    title: "Parrainage Shoes.fr : 10 € sur la première commande",
    description:
      "Shoes.fr : demande d'invitation depuis Parrainio, puis 10 € pour le filleul et 10 € en chèque cadeau pour le parrain. Aucun code public.",
    h1: "Shoes.fr : parrainage et demande d'invitation",
    lead:
      "Le parrainage Shoes.fr passe par une invitation : demandez le parrainage depuis cette fiche, puis utilisez les informations transmises en privé lors de votre inscription. Aucun code public n'est nécessaire.",
  },
  swissborg: {
    title: "Parrainage SwissBorg : jusqu'à 50 € en Bitcoin",
    description:
      "SwissBorg : lien personnel, code de parrainage affiché dans l'application (Profil > Parrainage) et ticket Bitcoin jusqu'à 50 € selon le challenge.",
    h1: "Parrainage SwissBorg : lien et code personnel",
    lead:
      "Le parrainage SwissBorg passe par un lien ou un QR code personnel : le code de parrainage est celui affiché dans l'application, rubrique Profil > Parrainage. Aucun code générique ne s'y substitue.",
  },
  sfr: {
    title: "Code parrainage RED by SFR : jusqu'à 15 €",
    description:
      "Code parrainage RED by SFR : le code se saisit pendant la commande, puis la ligne doit être activée et la première facture payée pour déclencher la prime.",
    h1: "Code de parrainage RED by SFR : jusqu'à 15 €",
    lead:
      "Le code de parrainage RED by SFR s'utilise pendant la commande : l'activation de la ligne et le paiement de la première facture conditionnent le versement de la prime.",
  },
  poulpeo: {
    title: "Parrainage Poulpeo : 5 € et 10 % des gains",
    description:
      "Parrainage Poulpeo : le lien rattache le compte au parrain, sans code à saisir. 5 € de bonus après un cashback validé, puis 10 % des gains des filleuls.",
    h1: "Parrainage Poulpeo : 5 € et cashback",
    lead:
      "Le lien de parrainage Poulpeo suffit : il rattache le compte au parrain, sans code à saisir. Le bonus de 5 € est crédité après un premier cashback validé, puis 10 % des gains des filleuls.",
  },
  "the-protein-works": {
    title: "Parrainage The Protein Works : 10 % de réduction",
    description:
      "Parrainage The Protein Works : le lien ajoute 10 % de réduction, sans code à saisir. Avantage non cumulable avec d'autres codes et distinct de la fidélité.",
    h1: "Parrainage The Protein Works : 10 % de réduction",
    lead:
      "Le lien de parrainage The Protein Works ajoute 10 % de réduction, sans code à saisir ; l'avantage n'est pas cumulable avec d'autres codes et reste distinct du programme de fidélité.",
  },
  speedo: {
    title: "Code promo Speedo : parrainage et réductions",
    description:
      "Code promo Speedo : utilisez le code ou le lien de parrainage selon la campagne, vérifiez le seuil et les exclusions avant la commande.",
    h1: "Code promo Speedo : offre et conditions",
    lead:
      "Le code promo Speedo dépend de la campagne de parrainage en cours : vérifiez le seuil, les produits exclus et la date de validité avant de commander.",
  },
  phenix: {
    title: "Code parrainage Phenix : 1 € en points",
    description:
      "Code parrainage Phenix : 1 € en points pour le filleul après sa première commande validée, et 0,50 € en points pour le parrain. Conditions détaillées.",
    h1: "Code de parrainage Phenix : 1 € en points",
    lead:
      "Le code de parrainage Phenix donne 1 € en points de fidélité au filleul après une première commande validée ; le parrain reçoit 0,50 € en points.",
  },
  whatnot: {
    title: "Parrainage Whatnot : crédit et conditions",
    description:
      "Parrainage Whatnot : le lien rattache le nouveau compte au parrain. Le crédit annoncé est généralement lié à une première commande éligible sur le live shopping.",
    h1: "Parrainage Whatnot : invitation et achat",
    lead:
      "Le lien de parrainage Whatnot rattache le nouveau compte au parrain, sans code à saisir ; le crédit annoncé est généralement lié à une première commande éligible.",
  },
  "assurancevie-com": {
    title: "Code parrainage Assurancevie.com : 100 € + 50 €",
    description:
      "Code parrainage Assurancevie.com : 100 € pour le parrain, 50 € pour le filleul, avec 30 jours de renonciation et 12 mois de conservation.",
    h1: "Code de parrainage Assurancevie.com : 100 € et 50 €",
    lead:
      "Le code de parrainage Assurancevie.com prévoit 100 € pour le parrain et 50 € pour le filleul, sous réserve des 30 jours de renonciation et de 12 mois de conservation.",
  },
  "splint-invest": {
    title: "Code parrainage Splint Invest : 50 € et risques",
    description:
      "Code parrainage Splint Invest : crédit d'investissement variable et 50 € lors du premier achat. Conditions, éligibilité et risques des actifs détaillés.",
    h1: "Code de parrainage Splint Invest : crédit de 50 €",
    lead:
      "Le code de parrainage Splint Invest peut créditer 50 € lors du premier achat, selon la campagne ; les actifs proposés comportent un risque de perte.",
  },
  fidme: {
    title: "Code parrainage FidMe : invitation et points",
    description:
      "Code parrainage FidMe : invitez un nouvel utilisateur et recevez une récompense variable en points ou avantages. Conditions détaillées sur la fiche.",
    h1: "Code de parrainage FidMe : comment l'utiliser",
    lead:
      "Le code de parrainage FidMe s'utilise à l'inscription : la récompense du filleul et du parrain dépend ensuite de l'usage de l'application et de la campagne.",
  },
  "hello-bank": {
    title: "Parrainage Hello bank! : jusqu'à 130 € + 37,50 €",
    description:
      "Parrainage Hello bank! : Hello Prime jusqu'à 130 €, Hello One 80 € et 37,50 € reversés par Parrainio, plus Hello Start+ selon conditions. Lien, sans code.",
    h1: "Parrainage Hello bank! : primes et reverse",
    lead:
      "Le lien de parrainage Hello bank! ouvre le parcours, sans code à saisir : Hello Prime peut donner jusqu'à 130 € et Hello One 80 €, auxquels s'ajoutent 37,50 € reversés par Parrainio selon conditions.",
  },
  boursobank: {
    title: "Parrainage BoursoBank : jusqu'à 160 €",
    description:
      "Parrainage BoursoBank : jusqu'à 160 € selon l'offre active, avec premier versement, opérations carte et mobilité bancaire. Lien d'invitation, sans code.",
    h1: "Parrainage BoursoBank : offre et conditions",
    lead:
      "Le lien de parrainage BoursoBank doit être utilisé au début du parcours, sans code à saisir : le montant, jusqu'à 160 €, dépend de l'offre active et des étapes réalisées.",
  },
  fortuneo: {
    title: "Code parrainage Fortuneo : prime et conditions",
    description:
      "Code de parrainage Fortuneo : code à saisir pendant l'ouverture, puis conditions de dépôt et d'utilisation pour déclencher la prime.",
    h1: "Code de parrainage Fortuneo : conditions et prime",
    lead:
      "Le code de parrainage Fortuneo se saisit pendant l'ouverture du compte ; la prime dépend ensuite des conditions de dépôt et d'utilisation de la carte.",
  },
  "l-by-lcl": {
    title: "Parrainage L by LCL : jusqu'à 260 € avec XL ou XXL",
    description:
      "Parrainage L by LCL : jusqu'à 260 € avec la formule XXL (250 € de primes LCL et 10 € reversés par Parrainio), ou 200 € avec XL. Conditions détaillées.",
    h1: "L by LCL : parrainage et jusqu'à 260 € avec XL ou XXL",
    lead:
      "Le parrainage L by LCL se fait par lien, avec deux formules : XL jusqu'à 200 € et XXL jusqu'à 260 €, en incluant les 10 € reversés par Parrainio.",
  },
  revolut: {
    title: "Parrainage Revolut : 40 € reversés",
    description:
      "Parrainage Revolut : lien personnel, ouverture d'un compte Personnel et étapes variables selon la campagne. Aucun code à saisir. Parrainio reverse 40 € au parrain.",
    h1: "Parrainage Revolut : étapes et conditions",
    lead:
      "Le parrainage Revolut passe par un lien personnel, sans code à saisir : le filleul ouvre un compte Personnel et réalise les étapes de la campagne, tandis que Parrainio reverse 40 € au parrain.",
  },
};

function normalize(text: string): string {
  return text.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

/** Extrait un montant court et sûr : « 10 € », « jusqu'à 90 € », « 10 % ». */
function shortAmount(text: string): string {
  const clean = normalize(text);
  const firstClause = clean.split(/[;(]|\bselon\b/i)[0] ?? clean;
  const euro = firstClause.match(/(\d+(?:[.,]\d+)?)\s*€/);
  if (euro) {
    const value = `${euro[1].replace(".", ",")} €`;
    return /jusqu/i.test(firstClause) ? `jusqu'à ${value}` : value;
  }
  const percent = firstClause.match(/(\d+(?:[.,]\d+)?)\s*%/);
  if (percent) return `${percent[1].replace(".", ",")} %`;
  return "";
}

/** Seuil éventuel (« dès 100 € »), utile quand il est plus parlant que le montant. */
function shortThreshold(text: string): string {
  const match = normalize(text).match(/\bdès\s+(\d+(?:[.,]\d+)?)\s*€/i);
  return match ? `dès ${match[1].replace(".", ",")} €` : "";
}

function rewardLabel(offer: Offer): string {
  const partner = normalize(offer.partnerReward ?? "");
  const amount = shortAmount(partner);
  const zero = /^0\s*€/.test(amount) || /^(aucun|voir l'offre)/i.test(partner);
  if ((!amount || zero) && offer.parrainioReward) {
    const reverse = shortAmount(offer.parrainioReward);
    if (reverse) return `${reverse} reversés`;
  }
  if (!amount) return "";
  const threshold = shortThreshold(partner);
  return threshold && amount !== threshold && !threshold.includes(amount) ? `${amount} ${threshold}` : amount;
}

function hasCode(offer: Offer): boolean {
  return Boolean(
    offer.referralCode?.trim() ||
      offer.additionalReferralCodes?.some((item) => item.code?.trim()),
  );
}

function hasLink(offer: Offer): boolean {
  return Boolean(offer.referralLink?.trim() || offer.referralOptions?.length);
}

function keyword(offer: Offer): string {
  if (hasCode(offer)) {
    return PROMO_CATEGORIES.has(offer.categoryGroup) ? "Code promo" : "Code parrainage";
  }
  if (hasLink(offer)) return "Parrainage";
  return "Offre de parrainage";
}

/** Title ≤ 60 caractères, sans suffixe de marque s'il ne tient pas. */
function fitTitle(base: string): string {
  if (base.length <= 60) return base;
  const withBrand = `${base} | Parrainio`;
  if (withBrand.length <= 60) return withBrand;
  const cut = base.slice(0, 57);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 40 ? lastSpace : 57)}…`;
}

function buildTitle(offer: Offer): string {
  const label = rewardLabel(offer);
  const name = offer.name;
  const base = label
    ? hasCode(offer) && PROMO_CATEGORIES.has(offer.categoryGroup)
      ? `${keyword(offer)} ${name} : ${label} et parrainage`
      : `${keyword(offer)} ${name} : ${label} et conditions`
    : `${keyword(offer)} ${name} : offre et conditions`;
  return fitTitle(normalize(base));
}

function buildH1(offer: Offer): string {
  const label = rewardLabel(offer);
  if (hasCode(offer)) {
    return label
      ? `Code de parrainage ${offer.name} : ${label} et conditions`
      : `Code de parrainage ${offer.name} : comment l'utiliser`;
  }
  if (hasLink(offer)) {
    return label
      ? `${offer.name} : parrainage par lien et ${label}`
      : `${offer.name} : parrainage par lien et conditions`;
  }
  return `${offer.name} : offre de parrainage et conditions`;
}

function buildDescription(offer: Offer): string {
  const label = rewardLabel(offer);
  const code = offer.referralCode?.trim() || offer.additionalReferralCodes?.[0]?.code?.trim();
  if (hasCode(offer)) {
    const amount = label ? ` ${label}` : "";
    return normalize(
      `${keyword(offer)} ${offer.name} :${amount} avec le code de parrainage. Conditions, étapes et délai de versement détaillés sur Parrainio.`,
    );
  }
  if (hasLink(offer)) {
    const amount = label ? ` ${label}` : "";
    return normalize(
      `Parrainage ${offer.name} :${amount} via le lien d'invitation. Conditions, étapes et délai de versement détaillés sur Parrainio.`,
    );
  }
  return normalize(
    `Offre de parrainage ${offer.name} : modalités, conditions et étapes pour demander le lien ou activer l'avantage auprès du partenaire.`,
  );
}

function buildLead(offer: Offer): string {
  if (hasCode(offer)) {
    return normalize(
      `Pour profiter de l'offre ${offer.name}, le code de parrainage se saisit pendant l'inscription ou avant la première commande. Les conditions et le délai de versement sont détaillés ci-dessous.`,
    );
  }
  if (hasLink(offer)) {
    return normalize(
      `Pour profiter de l'offre ${offer.name}, le lien de parrainage doit être ouvert avant l'inscription ou la première commande. Les conditions et le délai de versement sont détaillés ci-dessous.`,
    );
  }
  return normalize(
    `L'offre ${offer.name} ne comporte pas de code public : le lien ou les modalités se demandent au parrain avant de commencer. Les conditions sont détaillées ci-dessous.`,
  );
}

export function buildOfferSeoRewrite(
  offer: Offer,
  _profile?: OfferSeoProfile,
): OfferSeoRewrite {
  const base: OfferSeoRewrite = {
    title: buildTitle(offer),
    description: buildDescription(offer),
    h1: buildH1(offer),
    lead: buildLead(offer),
  };
  const override = OVERRIDES[offer.slug];
  return override ? { ...base, ...override } : base;
}
