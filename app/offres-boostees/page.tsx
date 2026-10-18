import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getManagedOffers } from "@/data/managedOffers";
import { applyBoostedCampaign, getActiveBoostedCampaign } from "@/data/boostedCampaign";
import OfferLogo from "@/components/OfferLogo";
import PublicHeader from "@/components/PublicHeader";
import SiteFooter from "@/components/SiteFooter";
import styles from "./page.module.css";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const campaign = await getActiveBoostedCampaign();
  if (!campaign) return { title: "Offres boostées | Parrainio", robots: { index: false, follow: true }, alternates: { canonical: "/offres-boostees" } };
  return {
    title: `${campaign.title} : ${campaign.headline} | Parrainio`,
    description: "Découvrez cinq offres Parrainio : 50 % de notre commission reversée, pendant une durée limitée.",
    alternates: { canonical: "/offres-boostees" },
    openGraph: { url: "/offres-boostees", title: `${campaign.title} : ${campaign.headline}`, description: "50 % de notre commission reversée sur cinq offres, pendant une durée limitée.", type: "website", siteName: "Parrainio", locale: "fr_FR" },
  };
}

export default async function BoostedOffersPage() {
  const campaign = await getActiveBoostedCampaign();
  if (!campaign) notFound();
  const managedOffers = applyBoostedCampaign(await getManagedOffers(), campaign);
  const offers = campaign.offerSlugs
    .map((slug) => managedOffers.find((offer) => offer.slug === slug))
    .filter((offer): offer is (typeof managedOffers)[number] => Boolean(offer));
  if (offers.length !== campaign.offerSlugs.length) notFound();

  return (
    <main className={styles.page}>
      <PublicHeader active="offers" campaignActive />
      <section className={styles.hero}>
        <div className={styles.container}>
          <Link href="/" className={styles.back}>← Accueil</Link>
          <span className={styles.duration}>{campaign.durationLabel}</span>
          <h1>{campaign.title}</h1>
          <p className={styles.lead}>{campaign.headline} sur cette sélection. Ce pourcentage porte sur la commission réellement perçue par Parrainio ; ce n’est pas une augmentation de la prime partenaire.</p>
          {campaign.endAt ? <p className={styles.endDate}>Offre valable jusqu’au {new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", dateStyle: "long" }).format(new Date(campaign.endAt))}.</p> : null}
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {offers.map((offer) => <article className={styles.card} key={offer.slug}>
              <div className={styles.brand}><OfferLogo name={offer.name} logo={offer.logo} color={offer.color} logoLetter={offer.logoLetter} size={48} /><div><small>{offer.categoryGroup}</small><h2>{offer.name}</h2></div></div>
              <span className={styles.badge}>{campaign.headline} · {campaign.durationLabel}</span>
              <div className={styles.amounts}>
                <div><span>Prime partenaire du filleul</span><strong>{offer.partnerReward}</strong></div>
                <div className={styles.reverse}><span>Reversement Parrainio boosté</span><strong>{offer.parrainioReward}</strong></div>
              </div>
              <p className={styles.conditions}>Les conditions normales du partenaire continuent de s’appliquer. Le reversement boosté est distinct de sa prime.</p>
              <Link href={`/offres/${offer.slug}`} className={styles.cta}>Voir la fiche {offer.name} →</Link>
            </article>)}
          </div>
          <div className={styles.explanation}><h2>Comment fonctionne le reversement ?</h2><p>Parrainio reverse au filleul 50 % de la commission effectivement perçue par Parrainio pour le parrainage validé. Le montant affiché est propre à chaque offre et distinct de la prime versée par le partenaire. Le reversement intervient après validation du parrainage et vérification de la demande, selon les conditions de la fiche.</p></div>
          <Link href="/" className={styles.homeLink}>← Retour à l’accueil et à la sélection boostée</Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
