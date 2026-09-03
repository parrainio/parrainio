import type { OfferCategory } from "@/data/offers";

export type CategoryHubInfoCard = {
  title: string;
  text: string;
};

export type CategoryHubCrossLink = {
  slug: string;
  label: string;
};

export type CategoryHubContent = {
  slug: string;
  group: OfferCategory;
  title: string;
  metaDescription: string;
  h1Lead: string;
  h1Accent: string;
  /** Paragraphes d'ouverture : le 1er s'affiche dans le hero, les suivants dans le guide. */
  intro: string[];
  /** Paragraphes éditoriaux du guide. Supporte les liens inline : [ancre](/chemin). */
  editorial: string[];
  /** Paragraphe de conclusion menant naturellement vers les offres. */
  conclusion: string;
  guideTitle: string;
  infoCards: CategoryHubInfoCard[];
  /** Liens croisés curatés vers 3–4 autres hubs sémantiquement proches. */
  hubLinks: CategoryHubCrossLink[];
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
      "Avant de vous lancer, vérifiez que vous êtes bien éligible (nouveau client, âge, pays de résidence), notez la date limite et les opérations demandées, puis conservez vos justificatifs.",
    ],
    editorial: [
      "La plupart des offres de la catégorie tournent autour de l'ouverture d'un compte : banque en ligne, néobanque, compte joint ou solution pour indépendants. Les primes de bienvenue sont le plus souvent conditionnées à une activation de carte, à quelques paiements effectués dans les premiers mois ou à un versement initial sur le compte. Les cartes et les moyens de paiement associés suivent ensuite les mêmes règles que lors d'une souscription classique.",
      "Changer d'établissement est plus simple qu'on ne l'imagine : la mobilité bancaire transfère automatiquement virements permanents et prélèvements sur demande. L'épargne suit une logique voisine — assurance-vie, plans d'épargne et courtiers en ligne ouvent un droit à prime selon les versements réalisés. Autour de ces offres gravitent des services financiers du quotidien : paiements à l'étranger, transferts internationaux ou outils de gestion pour les indépendants.",
      "La carte est souvent le cœur de l'offre : paiement sans contact, paiements à l'étranger sans frais sur certaines cartes, application de gestion en temps réel. Les primes de bienvenue récompensent généralement l'adoption de cette carte — quelques paiements dans les premiers mois suffisent parfois, ce qui rend l'offre accessible sans bouleverser vos habitudes de paiement.",
      "Pour comparer efficacement, regardez au-delà de la prime annoncée : frais de tenue de compte, conditions de revenus exigées, délai de versement et stabilité de l'établissement. [Les offres d'investissement et de crypto](/categories/investissement-crypto), souvent complémentaires d'un compte bancaire solide, font l'objet d'une catégorie dédiée sur Parrainio.",
    ],
    conclusion:
      "Parcourez les fiches de la catégorie à votre rythme : chacune résume la prime du partenaire, les conditions d'ouverture et les étapes à suivre, pour repérer l'offre qui correspond vraiment à votre projet.",
    guideTitle: "Banque, assurance, épargne : bien choisir son offre.",
    infoCards: [
      {
        title: "Conditions d'ouverture",
        text: "Premier dépôt, activation de carte ou paiements dans les mois qui suivent : les critères changent d'une banque à l'autre.",
      },
      {
        title: "Mobilité bancaire",
        text: "Le changement d'établissement est accompagné : virements et prélèvements peuvent être transférés automatiquement sur demande.",
      },
      {
        title: "Reversement Parrainio",
        text: "Une fois le parrainage validé par le partenaire, Parrainio reverse une partie de sa commission, jusqu'à 25 %.",
      },
    ],
    hubLinks: [
      { slug: "investissement-crypto", label: "Découvrir les offres Investissement & Crypto" },
      { slug: "cashback", label: "Voir les offres de cashback" },
      { slug: "recompenses-applications", label: "Explorer les offres Récompenses & Applications" },
      { slug: "shopping-courses", label: "Comparer les offres Shopping & Courses" },
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
      "Avant de valider un achat, vérifiez le montant minimum, les produits ou marques exclus, la durée de validité de l'avantage et sa compatibilité avec les promotions en cours.",
    ],
    editorial: [
      "Les enseignes de la catégorie couvrent l'essentiel des achats en ligne : boutiques spécialisées et marketplaces se côtoient, avec des univers très éloignés d'une fiche à l'autre. Les mécanismes de parrainage s'adaptent d'ailleurs à chacun de ces modèles — un code à saisir au paiement chez l'un, une invitation à suivre avant la création du compte chez l'autre.",
      "La réduction de bienvenue s'applique dans la majorité des cas sur la première commande, parfois dès le premier panier sans minimum d'achat. Certains sites réservent l'avantage à une catégorie de produits ou l'excluent des ventes flash : une lecture rapide des conditions évite les mauvaises surprises au moment de payer.",
      "Marketplaces généralistes et boutiques spécialisées ne se valent pas non plus côté parrainage : les grandes enseignes renouvellent souvent leurs offres de bienvenue au fil des saisons — rentrée, fêtes, soldes — tandis que les boutiques de niche misent sur un avantage stable et simple à comprendre. Un même produit peut ainsi donner lieu à plusieurs scénarios avantageux selon le moment et l'enseigne choisis.",
      "Autre réflexe utile : comparer l'offre de parrainage avec les autres leviers de réduction. Les plateformes de [cashback remboursent une partie des achats](/categories/cashback) effectués chez leurs marchands partenaires, et se combinent parfois avec les bons plans des enseignes elles-mêmes.",
    ],
    conclusion:
      "Prenez quelques minutes avant votre prochaine commande : bonus, conditions et étapes sont résumés fiche par fiche pour choisir l'offre la plus avantageuse au moment d'acheter.",
    guideTitle: "Bon plans shopping : bien comparer avant d'acheter.",
    infoCards: [
      {
        title: "Réductions de bienvenue",
        text: "Code promo, bon d'achat ou remise automatique : chaque enseigne a son propre mécanisme de parrainage.",
      },
      {
        title: "Commandes éligibles",
        text: "Minimum de commande, exclusions de marques et cumul avec les soldes : à vérifier avant de finaliser l'achat.",
      },
      {
        title: "Reversement Parrainio",
        text: "Parrainage validé par le partenaire, reversement en plus : Parrainio cède une part de sa commission, jusqu'à 25 %.",
      },
    ],
    hubLinks: [
      { slug: "cashback", label: "Voir les offres de cashback" },
      { slug: "recompenses-applications", label: "Explorer les offres Récompenses & Applications" },
      { slug: "banque-finance", label: "Découvrir les offres Banque & Finance" },
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
      "Prenez le temps de comparer les frais, l'éligibilité et les conditions de déblocage de la prime, et consultez la documentation officielle du partenaire. Parrainio présente ces offres à titre informatif et ne fournit aucun conseil en investissement.",
    ],
    editorial: [
      "Courtiers en ligne, applications d'investissement programmé, plateformes d'épargne et places de marché d'actifs numériques : la catégorie couvre des services très différents, du versement régulier sur un plan d'épargne à l'achat ponctuel de cryptomonnaies. Les bonus de bienvenue y suivent presque toujours le même schéma : créer un compte, passer la vérification d'identité, puis réaliser l'opération attendue.",
      "Cette opération peut être un premier versement, un premier achat ou un volume minimal d'activité sur une période donnée. Le montant de la récompense dépend ensuite de la plateforme, parfois du niveau du dépôt — et il reste dans tous les cas distinct de la performance du placement lui-même : la prime est un bonus de bienvenue, pas un rendement.",
      "Sur les actifs numériques, la volatilité est la règle : une récompense versée en crypto suit les cours, à la hausse comme à la baisse. Avant de vous inscrire, lisez les frais, les supports disponibles, les conditions de retrait et la réglementation applicable à votre situation.",
      "Le choix d'une plateforme se joue rarement sur le bonus seul. L'univers proposé (actions, ETF, immobilier, crypto), la clarté des frais, la qualité de l'application et les modalités de dépôt-retrait pèsent durablement plus que la prime d'arrivée. Traitez le bonus comme un complément : il récompense une inscription que vous auriez de toute façon jugée sur les fondamentaux.",
    ],
    conclusion:
      "Comparez les plateformes de la catégorie sans précipitation : chaque fiche détaille les conditions d'inscription, la récompense annoncée et les vérifications à anticiper avant le premier versement.",
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
        text: "Le parrainage validé, Parrainio reverse une part de la commission reçue, jusqu'à 25 %.",
      },
    ],
    hubLinks: [
      { slug: "banque-finance", label: "Découvrir les offres Banque & Finance" },
      { slug: "recompenses-applications", label: "Explorer les offres Récompenses & Applications" },
      { slug: "cashback", label: "Voir les offres de cashback" },
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
      "Avant de vous inscrire, vérifiez l'éligibilité nouveau membre, le seuil minimum de retrait et la forme des récompenses.",
    ],
    editorial: [
      "Applications de marche rémunérée, missions géolocalisées, sondages d'opinion, lecture de reçus de courses ou mini-jeux : ces plateformes monétisent des activités du quotidien. Le parrainage y est particulièrement répandu, car chaque nouveau membre actif fait progresser la communauté — d'où des avantages de bienvenue souvent généreux.",
      "Le fonctionnement est partout comparable : installer l'application, créer un compte, puis cumuler des points ou des euros selon les tâches réalisées. L'avantage lié au parrainage arrive soit immédiatement, soit après une première mission ou un premier sondage validé : c'est ce déclencheur qu'il faut identifier avant de commencer.",
      "Le point de vigilance principal est le seuil de retrait. Certaines applications versent dès quelques euros, d'autres imposent un palier plus élevé ou des contreparties précises (cartes cadeaux, paliers de points). Les récompenses restent modestes par nature : rapportez toujours le gain au temps réellement consacré, et privilégiez les activités que vous pouvez intégrer à vos habitudes.",
      "Côté organisation, inutile d'installer dix applications d'un coup : commencez par une ou deux adaptées à vos trajets et à vos achats, validez l'avantage de bienvenue, puis élargissez si le format vous convient. Les missions et sondages évoluent régulièrement, et les notifications restent le meilleur moyen de repérer les tâches les mieux rémunérées au moment où elles apparaissent.",
      "Beaucoup de membres cumulent ces applications avec du [cashback sur leurs achats](/categories/cashback) : les deux mécanismes se complètent bien, à condition de suivre les conditions propres à chacun.",
    ],
    conclusion:
      "Explorez les applications de la catégorie : chaque fiche explique les missions, la forme des récompenses et les conditions de déblocage, pour choisir celles qui collent à votre quotidien.",
    guideTitle: "Applications rémunérées : bien démarrer avec les offres.",
    infoCards: [
      {
        title: "Des gains variables",
        text: "Points, euros ou cartes cadeaux : la forme des récompenses et les paliers de retrait changent selon l'application.",
      },
      {
        title: "Missions et déclencheurs",
        text: "L'avantage de bienvenue est parfois conditionné à une première mission ou à un premier sondage validé.",
      },
      {
        title: "Reversement Parrainio",
        text: "Après validation du parrainage, Parrainio vous reverse une partie de sa commission, jusqu'à 25 %.",
      },
    ],
    hubLinks: [
      { slug: "cashback", label: "Voir les offres de cashback" },
      { slug: "shopping-courses", label: "Comparer les offres Shopping & Courses" },
      { slug: "banque-finance", label: "Découvrir les offres Banque & Finance" },
      { slug: "jeux-paris", label: "Voir les offres Jeux & Paris" },
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
      "Les jeux d'argent et de hasard sont strictement réservés aux personnes majeures et comportent des risques : endettement, isolement, dépendance. Pour être aidé, appelez le 09 74 75 13 13 (appel non surtaxé).",
    ],
    editorial: [
      "Paris sportifs, courses hippiques, poker et jeux de grille : les opérateurs présents dans cette catégorie sont agréés en France et soumis à un encadrement strict. Le parrainage y prend presque toujours la même forme — un bonus de bienvenue pour le nouveau joueur, le parrain étant récompensé en parallèle par l'opérateur.",
      "Les conditions de déblocage méritent une lecture attentive : inscription complète avec vérification d'identité, premier dépôt, premier pari respectant des limites de cote ou de montant, délai d'utilisation du bonus. Le freebet, forme la plus courante, n'est pas retirable en cash : seule la part gagnée peut l'être, et les conditions de mise diffèrent d'un opérateur à l'autre.",
      "Les formats de jeux varient aussi bien plus qu'on ne le croit : paris sportifs sur le football et le tennis, courses hippiques, grilles et tirages, poker. Les promotions suivent le calendrier sportif — grandes compétitions, tournois majeurs — et certaines offres de bienvenue se renforcent temporairement à ces occasions. Le bonus affiché au moment de votre inscription est donc celui qu'il faut relire, même si vous avez comparé la même offre quelques semaines plus tôt.",
      "Comparer les offres reste utile, mais avec prudence : un bonus élevé ne signifie pas des conditions favorables. Regardez les restrictions — cotes minimales, sports ou types de paris concernés, délais — avant de vous inscrire. Fixez-vous des limites de temps et de budget, et ne jouez jamais une somme dont vous avez besoin.",
    ],
    conclusion:
      "Parcourez les fiches de la catégorie pour comparer les bonus de bienvenue et leurs conditions en toute clarté, et n'oubliez pas : jouer doit rester un divertissement.",
    guideTitle: "Paris et jeux en ligne : les conditions avant de commencer.",
    infoCards: [
      {
        title: "Joueurs majeurs uniquement",
        text: "Les jeux d'argent sont interdits aux mineurs : identité, âge et résidence sont vérifiés par les opérateurs agréés.",
      },
      {
        title: "Freebets et conditions",
        text: "Le bonus prend souvent la forme d'un freebet non retirable : lisez les conditions de mise avant de jouer.",
      },
      {
        title: "Jouer avec modération",
        text: "Les jeux comportent des risques : fixez-vous des limites. Besoin d'aide ? 09 74 75 13 13 (appel non surtaxé).",
      },
      {
        title: "Reversement Parrainio",
        text: "Le parrainage validé par l'opérateur, Parrainio vous reverse une fraction de sa commission, jusqu'à 25 %.",
      },
    ],
    hubLinks: [
      { slug: "recompenses-applications", label: "Explorer les offres Récompenses & Applications" },
      { slug: "cashback", label: "Voir les offres de cashback" },
      { slug: "banque-finance", label: "Découvrir les offres Banque & Finance" },
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
      "Avant de choisir, comparez le bonus de bienvenue, le réseau de marchands et les conditions de retrait de chaque plateforme.",
    ],
    editorial: [
      "Le principe du cashback tient en une phrase : passer par la plateforme avant d'acheter chez un marchand partenaire, puis recevoir une fraction du montant dépensé. Cette récompense s'exprime en pourcentage, très variable selon les marchands, les univers de produits et les périodes promotionnelles.",
      "Trois étapes conditionnent le crédit de votre remboursement : activer l'offre ou cliquer depuis la plateforme, payer normalement, puis attendre la confirmation du marchand. C'est ce délai de validation — parfois plusieurs semaines après l'expédition de la commande — qui distingue le cashback d'une réduction immédiate en caisse.",
      "Les exclusions font partie du jeu : retours et annulations, certains rayons produits ou l'usage de codes non autorisés peuvent annuler le remboursement. Le cumul avec d'autres mécanismes — réduction de bienvenue d'une enseigne, parrainage d'une boutique — dépend des règles de chaque marchand et de chaque plateforme : vérifiez avant d'empiler.",
      "Les taux de remboursement se lisent toujours au cas par cas : un pourcentage élevé sur un rayon étroit vaut parfois moins qu'un taux modeste sur vos achats récurrents. Avant de créer un compte, identifiez la plateforme dont le réseau de marchands recouvre vos dépenses habituelles — c'est le volume d'achats éligibles, plus que le taux maximal, qui détermine le gain réel sur une année.",
      "Pour aller plus loin dans les économies, explorez les [offres shopping et courses](/categories/shopping-courses) : les enseignes partenaires y proposent leurs propres avantages de bienvenue, complémentaires du cashback.",
    ],
    conclusion:
      "Comparez les plateformes de la catégorie : bonus d'arrivée, réseau de marchands et modalités de retrait sont résumés fiche par fiche pour choisir celle qui correspond à vos habitudes d'achat.",
    guideTitle: "Cashback : bien choisir sa plateforme de départ.",
    infoCards: [
      {
        title: "Bonus d'arrivée",
        text: "Souvent crédité après une première commande validée ou un montant minimum de cashback cumulé.",
      },
      {
        title: "Délais de validation",
        text: "Le remboursement est confirmé par le marchand avant d'être disponible : comptez quelques semaines selon les achats.",
      },
      {
        title: "Reversement Parrainio",
        text: "Parrainage validé, reversement en plus : Parrainio cède une part de sa commission, jusqu'à 25 %.",
      },
    ],
    hubLinks: [
      { slug: "shopping-courses", label: "Comparer les offres Shopping & Courses" },
      { slug: "recompenses-applications", label: "Explorer les offres Récompenses & Applications" },
      { slug: "banque-finance", label: "Découvrir les offres Banque & Finance" },
      { slug: "energie", label: "Voir les offres Énergie" },
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
      "Avant de changer de fournisseur, vérifiez les conditions de résiliation de votre contrat actuel et le périmètre exact de la prime.",
    ],
    editorial: [
      "Électricité, gaz et services de recharge pour véhicules électriques : la catégorie réunit des acteurs dont le point commun est d'accompagner la consommation énergétique du foyer. Changer de fournisseur d'électricité ou de gaz est gratuit et sans coupure — le nouveau contrat prend simplement le relais à la date convenue, sans intervention sur votre installation.",
      "Les primes de bienvenue sont attachées à une souscription effective, parfois limitée à certaines offres : contrat groupé électricité-gaz, offre d'énergie verte, mise en service d'une borne de recharge. Le calendrier compte aussi : entre la signature et la mise en service, puis jusqu'au versement de la prime, plusieurs semaines peuvent s'écouler selon le partenaire.",
      "Le marché distingue plusieurs familles d'offres : contrats à prix indexé, à prix fixe sur une ou plusieurs années, offres d'énergie verte avec garantie d'origine, ou formules groupées électricité et gaz. À ces contrats s'ajoutent des services spécialisés, comme les solutions de recharge destinées aux véhicules électriques, qui suivent leur propre logique d'installation et de prime.",
      "Avant de souscrire, identifiez la nature exacte de l'offre : prix indexé ou fixe, durée d'engagement éventuelle, services inclus. La prime de bienvenue ne doit jamais être le seul critère de choix — le niveau du prix au kWh et l'adéquation à votre consommation pèsent bien davantage sur la facture annuelle.",
    ],
    conclusion:
      "Parcourez les offres de la catégorie : fournisseurs, primes et conditions de souscription sont détaillés fiche par fiche pour changer de contrat en connaissance de cause.",
    guideTitle: "Énergie : les points à vérifier avant de souscrire.",
    infoCards: [
      {
        title: "Prime à la souscription",
        text: "La prime arrive après l'activation effective du contrat, parfois uniquement sur certaines offres du fournisseur.",
      },
      {
        title: "Changement sans coupure",
        text: "Résilier n'est plus à votre charge : le nouveau fournisseur reprend le contrat à la date convenue, sans interruption.",
      },
      {
        title: "Reversement Parrainio",
        text: "Le parrainage validé, Parrainio vous reverse une part de sa commission, jusqu'à 25 %.",
      },
    ],
    hubLinks: [
      { slug: "banque-finance", label: "Découvrir les offres Banque & Finance" },
      { slug: "cashback", label: "Voir les offres de cashback" },
      { slug: "recompenses-applications", label: "Explorer les offres Récompenses & Applications" },
    ],
  },
  {
    slug: "voyage-mobilite",
    group: "Voyage & Mobilité",
    title: "Parrainage Voyage & Mobilité : offres et bons plans | Parrainio",
    metaDescription:
      "Offres de parrainage voyage et mobilité : hébergements, hôtes, covoiturage et vélos électriques — conditions, déclencheurs et reversement Parrainio.",
    h1Lead: "Les offres de parrainage",
    h1Accent: "voyage & mobilité.",
    intro: [
      "Cette catégorie réunit les offres de parrainage liées aux déplacements : réservation d'hébergements côté voyageurs comme côté hôtes, covoiturage quotidien et mobilité urbaine. Utiliser le lien ou le code de parrainage ne change rien au prix payé : il ouvre simplement l'accès à l'avantage de bienvenue du partenaire, lorsque les conditions sont remplies.",
      "Les mécanismes varient selon les services : certains créditent l'avantage après une première réservation terminée, d'autres après un premier trajet ou une première commande. Délais, éligibilité et forme de la récompense changent d'un partenaire à l'autre : chaque fiche détaille le fonctionnement exact.",
    ],
    editorial: [
      "Côté voyages, deux profils sont concernés : le voyageur qui réserve un hébergement et l'hôte qui en propose un. Les deux disposent de leur propre programme, avec des conditions distinctes — première réservation pour l'un, premières locations qualifiantes pour l'autre. Vérifiez bien le programme auquel votre inscription donne droit, car un compte ne cumule pas les deux avantages.",
      "La mobilité du quotidien suit une logique différente : covoiturage et vélos électriques sont des services récurrents plutôt que des réservations ponctuelles. L'avantage de bienvenue y est souvent déclenché par un premier trajet ou une première commande, ce qui rend ces offres accessibles sans engagement important.",
      "Avant de valider votre inscription, notez la durée de validité de l'avantage, les montants minimums éventuels et les exclusions. Pour compléter votre budget déplacements, certaines plateformes de [cashback remboursent aussi une partie des achats du quotidien](/categories/cashback) : les deux mécanismes peuvent se cumuler sous conditions.",
    ],
    conclusion:
      "Parcourez les fiches de la catégorie : conditions, délais et formes d'avantage sont résumés pour chaque partenaire, afin de préparer votre prochaine réservation ou votre premier trajet en toute clarté.",
    guideTitle: "Voyage et mobilité : bien préparer ses réservations.",
    infoCards: [
      {
        title: "Côté voyageur ou côté hôte",
        text: "Les programmes sont distincts : vérifiez celui auquel votre inscription donne droit avant de commencer.",
      },
      {
        title: "Première réservation ou premier trajet",
        text: "L'avantage est généralement déclenché par une première utilisation validée du service.",
      },
      {
        title: "Reversement Parrainio",
        text: "Une fois le parrainage validé, Parrainio partage avec vous une partie de sa commission, jusqu'à 25 %.",
      },
    ],
    hubLinks: [
      { slug: "shopping-courses", label: "Comparer les offres Shopping & Courses" },
      { slug: "recompenses-applications", label: "Explorer les offres Récompenses & Applications" },
      { slug: "cashback", label: "Voir les offres de cashback" },
    ],
  },
  {
    slug: "services-numeriques",
    group: "Services numériques",
    title: "Parrainage Services numériques : offres et avantages | Parrainio",
    metaDescription:
      "Offres de parrainage hébergement web, freelance et outils en ligne : avantages de bienvenue, conditions d'éligibilité et reversement Parrainio.",
    h1Lead: "Les offres de parrainage",
    h1Accent: "services numériques.",
    intro: [
      "Ici se trouvent les services en ligne pour projets web et professionnels : hébergement de sites, plateformes de services freelance et outils pour entrepreneurs. S'inscrire via le lien ou le code de parrainage ouvre l'accès à l'avantage du partenaire, sans changer le tarif ni le fonctionnement du service.",
      "La forme de l'avantage dépend du service : réduction sur une première souscription d'hébergement, bonus après une première mission ou un premier achat, avantage lié à l'activation d'un abonnement. Chaque fiche précise le mécanisme, le montant et les conditions d'éligibilité.",
    ],
    editorial: [
      "L'hébergement web fonctionne par abonnement : l'avantage de bienvenue s'applique généralement sur la première période facturée. C'est le bon moment pour comparer, car l'inscription initiale concentre souvent les conditions les plus favorables — à condition de vérifier les tarifs de renouvellement et la durée d'engagement éventuelle.",
      "Les plateformes de services freelance récompensent la première commande passée ou la première mission publiée : le déclencheur est l'activité réelle, pas seulement l'inscription. Les outils pour entrepreneurs suivent une logique voisine, avec des avantages parfois réservés à un plan ou à une durée d'abonnement précise.",
      "Avant de vous engager, lisez les conditions : éligibilité nouveau client, délai de validation, produits ou plans concernés. Pour les dépenses professionnelles récurrentes, les offres de [banque et finance dédiées aux indépendants](/categories/banque-finance) peuvent compléter utilement ces services en ligne.",
    ],
    conclusion:
      "Comparez les fiches de la catégorie : chaque service y est résumé avec son mécanisme de parrainage et ses conditions, pour choisir celui qui correspond à votre projet.",
    guideTitle: "Services numériques : choisir et activer le bon service.",
    infoCards: [
      {
        title: "Déclencheurs variables",
        text: "Première souscription, première mission ou premier achat : l'avantage n'arrive qu'après le déclencheur prévu.",
      },
      {
        title: "Renouvellement des abonnements",
        text: "Vérifiez le tarif après la première période et la durée d'engagement avant de souscrire.",
      },
      {
        title: "Reversement Parrainio",
        text: "Parrainage accepté par le partenaire, Parrainio vous restitue une fraction de sa commission, jusqu'à 25 %.",
      },
    ],
    hubLinks: [
      { slug: "shopping-courses", label: "Comparer les offres Shopping & Courses" },
      { slug: "recompenses-applications", label: "Explorer les offres Récompenses & Applications" },
      { slug: "banque-finance", label: "Découvrir les offres Banque & Finance" },
    ],
  },
  {
    slug: "telephone-internet",
    group: "Téléphone & Internet",
    title: "Parrainage Téléphone & Internet : offres et avantages | Parrainio",
    metaDescription:
      "Offre de parrainage forfait mobile et internet : conditions d'éligibilité, activation de la ligne et reversement Parrainio.",
    h1Lead: "Les offres de parrainage",
    h1Accent: "téléphone & internet.",
    intro: [
      "Une catégorie resserrée, dédiée aux offres mobiles et internet : souscrire via le lien ou le code de parrainage donne droit à l'avantage du partenaire, sans modifier le prix ni les conditions de l'offre.",
      "Le principe est simple : activez votre offre avec le parrainage, puis attendez la validation prévue par l'opérateur. Le délai, la forme de l'avantage et les conditions d'éligibilité — notamment la création d'une nouvelle ligne — sont détaillés sur la fiche.",
    ],
    editorial: [
      "Avant de souscrire, vérifiez trois points : l'éligibilité nouvelle ligne (une offre existante ne compte généralement pas), la durée de validité du parrainage et le délai de versement de l'avantage après activation. Le prix et les caractéristiques du forfait restent identiques à une souscription classique : le parrainage est un bonus, jamais un changement de conditions.",
    ],
    conclusion:
      "Consultez la fiche de l'offre pour connaître le mécanisme exact et les conditions du moment, puis souscrivez en connaissance de cause.",
    guideTitle: "Forfaits mobiles : les conditions avant de souscrire.",
    infoCards: [
      {
        title: "Nouvelle ligne requise",
        text: "L'avantage concerne généralement la création d'une nouvelle ligne, pas une offre déjà existante.",
      },
      {
        title: "Reversement Parrainio",
        text: "Parrainage confirmé, Parrainio reverse sur votre compte une part de sa commission, jusqu'à 25 %.",
      },
    ],
    hubLinks: [
      { slug: "banque-finance", label: "Découvrir les offres Banque & Finance" },
      { slug: "shopping-courses", label: "Comparer les offres Shopping & Courses" },
      { slug: "recompenses-applications", label: "Explorer les offres Récompenses & Applications" },
    ],
  },
  {
    slug: "autres-bons-plans",
    group: "Autres bons plans",
    title: "Parrainage Autres bons plans : offres et bons plans | Parrainio",
    metaDescription:
      "Une sélection d'offres de parrainage hors des grandes catégories : réservations du quotidien et services de proximité, conditions et reversement Parrainio.",
    h1Lead: "Les offres de parrainage",
    h1Accent: "autres bons plans.",
    intro: [
      "Cette page rassemble une petite sélection d'offres qui ne rentrent dans aucune grande famille du site : réserver une table dans un restaurant et faire garder son animal. Le principe Parrainio reste identique : utilisez le lien ou le code de parrainage lors de l'inscription pour ouvrir l'avantage du partenaire.",
      "Chaque service a son propre déclencheur : première réservation confirmée pour l'un, première garde validée pour l'autre. Les conditions — éligibilité, délais, forme de l'avantage — sont précisées sur chaque fiche.",
    ],
    editorial: [
      "Ces offres sont volontairement peu nombreuses : plutôt que de forcer des classements artificiels, Parrainio les réunit ici tant que leur univers respectif ne justifie pas une catégorie dédiée. Si l'une de ces familles s'étoffe, elle pourra à terme disposer de sa propre page.",
      "Avant de vous inscrire, vérifiez les conditions propres à chaque service : zones couvertes, critères d'éligibilité, minimum d'utilisation, durée de validité de l'avantage. La qualité du service doit rester le critère principal — l'avantage de parrainage ne change rien au tarif pratiqué.",
    ],
    conclusion:
      "Deux fiches, deux univers : lisez les conditions de chacune pour savoir si l'offre correspond à vos projets du moment.",
    guideTitle: "Autres bons plans : deux offres à découvrir.",
    infoCards: [
      {
        title: "Des offres choisies",
        text: "Cette catégorie accueille les services qui n'ont pas encore leur place ailleurs, sans classement forcé.",
      },
      {
        title: "Conditions spécifiques",
        text: "Zones desservies, éligibilité et déclencheurs varient : chaque fiche détaille le fonctionnement.",
      },
      {
        title: "Reversement Parrainio",
        text: "Dès que le partenaire valide le parrainage, Parrainio vous redistribue une partie de sa commission, jusqu'à 25 %.",
      },
    ],
    hubLinks: [
      { slug: "shopping-courses", label: "Comparer les offres Shopping & Courses" },
      { slug: "cashback", label: "Voir les offres de cashback" },
      { slug: "recompenses-applications", label: "Explorer les offres Récompenses & Applications" },
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
