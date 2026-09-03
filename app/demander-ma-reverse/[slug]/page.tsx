import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getManagedOffer } from "@/data/managedOffers";
import { SITE_URL } from "@/lib/siteUrl";
import PublicHeader from "@/components/PublicHeader";
import ReverseRequestForm from "./ReverseRequestForm";
import styles from "./page.module.css";

type ReverseRequestPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ReverseRequestPageProps): Promise<Metadata> {
  const { slug } = await params;
  const offer = getManagedOffer(slug);

  // Page fonctionnelle de demande de reverse : jamais une page SEO.
  // noindex + canonical vers la page offre correspondante (pas vers l'accueil).
  return {
    title: "Demander ma reverse | Parrainio",
    description:
      "Formulaire de demande de reversement Parrainio après un parrainage finalisé chez le partenaire.",
    robots: { index: false, follow: true },
    alternates: {
      canonical: offer ? `${SITE_URL}/offres/${offer.slug}` : `${SITE_URL}/offres`,
    },
  };
}

export default async function ReverseRequestPage({ params }: ReverseRequestPageProps) {
  const { slug } = await params;
  const offer = getManagedOffer(slug);

  if (!offer) notFound();

  return (
    <main className={styles.page}>
      <PublicHeader />
      <section className={styles.wrapper}>
        <div className={styles.card}>
          <ReverseRequestForm offerSlug={offer.slug} offerName={offer.name} />
        </div>
      </section>
      <Link href={`/offres/${offer.slug}`} className={styles.notice}>Retour à l’offre</Link>
    </main>
  );
}
