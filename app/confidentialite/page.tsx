import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { OG_IMAGE } from "@/lib/ogImage";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Parrainio",
  description:
    "Politique de confidentialité de Parrainio : données collectées via le formulaire de demande de reverse, cookies et droits des utilisateurs.",
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
        Parrainio collecte des données uniquement via le formulaire de demande de reverse, présent sur les
        fiches offres :
      </p>
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

      <h2>Finalités du traitement</h2>
      <p>
        Les données du formulaire sont traitées dans le seul but de traiter votre demande de reverse : vérifier
        le parrainage concerné, vous répondre et, le cas échéant, organiser le versement d'un reversement
        lorsque les conditions de l'offre sont remplies.
      </p>
      <p>
        Ces données sont nécessaires au traitement de la demande formulée par l'utilisateur et à l'exécution
        du reversement lorsque celui-ci est dû. Aucune donnée n'est utilisée à d'autres fins.
      </p>

      <h2>Transmission et stockage</h2>
      <p>
        Les données du formulaire sont transmises par e-mail (via un serveur SMTP) à l'adresse
        <a href="mailto:parrainage@parrainio.fr">parrainage@parrainio.fr</a>. Elles ne sont actuellement
        pas enregistrées dans une base de données. Aucune donnée n'est vendue ni transmise à des tiers à
        des fins commerciales.
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
        Aucune durée arbitraire n'est fixée : la suppression intervient après le traitement et la réalisation
        du paiement, sans conservation des coordonnées bancaires ou PayPal au-delà de ce qui est strictement
        nécessaire.
      </p>

      <h2>Cookies et traceurs</h2>
      <p>
        Le site ne dépose actuellement aucun cookie publicitaire et n'utilise aucun outil de mesure
        d'audience (pas de Google Analytics, Google Tag Manager ou outil équivalent), ni aucun traceur de
        tracking public.
      </p>
      <p>
        Le seul cookie utilisé est le cookie de session de l'espace d'administration
        (<code>parrainio_admin</code>), strictement réservé à l'administration du site : il n'est pas
        déposé lors d'une simple visite du site public.
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