import Link from "next/link";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { OG_IMAGE } from "@/lib/ogImage";
import PublicHeader from "@/components/PublicHeader";
import SiteFooter from "@/components/SiteFooter";
import ReviewForm from "./ReviewForm";
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

function formatReviewDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return day && month && year ? `${day}/${month}/${year}` : isoDate;
}

export default function AvisClientsPage() {
  const reviews = getApprovedReviews();
  const stats = getReviewsStats();
  const offerOptions = getManagedOffers().map((offer) => ({ slug: offer.slug, name: offer.name }));

  return (
    <main className={styles.page}>
      <PublicHeader active="reviews" />

      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.kicker}>Avis clients</p>
          <h1>Les avis de la communauté Parrainio</h1>
          <p className={styles.lead}>
            Des témoignages de personnes qui ont réalisé un parrainage via Parrainio ou échangé
            avec un parrain de la communauté. Déjà de nombreux utilisateurs partagent leur
            expérience avec Parrainio.
          </p>
          <div className={styles.heroRow}>
            <div className={styles.stats}>
              <span className={styles.statsAverage}>
                {stats.average}
                <small>/10</small>
              </span>
              <span className={styles.statsLabel}>
                {stats.count > 0
                  ? `Note moyenne · ${stats.count} avis publiés`
                  : "Aucun avis publié pour le moment"}
              </span>
            </div>
            <a href="#laisser-un-avis" className={styles.ctaButton}>
              Laisser un avis
            </a>
          </div>
        </div>
      </section>

      <section className={styles.reviewsSection} aria-label="Avis publiés">
        <div className={styles.container}>
          {reviews.length === 0 ? (
            <p className={styles.empty}>Aucun avis publié pour le moment. Soyez le premier à partager votre expérience.</p>
          ) : (
            <div className={styles.grid}>
              {reviews.map((review) => {
                const offer = review.offerSlug ? getManagedOffer(review.offerSlug) : undefined;
                return (
                  <article className={styles.card} key={review.id}>
                    <div className={styles.cardHead}>
                      <span className={styles.avatar} aria-hidden="true">{review.pseudo.slice(0, 1).toUpperCase()}</span>
                      <div className={styles.cardIdentity}>
                        <strong>{review.pseudo}</strong>
                        <span className={styles.stars} aria-label={`Note : ${review.rating} sur 10`}>
                          <span aria-hidden="true">★★★★★</span>
                          <span className={styles.starsNote}>{review.rating}/10</span>
                        </span>
                      </div>
                      <time className={styles.date} dateTime={review.date}>Avis publié le {formatReviewDate(review.date)}</time>
                    </div>
                    <p className={styles.cardText}>{review.text}</p>
                    {offer ? (
                      <p className={styles.cardOffer}>
                        Offre concernée : <Link href={`/offres/${offer.slug}`}>{offer.name}</Link>
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </div>
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
