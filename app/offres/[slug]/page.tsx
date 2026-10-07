import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getOfferReferralUrl,
  getFeaturedOffers,
  offers,
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
import { SITE_URL } from "@/lib/siteUrl";
import { hasMeaningfulConditions } from "@/lib/offerCompleteness";
import { getFeaturedOfferSlugsServer } from "@/lib/featuredOffersServer";
import { classifyReferralMechanism, getHubLinkAnchor } from "@/lib/referralMechanism";
import CopyTextButton from "@/components/CopyTextButton";
import OfferLogo from "@/components/OfferLogo";
import ReferralRequestForm from "@/components/ReferralRequestForm";
import PublicHeader from "@/components/PublicHeader";
import FavoritesDock from "@/components/FavoritesDock";
import SiteFooter from "@/components/SiteFooter";
import VerificationBadge from "@/components/VerificationBadge";
import OfferChangeAlert from "@/components/OfferChangeAlert";
import FavoriteButton from "@/components/FavoriteButton";
import OfferRewards from "@/components/OfferRewards";
import OfferIllustration from "@/components/OfferIllustration";
import ParrainioReverseRequest from "@/components/ParrainioReverseRequest";
import styles from "./page.module.css";

// ISR : les lecteurs de données de la fiche (overrides KV via fetch tagué
// 60 s, featured-config via le même mécanisme) sont compatibles rendu
// statique — aucun fetch no-store au rendu (le seed admin est confiné aux
// chemins d'écriture). Les écritures admin invalident les tags
// (revalidateTag) et appellent revalidatePath sur les pages concernées.
// TTL aligné sur CACHE_REVALIDATE_SECONDS (lib/adminKv.ts), même contrat
// que /offres.
export const revalidate = 60;

// Prérendu des fiches au build — même liste de slugs que le sitemap. Les
// 117 fiches sont générées puis revalidées par ISR (60 s) ; les écritures
// admin les invalident via revalidatePath(`/offres/${slug}`). Un slug
// inconnu reste résolu à la demande (notFound), sans mise en cache.
export function generateStaticParams() {
  return offers.map((offer) => ({ slug: offer.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const offer = await getManagedOffer(slug);

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
  const offer = await getManagedOffer(slug);

  if (!offer) {
    notFound();
  }

  const referralUrl = getOfferReferralUrl(offer);
  const detailedConditions = hasMeaningfulConditions(offer.conditions)
    ? offer.conditions.filter((condition) => condition.trim())
    : [];
  const relatedOffers = getRelatedOffers(offer, await getManagedOffers(), 3);
  const categoryHub = getCategoryHubForGroup(offer.categoryGroup);
  // Fil d'Ariane (même pattern que hubs/blog/comparatifs) :
  // Accueil → Offres → [Catégorie de l'offre] → [Offre]. La catégorie vient des
  // données de l'offre (categoryGroup) ; le hub fournit l'URL dédiée. Sans hub
  // le maillon catégorie est omis plutôt qu'inventé — le JSON-LD reflète
  // exactement le fil affiché.
  const breadcrumbItems = [
    { name: "Accueil", url: `${SITE_URL}/` },
    { name: "Offres", url: `${SITE_URL}/offres` },
    ...(categoryHub
      ? [{ name: offer.categoryGroup, url: `${SITE_URL}/categories/${categoryHub.slug}` }]
      : []),
    { name: offer.name, url: `${SITE_URL}/offres/${offer.slug}` },
  ];
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
  const featuredOfferSlugs = await getFeaturedOfferSlugsServer();
  const featuredOffers = getFeaturedOffers(featuredOfferSlugs);
  const seoProfile = lot15Profiles[offer.slug] ?? lot14Profiles[offer.slug] ?? lot13Profiles[offer.slug] ?? lot12Profiles[offer.slug] ?? lot11Profiles[offer.slug] ?? lot10Profiles[offer.slug] ?? lot09Profiles[offer.slug] ?? lot08Profiles[offer.slug] ?? lot07Profiles[offer.slug] ?? lot06Profiles[offer.slug] ?? lot05Profiles[offer.slug] ?? lot02Profiles[offer.slug] ?? offerSeoProfiles[offer.slug];
  // FAQPage (JSON-LD) : la MÊME donnée `faq` que le rendu visible ci-dessous
  // (seoProfile.faq) — aucune duplication de texte, aucune réécriture.
  // Garde-fous : sans FAQ valide, aucun nœud FAQPage ; une question ou une
  // réponse vide est exclue plutôt que sérialisée invalide.
  const faqItems = (seoProfile?.faq ?? []).filter(
    (item) => item.question?.trim() && item.answer?.trim(),
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbJsonLd,
      ...(faqItems.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faqItems.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
          ]
        : []),
    ],
  };
  // Maillage contextuel vers le hub des codes (F2-E.3) : l'ancre suit le
  // mécanisme réel de l'offre ; sans code ni invitation dédiée, pas de lien.
  const hubMechanism = classifyReferralMechanism(offer.slug, offer.referralCode);
  const hubAnchor = hubMechanism ? getHubLinkAnchor(hubMechanism) : null;

  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PublicHeader />
      <FavoritesDock />

      <section className={styles.offerSection}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">→</span>
            <Link href="/offres">Offres</Link>
            <span aria-hidden="true">→</span>
            {categoryHub && (
              <>
                <Link href={`/categories/${categoryHub.slug}`}>{offer.categoryGroup}</Link>
                <span aria-hidden="true">→</span>
              </>
            )}
            <strong>{offer.name}</strong>
          </nav>
          <div className={styles.compactLayout}>
            {/* Left: Main offer information */}
            <div className={styles.mainContent}>
              <div className={styles.offerHeader}>
                <div className={styles.offerIdentity}>
                {/* Ligne d'identité compacte : logo + catégorie + vérification,
                    puis actions secondaires (site officiel conditionnel + favoris). */}
                <div className={styles.identityRow}>
                  <OfferLogo
                    color={offer.color}
                    logo={offer.logo}
                    logoLetter={offer.logoLetter}
                    name={offer.name}
                    size={40}
                  />
                  {(referralUrl || offer.officialWebsiteUrl) && (
                    <a
                      href={referralUrl ?? offer.officialWebsiteUrl ?? undefined}
                      className={styles.officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GlobeIcon />
                      Accéder au site web →
                    </a>
                  )}
                  <span className={styles.categoryPill}>{offer.categoryGroup}</span>
                  <VerificationBadge />
                  <FavoriteButton slug={offer.slug} variant="full" />
                </div>
                {/* Le H1 reste seul, pleine largeur, pour rester l'élément
                    visuel principal du bloc supérieur. */}
                <h1 className={styles.offerTitle}>{seoProfile?.h1 || `${offer.name} : parrainage et conditions`}</h1>
                {seoProfile?.introduction && <p className={styles.headerIntro}>{seoProfile.introduction}</p>}
                </div>
                {seoProfile && <div className={styles.headerActionSummary}>
                  <span className={styles.stepsLabel}>COMMENT EN PROFITER ?</span>
                  <ol className={styles.headerSteps}>
                    <li><b>01</b><span><strong>COPIEZ LE CODE</strong><small>Utilisez notre lien ou code de parrainage.</small></span></li>
                    <li><b>02</b><span><strong>INSCRIVEZ-VOUS</strong><small>Renseignez le code si nécessaire.</small></span></li>
                    <li><b>03</b><span><strong>VALIDEZ VOTRE COMPTE</strong><small>Réalisez les conditions de l'offre.</small></span></li>
                    <li><b>04</b><span><strong>DEMANDEZ VOTRE VERSEMENT</strong></span></li>
                  </ol>
                </div>}
              </div>

              <div className={styles.mobileActionSlot}>
                <OfferIllustration
                  parrainioReward={offer.parrainioReward}
                  categoryHubSlug={categoryHub?.slug ?? null}
                  variant="mobile"
                />
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
                    {!offer.referralCode && !referralUrl ? <ReferralRequestForm offerName={offer.name} offerSlug={offer.slug} /> : null}
                  </div>
                  <ParrainioReverseRequest offerSlug={offer.slug} />
                  <OfferChangeAlert slug={offer.slug} offerName={offer.name} />
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
                    <h2 id={`${offer.slug}-details`}>Fonctionnement et conditions du parrainage {offer.name}</h2>
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
                    {seoProfile.faq && seoProfile.faq.length > 0 && <section className={styles.seoDetails} aria-labelledby={`${offer.slug}-faq`}><h2 id={`${offer.slug}-faq`}>Questions fréquentes sur le parrainage {offer.name}</h2><div className={styles.seoFaq}>{seoProfile.faq.map((item) => <details key={item.question}><summary><h3>{item.question}</h3></summary><p>{item.answer}</p></details>)}</div></section>}
                    </div>
                  </section>
                  {seoProfile.internalLinks && seoProfile.internalLinks.length > 0 && <nav className={styles.seoLinks} aria-label="Offres similaires"><span>Vous pourriez aussi être intéressé par</span>{seoProfile.internalLinks.map((link) => <Link key={link.slug} href={`/offres/${link.slug}`}>{link.label}</Link>)}</nav>}
                  <p className={styles.seoDate}>Informations vérifiées le {new Date(seoProfile.researchedAt).toLocaleDateString("fr-FR")}</p>
                  {hubAnchor && (
                    <p className={styles.seoDate}>
                      <Link href="/codes-parrainage" className={styles.hubLinkInline}>
                        {hubAnchor}
                      </Link>{" "}
                      — mécanismes de parrainage expliqués offre par offre.
                    </p>
                  )}
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
              <OfferIllustration
                parrainioReward={offer.parrainioReward}
                categoryHubSlug={categoryHub?.slug ?? null}
              />
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
                    <ReferralRequestForm offerName={offer.name} offerSlug={offer.slug} />
                  ) : null}
                </div>
                <ParrainioReverseRequest offerSlug={offer.slug} />
                <OfferChangeAlert slug={offer.slug} offerName={offer.name} />
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
      <SiteFooter />
    </main>
  );
}
