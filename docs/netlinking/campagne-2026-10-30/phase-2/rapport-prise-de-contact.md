# Rapport de prise de contact — phase 2

**Date du bilan : 30 octobre 2026. Aucun contact externe n’a eu lieu.**

## Résultats

| Indicateur | Résultat |
|---|---:|
| Prospects du lot initial requalifiés | 40 / 40 |
| Contacts qualifiés pour une première vague | 0 |
| Adresses éditoriales professionnelles vérifiées | 0 |
| Emails envoyés | 0 |
| Formulaires soumis | 0 |
| Brouillons créés dans une boîte mail | 0 |
| Réponses reçues | 0 |
| Échecs d’envoi | 0 |

Le script d’envoi du dépôt a été inspecté. `node --use-system-ca scripts/send-outreach.mjs --check` a confirmé la connexion et l’authentification SMTP OVH, sans envoi. Le premier contrôle sans `--use-system-ca` échouait à cause du certificat d’inspection local; le contrôle avec le magasin de certificats Windows a réussi. Le journal historique recense des envois acceptés par SMTP vers d’autres prospects entre le 20 et le 22 octobre; cela n’établit pas la remise finale ni l’absence de réponses. Aucun des 40 domaines de cette phase n’apparaît dans les journaux antérieurs inspectés.

## Motif de non-envoi

La revue des 40 pages et contacts n’a établi aucun prospect réunissant une pertinence éditoriale directe, une voie appropriée et une coordonnée éditoriale vérifiable. Les rares voies explicitement éditoriales sont conditionnelles ou n’exposent pas de destinataire : Le Journal des Entreprises (email de rédaction masqué), Prisma Media/Femme Actuelle (mise en relation, sans contact précis ni activité récente pertinente confirmée), The Conversation (auteur chercheur éligible requis) et Basta! (proposition possible, mais un angle indépendant suffisamment étayé manque). Les adresses de partenariat de Presse-Citron ne sont pas détournées vers la rédaction.

La [page CNIL sur la prospection électronique](https://www.cnil.fr/fr/la-prospection-commerciale-par-courrier-electronique-sms-mms-et-automate-dappel), consultée le 30 octobre 2026, affiche le consentement préalable comme règle générale pour la publicité électronique et ne confirme pas une exception B2B générale applicable ici dans le contenu accessible. Parrainio recherche une visibilité commerciale; aucun envoi n’est fait sans base claire et vérifiée. Le choix protège aussi les destinataires contre l’usage d’adresses de support, d’abonnement ou de contact général à une autre fin.

## Budirank et PushRank

- **Budirank** : la page publique présente une place de marché d’échange de liens contre crédits, avec possibilité d’acheter des crédits. C’est une contrepartie organisée à risque au regard des règles Google. Aucun compte, recherche dans la marketplace, échange ou achat n’a été fait; aucune opportunité éditoriale indépendante n’est identifiée.
- **PushRank** : la page tarifaire consultée affiche « à partir de 74 € HT/mois », un abonnement à 89 € HT/mois et une formule avec consultant à 500 € HT/mois; les liens à la commande restent sans prix ni détails éditoriaux vérifiables. Aucun essai, compte ou achat n’a été fait. Aucune opportunité à engager.

## Suivi et prochaines actions

- Aucun destinataire ne doit être relancé : aucun message n’a été envoyé.
- Requalifier uniquement après publication d’une ressource originale, datée et reproductible sur les conditions de primes, avec sa méthode et ses limites.
- Rechercher alors un canal éditorial explicite et vérifier la base juridique de toute sollicitation avant envoi.
- Si un média refuse ou demande de ne plus être contacté, consigner le domaine dans le registre d’opposition avant toute autre campagne.

## Fichiers

- `qualification-finale-prospects.md` — revue individualisée des 40 prospects.
- `contacts-verifies.csv` — en-tête seulement; aucun destinataire qualifié.
- `messages-envoyes.md` — état réel des envois; aucun message expédié.
- `suivi-campagne.csv` — suivi anonymisé par organisation, sans données personnelles.

Les coordonnées détaillées ne sont pas publiées. Aucune donnée personnelle de destinataire n’a été collectée ou ajoutée dans ces livrables.
