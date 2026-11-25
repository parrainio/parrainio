import type { OfferSeoProfile } from "./offer-seo";
import {
  superParrainBatch18Offers,
  superParrainBatch18SeedDetails,
} from "./offers-superparrain-batch18";

const researchedAt = "2026-11-22";
const source = (
  title: string,
  url: string,
  type: "official" | "secondary",
) => ({ title, url, type, checkedAt: researchedAt });

const offerBySlug = new Map(
  superParrainBatch18Offers.map((offer) => [offer.slug, offer] as const),
);

function buildSeoProfile(
  seed: (typeof superParrainBatch18SeedDetails)[number],
): OfferSeoProfile {
  const offer = offerBySlug.get(seed.slug);
  if (!offer) {
    throw new Error("Profil SEO sans offre correspondante : " + seed.slug);
  }

  const hasPublicLink = Boolean(
    offer.referralLink || offer.referralOptions?.length,
  );
  const hasCode = Boolean(offer.referralCode);
  const action = hasPublicLink
    ? offer.referralOptions?.length
      ? "le lien de parrainage correspondant au produit choisi"
      : "le lien de parrainage affiché"
    : hasCode
      ? "le code de parrainage indiqué"
      : "le formulaire de demande de lien";
  const keyCondition =
    offer.conditions[0] ??
    "Suivre les conditions affichées par le partenaire avant de finaliser.";
  const reviewNotice = seed.needsReview
    ? "Cette annonce comporte une incohérence à confirmer avant d'utiliser le lien ou de compter sur le montant indiqué."
    : "";

  const profile: OfferSeoProfile = {
    status: seed.needsReview ? "needs_manual_review" : "partial",
    seoTitle: "Parrainage " + offer.name + " : code et offre | Parrainio",
    metaDescription:
      "Parrainage " +
      offer.name +
      " : " +
      offer.partnerReward +
      ". Retrouvez le code ou le lien, les conditions annoncées et les étapes pour utiliser l'offre.",
    h1: offer.name + " : offre, code et lien de parrainage",
    introduction:
      "Cette fiche reprend l'annonce personnelle de parrainage " +
      offer.name +
      " publiée sur Super Parrain. L'avantage affiché est " +
      offer.partnerReward +
      ". Les montants présentés dans l'annonce peuvent combiner la récompense du partenaire et un reversement personnel du parrain ; les deux parts sont précisées dans les conditions lorsqu'elles sont disponibles. " +
      reviewNotice,
    summary: [
      "Avantage annoncé au filleul : " + offer.partnerReward + ".",
      hasPublicLink
        ? "Lien de parrainage personnel : utiliser le lien de cette fiche avant de commencer le parcours."
        : hasCode
          ? "Code disponible : " + offer.referralCode + "."
          : "Le lien doit être demandé au parrain avant d'engager la démarche.",
      "Catégorie : " + offer.categoryGroup + ".",
      "Conditions essentielles : " + keyCondition,
    ],
    whyChoose: {
      heading: "À propos de " + offer.name,
      paragraphs: [
        offer.description,
        "Le parrainage peut réduire le coût d'une commande ou accompagner une inscription déjà envisagée. Comparez le service, le prix et les conditions du partenaire indépendamment du bonus ; celui-ci ne garantit pas que l'offre soit la plus adaptée à votre situation.",
      ],
    },
    audience:
      "Cette offre s'adresse aux personnes auxquelles le service ou le produit de " +
      offer.name +
      " correspond réellement et qui peuvent respecter les étapes annoncées. Vérifiez votre éligibilité, les exclusions et les seuils éventuels avant d'utiliser " +
      action +
      ".",
    referralExplanation:
      "Commencez avec " +
      action +
      " et suivez le parcours du partenaire. L'annonce de parrainage affiche : " +
      offer.partnerReward +
      ". La récompense ne devient acquise qu'après l'action demandée et la validation des critères par le partenaire. Tout complément annoncé comme un reversement personnel dépend aussi de l'engagement du parrain et, le cas échéant, de la réception de sa propre prime.",
    practicalInformation: [
      hasPublicLink
        ? "Ouvrez le lien de parrainage avant de créer le compte ou de commencer la commande."
        : hasCode
          ? "Saisissez le code dans le parcours prévu par le partenaire avant de finaliser l'inscription ou la commande."
          : "Demandez le lien et faites enregistrer le parrainage avant de prendre contact avec le partenaire.",
      "Le détail ci-dessous provient de l'annonce personnelle du profil Super Parrain ; consultez aussi les conditions du partenaire au moment de l'inscription.",
      ...(reviewNotice ? [reviewNotice] : []),
    ],
    conditions: offer.conditions,
    earnings:
      "Filleul : " +
      offer.partnerReward +
      ". Cette fiche ne présente aucun reversement Parrainio supplémentaire. Si l'annonce comporte une part reversée par le parrain, elle est personnelle et séparée de la récompense du partenaire.",
    rewardTiming:
      "Le moment du crédit dépend de l'action qualifiante et du contrôle du partenaire. Lorsqu'un reversement personnel est annoncé, il peut intervenir après validation du dossier ou réception de la prime du parrain. Les conditions propres à cette annonce sont détaillées dans la section ci-dessus.",
    ...(seed.contactNote
      ? {
          referralContact: {
            heading: "Précision sur le lien ou le parcours de parrainage",
            note: seed.contactNote,
          },
        }
      : {}),
    ...(seed.needsReview
      ? {
          alertBox: {
            title: "À confirmer avant d'utiliser cette annonce",
            paragraphs: [
              seed.contactNote ?? keyCondition,
              "Le montant, la marque ou le parcours doivent être confirmés avec le parrain avant toute inscription, commande ou transmission d'informations.",
            ],
          },
        }
      : {}),
    faq: [
      {
        question: "Quel avantage est annoncé pour le parrainage " + offer.name + " ?",
        answer:
          "L'annonce de parrainage affiche " +
          offer.partnerReward +
          ". La récompense reste soumise aux conditions et à la validation du partenaire.",
      },
      {
        question: "Comment utiliser le code ou le lien de " + offer.name + " ?",
        answer: hasPublicLink
          ? "Commencez le parcours depuis le lien de parrainage de cette fiche, puis réalisez l'action demandée par " +
            offer.name +
            "."
          : hasCode
            ? "Saisissez le code " +
              offer.referralCode +
              " dans le champ prévu par " +
              offer.name +
              " avant de finaliser l'inscription ou la commande."
            : "Le lien n'est pas publié dans l'annonce. Demandez-le au parrain via le formulaire de cette fiche avant toute démarche.",
      },
      {
        question: "Quelles conditions faut-il respecter pour recevoir l'avantage " +
          offer.name +
          " ?",
        answer: keyCondition,
      },
      {
        question: "Quand la récompense " + offer.name + " est-elle versée ?",
        answer:
          "Elle est créditée après l'action qualifiante et la validation par le partenaire. Si un reversement personnel est annoncé, il dépend des modalités du parrain et peut suivre la réception de sa propre prime.",
      },
      {
        question: "Le montant annoncé pour " + offer.name + " est-il garanti ?",
        answer:
          "Non. Le montant dépend de l'éligibilité, des étapes réalisées, de la validation du partenaire et des conditions affichées au moment du parcours. Les compléments personnels ne sont pas payés par le partenaire.",
      },
    ],
    sources: [
      ...(offer.officialWebsiteUrl
        ? [
            source(
              offer.name + " — programme ou site officiel",
              offer.officialWebsiteUrl,
              "official",
            ),
          ]
        : []),
      source(
        "Annonce personnelle " + offer.name + " sur Super Parrain",
        offer.sourceUrl,
        "secondary",
      ),
    ],
    researchedAt,
  };

  if (seed.slug === "bnp") {
    profile.status = "partial";
    profile.seoTitle = "Parrainage BNP Paribas : 80 € + 80 € avec mobilité bancaire";
    profile.metaDescription = "Selon l'annonce du parrain, BNP Paribas propose 80 € de prime et 80 € supplémentaires si la mobilité bancaire est réalisée et validée. Parcours par lien de parrainage.";
    profile.h1 = "Parrainage BNP Paribas : 80 € + 80 € si mobilité bancaire";
    profile.introduction = "Selon l'annonce du parrain, BNP Paribas propose 80 € de prime et 80 € supplémentaires si la mobilité bancaire est réalisée et validée. Commencez le parcours depuis le lien de parrainage affiché sur cette fiche.";
    profile.summary = [
      "Prime annoncée : 80 € à l'ouverture du compte.",
      "Complément annoncé : 80 € si la mobilité bancaire est réalisée et validée.",
      "Parcours : commencez depuis le lien de parrainage de cette fiche.",
      "Conditions annoncées : 10 paiements par carte et validation du partenaire.",
    ];
    profile.referralExplanation = "Ouvrez le lien de parrainage de cette fiche pour démarrer la souscription BNP Paribas. L'annonce prévoit 80 € de prime et 80 € supplémentaires si la mobilité bancaire est réalisée et validée.";
    profile.earnings = "L'annonce indique 80 € de prime à l'ouverture du compte et 80 € supplémentaires si la mobilité bancaire est réalisée et validée.";
    profile.rewardTiming = "Le crédit de la prime et du complément mobilité dépend de la réalisation des opérations demandées et de leur validation par BNP Paribas.";
    profile.faq = [
      {
        question: "Quel avantage est annoncé pour le parrainage BNP Paribas ?",
        answer: "L'annonce du parrain indique 80 € de prime et 80 € supplémentaires si la mobilité bancaire est réalisée et validée.",
      },
      {
        question: "Comment utiliser le lien de BNP Paribas ?",
        answer: "Commencez la souscription en ouvrant le lien de parrainage affiché sur cette fiche.",
      },
      {
        question: "Quelles opérations sont demandées ?",
        answer: "L'annonce indique 10 paiements par carte sans dépôt initial. Le complément mobilité suppose également que le transfert bancaire soit réalisé et validé.",
      },
      {
        question: "Quand les primes sont-elles versées ?",
        answer: "Le versement intervient après la réalisation des opérations et leur validation par BNP Paribas.",
      },
      {
        question: "Le montant annoncé est-il garanti ?",
        answer: "Le montant dépend de l'éligibilité, de la réalisation des conditions et de la validation par le partenaire.",
      },
    ];
    profile.researchedAt = "2026-11-23";
    profile.sources = profile.sources.map((item) => ({ ...item, checkedAt: "2026-11-23" }));
  }

  if (offer.categoryGroup === "Jeux & Paris") {
    profile.alertBox = {
      title: "Réservé aux adultes — jouez de manière responsable",
      paragraphs: [
        "Les jeux d'argent peuvent entraîner des pertes financières et une dépendance. Le bonus de parrainage ne garantit aucun gain ; fixez une limite et ne jouez jamais une somme nécessaire à vos dépenses.",
      ],
    };
    profile.faq = [...(profile.faq ?? []), {
      question: "Le bonus de " + offer.name + " garantit-il un gain ?",
      answer:
        "Non. Une promotion ou un rakeback ne garantit aucun gain : toute mise peut être perdue. L'accès est réservé aux personnes majeures et aux territoires autorisés.",
    }];
  }

  if (offer.categoryGroup === "Investissement & Crypto") {
    profile.alertBox = {
      title: "Investir comporte un risque de perte",
      paragraphs: [
        "Les investissements, le trading et les crypto-actifs peuvent entraîner une perte partielle ou totale du capital. Une récompense de parrainage ne constitue pas un rendement garanti et ne doit pas remplacer l'étude du produit.",
      ],
    };
    profile.faq = [...(profile.faq ?? []), {
      question: "Le parrainage " + offer.name + " protège-t-il contre le risque ?",
      answer:
        "Non. Le bonus éventuel ne réduit pas le risque de perte associé à un investissement ou à un actif volatil. Lisez les frais, les conditions de retrait et les documents du prestataire avant de vous engager.",
    }];
  }

  return profile;
}

export const lot18Profiles: Record<string, OfferSeoProfile> =
  Object.fromEntries(
    superParrainBatch18SeedDetails.map((seed) => [
      seed.slug,
      buildSeoProfile(seed),
    ]),
  );
