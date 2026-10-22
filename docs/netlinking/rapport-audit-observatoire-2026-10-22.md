# Audit correctif de l’Observatoire Parrainio — 22 octobre 2026

## Conclusion

La page a été réorganisée et les données reçues du responsable le 21 octobre ont été réintégrées sans les présenter comme des conditions contractuelles. Les divergences retrouvées sont visibles avec leur provenance ; les données détaillées peuvent être téléchargées. L’observatoire ne doit toutefois pas encore être présenté comme une référence pleinement validée pour une campagne de netlinking : plusieurs points précis restent à confirmer, dont l’écart BoursoBank, le parcours N26 et le calendrier exceptionnel d’assurancevie.com.

## Sources auditées

- `data/experience-terrain.json` et `lib/experienceTerrain.ts` : transmission brute du responsable du 21 octobre, compléments financiers, déclencheurs, réserves et exception assurancevie.com.
- `data/observatoire-conditions.json` et `lib/observatoireConditions.ts` : 11 pages partenaires consultées le 22 octobre. Les blocs terrain précédemment imbriqués dans ce jeu officiel ont été retirés et placés dans le jeu terrain.
- `data/offer-overrides.json`, `data/offers.ts` et les fiches Parrainio associées : instantané versionné du catalogue, comparé aux conditions partenaires et aux montants terrain.
- Ancien export `public/data/observatoire-conditions-2026-10-20.csv`, conservé comme archive. Deux exports datés et complets ont été produits pour cet audit.
- Script d’enrichissement transmis avec les fichiers temporaires, instantané pré-correction, méthode et rapports antérieurs des sessions 18 à 21.
- Page de production avant correction et sources partenaires publiques. Les liens officiels sont attachés aux fiches de la page et aux lignes de l’export.

Le retour terrain décrit plusieurs centaines de parrainages suivis pendant environ sept mois, mais ne donne ni effectif par offre, ni protocole de mesure, ni relevé indépendant. Les délais terrain sont donc attribués au responsable, sans être traités comme des garanties ou des clauses officielles.

## Résultats et divergences par offre

| Offre | Conditions officielles et catalogue | Transmission terrain et point restant |
|---|---|---|
| [BoursoBank](https://www.boursobank.com/bon-plan/parrainage-boursobank) | Campagne consultée : jusqu’à 240 € pour le filleul ; ouverture 20 €, versement initial 10/30/60 € selon les tranches 1–49/50–299/300 € et plus, carte jusqu’à 80 €, EasyMove 80 €. Les plafonds et déclencheurs de crédit diffèrent par composante ; clôture sous 24 mois : prélèvement des primes possible. La page publique ne chiffre pas le parrain. L’override Parrainio versionné indique 150 € filleul et 160 € parrain. | Le responsable rapporte 10/20/40 € selon ces mêmes tranches, sans campagne datée, et un versement filleul sous 24–48 h après dépôt requis et validation. Ces données divergent du barème officiel relu ; elles sont conservées séparément. À confirmer : campagne/parcours du retour, montant parrain actuel et synchronisation de la fiche publique Parrainio, qui affiche encore les valeurs versionnées. |
| [Fortuneo](https://www.fortuneo.fr/parrainage) | Campagne octobre consultée : filleul 70 € Fosfo / 130 € Gold ; parrain 70 € / 110 €. Dépôt de 300 € sous six jours. La page renvoie aux mentions pour le paiement, sans délai numérique exploitable dans la source relue. | Responsable : prime et commission généralement après validation, sous 7–10 jours au maximum après dépôt de 300 € et validation. La conservation d’un an transmise est une recommandation terrain, pas une condition officielle établie ici. Les mentions détaillées et éventuelles reprises restent à vérifier. |
| [Hello bank!](https://www.hellobank.fr/fr/votre-offre-parrainage/) | Filleul : 80 € Hello One ; Hello Prime 80 € puis 50 € sous condition d’au moins cinq paiements/retraits mensuels durant les 12 premiers mois ; Start+ 200 € en bon d’achat, distinct du cash. Parrain : 140 €. Prime parrain sous 20 jours après ouverture définitive ; conservation 12 mois et prélèvement possible en cas de clôture anticipée. | Responsable : 2–7 jours après validation des justificatifs ; pas de dépôt/achat supplémentaire signalé. La transmission conseille un an de conservation (six mois comme repère pratique), sans remplacer la règle officielle de 12 mois. |
| [Monabanq](https://www.monabanq.com/fr/parrainage.html) | Offre de bienvenue filleul jusqu’à 280 €, séparée du parrainage ; parrain 30 € (Pratiq+/Uniq) ou 50 € (Uniq+). Parrain payé sous 60 jours après ouverture si le compte reste ouvert ; reprise possible sous 12 mois. | Responsable : environ 30 jours après validation, prime du parrain au même moment ; aucun cas de reprise observé par lui. L’absence de reprise observée n’annule pas la clause publiée. |
| [N26](https://n26.com/fr-fr/invitez-vos-amis) | La page publique consultée ne fixe pas de montant : invitation et prime dépendent de l’offre montrée dans l’application. Jusqu’à 60 jours ouvrés après une recommandation qualifiante. Snapshot catalogue : 15 € filleul / 0 € parrain. | Responsable : achat carte de 30 €, carte virtuelle admise, généralement sous 72 h ; supplément lié à l’abonnement avec conservation de trois mois. Son complément financier indique 25 € après achat et jusqu’à 75 € supplémentaires, soit 100 € au total, avec reversement Parrainio jusqu’à 50 €. Le parcours/campagne correspondant à ces montants n’est pas identifié ; ne pas fusionner ces valeurs avec l’invitation actuelle. |
| [Linxea](https://www.linxea.com/parrainage/) | Le montant filleul et un délai de paiement chiffré ne sont pas indiqués dans la source publique relue. Carte cadeau parrain 50 € dans l’override catalogue. La source explique l’envoi après éligibilité et le délai de renonciation de 30 jours ; code promotionnel incompatible avec le parrainage. | Responsable : environ 30 jours après validation du contrat, commission parrain dans le même mouvement ; le reversement Parrainio est ensuite rattaché au délai général après réception de commission. Le minimum de versement de 600 € signalé n’a pas été retrouvé dans la source consultée ; contrats éligibles et délai exact restent à confirmer. |
| [assurancevie.com / Lucya](https://lucya.com/parrainage/) | Filleul 50 €, parrain 100 € ; contrat validé après 30 jours de renonciation ; paiement au plus tard 60 jours après validation (jusqu’à environ 90 jours après souscription), conservation 12 mois et prélèvement possible en cas de dénouement anticipé. L’override catalogue indique encore 50 € parrain. | Responsable : prime filleul autour de 30 jours et prime parrain autour de 90 jours après validation ; il indique que Parrainio peut reverser avant réception de la commission. Le déclencheur/délai de cette exception n’est pas fourni. Une autre mention de 14 jours dans la transmission ne précise pas l’étape concernée et n’est donc pas affectée à un délai. |
| [Caisse d’Épargne Loire-Centre](https://www.caisse-epargne.fr/loire-centre/notre-offre-de-parrainage/) | Filleul 80 €, parrain 50 €, versement au plus tard sous 60 jours après dépôt définitif du compte. Aucun retour terrain correspondant. | Aucun délai terrain communiqué pour cette offre. |
| [Simplis](https://www.simplis.fr/le-programme-de-parrainage-de-simplis) | Parrain : 10 € RC Pro ou 50 € Garantie Décennale, sous 15 jours après prise d’effet du contrat. Aucune prime filleul chiffrée retrouvée sur la page consultée. | Aucun retour terrain correspondant. |
| [Meilleurtaux](https://www.meilleurtaux.com/parrainage/) | Programmes distincts : assurance de prêt (filleul 50 €, parrain 100 €, sous un mois après signature) ; crédit immobilier (150 € en chèques cadeaux au parrain, sous deux mois après finalisation/déblocage) ; assurance-vie/PER jusqu’à 1 000 € chacun, sans délai maximal public relevé. IBAN manquant sous trois mois : paiement potentiellement annulé. | Aucun délai terrain rattaché. Une estimation globale est volontairement exclue, car les produits n’ont pas le même calendrier. |
| [Direct Assurance](https://www.direct-assurance.fr/nos-assurances/assurance-auto/offres/parrainage) | 50 € filleul et parrain ; souscription dans les 60 jours après devis, contrat accepté/actif et cotisations à jour ; remboursement au plus tard sous deux mois. | Responsable : 30–60 jours après activation. Le délai publié et le retour sont proches, mais leurs déclencheurs ne sont pas assimilés. |

Retours terrain hors des 11 pages officielles : BNP Paribas (10 paiements dans les trois mois, délai inconnu), Coinbase (36–48 h après achat/échange de 20 €), Kraken (environ 72 h après transaction de 200 €), eToro (environ sept jours après transaction de 100 $, position d’au moins 100 $ sous 90 jours), XTB (bonus après achat de l’action Michelin requis, retrait du bonus bloqué trois jours) et Splint Invest (bonus immédiat après code ; investissement bloqué selon l’actif pendant trois mois à sept ans). Ils restent visibles comme observations non officielles, pas comme promesses partenaires.

## Présentation et conservation des informations

- La page distingue maintenant explicitement conditions officielles, catalogue versionné, observations du responsable, estimations Parrainio et inconnues.
- Le parcours distingue condition d’action, versement du partenaire, réception de commission et reversement Parrainio. La règle terrain générale de 24–72 heures est donnée après réception de commission, avec l’exception assurancevie.com clairement isolée.
- Les 11 fiches officielles détaillent montant filleul/parrain, déclencheur, citation, conservation, reprise, écart de catalogue et retour terrain disponible. Les six observations hors périmètre ont leur propre fiche.
- « Aucun cas publié » est qualifié comme absence de clause trouvée dans la source lue, et non comme garantie d’absence de reprise.
- L’export officiel versionné `public/data/observatoire-conditions-2026-10-22.csv` contient les 11 pages, citations, données de catalogue et retours rattachés. `public/data/observatoire-terrain-2026-10-21.csv` conserve les 14 observations et leurs compléments. L’ancien CSV du 20 octobre n’a pas été écrasé.

## Limites à lever avant de citer la page comme référence pleinement validée

1. Réconcilier l’ancienne fiche publique/override BoursoBank (150/160 € et barème terrain 10/20/40 €) avec la campagne officielle observée (jusqu’à 240 € et 10/30/60 €), puis dater le parcours auquel se rapporte le retour du responsable.
2. Identifier l’invitation N26 et les conditions/campagnes qui correspondent au complément 25 € + jusqu’à 75 €, au snapshot catalogue 15 €/0 € et à l’achat de 30 € communiqué par le responsable.
3. Documenter le déclencheur et le calendrier du reversement anticipé assurancevie.com ; retrouver l’étape associée à la mention terrain de 14 jours.
4. Obtenir pour Linxea la source du minimum de 600 €, les contrats concernés et le calendrier exact. Pour Fortuneo, consulter les mentions de campagne pour confirmer conservation et clauses de reprise.
5. Ajouter, si disponibles, des effectifs et dates d’observation par offre ; à défaut, conserver durablement le qualificatif de retour d’une seule source non statistique.

Ne pas lancer de nouvelle campagne de netlinking vers cette page avant clarification et validation de ces points. L’archive des sessions précédentes n’a pas été modifiée.

## Vérifications effectuées

- `npm run test:observatoire` : 36 contrôles réussis, dont export source/CSV et conservation des 14 observations avec déclencheurs, montants, exceptions et notes.
- `npm run test:netlinking` : 99 tests réussis.
- `npx tsc --noEmit` : réussi.
- `npm run build` : réussi avec Next.js 16.3.3.
- `git diff --check` : réussi.
- Rendu local de production vérifié dans un navigateur à taille bureau et à 390 × 844 px. Le contrôle mobile a révélé une largeur erronée sur la cellule du nom de l’offre ; le CSS a été corrigé puis revérifié. Les noms comme Monabanq sont désormais lisibles en ligne.
- Contrôle HTTP local du HTML serveur : statut 200, 11 identifiants de fiches officielles distincts, et comparaison des champs montants, citations, conditions, reprises et divergences pour chacune des 11 offres ; les 14 observations terrain et leurs compléments transmis sont également présents.
- Après push de `0a32701`, contrôle du HTML sur le domaine de production : statut 200, 11 fiches officielles et six fiches terrain supplémentaires ; relevé du 22 octobre, écart BoursoBank, exception assurancevie.com et liens vers les deux exports présents.
- Vérification directe des exports en production : les deux réponses HTTP sont 200 ; l’export officiel contient 11 lignes d’offre et l’export terrain 14 observations, dont assurancevie.com.
