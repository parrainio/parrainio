import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { OG_IMAGE } from "@/lib/ogImage";

export const metadata: Metadata = {
  title: "Mentions légales | Parrainio",
  description:
    "Informations légales du site Parrainio : éditeur, directeur de la publication, contact et hébergeur.",
  alternates: { canonical: "https://www.parrainio.fr/mentions-legales" },
  openGraph: { url: "/mentions-legales", type: "website", siteName: "Parrainio", locale: "fr_FR", images: [OG_IMAGE] },
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      kicker="Informations légales"
      title="Mentions légales"
      intro="Les informations d'identification du site Parrainio, de son éditeur et de son hébergeur, conformément à la loi pour la confiance dans l'économie numérique (LCEN)."
    >
      <h2>Éditeur du site</h2>
      <p>
        Le site <strong>Parrainio</strong> est édité par <strong>MORIN Mathieu</strong>, éditeur particulier
        (personne physique), domicilié au 131 rue de Bretagne, 45200 Amilly, France.
      </p>
      <p>
        Parrainio est un site personnel d'information et de présentation d'offres de parrainage. Aucune
        société n'est associée à cette édition ; aucun SIREN ni SIRET ne s'applique.
      </p>

      <h2>Directeur de la publication</h2>
      <p>
        Directeur de la publication : <strong>MORIN Mathieu</strong>.
      </p>

      <h2>Contact</h2>
      <p>
        Email de contact légal : <a href="mailto:parrainage@parrainio.fr">parrainage@parrainio.fr</a>
      </p>

      <h2>Le site</h2>
      <ul>
        <li>Nom du site : Parrainio</li>
        <li>Domaine : <a href="https://www.parrainio.fr">https://www.parrainio.fr</a></li>
        <li>Activité : présentation d'offres de parrainage proposées par des partenaires tiers</li>
      </ul>

      <h2>Hébergeur</h2>
      <ul>
        <li>Vercel Inc.</li>
        <li>340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</li>
        <li>Site : <a href="https://vercel.com">https://vercel.com</a></li>
      </ul>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les contenus édités par Parrainio (textes, structure et présentation du site) sont protégés par le
        droit d'auteur. Les marques, logos et dénominations des partenaires cités sur le site restent la
        propriété de leurs titulaires respectifs.
      </p>
      <p>© 2026 Parrainio. Tous droits réservés.</p>
    </LegalPage>
  );
}