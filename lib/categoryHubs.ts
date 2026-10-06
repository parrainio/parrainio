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

/** Illustration d'accompagnement du hero, par slug de hub. Fichiers WebP
 *  alpha fournis (aucun cadre ajouté) dans /images/illustrations/categories/.
 *  width/height = dimensions intrinsèques réelles (ratio exact pour next/image). */
export const HUB_ILLUSTRATIONS: Record<string, { src: string; alt: string; width: number; height: number }> = {
  "banque-finance": { src: "/images/illustrations/categories/01-banque-finance.webp", alt: "Illustration banque et finance : carte bancaire, pièces et documents de parrainage.", width: 499, height: 214 },
  "shopping-courses": { src: "/images/illustrations/categories/02-shopping-courses.webp", alt: "Illustration shopping et courses : sacs de courses et bons d'achat.", width: 536, height: 223 },
  "investissement-crypto": { src: "/images/illustrations/categories/03-investissement-crypto.webp", alt: "Illustration investissement et crypto : graphique de croissance et pièces.", width: 520, height: 226 },
  "recompenses-applications": { src: "/images/illustrations/categories/04-recompenses-applications.webp", alt: "Illustration récompenses et applications : téléphone et cadeaux gagnés.", width: 505, height: 237 },
  "jeux-paris": { src: "/images/illustrations/categories/05-jeux-paris.webp", alt: "Illustration jeux et paris : ballon, jetons et gains.", width: 540, height: 219 },
  "cashback": { src: "/images/illustrations/categories/06-cashback.webp", alt: "Illustration cashback : pièces et pourcentage reversé.", width: 509, height: 226 },
  "energie": { src: "/images/illustrations/categories/07-energie.webp", alt: "Illustration énergie : panneaux solaires et ampoule.", width: 510, height: 240 },
  "voyage-mobilite": { src: "/images/illustrations/categories/08-voyage-mobilite.webp", alt: "Illustration voyage et mobilité : valise, avion et billets.", width: 554, height: 240 },
  "services-numeriques": { src: "/images/illustrations/categories/09-services-numeriques.webp", alt: "Illustration services numériques : écrans et abonnements.", width: 534, height: 234 },
  "telephone-internet": { src: "/images/illustrations/categories/10-telephone-internet.webp", alt: "Illustration téléphone et internet : smartphone et wifi.", width: 575, height: 217 },
  "autres-bons-plans": { src: "/images/illustrations/categories/11-autres-bons-plans.webp", alt: "Illustration autres bons plans : étiquette promo et cadeaux.", width: 562, height: 217 },
};

export const CATEGORY_HUBS: CategoryHubContent[] = [
  {
    slug: "banque-finance",
    group: "Banque & Finance",
    title: "Parrainage Banque & Finance : offres et conditions | Parrainio",
    metaDescription:
      "Comparez les parrainages bancaires, d’assurance, d’épargne et de services financiers : conditions d’éligibilité et parcours résumés par partenaire.",
    h1Lead: "Les offres de parrainage",
    h1Accent: "banque & finance.",
    intro: [
      "Cette catégorie rassemble des offres de parrainage liées aux banques, aux services de paiement et de transfert, à l’assurance, à l’épargne et à d’autres services financiers. Selon le partenaire, l’avantage peut être une prime, une remise ou une récompense conditionnelle. Consultez chaque fiche pour identifier le produit concerné, le public éligible et les étapes à réaliser.",
      "Les mécanismes varient d'un partenaire à l'autre. Certaines offres fonctionnent avec un code à saisir, d'autres avec un lien d'invitation à utiliser avant l'inscription. La prime est généralement conditionnée à l'ouverture d'un compte, parfois à un premier dépôt, à l'activation d'une carte ou à une première opération : chaque fiche détaille les conditions exactes, le délai et le montant.",
      "Avant de vous lancer, vérifiez que vous êtes bien éligible (nouveau client, âge, pays de résidence), notez la date limite et les opérations demandées, puis conservez vos justificatifs.",
    ],
    editorial: [
      "Pour les offres bancaires, vérifiez le compte ou le produit concerné, les frais et les opérations attendues. Selon la campagne, une prime peut dépendre d’un versement, de l’usage d’une carte ou d’une démarche de mobilité bancaire ; ces conditions ne s’appliquent pas à toutes les fiches.",
      "Pour comparer efficacement, regardez au-delà de la prime annoncée : frais de tenue de compte, conditions de revenus exigées, délai de versement et stabilité de l'établissement. [Les offres d'investissement et de crypto](/categories/investissement-crypto), souvent complémentaires d'un compte bancaire solide, font l'objet d'une catégorie dédiée sur Parrainio.",
    ],
    conclusion:
      "Parcourez les fiches de la catégorie à votre rythme : chacune résume la prime du partenaire, les conditions d'ouverture et les étapes à suivre, pour repérer l'offre qui correspond vraiment à votre projet. Pour comparer les banques en ligne entre elles, consultez notre [comparatif des offres de parrainage bancaire](/comparatif/parrainage-bancaire).",
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
      "Selon l’enseigne, l’avantage peut être destiné au filleul, au parrain ou aux deux. Il peut prendre la forme d’une remise, d’un crédit, d’un bon d’achat, de points ou d’un remboursement. Vérifiez sur la fiche si une commande est nécessaire, quels produits sont concernés et si un minimum d’achat ou une autre étape s’applique. Les conditions de cumul avec d’autres promotions dépendent de l’enseigne.",
      "Autre réflexe utile : comparer l'offre de parrainage avec les autres leviers de réduction. Les plateformes de [cashback remboursent une partie des achats](/categories/cashback) effectués chez leurs marchands partenaires, et se combinent parfois avec les bons plans des enseignes elles-mêmes.",
    ],
    conclusion:
      "Prenez quelques minutes avant votre prochaine commande : bonus, conditions et étapes sont résumés fiche par fiche pour choisir l'offre la plus avantageuse au moment d'acheter.",
    guideTitle: "Bons plans shopping : bien comparer avant d’acheter.",
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
      "Cette catégorie rassemble des offres de parrainage liées à l’investissement, à l’épargne et aux crypto-actifs. Selon la plateforme, l’avantage peut prendre la forme d’une prime, d’un crédit ou d’une récompense déclenchée par une opération. Le lien ou le code rattache l’inscription au programme du partenaire ; il ne constitue pas un rendement de placement.",
      "Les conditions varient fortement d'une plateforme à l'autre : dépôt initial, premier achat, montant minimum ou volume d'activité peuvent être demandés. Sur les offres crypto, la récompense est parfois versée en actifs : sa valeur évolue alors avec les cours. Chaque fiche détaille le mécanisme, le montant et les étapes avant de vous engager.",
      "Prenez le temps de comparer les frais, l'éligibilité et les conditions de déblocage de la prime, et consultez la documentation officielle du partenaire. Parrainio présente ces offres à titre informatif et ne fournit aucun conseil en investissement.",
    ],
    editorial: [
      "Les conditions diffèrent selon le service : ouverture de compte, vérification d’identité, premier versement, achat ou activité minimale. Chaque fiche précise l’action qui déclenche la récompense. Celle-ci reste distincte de la performance du placement et ne garantit ni rendement ni absence de perte.",
      "Sur les actifs numériques, la volatilité est la règle : une récompense versée en crypto suit les cours, à la hausse comme à la baisse. Avant de vous inscrire, lisez les frais, les supports disponibles, les conditions de retrait et la réglementation applicable à votre situation.",
      "Le choix d'une plateforme se joue rarement sur le bonus seul. L'univers proposé (actions, ETF, immobilier, crypto), la clarté des frais, la qualité de l'application et les modalités de dépôt-retrait pèsent durablement plus que la prime d'arrivée. Traitez le bonus comme un complément : il récompense une inscription que vous auriez de toute façon jugée sur les fondamentaux.",
    ],
    conclusion:
      "Comparez les plateformes de la catégorie sans précipitation : chaque fiche détaille les conditions d'inscription, la récompense annoncée et les vérifications à anticiper avant le premier versement. Pour comparer les plateformes crypto entre elles, consultez notre [comparatif des offres de parrainage crypto](/comparatif/parrainage-crypto).",
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
      "Applications de marche rémunérée, missions géolocalisées, sondages d'opinion, lecture de reçus de courses ou mini-jeux : ces plateformes monétisent des activités du quotidien. Le parrainage y est particulièrement répandu, car chaque nouveau membre actif fait progresser la communauté.",
      "Les modalités diffèrent selon l’application : le parrainage peut être rattaché par un lien ou un code, et la récompense peut dépendre d’une inscription ou d’une activité validée. Avant de commencer, vérifiez le déclencheur, la forme de la récompense et, le cas échéant, le seuil de retrait. Le temps nécessaire dépend des missions proposées et de votre activité.",
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
      "Les offres de cette catégorie concernent différentes activités : paris sportifs, paris hippiques, poker ou jeux de loterie. Avant toute inscription, consultez les informations de l’[Autorité nationale des jeux](https://www.anj.fr/offre-de-jeu-et-marche/operateurs-agrees) pour vérifier le site et la catégorie concernés. Un bonus ne garantit aucun gain.",
      "Les conditions de déblocage méritent une lecture attentive : inscription complète avec vérification d'identité, premier dépôt, premier pari respectant des limites de cote ou de montant, délai d'utilisation du bonus. Le freebet, forme la plus courante, n'est pas retirable en cash : seule la part gagnée peut l'être, et les conditions de mise diffèrent d'un opérateur à l'autre.",
      "Les formats de jeux varient aussi bien plus qu'on ne le croit : paris sportifs sur le football et le tennis, courses hippiques, grilles et tirages, poker. Les promotions suivent le calendrier sportif — grandes compétitions, tournois majeurs — et certaines offres de bienvenue se renforcent temporairement à ces occasions. Le bonus affiché au moment de votre inscription est donc celui qu'il faut relire, même si vous avez comparé la même offre quelques semaines plus tôt.",
      "Comparer les offres reste utile, mais avec prudence : un bonus élevé ne signifie pas des conditions favorables. Regardez les restrictions — cotes minimales, sports ou types de paris concernés, délais — avant de vous inscrire. Fixez-vous des limites de temps et de budget, et ne jouez jamais une somme dont vous avez besoin. Notre guide [le freebet, comment ça marche](/blog/freebet-comment-ca-marche) explique ce qu'un freebet peut — et ne peut pas — rapporter.",
    ],
    conclusion:
      "Parcourez les fiches de la catégorie pour comparer les bonus de bienvenue et leurs conditions en toute clarté, et n'oubliez pas : jouer doit rester un divertissement. Pour comparer les opérateurs de paris sportifs entre eux, consultez notre [comparatif des paris sportifs](/comparatif/paris-sportifs).",
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
        text: "Les jeux comportent des risques : fixez-vous des limites. Besoin d’aide ? Contactez Joueurs Info Service au [09 74 75 13 13](https://www.joueurs-info-service.fr/Le-jeu-et-vos-proches/Comment-me-preserver-et-preserver-mes-proches/Se-faire-aider) (appel non surtaxé).",
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
      "Cette catégorie rassemble des plateformes qui proposent du cashback et des programmes de parrainage. Selon le partenaire, l’avantage peut être destiné au filleul, au parrain ou aux deux, et dépendre d’une inscription, d’un achat ou d’un cashback confirmé. Consultez la fiche pour connaître le parcours concerné et distinguer la récompense de parrainage du remboursement associé aux achats.",
      "Le bonus de bienvenue est souvent conditionné à une première commande validée ou à un montant minimum de cashback cumulé. Le remboursement peut mettre du temps à être confirmé par le marchand avant d'être disponible au retrait. Chaque fiche précise les seuils, les délais et les exclusions éventuelles.",
      "Avant de choisir, comparez le bonus de bienvenue, le réseau de marchands et les conditions de retrait de chaque plateforme.",
    ],
    editorial: [
      "Le principe du cashback tient en une phrase : passer par la plateforme avant d'acheter chez un marchand partenaire, puis recevoir une fraction du montant dépensé. Cette récompense s'exprime en pourcentage, très variable selon les marchands, les univers de produits et les périodes promotionnelles.",
      "Trois étapes conditionnent le crédit de votre remboursement : activer l'offre ou cliquer depuis la plateforme, payer normalement, puis attendre la confirmation du marchand. C'est ce délai de validation — parfois plusieurs semaines après l'expédition de la commande — qui distingue le cashback d'une réduction immédiate en caisse.",
      "Les exclusions font partie du jeu : retours et annulations, certains rayons produits ou l'usage de codes non autorisés peuvent annuler le remboursement. Le cumul avec d'autres mécanismes — réduction de bienvenue d'une enseigne, parrainage d'une boutique — dépend des règles de chaque marchand et de chaque plateforme : vérifiez avant d'empiler.",
      "Les taux de remboursement se lisent toujours au cas par cas : un pourcentage élevé sur un rayon étroit vaut parfois moins qu'un taux modeste sur vos achats récurrents. Avant de créer un compte, identifiez la plateforme dont le réseau de marchands recouvre vos dépenses habituelles — c'est le volume d'achats éligibles, plus que le taux maximal, qui détermine le gain réel sur une année. Notre guide [comment utiliser le cashback intelligemment](/blog/comment-utiliser-cashback-intelligemment) détaille ces arbitrages.",
      "Pour aller plus loin dans les économies, explorez les [offres shopping et courses](/categories/shopping-courses) : les enseignes partenaires y proposent leurs propres avantages de bienvenue, complémentaires du cashback.",
    ],
    conclusion:
      "Comparez les plateformes de la catégorie : bonus d'arrivée, réseau de marchands et modalités de retrait sont résumés fiche par fiche pour choisir celle qui correspond à vos habitudes d'achat. Pour les comparer entre elles, consultez notre [comparatif des plateformes de cashback](/comparatif/cashback).",
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
    title: "Offres de parrainage énergie : fournisseurs et services | Parrainio",
    metaDescription:
      "Parcourez les offres de fournisseurs d'énergie et de services associés : fiches partenaires, conditions de parrainage et détails des récompenses.",
    h1Lead: "Offres de parrainage pour",
    h1Accent: "l'électricité, le gaz et l'énergie",
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
      "Parcourez les offres de la catégorie : fournisseurs, primes et conditions de souscription sont détaillés fiche par fiche pour changer de contrat en connaissance de cause. Pour une lecture orientée parrainage — primes filleul, parcours et points de vigilance — la page [Comparer les programmes de parrainage des fournisseurs d’énergie](/parrainage-energie) complète cette catégorie.",
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
      "Cette catégorie réunit des programmes liés aux séjours, à l’accueil de voyageurs et aux déplacements du quotidien. Le parcours et la forme de l’avantage varient selon le service ; consultez chaque fiche pour connaître le public concerné et l’action attendue.",
      "Les mécanismes varient selon les services : certains créditent l'avantage après une première réservation terminée, d'autres après un premier trajet ou une première commande. Délais, éligibilité et forme de la récompense changent d'un partenaire à l'autre : chaque fiche détaille le fonctionnement exact.",
    ],
    editorial: [
      "Côté voyages, deux profils sont concernés : le voyageur qui réserve un hébergement et l'hôte qui en propose un. Les deux disposent de leur propre programme, avec des conditions distinctes — première réservation pour l'un, premières locations qualifiantes pour l'autre. Vérifiez bien le programme auquel votre inscription donne droit, car un compte ne cumule pas les deux avantages : [parrainage Airbnb voyageur](/offres/airbnb) et [parrainage Airbnb Hôtes](/offres/airbnb-1).",
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
    title: "Parrainage et affiliation numérique : programmes et conditions | Parrainio",
    metaDescription:
      "Comparez les programmes de recommandation et d’affiliation pour l’hébergement web, les services freelance et les outils en ligne : éligibilité, attribution et forme de la rémunération.",
    h1Lead: "Les offres de parrainage",
    h1Accent: "services numériques.",
    intro: [
      "Cette catégorie réunit des programmes de recommandation et d’affiliation. Certaines fiches décrivent un avantage pour un nouveau client ; d’autres une commission pour l’affilié qui apporte un acheteur. Vérifiez à qui s’adresse chaque programme et si le nouveau client reçoit lui-même un avantage.",
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
    title: "Offres de parrainage téléphone & Internet | Parrainio",
    metaDescription:
      "Offre de parrainage RED by SFR : conditions d’éligibilité à une nouvelle ligne et lien vers la fiche détaillée du partenaire.",
    h1Lead: "Parrainage téléphone & Internet :",
    h1Accent: "l’offre RED by SFR",
    intro: [
      "Une catégorie resserrée, dédiée aux offres mobiles et internet : souscrire via le lien ou le code de parrainage donne droit à l'avantage du partenaire, sans modifier le prix ni les conditions de l'offre.",
      "Le principe est simple : activez votre offre avec le parrainage, puis attendez la validation prévue par l'opérateur. Le délai, la forme de l'avantage et les conditions d'éligibilité — notamment la création d'une nouvelle ligne — sont détaillés sur la fiche.",
    ],
    editorial: [
      "Avant de souscrire, vérifiez trois points : l'éligibilité nouvelle ligne (une offre existante ne compte généralement pas), la durée de validité du parrainage et le délai de versement de l'avantage après activation. Le prix et les caractéristiques du forfait restent identiques à une souscription classique : le parrainage est un bonus, jamais un changement de conditions. Pour réduire la facture au-delà du forfait, notre guide [réduire sa facture téléphone et internet](/blog/comment-reduire-facture-telephone-internet) passe en revue options et abonnements superflus.",
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
