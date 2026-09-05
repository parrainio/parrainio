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
 * format [ancre](/chemin) — même convention que les hubs de catégories.
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
