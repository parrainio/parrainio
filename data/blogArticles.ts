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
 * (« {title} | Blog Parrainio »).
 */
export type BlogBlock =
  | string
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; ordered: boolean; items: string[] };

export type BlogArticle = {
  slug: string;
  title: string;
  /** H1 affiché sur la page ; défaut : `title`. */
  h1?: string;
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
