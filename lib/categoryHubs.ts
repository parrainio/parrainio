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
  {
    slug: "recompenses-applications",
    group: "Récompenses & Applications",
    title: "Parrainage Récompenses & Applications : offres et bonus | Parrainio",
    metaDescription:
      "Offres de parrainage d'applications récompenses : missions, sondages et programmes de gains, conditions détaillées et reversement Parrainio.",
    h1Lead: "Les offres de parrainage",
    h1Accent: "récompenses & applications.",
    intro: [
      "Cette catégorie regroupe les applications qui récompensent des activités du quotidien : marches, missions locales, sondages, lectures de reçus ou micro-tâches. S'inscrire via le lien ou le code de parrainage ouvre l'accès à l'avantage de bienvenue du partenaire, sans changer le fonctionnement de l'application.",
      "Les gains prennent des formes variées selon les plateformes : points convertibles en cadeaux, argent versé sur un compte, seuil de retrait à atteindre ou prime après une première mission validée. Certaines applications créditent l'avantage dès l'inscription, d'autres après une activité minimum. Chaque fiche détaille le mécanisme et les conditions.",
      "Avant de vous inscrire, vérifiez l'éligibilité nouveau membre, le seuil minimum de retrait et la forme des récompenses. Une fois le parrainage validé par le partenaire, Parrainio peut vous reverser jusqu'à 25 % de la commission reçue, en complément de vos gains sur l'application.",
    ],
    guideTitle: "Applications rémunérées : bien démarrer avec les offres.",
    infoCards: [
      {
        title: "Des gains variables",
        text: "Points, euros ou cadeaux : la forme des récompenses et le seuil de retrait changent selon chaque application.",
      },
      {
        title: "Missions et conditions",
        text: "Certaines offres exigent une première mission validée ou une activité minimum avant de débloquer l'avantage.",
      },
      {
        title: "Reversement Parrainio",
        text: "Après validation du parrainage par le partenaire, Parrainio reverse jusqu'à 25 % de la commission reçue.",
      },
    ],
  },
  {
    slug: "jeux-paris",
    group: "Jeux & Paris",
    title: "Parrainage Jeux & Paris : offres et bonus | Parrainio",
    metaDescription:
      "Offres de parrainage paris sportifs et jeux en ligne : freebets, conditions d'éligibilité chez les opérateurs agréés et reversement Parrainio.",
    h1Lead: "Les offres de parrainage",
    h1Accent: "jeux & paris.",
    intro: [
      "Cette catégorie rassemble les opérateurs de paris sportifs et de jeux en ligne qui proposent un programme de parrainage. Utiliser le lien ou le code d'un parrain permet de débloquer le bonus de bienvenue du partenaire, généralement sous forme de freebet, selon les conditions propres à chaque opérateur.",
      "Les conditions portent souvent sur l'inscription complète, la vérification d'identité, un premier dépôt ou un premier pari dans des limites définies. Un freebet n'est pas toujours retirable en argent : seule la part éventuellement gagnée peut l'être. Chaque fiche résume le mécanisme, le montant et les étapes exactes.",
      "Les jeux d'argent et de hasard sont strictement réservés aux personnes majeures et comportent des risques : endettement, isolement, dépendance. Pour être aidé, appelez le 09 74 75 13 13 (appel non surtaxé). Une fois le parrainage validé par le partenaire, Parrainio peut vous reverser jusqu'à 25 % de la commission reçue.",
    ],
    guideTitle: "Paris et jeux en ligne : les conditions avant de commencer.",
    infoCards: [
      {
        title: "Joueurs majeurs uniquement",
        text: "Les jeux d'argent sont interdits aux mineurs : identité, âge et résidence sont vérifiés par les opérateurs agréés.",
      },
      {
        title: "Freebets et conditions",
        text: "Le bonus prend souvent la forme d'un freebet non retirable en cash : lisez les conditions de mise avant de jouer.",
      },
      {
        title: "Jouer avec modération",
        text: "Les jeux comportent des risques : fixez-vous des limites et n'engagez jamais une somme dont vous avez besoin.",
      },
      {
        title: "Reversement Parrainio",
        text: "Après validation du parrainage par le partenaire, Parrainio reverse jusqu'à 25 % de la commission reçue.",
      },
    ],
  },
  {
    slug: "cashback",
    group: "Cashback",
    title: "Parrainage Cashback : offres et bons plans | Parrainio",
    metaDescription:
      "Offres de parrainage des plateformes de cashback : bonus de bienvenue, conditions de validation et reversement Parrainio sur vos achats.",
    h1Lead: "Les offres de parrainage",
    h1Accent: "cashback.",
    intro: [
      "Cette catégorie regroupe les plateformes de cashback, qui remboursent un pourcentage des achats effectués chez leurs commerçants partenaires. Passer par le lien ou le code de parrainage ouvre l'accès au bonus de bienvenue du partenaire, sans modifier le fonctionnement habituel du service.",
      "Le bonus de bienvenue est souvent conditionné à une première commande validée ou à un montant minimum de cashback cumulé. Le remboursement peut mettre du temps à être confirmé par le marchand avant d'être disponible au retrait. Chaque fiche précise les seuils, les délais et les exclusions éventuelles.",
      "Avant de choisir, comparez le bonus de bienvenue, le réseau de marchands et les conditions de retrait de chaque plateforme. Une fois le parrainage validé par le partenaire, Parrainio peut vous reverser jusqu'à 25 % de la commission reçue, en complément de votre cashback.",
    ],
    guideTitle: "Cashback : bien choisir sa plateforme de départ.",
    infoCards: [
      {
        title: "Bonus de bienvenue",
        text: "Souvent crédité après une première commande validée ou un montant minimum de cashback cumulé.",
      },
      {
        title: "Délais de validation",
        text: "Le cashback est confirmé par le marchand avant d'être disponible : comptez quelques semaines selon les achats.",
      },
      {
        title: "Reversement Parrainio",
        text: "Après validation du parrainage par le partenaire, Parrainio reverse jusqu'à 25 % de la commission reçue.",
      },
    ],
  },
  {
    slug: "energie",
    group: "Énergie",
    title: "Parrainage Énergie : offres et bonus | Parrainio",
    metaDescription:
      "Offres de parrainage fournisseurs d'énergie et services électriques : primes, conditions de souscription et reversement Parrainio.",
    h1Lead: "Les offres de parrainage",
    h1Accent: "énergie.",
    intro: [
      "Cette catégorie rassemble les fournisseurs d'électricité et de gaz ainsi que des services liés à l'énergie, comme les solutions de recharge pour véhicules électriques. Souscrire via le lien ou le code de parrainage donne droit à la prime du partenaire, sans changer les tarifs ni les conditions du contrat.",
      "La prime est généralement versée après la souscription effective du contrat, parfois sur des offres précises : offre duo électricité-gaz, contrat vert ou installation d'un équipement. Entre la souscription et l'activation, plusieurs semaines peuvent s'écouler. Chaque fiche détaille les offres concernées et les délais.",
      "Avant de changer de fournisseur, vérifiez les conditions de résiliation de votre contrat actuel et le périmètre exact de la prime. Une fois le parrainage validé par le partenaire, Parrainio peut vous reverser jusqu'à 25 % de la commission reçue, en complément de la prime du partenaire.",
    ],
    guideTitle: "Énergie : les points à vérifier avant de souscrire.",
    infoCards: [
      {
        title: "Prime à la souscription",
        text: "La prime est versée après l'activation effective du contrat, parfois uniquement sur certaines offres.",
      },
      {
        title: "Avant de changer",
        text: "Vérifiez les conditions de résiliation de votre contrat actuel et l'offre concernée par la prime.",
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

/**
 * Hub dédié existant pour un groupe de catégorie.
 * Renvoie undefined si le groupe n'a pas encore de page dédiée :
 * aucune page ne doit alors lier vers un hub inexistant.
 */
export function getCategoryHubForGroup(
  group: OfferCategory
): CategoryHubContent | undefined {
  return CATEGORY_HUBS.find((hub) => hub.group === group);
}
