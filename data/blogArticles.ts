/**
 * Modèle de données des articles du blog Parrainio.
 *
 * Source unique de vérité pour /blog et /blog/[slug].
 *
 * Format du contenu : chaque élément de `body` est soit une chaîne
 * (paragraphe), soit un bloc structuré :
 *   - { type: "h2", text }        sous-titre de section
 *   - { type: "p", text }         paragraphe explicite
 *   - { type: "list", ordered, items }  liste à puces ou numérotée
 *
 * Les paragraphes et les éléments de liste acceptent les liens internes au
 * format [ancre](/chemin) — même convention que les hubs de catégories —
 * ainsi que les liens externes [ancre](https://...).
 *
 * Le champ `h1` est optionnel : lorsqu'il est absent, le H1 de la page
 * reprend `title`. Le `title` alimente toujours le <title> SEO
 * (« {title} | {titleSuffix} » — suffixe par défaut « Blog Parrainio »).
 */
export type BlogBlock =
  | string
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  /* Blocs visuels génériques (rendus par le template, réutilisables) : */
  | { type: "figure"; variant: "subscriptions" }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "process"; steps: { title: string; text: string }[] }
  | { type: "cards"; items: { icon: string; title: string; text: string }[] }
  | { type: "callout"; title: string; text?: string; items?: string[] }
  | { type: "checklist"; items: string[] };

export type BlogArticle = {
  slug: string;
  title: string;
  /** H1 affiché sur la page ; défaut : `title`. */
  h1?: string;
  /** Suffixe du <title> SEO ; défaut : « Blog Parrainio ». */
  titleSuffix?: string;
  /** Extrait affiché sur la carte de la page /blog et en meta description. */
  excerpt: string;
  /** Date de publication, format ISO (AAAA-MM-JJ). */
  datePublished: string;
  /** Date de dernière mise à jour, format ISO — optionnelle. */
  dateModified?: string;
  /** Catégorie éditoriale (par ex. « Guides », « Bons plans »). */
  category: string;
  /** Contenu : paragraphes, sous-titres et listes. */
  body: BlogBlock[];
};

/** Registre des articles publiés. */
export const blogArticles: BlogArticle[] = [
  {
    slug: "le-cashback-comment-ca-marche",
    title: "Cashback : comment ça marche et comment en profiter",
    h1: "Le cashback, comment ça marche ?",
    excerpt:
      "Le cashback permet de récupérer une partie de vos achats en ligne : fonctionnement, différence avec le parrainage et erreurs à éviter.",
    datePublished: "2026-09-05",
    category: "Guides",
    body: [
      "Le cashback est régulièrement présenté comme un moyen simple de gagner un peu d'argent sur ses achats en ligne. Dans la pratique, il repose sur un mécanisme précis, avec des conditions à respecter pour que l'achat soit bien pris en compte. Cet article explique comment cela fonctionne réellement, ce qui distingue le cashback du parrainage, et comment éviter les erreurs les plus courantes. Vous retrouverez ensuite les [plateformes actuellement documentées sur Parrainio](/comparatif/cashback).",

      { type: "h2", text: "Qu'est-ce que le cashback ?" },
      "Le cashback consiste à récupérer une partie du montant d'un achat effectué chez un marchand partenaire, lorsque cet achat a été correctement suivi puis validé. Concrètement, vous passez par une plateforme de cashback pour rejoindre le site du marchand ; si votre achat est éligible, un pourcentage ou un montant est ensuite crédité sur votre compte. Le montant récupéré dépend du marchand, des opérations en cours et des règles de la plateforme : il n'existe pas de pourcentage unique ni de montant garanti qui s'appliquerait partout.",
      "Le principe économique est relativement simple : lorsqu'un achat est réalisé après être passé par la plateforme, le marchand verse une commission à celle-ci, et la plateforme en reverse une partie à l'acheteur. C'est ce modèle qui finance le cashback. Il concerne aussi bien les achats en ligne que, selon les plateformes, certaines opérations en magasin ou des achats de cartes cadeaux.",

      { type: "h2", text: "Comment fonctionne le cashback ?" },
      "Le parcours type se déroule en plusieurs étapes. Les modalités précises varient selon la plateforme et l'achat, mais le principe général est toujours le même :",
      {
        type: "list",
        ordered: true,
        items: [
          "Choisir une plateforme de cashback et créer un compte.",
          "Ouvrir la plateforme, puis accéder au marchand depuis celle-ci (via son site, son application ou son extension de navigateur).",
          "Effectuer l'achat comme vous le feriez normalement chez le marchand.",
          "L'achat est détecté et enregistré sur votre compte cashback.",
          "L'achat est ensuite vérifié par la plateforme, parfois avec le marchand.",
          "Une fois l'achat validé, le cashback est crédité sur votre compte.",
          "Le montant peut enfin être récupéré selon les règles de la plateforme (cagnotte, seuil de retrait, mode de versement).",
        ],
      },
      "Il faut retenir qu'aucun délai universel n'existe : la détection, la vérification puis la validation d'un achat prennent un certain temps, qui varie selon la plateforme, le marchand et le type d'opération. Un achat peut aussi être exclu du cashback s'il ne respecte pas les conditions du marchand, par exemple s'il combine certaines offres ou promotions. C'est pourquoi il est important de consulter les conditions avant d'acheter, et de ne pas considérer un montant « en attente » comme définitivement acquis.",
      "La bonne habitude à prendre : passer systématiquement par la plateforme avant d'acheter, et vérifier que l'achat a bien été enregistré. [Le comparateur de plateformes de cashback de Parrainio](/comparatif/cashback) reprend les conditions actuellement documentées de chaque service.",

      {
        type: "h2",
        text: "Cashback, bonus de parrainage et reversement Parrainio : quelle différence ?",
      },
      "Ces trois mécanismes sont souvent confondus, alors qu'ils ne reposent pas sur la même logique. Le cashback est un avantage lié à un achat effectué chez un marchand partenaire : sans achat éligible, pas de cashback. Le bonus de parrainage, lui, est lié à un programme de parrainage : il est accordé lorsque vous vous inscrivez via le lien ou le code d'un parrain, ou lorsque vous remplissez les actions prévues par ce programme. Il ne dépend pas d'un achat cashbacké en soi, même si certaines conditions peuvent y faire référence.",
      "Le reversement Parrainio est un troisième mécanisme, propre au modèle de Parrainio : lorsque le site est rémunéré par un partenaire, une partie de cette commission peut être reversée à l'utilisateur qui a utilisé l'offre, selon les conditions de celle-ci. Autrement dit, un même parcours peut cumuler un avantage du partenaire et, le cas échéant, un reversement Parrainio — mais ce sont deux choses distinctes, qui ne doivent pas être additionnées sans vérification.",
      "Si vous découvrez le fonctionnement d'un parrainage, la page [Comment ça marche](/comment-ca-marche) détaille le parcours complet, et la page [Nos avantages](/nos-avantages) explique le modèle de reversement de Parrainio. Les primes de parrainage actuellement documentées, elles, sont listées sur le [classement des primes](/classement-primes-parrainage).",

      { type: "h2", text: "Comment choisir une plateforme de cashback ?" },
      "Plutôt qu'un classement, voici les critères à regarder pour choisir la plateforme adaptée à vos achats :",
      {
        type: "list",
        ordered: false,
        items: [
          "Les conditions d'utilisation et les modalités de validation des achats.",
          "Les types d'achats réellement éligibles (marchands disponibles, catégories de produits, exclusions éventuelles).",
          "Les modalités de récupération du cashback : seuil de retrait, modes de versement, éventuelle date d'expiration.",
          "Les restrictions particulières, comme l'impossibilité de cumuler avec certaines promotions.",
          "Le fonctionnement du programme de parrainage de la plateforme, si vous souhaitez également en profiter en faisant parrainer.",
        ],
      },
      "Aucun de ces critères n'a de réponse universelle : une plateforme très complète peut ne pas couvrir les marchands que vous fréquentez le plus, et une plateforme au catalogue plus restreint peut correspondre parfaitement à vos achats habituels. L'important est de vérifier les conditions sur la fiche du service avant de vous inscrire, plutôt que de vous fier à des promesses générales. Le [comparatif des plateformes de cashback](/comparatif/cashback) de Parrainio réunit les services actuellement documentés, avec leurs conditions et leurs avantages, pour vous aider à comparer.",

      {
        type: "h2",
        text: "Quelles plateformes de cashback sont disponibles sur Parrainio ?",
      },
      "Le catalogue de Parrainio documente actuellement cinq plateformes de cashback, chacune avec son fonctionnement propre :",
      {
        type: "list",
        ordered: false,
        items: [
          "[iGraal](/offres/igraal) : une plateforme qui combine cashback, codes promo et extension de navigateur pour récupérer de l'argent sur ses achats en ligne.",
          "[Poulpeo](/offres/poulpeo) : un service qui associe codes de réduction et cagnotte cashback, avec un programme de parrainage à code.",
          "[eBuyClub](/offres/ebuyclub) : une plateforme qui réunit plusieurs formes de cashback, des achats en ligne aux bons d'achat et à certaines opérations en magasin.",
          "[Widilo](/offres/widilo) : une plateforme de cashback en ligne dont le programme de parrainage prévoit un bonus pour le filleul après validation de son premier cashback.",
          "[TopCashback](/offres/topcashback) : un service qui accompagne les achats en ligne avec des taux propres aux marchands partenaires.",
        ],
      },
      "Les avantages et conditions actuels de chaque plateforme — y compris les éventuelles campagnes en cours — sont détaillés sur sa fiche. Pour une vue d'ensemble, rendez-vous sur le [comparatif](/comparatif/cashback) ou sur le [hub dédié aux offres de cashback](/categories/cashback).",

      { type: "h2", text: "Les erreurs à éviter avec le cashback" },
      "La plupart des déceptions avec le cashback viennent d'erreurs de parcours ou d'une mauvaise lecture des conditions. Voici les principales à éviter :",
      {
        type: "list",
        ordered: false,
        items: [
          "Oublier d'activer le cashback avant l'achat : si vous n'êtes pas passé par la plateforme, l'achat ne sera généralement pas pris en compte.",
          "Utiliser un parcours différent de celui demandé, par exemple ouvrir le site du marchand dans un autre onglet ou utiliser une application qui n'est pas reliée à la plateforme.",
          "Ignorer les exclusions ou conditions du marchand, comme l'impossibilité de cumuler le cashback avec certains codes ou certaines offres.",
          "Penser que le cashback est validé immédiatement : la vérification d'un achat prend toujours un certain délai, variable selon les plateformes.",
          "Considérer un montant affiché ou « en attente » comme définitivement acquis avant sa validation complète.",
        ],
      },
      "Si vous débutez, commencez par un achat simple et suivez son enregistrement de bout en bout : c'est la meilleure façon de comprendre comment votre plateforme fonctionne réellement, avant d'en faire un réflexe quotidien.",

      { type: "h2", text: "Cashback : est-ce vraiment intéressant ?" },
      "Réponse honnête : cela dépend surtout des achats que vous comptiez déjà effectuer. Si vous achetez régulièrement chez des marchands partenaires d'une plateforme de cashback, récupérer une partie de ces achats présente un intérêt réel, sans changer vos habitudes. En revanche, le cashback ne doit pas être une raison d'acheter davantage : l'argent récupéré ne compensera jamais une dépense que vous n'aviez pas prévue.",
      "Il faut aussi garder en tête que le cashback n'est pas une économie immédiate ni garantie : l'avantage dépend de l'éligibilité de l'achat, de sa validation, et des règles de la plateforme. C'est un complément utile sur des achats déjà décidés, pas un revenu ni une promesse d'économies fixes. Enfin, la lecture des conditions reste la seule façon de savoir si un achat précis est éligible : aucun montant affiché ne vaut confirmation avant validation.",

      { type: "h2", text: "À savoir avant de s'inscrire" },
      {
        type: "list",
        ordered: false,
        items: [
          "Lire les conditions générales de la plateforme et ses modalités de validation.",
          "Vérifier les conditions de l'achat envisagé : marchand partenaire, catégories éligibles, exclusions.",
          "Comprendre les modalités de validation et de retrait avant de cumuler du cashback.",
          "Ne jamais considérer un montant « en attente » comme acquis tant qu'il n'est pas validé.",
          "Si vous utilisez un lien de parrainage pour vous inscrire, vérifier les conditions propres au programme sur la fiche de l'offre et sur [Comment ça marche](/comment-ca-marche).",
        ],
      },

      { type: "h2", text: "Conclusion" },
      "Le cashback est un mécanisme simple à comprendre, à condition d'en connaître les règles : passer par la plateforme, respecter les conditions du marchand et attendre la validation de l'achat. Bien utilisé sur des achats que vous comptiez de toute façon effectuer, il permet de récupérer un peu d'argent au fil du temps — sans jamais être une raison d'acheter plus, ni une économie garantie.",
      "Pour comparer les services actuellement documentés, leurs conditions et leurs éventuels bonus, consultez le [comparatif des plateformes de cashback](/comparatif/cashback) ou parcourez l'ensemble des [offres de parrainage](/offres).",
    ],
  },
  {
    slug: "changer-de-banque-prime-parrainage",
    title: "Changer de banque avec une prime de parrainage : le guide",
    h1: "Changer de banque et profiter d'une prime de parrainage",
    excerpt:
      "Mobilité bancaire, étapes du changement, primes de parrainage et pièges à éviter : le guide complet pour changer de banque sereinement.",
    datePublished: "2026-09-05",
    category: "Guides",
    body: [
      "Changer de banque peut répondre à des envies très différentes : réduire ses frais, profiter de meilleurs services, simplifier sa carte ou son application, ou simplement trouver un établissement plus adapté à une situation qui évolue. Une prime de parrainage peut venir s'ajouter à la réflexion, mais elle ne devrait jamais être la raison principale du changement : c'est la banque au quotidien qui compte, pas un avantage ponctuel. Cet article vous explique comment changer de banque sereinement, ce que fait vraiment la mobilité bancaire, et comment aborder les offres de parrainage sans mauvaise surprise.",

      { type: "h2", text: "Pourquoi changer de banque ?" },
      "Les motifs d'un changement d'établissement sont nombreux et légitimes. Certains cherchent à réduire les frais de tenue de compte, de carte ou d'opérations courantes. D'autres sont attirés par des services différents : une application plus complète, une carte aux caractéristiques particulières, ou un accompagnement en agence. Les besoins évoluent aussi avec le temps : un déménagement, une nouvelle activité professionnelle ou l'arrivée d'un enfant peuvent rendre l'offre actuelle moins adaptée.",
      "Il n'existe pas de banque objectivement « meilleure » qu'une autre : le bon choix dépend de votre situation, de vos usages et de ce que vous attendez de votre établissement. C'est précisément pour cela qu'il est utile de comparer plusieurs critères concrets avant de vous engager, plutôt que de vous fier à une réputation ou à une offre ponctuelle.",

      { type: "h2", text: "Qu'est-ce que la mobilité bancaire ?" },
      "Le service d'aide à la mobilité bancaire a été créé pour simplifier le changement de banque : au lieu de prévenir vous-même votre employeur, la CAF, vos assurances ou vos fournisseurs d'énergie, c'est votre nouvelle banque qui s'en charge. En signant un mandat de mobilité bancaire auprès d'elle, vous l'autorisez à organiser le transfert de vos opérations récurrentes — prélèvements et virements — depuis l'ancien compte vers le nouveau. Ce service est gratuit et toutes les banques ont l'obligation de le proposer.",
      "Concrètement, la nouvelle banque récupère auprès de l'ancienne les informations sur vos opérations récurrentes des derniers mois, puis informe les organismes concernés de votre nouveau RIB. Les deux établissements disposent ensemble d'un délai maximal de 22 jours ouvrés, à compter de la réception de votre dossier complet, pour réaliser l'ensemble des démarches.",
      "Deux points sont souvent mal compris. D'une part, la clôture de l'ancien compte n'est pas automatique : c'est vous qui décidez, dans le mandat, si vous souhaitez ou non fermer votre ancien compte. D'autre part, le service ne transfère que les opérations récurrentes rattachées à votre compte de dépôt : tout le reste — épargne, placements, contrats spécifiques — relève de démarches distinctes, comme nous le verrons plus loin. Pour le détail officiel de la procédure, la fiche [Service Public dédiée à la mobilité bancaire](https://www.service-public.fr/particuliers/vosdroits/F33881) reste la référence à consulter.",

      { type: "h2", text: "Comment changer de banque étape par étape ?" },
      "Voici un parcours type, qui laisse à chaque étape le temps de vérifier ce qui se passe réellement :",
      {
        type: "list",
        ordered: true,
        items: [
          "Choisir sa nouvelle banque en comparant les critères qui comptent pour vous : frais, carte, services, application, conditions d'accès.",
          "Vérifier les conditions d'ouverture du compte : documents demandés, conditions de revenus ou de dépôt éventuelles, frais d'ouverture.",
          "Ouvrir le nouveau compte, puis signer le mandat de mobilité bancaire si vous souhaitez que la nouvelle banque s'occupe du transfert de vos opérations récurrentes.",
          "Vérifier, pendant la transition, que vos prélèvements et virements récurrents basculent bien sur le nouveau compte.",
          "Garder un œil sur l'ancien compte tant que la transition n'est pas terminée : une opération oubliée peut encore y arriver.",
          "Décider de la clôture de l'ancien compte une fois que la situation est sécurisée et que le solde a été transféré.",
        ],
      },
      "Ce parcours distingue volontairement trois niveaux : ce que la mobilité bancaire fait automatiquement (le transfert des opérations récurrentes), ce que vous devez vérifier vous-même (le bon basculement de vos opérations), et ce qui ne relève pas du service (l'épargne, les placements, ou la fermeture d'un compte que vous décidez de conserver). Aucune banque n'impose une procédure unique : les modalités pratiques d'ouverture et de mandat peuvent varier d'un établissement à l'autre.",
      "Si vous préférez tout gérer vous-même, c'est également possible : il vous faudra alors lister vos opérations récurrentes, transmettre votre nouveau RIB à chaque organisme, vérifier le basculement, puis clôturer l'ancien compte. Le site [economie.gouv.fr](https://www.economie.gouv.fr/particuliers/gerer-mon-argent/gerer-mon-budget-et-mon-epargne/comment-changer-de-banque) détaille ces deux options et leurs implications.",

      {
        type: "h2",
        text: "Peut-on profiter d'une prime de parrainage en changeant de banque ?",
      },
      "Oui, sous conditions : certaines banques proposent des offres de parrainage qui peuvent s'appliquer lors de l'ouverture d'un nouveau compte. Ces offres fonctionnent généralement avec un lien ou un code fourni par le parrain, et leur validation dépend de conditions précises : être considéré comme nouveau client, ouvrir un type de compte donné, réaliser un dépôt ou utiliser une carte dans un délai défini. Les campagnes évoluent régulièrement et les montants annoncés ne sont jamais garantis sans vérification.",
      "Une prime de parrainage peut donc être un complément agréable à un changement de banque que vous comptiez de toute façon effectuer. En revanche, elle ne doit ni orienter seule votre choix, ni vous faire négliger les critères de fond — frais, services, conditions du compte au quotidien. Le [comparatif des offres de parrainage bancaire](/comparatif/parrainage-bancaire) de Parrainio réunit les banques actuellement documentées et renvoie vers chaque fiche pour le détail des conditions ; le [classement des primes](/classement-primes-parrainage) permet de situer les avantages actuellement annoncés. Les montants y sont systématiquement datés et peuvent évoluer : vérifiez toujours la fiche avant de vous inscrire.",

      {
        type: "h2",
        text: "Comment choisir sa nouvelle banque au-delà de la prime ?",
      },
      "Pour qu'un changement de banque soit réussi, il faut que le nouvel établissement corresponde à votre usage quotidien, pas seulement à une offre d'accueil. Voici les critères à passer en revue :",
      {
        type: "list",
        ordered: false,
        items: [
          "Les frais : tenue de compte, carte bancaire, opérations courantes, découvert, incidents.",
          "La carte et les moyens de paiement : coût, plafonds, paiement mobile, retraits à l'étranger.",
          "Les conditions d'accès : revenus, dépôt initial, âge, ouverture en ligne ou en agence.",
          "Les services et l'application : virements, alertes, épargne intégrée, support client.",
          "Vos besoins spécifiques : compte joint, découvert autorisé, produits d'épargne, accompagnement en agence.",
          "Les conditions de l'offre de bienvenue ou de parrainage : type de compte concerné, actions demandées, durée de la campagne.",
          "Les éventuels frais ou contraintes après la période promotionnelle, souvent oubliés.",
        ],
      },
      "Aucun tarif ni aucune condition ne sont cités ici volontairement : ils diffèrent selon les banques et les offres en cours. Le réflexe utile est de comparer les grilles tarifaires officielles des établissements qui vous intéressent, puis de vérifier, pour celles qui proposent un programme de parrainage, les conditions exactes sur leur fiche Parrainio ou via le [comparateur bancaire](/comparatif/parrainage-bancaire).",

      {
        type: "h2",
        text: "Quels comptes et produits sont concernés par la mobilité bancaire ?",
      },
      "Le service d'aide à la mobilité bancaire concerne uniquement les comptes de dépôt — les comptes courants — des particuliers détenus en France, hors usage professionnel. Les autres produits ne suivent pas automatiquement, et chacun répond à des règles différentes :",
      {
        type: "list",
        ordered: false,
        items: [
          "Les livrets d'épargne réglementés (Livret A, LDDS, Livret Jeune) ne sont pas transférés par le service : il faut généralement les clôturer puis en rouvrir un auprès de la nouvelle banque.",
          "Le LEP peut être transféré, mais certaines banques appliquent des frais pour cette opération.",
          "Le PEL et le CEL ne font pas partie des obligations légales de transfert : leur déplacement nécessite l'accord des deux banques et est généralement payant.",
          "Les comptes-titres et PEA sont transférables, le plus souvent avec des frais selon les établissements.",
          "Un contrat d'assurance-vie n'est pas un compte bancaire : il suit sa propre logique contractuelle et ne relève pas de la mobilité bancaire.",
        ],
      },
      "Cette liste est volontairement générale : les règles détaillées figurent dans la brochure d'information que chaque banque doit mettre à disposition sur ce service, et le tableau officiel publié par [economie.gouv.fr](https://www.economie.gouv.fr/particuliers/gerer-mon-argent/gerer-mon-budget-et-mon-epargne/comment-changer-de-banque) les récapitule produit par produit. Avant de vous lancer, vérifiez donc quels produits vous détenez et lesquels nécessiteront une démarche distincte : c'est le point le plus souvent sous-estimé dans un changement de banque.",

      { type: "h2", text: "Les erreurs à éviter quand on change de banque" },
      "La plupart des incidents lors d'un changement de banque se préviennent. Voici les erreurs les plus fréquentes :",
      {
        type: "list",
        ordered: false,
        items: [
          "Choisir uniquement en fonction de la prime, sans comparer les frais et services au quotidien.",
          "Ne pas lire les conditions de l'offre : type de compte concerné, actions demandées, fenêtre de validité.",
          "Fermer trop rapidement l'ancien compte, avant que toutes les opérations récurrentes aient basculé.",
          "Oublier certaines opérations récurrentes : un abonnement ponctuel ou un virement annuel peut ne pas figurer dans la liste transférée.",
          "Ne pas vérifier les prélèvements et virements après le changement, en particulier pendant les premières semaines.",
          "Supposer que tous les produits bancaires sont transférés automatiquement : l'épargne et les placements demandent des démarches distinctes.",
          "Oublier de vérifier les conditions tarifaires de la nouvelle banque, y compris après une éventuelle période promotionnelle.",
        ],
      },
      "La règle simple qui évite la plupart des problèmes : ne clôturez l'ancien compte que lorsque le nouveau fonctionne pleinement, et conservez une vigilance sur vos opérations pendant quelques semaines après le basculement.",

      { type: "h2", text: "Prime de parrainage : attention aux conditions" },
      "Si une prime de parrainage fait partie de votre décision, lisez attentivement ses conditions avant d'ouvrir le compte, car elles conditionnent tout :",
      {
        type: "list",
        ordered: false,
        items: [
          "La prime est presque toujours conditionnelle : son versement dépend de la validation de l'offre par la banque.",
          "Le lien ou le code du parrain doit être utilisé correctement au moment de l'inscription, lorsqu'il est requis.",
          "Certaines offres sont réservées aux nouveaux clients : ouvrir un compte chez un établissement où l'on a déjà été client peut invalider l'offre.",
          "Les campagnes ont souvent une période de validité : une offre vue un mois peut ne plus être disponible le mois suivant.",
          "Les conditions peuvent évoluer ou être modifiées par la banque : seule la fiche actualisée fait foi.",
        ],
      },
      "C'est exactement le rôle des fiches de Parrainio que de documenter ces conditions à un instant donné, avec leur date de vérification. Les primes y sont présentées telles qu'elles sont servies par les données du catalogue, sans promesse : pour le détail actuel de chaque offre, consultez le [comparateur bancaire](/comparatif/parrainage-bancaire) et les fiches des banques qui vous intéressent, par exemple [BoursoBank](/offres/boursobank), [Fortuneo](/offres/fortuneo) ou [Monabanq](/offres/monabanq).",

      { type: "h2", text: "À savoir avant de changer de banque" },
      {
        type: "list",
        ordered: false,
        items: [
          "Comparer la banque, pas uniquement la prime : frais, services, application, conditions d'accès.",
          "Lire les conditions de l'offre de parrainage et vérifier leur date de validité avant l'ouverture.",
          "Utiliser le service d'aide à la mobilité bancaire : il est gratuit et toutes les banques doivent le proposer.",
          "Ne pas fermer l'ancien compte avant d'avoir sécurisé la transition de toutes vos opérations récurrentes.",
          "Vérifier les prélèvements et virements après le transfert pendant les premières semaines.",
          "Consulter les informations officielles en cas de situation particulière : la fiche [Service Public sur la mobilité bancaire](https://www.service-public.fr/particuliers/vosdroits/F33881) et le site [economie.gouv.fr](https://www.economie.gouv.fr/particuliers/gerer-mon-argent/gerer-mon-budget-et-mon-epargne/comment-changer-de-banque) restent les références.",
          "En cas de litige avec une banque, passer par son service client, puis son médiateur bancaire ; l'ACPR peut également être saisie en dernier recours.",
        ],
      },

      { type: "h2", text: "Conclusion" },
      "Changer de banque est une démarche courante qui se prépare : comparer les offres sur des critères de fond, utiliser le service gratuit de mobilité bancaire, vérifier le basculement de ses opérations et ne fermer l'ancien compte qu'une fois la transition sécurisée. Une prime de parrainage peut être un complément appréciable, mais elle ne remplace ni la lecture des conditions, ni la comparaison des services au quotidien.",
      "Pour comparer les banques actuellement documentées sur Parrainio et leurs conditions de parrainage, consultez le [comparatif des offres de parrainage bancaire](/comparatif/parrainage-bancaire) ou parcourez l'ensemble des [offres de parrainage](/offres).",
    ],
  },
  {
    slug: "parrainage-energie",
    title: "Parrainage énergie : changer de fournisseur avec une prime",
    h1: "Parrainage énergie : comment ça marche ?",
    excerpt:
      "Un fournisseur d'électricité ou de gaz peut récompenser un parrainage. Mais changer de fournisseur reste une décision de contrat : le guide complet.",
    datePublished: "2026-09-05",
    category: "Guides",
    body: [
      "Certains fournisseurs d'électricité ou de gaz proposent à leurs clients de recommander leur offre à un proche, et récompensent le parrainage lorsque les conditions du programme sont remplies. Une prime peut alors être prévue pour le filleul, le parrain, ou les deux. Mais changer de fournisseur d'énergie reste d'abord une décision de contrat : le prix, les services et l'adéquation de l'offre à votre consommation priment sur un avantage ponctuel. Cet article explique comment fonctionne un parrainage chez un fournisseur d'énergie et ce qu'il faut savoir avant de changer d'offre.",

      { type: "h2", text: "Qu'est-ce que le parrainage énergie ?" },
      "Le principe est le même que pour d'autres secteurs : un client existant — le parrain — recommande son fournisseur à une personne de son entourage — le filleul. Si le filleul souscrit une offre éligible en utilisant le lien ou le code du parrain, le programme peut attribuer une prime au parrain, au filleul, ou aux deux, selon les règles du fournisseur.",
      "Chaque programme définit ses propres conditions : type d'offre concerné, zone géographique, délai de souscription, durée de conservation du contrat, forme de la récompense (remise sur facture, note de crédit, virement, autre avantage). Il n'existe donc pas de mécanisme unique applicable à tous les fournisseurs, et une prime n'est jamais attribuée automatiquement : elle dépend de la validation du programme. Les campagnes évoluent aussi dans le temps : une offre active aujourd'hui peut être remplacée ou modifiée demain. Si le fonctionnement général d'un parrainage — lien, code, conditions, validation — est encore flou, la page [Comment ça marche](/comment-ca-marche) de Parrainio le présente simplement, étape par étape.",

      { type: "h2", text: "Comment fonctionne un parrainage chez un fournisseur d'énergie ?" },
      "Le parcours général se déroule ainsi, même si les modalités précises varient selon le fournisseur :",
      {
        type: "list",
        ordered: true,
        items: [
          "Identifier une offre d'électricité ou de gaz qui correspond à vos besoins, en comparant les contrats avant de regarder la prime.",
          "Vérifier les conditions du programme de parrainage : offre éligible, zone, statut de nouveau client, éventuelle durée minimale.",
          "Utiliser le lien ou le code du parrain au moment de la souscription : c'est souvent la condition indispensable pour que le parrainage soit pris en compte.",
          "Souscrire le contrat auprès du fournisseur, en fournissant les informations demandées (notamment le point de livraison).",
          "Remplir les éventuelles conditions du programme (activation du contrat, conservation de l'offre, paiement des premières factures).",
          "Attendre la validation prévue par le programme, puis l'attribution effective de la prime selon sa forme.",
        ],
      },
      "Aucun délai commun n'existe : la période entre la souscription et la validation de la prime diffère selon les programmes, et certains fournisseurs versent l'avantage plusieurs mois après le début de la fourniture. C'est pourquoi il est essentiel de lire les conditions de l'offre et de sa fiche avant de souscrire, plutôt que de supposer un versement rapide ou automatique.",

      {
        type: "h2",
        text: "Peut-on changer de fournisseur d'électricité ou de gaz facilement ?",
      },
      "Oui : pour un particulier, changer de fournisseur d'électricité ou de gaz est une démarche simple, encadrée par des règles protectrices. Les informations qui suivent proviennent des fiches officielles du [Médiateur national de l'énergie (Energie-Info)](https://www.energie-info.fr/fiche_pratique/je-souhaite-changer-de-fournisseur-delectricite-ou-de-gaz-naturel/) et de [Service Public](https://www.service-public.gouv.fr/particuliers/vosdroits/F18116) :",
      {
        type: "list",
        ordered: false,
        items: [
          "Le changement de fournisseur est gratuit pour les particuliers : aucun frais ne peut être réclamé au seul motif du changement.",
          "Vous pouvez changer de fournisseur à tout moment, sans durée minimale d'engagement et sans limite de nombre de changements.",
          "Une seule démarche est nécessaire : souscrire un contrat auprès du nouveau fournisseur choisi.",
          "Votre ancien contrat est résilié automatiquement à la date de prise d'effet du nouveau contrat.",
          "Votre fournisseur actuel continue de vous fournir et de vous facturer jusqu'à la date effective du changement.",
          "Un simple changement de fournisseur n'entraîne ni coupure, ni changement de compteur.",
          "La continuité de l'alimentation est garantie par le gestionnaire du réseau de distribution, quel que soit le fournisseur.",
        ],
      },
      "Pour souscrire, vous devez communiquer à votre nouveau fournisseur le numéro de votre point de livraison — PDL ou PRM pour l'électricité, PCE pour le gaz — un numéro à quatorze chiffres qui figure sur vos factures. Vous pouvez également relever vous-même les index de votre compteur et les transmettre : le gestionnaire de réseau calcule alors l'index estimé à la date du changement, utilisé pour votre facture de clôture et la première facture du nouveau contrat.",
      "Il faut enfin distinguer le changement de fournisseur du déménagement : déménager implique des démarches spécifiques (ouverture ou transfert de contrat à une nouvelle adresse) qui ne relèvent pas du simple changement de fournisseur dans le même logement.",

      { type: "h2", text: "Que faut-il vérifier avant de changer de fournisseur ?" },
      "Avant de comparer les offres, sachez que plusieurs éléments doivent être passés en revue pour choisir un contrat adapté :",
      {
        type: "list",
        ordered: false,
        items: [
          "Le prix de l'énergie, en général exprimé en centimes par kilowattheure, selon votre type de consommation.",
          "Le prix de l'abonnement, qui peut varier selon la puissance souscrite ou le type de compteur.",
          "Les modalités d'évolution du prix : indexation, révision, offres à prix fixe ou variable.",
          "Les modalités de facturation : mensualisation, facture sur consommation réelle, fréquence.",
          "Les services associés : application, suivi de consommation, service client, options éventuelles.",
          "Les conditions particulières de l'offre : durée, pénalités éventuelles, options obligatoires.",
          "L'éventuelle prime de parrainage, sans qu'elle devienne le critère principal du choix.",
        ],
      },
      "La page [Service Public dédiée au choix d'un fournisseur](https://www.service-public.gouv.fr/particuliers/vosdroits/F18116) rappelle qu'il est possible d'avoir deux fournisseurs distincts — l'un pour l'électricité, l'autre pour le gaz — ou un seul pour les deux. Si une offre couvre les deux énergies, demandez à ce que le prix de chacune soit détaillé, pour pouvoir comparer séparément.",

      {
        type: "h2",
        text: "Parrainage énergie : la prime est-elle la seule chose à regarder ?",
      },
      "Non, et c'est le point le plus important à retenir. Une prime de parrainage est un avantage ponctuel, versé une fois les conditions remplies. Le contrat, lui, vous engage sur la durée pendant laquelle vous restez client : c'est lui qui détermine le montant de vos factures, mois après mois.",
      "Une prime généreuse peut donc être largement contrebalancée par un contrat moins adapté à votre consommation, ou par des conditions que vous ne pouvez pas remplir. Avant de souscrire via un lien de parrainage, comparez le prix du contrat, son abonnement, les modalités d'évolution du prix et l'adéquation de l'offre à vos besoins réels. Aucune offre ne peut être présentée comme moins chère sans une comparaison précise et vérifiée, car tout dépend de votre profil de consommation et de la zone où vous habitez.",

      {
        type: "h2",
        text: "Quelles offres de parrainage énergie sont disponibles sur Parrainio ?",
      },
      "Le catalogue de Parrainio documente des offres liées à l'énergie dans le hub [Énergie](/categories/energie). Les acteurs référencés ne sont pas tous des fournisseurs classiques : certains sont des fournisseurs d'électricité ou de gaz, d'autres accompagnent la consommation autrement. Voici ceux actuellement présents :",
      {
        type: "list",
        ordered: false,
        items: [
          "[EDF](/offres/edf) : le fournisseur historique d'électricité en France, qui commercialise des offres pour les particuliers.",
          "[TotalEnergies](/offres/totalenergies) : un acteur multi-énergies qui propose notamment des offres d'électricité et de gaz aux particuliers.",
          "[ENGIE](/offres/engie) : un fournisseur d'électricité et de gaz, avec des options selon les contrats.",
          "[Primeo Energie](/offres/primeo-energie) : un fournisseur d'électricité dont le programme de parrainage fonctionne avec un code client.",
          "[Hello Watt](/offres/hello-watt) : un service qui accompagne différents projets d'énergie — contrat, équipements, application — avec des programmes propres à chacun.",
          "[Liberté Watts](/offres/liberte-watts) : une application qui récompense les efforts de sobriété énergétique.",
          "[Reevolt](/offres/reevolt) : un service lié à la consommation d'électricité, qui récompense notamment la connexion du compteur Linky.",
        ],
      },
      "Les conditions, les formes de récompense et les éventuelles campagnes en cours sont détaillées sur chaque fiche, avec leur date de vérification : elles peuvent évoluer et ne doivent pas être généralisées d'un fournisseur à l'autre. Pour explorer l'ensemble des offres d'énergie référencées, rendez-vous sur le [hub Énergie](/categories/energie).",

      { type: "h2", text: "Comment profiter d'une prime de parrainage énergie ?" },
      "Si une offre de parrainage vous intéresse, voici la démarche à suivre pour mettre toutes les chances de votre côté :",
      {
        type: "list",
        ordered: false,
        items: [
          "Vérifier que l'offre de parrainage est toujours active, en consultant la fiche actualisée du fournisseur.",
          "Vérifier votre éligibilité : zone géographique, statut de nouveau client, type d'offre concerné.",
          "Utiliser le lien ou le code du parrain au moment de la souscription — c'est généralement la condition indispensable.",
          "Respecter scrupuleusement les conditions du programme, notamment la conservation du contrat et le paiement des factures.",
          "Conserver les informations de souscription : numéro de contrat, date, preuve de l'utilisation du lien ou du code.",
          "Attendre la validation prévue par le programme avant de considérer la prime comme acquise.",
        ],
      },
      "Si le programme prévoit une période de conservation du contrat, anticipez-la : une résiliation avant la validation empêche généralement l'attribution de la prime.",

      { type: "h2", text: "Changement de fournisseur : y a-t-il un risque de coupure ?" },
      "Non, dans le cadre d'un simple changement de fournisseur. La continuité de votre alimentation en électricité ou en gaz est garantie par le gestionnaire du réseau de distribution — la structure qui achemine l'énergie jusqu'à votre logement — quel que soit le fournisseur. Vous ne risquez aucune coupure liée au changement de fournisseur, et votre compteur reste en place.",
      "Une coupure ou une interruption peut en revanche survenir dans d'autres situations, qu'il faut distinguer : un problème technique sur le réseau, un impayé, ou certaines procédures liées à un déménagement. Si vous rencontrez une difficulté liée à l'exécution de votre contrat, la démarche recommandée par les sources officielles est de contacter d'abord le service client de votre fournisseur, puis d'adresser une réclamation écrite si le litige persiste. En dernier recours, vous pouvez saisir gratuitement le [Médiateur national de l'énergie](https://www.energie-info.fr/fiche_pratique/je-souhaite-changer-de-fournisseur-delectricite-ou-de-gaz-naturel/), dont le site Energie-Info répond également à vos questions (0800 11 22 12, appel et service gratuits).",

      { type: "h2", text: "Les erreurs à éviter" },
      "Voici les erreurs les plus fréquentes autour du parrainage énergie et du changement de fournisseur :",
      {
        type: "list",
        ordered: false,
        items: [
          "Choisir un fournisseur uniquement pour la prime, sans comparer le contrat et son prix sur la durée.",
          "Ne pas comparer l'offre : prix de l'énergie, abonnement, évolution tarifaire, services.",
          "Ne pas lire les conditions du programme de parrainage avant de souscrire.",
          "Utiliser le mauvais lien ou code, ou ne pas l'utiliser du tout au moment de la souscription.",
          "Confondre un changement de fournisseur avec un déménagement, qui relève de démarches distinctes.",
          "Croire que changer de fournisseur implique de changer de compteur ou de subir une coupure.",
          "Oublier de relever ses index ou de conserver les informations de son ancien contrat et de la facture de clôture.",
        ],
      },

      { type: "h2", text: "À savoir avant de souscrire" },
      {
        type: "list",
        ordered: false,
        items: [
          "Comparer les offres sur le contrat et le prix, pas uniquement sur la prime de parrainage.",
          "Vérifier les conditions du programme : éligibilité, offre concernée, forme et délai de la récompense.",
          "Vérifier les informations tarifaires : prix de l'énergie, abonnement, modalités d'évolution.",
          "Utiliser le lien ou le code du parrain au moment de la souscription lorsqu'il est requis.",
          "Conserver les documents de souscription et les preuves d'utilisation du lien ou du code.",
          "En cas de question particulière, consulter les sources officielles : [Energie-Info](https://www.energie-info.fr/fiche_pratique/je-souhaite-changer-de-fournisseur-delectricite-ou-de-gaz-naturel/) et [Service Public](https://www.service-public.gouv.fr/particuliers/vosdroits/F18116).",
        ],
      },

      { type: "h2", text: "Conclusion" },
      "Le parrainage énergie peut être un complément intéressant lorsque vous changez de fournisseur pour de bonnes raisons : une offre adaptée, un prix compétitif, des services utiles. Mais il ne doit jamais primer sur le contrat lui-même, et chaque programme a ses propres conditions, à vérifier avant de souscrire. Le changement de fournisseur, lui, est simple, gratuit et sans coupure pour les particuliers.",
      "Pour découvrir les offres d'énergie actuellement documentées sur Parrainio et leurs conditions, consultez le [hub Énergie](/categories/energie) ou parcourez l'ensemble des [offres de parrainage](/offres).",
    ],
  },
  {
    slug: "parrainage-crypto-fonctionnement-risques",
    title: "Parrainage crypto : récompenses, conditions et risques",
    h1: "Le parrainage crypto, comment ça marche ?",
    excerpt:
      "Bonus, KYC, dépôt, versement en crypto et volatilité : comment fonctionne vraiment un parrainage crypto, et ce qu'il faut vérifier avant de s'inscrire.",
    datePublished: "2026-09-05",
    category: "Guides",
    body: [
      "Le parrainage crypto fonctionne sur le même principe que les autres programmes de parrainage : une personne inscrit un proche via son lien ou son code, et la plateforme récompense le parrain, le filleul, ou les deux, lorsque les conditions sont remplies. La particularité du secteur, c'est que la récompense peut être versée en euros, en dollars, dans un crypto-actif, ou sous une forme variable — et que la valeur de certains actifs peut évoluer très fortement. Cet article explique comment fonctionne un parrainage crypto, ce qu'il faut vérifier avant de s'inscrire, et pourquoi un bonus ne garantit jamais un gain.",

      { type: "h2", text: "Qu'est-ce que le parrainage crypto ?" },
      "Un programme de parrainage crypto est proposé par une plateforme d'échange, une application d'investissement ou un service lié aux crypto-actifs. Le parrain — un client existant — recommande la plateforme à un filleul, généralement en lui transmettant un lien de parrainage ou un code. Si le filleul s'inscrit et remplit les conditions prévues, le programme verse une récompense.",
      "Pourquoi les plateformes proposent-elles ces programmes ? Essentiellement pour acquérir de nouveaux clients : un parrainage coûte souvent moins cher qu'une campagne publicitaire, et un utilisateur recommandé par un proche est statistiquement plus fiable. Cela explique aussi pourquoi ces programmes sont conditionnés à des actions concrètes — dépôt, achat, volume de transactions, conservation des actifs — plutôt qu'à une simple inscription : la plateforme récompense un client qui commence réellement à utiliser ses services.",

      { type: "h2", text: "Comment fonctionne un programme de parrainage crypto ?" },
      "Concrètement, le parcours repose toujours sur le même schéma, décliné selon la plateforme :",
      {
        type: "list",
        ordered: false,
        items: [
          "Le parrain partage son lien ou son code de parrainage, ou le retrouve sur sa fiche Parrainio.",
          "Le filleul ouvre un compte en utilisant ce lien ou ce code — souvent une condition indispensable.",
          "Le filleul effectue la ou les actions demandées : vérification d'identité, premier dépôt, premier achat, volume de transactions selon la campagne.",
          "La plateforme vérifie que les conditions sont remplies, puis attribue la récompense.",
          "La récompense est créditée sur le compte ou la cagnotte, ou versée selon les modalités du programme.",
        ],
      },
      "Chaque étape peut varier : certains programmes exigent un dépôt minimum, d'autres un volume d'échange atteint en un nombre de jours, d'autres encore une simple inscription vérifiée. Il n'existe pas de mécanisme commun à toutes les plateformes, et une récompense n'est jamais attribuée automatiquement à la seule création du compte.",

      { type: "h2", text: "Quelles conditions faut-il généralement remplir ?" },
      "Les conditions les plus fréquentes, que vous retrouverez déclinées différemment selon les programmes :",
      {
        type: "list",
        ordered: false,
        items: [
          "Être un nouveau client : les offres de parrainage sont généralement réservées aux comptes créés via le lien, et excluent les anciens clients.",
          "Passer une vérification d'identité (KYC) : la plupart des plateformes régulées l'exigent avant toute opération.",
          "Effectuer un premier dépôt, parfois d'un montant minimum selon la campagne.",
          "Réaliser un premier achat ou atteindre un volume de transactions dans une période définie.",
          "Conserver les actifs ou le compte actif pendant une durée prévue par le programme.",
          "Utiliser correctement le lien ou le code du parrain au moment de l'inscription.",
        ],
      },
      "Ces conditions sont propres à chaque programme et à chaque campagne : elles peuvent changer sans préavis. Seules les informations documentées à jour — celles des fiches Parrainio, datées et vérifiées — permettent de savoir ce qu'une offre exige précisément.",

      { type: "h2", text: "Quels types de récompenses peut-on recevoir ?" },
      "Les récompenses de parrainage crypto se présentent sous plusieurs formes, qu'il est essentiel de ne pas confondre :",
      {
        type: "list",
        ordered: false,
        items: [
          "Un montant fixe en euros ou en dollars, annoncé pour un montant donné, versé une fois les conditions remplies.",
          "Un montant fixe exprimé dans un crypto-actif (bitcoin, ether ou autre) : la valeur en euros du moment peut ensuite varier.",
          "Un montant variable, qui dépend d'un palier atteint : volume de transactions, montant du dépôt, période de la campagne.",
          "Une récompense non chiffrée, annoncée « selon la campagne active » ou « selon les conditions » : son montant n'est pas garanti à l'avance.",
          "Des points ou des avantages internes à la plateforme, qui ne sont pas directement comparables à une somme en euros.",
        ],
      },
      "Cette diversité explique pourquoi un classement unique des « primes crypto » serait trompeur : comparer un montant en euros à un montant en bitcoin, ou à des points internes, n'a pas de sens sans tenir compte de l'unité, des conditions et du moment du versement. Le [comparatif des parrainages crypto](/comparatif/parrainage-crypto) de Parrainio présente les récompenses telles qu'elles sont servies, sans convertir artificiellement les unités.",

      { type: "h2", text: "Pourquoi le montant d'une récompense peut-il varier ?" },
      "Une récompense annoncée peut varier pour plusieurs raisons, qu'il faut savoir distinguer :",
      {
        type: "list",
        ordered: false,
        items: [
          "Les campagnes changent : un programme peut être boosté pendant une période, puis revenir à un niveau de base.",
          "Certaines récompenses sont liées à un palier : plus le filleul échange ou dépose, plus la récompense peut être élevée, dans la limite du plafond annoncé.",
          "L'unité de la récompense peut fluctuer : un montant exprimé en crypto-actif vaut plus ou moins selon le cours au moment où il est reçu ou converti.",
          "Certaines offres affichent un montant « jusqu'à » : il correspond au maximum possible, pas à une somme garantie pour tous.",
          "Les conditions d'éligibilité peuvent exclure certains profils ou certaines opérations.",
        ],
      },
      "Quand une fiche indique un montant maximal ou un « jusqu'à », il ne faut jamais le lire comme une somme garantie : il décrit le plafond de la campagne, atteint seulement si toutes les conditions sont remplies.",

      { type: "h2", text: "Parrainage crypto : les étapes pour le filleul" },
      "Si une offre vous intéresse, voici la marche à suivre :",
      {
        type: "list",
        ordered: true,
        items: [
          "Identifier l'offre et lire ses conditions sur la fiche actualisée, en vérifiant la date de vérification des informations.",
          "Utiliser le lien ou le code du parrain au moment de la création du compte.",
          "Compléter la vérification d'identité demandée par la plateforme.",
          "Effectuer l'action requise par la campagne : dépôt, achat ou volume de transactions selon les conditions.",
          "Conserver les justificatifs de l'inscription et des opérations réalisées.",
          "Attendre la validation du programme avant de considérer la récompense comme acquise.",
        ],
      },

      { type: "h2", text: "Ce qu'il faut vérifier avant de s'inscrire" },
      "Avant d'ouvrir un compte via un lien de parrainage, plusieurs points méritent une vérification :",
      {
        type: "list",
        ordered: false,
        items: [
          "La nature et l'unité de la récompense : euros, dollars, crypto-actif, points, ou montant variable.",
          "Les conditions d'obtention : dépôt minimum, volume de transactions, durée, statut de nouveau client.",
          "Les modalités de versement : crédit sur le compte, cagnotte, délai, éventuel seuil de retrait.",
          "La période de validité de la campagne et son éventuel caractère temporaire.",
          "L'identité et le statut de la plateforme : privilégiez les prestataires enregistrés et les établissements reconnus.",
          "Les frais éventuels liés aux opérations, aux dépôts ou aux retraits.",
        ],
      },
      "Pour les aspects de sécurité, l'AMF rappelle l'importance de confier ses actifs uniquement à des professionnels répertoriés, de sécuriser ses accès et de ne jamais partager sa clé privée : perdre cette clé signifie perdre définitivement l'accès à ses crypto-actifs. Ces précautions valent pour toute utilisation d'une plateforme, avec ou sans parrainage.",

      { type: "h2", text: "Récompense en crypto et volatilité : la valeur réelle du bonus" },
      "Si la récompense est versée dans un crypto-actif, sa valeur au moment où vous la recevez peut être différente de celle annoncée au moment de l'inscription, et elle peut encore évoluer ensuite. Un bonus exprimé en bitcoin ou dans une autre crypto n'est donc pas équivalent à la même somme en euros à une date ultérieure.",
      "Cela ne signifie pas qu'une récompense en crypto est « meilleure » ou « moins bonne » qu'une récompense en euros : cela signifie qu'elle porte en plus un risque de variation de valeur, positif comme négatif. Pour estimer l'intérêt réel d'une offre, il faut tenir compte de l'unité de la récompense, du moment de son versement et des conditions qui la déclenchent — pas seulement du chiffre annoncé.",

      { type: "h2", text: "Les principaux risques liés aux crypto-actifs" },
      "L'AMF le rappelle dans ses [précautions pratiques sur les crypto-actifs](https://www.amf-france.org/fr/espace-epargnants/proteger-son-epargne/crypto-actifs-bitcoin-etc/investir-en-crypto-actifs-les-precautions-pratiques) : investir dans les crypto-actifs comporte des risques importants, notamment une forte volatilité, des risques techniques et des arnaques potentielles. Il est recommandé de n'y consacrer qu'une part d'épargne dont la perte ne mettrait pas en danger sa situation financière.",
      "Les autorités européennes de surveillance (ABE, AEMF, ACPR) ont également publié des [avertissements aux consommateurs sur les risques liés aux crypto-actifs](https://acpr.banque-france.fr/fr/actualites/les-autorites-europeennes-de-surveillance-avertissent-les-consommateurs-sur-les-risques-lies-aux), rappelant notamment que ces actifs ne bénéficient pas des mêmes protections que les placements traditionnels et que leur valeur peut fortement varier.",
      "Concrètement, cela signifie : la valeur d'un crypto-actif peut chuter rapidement ; une récompense reçue en crypto peut perdre de la valeur avant même d'être convertie ; certaines plateformes imposent une vérification d'identité et des conditions avant toute attribution ; et les conditions changent selon les plateformes et les campagnes. Le parrainage ne constitue en aucun cas une garantie de gain, et un bonus ne doit jamais être considéré comme un rendement ou un investissement sans risque.",

      { type: "h2", text: "Un bonus de parrainage ne veut pas dire qu'une opération est rentable" },
      "C'est le point le plus important à comprendre : une récompense de parrainage récompense l'utilisation d'un service, elle ne dit rien de la rentabilité de l'opération elle-même. Recevoir une prime pour ouvrir un compte ou effectuer un premier échange ne signifie pas que l'achat ou la conservation de crypto-actifs est profitable — d'autant que la valeur des actifs peut évoluer dans un sens comme dans l'autre.",
      "Une offre de parrainage peut donc être intéressante pour découvrir une plateforme dans le cadre d'un projet réfléchi, mais elle ne doit jamais être la raison d'acheter des crypto-actifs, ni être présentée comme un « gain facile ». L'AMF met d'ailleurs en garde contre les promesses de gains rapides et les offres trop alléchantes, qui caractérisent souvent les arnaques.",

      { type: "h2", text: "Comment comparer les offres de parrainage crypto ?" },
      "Comparer des programmes de parrainage crypto demande de regarder plusieurs éléments en même temps : l'unité et le type de la récompense (fixe, conditionnelle, variable), les conditions d'obtention, la période de campagne, et les modalités de versement. Une offre « jusqu'à » un montant élevé n'est pas forcément plus avantageuse qu'une offre plus modeste mais aux conditions simples.",
      "Par ailleurs, une véritable offre de parrainage doit être distinguée d'une simple promotion commerciale : le parrainage implique un lien ou un code rattaché à un parrain et obéit à des règles propres, tandis qu'une promotion de bienvenue peut être ouverte à tous sans parrain. Vérifiez quel mécanisme est réellement en jeu avant de vous inscrire.",
      "Le [comparatif des offres de parrainage crypto](/comparatif/parrainage-crypto) de Parrainio réunit les programmes actuellement documentés — par exemple [Kraken](/offres/kraken), [Crypto.com](/offres/crypto-com), [Bybit](/offres/bybit), [Coinbase](/offres/coinbase) ou [OKX](/offres/okx) — et renvoie vers chaque fiche pour les conditions détaillées. Le hub [Investissement & Crypto](/categories/investissement-crypto) permet d'explorer l'ensemble de l'univers, et la page [Comment ça marche](/comment-ca-marche) rappelle le fonctionnement général d'un parrainage sur Parrainio.",

      { type: "h2", text: "Conclusion" },
      "Le parrainage crypto repose sur un mécanisme simple — inscrire un proche via un lien ou un code — mais il se complique dès que l'on regarde les récompenses : unités différentes, conditions variées, campagnes temporaires, et parfois versement dans un actif dont la valeur fluctue. La règle à retenir : lire les conditions avant de s'inscrire, ne jamais considérer un montant « jusqu'à » comme une somme garantie, et ne pas confondre un bonus de parrainage avec une garantie de gain.",
      "Pour comparer les offres actuellement documentées et leurs conditions, consultez le [comparatif des parrainages crypto](/comparatif/parrainage-crypto) ou parcourez l'ensemble des [offres de parrainage](/offres).",
    ],
  },
  {
    slug: "freebet-comment-ca-marche",
    title: "Freebet : comment ça marche et quelles sont les conditions ?",
    h1: "Le freebet, comment ça marche ?",
    excerpt:
      "Le freebet n'est pas de l'argent disponible : définition, fonctionnement, conditions à vérifier et précautions à connaître avant de parier.",
    datePublished: "2026-09-05",
    category: "Guides",
    body: [
      "Un freebet — littéralement un « pari gratuit » — est un bonus proposé par un opérateur de paris sportifs : il vous permet de placer un ou plusieurs paris sans engager votre propre argent, généralement après une inscription, un premier dépôt ou un parrainage. Mais un freebet n'est pas de l'argent disponible : il ne se retire pas, il ne peut être utilisé que pour parier, et son utilisation est toujours encadrée par les conditions de l'offre. Cet article explique comment fonctionne un freebet, ce qu'il faut vérifier avant de l'utiliser, et pourquoi sa valeur affichée ne correspond pas à une somme immédiatement disponible.",

      { type: "h2", text: "Qu'est-ce qu'un freebet ?" },
      "Le freebet est un crédit de jeu offert par un opérateur de paris sportifs, qui permet de placer un pari sans miser d'argent réel. On le rencontre dans plusieurs contextes : une offre de bienvenue à l'inscription, un programme de parrainage (le filleul reçoit un freebet en s'inscrivant via le lien ou le code du parrain), une promotion liée à un événement sportif, ou une récompense de fidélité.",
      "Le freebet existe aussi sous d'autres formes proches, comme le « pari remboursé » : dans ce cas, si votre premier pari est perdant, l'opérateur restitue tout ou partie de votre mise, souvent sous forme de freebet plutôt qu'en argent réel. Ces mécanismes diffèrent selon les offres, et leurs modalités exactes sont toujours fixées par l'opérateur : aucune règle n'est universelle. En France, les paris sportifs ne peuvent être proposés que par des opérateurs agréés par l'Autorité nationale des jeux (ANJ).",

      { type: "h2", text: "Freebet et argent réel : quelle différence ?" },
      "La différence est fondamentale. L'argent réel déposé sur votre compte joueur vous appartient : vous pouvez le retirer selon les règles de l'opérateur, et il sert de mise sur vos paris. Un freebet, lui, est un bonus dont l'usage est limité au jeu : il ne peut généralement pas être retiré tel quel, et il n'est pas crédité sur votre solde comme le serait un versement.",
      "Concrètement, placer un pari avec un freebet ne vous fait pas perdre votre argent si le pari est perdant : c'est le bonus qui est consommé. En revanche, si le pari est gagnant, le traitement du gain dépend des conditions de l'offre : il est fréquent que seule une partie du gain soit créditée (la mise offerte n'étant pas restituée), mais ce n'est pas une règle valable partout. Les conditions de chaque offre doivent donc être lues avant d'utiliser un freebet.",

      { type: "h2", text: "Comment fonctionne un freebet ?" },
      "Le fonctionnement général peut se résumer ainsi, en gardant à l'esprit que chaque opérateur fixe ses propres règles :",
      {
        type: "list",
        ordered: false,
        items: [
          "Le freebet est crédité sur votre compte joueur après validation de l'offre (inscription, dépôt, parrainage ou promotion).",
          "Vous l'utilisez pour placer un pari, sans débourser d'argent réel pour ce pari.",
          "Si le pari est perdant, le freebet est consommé et vous n'avez rien perdu de votre propre argent.",
          "Si le pari est gagnant, le gain éventuel est crédité selon les conditions de l'offre.",
          "Le retrait éventuel des gains dépend des règles de l'opérateur et des conditions du bonus.",
        ],
      },
      "Les conditions associées à un freebet portent souvent sur les événements ou marchés éligibles, une éventuelle cote minimale, la durée de validité, ou le nombre d'utilisations autorisées. Ces éléments varient d'une offre à l'autre : ils ne doivent jamais être supposés identiques d'un opérateur à l'autre.",

      { type: "h2", text: "Comment un freebet peut-il être attribué ?" },
      "Les freebets sont attribués dans plusieurs cadres, qu'il est utile de distinguer :",
      {
        type: "list",
        ordered: false,
        items: [
          "L'offre de bienvenue : un freebet proposé à l'inscription, parfois conditionné à un premier dépôt ou à un premier pari.",
          "Le programme de parrainage : le filleul reçoit un avantage en s'inscrivant via le lien ou le code du parrain ; le parrain peut lui-même être récompensé.",
          "Une promotion ponctuelle : freebet lié à un événement sportif, une compétition ou une campagne limitée dans le temps.",
          "Un programme de fidélité : freebet offert en récompense d'une activité régulière.",
        ],
      },
      "Dans le cadre d'un parrainage, le réflexe à avoir est le même que pour tout programme : utiliser le lien ou le code du parrain au moment de l'inscription, et vérifier les conditions de l'offre sur la fiche actualisée avant d'ouvrir un compte. Pour comprendre comment un parrainage se déroule dans son ensemble, la page [Comment ça marche](/comment-ca-marche) de Parrainio présente le parcours général.",

      { type: "h2", text: "Quelles conditions faut-il vérifier ?" },
      "Avant d'utiliser un freebet, plusieurs conditions méritent d'être vérifiées sur l'offre concernée :",
      {
        type: "list",
        ordered: false,
        items: [
          "L'opérateur : vérifier qu'il s'agit d'un site agréé en France (les paris sportifs légaux sont ceux autorisés par l'ANJ).",
          "L'éligibilité : être majeur, nouveau joueur le cas échéant, avoir un compte valide et respecter les conditions d'accès.",
          "Le périmètre d'utilisation : événements, marchés ou types de paris éligibles au freebet.",
          "Une éventuelle cote minimale ou un montant minimal de pari, selon l'offre.",
          "La durée de validité : un freebet non utilisé avant son expiration est perdu.",
          "Le nombre d'utilisations : freebet utilisable en une fois ou fractionnable en plusieurs paris.",
          "Le traitement des gains et les éventuelles conditions de retrait.",
        ],
      },
      "Aucune de ces conditions n'est universelle : elles sont définies offre par offre, opérateur par opérateur. Les fiches Parrainio documentent les conditions actuellement servies, avec leur date de vérification, sans les transformer en règle générale.",

      { type: "h2", text: "Que deviennent les gains réalisés avec un freebet ?" },
      "Le sort des gains réalisés avec un freebet dépend entièrement des conditions de l'offre. Il est fréquent que le montant du freebet lui-même ne soit pas reversé : seul le gain obtenu au-delà de la mise offerte est crédité sur le compte. Par exemple, selon les règles de certaines offres, un pari gagnant placé avec un freebet crédite le gain net, la mise offerte étant reprise par l'opérateur.",
      "Il ne faut toutefois jamais généraliser : d'autres offres prévoient des modalités différentes, et les gains éventuels peuvent eux-mêmes être soumis à des conditions avant d'être retirables (délai, montant minimum, nouvelle mise à réaliser). La seule façon d'éviter une mauvaise surprise est de lire les conditions de l'offre avant d'utiliser le bonus, et de ne considérer un gain comme acquis qu'une fois son crédit effectif confirmé par l'opérateur.",

      { type: "h2", text: "Pourquoi la valeur affichée d'un freebet peut être trompeuse ?" },
      "Un freebet annoncé à un certain montant ne vaut pas la même somme en argent disponible. Plusieurs raisons expliquent cet écart :",
      {
        type: "list",
        ordered: false,
        items: [
          "Le freebet ne peut pas être retiré : il doit être utilisé sur des paris.",
          "Le gain éventuel dépend du pari placé : un freebet n'a de valeur que si le pari est gagnant, ce qui n'est jamais garanti.",
          "Le traitement du gain peut exclure la mise offerte, réduisant le montant réellement crédité.",
          "Les restrictions (marchés, cotes, durée) peuvent limiter les paris sur lesquels l'utiliser utilement.",
          "Un montant annoncé « jusqu'à » correspond au maximum possible, pas à une somme garantie.",
        ],
      },
      "C'est pourquoi comparer deux offres en se fiant uniquement au montant affiché des freebets est trompeur : il faut comparer les conditions d'ensemble, pas seulement le chiffre annoncé.",

      { type: "h2", text: "Freebet et paris sportifs : quels risques ?" },
      "Les paris sportifs comportent un risque de perte : il est possible de perdre l'argent misé, et certains paris exigent un dépôt préalable. Un freebet ne supprime pas ce risque — il le déplace sur le bonus, et les gains ne sont jamais garantis. Les jeux d'argent peuvent en outre entraîner des difficultés financières ou une dépendance : ils doivent rester une activité de loisir, réservée aux personnes majeures.",
      "Quelques principes à retenir : ne jamais parier pour tenter de récupérer une perte, ne pas miser plus que ce que l'on peut se permettre de perdre, et ne pas considérer un freebet comme une raison de jouer davantage. Si le jeu devient une source de difficultés, de l'aide existe : Joueurs Info Service répond au 09 74 75 13 13 (appel anonyme et non surtaxé), et la fiche [Service Public sur l'interdiction de jeux](https://www.service-public.gouv.fr/particuliers/vosdroits/F15814) explique les démarches de protection (auto-exclusion auprès de l'[ANJ](https://anj.fr/), limitations d'accès). Le site [joueurs-info-service.fr](https://www.joueurs-info-service.fr/) propose également informations et orientation.",

      { type: "h2", text: "Les erreurs à éviter avant d'utiliser un freebet" },
      "Voici les erreurs les plus fréquentes, à éviter :",
      {
        type: "list",
        ordered: false,
        items: [
          "Ne pas lire les conditions de l'offre avant d'utiliser le bonus.",
          "Croire qu'un freebet est de l'argent retirable ou équivalent à un versement en espèces.",
          "Ignorer la durée de validité et laisser expirer le bonus.",
          "Utiliser le freebet sur un marché ou un événement exclu par l'offre.",
          "Négliger une éventuelle cote minimale ou un montant minimal de pari.",
          "Oublier qu'un dépôt ou une validation de compte peut être exigé avant d'obtenir le bonus.",
          "S'inscrire sur un opérateur non agréé, au risque de se tourner vers un site illégal.",
          "Parier davantage ou pour « se refaire » simplement parce qu'un bonus est disponible.",
        ],
      },

      { type: "h2", text: "Comment comparer deux offres avec freebet ?" },
      "Pour comparer correctement deux offres comportant un freebet, il faut regarder bien plus que le montant annoncé :",
      {
        type: "list",
        ordered: false,
        items: [
          "La nature de l'avantage : freebet, pari remboursé, argent réel — ces mécanismes ne sont pas équivalents.",
          "Les conditions d'obtention : dépôt exigé, montant minimum, statut de nouveau client, lien ou code de parrainage.",
          "Le périmètre d'utilisation : marchés et événements éligibles, cotes minimales éventuelles.",
          "La durée de validité du bonus et le délai pour remplir les conditions.",
          "Le traitement des gains : mise offerte restituée ou non, conditions de retrait.",
          "L'opérateur lui-même : un site agréé par l'ANJ est la condition préalable à toute offre légale en France.",
        ],
      },
      "Le [comparatif des offres de paris sportifs](/comparatif/paris-sportifs) de Parrainio réunit les opérateurs actuellement documentés — [Winamax](/offres/winamax), [Betclic](/offres/betclic), [Unibet](/offres/unibet), [Parions Sport](/offres/parions-sport) et [Betsson](/offres/betsson) — et renvoie vers chaque fiche pour les conditions détaillées. Le hub [Jeux & Paris](/categories/jeux-paris) permet d'explorer l'ensemble de l'univers, et la page [Comment ça marche](/comment-ca-marche) rappelle le fonctionnement général d'un parrainage sur Parrainio.",

      { type: "h2", text: "Freebet : les points essentiels à retenir" },
      {
        type: "list",
        ordered: false,
        items: [
          "Un freebet est un crédit de jeu, pas de l'argent disponible : il se dépense en paris, il ne se retire pas.",
          "Son utilisation est toujours encadrée par les conditions de l'offre : périmètre, cotes, durée, traitement des gains.",
          "Les gains ne sont jamais garantis, et un bonus ne doit jamais être une raison de jouer davantage.",
          "Vérifier l'agrément de l'opérateur, les conditions d'obtention et la date de validité avant de s'inscrire.",
          "Les paris sportifs sont réservés aux personnes majeures et comportent un risque de perte et de dépendance.",
          "En cas de difficulté, l'aide existe : 09 74 75 13 13 (Joueurs Info Service, appel anonyme et non surtaxé).",
        ],
      },
      "Un freebet peut être un avantage intéressant dans le cadre d'une offre dont les conditions sont comprises et acceptées — jamais une raison de commencer à parier, ni une promesse de gain. Pour comparer les opérateurs actuellement documentés et leurs conditions, consultez le [comparatif des offres de paris sportifs](/comparatif/paris-sportifs) ou parcourez l'ensemble des [offres de parrainage](/offres).",
    ],
  },
  {
    slug: "comment-trouver-des-filleuls",
    title: "Comment trouver des filleuls et partager son parrainage ?",
    titleSuffix: "Guides & astuces Parrainio",
    h1: "Comment trouver des filleuls pour ses parrainages ?",
    excerpt:
      "Trouver des filleuls ne se résume pas à diffuser son lien partout : canaux pertinents, bonnes pratiques de partage et règles à vérifier avant de diffuser.",
    datePublished: "2026-09-05",
    category: "Guides",
    body: [
      "Vous avez un lien ou un code de parrainage, et vous vous demandez comment l'utiliser sans déranger ni être perçu comme un spammeur ? La réponse tient en une idée : partager son parrainage, c'est avant tout recommander un service à des personnes pour qui il peut réellement être utile, en respectant les règles de chaque programme. Cet article complète la page [Comment ça marche](/comment-ca-marche), qui explique le parcours d'un parrainage : ici, l'accent est mis sur la façon de trouver des filleuls et de diffuser son lien correctement.",

      { type: "h2", text: "Comment trouver des filleuls ?" },
      "Trouver des filleuls ne relève pas d'une méthode miracle : cela repose sur des recommandations pertinentes, faites au bon moment et aux bonnes personnes. Commencez par lister les personnes de votre entourage qui utilisent déjà le service concerné, qui envisagent de s'y inscrire, ou dont le besoin ressemble à celui que le service couvre. Une personne qui s'apprête de toute façon à ouvrir un compte ou à souscrire une offre est un candidat naturel : le parrainage peut alors être un avantage mutuel, sans aucune pression.",
      "L'idée clé est de vous mettre à la place de la personne à qui vous parlez : est-ce que cette offre lui est réellement utile ? Si la réponse est non, le lien ne servira qu'à créer une gêne — et la validation du parrainage échouera probablement de toute façon, car la plupart des programmes exigent une souscription réelle et des conditions remplies.",

      { type: "h2", text: "Commencer par les personnes réellement intéressées" },
      "La qualité prime nettement sur la quantité. Un filleul sincère, qui souscrit parce que le service répond à un besoin, remplit bien plus facilement les conditions du programme qu'une personne inscrite pour rendre service.",
      "Prenez le temps de comprendre pourquoi chaque offre pourrait intéresser telle ou telle personne : un proche qui cherche à changer de banque, un autre qui fait beaucoup d'achats en ligne, un foyer qui compare ses fournisseurs d'énergie, ou une personne qui s'intéresse aux crypto-actifs. C'est exactement le genre de situations où un parrainage apporte quelque chose — et c'est aussi la meilleure façon d'éviter d'insister auprès de personnes qui n'en ont pas besoin.",

      { type: "h2", text: "Où partager son lien de parrainage ?" },
      "Il existe plusieurs espaces pour partager un lien, avec des règles différentes :",
      {
        type: "list",
        ordered: false,
        items: [
          "La sphère privée : proches, amis, collègues, en message direct ou en conversation. C'est l'espace le plus naturel pour une recommandation.",
          "Les groupes et communautés en ligne (forums, groupes d'entraide) : pertinent uniquement si le contenu est utile et si le programme autorise ce type de partage.",
          "Les réseaux sociaux : possible, mais avec des précautions (voir plus bas) et le respect des règles de chaque programme.",
          "Les plateformes spécialisées de partage de parrainages : elles existent, mais leur usage dépend de ce que chaque programme autorise.",
        ],
      },
      "Il faut distinguer trois situations très différentes : partager son lien avec des proches dans une discussion privée, publier un lien dans un espace public, ou diffuser massivement un lien sans vérifier les conditions. Les programmes ne traitent pas ces usages de la même façon : certains interdisent la diffusion publique ou la publicité payante. Avant de publier votre lien où que ce soit, vérifiez ce que les conditions du programme autorisent.",

      { type: "h2", text: "Réseaux sociaux : comment partager sans spammer ?" },
      "Sur les réseaux sociaux, la frontière entre recommandation utile et spam est vite franchie. Quelques principes aident à rester du bon côté : répondre à des demandes ou des discussions où votre lien apporte une réponse, plutôt que de poster votre lien partout sans contexte ; ne pas envoyer de rafales de messages identiques à tous vos contacts ; et rester sobre dans la présentation, sans promettre de gain.",
      "Un point de vigilance supplémentaire : si vous publiez régulièrement des contenus qui vantent des offres dont vous tirez un avantage (lien de parrainage, commission, récompense), votre activité peut relever de l'influence commerciale. Depuis la loi du 9 juin 2023 encadrant l'influence commerciale, les contenus promotionnels doivent être transparents sur leur caractère commercial (mention « publicité » ou « collaboration commerciale »), comme le rappelle le dossier officiel d'[economie.gouv.fr sur l'encadrement des influenceurs](https://www.economie.gouv.fr/actualites/influenceurs-et-createurs-de-contenus-des-mesures-pour-encadrer-et-accompagner-les-professionnels-du-secteur). Un simple partage privé avec un proche n'a rien à voir avec cette situation, mais une page publique dédiée à vos liens de parrainage doit respecter ces règles de transparence.",

      { type: "h2", text: "Les plateformes spécialisées de parrainage" },
      "Il existe des sites et plateformes dédiés au partage de liens de parrainage, où chacun publie ses liens en espérant attirer des filleuls. Leur intérêt est réel pour certains programmes : elles concentrent un public déjà familier du parrainage, et certaines offres y sont spécifiquement destinées.",
      "Mais leur usage doit rester conditionné aux règles du programme. De nombreux programmes précisent explicitement comment leur lien peut être diffusé, et certains excluent les inscriptions issues de publications publiques ou de plateformes de partage. Par ailleurs, ces espaces attirent parfois des promesses exagérées : aucun lien ne garantit un nombre de filleuls, et une récompense n'est due que lorsque les conditions sont validées.",

      { type: "h2", text: "Comment rédiger un bon message de parrainage ?" },
      "Un bon message de parrainage est court, clair et sans pression. Il dit quel service est concerné, pourquoi il peut intéresser la personne, et laisse celle-ci libre de répondre. Voici un exemple générique — libre à vous de l'adapter, et ne le présentez jamais comme une règle universelle :",
      "« Salut ! Si tu avais justement prévu d'utiliser [service], il existe actuellement une offre de parrainage. Je peux te transmettre mon lien si ça t'intéresse. Les conditions sont à vérifier avant l'inscription. »",
      "Ce message fonctionne parce qu'il respecte trois principes : il ne suppose pas que la personne va s'inscrire, il invite à vérifier les conditions plutôt qu'à foncer, et il ne promet aucun montant. Si la personne n'est pas intéressée, n'insistez pas : une inscription forcée risque de toute façon de ne pas être validée.",

      { type: "h2", text: "Faut-il proposer une offre à tout le monde ?" },
      "Non. Proposer son lien à tout son carnet d'adresses, sans discernement, produit l'effet inverse : cela agace et peut être perçu comme du démarchage non sollicité. Réservez vos propositions aux personnes pour lesquelles l'offre a un sens, et privilégiez un échange direct plutôt qu'un envoi massif.",
      "La prudence est d'autant plus importante que certaines démarches sont encadrées. Si un programme vous invite à saisir les coordonnées d'un proche pour lui envoyer une invitation, la [CNIL rappelle les règles applicables au parrainage](https://www.cnil.fr/fr/cnil-direct/question/quelles-sont-les-regles-suivre-en-matiere-de-parrainage) : la personne contactée doit être informée de l'identité de son parrain, ses données ne peuvent être utilisées qu'une seule fois pour cette invitation, et tout message supplémentaire nécessite son accord. En clair : ne sollicitez pas des personnes qui ne vous ont rien demandé, et soyez transparent sur qui vous êtes et pourquoi vous les contactez.",

      { type: "h2", text: "Vérifier les conditions avant de partager" },
      "Les règles de parrainage varient fortement d'un programme à l'autre. Avant de diffuser votre lien, vérifiez au minimum :",
      {
        type: "list",
        ordered: false,
        items: [
          "Le profil attendu du filleul : nouveau client, zone géographique, âge, type de compte ou d'offre concerné.",
          "L'usage autorisé du lien : certains programmes limitent le partage à la sphère privée ou interdisent certaines publications.",
          "L'éventuelle interdiction de l'auto-parrainage et des inscriptions multiples.",
          "La période de validité de la campagne : un lien hors délai ne génère aucune récompense.",
          "Les conditions de validation : dépôt, achat, durée de conservation du compte, actions demandées.",
        ],
      },
      "Ces informations sont précisées dans les conditions de chaque programme. Sur Parrainio, chaque fiche documente les conditions actuellement vérifiées — par exemple [Fortuneo](/offres/fortuneo) dans la banque ou [iGraal](/offres/igraal) dans le cashback — avec leur date de vérification : consultez toujours la fiche avant de partager un lien, et ne supposez jamais qu'une règle observée chez un programme s'applique à un autre.",

      { type: "h2", text: "Les erreurs qui peuvent faire perdre une récompense" },
      "Beaucoup de récompenses de parrainage sont perdues pour des raisons évitables. Les erreurs les plus fréquentes :",
      {
        type: "list",
        ordered: false,
        items: [
          "Partager le mauvais lien ou le mauvais code, ou un lien qui a expiré.",
          "Laisser le filleul s'inscrire sans utiliser le lien ou le code (le parrainage n'est alors pas rattaché).",
          "Diffuser le lien dans un espace public alors que le programme l'interdit.",
          "Tenter de s'auto-parrainer ou de créer plusieurs comptes pour valider une offre (souvent sanctionné par l'annulation).",
          "Ne pas vérifier que le filleul correspond au profil attendu (nouveau client, conditions d'éligibilité).",
          "Oublier que le filleul doit remplir les conditions du programme (dépôt, achat, délai) pour que la récompense soit validée.",
          "Promettre un gain à la personne inscrite alors que la validation n'est jamais garantie.",
        ],
      },
      "La meilleure protection : ne partager un lien qu'avec des personnes réellement concernées, leur expliquer les conditions essentielles, et garder une trace de la date et du lien utilisés si une question se pose.",

      { type: "h2", text: "Comment utiliser plusieurs programmes intelligemment ?" },
      "Si vous participez à plusieurs programmes de parrainage, l'erreur serait de tout envoyer à tout le monde. Une approche intelligente consiste à associer chaque offre au besoin précis d'une personne : le proche qui change de banque, celui qui fait ses courses en ligne avec une plateforme de cashback, celui qui compare les fournisseurs d'énergie, celui qui s'intéresse aux placements. Les hubs de Parrainio peuvent vous aider à repérer ces univers : [Banque & Finance](/categories/banque-finance), [Cashback](/categories/cashback), [Énergie](/categories/energie) ou [Investissement & Crypto](/categories/investissement-crypto).",
      "Enfin, gardez en tête que la recommandation ne doit jamais être motivée uniquement par la récompense : si vous recommandez un service dont vous n'êtes pas convaincu, vous engagez votre crédibilité auprès de vos proches, et le parrainage ne sera probablement pas validé. Recommandez ce que vous utilisez et appréciez — c'est la condition de base d'un parrainage réussi.",

      { type: "h2", text: "Parrainage : privilégier la qualité plutôt que la quantité" },
      "Un seul filleul sincère vaut mieux que des dizaines de liens diffusés au hasard : sa souscription a des chances réelles d'être validée, votre entourage ne se sent pas sollicité à tort, et votre réputation reste intacte. Les programmes vérifient d'ailleurs de plus en plus la qualité des parrainages et peuvent annuler les récompenses issues d'inscriptions frauduleuses ou non conformes.",
      "La régularité paie plus que l'intensité : plutôt que de tout publier d'un coup, partagez une offre lorsque vous croisez une personne concernée, ou lorsqu'une campagne est particulièrement adaptée à un besoin dont vous avez connaissance. Vous trouverez régulièrement des offres à découvrir dans le [classement des primes actuellement documentées](/classement-primes-parrainage) — un outil pour explorer, pas une promesse de gain.",

      { type: "h2", text: "Ce qu'il faut retenir" },
      {
        type: "list",
        ordered: false,
        items: [
          "Un parrainage se partage d'abord avec des personnes réellement susceptibles d'utiliser le service, jamais avec tout le monde.",
          "La recommandation sincère et utile vaut mieux qu'une diffusion massive, qui agace et qui échoue souvent.",
          "Chaque programme a ses propres règles : vérifiez-les avant de partager, et ne généralisez jamais une règle observée ailleurs.",
          "Un bon message est court, clair, sans pression, et invite à vérifier les conditions.",
          "Ne promettez jamais un gain et ne recommandez pas un service dont vous n'êtes pas convaincu.",
          "En cas de doute sur un usage (publication publique, sollicitation de proches), renseignez-vous auprès des conditions du programme.",
        ],
      },
      "Trouver des filleuls est avant tout une affaire de pertinence et de confiance : les bonnes personnes, le bon moment, et des conditions vérifiées. Pour revoir le fonctionnement d'un parrainage de bout en bout, la page [Comment ça marche](/comment-ca-marche) reste la référence, et le catalogue des [offres de parrainage](/offres) vous permet d'explorer les programmes actuellement documentés avant de choisir lesquels partager.",
    ],
  },
  {
    slug: "comment-economiser-au-quotidien",
    title: "Comment économiser au quotidien : les dépenses à optimiser",
    titleSuffix: "Guides & astuces Parrainio",
    h1: "Comment économiser au quotidien ?",
    excerpt:
      "Pour améliorer son budget, mieux vaut repérer les dépenses récurrentes à optimiser que chercher de petites économies ponctuelles : la méthode concrète.",
    datePublished: "2026-09-05",
    category: "Guides",
    body: [
      "Pour économiser au quotidien, le réflexe le plus efficace n'est pas de traquer les petites dépenses une par une, mais d'identifier les postes récurrents qui pèsent réellement sur le budget : un abonnement inutilisé, un contrat jamais recomparé, des frais bancaires évitables. Cet article propose une méthode concrète pour faire le point, dans l'ordre des priorités, en s'appuyant sur des démarches simples et des outils officiels de comparaison.",

      { type: "h2", text: "Commencer par savoir où part son argent" },
      "Difficile d'optimiser un budget que l'on ne connaît pas. La première étape consiste à lister ses ressources, puis ses dépenses sur deux ou trois mois, en s'aidant des relevés de compte et des prélèvements automatiques. Le site public d'éducation financière [Mes questions d'argent](https://www.mesquestionsdargent.fr/budget/comment-faire-ses-comptes), porté par la Banque de France, détaille précisément cette méthode pour faire et tenir ses comptes.",
      "Cette phase de recensement n'a pas besoin d'être parfaite : il s'agit d'obtenir une vision d'ensemble. C'est souvent à ce moment-là que l'on découvre des prélèvements oubliés, des abonnements superposés ou des montants bien plus élevés qu'imaginé sur certains postes.",

      { type: "h2", text: "Distinguer les dépenses fixes, variables et occasionnelles" },
      "Une fois les dépenses recensées, les classer en trois familles aide à savoir où agir : les dépenses fixes et récurrentes (loyer, assurances, abonnements, forfaits), les dépenses variables (alimentation, énergie, transport), et les dépenses occasionnelles (achats ponctuels, loisirs). Les dépenses récurrentes méritent une attention particulière : une fois en place, elles se répètent chaque mois sans qu'on y pense, et leur optimisation produit un effet durable.",
      "Des répartitions types circulent pour guider la réflexion, comme la règle dite des 50/30/20 entre besoins, envies et épargne, présentée par le site pédagogique [La finance pour tous](https://www.lafinancepourtous.com/outils/questions-reponses/budget-qu-est-ce-que-la-regle-des-50-30-20/). Ce n'est pas une norme à respecter au mot près, mais un repère utile pour prendre conscience de l'équilibre entre les postes.",

      { type: "h2", text: "Faire le ménage dans ses abonnements" },
      "Les abonnements constituent l'un des gisements d'économies les plus simples à activer. Plateformes de streaming, salle de sport, stockage en ligne, box internet, forfait mobile, assurance annexe : les offres se cumulent souvent sans être toutes utilisées. Le réflexe : lister les prélèvements mensuels, puis évaluer honnêtement l'usage de chaque service sur les dernières semaines.",
      "Pour un service réellement utilisé, la question est de savoir si l'offre actuelle est toujours adaptée. Pour un service délaissé, la résiliation est une économie immédiate et récurrente, sans contrepartie. Attention simplement aux offres d'essai ou aux formules « gratuites » qui se transforment en prélèvement automatique passé le premier mois : notez la date de fin de la période d'essai dès la souscription.",

      { type: "h2", text: "Comparer régulièrement ses contrats et fournisseurs" },
      "Les marchés de l'énergie, de l'assurance, de la banque ou des télécoms évoluent en permanence : une offre compétitive à la souscription peut ne plus l'être quelques années plus tard. Comparer ne signifie pas changer systématiquement, mais vérifier que son contrat reste dans la moyenne du marché. Pour l'électricité et le gaz, le [comparateur officiel du Médiateur national de l'énergie](https://comparateur-offres.energie-info.fr/) est impartial et gratuit, et le changement de fournisseur est possible à tout moment, sans frais ni coupure — un point détaillé dans notre article sur le [parrainage énergie](/blog/parrainage-energie).",
      "Côté téléphonie et internet, les offres de parrainage des opérateurs peuvent aussi réduire la facture, mais uniquement si l'offre correspond à votre usage. Vous pouvez comparer les programmes actuellement documentés sur le hub [Téléphone & Internet](/categories/telephone-internet). Pour l'assurance, la même logique s'applique : faire jouer la concurrence à l'échéance du contrat, en comparant les garanties et pas seulement le prix.",

      { type: "h2", text: "Réduire sa facture d'énergie sans changer ses habitudes" },
      "L'énergie est un poste où des gestes simples réduisent la consommation sans dégrader le confort : baisser le chauffage d'un degré, éteindre les appareils en veille, adapter la température de l'eau chaude, utiliser les cycles économiques des appareils. Ces gestes se cumulent, mais c'est d'abord le contrat qui fixe le prix de chaque kilowattheure consommé : d'où l'intérêt de comparer les offres avant de raisonner sur la seule consommation.",
      "Pour comprendre sa facture et ses options, le site [Energie-Info](https://www.energie-info.fr/) du Médiateur national de l'énergie explique comment se composent les prix et comment repérer les pièges des offres trop complexes. Notre article consacré au [parrainage énergie](/categories/energie) détaille les offres de fournisseurs actuellement documentées sur Parrainio, avec leurs fiches complètes.",

      { type: "h2", text: "Optimiser ses dépenses bancaires" },
      "Les frais bancaires varient fortement selon les établissements et les formules : tenue de compte, carte, découvert, opérations courantes. Une banque en ligne ou une offre adaptée à son usage peut réduire nettement ce poste, à condition de comparer les services inclus — et pas seulement le prix — avant de changer. Notre [comparatif des offres de parrainage bancaire](/comparatif/parrainage-bancaire) rassemble les banques actuellement documentées, et le hub [Banque & Finance](/categories/banque-finance) permet d'explorer l'ensemble des offres de cet univers.",
      "Pour accompagner le changement, le service d'aide à la mobilité bancaire, que nous détaillons dans notre [guide du changement de banque](/blog/changer-de-banque-prime-parrainage), permet de transférer les prélèvements et virements récurrents vers le nouveau compte. Un changement réfléchi peut ainsi réduire durablement les frais — une économie récurrente bien supérieure à une prime ponctuelle mal choisie.",

      { type: "h2", text: "Utiliser le cashback sur les achats déjà prévus" },
      "Le cashback permet de récupérer une partie du montant d'un achat effectué chez un marchand partenaire, à condition que l'achat soit passé par la plateforme puis validé. Son intérêt est réel pour les achats que l'on comptait de toute façon effectuer : un plein en ligne, une réservation, un achat programmé. Il ne s'agit pas d'une réduction immédiate au moment du paiement, mais d'un crédit versé ensuite selon les règles de la plateforme — notre article [le cashback, comment ça marche](/blog/le-cashback-comment-ca-marche) explique le détail du mécanisme.",
      "Le réflexe à garder : activer le cashback avant l'achat, passer par le parcours de la plateforme, et vérifier les conditions de validation. Pour comparer les plateformes actuellement documentées, rendez-vous sur le [comparatif des plateformes de cashback](/comparatif/cashback) ou explorez le hub [Cashback](/categories/cashback). Les bons plans et codes de réduction du hub [Shopping & Courses](/categories/shopping-courses) peuvent compléter la démarche, toujours sur des achats prévus.",

      { type: "h2", text: "Profiter des offres de parrainage sans acheter inutilement" },
      "Les offres de parrainage peuvent apporter une prime de bienvenue ou un avantage à l'inscription, mais elles n'ont d'intérêt que si le service correspond à un vrai besoin. La règle est simple : si vous envisagiez déjà d'ouvrir un compte, de souscrire une offre d'énergie ou de vous inscrire sur une plateforme de cashback, utiliser un parrainage peut être un petit plus ; souscrire uniquement pour toucher une prime revient souvent à payer un service dont vous n'avez pas l'usage. Le fonctionnement général est expliqué sur la page [Comment ça marche](/comment-ca-marche), et les programmes actuellement documentés sont consultables sur [la liste des offres](/offres) et le [classement des primes](/classement-primes-parrainage).",
      "Deux précautions valent pour tous les univers : les campagnes évoluent, donc les conditions doivent être vérifiées au moment de l'inscription, et une prime n'est jamais acquise tant que les conditions du programme ne sont pas remplies. Enfin, restez lucide sur les promesses de « revenus faciles » : certains univers présents sur Parrainio, comme les [paris sportifs](/comparatif/paris-sportifs) ou la [crypto](/comparatif/parrainage-crypto), n'ont rien à voir avec des économies du quotidien — ce sont des activités risquées, jamais un moyen d'arrondir son budget.",

      { type: "h2", text: "Vérifier les aides auxquelles on peut avoir droit" },
      "Avant de chercher à réduire ses dépenses, il est utile de vérifier qu'aucune aide ne reste non réclamée. Le portail officiel [mesdroitssociaux.gouv.fr](https://mesdroitssociaux.gouv.fr/) permet d'évaluer ses droits à plus d'une centaine de prestations (logement, famille, énergie, santé) à partir de sa situation. La démarche est gratuite, confidentielle et sans engagement.",
      "Des aides portent directement sur des postes du quotidien, comme les chèques énergie ou les dispositifs d'aide au logement. En cas de difficulté ponctuelle, des structures comme [France services](https://www.france-services.gouv.fr/) accompagnent gratuitement dans les démarches administratives, et le dossier des [aides financières de Service Public](https://www.service-public.gouv.fr/particuliers/vosdroits/N32475) recense les dispositifs par situation.",

      { type: "h2", text: "Les fausses économies à éviter" },
      "Certains réflexes présentés comme économiques coûtent en réalité plus cher qu'ils ne rapportent :",
      {
        type: "list",
        ordered: false,
        items: [
          "Acheter un article uniquement parce qu'il est soldé ou en promotion, sans besoin réel : la dépense reste une dépense.",
          "Souscrire à un service uniquement pour obtenir une prime de parrainage ou un bonus de bienvenue, puis payer des mois un usage absent.",
          "Changer d'offre ou de fournisseur sans comparer le coût total : une prime d'entrée peut masquer des conditions moins avantageuses sur la durée.",
          "Cumuler les périodes d'essai et les abonnements « gratuits » qui deviennent payants dès qu'on oublie de les résilier.",
          "Confondre cashback et réduction immédiate, ou considérer un montant en attente de validation comme définitivement acquis.",
          "Ne regarder que le montant d'une prime sans lire les conditions qui permettent de l'obtenir.",
        ],
      },
      "Une économie n'est réelle que si elle correspond à un besoin réel. Le piège le plus courant est de dépenser « parce que c'est une bonne affaire » : la bonne affaire n'existe que si l'achat était prévu ou nécessaire.",

      { type: "h2", text: "Mettre en place une méthode simple et durable" },
      "Les économies les plus efficaces sont celles qui se répètent sans effort constant. Une méthode réaliste tient en trois gestes : consacrer une fois par mois un court moment à l'examen des prélèvements et des relevés ; programmer un créneau annuel pour comparer les contrats importants (énergie, assurance, banque, téléphonie) ; et décider à l'avance du sort des dépenses occasionnelles plutôt que de trancher sous le coup de l'envie.",
      "Inutile de vouloir tout changer d'un coup : mieux vaut traiter les deux ou trois postes qui pèsent le plus, puis entretenir le résultat. La régularité compte plus que l'intensité — une revue mensuelle de vingt minutes vaut mieux qu'un grand tri annuel oublié en cours de route.",

      { type: "h2", text: "Les économies à rechercher en priorité" },
      "En résumé, l'ordre de priorité est presque toujours le même : supprimer d'abord ce qui est inutile (abonnements délaissés, services redondants), réduire ensuite ce qui est récurrent (contrats recomparés, frais bancaires évités), et ne profiter des offres ponctuelles — cashback, primes de parrainage, bons plans — que sur des achats ou des souscriptions que vous comptiez de toute façon réaliser.",
      "Cette méthode ne promet pas un montant précis d'économie, car tout dépend de votre situation : elle vise simplement à ce que chaque euro dépensé corresponde à un usage réel, au juste prix. Pour explorer les offres de parrainage et les bons plans actuellement documentés, parcourez [la liste des offres](/offres) et ses hubs par univers, en commençant par ceux qui touchent à vos dépenses récurrentes.",
    ],
  },
  {
    slug: "comment-economiser-sur-ses-abonnements",
    title: "Comment économiser sur ses abonnements : le guide pratique",
    titleSuffix: "Guides & astuces Parrainio",
    h1: "Comment économiser sur ses abonnements ?",
    excerpt:
      "Streaming, télécom, logiciels, salle de sport : la méthode pour reprendre le contrôle de ses abonnements récurrents et cesser de payer pour l'inutile.",
    datePublished: "2026-09-05",
    category: "Guides",
    body: [
      "Un abonnement à quelques euros par mois semble anodin. Mais l'accumulation de plusieurs abonnements — vidéo, musique, télécom, logiciels, sport, services en ligne — peut représenter chaque mois une somme bien supérieure à ce que l'on imagine, pour des services parfois à peine utilisés. Cet article propose une méthode concrète pour reprendre le contrôle : faire l'inventaire, trier, vérifier les conditions, résilier ce qui ne sert plus et payer moins cher ce que l'on garde. Il complète notre [guide général pour économiser au quotidien](/blog/comment-economiser-au-quotidien), centré sur l'ensemble du budget : ici, tout est consacré aux abonnements.",

      { type: "figure", variant: "subscriptions" },

      { type: "h2", text: "Pourquoi les abonnements pèsent-ils autant dans un budget ?" },
      "Les abonnements ont une particularité : leur coût se répète chaque mois sans aucune action de votre part. Un prélèvement de quelques euros ne déclenche pas la même vigilance qu'un achat ponctuel, et l'on finit par cumuler des services qui se superposent : deux plateformes de vidéo, un stockage en ligne oublié, une salle de sport fréquentée trois fois, un forfait mobile surdimensionné.",
      "C'est aussi la catégorie de dépenses la plus facile à optimiser : contrairement au loyer ou aux impôts, un abonnement se résilie, se suspend ou se remplace. Il suffit de savoir lesquels on a, lesquels on utilise, et quelles sont les règles de résiliation — trois informations que presque personne ne vérifie avant la date anniversaire du contrat.",

      { type: "h2", text: "Faire l'inventaire de tous ses abonnements" },
      "L'inventaire ne se fait pas de mémoire : il se fait à partir des relevés. Ouvrez votre espace bancaire et listez les prélèvements automatiques des douze derniers mois — c'est la seule façon de ne rien oublier, y compris les abonnements souscrits lors d'une période d'essai puis oubliés. Pour chacun, notez le nom du service, le montant prélevé et sa périodicité : beaucoup de surprises apparaissent à cette étape.",
      "Une fois la liste établie, la méthode tient en quatre temps, détaillés dans la suite de cet article :",

      {
        type: "cards",
        items: [
          { icon: "🔎", title: "Identifier", text: "Lister les prélèvements récurrents depuis l'espace bancaire." },
          { icon: "✂️", title: "Trier", text: "Garder ce qui sert réellement, résilier le reste." },
          { icon: "💰", title: "Optimiser", text: "Comparer les tarifs et choisir la formule adaptée." },
          { icon: "🔄", title: "Revoir", text: "Refaire le point régulièrement, tous les trois mois." },
        ],
      },

      { type: "h2", text: "Repérer les abonnements que l'on n'utilise presque jamais" },
      "Pour chaque abonnement de la liste, posez une question simple : l'ai-je réellement utilisé au cours des trente derniers jours ? Un service vidéo regardé une fois par mois, une salle de sport délaissée depuis l'hiver, un logiciel installé pour un projet terminé : ce sont les candidats naturels à la résiliation. L'usage régulier est le critère décisif, bien plus que le prix affiché.",
      "Le schéma suivant résume la décision à prendre pour chaque abonnement :",

      {
        type: "process",
        steps: [
          { title: "Abonnement repéré", text: "Retrouvé sur le relevé, avec son montant et sa périodicité." },
          { title: "Utilisé ces 30 derniers jours ?", text: "Sans effort particulier ni bonne résolution pour « bientôt »." },
          { title: "Oui — le prix reste-t-il juste ?", text: "Sinon, comparer avant de conserver ou de changer de formule." },
          { title: "Non — je décide", text: "Résilier, suspendre, ou passer à une offre plus légère." },
        ],
      },

      { type: "h2", text: "Vérifier les conditions de chaque abonnement" },
      "Avant de résilier ou de conserver, lisez les conditions du contrat : beaucoup d'abonnements fonctionnent à tacite reconduction, c'est-à-dire qu'ils se renouvellent automatiquement à la date anniversaire si aucune des parties ne demande leur arrêt. La résiliation doit alors être demandée dans le délai de préavis prévu au contrat, avant cette date anniversaire — la [page Service Public consacrée à la résiliation des contrats à tacite reconduction](https://www.service-public.gouv.fr/particuliers/vosdroits/F33991) explique précisément ces mécanismes.",
      "Trois informations suffisent pour chaque abonnement : sa prochaine échéance, la date limite pour demander la résiliation sans reconduction, et le moyen prévu par le contrat pour la notifier (courrier, formulaire en ligne, espace client). Notez-les dans votre agenda : c'est la seule manière de ne pas rater la fenêtre et de rester maître du renouvellement.",

      { type: "h2", text: "Peut-on résilier facilement ?" },
      "Oui, plus facilement qu'avant. Depuis le 1er juin 2023, les professionnels doivent proposer un parcours de résiliation en ligne simple aux contrats souscrits en ligne : la [loi du 16 août 2022 pour la protection du pouvoir d'achat](https://www.inc-conso.fr/content/vous-pouvez-resilier-votre-contrat-dabonnement-en-quelques-clics) a généralisé le bouton « résilier votre contrat », visible et accessible, sans passer obligatoirement par un espace client. Cette facilité concerne notamment les opérateurs téléphoniques, les salles de sport, les services informatiques, les médias en ligne et les sites de rencontres.",
      "Autre garde-fou important : chaque année, le professionnel doit vous informer, avant le renouvellement, de votre droit à ne pas reconduire le contrat, en précisant la date limite pour agir. S'il ne le fait pas, vous pouvez résilier à tout moment, sans frais ni pénalité — un droit rappelé par [Service Public](https://www.service-public.gouv.fr/particuliers/vosdroits/F33991). En cas de litige malgré des démarches correctes, le parcours classique s'applique : réclamation écrite au professionnel, puis médiateur de la consommation, puis tribunal.",
      { type: "h2", text: "Peut-on payer moins cher sans perdre le service ?" },
      "Avant de résilier un abonnement que vous utilisez vraiment, vérifiez s'il existe une formule plus adaptée : une offre familiale ou partagée si plusieurs membres du foyer paient séparément, un palier inférieur si l'option actuelle dépasse votre usage, ou une facturation annuelle si le service est certain d'être conservé. Ces choix dépendent de chaque service et de ses offres du moment : aucune règle générale ne s'applique, c'est la comparaison qui décide.",
      "Le bon réflexe est de refaire cette vérification lorsque le service vous contacte pour une hausse tarifaire ou un changement de conditions : c'est le moment où la négociation ou le changement de formule est le plus naturel. Conservez simplement la trace des conditions acceptées, pour pouvoir les comparer sereinement à la prochaine échéance.",

      { type: "h2", text: "Téléphone et internet : comparer avant de changer" },
      "Forfait mobile et box internet sont souvent les abonnements les plus lourds du foyer, et ceux dont les offres évoluent le plus vite. Avant tout changement, comparez ce que vous payez à ce que vous utilisez réellement : data consommée, débit utile, options superflues. Une offre moins chère n'a d'intérêt que si elle couvre l'usage réel — l'inverse revient à payer moins pour un service qui ne convient plus.",
      "Quand le choix est fait, sachez que la résiliation d'un contrat téléphonique ou internet est encadrée et facilitée : après la période d'engagement éventuelle, elle est possible sans frais, et le parcours en ligne doit être simple. Les opérateurs présents sur le hub [Téléphone & Internet](/categories/telephone-internet) proposent parfois des offres de parrainage : elles n'ont d'intérêt que si vous comptiez de toute façon changer — dans ce cas, comparez l'offre globale, pas seulement la prime.",

      { type: "h2", text: "Services numériques : attention aux essais gratuits" },
      "Les périodes d'essai « gratuites » sont l'un des pièges les plus fréquents : sans annulation avant la fin, elles basculent automatiquement en abonnement payant. La règle simple consiste à noter dès la souscription la date de fin de l'essai et le moyen de l'annuler, puis à décider immédiatement si le service sera conservé — pas le dernier jour, sous la pression d'un prélèvement imminent.",
      "Le même réflexe vaut pour les applications et logiciels souscrits pour un besoin ponctuel, puis oubliés : un abonnement mensuel à un outil utilisé deux fois par an coûte plus cher qu'un achat unique ou qu'une formule à l'usage. Les offres de services numériques documentées sur le hub [Services numériques](/categories/services-numeriques) peuvent servir de point de départ pour comparer, mais le critère reste votre usage réel.",

      { type: "h2", text: "Cashback et offres de bienvenue : quand cela peut être intéressant" },
      "Une offre de bienvenue, un bonus de parrainage ou un cashback ne doivent jamais être la raison d'une souscription : ils n'ont de sens que lorsque le service correspond à un besoin réel. Si vous avez décidé de garder une plateforme vidéo, un abonnement sportif ou un service en ligne, vérifier s'il existe une offre d'adhésion avantageuse peut être un petit plus — à condition d'en lire les conditions, car elles varient selon les campagnes. Le principe général est expliqué sur la page [Comment ça marche](/comment-ca-marche).",
      "Côté achats du quotidien, le cashback permet de récupérer une partie d'un achat déjà prévu : le fonctionnement est détaillé dans notre [comparatif des plateformes de cashback](/comparatif/cashback) et notre [article dédié](/blog/le-cashback-comment-ca-marche). Le [classement des primes actuellement documentées](/classement-primes-parrainage) et le hub [Cashback](/categories/cashback) donnent une vision d'ensemble, et les bons plans du hub [Shopping & Courses](/categories/shopping-courses) complètent le tableau — toujours sur des achats ou souscriptions que vous comptiez réaliser.",

      { type: "h2", text: "La méthode simple à refaire tous les 3 mois" },
      "L'inventaire initial fait le ménage ; la routine le fait durer. Une fois par trimestre, consacrez dix minutes à la même vérification : les nouveaux prélèvements apparus, les services dont l'usage a changé, les échéances qui approchent. C'est aussi le bon moment pour noter les prochaines dates limites de résiliation dans l'agenda, afin de ne jamais rater une fenêtre.",
      "Cette régularité évite l'essentiel du travail : un abonnement surveillé tous les trois mois ne s'accumule jamais longtemps. Le rituel est volontairement court — dix minutes suffisent lorsque l'inventaire de départ a été fait une fois proprement.",

      {
        type: "callout",
        title: "À faire maintenant",
        text: "Prenez dix minutes et regardez les prélèvements récurrents des 30 derniers jours :",
        items: [
          "Listez ceux qui correspondent à un abonnement (vidéo, salle, logiciel, opérateur, service en ligne).",
          "Notez pour chacun : le prix actuel, la dernière utilisation, la prochaine échéance.",
          "Repérez les deux ou trois abonnements qui ne servent plus : ce sont vos premières économies.",
        ],
      },

      {
        type: "checklist",
        items: [
          "Je connais tous mes abonnements",
          "Je connais leur prix actuel",
          "Je connais leur prochaine échéance",
          "Je sais comment les résilier",
          "Je les utilise réellement",
          "J'ai comparé les alternatives",
        ],
      },

      { type: "h2", text: "Les erreurs à éviter" },
      {
        type: "list",
        ordered: false,
        items: [
          "Garder un abonnement « par habitude » sans vérifier son usage depuis des mois.",
          "Laisser une période d'essai se transformer en abonnement payant faute d'avoir noté la date de fin.",
          "Rater la date limite de résiliation d'un contrat à tacite reconduction et payer une année entière de plus.",
          "Payer deux services qui font la même chose (deux plateformes de vidéo, deux stockages en ligne) sans choisir.",
          "Souscrire uniquement pour une offre de bienvenue, une prime de parrainage ou un cashback, sans besoin réel.",
          "Ne jamais comparer sa formule actuelle aux offres du moment, même quand l'usage a changé.",
        ],
      },

      { type: "h2", text: "Ce qu'il faut retenir" },
      "Un abonnement se gère comme un contrat, pas comme une habitude : il a une échéance, un préavis et des conditions. Faire l'inventaire depuis ses relevés, trier selon l'usage réel, résilier simplement ce qui ne sert plus et comparer avant de conserver suffisent à reprendre la main — sans promesse d'un montant d'économie universel, car tout dépend de chaque situation.",
      "La bonne nouvelle est que cette démarche se fait une fois, puis s'entretient en dix minutes par trimestre. Pour explorer les offres de parrainage et les bons plans actuellement documentés sur les services que vous décidez de garder, parcourez [la liste des offres](/offres) et ses hubs par univers.",
    ],
  },
  {
    slug: "comment-reduire-facture-telephone-internet",
    title: "Comment réduire sa facture de téléphone et internet ?",
    titleSuffix: "Guides & astuces Parrainio",
    h1: "Comment réduire sa facture de téléphone et internet ?",
    excerpt:
      "Forfait mobile, box internet, options payantes : la méthode pour payer le juste prix de son télécom, sans engagement oublié ni option inutile.",
    datePublished: "2026-09-05",
    category: "Guides",
    body: [
      "La facture télécom du foyer cumule généralement un forfait mobile, une box internet et plusieurs options ou services ajoutés — autant de postes qui évoluent avec les offres du marché sans que le contrat suive. Réduire cette facture ne consiste pas à prendre systématiquement le forfait le moins cher, mais à vérifier que l'on paie le juste prix de son usage réel : ni trop, pour des services inutiles, ni trop peu, pour une offre qui ne conviendrait plus. C'est la méthode de cet article, complémentaire de notre [guide général pour économiser au quotidien](/blog/comment-economiser-au-quotidien) et de notre [guide des abonnements](/blog/comment-economiser-sur-ses-abonnements).",

      { type: "image", src: "/images/blog/telephone-internet-hero.svg", alt: "Illustration : smartphone, box internet et facture avec prélèvements, reliés par une flèche d'optimisation vers des barres en baisse.", caption: "Téléphone et internet : les postes d'une facture que l'on peut optimiser." },

      { type: "h2", text: "Commencer par savoir ce que l'on paie" },
      "La première étape est un simple relevé : additionnez le forfait mobile, la box internet et chaque option facturée — assurance mobile, stockage, chaînes de télévision, services de sécurité. Beaucoup de factures cumulent des lignes dont on ne connaît plus ni le prix exact ni la raison d'être. Le relevé se fait en quelques minutes depuis l'espace client, et il est indispensable avant toute décision.",
      "Notez aussi ce qui n'apparaît pas toujours sur la facture : la date de fin d'une promotion, la date de fin d'engagement, ou les services inclus « gratuitement » pendant quelques mois puis facturés ensuite. Ce sont ces informations qui font basculer une facture sans que le client s'en aperçoive.",

      { type: "h2", text: "Votre forfait mobile correspond-il encore à vos besoins ?" },
      "Un forfait mobile se choisit selon un usage réel : volume de data consommé, appels, SMS, éventuels usages à l'étranger. L'espace client de votre opérateur indique généralement votre consommation — c'est elle qui doit guider le choix, pas la taille affichée de l'offre. Un forfait « illimité » largement sous-utilisé est un poste d'économie évident ; un petit forfait constamment saturé est une fausse économie qui finit en surcoûts.",
      "La comparaison de l'offre actuelle aux offres du moment suppose de regarder le même périmètre : data incluse, réseau, services annexes.",

      { type: "image", src: "/images/blog/telephone-internet-comparer.svg", alt: "Illustration : un smartphone avec jauge de données, une loupe au-dessus de deux cartes d'offres et une coche de décision, reliés par des chevrons.", caption: "Besoins, offre actuelle, alternatives : comparer le même périmètre avant de décider." },
      "Cette comparaison n'a de sens que si elle porte sur votre situation : la data réellement consommée, la couverture du réseau dans les lieux que vous fréquentez, et les services dont vous avez effectivement besoin. C'est ce triptyque qui transforme une simple différence de prix en vraie économie.",

      { type: "h2", text: "Vérifier les options et services inclus" },
      "Les options payantes sont le poste le plus silencieux de la facture : assurance du mobile, stockage en ligne, services de protection, chaînes ou contenus additionnels. Chacune se justifie individuellement — elles ont souvent été ajoutées lors d'une souscription ou d'un démarchage, puis jamais retirées. Faites le tour ligne par ligne et gardez uniquement celles qui correspondent à un usage vérifié.",
      "C'est aussi l'occasion de repérer les services inclus que vous payez déjà sans les utiliser, et les doublons : un stockage proposé par l'opérateur alors qu'un autre abonnement en inclut déjà un. Les offres du hub [Services numériques](/categories/services-numeriques) donnent un aperçu des univers concernés, mais la décision reste fondée sur votre usage.",

      { type: "image", src: "/images/blog/telephone-internet-options.svg", alt: "Illustration : un smartphone affichant des modules d'options — assurance, streaming, stockage — dont l'un est barré et supprimé, surveillé par une loupe.", caption: "Options et services inclus : vérifier chacun, supprimer ceux qui ne servent pas." },
      { type: "h2", text: "Regarder le vrai prix de sa box internet" },
      "La box internet se compare sur le débit réellement disponible, les usages du foyer (télétravail, streaming, jeux) et la durée de l'offre. Attention au prix « pendant x mois » qui augmente ensuite : le vrai coût est celui de la période hors promotion, car c'est lui qui s'appliquera durablement. Une box plus chère en promotion mais stable peut revenir moins cher qu'une offre agressive la première année puis plus élevée ensuite.",
      "Vérifiez aussi les frais annexes liés à la box : location du matériel, répéteur Wi-Fi, options de sécurité, décodeur. Certains sont inclus dans le prix affiché, d'autres s'ajoutent — la comparaison doit les intégrer tous. Les offres actuelles des opérateurs sont rassemblées sur le hub [Téléphone & Internet](/categories/telephone-internet), avec leurs fiches complètes.",

      { type: "h2", text: "Attention aux promotions qui arrivent à leur terme" },
      "De nombreuses offres télécom affichent un tarif réduit pendant douze mois, parfois moins, avant de basculer sur un prix plus élevé. Ce n'est pas une anomalie : c'est la structure même de l'offre, et elle doit figurer au moment de la souscription. Le bon réflexe est de noter la date de fin de chaque promotion dès la souscription, et de la rapprocher de la date de fin d'engagement pour anticiper.",
      "À la fin d'une promotion, deux options s'offrent : négocier avec votre opérateur ou comparer les offres du moment. Aucune règle générale ne garantit un geste commercial — la situation dépend de l'opérateur, de votre ancienneté et des offres en cours. Ce qui est certain, c'est que sans rendez-vous régulier avec sa facture, la hausse passe inaperçue.",

      { type: "h2", text: "Vérifier son engagement avant de changer" },
      "Avant de résilier ou de changer d'opérateur, regardez la durée d'engagement de votre contrat — elle figure sur la facture et dans l'espace client. Sans engagement, ou lorsque la durée d'engagement est terminée, la résiliation est possible à tout moment, sans justification et sans frais liés à l'engagement. Pendant l'engagement en revanche, des frais peuvent s'appliquer : pour un engagement de 12 mois, les mensualités restant dues ; pour 24 mois, la totalité des mensualités restant dues jusqu'à la fin des 12 premiers mois, puis 25 % des mensualités au-delà, comme l'explique la page [Service Public consacrée à la résiliation des contrats télécom](https://www.service-public.gouv.fr/particuliers/vosdroits/F22486).",
      "Certaines situations permettent de résilier sans frais même en cours d'engagement : un motif légitime (licenciement, hospitalisation de longue durée, déménagement dans une zone non couverte, handicap), une modification unilatérale du contrat par l'opérateur — vous disposez alors de 4 mois — ou des dysfonctionnements persistants du service, avec remboursement de la période non rendue. Dans tous les cas, conservez une trace écrite de vos démarches.",

      { type: "h2", text: "Comparer avant de résilier" },
      "La résiliation n'est qu'une étape : elle n'a de sens que si une offre plus adaptée lui succède. Comparez donc avant de résilier, en intégrant le prix hors promotion, la couverture et la qualité du réseau là où vous vivez et travaillez, les services inclus et les éventuels frais de dossier. Si vous quittez votre opérateur en cours d'engagement, ajoutez les frais de résiliation au calcul : une offre moins chère peut ne pas compenser ces frais.",
      "La résiliation télécom est encadrée : lorsqu'elle peut se faire en ligne, l'opérateur doit proposer un parcours simple et vous confirmer la résiliation sur un support durable, avec une prise d'effet dans un délai maximal de dix jours. Si du matériel a été fourni (box, décodeur, répéteur), il doit être restitué selon les modalités du contrat — la non-restitution peut entraîner des frais.",

      { type: "h2", text: "Changer d'opérateur : les points à vérifier" },
      "Pour conserver votre numéro de mobile en changeant d'opérateur, la portabilité s'effectue par le nouvel opérateur : vous n'avez pas à résilier vous-même votre ancien contrat, la demande de portabilité vaut résiliation. Il faut au préalable obtenir votre relevé d'identité opérateur (RIO), un identifiant gratuit fourni par le serveur vocal du 3179. Le portage s'effectue en principe en quelques jours ouvrables, avec une coupure limitée à quelques heures — et une indemnisation est prévue en cas de retard ou de perte du numéro, comme le détaille la page [Service Public consacrée à la portabilité](https://www.service-public.gouv.fr/particuliers/vosdroits/F22479).",
      "Deux points complètent le tableau : le désimlockage du téléphone, gratuit dans les conditions prévues par la réglementation (en général après quelques mois de contrat), et la restitution du matériel de l'ancien opérateur. En cas de litige, le parcours est balisé : réclamation écrite à l'opérateur, puis saisie gratuite du médiateur des communications électroniques, comme le rappelle la [fiche de l'Arcep sur la conservation de son numéro](https://www.arcep.fr/mes-demarches-et-services/consommateurs/fiches-pratiques/comment-conserver-mon-numero-fixe-ou-mobile-lors-dun-changement-doperateur.html).",

      { type: "h2", text: "Ne pas choisir uniquement sur le prix" },
      "Une offre moins chère n'est une économie que si elle correspond à votre usage et à votre zone de vie : un réseau mal couvert chez vous, une data insuffisante ou un service client difficile annulent vite l'écart de prix. Choisir « le moins cher » sans vérifier la couverture et les services inclus est l'une des fausses économies les plus fréquentes en télécom.",
      "À l'inverse, si vous changez d'opérateur ou achetez un mobile, les avantages ponctuels peuvent s'ajouter à un choix déjà fondé sur l'usage : une offre de parrainage de l'opérateur (dont le fonctionnement général est expliqué sur [Comment ça marche](/comment-ca-marche)) peut accompagner un changement décidé pour de bonnes raisons — jamais le déclencher. Et pour un achat déjà prévu, les [bons plans du hub Shopping & Courses](/categories/shopping-courses) et le [comparatif des plateformes de cashback](/comparatif/cashback) peuvent s'appliquer. Le principe reste le même partout : vérifier les conditions avant de s'inscrire, et ne pas changer pour une prime seule.",

      { type: "h2", text: "Une méthode simple pour refaire le point régulièrement" },
      "La facture télécom mérite un rendez-vous régulier, par exemple une fois par an, quand les promotions et les engagements arrivent à échéance : vérifier les prix actuels, la fin des promotions, la data réellement consommée et les options payantes. C'est aussi le moment de comparer les offres du marché sur le même périmètre. Ce rituel annuel suffit : l'essentiel est d'agir au bon moment, pas en permanence.",
      "Avant de conclure, voici la check-list complète à garder sous la main lors de chaque passage en revue de votre télécom :",

      {
        type: "callout",
        title: "Check-up télécom",
        text: "Les points à vérifier pour chaque contrat (mobile et internet) :",
        items: [
          "Noter le prix mensuel actuel, hors promotion.",
          "Repérer la date de fin de chaque promotion en cours.",
          "Noter la date de fin d'engagement (mobile et box).",
          "Comparer la data réellement consommée à celle de l'offre.",
          "Lister les options payantes et les services inclus non utilisés.",
          "Vérifier les frais éventuels (résiliation, restitution du matériel).",
          "Questionner le besoin d'une box ou d'un forfait plus cher.",
        ],
      },

      {
        type: "checklist",
        items: [
          "Je connais le prix mensuel actuel de chaque contrat",
          "Je connais la date de fin de chaque promotion",
          "Je connais ma date de fin d'engagement",
          "Je connais la data que j'utilise réellement",
          "J'ai repéré les options payantes inutiles",
          "Je connais les services inclus dans mon offre",
          "J'ai vérifié les frais éventuels en cas de résiliation",
          "Je sais si j'ai besoin d'une box ou d'un forfait plus cher",
        ],
      },

      { type: "h2", text: "Les erreurs qui peuvent coûter plus cher" },
      {
        type: "list",
        ordered: false,
        items: [
          "Choisir le forfait le moins cher sans vérifier la couverture réseau ni la data réellement utilisée.",
          "Laisser une promotion expirer sans noter la date de fin, puis payer le prix plein des mois durant.",
          "Résilier en cours d'engagement sans intégrer les frais de résiliation à la comparaison.",
          "Résilier soi-même son ancien contrat au lieu de passer par la portabilité, au risque de perdre son numéro.",
          "Oublier de restituer la box, le décodeur ou le répéteur, et se voir facturer du matériel non rendu.",
          "Cumuler des options payantes (assurance, stockage, chaînes) jamais réactivées ni vérifiées.",
          "Changer d'opérateur uniquement pour une prime de parrainage ou une offre de bienvenue, sans comparer l'offre réelle.",
        ],
      },

      "Réduire sa facture de téléphone et internet n'exige pas de devenir un expert des offres : cela exige de connaître son contrat, son usage et les échéances. Avec une vérification annuelle — prix hors promotion, fin d'engagement, options payantes — la plupart des foyers peuvent aligner leur télécom sur leur besoin réel. Pour explorer les offres de parrainage actuellement documentées sur les opérateurs et services que vous décidez de garder ou de rejoindre, parcourez [la liste des offres](/offres) et le hub [Téléphone & Internet](/categories/telephone-internet).",
    ],
  },
  {
    slug: "comment-utiliser-cashback-intelligemment",
    title: "Comment utiliser le cashback intelligemment pour économiser ?",
    titleSuffix: "Guides & astuces Parrainio",
    h1: "Comment utiliser le cashback intelligemment ?",
    excerpt:
      "Le cashback n'est pas une raison d'acheter : la méthode pour l'utiliser comme outil d'optimisation, sans se laisser piéger par les fausses économies.",
    datePublished: "2026-09-05",
    category: "Guides",
    body: [
      "Le cashback permet de récupérer une partie du montant d'un achat chez un marchand partenaire — le mécanisme de base est expliqué en détail dans notre article [le cashback, comment ça marche](/blog/le-cashback-comment-ca-marche). Cette fois, la question est différente : comment utiliser le cashback intelligemment, sans qu'il devienne une raison supplémentaire de consommer ? La réponse tient en une phrase : le cashback est un outil d'optimisation, pas une invitation à acheter. Il n'a de valeur que lorsque l'achat était prévu ou réellement utile. Ce guide fait partie de notre [méthode pour économiser au quotidien](/blog/comment-economiser-au-quotidien), dont il approfondit le volet achats.",

      { type: "image", src: "/images/blog/cashback-intelligent-hero.svg", alt: "Illustration d'un parcours d'achat : panier, comparaison, pièce de cashback qui revient vers une tirelire et coche finale.", caption: "Achat prévu, comparaison, cashback, économie : l'ordre qui a du sens." },

      { type: "h2", text: "Le cashback est-il toujours une bonne affaire ?" },
      "Non. Un cashback élevé sur un achat inutile reste une dépense : vous récupérez une partie d'un montant que vous n'auriez pas dû dépenser. Le cashback n'est une bonne affaire que lorsqu'il réduit le coût d'un achat que vous comptiez de toute façon effectuer, chez un marchand et à un prix qui vous conviennent.",
      "C'est cette distinction qui sépare l'utilisation intelligente de la fausse économie : le cashback vient après la décision d'achat, il ne la déclenche pas. La bonne question n'est pas « quel cashback vais-je obtenir ? » mais « cet achat est-il nécessaire et le prix est-il bon ? ».",

      { type: "h2", text: "Commencer par l'achat, pas par le cashback" },
      "La méthode se déroule dans un ordre précis : identifier un besoin réel, choisir le produit et le marchand, vérifier le prix — et seulement ensuite voir si un cashback s'applique. Inverser cet ordre revient à laisser une récompense future orienter une décision d'achat, ce qui conduit presque toujours à consommer davantage.",
      "Cette préparation simple évite aussi les achats impulsifs : un produit repéré, comparé et choisi à l'avance se transforme naturellement en achat « avec cashback », alors qu'un produit découvert au détour d'une publicité « avec cashback » reste un achat impulsif déguisé.",

      { type: "h2", text: "Comparer le prix avant de regarder le cashback" },
      "Le cashback se calcule sur le prix payé : il n'a donc de sens que si ce prix est déjà bon. Comparez d'abord le prix total — produit, livraison, frais éventuels — entre marchands, puis déduisez le cashback pour obtenir le coût réel. Un pourcentage affiché élevé sur un prix gonflé ou sur des frais de port élevés peut finir moins intéressant qu'une offre sans cashback au prix plus bas.",
      "Deux garde-fous réglementaires protègent cette comparaison : en cas de réduction de prix, le professionnel doit afficher le prix le plus bas pratiqué au cours des 30 jours précédents — une règle européenne qui limite les « faux rabais » — et les pratiques commerciales trompeuses, comme faire croire à une réduction qui n'existe pas, sont interdites par le code de la consommation, comme le rappelle le [dossier d'economie.gouv.fr sur l'affichage des prix](https://www.economie.gouv.fr/particuliers/mes-droits-conso/bien-consommer/affichage-des-prix-ce-que-vous-devez-savoir). En cas de litige, la plateforme [SignalConso](https://www.economie.gouv.fr/particuliers/mes-droits-conso/bien-consommer/affichage-des-prix-ce-que-vous-devez-savoir) permet de le signaler gratuitement.",

      { type: "image", src: "/images/blog/cashback-comparer.svg", alt: "Illustration de deux cartes d'offres comparées à la loupe : jauge de cashback, barres de conditions, coche sur l'offre réellement intéressante.", caption: "Ne pas comparer seulement le pourcentage affiché : prix total, conditions et exclusions comptent." },
      "Le pourcentage affiché n'est qu'une information parmi d'autres : le prix de référence, les conditions de validation, les exclusions et le plafond éventuel de la récompense font le vrai coût. Une offre au cashback plus élevé mais aux conditions restrictives peut rapporter moins qu'une offre modeste mais simple à valider.",

      { type: "h2", text: "Cashback, promotion et code promo : quelle différence ?" },
      "Trois mécanismes distincts se superposent souvent sur la même page marchande : la promotion est une baisse du prix affiché, le code promo applique une réduction au moment du paiement, et le cashback crédite ensuite un montant sur votre compte plateforme après validation de l'achat. Les trois peuvent se combiner ou non, selon les règles du marchand et de la plateforme.",
      "Cette distinction change le calcul : une réduction immédiate est certaine et visible tout de suite, alors qu'un cashback est différé et conditionnel. Comprendre ce qui est « certain maintenant » et ce qui est « crédité plus tard sous conditions » évite de comparer des valeurs qui ne sont pas comparables.",
      { type: "h2", text: "Vérifier les conditions avant de cliquer" },
      "Avant de finaliser un achat avec cashback, lisez les conditions de l'offre : il faut généralement passer par le lien ou le parcours de la plateforme, avec un navigateur et des cookies fonctionnels, pour que l'achat soit rattaché au bon compte. Les conditions de validation varient d'une plateforme et d'un marchand à l'autre — aucune règle n'est universelle, et ce qui vaut pour l'une ne vaut pas pour les autres.",
      "Deux informations sont essentielles : ce qu'il faut faire exactement pour que l'achat soit pris en compte (passer par la plateforme, dans un délai, sans modifier le panier), et ce qui se passe si le parcours n'est pas respecté — généralement, aucun cashback. Si les conditions ne sont pas claires, elles ne sont pas un obstacle à l'achat, mais elles doivent être considérées comme un cashback incertain.",

      { type: "h2", text: "Les exclusions à surveiller" },
      "Tous les achats ne génèrent pas du cashback : certains marchands, certaines catégories de produits ou certains moyens de paiement peuvent être exclus, et les cartes cadeaux sont souvent concernées. Les exclusions sont propres à chaque programme et à chaque marchand, et elles peuvent évoluer — c'est pourquoi la fiche de l'offre ou les conditions de la plateforme doivent être vérifiées au moment de l'achat, pas « en principe ».",
      "Un achat exclu n'est pas une perte en soi — la dépense était prévue — mais il ne faut jamais baser sa décision sur un cashback que l'on n'a pas vérifié. Si le produit correspond à votre besoin et que le prix est bon, l'achat se fait avec ou sans cashback ; le cashback est un supplément, pas une condition de l'achat.",

      { type: "h2", text: "Peut-on cumuler cashback et code promo ?" },
      "Cela dépend : certains marchands autorisent la combinaison d'un code promo et du cashback, d'autres non, et certaines plateformes excluent le cashback lorsque le panier contient un code de réduction. Aucune règle générale n'existe, ni chez les marchands ni entre plateformes — la compatibilité se vérifie au cas par cas, avant de passer commande.",
      "Lorsque le cumul est refusé, il faut choisir : une réduction immédiate certaine ou un cashback différé et conditionnel. Ce choix dépend du montant réel de chacun — mais là encore, si l'achat était prévu, l'une ou l'autre option reste une économie, pas une dépense supplémentaire.",

      { type: "h2", text: "Pourquoi le cashback n'est pas toujours immédiat" },
      "Le crédit de cashback n'apparaît pas toujours au moment de l'achat : l'opération doit souvent être suivie par la plateforme, puis validée par le marchand, selon des délais qui varient d'une plateforme et d'un marchand à l'autre. Pendant cette période, le montant est « en attente » : il n'est définitivement acquis qu'après validation, et un crédit affiché n'est jamais une garantie de versement.",
      "Deux précisions utiles : les conditions de retrait de la cagnotte (seuil, mode de paiement) relèvent de chaque plateforme, et pour un achat en ligne, le droit de rétractation de 14 jours reste applicable (sauf exceptions prévues par la loi) avec remboursement sous 14 jours — un filet de sécurité indépendant du cashback, comme l'explique le [dossier d'economie.gouv.fr sur la vente à distance](https://www.economie.gouv.fr/particuliers/mes-droits-conso/bien-consommer/vente-distance-tout-savoir-sur-votre-droit-de-retractation).",

      { type: "h2", text: "Comment éviter les fausses économies" },
      "La fausse économie la plus fréquente consiste à acheter « parce qu'il y a du cashback » : un objet non prévu, choisi parmi ce qui rapporte, reste une dépense. La règle est simple à retenir :",

      { type: "image", src: "/images/blog/cashback-fausse-economie.svg", alt: "Illustration comparant un achat prévu avec une pièce de cashback qui revient vers une tirelire, et un achat impulsif avec un triangle d'alerte et une pièce barrée.", caption: "Achat prévu : le cashback complète l'économie. Achat impulsif : il la justifie — à tort." },
      "Le piège fonctionne en trois temps : un pourcentage accrocheur, l'impression d'un gain certain, et l'oubli que la dépense n'était pas prévue. Pour le neutraliser, fixez-vous une règle : ne jamais ouvrir une plateforme de cashback pour « voir ce qui rapporte », mais l'ouvrir uniquement une fois l'achat décidé, pour vérifier si un cashback s'y applique.",

      { type: "h2", text: "Sur quels achats utiliser le cashback ?" },
      "Le cashback donne le meilleur de lui-même sur les achats réguliers ou programmés : les courses en ligne, certaines réservations, les achats de la rentrée, ou encore des renouvellements liés à vos [abonnements](/blog/comment-economiser-sur-ses-abonnements). Ce sont des dépenses qui se reproduisent et sur lesquelles un crédit, même modeste, finit par compter — sans jamais ajouter un achat au panier.",
      "Pour les achats ponctuels, la même logique s'applique : un produit longuement comparé, au prix vérifié, mérite qu'on regarde si un cashback s'y applique. Les [bons plans du hub Shopping & Courses](/categories/shopping-courses) peuvent compléter la démarche, toujours sur des achats prévus.",

      { type: "h2", text: "Comment choisir une plateforme de cashback ?" },
      "Aucune plateforme n'est « la meilleure » en toutes circonstances : leur intérêt dépend des marchands disponibles, de la simplicité de validation, des modalités de retrait et des conditions de chaque offre. Les critères à comparer sont concrets : le catalogue de marchands, la clarté des conditions, les seuils et délais de retrait, et la fiabilité du service. Notre [comparatif des plateformes de cashback](/comparatif/cashback) rassemble les plateformes actuellement documentées — [iGraal](/offres/igraal), [Poulpeo](/offres/poulpeo), [eBuyClub](/offres/ebuyclub), [Widilo](/offres/widilo) et [TopCashback](/offres/topcashback) — avec leurs fiches complètes et le hub [Cashback](/categories/cashback).",
      "Pour aller plus loin sur les avantages d'inscription : certaines plateformes proposent un bonus de parrainage ou de bienvenue — le fonctionnement est expliqué sur [Comment ça marche](/comment-ca-marche), et le [classement des primes actuellement documentées](/classement-primes-parrainage) donne une vision d'ensemble. Le principe reste le même : une offre de bienvenue n'a d'intérêt que si la plateforme correspond à votre usage réel.",

      { type: "h2", text: "La méthode simple avant chaque achat" },
      "En résumé, l'ordre à respecter tient en quatre questions, avant de cliquer : cet achat était-il prévu ? Le prix est-il bon, comparé hors cashback ? Les conditions de validation sont-elles claires et respectées ? Le cashback est-il un supplément à une bonne décision, et non la raison de la décision ? Si les quatre réponses sont positives, l'achat avec cashback est une vraie économie.",

      {
        type: "checklist",
        items: [
          "L'achat était prévu",
          "Le prix est intéressant",
          "Le marchand correspond à mon besoin",
          "Les conditions du cashback sont claires",
          "Les exclusions ont été vérifiées",
          "Les éventuels codes promo sont compatibles",
          "Je connais les conditions de validation",
        ],
      },

      {
        type: "callout",
        title: "La règle simple",
        text: "N'achetez jamais quelque chose uniquement parce qu'il génère du cashback. Si l'achat était déjà décidé, le cashback est une économie de plus. Sinon, ce n'est pas une économie : c'est une dépense avec un geste commercial.",
      },

      "Utilisé intelligemment, le cashback est un complément d'optimisation parmi d'autres — comme le parrainage ou les bons plans — au service d'achats déjà réfléchis. Pour comparer les plateformes actuellement documentées et leurs conditions, consultez le [comparatif cashback](/comparatif/cashback) ou parcourez [la liste des offres](/offres).",
    ],
  },
];

export function getBlogArticle(slug: string): BlogArticle | undefined {
  return blogArticles.find((article) => article.slug === slug);
}

export function formatBlogDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
