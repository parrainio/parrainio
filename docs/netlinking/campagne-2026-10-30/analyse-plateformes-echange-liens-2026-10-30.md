# Budirank, PushRank et politique de liens — vérification du 30 octobre 2026

## Synthèse

| Plateforme | Fonctionnement public observé | Gratuit / payant observé | Intérêt pour Parrainio | Décision prudente |
|---|---|---|---|---|
| Budirank | Marketplace d’échange éditorial fonctionnant par crédits : en accueillir des publications permet de gagner des crédits, ensuite dépensés pour publier chez d’autres membres. | La page d’accueil annonce un accès gratuit et des crédits achetables. Les prix de crédits ne sont pas publiés sur les pages consultées : les CGV les renvoient à l’espace utilisateur. | Accès possible à des éditeurs, mais le mécanisme même d’échange de liens contre crédits crée un risque de liens artificiels, même si les articles sont contextualisés. Les métriques affichées (DA, TF, CF, RD, TTF, SPAM) sont des indicateurs tiers, pas des preuves de qualité éditoriale ni des garanties de visibilité. | Ne pas s’inscrire ni accepter une publication en échange de crédits pour obtenir un lien suivi. N’envisager une publication que si elle présente une valeur autonome pour les lecteurs, que le choix éditorial reste indépendant et que le lien est correctement qualifié si la relation est sponsorisée. |
| PushRank | Outil SEO et de contenu avec suivi de visibilité et une section d’offres de liens annoncée « à la commande ». Les pages publiques ne précisent pas la nature éditoriale des placements, les sites concernés ni les attributs des liens. | La page de prix indique un essai de 7 jours et annonce 89 € HT/mois pour PushRank, 500 € HT/mois avec consultant, tout en affichant également « à partir de 74 € HT/mois ». Les prix des offres de liens à la commande ne sont pas visibles. Cette incohérence tarifaire reste à clarifier avant tout engagement. | Le suivi SEO peut éventuellement être utile comme outil, mais l’offre de liens non documentée ne permet pas de juger sa conformité, son contexte éditorial ou son rapport qualité-prix. | Ne pas prendre l’abonnement ni commander de lien dans le cadre de cette mission. Demander les conditions et exemples de pages publiques avant d’évaluer une offre ultérieure; refuser tout placement qui vend un lien suivi pour influencer le classement. |

## Détails des vérifications

### Budirank

Le site se présente explicitement comme une plateforme d’échange de backlinks : les membres peuvent proposer des articles sur leur site pour recevoir des crédits, puis dépenser ces crédits sur d’autres sites. L’accueil annonce un plan gratuit, une marketplace et des métriques de domaines. Il s’agit des affirmations commerciales du fournisseur, pas d’une validation indépendante de la qualité des sites ou de leur audience.

Les [conditions générales de vente de Budirank](https://www.budirank.com/conditions-generales-de-vente/) précisent que les crédits peuvent être achetés ou obtenus en acceptant des publications; les prix sont indiqués dans l’espace personnel. La page affiche une dernière mise à jour au 31 octobre 2025. Les prix exacts des crédits, les paramètres `rel` des liens publiés et les conditions propres à chaque emplacement n’ont pas pu être vérifiés sans compte. Aucun compte n’a été créé et aucun accès privé n’a été demandé.

**Risque principal :** une publication accueillie contre des crédits, puis un lien obtenu chez un membre, reste une contrepartie organisée. Un contenu original ou placé dans un article ne transforme pas automatiquement cette contrepartie en lien éditorial indépendant.

### PushRank

La page [tarifs PushRank](https://pushrank.io/fr/pricing) consultée le 30 octobre 2026 présente une offre logicielle avec essai de 7 jours, un prix d’abonnement affiché à 89 € HT/mois, une offre avec consultant à 500 € HT/mois et, dans son titre, un tarif « à partir de 74 € HT/mois ». La page est donc contradictoire sur le prix d’entrée; aucun achat ou essai n’a été lancé.

La même page énumère des prestations de liens « à la commande », sans prix public ni détail vérifiable sur les éditeurs, l’intégration, la rémunération, les critères de sélection ou les attributs HTML. Les résultats d’audience revendiqués par le fournisseur sur ses sites suivis sont des affirmations commerciales et ne constituent pas une mesure indépendante de la performance attendue pour Parrainio. Il faut demander les conditions précises avant toute décision, sans confondre abonnement logiciel et tarif d’un placement.

### Google Search Central

- La [politique anti-spam de Google — spam de liens](https://developers.google.com/search/docs/essentials/spam-policies#link-spam) vise les liens créés principalement pour manipuler le classement. Les exemples incluent l’achat/vente de liens qui transmettent du crédit de classement, les articles payés avec liens suivis, les échanges excessifs (« lien contre lien »), les pages partenaires conçues principalement pour le cross-linking et les campagnes d’articles invités avec ancres optimisées.
- Google ne proscrit pas le format « article invité » en soi. Le risque porte sur la finalité de manipulation, le manque de valeur éditoriale, la contrepartie et les liens qui transmettent artificiellement du crédit de classement. Une contribution doit d’abord être utile au public du média et rester sous son contrôle éditorial.
- Pour les liens publicitaires ou payés, Google recommande `rel="sponsored"`; `rel="nofollow"` peut être utilisé lorsqu’une relation ne doit pas être associée ou suivie par Google et qu’une autre valeur ne s’applique pas. Plusieurs valeurs `rel` peuvent être combinées. Les liens UGC relèvent de `rel="ugc"`. Voir [Qualifier les liens sortants](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links).
- Une action manuelle peut toucher certaines pages ou l’ensemble du site. Le [rapport des actions manuelles](https://support.google.com/webmasters/answer/9044175?hl=fr) explique que Google avertit les propriétaires dans Search Console. Pour une action liée à des liens artificiels, il faut corriger les liens concernés et suivre les indications du rapport avant de demander un réexamen.

## Recommandation opérationnelle pour Parrainio

1. Prioriser les citations spontanées de l’observatoire, avec un périmètre et une date explicitement indiqués : 11 offres du catalogue Parrainio en banque, finance et assurance, et 14 observations de terrain distinctes. Cet observatoire ne décrit pas l’intégralité du marché français.
2. Proposer des données ou un témoignage à des journalistes et éditeurs identifiés, sans exiger d’ancre, de lien suivi, ni d’échange réciproque.
3. Ne pas importer sur Parrainio des articles tiers contre des crédits ou contre une publication retour.
4. Pour une collaboration réellement rémunérée, séparer publicité et rédaction, déclarer la relation commerciale et demander que le média qualifie le lien conformément aux consignes Google.
5. Si un outil de suivi est envisagé séparément, vérifier son prix final, le renouvellement, les modalités de résiliation et les données de Search Console réellement utilisées avant de créer un compte. Aucun essai ni abonnement n’a été souscrit pendant cette recherche.

## Sources primaires consultées

- [Budirank — page d’accueil](https://www.budirank.com/)
- [Budirank — conditions générales de vente](https://www.budirank.com/conditions-generales-de-vente/)
- [Budirank — application](https://app.budirank.com/) (contenu de la marketplace non accessible sans progression vers l’espace utilisateur)
- [PushRank — tarifs](https://pushrank.io/fr/pricing)
- [PushRank — accueil](https://pushrank.io/fr/)
- [Google — politique anti-spam, section sur le spam de liens](https://developers.google.com/search/docs/essentials/spam-policies#link-spam)
- [Google — qualification des liens sortants](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links)
- [Google Search Console — rapport des actions manuelles](https://support.google.com/webmasters/answer/9044175?hl=fr)

**Limites :** aucune plateforme n’a été utilisée; aucune connexion, inscription, commande, publication ou négociation n’a eu lieu. Les tarifs ou règles susceptibles d’être réservés à un espace connecté sont signalés comme non vérifiables publiquement.
