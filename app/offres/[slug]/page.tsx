import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getOfferReferralUrl,
  getFeaturedOffers,
} from "@/data/offers";
import { getManagedOffer, getManagedOffers } from "@/data/managedOffers";
import { getRelatedOffers } from "@/lib/relatedOffers";
import { hasMeaningfulConditions } from "@/lib/offerCompleteness";
import { getFeaturedOfferSlugsServer } from "@/lib/featuredOffersServer";
import CopyCodeButton from "@/components/CopyCodeButton";
import OfferLogo from "@/components/OfferLogo";
import ReferralRequestForm from "@/components/ReferralRequestForm";
import PublicHeader from "@/components/PublicHeader";
import OfferRewards from "@/components/OfferRewards";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const offer = getManagedOffer(slug);

  if (!offer) {
    return {
      title: "Offre introuvable - Parrainio",
      description: "Cette offre de parrainage n'existe pas sur Parrainio.",
    };
  }

  const reward = offer.partnerReward;
  const categoryName = offer.categoryGroup;

  return {
    title: `${offer.name} - ${reward} de parrainage | Parrainio`,
    description: `Profitez de l'offre de parrainage ${offer.name} et recevez ${reward}. Découvrez les conditions et bénéficiez d'un éventuel reversement Parrainio dans la catégorie ${categoryName}.`,
    openGraph: {
      title: `${offer.name} - ${reward} de parrainage`,
      description: `Offre de parrainage ${offer.name} : ${reward}. Conditions et reversement Parrainio.`,
      type: "website",
    },
  };
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="17" viewBox="0 0 24 24" width="17">
      <path d="m5 12 4.2 4.2L19 6.5" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export default async function OfferPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offer = getManagedOffer(slug);

  if (!offer) {
    notFound();
  }

  const referralUrl = getOfferReferralUrl(offer);
  const detailedConditions = hasMeaningfulConditions(offer.conditions)
    ? offer.conditions.filter((condition) => condition.trim())
    : [];
  const relatedOffers = getRelatedOffers(offer, getManagedOffers(), 3);
  const featuredOfferSlugs = getFeaturedOfferSlugsServer();
  const featuredOffers = getFeaturedOffers(featuredOfferSlugs);

  return (
    <main className={styles.page}>
      <PublicHeader />

      <section className={styles.offerSection}>
        <div className={styles.container}>
          <div className={styles.compactLayout}>
            {/* Left: Main offer information */}
            <div className={styles.mainContent}>
              <div className={styles.offerHeader}>
                <div className={styles.brandRow}>
                  <OfferLogo
                    color={offer.color}
                    logo={offer.logo}
                    logoLetter={offer.logoLetter}
                    name={offer.name}
                    size={48}
                  />
                  <div className={styles.brandInfo}>
                    <span className={styles.overline}>Offre partenaire</span>
                    <h1>{offer.name}</h1>
                    {offer.officialWebsiteUrl && (
                      <a
                        href={offer.officialWebsiteUrl}
                        className={styles.officialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GlobeIcon />
                        Accéder au site internet →
                      </a>
                    )}
                  </div>
                </div>
                <span className={styles.categoryPill}>{offer.categoryGroup}</span>
              </div>

              <p className={styles.description}>{offer.description}</p>

              {/* Compact "Comment en profiter" */}
              <div className={styles.compactSteps}>
                <span className={styles.stepsLabel}>COMMENT EN PROFITER ?</span>
                <div className={styles.stepsRow}>
                  <div className={styles.compactStep}>
                    <span className={styles.stepNumber}>01</span>
                    <div className={styles.stepContent}>
                      <strong>Accédez au site</strong>
                      <small>Utilisez le lien indiqué ou le site partenaire.</small>
                    </div>
                  </div>
                  <div className={styles.compactStep}>
                    <span className={styles.stepNumber}>02</span>
                    <div className={styles.stepContent}>
                      <strong>Finalisez votre inscription</strong>
                      <small>Utilisez le code si nécessaire, ou le lien.</small>
                    </div>
                  </div>
                  <div className={styles.compactStep}>
                    <span className={styles.stepNumber}>03</span>
                    <div className={styles.stepContent}>
                      <strong>Confirmez votre parrainage</strong>
                      <small>Prévenez Parrainio après confirmation pour le reversement.</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conditions */}
              {detailedConditions.length > 0 && (
                <div className={styles.conditionsBlock}>
                  <h2>Conditions à respecter</h2>
                  <ul>
                    {detailedConditions.map((condition, index) => (
                      <li key={`${offer.slug}-condition-${index}`}>
                        <CheckIcon />
                        <span>{condition}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related offers */}
              {relatedOffers.length > 0 && (
                <div className={styles.relatedBlock}>
                  <h2>Dans la même catégorie</h2>
                  <div className={styles.relatedList}>
                    {relatedOffers.map((relatedOffer) => (
                      <Link
                        href={`/offres/${relatedOffer.slug}`}
                        className={styles.relatedItem}
                        key={relatedOffer.slug}
                      >
                        <OfferLogo
                          color={relatedOffer.color}
                          logo={relatedOffer.logo}
                          logoLetter={relatedOffer.logoLetter}
                          name={relatedOffer.name}
                          size={32}
                        />
                        <div className={styles.relatedInfo}>
                          <strong>{relatedOffer.name}</strong>
                          <small>{relatedOffer.partnerReward}</small>
                        </div>
                        <span className={styles.relatedArrow}>→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Referral/action card */}
            <div className={styles.actionSidebar}>
              <div className={styles.actionCard}>
                <div className={styles.rewardsSection}>
                  <OfferRewards offer={offer} />
                </div>

                <div className={styles.referralSection}>
                  {offer.referralCode ? (
                    <div className={styles.codeRow}>
                      <div>
                        <span>Code de parrainage</span>
                        <strong>{offer.referralCode}</strong>
                      </div>
                      <CopyCodeButton code={offer.referralCode} />
                    </div>
                  ) : null}

                  {referralUrl ? (
                    <a
                      className={styles.primaryButton}
                      href={referralUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      🚀 Je commence le parrainage <ArrowIcon />
                    </a>
                  ) : null}

                  {!offer.referralCode && !referralUrl ? (
                    <ReferralRequestForm offerName={offer.name} />
                  ) : null}
                </div>

                {/* Featured offers in sidebar */}
                {featuredOffers.length > 0 && (
                  <div className={styles.sidebarFeatured}>
                    <span className={styles.sidebarFeaturedLabel}>🔥 Offres boostées</span>
                    <div className={styles.sidebarFeaturedList}>
                      {featuredOffers.map((featuredOffer) => (
                        <Link
                          href={`/offres/${featuredOffer.slug}`}
                          className={styles.sidebarFeaturedItem}
                          key={featuredOffer.slug}
                        >
                          <span style={{ backgroundColor: featuredOffer.color }} className={styles.miniLogo}>
                            {featuredOffer.logoLetter}
                          </span>
                          <span>{featuredOffer.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
