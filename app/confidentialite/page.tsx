import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { OG_IMAGE } from "@/lib/ogImage";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Parrainio",
  description:
    "Politique de confidentialité de Parrainio : données collectées via le formulaire de demande de reverse et les avis clients, cookies et droits des utilisateurs.",
  alternates: { canonical: "https://www.parrainio.fr/confidentialite" },
  openGraph: { url: "/confidentialite", type: "website", siteName: "Parrainio", locale: "fr_FR", images: [OG_IMAGE] },
};

export default function ConfidentialitePage() {
  return (
    <LegalPage
      kicker="Données personnelles"
      title="Politique de confidentialité"
      intro="La présente politique décrit la manière dont Parrainio traite les données personnelles collectées sur le site, conformément au Règlement général sur la protection des données (RGPD)."
    >
      <h2>Responsable du traitement</h2>
      <p>
        Le responsable du traitement est <strong>MORIN Mathieu</strong>, 131 rue de Bretagne, 45200 Amilly,
        France. Pour toute question relative à vos données personnelles :
        <a href="mailto:parrainage@parrainio.fr">parrainage@parrainio.fr</a>.
      </p>

      <h2>Données collectées</h2>
      <p>
        Parrainio collecte des données via deux formulaires présents sur les fiches offres : le formulaire
        de demande de reverse et le formulaire d'alerte e-mail.
      </p>
      <p>Formulaire de demande de reverse :</p>
      <ul>
        <li>prénom et nom ;</li>
        <li>adresse e-mail ;</li>
        <li>référence éventuelle (numéro de contrat ou référence) ;</li>
        <li>mode de paiement et coordonnées de paiement éventuelles (notamment RIB ou compte PayPal) ;</li>
        <li>message éventuel.</li>
      </ul>
      <p>
        La consultation des offres, hubs et pages du site ne nécessite aucune création de compte et ne
        collecte aucune donnée personnelle.
      </p>

      <h3>Avis clients</h3>
      <p>
        La page « Avis clients » permet de publier un avis en renseignant uniquement un pseudo, une
        note de 1 à 10, le texte de l'avis et, en option, l'offre concernée. Aucune adresse e-mail,
        aucun nom réel ni aucune autre donnée personnelle n'est demandé. Le pseudo, la note, le
        texte et la date de publication de l'avis accepté peuvent être affichés publiquement sur la
        page « Avis clients » après modération. Parrainio peut retirer un avis qui ne respecte pas
        ses règles de publication. Pour exercer vos droits sur un avis publié (rectification ou
        suppression), écrivez à
        <a href="mailto:parrainage@parrainio.fr">parrainage@parrainio.fr</a>.
      </p>

      <h3>Alertes e-mail</h3>
      <p>
        Sur chaque fiche offre, une alerte e-mail facultative (« 🔔 Être alerté si cette offre évolue »)
        permet d'être prévenu si l'offre surveillée évolue de manière significative. Sont collectés : votre
        adresse e-mail, l'identifiant de l'offre concernée, la date de la demande et, le cas échéant, la
        date de confirmation et de désabonnement. Aucun autre formulaire ni aucune newsletter n'est concerné :
        ce consentement est dédié aux alertes d'offre et ne vaut acceptance ni des CGU ni d'aucune
        communication commerciale. Votre adresse n'est ni publiée, ni vendue, ni transmise à des tiers à des
        fins commerciales.
      </p>
      <p>
        La base légale de ce traitement est votre consentement (case à cocher décochée par défaut, vérifiée
        avant tout enregistrement). Chaque e-mail d'alerte contient un lien « Se désabonner de cette alerte »
        qui désactive immédiatement l'alerte concernée, sans contact préalable nécessaire. Vous pouvez aussi
        exercer vos droits (accès, rectification, effacement) en écrivant à
        <a href="mailto:parrainage@parrainio.fr">parrainage@parrainio.fr</a>.
      </p>

      <h2>Finalités du traitement</h2>
      <p>
        Les données du formulaire sont traitées dans le seul but de traiter votre demande de reverse : vérifier
        le parrainage concerné, vous répondre et, le cas échéant, organiser le versement d'un reversement
        lorsque les conditions de l'offre sont remplies.
      </p>
      <p>
        Les adresses des alertes sont traitées dans l'unique but d'envoyer des e-mails lorsqu'une offre
        surveillée évolue de manière significative (primes, reverse Parrainio, conditions importantes, code ou
        lien de parrainage). Aucune autre utilisation n'en est faite.
      </p>
      <p>
        Ces données sont nécessaires au traitement de la demande formulée par l'utilisateur et à l'exécution
        du reversement lorsque celui-ci est dû. Aucune donnée n'est utilisée à d'autres fins.
      </p>

      <h2>Transmission et stockage</h2>
      <p>
        Les données du formulaire de reverse sont transmises par e-mail (via un serveur SMTP) à l'adresse
        <a href="mailto:parrainage@parrainio.fr">parrainage@parrainio.fr</a>. Elles ne sont actuellement
        pas enregistrées dans une base de données. Aucune donnée n'est vendue ni transmise à des tiers à
        des fins commerciales.
      </p>
      <p>
        Les adresses des alertes sont enregistrées dans le stockage en ligne du site, chez l'hébergeur
        Vercel Inc. (voir Mentions légales), et les e-mails d'alerte et de confirmation sont envoyés via le
        serveur SMTP configuré par l'éditeur. Aucune donnée d'alerte n'est partagée avec un partenaire ou un
        annonceur.
      </p>

      <h2>Durée de conservation</h2>
      <p>
        Les données nécessaires au traitement d'une demande de reversement sont conservées pendant la durée
        nécessaire à son traitement. Après réalisation du paiement, les coordonnées de paiement ainsi que les
        échanges et documents contenant les données personnelles de la demande sont supprimés, sous réserve
        des données dont la conservation serait imposée par une obligation légale, notamment comptable, ou
        nécessaire à la preuve d'une opération.
      </p>
      <p>
        Une alerte e-mail est conservée jusqu'au désabonnement (lien « Se désabonner de cette alerte »
        présent dans chaque e-mail). Après désabonnement, l'adresse n'est plus utilisée pour aucun envoi.
        Vous pouvez demander la suppression définitive de votre adresse en écrivant à
        <a href="mailto:parrainage@parrainio.fr">parrainage@parrainio.fr</a>.
      </p>
      <p>
        Aucune durée arbitraire n'est fixée : la suppression intervient après le traitement et la réalisation
        du paiement, sans conservation des coordonnées bancaires ou PayPal au-delà de ce qui est strictement
        nécessaire.
      </p>

      <h2 id="cookies-traceurs">Cookies et traceurs</h2>
      <p>
        À la date du 29 octobre 2026, Parrainio n&apos;utilise aucun outil de mesure d&apos;audience,
        de publicité ou de suivi de navigation. Aucun traceur optionnel actif de ces catégories n&apos;a été
        identifié dans le code du site. Cette observation porte sur les fonctionnalités et scripts visibles
        dans le code audité; elle ne constitue pas une garantie sur les services externes.
      </p>
      <p>
        Lors de la première visite, une bannière propose « Accepter », « Refuser » et « Personnaliser /
        en savoir plus ». Les deux premiers choix sont mémorisés avec la même durée. « Personnaliser / en
        savoir plus » ouvre les détails des éléments utilisés; aucun réglage par catégorie n&apos;est proposé
        actuellement, car aucun traceur optionnel n&apos;a été identifié. Accepter ou refuser n&apos;active donc
        aujourd&apos;hui aucun traceur optionnel.
      </p>
      <p>
        Le cookie <code>parrainio_admin</code> est utilisé uniquement pour l&apos;authentification de l&apos;espace
        d&apos;administration. Il est limité au chemin <code>/admin</code>, a une durée de huit heures et n&apos;est
        pas déposé lors d&apos;une simple visite publique. Il est nécessaire au fonctionnement de cet espace.
      </p>
      <p>
        La fonctionnalité « Mes favoris » enregistre les identifiants des offres ajoutées en favoris
        uniquement dans le stockage local de votre navigateur (localStorage), sans compte et sans
        transmission à Parrainio. Votre navigateur les lit pour afficher les favoris; ils restent sur votre
        appareil et ne sont pas envoyés aux serveurs Parrainio. Vous pouvez les supprimer à tout moment en
        retirant les offres de vos favoris ou en vidant les données de votre navigateur. Parrainio ne
        configure pas de durée d&apos;expiration pour ces données.
      </p>
      <p>
        Votre choix (acceptation ou refus) est mémorisé sous la clé <code>parrainio_cookie_consent</code>
        dans le stockage local du navigateur pour une durée exacte de 180 jours, que vous acceptiez ou
        refusiez; cette mémorisation ne crée pas de cookie. Le lien permanent « Gérer mes cookies » dans le
        pied de page permet de modifier ce choix ou de retirer l&apos;acceptation, ce qui enregistre alors un
        refus. Après 180 jours, un nouveau choix est demandé. Le navigateur ou l&apos;utilisateur peut
        également effacer ce stockage avant cette échéance.
      </p>
      <p>
        Les polices de caractères sont chargées depuis Google Fonts. Ce chargement entraîne une requête
        de feuille de style vers <code>fonts.googleapis.com</code>; cette feuille référence les fichiers de
        police servis par <code>fonts.gstatic.com</code>. Il s&apos;agit d&apos;un chargement de ressources externe,
        et non d&apos;un cookie ajouté par le code de Parrainio. Le navigateur transmet au service externe les
        informations techniques nécessaires à la requête, dont l&apos;adresse IP. L&apos;inspection du code ne
        permet pas de déterminer si Google dépose ou lit des cookies dans ce contexte, ni les durées
        éventuelles de conservation de ces données par le fournisseur.
      </p>

      <h2>Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez de droits d'accès, de rectification, d'effacement, de
        limitation, d'opposition et de portabilité sur vos données personnelles. Vous pouvez les exercer en
        écrivant à : <a href="mailto:parrainage@parrainio.fr">parrainage@parrainio.fr</a>.
      </p>
      <p>
        Vous pouvez également introduire une réclamation auprès de la Commission nationale de
        l'informatique et des libertés (CNIL), 3 place de Fontenoy, 75007 Paris, France.
      </p>

      <h2>Sécurité</h2>
      <p>
        Les données reçues via le formulaire ne sont accessibles qu'aux personnes chargées du traitement
        des demandes de reverse chez Parrainio.
      </p>
    </LegalPage>
  );
}