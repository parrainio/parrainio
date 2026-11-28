import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import {
  getOfferReferralUrl,
  getFeaturedOffers,
} from "@/data/offers";
import { getManagedOffer, getManagedOffers } from "@/data/managedOffers";
import { applyBoostedCampaignToOffer, getActiveBoostedCampaign } from "@/data/boostedCampaign";
import { OG_IMAGE } from "@/lib/ogImage";
import { adaptCampaignDeep } from "@/lib/offerCampaigns";
import { offerSeoProfiles } from "@/data/offer-seo";
import { lot18Profiles } from "@/data/offer-seo-batch16";
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
import { lot16Profiles } from "@/data/offer-seo-batch14";
import { lot17Profiles } from "@/data/offer-seo-batch15";
import { getRelatedOffers } from "@/lib/relatedOffers";
import { getCategoryHubForGroup } from "@/lib/categoryHubs";
import { observatoire } from "@/lib/observatoireConditions";
import { getRetourTerrain } from "@/lib/experienceTerrain";
import { SITE_URL } from "@/lib/siteUrl";
import { getFeaturedOfferSlugsServer } from "@/lib/featuredOffersServer";
import { classifyReferralMechanism, getHubLinkAnchor } from "@/lib/referralMechanism";
import { buildOfferSeoRewrite } from "@/lib/offerSeoRewrite";
import { getBemoveCopyTrackingUrl } from "@/lib/bemoveTracking";
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
import { getHelloBankPromotion, selectHelloBankParrainioReward } from "@/lib/helloBankPromotion";
import ParrainioReverseRequest from "@/components/ParrainioReverseRequest";
import OfferDelayNotice from "@/components/OfferDelayNotice";
import styles from "./page.module.css";

// Les fiches sont rendues sur demande pour relire les overrides et recalculer
// le montant Hello bank! à la frontière de sa campagne temporelle.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const offer = await getManagedOffer(slug);

  if (!offer) {
    return {
      title: "Offre introuvable - Parrainio",
      description: "Cette offre de parrainage n'existe pas sur Parrainio.",
    };
  }

  const profile =
    adaptCampaignDeep(lot18Profiles[slug], slug) ??
    adaptCampaignDeep(lot17Profiles[slug], slug) ?? adaptCampaignDeep(lot16Profiles[slug], slug) ??
    adaptCampaignDeep(lot15Profiles[slug], slug) ??
    adaptCampaignDeep(lot14Profiles[slug], slug) ?? adaptCampaignDeep(lot13Profiles[slug], slug) ?? adaptCampaignDeep(lot12Profiles[slug], slug) ?? adaptCampaignDeep(lot11Profiles[slug], slug) ?? adaptCampaignDeep(lot10Profiles[slug], slug) ?? adaptCampaignDeep(lot09Profiles[slug], slug) ?? adaptCampaignDeep(lot08Profiles[slug], slug) ?? adaptCampaignDeep(lot07Profiles[slug], slug) ?? adaptCampaignDeep(lot06Profiles[slug], slug) ?? adaptCampaignDeep(lot05Profiles[slug], slug) ?? adaptCampaignDeep(lot02Profiles[slug], slug) ?? adaptCampaignDeep(offerSeoProfiles[slug], slug);
  const seoRewrite = buildOfferSeoRewrite(offer, profile);
  const reward = offer.partnerReward;
  const categoryName = offer.categoryGroup;
  const referralAccess = offer.referralLink && offer.referralCode
    ? "lien et code de parrainage"
    : offer.referralLink
      ? "lien de parrainage"
      : offer.referralCode
        ? "code de parrainage"
        : "modalités de l'offre";

  return {
    title: seoRewrite.title,
    description: seoRewrite.description,
    alternates: { canonical: `/offres/${slug}` },
    openGraph: {
      title: seoRewrite.title,
      description: seoRewrite.description,
      url: `/offres/${slug}`,
      type: "website",
      siteName: "Parrainio",
      locale: "fr_FR",
      images: [OG_IMAGE],
    },
  };
}

function HelloBankPromotionNotice({ promotion }: { promotion: ReturnType<typeof getHelloBankPromotion> }) {
  if (!promotion.promotionActive) return null;
  return (
    <aside className={styles.helloBankNotice}>
      <strong>Jusqu’à {promotion.primeTotal} avec Hello Prime ou {promotion.oneTotal} avec Hello One, sous conditions</strong>
      <p>Ces totaux incluent jusqu’à 200 € en bon d’achat Hello Start+ (pas du cash), la prime partenaire et {promotion.parrainioReward} de reversement Parrainio. Ils ne sont valables que si chaque avantage est encore proposé et si ses conditions sont remplies.</p>
      <p>Pour Hello Start+, adhérez gratuitement à la mobilité bancaire et transférez au moins un prélèvement ou virement récurrent si les conditions l’exigent.</p>
    </aside>
  );
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
  await connection();
  const managedOffer = await getManagedOffer(slug);

  if (!managedOffer) {
    notFound();
  }

  const campaign = await getActiveBoostedCampaign();
  const helloBankPromotion = slug === "hello-bank" ? getHelloBankPromotion(new Date()) : null;
  const baseOffer = slug === "hello-bank"
    ? { ...managedOffer, parrainioReward: selectHelloBankParrainioReward(new Date()) }
    : managedOffer;
  const offer = await applyBoostedCampaignToOffer(baseOffer);
  const observatoireOffre = observatoire.offres.find((entry) => entry.slug === offer.slug);
  // Les offres hors observatoire (crypto, courtage) n'ont pas de citation
  // officielle : elles gardent leur retour terrain, sans condition inventée.
  const terrainOffre = observatoireOffre?.terrain ?? getRetourTerrain(offer.slug);

  const isTerminated = offer.offerStatus === "terminated";
  // Offre terminée : aucun lien ni CTA actif, même si une valeur historique
  // subsiste dans les données gérées.
  const referralUrl = isTerminated
    ? null
    : slug === "hello-bank" && helloBankPromotion
      ? helloBankPromotion.referralLink
      : getOfferReferralUrl(offer);
  const referralDisplayLabel = slug === "bnp"
    ? "Lien de parrainage BNP Paribas"
    : referralUrl;
  const codeDestinationUrl =
    !isTerminated && !referralUrl && offer.referralCode && lot18Profiles[offer.slug]
      ? offer.officialWebsiteUrl
      : null;
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
  const seoProfile = adaptCampaignDeep(lot18Profiles[offer.slug], offer.slug) ?? adaptCampaignDeep(lot17Profiles[offer.slug], offer.slug) ?? adaptCampaignDeep(lot16Profiles[offer.slug], offer.slug) ?? adaptCampaignDeep(lot15Profiles[offer.slug], offer.slug) ?? adaptCampaignDeep(lot14Profiles[offer.slug], offer.slug) ?? adaptCampaignDeep(lot13Profiles[offer.slug], offer.slug) ?? adaptCampaignDeep(lot12Profiles[offer.slug], offer.slug) ?? adaptCampaignDeep(lot11Profiles[offer.slug], offer.slug) ?? adaptCampaignDeep(lot10Profiles[offer.slug], offer.slug) ?? adaptCampaignDeep(lot09Profiles[offer.slug], offer.slug) ?? adaptCampaignDeep(lot08Profiles[offer.slug], offer.slug) ?? adaptCampaignDeep(lot07Profiles[offer.slug], offer.slug) ?? adaptCampaignDeep(lot06Profiles[offer.slug], offer.slug) ?? adaptCampaignDeep(lot05Profiles[offer.slug], offer.slug) ?? adaptCampaignDeep(lot02Profiles[offer.slug], offer.slug) ?? adaptCampaignDeep(offerSeoProfiles[offer.slug], offer.slug);
  // FAQPage (JSON-LD) : la MÊME donnée `faq` que le rendu visible ci-dessous
  // (seoProfile.faq) — aucune duplication de texte, aucune réécriture.
  // Garde-fous : sans FAQ valide, aucun nœud FAQPage ; une question ou une
  // réponse vide est exclue plutôt que sérialisée invalide.
  const seoRewrite = buildOfferSeoRewrite(offer, seoProfile);
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
  // Note de contact (ex. : stock de liens restants) : la donnée admin
  // (override) est prioritaire, sinon la valeur du profil SEO/seed.
  const contactNote:
    | string
    | null
    | undefined =
    offer.contactNote?.trim() || seoProfile?.referralContact?.note || null;

  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PublicHeader campaignActive={Boolean(campaign)} />
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
                {offer.isCampaignBoosted && campaign ? (
                  <Link className={styles.campaignBadge} href="/offres-boostees">
                    {campaign.headline} · {campaign.durationLabel}
                  </Link>
                ) : null}
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
                <h1 className={styles.offerTitle}>{seoRewrite.h1}</h1>
                {seoProfile?.introduction && <p className={styles.headerIntro}>{seoRewrite.lead} {seoProfile.introduction}</p>}
                </div>
                {seoProfile && !isTerminated && <div className={styles.headerActionSummary}>
                  <span className={styles.stepsLabel}>COMMENT EN PROFITER ?</span>
                  <ol className={styles.headerSteps}>
                    <li><b>01</b><span><strong>{offer.referralCodeBlock ? offer.referralCodeBlock.stepTitle : referralUrl ? "OUVREZ LE LIEN" : offer.referralCode ? "COPIEZ LE CODE" : "DEMANDEZ LE LIEN"}</strong><small>{offer.referralCodeBlock ? offer.referralCodeBlock.stepHint : referralUrl ? "Commencez le parcours depuis le lien de cette fiche." : offer.referralCode ? "Utilisez le code indiqué dans le parcours du partenaire." : "Demandez les modalités avant de commencer."}</small></span></li>
                    <li><b>02</b><span><strong>INSCRIVEZ-VOUS</strong><small>{offer.referralCodeBlock ? offer.referralCodeBlock.signupHint : offer.referralCode ? "Suivez le parcours et saisissez le code demandé par le partenaire." : "Continuez le parcours commencé depuis le lien."}</small></span></li>
                    <li><b>03</b><span><strong>VALIDEZ VOTRE COMPTE</strong><small>Réalisez les conditions de l&apos;offre.</small></span></li>
                    <li><b>04</b><span><strong>{offer.parrainioReward ? "DEMANDEZ VOTRE VERSEMENT" : "ATTENDEZ LE VERSEMENT PARTENAIRE"}</strong></span></li>
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
                    {helloBankPromotion ? <HelloBankPromotionNotice promotion={helloBankPromotion} /> : null}
                    {seoProfile?.alertBox && (
                      <aside className={styles.alertBox}>
                        <h2 className={styles.alertBoxTitle}>{seoProfile.alertBox.title}</h2>
                        {seoProfile.alertBox.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </aside>
                    )}
                  </div>
                  <div className={styles.referralSection}>
                    {referralUrl ? <div className={styles.referralValue}><span>Votre lien de parrainage</span><div className={styles.referralValueRow}><a href={referralUrl} target="_blank" rel="noreferrer">{referralDisplayLabel}</a><CopyTextButton value={referralUrl} label="Copier le lien" copiedLabel="Lien copié ✓" openUrlOnClick={getBemoveCopyTrackingUrl(offer.slug)} /></div></div> : null}
                    {!isTerminated && offer.referralCodeBlock ? (
                      <p className={styles.referralCodeNote}>{offer.referralCodeBlock.note.intro} <strong>{offer.referralCodeBlock.note.emphasis}</strong>{offer.referralCodeBlock.note.rest}</p>
                    ) : null}
                    {!isTerminated && !referralUrl && offer.referralCode && (offer.officialWebsiteUrl || offer.referralCodeBlock) ? (
                      <div className={styles.codeActionsRow}>
                        <div className={styles.codeRow}>
                          <div><span>{offer.referralCodeBlock?.codeLabel ?? "Votre code de parrainage"}</span><strong>{offer.referralCode}</strong></div>
                          <div className={styles.codeActionColumn}>
                            <CopyTextButton value={offer.referralCode} label={offer.referralCodeBlock?.codeCopyLabel ?? "Copier le code"} copiedLabel="Code copié ✓" openUrlOnClick={getBemoveCopyTrackingUrl(offer.slug)} />
                          </div>
                        </div>
                        {offer.referralCodeBlock ? (
                          <div className={styles.codeRow}>
                            <div><span>{offer.referralCodeBlock.additional.label}</span><strong>{offer.referralCodeBlock.additional.code}</strong></div>
                            <div className={styles.codeActionColumn}>
                              <CopyTextButton value={offer.referralCodeBlock.additional.code} label={offer.referralCodeBlock.additional.copyLabel} copiedLabel="Numéro copié ✓" />
                            </div>
                          </div>
                        ) : null}
                        {offer.referralCodeBlock ? (
                          <CopyTextButton value={`${offer.referralCode} ${offer.referralCodeBlock.additional.code}`} label={offer.referralCodeBlock.combinedLabel} copiedLabel={offer.referralCodeBlock.combinedCopiedLabel} />
                        ) : null}
                      </div>
                    ) : !isTerminated && offer.referralCode ? (
                      <div className={styles.codeRow}>
                        <div><span>Votre code de parrainage</span><strong>{offer.referralCode}</strong></div>
                        <CopyTextButton value={offer.referralCode} label="Copier le code" copiedLabel="Code copié ✓" openUrlOnClick={getBemoveCopyTrackingUrl(offer.slug)} />
                      </div>
                    ) : null}
                    {codeDestinationUrl ? (
                      <div className={styles.referralValue}>
                        <span>Lien du programme de parrainage (saisir le code)</span>
                        <div className={styles.referralValueRow}>
                          <a href={codeDestinationUrl} target="_blank" rel="noreferrer">{codeDestinationUrl}</a>
                          <CopyTextButton value={codeDestinationUrl} label="Copier le lien" copiedLabel="Lien copié ✓" />
                        </div>
                        <small>Le profil ne fournit pas de lien personnalisé pour cette offre : utilisez le code affiché sur le site officiel.</small>
                      </div>
                    ) : null}
                    {!isTerminated && offer.additionalReferralCodes?.map((item) => (
                      <div className={styles.codeRow} key={item.code}>
                        <div><span>{item.label}</span><strong>{item.code}</strong></div>
                        <CopyTextButton value={item.code} label={item.copyLabel ?? "Copier le code"} copiedLabel="Code copié ✓" />
                      </div>
                    ))}
                    {!isTerminated && offer.referralOptions?.length ? (
                      <div className={styles.referralValue}>
                        <span>Liens selon le produit</span>
                        {offer.referralOptions.map((item) => (
                          <div className={styles.referralValueRow} key={item.url}>
                            <a href={item.url} target="_blank" rel="noreferrer">{item.label}</a>
                            <CopyTextButton value={item.url} label="Copier le lien" copiedLabel="Lien copié ✓" />
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {(referralUrl || offer.referralCode || offer.referralOptions?.length) && seoProfile?.referralContact ? (
                      <div className={styles.referralContact}>
                        <strong>{seoProfile.referralContact.heading}</strong>
                        <small>{seoProfile.referralContact.note ?? contactNote}</small>
                      </div>
                    ) : null}
                    {referralUrl ? <a className={styles.primaryButton} href={referralUrl} rel="noreferrer" target="_blank">En profiter <ArrowIcon /></a> : codeDestinationUrl ? <a className={styles.primaryButton} href={codeDestinationUrl} rel="noreferrer" target="_blank">Consulter le programme et saisir le code <ArrowIcon /></a> : null}
                    {!isTerminated && (offer.referralContractRequest || (!offer.referralCode && !referralUrl && !offer.referralOptions?.length)) ? (
                      <>
                        {seoProfile?.referralContact && (
                          <div className={styles.referralContact}>
                            <strong>{seoProfile.referralContact.heading}</strong>
                            {contactNote && <small>{contactNote}</small>}
                          </div>
                        )}
                        <ReferralRequestForm
                          offerName={offer.name}
                          offerSlug={offer.slug}
                          heading={offer.referralContractRequest?.heading}
                          intro={offer.referralContractRequest?.intro}
                          buttonLabel={offer.referralContractRequest?.buttonLabel}
                          successMessage={offer.referralContractRequest?.successMessage}
                        />
                      </>
                    ) : null}
                  </div>
                  {offer.parrainioReward && !isTerminated ? <ParrainioReverseRequest offerSlug={offer.slug} showAction={false} /> : null}
                  {observatoireOffre || terrainOffre ? (
                    <OfferDelayNotice offre={observatoireOffre} terrain={terrainOffre} />
                  ) : null}
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
                  {offer.slug === "l-by-lcl" && (
                    <section className={styles.lclFormulaSection} aria-labelledby="l-by-lcl-formulas">
                      <div className={styles.lclFormulaHeading}>
                        <div>
                          <span className={styles.lclFormulaOverline}>DEUX FORMULES AU CHOIX</span>
                          <h2 id="l-by-lcl-formulas">Comparer XL et XXL</h2>
                        </div>
                        <strong className={styles.lclDeadline}>Offre valable jusqu'au 31/12/2026</strong>
                      </div>
                      <div className={styles.lclFormulaGrid}>
                        <article className={styles.lclFormulaCard}>
                          <div className={styles.lclFormulaTitle}>
                            <h3>Formule XL</h3>
                            <strong>200 € au total</strong>
                          </div>
                          <dl className={styles.lclFormulaList}>
                            <div><dt>Prime de parrainage LCL</dt><dd>40 €</dd></div>
                            <div><dt>Bonus Livret Plus</dt><dd>70 €</dd></div>
                            <div><dt>Mobilité bancaire</dt><dd>80 €</dd></div>
                          </dl>
                          <div className={styles.lclFormulaLivret}>
                            <span>Livret Plus</span>
                            <b>20 € + 20 € + 30 €</b>
                            <small>Premier, deuxième et troisième mois</small>
                          </div>
                          <div className={styles.lclFormulaTotals}>
                            <p><span>Primes bancaires</span><strong>190 €</strong></p>
                            <p className={styles.lclParrainioTotal}><span>Reversement Parrainio</span><strong>+10 €</strong></p>
                          </div>
                        </article>
                        <article className={`${styles.lclFormulaCard} ${styles.lclFormulaFeatured}`}>
                          <div className={styles.lclFormulaBadge}>JUSQU'À 260 €</div>
                          <div className={styles.lclFormulaTitle}>
                            <h3>Formule XXL</h3>
                            <strong>260 € au total</strong>
                          </div>
                          <dl className={styles.lclFormulaList}>
                            <div><dt>Prime de parrainage LCL</dt><dd>70 €</dd></div>
                            <div><dt>Bonus Livret Plus</dt><dd>100 €</dd></div>
                            <div><dt>Mobilité bancaire</dt><dd>80 €</dd></div>
                          </dl>
                          <div className={styles.lclFormulaLivret}>
                            <span>Livret Plus</span>
                            <b>30 € + 30 € + 40 €</b>
                            <small>Premier, deuxième et troisième mois</small>
                          </div>
                          <div className={styles.lclFormulaTotals}>
                            <p><span>Primes bancaires</span><strong>250 €</strong></p>
                            <p className={styles.lclParrainioTotal}><span>Reversement Parrainio</span><strong>+10 €</strong></p>
                          </div>
                        </article>
                      </div>
                      <div className={styles.lclImportantInfo}>
                        <h3>Informations importantes</h3>
                        <ul>
                          <li>XL et XXL comportent un abonnement de 5 € par mois.</li>
                          <li>Il est possible de repasser vers l'offre gratuite après avoir reçu sa prime, selon les conditions applicables.</li>
                          <li>Le dépôt initial de 50 € est nécessaire pour valider définitivement l'ouverture du compte.</li>
                          <li>Le Livret Plus doit être souscrit depuis l'application L by LCL avec un dépôt d'au moins 10 €.</li>
                          <li>La prime de parrainage est versée 14 jours après l'ouverture définitive.</li>
                          <li>Chaque client peut parrainer jusqu'à 5 personnes par an et recevoir jusqu'à 5 primes de 40 €.</li>
                        </ul>
                        <p>
                          Les conditions exactes de la mobilité bancaire ne sont pas déduites ici.
                          {" "}<a href="https://www.lcl.fr/" target="_blank" rel="noopener noreferrer">Consultez les conditions officielles de LCL</a>.
                        </p>
                      </div>
                    </section>
                  )}
                  <section className={styles.seoDetails} aria-labelledby={`${offer.slug}-details`}>
                    <h2 id={`${offer.slug}-details`}>Fonctionnement et conditions du parrainage {offer.name}</h2>
                    <p className={styles.seoDetailsSubtitle}>Tout savoir avant de s&apos;inscrire</p>
                    <p className={styles.seoDetailsIntro}>Informations détaillées sur l&apos;offre</p>
                    <div className={styles.seoGroup}>
                    <span className={styles.seoGroupLabel}>POUR COMPRENDRE L&apos;OFFRE</span>
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
                    {terrainOffre && (
                      <details className={styles.seoAccordion}>
                        <summary>Quand la prime arrive-t-elle en pratique ?</summary>
                        <p>
                          Notre retour d’expérience indique {terrainOffre.delai.texte}, déclenché par :{" "}
                          {terrainOffre.declencheur}. C’est une observation du responsable de Parrainio,
                          pas une condition de l’établissement.
                        </p>
                        <p>
                          Prime du filleul : {terrainOffre.delais.primeFilleul}. Prime du parrain :{" "}
                          {terrainOffre.delais.commissionParrain}. Reversement Parrainio :{" "}
                          {terrainOffre.delais.reversementParrainio}.
                        </p>
                        <p>
                          Conservation : {terrainOffre.conservation.texte}. Reprise :{" "}
                          {terrainOffre.reprise.texte}
                        </p>
                        {terrainOffre.exception ? <p>À noter : {terrainOffre.exception}</p> : null}
                      </details>
                    )}
                    {seoProfile.practicalInformation && <details className={styles.seoAccordion}><summary>À savoir avant de s&apos;inscrire</summary><ul className={styles.seoList}>{seoProfile.practicalInformation.map((item) => <li key={item}>{item}</li>)}</ul></details>}
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
                  {helloBankPromotion ? <HelloBankPromotionNotice promotion={helloBankPromotion} /> : null}
                  {seoProfile?.alertBox && (
                    <aside className={styles.alertBox}>
                      <h2 className={styles.alertBoxTitle}>{seoProfile.alertBox.title}</h2>
                      {seoProfile.alertBox.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </aside>
                  )}
                </div><div className={styles.referralSection}>
                    {referralUrl ? <div className={styles.referralValue}><span>Votre lien de parrainage</span><div className={styles.referralValueRow}><a href={referralUrl} target="_blank" rel="noreferrer">{referralDisplayLabel}</a><CopyTextButton value={referralUrl} label="Copier le lien" copiedLabel="Lien copié ✓" openUrlOnClick={getBemoveCopyTrackingUrl(offer.slug)} /></div></div> : null}
                    {!isTerminated && offer.referralCodeBlock ? (
                    <p className={styles.referralCodeNote}>{offer.referralCodeBlock.note.intro} <strong>{offer.referralCodeBlock.note.emphasis}</strong>{offer.referralCodeBlock.note.rest}</p>
                  ) : null}
                    {!isTerminated && !referralUrl && offer.referralCode && (offer.officialWebsiteUrl || offer.referralCodeBlock) ? (
                    <div className={styles.codeActionsRow}>
                      <div className={styles.codeRow}>
                        <div>
                          <span>{offer.referralCodeBlock?.codeLabel ?? "Votre code de parrainage"}</span>
                          <strong>{offer.referralCode}</strong>
                        </div>
                        <div className={styles.codeActionColumn}>
                          <CopyTextButton value={offer.referralCode} label={offer.referralCodeBlock?.codeCopyLabel ?? "Copier le code"} copiedLabel="Code copié ✓" openUrlOnClick={getBemoveCopyTrackingUrl(offer.slug)} />
                        </div>
                      </div>
                      {offer.referralCodeBlock ? (
                        <div className={styles.codeRow}>
                          <div>
                            <span>{offer.referralCodeBlock.additional.label}</span>
                            <strong>{offer.referralCodeBlock.additional.code}</strong>
                          </div>
                          <div className={styles.codeActionColumn}>
                            <CopyTextButton value={offer.referralCodeBlock.additional.code} label={offer.referralCodeBlock.additional.copyLabel} copiedLabel="Numéro copié ✓" />
                          </div>
                        </div>
                      ) : null}
                      {offer.referralCodeBlock ? (
                        <CopyTextButton value={`${offer.referralCode} ${offer.referralCodeBlock.additional.code}`} label={offer.referralCodeBlock.combinedLabel} copiedLabel={offer.referralCodeBlock.combinedCopiedLabel} />
                      ) : null}
                    </div>
                  ) : !isTerminated && offer.referralCode ? (
                    <div className={styles.codeRow}>
                      <div>
                        <span>Votre code de parrainage</span>
                        <strong>{offer.referralCode}</strong>
                      </div>
                      <CopyTextButton value={offer.referralCode} label="Copier le code" copiedLabel="Code copié ✓" openUrlOnClick={getBemoveCopyTrackingUrl(offer.slug)} />
                    </div>
                  ) : null}

                  {codeDestinationUrl ? (
                    <div className={styles.referralValue}>
                      <span>Lien du programme de parrainage (saisir le code)</span>
                      <div className={styles.referralValueRow}>
                        <a href={codeDestinationUrl} target="_blank" rel="noreferrer">{codeDestinationUrl}</a>
                        <CopyTextButton value={codeDestinationUrl} label="Copier le lien" copiedLabel="Lien copié ✓" />
                      </div>
                      <small>Le profil ne fournit pas de lien personnalisé pour cette offre : utilisez le code affiché sur le site officiel.</small>
                    </div>
                  ) : null}

                  {!isTerminated && offer.additionalReferralCodes?.map((item) => (
                    <div className={styles.codeRow} key={item.code}>
                      <div>
                        <span>{item.label}</span>
                        <strong>{item.code}</strong>
                      </div>
                      <CopyTextButton value={item.code} label={item.copyLabel ?? "Copier le code"} copiedLabel="Code copié ✓" />
                    </div>
                  ))}
                  {!isTerminated && offer.referralOptions?.length ? (
                    <div className={styles.referralValue}>
                      <span>Liens selon le produit</span>
                      {offer.referralOptions.map((item) => (
                        <div className={styles.referralValueRow} key={item.url}>
                          <a href={item.url} target="_blank" rel="noreferrer">{item.label}</a>
                          <CopyTextButton value={item.url} label="Copier le lien" copiedLabel="Lien copié ✓" />
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {(referralUrl || offer.referralCode || offer.referralOptions?.length) && seoProfile?.referralContact ? (
                    <div className={styles.referralContact}>
                      <strong>{seoProfile.referralContact.heading}</strong>
                      <small>{seoProfile.referralContact.note ?? contactNote}</small>
                    </div>
                  ) : null}

                  {referralUrl ? (
                    <a
                      className={styles.primaryButton}
                      href={referralUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      En profiter <ArrowIcon />
                    </a>
                  ) : codeDestinationUrl ? (
                    <a
                      className={styles.primaryButton}
                      href={codeDestinationUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Consulter le programme et saisir le code <ArrowIcon />
                    </a>
                  ) : null}

                  {!isTerminated && (offer.referralContractRequest || (!offer.referralCode && !referralUrl && !offer.referralOptions?.length)) ? (
                    <>
                      {seoProfile?.referralContact && (
                        <div className={styles.referralContact}>
                          <strong>{seoProfile.referralContact.heading}</strong>
                          {contactNote && <small>{contactNote}</small>}
                        </div>
                      )}
                      <ReferralRequestForm
                        offerName={offer.name}
                        offerSlug={offer.slug}
                        heading={offer.referralContractRequest?.heading}
                        intro={offer.referralContractRequest?.intro}
                        buttonLabel={offer.referralContractRequest?.buttonLabel}
                        successMessage={offer.referralContractRequest?.successMessage}
                      />
                    </>
                  ) : null}
                </div>
                {offer.parrainioReward && !isTerminated ? <ParrainioReverseRequest offerSlug={offer.slug} showAction={false} /> : null}
                {observatoireOffre || terrainOffre ? (
                  <OfferDelayNotice offre={observatoireOffre} terrain={terrainOffre} />
                ) : null}
                <OfferChangeAlert slug={offer.slug} offerName={offer.name} />
                </div>

                {/* Featured offers in sidebar */}
                {featuredOffers.length > 0 && (
                  <div className={styles.sidebarFeatured}>
                    <span className={styles.sidebarFeaturedLabel}>🔥 Offres boostées</span>
                    <div className={styles.sidebarFeaturedList}>
                      {campaign ? <Link href="/offres-boostees" className={styles.campaignLandingLink}>Découvrir les 5 offres · {campaign.durationLabel} →</Link> : null}
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
