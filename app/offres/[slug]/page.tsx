import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getOfferReferralUrl,
  getFeaturedOffers,
} from "@/data/offers";
import { getManagedOffer, getManagedOffers } from "@/data/managedOffers";
import { OG_IMAGE } from "@/lib/ogImage";
import { offerSeoProfiles } from "@/data/offer-seo";
import { lot02Profiles } from "@/data/offer-seo-batch2";
import { lot05Profiles } from "@/data/offer-seo-batch3";
import { lot06Profiles } from "@/data/offer-seo-batch4";
import { lot07Profiles } from "@/data/offer-seo-batch5";
import { lot08Profiles } from "@/data/offer-seo-batch6";
import { lot09Profiles } from "@/data/offer-seo-batch7";
import { lot10Profiles } from "@/data/offer-seo-batch8";
import { lot11Profiles } from "@/data/offer-seo-batch9";
import { lot12Profiles } from "@/data/offer-seo-batch10";
import { lot13Profiles } from "@/data/offer-seo-batch11";
import { lot14Profiles } from "@/data/offer-seo-batch12";
import { lot15Profiles } from "@/data/offer-seo-batch13";
import { getRelatedOffers } from "@/lib/relatedOffers";
import { getCategoryHubForGroup } from "@/lib/categoryHubs";
import { hasMeaningfulConditions } from "@/lib/offerCompleteness";
import { getFeaturedOfferSlugsServer } from "@/lib/featuredOffersServer";
import CopyTextButton from "@/components/CopyTextButton";
import OfferLogo from "@/components/OfferLogo";
import ReferralRequestForm from "@/components/ReferralRequestForm";
import PublicHeader from "@/components/PublicHeader";
import OfferRewards from "@/components/OfferRewards";
import ParrainioReverseRequest from "@/components/ParrainioReverseRequest";
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

  const profile = lot15Profiles[slug] ?? lot14Profiles[slug] ?? lot13Profiles[slug] ?? lot12Profiles[slug] ?? lot11Profiles[slug] ?? lot10Profiles[slug] ?? lot09Profiles[slug] ?? lot08Profiles[slug] ?? lot07Profiles[slug] ?? lot06Profiles[slug] ?? lot05Profiles[slug] ?? lot02Profiles[slug] ?? offerSeoProfiles[slug];
  const reward = offer.partnerReward;
  const categoryName = offer.categoryGroup;

  return {
    title: profile?.seoTitle ?? `${offer.name} - ${reward} de parrainage | Parrainio`,
    description: profile?.metaDescription ?? `Profitez de l'offre de parrainage ${offer.name} et recevez ${reward}. Découvrez les conditions et bénéficiez d'un éventuel reversement Parrainio dans la catégorie ${categoryName}.`,
    alternates: { canonical: `/offres/${slug}` },
    openGraph: {
      title: profile?.seoTitle ?? `${offer.name} - ${reward} de parrainage`,
      description: profile?.metaDescription ?? `Offre de parrainage ${offer.name} : ${reward}. Conditions et reversement Parrainio.`,
      url: `/offres/${slug}`,
      type: "website",
      siteName: "Parrainio",
      locale: "fr_FR",
      images: [OG_IMAGE],
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
  const categoryHub = getCategoryHubForGroup(offer.categoryGroup);
  const featuredOfferSlugs = getFeaturedOfferSlugsServer();
  const featuredOffers = getFeaturedOffers(featuredOfferSlugs);
  const seoProfile = lot15Profiles[offer.slug] ?? lot14Profiles[offer.slug] ?? lot13Profiles[offer.slug] ?? lot12Profiles[offer.slug] ?? lot11Profiles[offer.slug] ?? lot10Profiles[offer.slug] ?? lot09Profiles[offer.slug] ?? lot08Profiles[offer.slug] ?? lot07Profiles[offer.slug] ?? lot06Profiles[offer.slug] ?? lot05Profiles[offer.slug] ?? lot02Profiles[offer.slug] ?? offerSeoProfiles[offer.slug];

  return (
    <main className={styles.page}>
      <PublicHeader />

      <section className={styles.offerSection}>
        <div className={styles.container}>
          <div className={styles.compactLayout}>
            {/* Left: Main offer information */}
            <div className={styles.mainContent}>
              <div className={`${styles.offerHeader} ${seoProfile ? styles.offerHeaderWithActions : ""}`}>
                {seoProfile && <div className={styles.offerIdentity}>
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
                    <h1>{seoProfile?.h1 ?? `${offer.name} : parrainage, conditions et récompense`}</h1>
                    {offer.officialWebsiteUrl && (
                      <a
                        href={referralUrl ?? offer.officialWebsiteUrl}
                        className={styles.officialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GlobeIcon />
                        Accéder au site officiel →
                      </a>
                    )}
                  </div>
                </div>
                <span className={styles.categoryPill}>{offer.categoryGroup}</span>
                </div>}
                {seoProfile && <div className={styles.headerActionSummary}>
                  <span className={styles.stepsLabel}>COMMENT EN PROFITER ?</span>
                  <ol className={styles.headerSteps}>
                    <li><b>01</b><span><strong>CLIQUEZ</strong>Utilisez notre lien ou code de parrainage.</span></li>
                    <li><b>02</b><span><strong>INSCRIVEZ-VOUS</strong>Renseignez le code si nécessaire.</span></li>
                    <li><b>03</b><span><strong>VALIDEZ</strong>Réalisez les conditions de l'offre.</span></li>
                    <li><b>04</b><span><strong>DEMANDEZ VOTRE REVERSE</strong></span></li>
                  </ol>
                </div>}
              </div>

              <div className={styles.mobileActionSlot}>
                <div className={styles.actionCard}>
                  <div className={styles.rewardsSection}>
                    <OfferRewards offer={offer} />
                  </div>
                  <div className={styles.referralSection}>
                    {referralUrl ? <div className={styles.referralValue}><span>Votre lien de parrainage</span><div className={styles.referralValueRow}><a href={referralUrl} target="_blank" rel="noreferrer">{referralUrl}</a><CopyTextButton value={referralUrl} label="Copier le lien" copiedLabel="Lien copié ✓" /></div></div> : null}
                    {!referralUrl && offer.referralCode && offer.officialWebsiteUrl ? (
                      <div className={styles.codeActionsRow}>
                        <div className={styles.codeRow}>
                          <div><span>Votre code de parrainage</span><strong>{offer.referralCode}</strong></div>
                          <div className={styles.codeActionColumn}>
                            <CopyTextButton value={offer.referralCode} label="Copier le code" copiedLabel="Code copié ✓" />
                            <a className={styles.officialReferralLink} href={offer.officialWebsiteUrl} rel="noreferrer" target="_blank">Accéder au site</a>
                          </div>
                        </div>
                      </div>
                    ) : offer.referralCode ? (
                      <div className={styles.codeRow}>
                        <div><span>Votre code de parrainage</span><strong>{offer.referralCode}</strong></div>
                        <CopyTextButton value={offer.referralCode} label="Copier le code" copiedLabel="Code copié ✓" />
                      </div>
                    ) : null}
                    {referralUrl ? <a className={styles.primaryButton} href={referralUrl} rel="noreferrer" target="_blank">En profiter → <ArrowIcon /></a> : null}
                    {!offer.referralCode && !referralUrl ? <ReferralRequestForm offerName={offer.name} /> : null}
                  </div>
                  <ParrainioReverseRequest offerSlug={offer.slug} />
                </div>
              </div>

              {seoProfile && (
                <section className={styles.seoContent} aria-label={`Informations sur ${offer.name}`}>
                  {seoProfile.conditions && (
                    <section className={styles.seoEssential} aria-labelledby={`${offer.slug}-essential`}>
                      <h2 id={`${offer.slug}-essential`}>Conditions essentielles</h2>
                      <ul className={styles.seoList}>{seoProfile.conditions.slice(0, 6).map((item) => <li key={item}>{item}</li>)}</ul>
                    </section>
                  )}
                  <section className={styles.seoDetails} aria-labelledby={`${offer.slug}-details`}>
                    <h2 id={`${offer.slug}-details`}>EN DÉTAIL</h2>
                    <p className={styles.seoDetailsSubtitle}>Tout savoir avant de s'inscrire</p>
                    <p className={styles.seoDetailsIntro}>Informations détaillées sur l'offre</p>
                    <div className={styles.seoGroup}>
                    <span className={styles.seoGroupLabel}>POUR COMPRENDRE L'OFFRE</span>
                    {[
                      seoProfile.whyChoose,
                      seoProfile.audience ? { heading: `À qui s'adresse ${offer.name} ?`, paragraphs: [seoProfile.audience] } : undefined,
                      { heading: `Comment fonctionne le parrainage ${offer.name} ?`, paragraphs: [seoProfile.referralExplanation] },
                      seoProfile.conditions ? { heading: "Conditions du parrainage", paragraphs: [seoProfile.conditions.join(" ")] } : undefined,
                    ].filter((section): section is { heading: string; paragraphs: string[] } => Boolean(section)).map((section) => (
                      <details className={styles.seoAccordion} key={section.heading}>
                        <summary>{section.heading}</summary>
                        {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                      </details>
                    ))}
                  </div>
                  <div className={styles.seoGroup}>
                    <span className={styles.seoGroupLabel}>INFOS PRATIQUES</span>
                    {[
                      seoProfile.earnings ? { heading: "Combien peut-on gagner ?", paragraphs: [seoProfile.earnings] } : undefined,
                      seoProfile.rewardTiming ? { heading: "Quand reçoit-on la récompense ?", paragraphs: [seoProfile.rewardTiming] } : undefined,
                    ].filter((section): section is { heading: string; paragraphs: string[] } => Boolean(section)).map((section) => (
                      <details className={styles.seoAccordion} key={section.heading}>
                        <summary>{section.heading}</summary>
                        {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                      </details>
                    ))}
                    {seoProfile.practicalInformation && <details className={styles.seoAccordion}><summary>À savoir avant de s'inscrire</summary><ul className={styles.seoList}>{seoProfile.practicalInformation.map((item) => <li key={item}>{item}</li>)}</ul></details>}
                    <details className={styles.seoAccordion}><summary>Qu'est-ce que {offer.name} ?</summary><p>{seoProfile.whyChoose?.paragraphs[0] ?? seoProfile.introduction}</p></details>
                    {seoProfile.faq && seoProfile.faq.length > 0 && <details className={styles.seoAccordion}><summary>Questions fréquentes</summary><div className={styles.seoFaq}>{seoProfile.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></details>}
                    </div>
                  </section>
                  {seoProfile.internalLinks && seoProfile.internalLinks.length > 0 && <nav className={styles.seoLinks} aria-label="Offres similaires"><span>Vous pourriez aussi être intéressé par</span>{seoProfile.internalLinks.map((link) => <Link key={link.slug} href={`/offres/${link.slug}`}>{link.label}</Link>)}</nav>}
                  <p className={styles.seoDate}>Informations vérifiées le {new Date(seoProfile.researchedAt).toLocaleDateString("fr-FR")}</p>
                </section>
              )}

              {/* Related offers */}
              {relatedOffers.length > 0 && (
                <div className={styles.relatedBlock}>
                  <div className={styles.relatedHead}>
                    <h2>Dans la même catégorie</h2>
                    {categoryHub && (
                      <Link
                        href={`/categories/${categoryHub.slug}`}
                        className={styles.hubLink}
                      >
                        Voir les offres {offer.categoryGroup}
                        <ArrowIcon />
                      </Link>
                    )}
                  </div>
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
                <div className={styles.desktopActionContent}>
                <div className={styles.rewardsSection}>
                  <OfferRewards offer={offer} />
                </div><div className={styles.referralSection}>
                    {referralUrl ? <div className={styles.referralValue}><span>Votre lien de parrainage</span><div className={styles.referralValueRow}><a href={referralUrl} target="_blank" rel="noreferrer">{referralUrl}</a><CopyTextButton value={referralUrl} label="Copier le lien" copiedLabel="Lien copié ✓" /></div></div> : null}
                    {!referralUrl && offer.referralCode && offer.officialWebsiteUrl ? (
                    <div className={styles.codeActionsRow}>
                      <div className={styles.codeRow}>
                        <div>
                          <span>Votre code de parrainage</span>
                          <strong>{offer.referralCode}</strong>
                        </div>
                        <div className={styles.codeActionColumn}>
                          <CopyTextButton value={offer.referralCode} label="Copier le code" copiedLabel="Code copié ✓" />
                          <a className={styles.officialReferralLink} href={offer.officialWebsiteUrl} rel="noreferrer" target="_blank">Accéder au site</a>
                        </div>
                      </div>
                    </div>
                  ) : offer.referralCode ? (
                    <div className={styles.codeRow}>
                      <div>
                        <span>Votre code de parrainage</span>
                        <strong>{offer.referralCode}</strong>
                      </div>
                      <CopyTextButton value={offer.referralCode} label="Copier le code" copiedLabel="Code copié ✓" />
                    </div>
                  ) : null}

                  {referralUrl ? (
                    <a
                      className={styles.primaryButton}
                      href={referralUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      En profiter → <ArrowIcon />
                    </a>
                  ) : null}

                  {!offer.referralCode && !referralUrl ? (
                    <ReferralRequestForm offerName={offer.name} />
                  ) : null}
                </div>
                <ParrainioReverseRequest offerSlug={offer.slug} />
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
