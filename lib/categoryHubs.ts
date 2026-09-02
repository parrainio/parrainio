import type { OfferCategory } from "@/data/offers";

export type CategoryHubInfoCard = {
  title: string;
  text: string;
};

export type CategoryHubContent = {
  slug: string;
  group: OfferCategory;
  title: string;
  metaDescription: string;
  h1Lead: string;
  h1Accent: string;
  intro: string[];
  guideTitle: string;
  infoCards: CategoryHubInfoCard[];
};

export const CATEGORY_HUBS: CategoryHubContent[] = [
  {
    slug: "banque-finance",
    group: "Banque & Finance",
    title: "Parrainage Banque & Finance : offres et conditions | Parrainio",
    metaDescription:
      "Offres de parrainage banque, assurance et épargne : comparez les primes, les conditions d'éligibilité et le reversement Parrainio avant d'ouvrir votre compte.",
    h1Lead: "Les offres de parrainage",
    h1Accent: "banque & finance.",
    intro: [
      "Cette catégorie regroupe les offres de parrainage du secteur bancaire et financier : banques en ligne et néobanques, assurances, épargne et assurance-vie, ainsi que des services financiers du quotidien. S'inscrire via un lien ou un code de parrainage permet d'ouvrir un droit à la prime du partenaire, sans frais supplémentaires et au même tarif qu'une inscription classique.",
      "Les mécanismes varient d'un partenaire à l'autre. Certaines offres fonctionnent avec un code à saisir, d'autres avec un lien d'invitation à utiliser avant l'inscription. La prime est généralement conditionnée à l'ouverture d'un compte, parfois à un premier dépôt, à l'activation d'une carte ou à une première opération : chaque fiche détaille les conditions exactes, le délai et le montant.",
      "Avant de vous lancer, vérifiez que vous êtes bien éligible (nouveau client, âge, pays de résidence), notez la date limite et les opérations demandées, puis conservez vos justificatifs. Une fois le parrainage validé par le partenaire, Parrainio peut vous reverser jusqu'à 25 % de la commission reçue, en complément de la prime du partenaire.",
    ],
    guideTitle: "Banque, assurance, épargne : bien choisir son offre.",
    infoCards: [
      {
        title: "Avant de vous inscrire",
        text: "Éligibilité nouveau client, dépôt minimum, délai : chaque fiche résume les conditions à respecter pour débloquer la prime.",
      },
      {
        title: "Code ou lien d'invitation ?",
        text: "Selon le partenaire, le parrainage passe par un code à saisir lors de l'inscription ou par un lien à utiliser avant de créer votre compte.",
      },
      {
        title: "Reversement Parrainio",
        text: "Après validation du parrainage par le partenaire, Parrainio reverse jusqu'à 25 % de la commission reçue.",
      },
    ],
  },
  {
    slug: "shopping-courses",
    group: "Shopping & Courses",
    title: "Parrainage Shopping & Courses : offres et bons plans | Parrainio",
    metaDescription:
      "Offres de parrainage e-commerce, mode, sport et courses : primes, codes et liens d'invitation, conditions détaillées et reversement Parrainio.",
    h1Lead: "Les offres de parrainage",
    h1Accent: "shopping & courses.",
    intro: [
      "Ici se trouvent les offres de parrainage du commerce en ligne : mode, sport et nutrition, maison, jeux, produits pour bébés, ainsi que les courses et l'alimentation. Le principe reste le même que partout ailleurs sur Parrainio : passer par le lien ou le code de parrainage au moment de l'inscription pour débloquer l'avantage du partenaire.",
      "Les avantages prennent des formes très différentes selon les enseignes : réduction sur la première commande, bon d'achat, code promo, invitation à partager ou remboursement sur des achats courants. Certaines offres demandent un minimum de commande, d'autres fonctionnent dès le premier panier. Chaque fiche indique le mécanisme exact, le montant et les conditions.",
      "Avant de valider un achat, vérifiez le montant minimum, les produits ou marques exclus, la durée de validité de l'avantage et sa compatibilité avec les promotions en cours. Une fois le parrainage validé par le partenaire, Parrainio peut vous reverser jusqu'à 25 % de la commission perçue.",
    ],
    guideTitle: "Bon plans shopping : bien comparer avant d'acheter.",
    infoCards: [
      {
        title: "Des avantages variés",
        text: "Réduction de bienvenue, code, bon d'achat ou invitation : chaque enseigne a son propre mécanisme de parrainage.",
      },
      {
        title: "À vérifier avant d'acheter",
        text: "Minimum de commande, exclusions, délai de validité et cumul avec les promotions déjà en cours.",
      },
      {
        title: "Reversement Parrainio",
        text: "Après validation du parrainage par le partenaire, Parrainio reverse jusqu'à 25 % de la commission reçue.",
      },
    ],
  },
  {
    slug: "investissement-crypto",
    group: "Investissement & Crypto",
    title: "Parrainage Investissement & Crypto : offres et bonus | Parrainio",
    metaDescription:
      "Offres de parrainage courtiers, épargne et plateformes crypto : conditions, dépôts et récompenses expliqués, plus le reversement Parrainio.",
    h1Lead: "Les offres de parrainage",
    h1Accent: "investissement & crypto.",
    intro: [
      "Cette catégorie rassemble les plateformes d'investissement et d'épargne, les courtiers et les plateformes de cryptomonnaies. Utiliser un lien ou un code de parrainage ne change rien au fonctionnement du service : il ouvre simplement l'accès à la récompense de bienvenue proposée par le partenaire, lorsque les conditions sont remplies.",
      "Les conditions varient fortement d'une plateforme à l'autre : dépôt initial, premier achat, montant minimum ou volume d'activité peuvent être demandés. Sur les offres crypto, la récompense est parfois versée en actifs : sa valeur évolue alors avec les cours. Chaque fiche détaille le mécanisme, le montant et les étapes avant de vous engager.",
      "Prenez le temps de comparer les frais, l'éligibilité et les conditions de déblocage de la prime, et consultez la documentation officielle du partenaire. Parrainio présente ces offres à titre informatif et ne fournit aucun conseil en investissement. Après validation du parrainage, Parrainio peut vous reverser jusqu'à 25 % de sa commission.",
    ],
    guideTitle: "Investissement : bien comparer avant de s'inscrire.",
    infoCards: [
      {
        title: "Conditions très variables",
        text: "Dépôt initial, premier achat ou volume d'activité : les critères changent selon les plateformes.",
      },
      {
        title: "Récompenses en actifs",
        text: "Sur certaines offres crypto, la récompense suit la valeur du marché : aucun rendement n'est garanti.",
      },
      {
        title: "Reversement Parrainio",
        text: "Après validation du parrainage par le partenaire, Parrainio reverse jusqu'à 25 % de la commission reçue.",
      },
    ],
  },
];

export function getCategoryHub(slug: string): CategoryHubContent | undefined {
  return CATEGORY_HUBS.find((hub) => hub.slug === slug);
}
