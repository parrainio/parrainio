import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { OG_IMAGE } from "@/lib/ogImage";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation | Parrainio",
  description:
    "Conditions générales d'utilisation de Parrainio : fonctionnement du site, commissions perçues, reversements possibles et obligations des utilisateurs.",
  alternates: { canonical: "https://www.parrainio.fr/cgu" },
  openGraph: { url: "/cgu", type: "website", siteName: "Parrainio", locale: "fr_FR", images: [OG_IMAGE] },
};

export default function CguPage() {
  return (
    <LegalPage
      kicker="Conditions générales d'utilisation"
      title="Conditions générales d'utilisation"
      intro="Les présentes conditions générales d'utilisation (CGU) régissent l'accès et l'utilisation du site Parrainio. En utilisant le site, vous les acceptez."
    >
      <h2>1. Objet</h2>
      <p>
        Parrainio est un site qui présente des offres de parrainage proposées par des partenaires tiers.
        Parrainio ne vend pas ces offres et n'est pas le prestataire des partenaires : les offres, primes et
        conditions restent celles du partenaire concerné.
      </p>

      <h2>2. Nature des offres présentées</h2>
      <p>
        Les informations publiées sur les fiches offres sont fournies à titre indicatif et peuvent évoluer.
        Avant de vous engager, vous êtes invité à vérifier les conditions officielles du partenaire.
      </p>
      <p>
        Parrainio n'est ni une banque, ni un organisme financier, ni un assureur, ni un intermédiaire
        d'assurance : il ne fournit pas les produits et services proposés par les partenaires et ne garantit
        ni leur disponibilité, ni leur contenu.
      </p>

      <h2>3. Rémunération de Parrainio</h2>
      <p>
        Parrainio peut percevoir une commission de la part d'un partenaire lorsqu'un utilisateur accède à une
        offre par un lien présenté sur le site et que les conditions du partenaire sont remplies.
      </p>

      <h2>4. Reversement</h2>
      <p>
        Parrainio peut reverser à l'utilisateur une partie de la commission perçue, jusqu'à 25 % de celle-ci,
        lorsque les conditions de l'offre du partenaire sont validées.
      </p>
      <p>
        Le reversement n'est pas une somme garantie à l'avance : son montant n'est pas fixe, sa validation
        dépend notamment du partenaire, et il n'est dû qu'après vérification du parrainage. Aucun montant de
        reversement n'est garanti par Parrainio.
      </p>

      <h2>5. Demande de reverse</h2>
      <p>
        Une demande de reverse peut être effectuée via le formulaire « Demander ma reverse » accessible
        depuis les fiches offres. Parrainio vérifie chaque demande avant tout versement.
      </p>
      <p>
        Le versement peut être refusé lorsque le parrainage n'est pas validé par le partenaire, lorsque les
        conditions de l'offre ne sont pas remplies, ou en cas d'informations inexactes ou de demande
        frauduleuse.
      </p>

      <h2>6. Obligations de l'utilisateur</h2>
      <ul>
        <li>respecter les conditions de l'offre du partenaire ;</li>
        <li>fournir des informations exactes et complètes dans le formulaire de demande de reverse ;</li>
        <li>ne pas utiliser le site à des fins frauduleuses ou abusives ;</li>
        <li>ne pas solliciter, reproduire ou détourner le contenu du site à des fins commerciales sans accord.</li>
      </ul>

      <h2>7. Responsabilité</h2>
      <p>
        Parrainio ne garantit pas la validation d'un parrainage par un partenaire, ni le montant d'un
        éventuel reversement. La responsabilité de Parrainio ne saurait être engagée pour les conséquences
        de l'utilisation des offres des partenaires, ni pour les informations erronées ou incomplètes
        fournies par ces derniers.
      </p>

      <h2>8. Propriété intellectuelle</h2>
      <p>
        Les contenus édités par Parrainio sont protégés par le droit d'auteur. Les marques et logos des
        partenaires cités restent la propriété de leurs titulaires respectifs.
      </p>

      <h2>9. Modification des CGU</h2>
      <p>
        Parrainio peut adapter les présentes CGU à tout moment. La version applicable est celle en vigueur
        sur le site à la date de votre utilisation.
      </p>

      <h2>10. Droit applicable</h2>
      <p>
        Les présentes CGU sont soumises au droit français.
      </p>
    </LegalPage>
  );
}