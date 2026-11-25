import type { OfferSeoProfile } from "./offer-seo";

const researchedAt = "2026-11-22";
const make = (profile: Omit<OfferSeoProfile, "researchedAt">): OfferSeoProfile => ({
  ...profile,
  researchedAt,
});
const source = (
  title: string,
  url: string,
  type: "official" | "secondary" = "official",
) => ({ title, url, type, checkedAt: researchedAt });

export const lot17Profiles: Record<string, OfferSeoProfile> = {
  "octopus-energy": make({
    status: "partial",
    seoTitle: "Parrainage Octopus Energy : lien et bonus de 50 € | Parrainio",
    metaDescription:
      "Utilisez le lien de parrainage Octopus Energy : 40 € crédités à chacun après activation, plus 10 € reversés au filleul par le parrain selon son annonce.",
    h1: "Octopus Energy : lien de parrainage et bonus",
    introduction:
      "Octopus Energy fournit de l'électricité et propose un programme de parrainage lié à la souscription d'un nouveau contrat. Le programme officiel prévoit actuellement 40 € crédités au parrain et 40 € au filleul une fois le contrat activé. L'annonce associée à cette fiche ajoute 10 € que le parrain reverse au filleul : ce complément est personnel et distinct de la cagnotte Octopus. Cette page détaille chaque part pour que vous puissiez vérifier ce qui est officiel et ce qui dépend de l'engagement du parrain.",
    summary: [
      "Lien personnel : la souscription doit commencer depuis ce lien.",
      "Octopus Energy : 40 € sur la cagnotte de chaque personne après activation.",
      "Annonce du parrain : 10 € supplémentaires reversés au filleul.",
      "Éligibilité : nouveaux clients n'ayant pas déjà utilisé le parrainage Octopus.",
      "Catégorie : fournisseur d'énergie.",
    ],
    whyChoose: {
      heading: "Pourquoi choisir Octopus Energy ?",
      paragraphs: [
        "Octopus Energy permet de souscrire une offre d'énergie et de suivre ses contrats et sa cagnotte depuis ses services en ligne. Le changement de fournisseur ne doit toutefois pas être décidé sur la seule prime : comparez les tarifs et les conditions de l'offre correspondant à votre logement.",
        "Le bonus officiel est crédité sur la cagnotte après l'activation du contrat. La somme supplémentaire de 10 € est annoncée par le parrain de cette fiche et ne constitue pas une prime versée par Octopus Energy.",
      ],
    },
    audience:
      "Cette offre s'adresse à une personne qui souhaite réellement souscrire un nouveau contrat Octopus Energy et n'a pas déjà bénéficié d'un parrainage Octopus. Vérifiez l'offre d'énergie, le prix et les modalités de la cagnotte avant de changer de fournisseur.",
    referralExplanation:
      "Ouvrez le lien de parrainage avant de commencer la souscription et terminez le parcours de nouveau client. Après activation du contrat, Octopus Energy crédite 40 € sur la cagnotte du parrain et du filleul. Le parrain de cette annonce indique qu'il reverse 10 € au filleul en complément ; convenez avec lui des modalités et du moment du versement.",
    conditions: [
      "Être un nouveau client Octopus Energy et souscrire un contrat éligible.",
      "Démarrer la souscription depuis le lien de parrainage personnel.",
      "Attendre l'activation effective du contrat pour que les deux cagnottes reçoivent le bonus officiel de 40 €.",
      "Les 10 € supplémentaires sont un reversement annoncé par le parrain, séparé de la récompense Octopus Energy.",
    ],
    earnings:
      "Filleul : 40 € crédités sur la cagnotte Octopus Energy après activation, auxquels le parrain de cette annonce ajoute 10 € selon son engagement. Parrain : 40 € sur sa cagnotte Octopus Energy après activation. Les 10 € supplémentaires ne sont pas payés par Octopus Energy.",
    rewardTiming:
      "Octopus Energy indique que les 40 € sont ajoutés aux cagnottes lorsque le contrat du filleul est activé. Le délai et le mode de versement du complément personnel de 10 € sont à confirmer avec le parrain.",
    practicalInformation: [
      "Le programme officiel réserve le bonus aux nouveaux clients et ne permet pas de parrainer à nouveau une personne déjà récompensée.",
      "Le bonus Octopus est une somme de cagnotte qui peut servir aux mensualités ou à un don associatif.",
      "Vérifiez l'offre et les tarifs du contrat avant de souscrire : le parrainage ne garantit pas que le contrat sera le moins cher pour votre consommation.",
    ],
    internalLinks: [
      { label: "Comparer les offres d'énergie", slug: "totalenergies" },
      { label: "Voir le parrainage ENGIE", slug: "engie" },
      { label: "Découvrir Liberté Watts", slug: "liberte-watts" },
    ],
    faq: [
      {
        question: "Combien rapporte le parrainage Octopus Energy au filleul ?",
        answer:
          "Octopus Energy crédite 40 € sur la cagnotte du nouveau client après activation du contrat. Le parrain de cette fiche annonce un reversement personnel supplémentaire de 10 €, à confirmer directement avec lui.",
      },
      {
        question: "Quand le bonus Octopus Energy est-il crédité ?",
        answer:
          "Le bonus officiel est ajouté à la cagnotte du parrain et du filleul après l'activation du contrat. Le délai du complément de 10 € dépend du parrain.",
      },
      {
        question: "Faut-il utiliser le lien de parrainage avant la souscription ?",
        answer:
          "Oui. Commencez le parcours depuis le lien afin que l'inscription soit rattachée au parrainage, puis vérifiez que le contrat est activé.",
      },
      {
        question: "Un ancien client Octopus Energy peut-il profiter de l'offre ?",
        answer:
          "Le programme officiel indique que le bonus est réservé aux nouveaux clients et qu'une personne ayant déjà bénéficié d'un parrainage ne peut pas recevoir une nouvelle récompense de ce type.",
      },
      {
        question: "Les 10 € supplémentaires sont-ils versés par Octopus Energy ?",
        answer:
          "Non. Octopus Energy prévoit 40 € sur chaque cagnotte. Les 10 € supplémentaires sont un engagement personnel annoncé par le parrain de cette fiche.",
      },
    ],
    sources: [
      source(
        "Comment fonctionne le parrainage chez Octopus Energy",
        "https://octopusenergy.fr/aide-faq/parrainage-cagnotte/comment-fonctionne-le-parrainage-chez-octopus",
      ),
      source(
        "Annonce personnelle Octopus Energy",
        "https://www.super-parrain.com/offres/octopus-energy-2/parrainage-octopus-energy-2/annonces/mathieu-m",
        "secondary",
      ),
    ],
  }),
  "hello-fresh": make({
    status: "partial",
    seoTitle: "Code parrainage HelloFresh : 90 € annoncés | Parrainio",
    metaDescription:
      "Code HelloFresh HS-NGFG5SC5L et lien de parrainage : l'annonce affiche 90 € de réduction et un dessert offert. Vérifiez le panier et les conditions actives.",
    h1: "HelloFresh : code de parrainage et offre annoncée",
    introduction:
      "HelloFresh livre des ingrédients pré-dosés et des fiches-recettes pour cuisiner à la maison. Le code HS-NGFG5SC5L et le lien ci-dessous proviennent de l'annonce du parrain, qui affiche 90 € de réduction et un dessert offert à vie. La page publique HelloFresh actuellement accessible présente une promotion différente : le montant et la durée réellement applicables doivent donc être contrôlés dans le panier avant paiement.",
    summary: [
      "Code annoncé : HS-NGFG5SC5L.",
      "Lien de parrainage : ouvre le parcours HelloFresh associé à l'annonce.",
      "Annonce du parrain : 90 € de réduction et dessert offert à vie.",
      "Éligibilité : nouveau client n'ayant pas déjà utilisé un code de parrainage.",
      "À vérifier : répartition des réductions, minimum de commande et durée du cadeau dessert.",
    ],
    alertBox: {
      title: "Vérifiez la promotion dans votre panier",
      paragraphs: [
        "L'annonce du parrain affiche 90 € de réduction et un dessert offert à vie. La page publique HelloFresh consultée présente actuellement jusqu'à 85 € de réduction répartis sur plusieurs box et un dessert offert pendant deux mois. Le panier et les conditions affichées au moment de votre inscription déterminent l'offre réellement disponible.",
      ],
    },
    whyChoose: {
      heading: "Pourquoi choisir HelloFresh ?",
      paragraphs: [
        "HelloFresh propose des box de repas comprenant les ingrédients pré-dosés et les recettes à suivre. Les menus se choisissent chaque semaine et l'abonnement peut être modifié, mis en pause ou arrêté selon les modalités du service.",
        "Le code de parrainage peut réduire le prix des premières commandes si la campagne l'accepte. Comparez le total affiché, les frais éventuels et le prix des box suivantes avant de valider.",
      ],
    },
    audience:
      "Cette offre peut convenir à un nouveau client qui souhaite tester les box de recettes HelloFresh et peut recevoir ses livraisons dans sa zone. Elle ne convient pas à une personne ayant déjà utilisé un code de parrainage si les conditions de la campagne réservent l'avantage aux nouveaux inscrits.",
    referralExplanation:
      "Commencez le parcours avec le lien de cette fiche. Saisissez le code HS-NGFG5SC5L à l'étape où HelloFresh propose un code de parrainage ou une promotion. Avant de payer, examinez la remise appliquée à chaque box, la durée de l'abonnement promotionnel, les conditions du dessert et le prix des livraisons suivantes.",
    conditions: [
      "Être un nouveau client n'ayant pas déjà utilisé de code de parrainage HelloFresh, selon les conditions de la campagne.",
      "Utiliser le lien de l'annonce et saisir HS-NGFG5SC5L dans le parcours de première commande si le champ est proposé.",
      "Vérifier le détail des réductions dans le panier avant le paiement : la promotion actuelle peut différer du montant annoncé par le parrain.",
      "Consulter les conditions d'abonnement, les prochaines échéances et la durée de l'offre dessert.",
    ],
    earnings:
      "L'annonce du parrain présente jusqu'à 90 € de réduction ainsi qu'un dessert offert à vie. La promotion affichée publiquement par HelloFresh au moment de la vérification diffère (jusqu'à 85 € répartis sur plusieurs box et un dessert offert pendant deux mois) : seul le récapitulatif de commande confirme le montant disponible pour le filleul.",
    rewardTiming:
      "La réduction, lorsqu'elle est valide, apparaît dans le panier ou sur les factures des commandes promotionnelles selon la campagne. Vérifiez les échéances et la durée avant de confirmer votre première box.",
    practicalInformation: [
      "HelloFresh propose un abonnement hebdomadaire modifiable, suspendable ou résiliable depuis le compte, selon les délais de gestion de chaque box.",
      "Le dessert offert à vie de l'annonce n'est pas confirmé par la page publique actuelle ; celle-ci indique un dessert pendant deux mois.",
      "Les réductions peuvent être réparties sur plusieurs commandes et ne correspondent pas nécessairement à un paiement unique de 90 €.",
    ],
    internalLinks: [
      { label: "Voir les offres de courses", slug: "shopmium" },
      { label: "Découvrir Phenix", slug: "phenix" },
      { label: "Comparer La Belle Vie", slug: "la-belle-vie" },
    ],
    faq: [
      {
        question: "Quel code de parrainage HelloFresh utiliser ?",
        answer:
          "L'annonce associée à cette fiche indique le code HS-NGFG5SC5L. Utilisez-le dans le parcours de commande si le champ de code est proposé et contrôlez qu'il est bien pris en compte avant le paiement.",
      },
      {
        question: "Le code HelloFresh donne-t-il vraiment 90 € de réduction ?",
        answer:
          "L'annonce du parrain mentionne 90 €, mais la page publique HelloFresh consultée présente une promotion différente, jusqu'à 85 € répartis sur plusieurs box. Le montant applicable est celui détaillé dans le panier au moment de la commande.",
      },
      {
        question: "Qui peut profiter du parrainage HelloFresh ?",
        answer:
          "L'annonce est destinée à un nouveau client. Les conditions HelloFresh peuvent exclure une personne ayant déjà utilisé un code de parrainage ou déjà bénéficié d'une première offre.",
      },
      {
        question: "Le dessert est-il offert à vie ?",
        answer:
          "L'annonce personnelle l'indique, mais la promotion publique HelloFresh actuellement consultée mentionne un dessert offert pendant deux mois. Vérifiez la durée dans le panier et les conditions affichées avant de payer.",
      },
      {
        question: "La réduction est-elle appliquée sur une seule box ?",
        answer:
          "Pas nécessairement. Les promotions HelloFresh peuvent être réparties sur plusieurs livraisons. Le détail de chaque remise et le prix des prochaines box doivent apparaître dans le récapitulatif de commande.",
      },
    ],
    sources: [
      source("Site HelloFresh France", "https://www.hellofresh.fr/"),
      source(
        "Annonce personnelle HelloFresh",
        "https://www.super-parrain.com/offres/hello-fresh/parrainage-hello-fresh/annonces/mathieu-m",
        "secondary",
      ),
    ],
  }),
  "gaz-de-bordeaux": make({
    status: "partial",
    seoTitle: "Code parrainage Gaz de Bordeaux : 25 € annoncés | Parrainio",
    metaDescription:
      "Code de parrainage Gaz de Bordeaux 1429114 : 20 € sur facture selon le programme officiel, plus 5 € annoncés par le parrain au filleul.",
    h1: "Gaz de Bordeaux : code parrainage et remise sur facture",
    introduction:
      "Gaz de Bordeaux permet de souscrire des contrats d'électricité et de gaz naturel. La référence client du parrain, 1429114, doit être renseignée à l'étape 3 de la souscription. Le programme officiel prévoit 20 € de remise sur facture pour le parrain et le filleul, sous réserve des conditions de paiement. Le parrain de cette annonce ajoute 5 € qu'il reverse au filleul : ce complément est personnel et distinct de la remise fournisseur.",
    summary: [
      "Référence à saisir : 1429114 à l'étape 3 de la souscription.",
      "Avantage officiel : 20 € sur facture pour le parrain et le filleul.",
      "Annonce personnelle : 5 € supplémentaires reversés au filleul.",
      "Contrat : offre Gaz de Bordeaux éligible d'électricité ou de gaz.",
      "Crédit : remise portée sur une facture dans les trois mois, sous conditions.",
    ],
    whyChoose: {
      heading: "Pourquoi choisir Gaz de Bordeaux ?",
      paragraphs: [
        "Gaz de Bordeaux propose des contrats d'énergie pour les particuliers. Avant de changer de fournisseur, comparez les prix du kWh et de l'abonnement, le type d'offre et l'évolution des tarifs avec votre consommation réelle.",
        "Le code de parrainage donne accès à une remise sur facture si le contrat et les conditions du programme sont validés. Le supplément de 5 € annoncé sur cette fiche est un reversement du parrain et ne modifie pas le montant crédité par Gaz de Bordeaux.",
      ],
    },
    audience:
      "Cette offre s'adresse à un nouveau client qui souhaite souscrire une offre de fourniture d'énergie Gaz de Bordeaux et dont la situation est éligible au programme. Le filleul doit transmettre la référence du parrain pendant la souscription ; le parrain et le filleul doivent ensuite rester à jour du paiement des factures concernées.",
    referralExplanation:
      "Saisissez la référence 1429114 à l'étape 3 du parcours de souscription en ligne ou communiquez-la à un conseiller. Si le contrat est éligible, Gaz de Bordeaux prévoit une remise de 20 € sur une facture émise dans les trois mois suivant la souscription, pour le parrain et le filleul. Le parrain de cette annonce indique qu'il reverse en plus 5 € au filleul.",
    conditions: [
      "Être un nouveau client et souscrire une offre d'énergie Gaz de Bordeaux éligible.",
      "Renseigner la référence client 1429114 à l'étape 3 en ligne ou la communiquer au conseiller.",
      "Gaz de Bordeaux déduit 20 € de la facture éditée dans les trois mois suivant la souscription, si les deux parties sont à jour de leurs paiements.",
      "Le parrain annonce 5 € de reversement personnel supplémentaire au filleul ; convenir avec lui du moment et du mode de paiement.",
      "L'auto-parrainage n'est pas autorisé et le parrain peut parrainer jusqu'à 10 filleuls sur 12 mois glissants.",
    ],
    earnings:
      "Filleul : 20 € de remise officielle sur facture plus 5 € annoncés par le parrain, soit 25 € au total si les deux avantages sont validés. Parrain : 20 € de remise sur facture par filleul éligible. Le complément de 5 € est payé par le parrain, et non par Gaz de Bordeaux.",
    rewardTiming:
      "Gaz de Bordeaux prévoit une remise déduite d'une facture éditée dans les trois mois suivant la souscription, à condition que le parrain et le filleul soient à jour de leurs factures. Le délai du reversement personnel de 5 € dépend du parrain.",
    practicalInformation: [
      "La référence de parrainage correspond au numéro client du parrain et se saisit à l'étape 3 du parcours.",
      "La page officielle indique que la remise de 20 € peut s'appliquer à une souscription éligible d'électricité ou de gaz naturel.",
      "La remise n'est pas cumulable avec certaines autres promotions en cours et l'auto-parrainage est interdit.",
      "Le programme officiel limite le parrainage à 10 filleuls sur 12 mois glissants.",
    ],
    internalLinks: [
      { label: "Comparer Octopus Energy", slug: "octopus-energy" },
      { label: "Voir les offres ENGIE", slug: "engie" },
      { label: "Découvrir TotalEnergies", slug: "totalenergies" },
    ],
    faq: [
      {
        question: "Quel code de parrainage Gaz de Bordeaux faut-il saisir ?",
        answer:
          "Utilisez la référence 1429114 à l'étape 3 de la souscription en ligne ou communiquez-la au conseiller qui vous accompagne.",
      },
      {
        question: "Combien reçoit le filleul Gaz de Bordeaux ?",
        answer:
          "Le programme officiel prévoit 20 € de remise sur facture pour le filleul. Le parrain de cette fiche annonce un reversement supplémentaire de 5 €, soit 25 € au total si les deux avantages sont confirmés et versés.",
      },
      {
        question: "Quand la remise de 20 € est-elle appliquée ?",
        answer:
          "Gaz de Bordeaux indique qu'elle est déduite d'une facture émise dans les trois mois suivant la souscription, sous réserve que le parrain et le filleul soient à jour de leurs factures.",
      },
      {
        question: "Le code fonctionne-t-il pour l'électricité et le gaz ?",
        answer:
          "La page officielle de parrainage indique que le programme concerne la souscription à une offre d'électricité ou de gaz naturel éligible. Vérifiez les offres acceptées au début du parcours.",
      },
      {
        question: "Les 5 € supplémentaires viennent-ils de Gaz de Bordeaux ?",
        answer:
          "Non. La remise du fournisseur est de 20 €. Les 5 € de plus sont un reversement personnel annoncé par le parrain et doivent être convenus directement avec lui.",
      },
    ],
    sources: [
      source(
        "Le parrainage Gaz de Bordeaux",
        "https://www.gazdebordeaux.fr/nos-conseils-energie/mon-contrat-d-energie/parrainage-gaz-de-bordeaux",
      ),
      source(
        "Annonce personnelle Gaz de Bordeaux",
        "https://www.super-parrain.com/offres/gaz-de-bordeaux/parrainage-gaz-de-bordeaux/annonces/mathieu-m",
        "secondary",
      ),
    ],
  }),
};
