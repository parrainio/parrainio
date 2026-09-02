import Link from "next/link";
import { notFound } from "next/navigation";
import { getManagedOffer } from "@/data/managedOffers";
import PublicHeader from "@/components/PublicHeader";
import ReverseRequestForm from "./ReverseRequestForm";
import styles from "./page.module.css";

export default async function ReverseRequestPage({ params }: { params: Promise<{ slug: string }> }) {
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
