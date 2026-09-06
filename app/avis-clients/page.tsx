import Link from "next/link";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { OG_IMAGE } from "@/lib/ogImage";
import PublicHeader from "@/components/PublicHeader";
import SiteFooter from "@/components/SiteFooter";
import ReviewForm from "./ReviewForm";
import ReviewList, { type ListReview } from "@/components/avis/ReviewList";
import { getApprovedReviews, getReviewsStats } from "@/lib/reviews";
import { getManagedOffer, getManagedOffers } from "@/data/managedOffers";

export const metadata: Metadata = {
  title: "Avis clients Parrainio : les retours de la communauté | Parrainio",
  description:
    "Les avis des utilisateurs de Parrainio : fiabilité des parrains, réactivité des reversements et expérience réelle du parrainage. Partagez votre avis en quelques minutes.",
  alternates: { canonical: "https://www.parrainio.fr/avis-clients" },
  openGraph: { url: "/avis-clients", type: "website", siteName: "Parrainio", locale: "fr_FR", images: [OG_IMAGE] },
};

const PROHIBITED_CONTENT = [
  "les insultes et propos haineux ;",
  "les contenus diffamatoires ;",
  "le spam et la publicité ;",
  "les informations personnelles concernant une autre personne ;",
  "les contenus frauduleux ou trompeurs ;",
  "les contenus sans rapport avec l’expérience Parrainio.",
];

export default function AvisClientsPage() {
  const reviews = getApprovedReviews();
  const stats = getReviewsStats();
  const offerOptions = getManagedOffers().map((offer) => ({ slug: offer.slug, name: offer.name }));

  const listReviews: ListReview[] = reviews.map((review) => {
    const offer = review.offerSlug ? getManagedOffer(review.offerSlug) : undefined;
    return {
      id: review.id,
      pseudo: review.pseudo,
      rating: review.rating,
      date: review.date,
      text: review.text,
      offerName: offer?.name ?? null,
      offerSlug: offer?.slug ?? null,
    };
  });

  return (
    <main className={styles.page}>
      <PublicHeader active="reviews" />

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroRating}>
              <p className={styles.kicker}>Avis clients</p>
              <h1>Les avis de la communauté Parrainio</h1>
              <div className={styles.ratingBlock}>
                <p className={styles.ratingValue}>
                  {stats.average}
                  <small>/10</small>
                </p>
                <p className={styles.ratingStars} aria-hidden="true">★★★★★</p>
                <p className={styles.ratingCaption}>Note moyenne</p>
                {stats.count > 0 && (
                  <p className={styles.ratingCount}>
                    {stats.count} avis publié{stats.count > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
            <div className={styles.heroActionCard}>
              <h2>Partagez votre expérience</h2>
              <p>
                Votre retour aide les autres utilisateurs à identifier des parrains fiables.
                Seul votre pseudo apparaît publiquement.
              </p>
              <a href="#laisser-un-avis" className={styles.ctaButton}>
                Laisser un avis →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.reviewsSection} aria-label="Avis publiés">
        <div className={styles.container}>
          {reviews.length === 0 ? (
            <p className={styles.empty}>Aucun avis publié pour le moment. Soyez le premier à partager votre expérience.</p>
          ) : (
            <ReviewList reviews={listReviews} />
          )}
        </div>
      </section>

      <section className={styles.rulesSection} id="regles-de-publication">
        <div className={styles.container}>
          <details className={styles.rules}>
            <summary>Règles de publication</summary>
            <div>
              <p>
                Les avis publiés sur Parrainio doivent porter sur votre expérience de parrainage ou
                d’échange avec la communauté. Ne sont notamment pas admis :
              </p>
              <ul>
                {PROHIBITED_CONTENT.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
              <p>
                Les avis contraires à ces règles peuvent être refusés ou retirés de la publication.
              </p>
            </div>
          </details>
        </div>
      </section>

      <section className={styles.formSection} id="laisser-un-avis">
        <div className={styles.container}>
          <p className={styles.kicker}>Partager votre expérience</p>
          <h2>Laisser un avis</h2>
          <p className={styles.formLead}>
            Votre retour aide les autres utilisateurs à identifier des parrains fiables. Aucune
            information personnelle n’est requise : seul votre pseudo apparaît publiquement.
          </p>
          <ReviewForm offers={offerOptions} />
          <p className={styles.legalNotice}>
            Votre pseudo, votre note, votre avis et sa date de publication pourront être affichés
            publiquement sur Parrainio. Les avis peuvent être modérés avant publication. Parrainio
            peut retirer un avis qui ne respecte pas les règles de publication. Vous disposez de
            droits sur vos données personnelles (accès, rectification, suppression) :{" "}
            <a href="mailto:parrainage@parrainio.fr">parrainage@parrainio.fr</a>. Voir la{" "}
            <Link href="/confidentialite">politique de confidentialité</Link> et les{" "}
            <Link href="/cgu">CGU</Link>.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
