import type { OfferSeoProfile } from "./offer-seo";

const researchedAt = "2026-10-17";
const make = (p: Omit<OfferSeoProfile, "researchedAt">): OfferSeoProfile => ({ ...p, researchedAt });
const source = (title: string, url: string, type: "official" | "secondary" = "official") => ({
  title,
  url,
  type,
  checkedAt: researchedAt,
});

export const lot16Profiles: Record<string, OfferSeoProfile> = {
  xtb: make({
    status: "partial",
    seoTitle: "Parrainage XTB : reverse Parrainio de 8 € et conditions | Parrainio",
    metaDescription:
      "XTB : demandez un lien de parrainage personnel, ouvrez un compte actions/ETF/CFD et percevez un reverse Parrainio de 8 € après validation. Conditions et risques.",
    h1: "XTB : parrainage partenaire, reverse de 8 € et conditions",
    introduction:
      "XTB est un courtier en ligne international qui permet d'investir en actions, ETF, CFD et matières premières via la plateforme xStation 5. L'offre Parrainio s'appuie sur le programme partenaire de XTB, dont les modalités détaillées ne sont pas publiques : Parrainio les suit lui-même et reverse 8 € au filleul après validation du parrainage par le programme. Le compte XTB fonctionne comme chez tout courtier : une inscription avec vérification d'identité, un dépôt (aucun minimum d'ouverture n'est affiché dans les informations vérifiées) puis des transactions selon votre stratégie. Investir comporte un risque de perte en capital ; les CFD, à effet de levier limité à 1:30 pour les particuliers, peuvent entraîner la perte du capital investi.",
    summary: [
      "Filleul : 8 € de reverse Parrainio après validation du parrainage.",
      "Lien : personnel et unique, à demander via le formulaire de la fiche.",
      "Compte : inscription, vérification d'identité et dépôt chez XTB.",
      "Programme : conditions partenaires suivies par Parrainio, non publiques.",
      "Plateforme : xStation 5 (MT4/MT5 non proposés pour les nouveaux comptes).",
      "Risque : perte en capital ; CFD à levier maximum 1:30 pour les particuliers.",
    ],
    whyChoose: {
      heading: "Pourquoi choisir XTB ?",
      paragraphs: [
        "XTB propose un compte Standard avec spreads à partir de 0,5 pip et sans commission à l'ouverture des positions, des retraits gratuits vers un compte bancaire au nom du client, et une plateforme propriétaire xStation 5. Le courtier annonce une réglementation par la KNF (autorité polonaise) et une supervision en France par l'AMF.",
        "L'intérêt du parrainage Parrainio est un reverse de 8 € au filleul, mais il ne remplace pas l'évaluation du service : frais réels par instrument, disponibilité des marchés, adéquation entre votre profil de risque et les produits (actions, ETF, CFD) et nécessité de vérifier les conditions de la campagne active au moment de l'inscription.",
      ],
    },
    audience:
      "Cette offre s'adresse à un particulier majeur qui a déjà l'intention d'ouvrir un compte d'investissement chez XTB et comprend que les marchés financiers comportent un risque de perte. Elle ne convient pas à quelqu'un qui chercherait un gain garanti : le reverse Parrainio n'est dû qu'après validation complète du parrainage, et les performances des investissements ne sont jamais garanties.",
    alertBox: {
      title: "⚠️ Avertissement — investir comporte un risque de perte en capital",
      paragraphs: [
        "Les actions, les ETF et surtout les CFD peuvent perdre de la valeur : vous pouvez perdre tout ou partie du capital investi, et les CFD (effet de levier, maximum 1:30 pour les particuliers) peuvent amplifier les pertes. Aucun rendement ou avantage parrainage n'est garanti : le reverse Parrainio dépend de la validation du parrainage par le programme partenaire.",
        "Pour toute cette fiche Parrainio, les montants indiqués concernent le reverse Parrainio et non une performance d'investissement : ils ne mesurent ni ne garantissent le résultat de vos opérations de marché.",
      ],
    },
    referralExplanation:
      "Aucun lien de parrainage XTB n'est publié en accès public : le lien est individuel et unique. Vous le demandez via le formulaire de cette fiche, Parrainio vous l'envoie, puis vous créez votre compte XTB avec ce lien. Vous compléttez ensuite la vérification d'identité et le dépôt exigés par XTB. Une fois le parrainage validé par le programme partenaire, Parrainio vous verse 8 €. Les conditions du programme partenaire utilisé ne sont pas publiques : elles sont suivies par Parrainio et peuvent être mises à jour sur cette fiche.",
    conditions: [
      "Demander le lien de parrainage personnel et unique à Parrainio via le formulaire de la fiche.",
      "Créer le compte XTB via ce lien ; une inscription faite sans ce lien ne peut pas être rattachée après coup.",
      "Effectuer le dépôt et la vérification de compte demandés par XTB.",
      "Attendre la validation du parrainage par le programme partenaire avant tout versement du reverse.",
      "Conserver le compte conforme aux conditions XTB (identité vérifiée, compte actif).",
    ],
    earnings:
      "Filleul : 8 € de reverse Parrainio, payable après validation du parrainage par le programme partenaire. Parrain : la rémunération partenaire de Parrainio n'est pas publiée (programme partenaire non public). Parrainio : le reversement de 8 € est distinct des conditions de compte XTB.",
    rewardTiming:
      "Aucun délai universel ne peut être promis : le reverse intervient après que le programme partenaire a validé le parrainage du filleul, ce qui dépend de l'inscription, du dépôt et de la vérification du compte chez XTB.",
    practicalInformation: [
      "Le lien personnel ne doit jamais être partagé plus largement : il est valable pour un seul inscrit à la fois.",
      "Aucun minimum de dépôt n'est affiché dans les informations vérifiées ; des minimums par position de trading peuvent s'appliquer et sont visibles dans la plateforme.",
      "Les retraits XTB sont annoncés gratuits vers un compte au nom du client ; votre banque peut ajouter ses propres frais.",
      "MT4 et MT5 ne sont pas proposés aux nouveaux comptes selon le centre d'aide XTB ; la plateforme est xStation 5.",
    ],
    internalLinks: [
      { label: "Découvrir Bitstack (Bitcoin)", slug: "bitstack" },
      { label: "Comparer Coinbase", slug: "coinbase" },
      { label: "Voir Bricks (immobilier participatif)", slug: "bricks" },
    ],
    faq: [
      {
        question: "Combien rapporte le parrainage XTB via Parrainio ?",
        answer:
          "Le filleul reçoit 8 € de reverse Parrainio après validation du parrainage par le programme partenaire de XTB. Ce reverse est la contrepartie du parcours d'inscription : il n'est pas conditionné à la performance de vos investissements.",
      },
      {
        question: "Comment obtenir le lien de parrainage XTB ?",
        answer:
          "Utilisez le formulaire de la fiche : vous envoyez votre demande, Parrainio vous répond par e-mail avec un lien personnel et unique. Aucun lien public n'est disponible, et les liens sont attribués à un inscrit à la fois.",
      },
      {
        question: "Investir chez XTB est-il sans risque ?",
        answer:
          "Non. Les actifs financiers peuvent perdre de la valeur et vous pouvez perdre tout ou partie de votre capital. Les CFD sont des produits à effet de levier (limité à 1:30 pour les particuliers) qui peuvent amplifier la perte. La fiche Parrainio ne prend aucun engagement sur la performance des investissements.",
      },
      {
        question: "Que faut-il faire chez XTB pour valider le parrainage ?",
        answer:
          "Ouvrir le compte via le lien personnel fourni, vérifier son identité et effectuer le dépôt demandé. Le parrainage est ensuite validé par le programme partenaire de XTB, dont les critères précis ne sont pas publics.",
      },
      {
        question: "Puis-je cumuler le reverse Parrainio avec un bonus XTB ?",
        answer:
          "Les promotions XTB (par exemple une offre de bienvenue affichée à l'inscription) suivent leurs propres conditions et ne dépendent pas de Parrainio. Le reverse Parrainio est un versement séparé, effectué après validation du parrainage.",
      },
    ],
    sources: [
      source("XTB — programmes de partenariat", "https://www.xtb.com/fr/partenaires"),
      source("XTB — conditions et frais", "https://www.xtb.com/fr/compte-et-frais"),
      source("XTB — informations légales", "https://www.xtb.com/fr/informations-legales"),
    ],
    referralContact: {
      heading: "Me contacter pour obtenir un lien de parrainage personnel et unique",
      note:
        "Le lien XTB est individuel : utilisez le formulaire ci-dessous et je vous l'envoie par e-mail. Mention de stock à mettre à jour ici après chaque attribution : il reste 6 liens de parrainage XTB disponibles aujourd'hui.",
    },
  }),
  kast: make({
    status: "partial",
    seoTitle: "Parrainage KAST : paliers en euros, validation manuelle et reverse Parrainio",
    metaDescription:
      "KAST : carte Standard gratuite, paliers de parrainage jusqu'à environ 373 € (conversions indicatives), reverse Parrainio jusqu'à environ 55 €. Validation manuelle de chaque palier obligatoire.",
    h1: "KAST : paliers du parrainage, validation manuelle et reverse Parrainio",
    introduction:
      "KAST est un service financier qui propose une carte de paiement Standard : sans frais d'abonnement annuel selon les conditions publiées, avec du cashback (1,5 % sur les dépenses admissibles, plafonné à environ 1 778 € de dépenses par mois au taux indicatif utilisé ici) et deux cartes virtuelles incluses. Le parrainage KAST fonctionne par paliers de dépenses : chaque palier franchi peut débloquer une récompense, MAIS CHAQUE PALIER DOIT ÊTRE VALIDÉ MANUELLEMENT DANS L'APPLICATION par le filleul. Les montants de cette fiche sont des conversions indicatives en euros : les seuils officiels du programme sont libellés en dollars dans l'application KAST.",
    summary: [
      "Filleul : jusqu'à environ 373 € de paliers KAST (conversions indicatives).",
      "Paliers (dépenses cumulées admissibles) : ~444 €, ~889 €, ~1 778 €, ~6 221 €.",
      "Récompenses par palier : ~18 €, ~44 €, ~89 €, ~222 € — additionnelles.",
      "Validation manuelle de CHAQUE palier dans l'application, obligatoire.",
      "Reverse Parrainio : jusqu'à environ 55 € (25 % de la commission).",
      "KAST n'est pas une banque régulée : pas d'assurance des dépôts comparable.",
    ],
    whyChoose: {
      heading: "Pourquoi choisir KAST ?",
      paragraphs: [
        "KAST propose une carte de paiement Standard sans abonnement annuel, avec du cashback sur les achats admissibles. Le programme de parrainage distingue KAST des autres offres : un filleul peut cumuler plusieurs récompenses s'il franchit chaque palier de dépenses et valide chaque palier manuellement dans l'application.",
        "KAST n'est pas un établissement bancaire traditionnel : ses pages officielles précisent que le compte n'est pas couvert par une assurance des dépôts comparable à celle des banques régulées. L'éligibilité dépend du pays, de la vérification d'identité (KYC) et des règles d'admissibilité officielles affichées dans l'application ; l'usage d'un VPN pour contourner une indisponibilité pays est explicitement interdit par KAST.",
      ],
    },
    audience:
      "Cette offre s'adresse à une personne qui prévoit d'utiliser la carte KAST pour ses dépenses régulières et peut réaliser l'ensemble du parcours : inscription via le lien personnel, KYC, dépenses admissibles puis validation manuelle de chaque palier. Elle ne convient pas à quelqu'un qui attendrait des récompenses automatiques, ni à un visiteur qui tracerait le parrainage sans lien personnel.",
    alertBox: {
      title: "⚠️ AVERTISSEMENT — validation manuelle obligatoire de chaque palier",
      paragraphs: [
        "LES PALIERS DOIVENT ÊTRE VALIDÉS MANUELLEMENT, UN PAR UN, DANS L'APPLICATION KAST. LES RÉCOMPENSES NE SONT PAS AUTOMATIQUEMENT CUMULÉES SI LES ÉTAPES NE SONT PAS VALIDÉES. Le filleul doit effectuer les dépenses requises, atteindre chaque palier de dépenses admissibles, puis VALIDER CHAQUE PALIER de l'application pour recevoir la récompense correspondante.",
        "Les récompenses de chaque étape sont ADDITIONNELLES et le total potentiel d'environ 373 € suppose que TOUTES les étapes soient franchies et validées. Les montants en euros de cette fiche (seuils comme récompenses) sont des conversions INDICATIVES : les seuils officiels du programme libellés dans l'application sont en dollars et peuvent évoluer. Une conversion n'est jamais un montant en euros contractuellement garanti.",
      ],
    },
    referralExplanation:
      "Aucun lien de parrainage KAST n'est publié en accès public : vous le demandez via le formulaire de cette fiche, Parrainio vous l'envoie par e-mail. Vous l'utilisez à l'inscription, puis vous effectuez la vérification d'identité, vos dépenses admissibles pour franchir les paliers et, à chaque palier atteint, la validation manuelle dans l'application. Parrainio reverse, après conversion en euros, jusqu'à 25 % de sa rémunération de parrainage réellement encaissée : le maximum indicatif d'environ 55 € correspond à 25 % d'une rémunération maximale d'environ 222 € ; il suppose que tous les paliers du filleul aient été franchis et validés sans échéance manquée.",
    conditions: [
      "Demander le lien de parrainage personnel et unique à Parrainio via le formulaire de la fiche (liens attribués un visiteur à la fois).",
      "Créer le compte KAST via ce lien et effectuer la vérification d'identité (KYC) exigée par KAST.",
      "Effectuer les dépenses admissibles : dépenses cumulées de ~444 €, puis ~889 €, ~1 778 € puis ~6 221 € (conversions indicatives au taux utilisé par Parrainio) ; chaque palier franchi ouvre une récompense (~18 €, ~44 €, ~89 €, ~222 €).",
      "VALIDER MANUELLEMENT CHAQUE PALIER DANS L'APPLICATION, un par un : sans cette validation, la récompense correspondante n'est pas débloquée.",
      "Vérifier les seuils affichés dans l'application KAST : les montants officiels sont en dollars et peuvent différer des conversions indicatives de cette fiche.",
      "KAST n'est pas une banque traditionnelle : le compte n'est pas couvert par une assurance des dépôts comparable à celle des banques régulées ; l'usage d'un VPN pour contourner une indisponibilité géographique est interdit par KAST.",
    ],
    earnings:
      "Filleul : jusqu'à environ 373 € de récompenses KAST si toutes les étapes (dépenses admissibles et validations manuelles de chaque palier) sont accomplies. Parrain : les récompenses échelonnées généralisent la rémunération de Parrainio, non publiée (programmation commerciale) et conditionnelle. Parrainio : reverse jusqu'à environ 55 € (25 % de la rémunération réellement encaissée après conversion en euros).",
    rewardTiming:
      "Chaque palier doit être franchi puis validé manuellement dans l'application ; certaines récompenses annoncées par KAST sont bloquées pendant une fenêtre d'attente avant déblocage. Les délais exacts dépendent de l'application KAST et des règles en vigueur.",
    practicalInformation: [
      "Carte Standard : 0 € d'abonnement annuel selon le barème publié ; la carte physique peut entraîner des frais de livraison annoncés par KAST, affichés avant commande.",
      "Cashback Standard : 1,5 % sur les dépenses admissibles, plafonné à environ 1 778 € de dépenses par mois au taux indicatif utilisé par Parrainio.",
      "Change : les dépenses hors devise du compte peuvent entraîner des frais de change annoncés par KAST (barème affiché dans l'application).",
      "Éligibilité : accès selon le pays de résidence, vérification d'identité et barème officiel affiché dans l'application.",
    ],
    internalLinks: [
      { label: "Voir Revolut (application financière)", slug: "revolut" },
      { label: "Comparer N26", slug: "n26" },
      { label: "Découvrir Wise (transferts internationaux)", slug: "wise" },
    ],
    faq: [
      {
        question: "Combien peut-on gagner au total avec le parrainage KAST ?",
        answer:
          "Le maximum indicatif est d'environ 373 € de récompenses KAST pour le filleul, si TOUTES les étapes sont accomplies : franchissement des seuils de dépenses admissibles ET validation manuelle de chaque palier dans l'application. Si un palier n'est pas validé, sa récompense n'est pas débloquée, même si les dépenses ont été atteintes.",
      },
      {
        question: "Les récompenses KAST sont-elles versées automatiquement ?",
        answer:
          "Non. Les paliers doivent être validés manuellement, un par un, dans l'application KAST, après avoir atteint le seuil de dépenses correspondant. C'est le point le plus important de cette offre : aucune récompense n'est acquise sans la validation du palier concerné.",
      },
      {
        question: "Les seuils affichés en euros sont-ils officiels ?",
        answer:
          "Non : ils sont des conversions indicatives calculées au taux utilisé par Parrainio (environ 1 € = 1,1253 $ à la publication). Les seuils officiels du programme KAST sont libellés en dollars dans l'application ; vérifiez les valeurs en vigueur avant de comptez sur une récompense.",
      },
      {
        question: "La carte Standard KAST est-elle vraiment gratuite ?",
        answer:
          "Selon le barème publié par KAST, la carte Standard n'a pas d'abonnement annuel. Des frais peuvent s'appliquer à la carte physique (livraison) ou aux dépenses hors devise du compte : le détail est affiché dans l'application avant commande.\nKAST n'est pas un établissement bancaire traditionnel. Ses pages officielles précisent que le compte n'est pas couvert par une assurance des dépôts comparable à celle des banques régulées.",
      },
      {
        question: "Combien Parrainio reverse-t-il au filleul sur KAST ?",
        answer:
          "Parrainio reverse jusqu'à 25 % de sa rémunération de parrainage réellement encaissée, après conversion en euros. Sur la base d'une rémunération maximale d'environ 222 €, cela correspond à un maximum indicatif d'environ 55 € : ce montant suppose que tous les paliers du filleul aient été franchis et validés.",
      },
    ],
    sources: [
      source("KAST — programme de recommandation (centre d'aide)", "https://concierge.kast.xyz/hc/en-us/articles/15974559777679-How-Does-the-KAST-Referral-Program-Work"),
      source("KAST — frais et conditions des cartes et comptes", "https://concierge.kast.xyz/hc/en-us/articles/9850062738703-What-Are-the-Fees-and-Conditions-for-KAST-Cards-and-Accounts"),
      source("KAST — conditions générales de service", "https://www.kast.xyz/en/legal/terms-and-conditions-of-service"),
    ],
    referralContact: {
      heading: "Me contacter pour obtenir un lien de parrainage personnel et unique",
      note:
        "Le lien KAST est individuel : utilisez le formulaire ci-dessous et je vous l'envoie par e-mail. Le stock restant est mis à jour sur cette fiche après chaque attribution.",
    },
  }),
};
