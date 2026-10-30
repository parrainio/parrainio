# Campagne de netlinking Parrainio — audit et prospects

**État au 30 octobre 2026 — document de travail, aucune prospection effectuée**

## Synthèse exécutive

La campagne doit privilégier des citations éditoriales spontanées fondées sur une information utile, pas l’achat de liens ni les échanges de liens. L’observatoire Parrainio est la meilleure ressource différenciante actuellement identifiée : il couvre 11 offres du catalogue en banque, finance et assurance ainsi que 14 observations de terrain distinctes. Il ne représente pas l’ensemble du marché français.

Le registre `3-backlinks-verifies.csv` ne comporte que son en-tête. Cela signifie qu’aucun backlink n’y est actuellement documenté; cela ne prouve pas l’absence de backlinks. Aucune connexion exploitable à Google Search Console, Bing Webmaster Tools ou à un outil SEO tiers n’a été identifiée dans les ressources accessibles. Il n’est donc pas possible d’établir ici un nombre de domaines référents, des pages liées, une autorité de domaine, un trafic estimé ou un état d’indexation mesuré. Aucune métrique de ce type n’est inventée.

Quarante prospects nouveaux au regard des listes examinées sont présentés dans le CSV associé. Il s’agit de pistes éditoriales à qualifier, pas de placements garantis. Plusieurs n’ont qu’un formulaire général, une page de contact bloquée ou aucun canal de proposition vérifié. Aucun courriel professionnel de rédaction n’a été confirmé. Les contacts et pages doivent être revalidés manuellement avant tout envoi.

## Audit des données disponibles

| Sujet | Constat vérifiable | Limite |
|---|---|---|
| Backlinks existants | Le registre `3-backlinks-verifies.csv` ne contient pas d’enregistrement de backlink au-delà de son en-tête. | Impossible d’en déduire qu’il n’existe aucun lien entrant. |
| Référents et pages liées | Pas de jeu de données GSC/Bing ni de rapport SEO connecté identifié dans les ressources consultées. | Nombre, qualité, pertinence et destination des backlinks inconnus. |
| Autorité / trafic | Aucune métrique DR, DA, TF ou trafic vérifiable n’est disponible pour cette campagne. | Les indicateurs affichés par des plateformes commerciales ne sont pas assimilés à une audience indépendante. |
| Prospection passée | Les CSV, oppositions, notes et rapports historiques ont été utilisés pour exclure les domaines déjà listés, quel que soit leur statut. | Un envoi accepté par SMTP ne prouve pas la livraison; l’historique disponible ne permet pas de confirmer l’absence de réponses. |
| Refus / statuts ambigus | `investisseurs-heureux.fr` et `devenir-rentier.fr` sont des refus explicites; `paiement.fr` a un statut contradictoire. | Ces domaines sont exclus de cette campagne. |
| Liens cassés, redirections, indexation | Aucun crawl exhaustif des URL du site ni contrôle Search Console n’a été effectué dans cette recherche. | Ne pas conclure à l’absence de liens cassés, de redirections inutiles ou de problèmes d’indexation. |

### Contrôles de déduplication

Les nouveaux noms ont été recoupés avec `base-prospection.csv`, `2-sites-non-contactes.csv`, les autres listes CSV pertinentes, les oppositions et les candidats des lots précédents. Les domaines ont été normalisés (notamment suppression de `www.`); les doublons entre médias d’un même groupe restent des prospects distincts, mais doivent être regroupés pour éviter des sollicitations concurrentes. Le CSV indique les limites de chaque piste. Aucune adresse email n’a été inférée à partir d’un format supposé.

## Qualité et état des 40 pistes

Le fichier `prospects-2026-10-30.csv` contient pour chacune : domaine, page éditoriale de preuve, canal de contact officiel disponible, statut du canal, angle, destination Parrainio, priorité et risque. Les sources sont des pages du site éditeur ou, lorsque l’accès direct était bloqué, une page de résultats d’actualité signalée comme telle. Un flux Google News n’est pas présenté comme une vérification directe de l’article de l’éditeur.

Les prospects les plus prometteurs pour un premier examen humain sont Franceinfo, 20 Minutes, Le Parisien, Femme Actuelle, Le Journal des Entreprises, Presse-Citron, Le Nouvel Obs, Sud Ouest, Le Progrès et Basta!. Cette sélection n’indique pas que ces rédactions acceptent des propositions ni qu’un lien sera publié. Les dix angles et messages correspondants sont dans le document de prospection.

### Scores de priorité

La priorité de 1 à 5 est un tri interne qualitatif, non une métrique SEO : pertinence thématique (0–2), qualité de l’élément éditorial consulté (0–1), canal de contact clairement identifié (0–1), et faisabilité d’un apport original (0–1), avec déclassement si l’adéquation est indirecte ou la vérification faible. Elle ne mesure ni autorité ni probabilité de lien. Les statuts « à vérifier » et « en attente de qualification » interdisent tout envoi automatique.

## Opportunités éditoriales et liens internes

1. **Faire de l’observatoire une ressource citable.** Publier ou proposer, après validation éditoriale interne, une note méthodologique datée indiquant le périmètre (11 offres; 14 observations), les définitions, la méthode de collecte et les limites. Ne pas généraliser à tout le marché.
2. **Créer des vues de données reproductibles.** Un tableau de conditions réellement vérifiées et datées peut servir de base à un sujet consommation; chaque valeur doit être accompagnée de sa source et de sa date de contrôle.
3. **Proposer des explications indépendantes des offres.** Guides utiles : lire les conditions d’une prime, distinguer parrainage/cashback/prime de bienvenue, comprendre la rémunération d’un comparateur, et vérifier les délais ou conditions de versement.
4. **Ressource voyage/eSIM.** Le comparatif eSIM peut être proposé à des médias voyage/tech seulement s’il reste à jour, distingue les liens affiliés et documente les prix, limites et dates de consultation. Aucun prospect ne doit recevoir une présentation qui le décrit comme indépendant de toute affiliation.
5. **Maillage interne à examiner, sans modification incluse ici.** Relier les guides de compréhension des primes aux pages d’offres correspondantes; relier les catégories aux offres réellement présentes; depuis l’observatoire, pointer vers la méthodologie et les offres illustratives concernées; relier le guide eSIM aux pages de fournisseurs seulement lorsque cela aide le lecteur. Vérifier les liens et l’indexabilité par un crawl avant de prioriser.

## Règles de qualification avant tout contact

- Vérifier à nouveau la page éditoriale, le contact public et l’activité récente le jour de l’envoi.
- Ne jamais utiliser un formulaire de service client comme s’il s’agissait d’une boîte de rédaction.
- Ne pas solliciter un média consommateur ou une association pour un article promotionnel; proposer uniquement une donnée vérifiable, un témoignage utile ou un angle critique et accepter un refus.
- Ne pas demander une ancre optimisée, un lien suivi garanti, un échange réciproque ou une publication payée non signalée.
- Toute opération rémunérée doit séparer clairement le commercial de l’éditorial et utiliser les attributs de lien appropriés. Voir l’analyse des règles Google dans `analyse-plateformes-echange-liens-2026-10-30.md`.
- Pas de relance en l’absence d’un canal approprié ou en présence d’une opposition; conserver la preuve de tout refus et ne pas recontacter.

## Documents associés

- `prospects-2026-10-30.csv` — 40 pistes dédupliquées, leurs preuves, canaux et limites.
- `20-messages-prospection-2026-10-30.md` — 20 brouillons individualisés, non envoyés.
- `plan-action-netlinking-2026-10-30.md` — séquencement de 30 jours et indicateurs.
- `analyse-plateformes-echange-liens-2026-10-30.md` — vérification Budirank, PushRank et politique de liens Google.

## Sources de méthode

- [Google Search Central — politiques anti-spam, spam de liens](https://developers.google.com/search/docs/essentials/spam-policies#link-spam)
- [Google Search Central — qualifier les liens sortants](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links)
- [Google Search Console — rapport des actions manuelles](https://support.google.com/webmasters/answer/9044175?hl=fr)
- Registres et notes historiques sous `docs/netlinking/`, consultés en lecture seule.

**Aucune prospection, création de compte, dépense, modification du site ou publication externe n’a été réalisée.**
