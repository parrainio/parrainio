import fs from 'node:fs';

const path = 'data/offer-overrides.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const date = '2026-08-30';
const sets = {
  fortuneo: [
    'L’offre concerne une première ouverture éligible Fortuneo.',
    'Pour l’offre bancaire concernée, effectuer un premier versement de 300 €.',
    'Le versement de 300 € doit être effectué dans les 6 jours suivant l’ouverture selon les conditions de l’offre.',
  ],
  airbnb: [
    'Le filleul doit effectuer sa première réservation éligible via le lien de parrainage.',
    'La réservation doit être acceptée par l’hôte et payée.',
    'Le filleul doit effectuer l’intégralité du séjour.',
    'Une réservation annulée ne constitue pas un parrainage réussi.',
  ],
  'airbnb-1': [
    'Le filleul doit publier pour la première fois une expérience, un service ou une annonce de logement entier en tant que titulaire.',
    'La première réservation éligible doit être honorée dans les 180 jours suivant la création de l’annonce.',
    'La première réservation doit atteindre au moins 50 USD pour une expérience ou un service, ou 100 USD pour un logement, ou l’équivalent local.',
  ],
  alltricks: [
    'La réduction de 10 € s’applique à la première commande Alltricks dépassant 100 €.',
    'La commande doit concerner des produits vendus et expédiés par Alltricks.',
    'Les chèques cadeaux sont exclus et le code doit être saisi avant la validation du panier.',
    'Le code n’est pas cumulable avec d’autres codes promotionnels et reste valable 2 mois.',
  ],
  'aroma-zone': [
    'Le code offre filleul est utilisable sur la première commande.',
    'La réduction est de 5 € à partir de 25 € d’achat.',
    'Le code peut être utilisé en ligne ou dans une boutique Aroma-Zone.',
  ],
  'assurancevie-com': [
    'Le filleul doit être un nouveau client Assurancevie.com.',
    'La souscription doit concerner un contrat éligible avec un dossier complet et conforme.',
    'Un premier versement doit être effectué et le délai légal de renonciation de 30 jours doit être écoulé.',
    'Le contrat doit être conservé pendant au moins 12 mois ; un dénouement anticipé peut entraîner la récupération de la prime.',
  ],
  attapoll: [
    'L’utilisateur doit avoir au moins 18 ans et résider dans un pays couvert par AttaPoll.',
    'Le code de parrainage doit être saisi dans les 7 jours suivant l’inscription.',
    'La récompense dépend du pays et des enquêtes effectivement terminées.',
  ],
  bemyeye: [
    'Le filleul doit être un nouvel utilisateur résidant dans le même pays que le parrain.',
    'Le code doit être saisi lors de l’inscription.',
    'La récompense de 1 € est déclenchée après la réalisation de la première mission en magasin.',
  ],
  betclic: [
    'Le filleul ne doit jamais avoir ouvert de compte Betclic auparavant.',
    'Le compte doit être validé et le dépôt initial prévu par la campagne active doit être réalisé.',
  ],
  betsson: [
    'Le filleul doit être un nouveau client Betsson et son compte doit être vérifié.',
    'Un dépôt minimum de 10 € est requis pour la campagne référencée.',
    'Le freebet est soumis à ses propres règles et ne constitue pas une somme immédiatement retirable.',
  ],
  bitpanda: [
    'Le filleul doit être un nouvel utilisateur Bitpanda et terminer la vérification de son compte.',
    'Les cookies doivent être activés pour rattacher l’inscription au parrainage.',
    'Le montant et les étapes de la récompense dépendent du programme, du pays et de la campagne applicable.',
  ],
  bitstack: [
    'Le filleul doit effectuer la vérification d’identité Bitstack.',
    'Il doit acheter au moins 100 € de Bitcoin ou atteindre 100 € investis via les arrondis automatiques selon le programme.',
    'La récompense est versée en Bitcoin.',
  ],
  boursobank: [
    'Le filleul doit être éligible à une première ouverture BoursoBank.',
    'Le premier versement doit être effectué dans le délai prévu par la campagne active.',
    'Le montant de la prime dépend du montant du premier versement et des options souscrites.',
    'La mobilité bancaire et les paiements mensuels éventuels obéissent aux conditions propres à la campagne affichée.',
  ],
  monabanq: [
    'Le filleul doit être majeur, résider en France et ne pas être client ou ancien client Monabanq.',
    'Le parrainage concerne une première ouverture définitive d’un compte courant Pratiq+, Uniq ou Uniq+.',
    'Les offres jeunes, PratiqPro, droit au compte et offre alternative sont exclues.',
    'Le compte doit rester ouvert pour que le parrainage soit effectif.',
  ],
  linxea: [
    'Le filleul doit avoir plus de 18 ans et ne pas être déjà client Linxea.',
    'La souscription doit concerner une assurance-vie ou un PER effectuée en ligne.',
    'Le contrat doit être validé par l’assureur et ne pas être annulé pendant le délai légal de renonciation de 30 jours.',
    'Une offre promotionnelle ou de bienvenue ne peut pas être cumulée avec le parrainage.',
  ],
  n26: [
    'Le filleul doit finaliser l’ouverture d’un compte N26 via le parcours de parrainage.',
    'Un achat qualifiant doit être effectué avec la carte Mastercard N26.',
    'Le montant exact de la prime dépend de la campagne affichée dans l’application.',
  ],
  shopmium: [
    'Le code doit être saisi lors de la création du compte Shopmium et ne peut pas être ajouté après l’inscription.',
    'Le filleul ne doit pas utiliser le même compte bancaire ou PayPal que le parrain.',
    'Une première demande de remboursement doit être effectuée et validée pour déclencher les 2 €.',
  ],
  sumup: [
    'Le compte SumUp du filleul doit être vérifié.',
    'Trois paiements par carte en magasin doivent être réalisés dans les 30 jours.',
    'Le montant cumulé des trois paiements doit atteindre au moins 10 €.',
  ],
  weward: [
    'Le code de parrainage doit être saisi lors de l’inscription.',
    'En France, la grille référencée prévoit 30 Wards de bienvenue et 20 Wards liés au parrainage.',
    'Le parrain reçoit 20 Wards lorsque le filleul atteint 200 Wards ou complète une série de 3 jours.',
    'Le montant peut varier selon le pays et la phase de test du programme.',
  ],
  coinbase: [
    'Le filleul doit être un nouveau client Coinbase et ne pas posséder un autre compte Coinbase.',
    'Un achat de cryptomonnaie avec un moyen de paiement éligible doit être effectué dans le délai de la campagne.',
    'Le montant et le seuil d’achat dépendent du pays et de la campagne affichée.',
    'Coinbase Advanced et Coinbase Prime ne relèvent pas du programme standard.',
  ],
  honeygain: [
    'Le filleul reçoit 3 $ de crédits lors de l’inscription avec le lien ou code de parrainage.',
    'Le parrain reçoit jusqu’à 5 $ lorsque le filleul atteint le seuil de paiement de 20 $.',
    'La récompense est liée au trafic généré par le filleul et n’est pas un bonus monétaire immédiat.',
  ],
  ebuyclub: [
    'Le filleul doit effectuer un premier achat générant du cashback.',
    'Le premier cashback en ligne doit atteindre au moins 10 € HT, ou 40 € pour un cashback bon d’achat ou magasin.',
    'Le programme prévoit ensuite le bonus de parrainage et 10 % des gains cashback du filleul.',
  ],
  'greenweez-6': [
    'Le filleul doit être un nouveau client Greenweez et effectuer sa première commande.',
    'La campagne référencée exige un panier d’au moins 69 € pour obtenir 5 € de réduction.',
    'Le bon du parrain est attribué après validation de la première commande.',
  ],
  myprotein: [
    'Le filleul doit être un nouveau client et effectuer sa première commande.',
    'La campagne référencée prévoit 15 € de réduction dès 40 € d’achat.',
    'Le code de parrainage doit être appliqué au parcours de commande éligible.',
  ],
  'i-run-fr': [
    'Le filleul ne doit pas encore être client i-Run.',
    'Il doit passer sa première commande après l’inscription et atteindre au moins 60 €.',
    'La commande validée déclenche la réduction de 10 € prévue par l’offre.',
  ],
  'hello-bank': [
    'Le filleul doit ouvrir définitivement son compte Hello bank! via le parcours de parrainage.',
    'La campagne référencée prévoit 80 € sous réserve de réaliser 5 opérations par carte par mois pendant 3 mois.',
    'Le compte et la carte doivent être conservés au moins un an selon le règlement de la campagne.',
  ],
  engie: [
    'Le filleul doit être un particulier majeur et souscrire une offre de marché ENGIE électricité et/ou gaz.',
    'Le lieu de consommation doit être situé en France métropolitaine hors Corse.',
    'Le filleul ne doit pas déjà détenir de contrat d’énergie à prix de marché ENGIE.',
    'Le code de parrainage doit être renseigné lors de la souscription ; un simple changement d’offre ENGIE est exclu.',
  ],
  'direct-assurance': [
    'Le filleul doit réaliser un devis auto ou habitation éligible et renseigner le code DIRECTPARRAIN.',
    'Le numéro de contrat du parrain doit également être renseigné.',
    'Le contrat doit être souscrit dans les 60 jours suivant le devis, accepté et prendre effet.',
    'Le client doit être à jour du paiement de sa cotisation au moment du remboursement.',
  ],
  pmu: [
    'Le filleul doit ouvrir un compte PMU+ pour la première fois.',
    'Un dépôt minimum de 10 € doit être effectué le jour de l’ouverture.',
    'Le compte doit être confirmé et respecter les règles de validation PMU+.',
  ],
};

for (const [slug, conditions] of Object.entries(sets)) {
  if (!data[slug]) continue;
  data[slug].conditions = conditions;
  data[slug].lastVerifiedAt = date;
}
fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Applied concrete conditions to ${Object.keys(sets).length} offers.`);
