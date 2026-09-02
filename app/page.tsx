import Link from "next/link";
import type { SVGProps } from "react";
import { useMemo } from "react";
import { getManagedOffers } from "@/data/managedOffers";
import PublicHeader from "@/components/PublicHeader";
import OfferRewards from "@/components/OfferRewards";
import OfferLogo from "@/components/OfferLogo";
import FAQ from "@/components/FAQ";
import OfferSearchResults from "@/components/OfferSearchResults";
import { SELECTION_DU_MOMENT } from "@/data/featuredOffersConfig";
import styles from "./page.module.css";

type IconName = "arrow" | "check" | "search" | "link" | "gift" | "spark";

function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const common: SVGProps<SVGSVGElement> = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
    strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true,
  };

  if (name === "arrow") return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
  if (name === "check") return <svg {...common}><path d="m5 12 4.2 4.2L19 6.5" /></svg>;
  if (name === "search") return <svg {...common}><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>;
  if (name === "link") return <svg {...common}><path d="M10.5 13.5a4.2 4.2 0 0 0 6 0l2-2a4.2 4.2 0 0 0-6-6l-1.15 1.15" /><path d="M13.5 10.5a4.2 4.2 0 0 0-6 0l-2 2a4.2 4.2 0 0 0 6 6l1.15-1.15" /></svg>;
  if (name === "gift") return <svg {...common}><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M12 8v13M3 12h18M12 8H8.4a2.4 2.4 0 1 1 2.4-2.4V8Zm0 0h3.6A2.4 2.4 0 1 0 13.2 5.6V8Z" /></svg>;
  return <svg {...common}><path d="m12 3 .95 5.05L18 9l-5.05.95L12 15l-.95-5.05L6 9l5.05-.95L12 3Z" /><path d="m19 15 .5 2.5L22 18l-2.5.5L19 21l-.5-2.5L16 18l2.5-.5L19 15Z" /></svg>;
}

export default function Home() {
  const managedOffers = getManagedOffers();
  const categories = useMemo(
    () => Array.from(new Set(managedOffers.map((offer) => offer.categoryGroup))),
    [managedOffers]
  );
  const boursobank = managedOffers.find((offer) => offer.slug === "boursobank") ?? managedOffers[0];
  const featuredOfferSlugs = SELECTION_DU_MOMENT;
  const featuredOffers = featuredOfferSlugs
    .map((slug) => managedOffers.find((offer) => offer.slug === slug))
    .filter((offer): offer is (typeof managedOffers)[number] => Boolean(offer));

  return (
    <main id="top" className={styles.page}>
      <div className={styles.homeHeader}><PublicHeader active="home" /></div>

      <section className={styles.compactHero}>
        <div className={styles.container}>
          <div className={styles.compactHeroInner}>
            <div className={styles.compactHeroCopy}>
              <span className={styles.eyebrow}><span />Le parrainage simplifié</span>
              <h1>Votre parrainage <em>vous rapporte plus.</em></h1>
              <p>Parrainio réunit les meilleures offres et vous aide à comprendre votre gain potentiel.</p>
              <div className={styles.heroActions}><Link href="/offres" className={styles.primaryButton}>Voir toutes les offres <Icon name="arrow" size={16} /></Link><Link href="/comment-ca-marche" className={styles.secondaryButton}>Comment ça marche →</Link></div>
            </div>
            <div className={styles.heroIllustration} aria-label="Aperçu de l'offre Boursobank">
              <div className={styles.illustrationBlob} aria-hidden="true" />
              <div className={styles.laurierBranch} aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
              <div className={styles.illustrationRing} aria-hidden="true" />
              <div className={styles.marketingCard}>
                <div className={styles.marketingCardHeader}><div className={styles.marketingBrand}><OfferLogo name={boursobank.name} logo={boursobank.logo} color={boursobank.color} logoLetter={boursobank.logoLetter} size={36} className={styles.marketingLogo} /><span><strong>{boursobank.name}</strong><small>Vue d&apos;ensemble</small></span></div><span className={styles.readablePill}>Simple à lire</span></div>
                <div className={styles.marketingDivider} />
                <small className={styles.marketingLabel}>Une vraie offre, en clair</small>
                <strong className={styles.marketingAmount}>160 <small>€</small></strong>
                <div className={styles.marketingRows}><div><span>VOUS GAGNEZ</span><strong>Jusqu&apos;à 160 €</strong></div><div><span>PARRAINIO REVERSE EN PLUS</span><strong>+15 €</strong></div></div>
                <div className={styles.marketingTotal}><span>Avantage potentiel</span><strong>Jusqu&apos;à 175 €</strong></div>
                <Link href={`/offres/${boursobank.slug}`} className={styles.marketingCta}>En profiter →</Link>
              </div>
              <div className={styles.marketingCoin} aria-hidden="true">€</div>
              <div className={styles.heroAdvantage}><span className={styles.heroAdvantageIcon}><Icon name="gift" size={18} /></span><span className={styles.heroAdvantageLabel}>Votre avantage Parrainio</span><strong>Jusqu&apos;à 25 %</strong><small>de notre commission reversée</small></div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <div className={styles.featuredHeader}>
            <div><span className={styles.kicker}>Sélection Parrainio</span><h2>Les offres <em>du moment.</em></h2></div>
          </div>
          <div className={styles.featuredGrid}>
            {featuredOffers.map((offer) => (
              <Link href={`/offres/${offer.slug}`} className={styles.featuredCard} key={offer.slug}>
                <div className={styles.featuredCardTop}>
                  <OfferLogo name={offer.name} logo={offer.logo} color={offer.color} logoLetter={offer.logoLetter} size={38} className={styles.featuredLogo} />
                  <div className={styles.featuredInfo}>
                    <small>{offer.categoryGroup}</small>
                    <h3>{offer.name}</h3>
                  </div>
                </div>
                <OfferRewards offer={offer} compact />
                <span className={styles.featuredCta}>Voir l&apos;offre →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.categoryBanner} aria-label="Parcourir les offres par catégorie" hidden>
        <div className={styles.container}>
          <div className={styles.categoryBannerInner}>
            <span className={styles.categoryBannerLabel}>Catégories</span>
            <nav className={styles.categoryLinks} aria-label="Catégories d'offres">
              {categories.map((category) => (
                <Link
                  href={`/offres?category=${encodeURIComponent(category)}#offres`}
                  className={styles.categoryLink}
                  key={category}
                >
                  {category}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </section>

      <section className={styles.howSection}><div className={styles.container}><div className={styles.howHeader}><span className={styles.kicker}>Le parcours Parrainio</span><h2>Parrainer, <em>c&apos;est simple.</em></h2></div><div className={styles.howSteps}><div><b>01</b><span>Choisissez une offre</span><small>Comparez les conditions.</small></div><i>→</i><div><b>02</b><span>Utilisez votre lien</span><small>Suivez le parcours partenaire.</small></div><i>→</i><div><b>03</b><span>Recevez votre avantage</span><small>Après confirmation du parrainage.</small></div></div></div></section>

      <section className={styles.compactOffersSection}><div className={styles.container}>
        <OfferSearchResults offers={managedOffers} />
        <div className={styles.compactOffersHeading}><div><h2>Plus d&apos;offres <em>disponibles.</em></h2></div><Link href="/offres" className={styles.outlineButton}>Voir toutes les offres <Icon name="arrow" size={17} /></Link></div>

      </div></section>

      <FAQ />

      <footer className={styles.footer}><div className={styles.container}><div className={styles.footerGrid}>
        <div><Link href="/" className={styles.footerLogo}><span className={styles.logoMark}>P</span>Parrainio</Link><p>Le nouveau réflexe pour découvrir et profiter des offres de parrainage.</p></div><div><h3>Découvrir</h3><Link href="/offres">Les offres</Link><Link href="/comment-ca-marche">Comment ça marche</Link></div><div><h3>Parrainio</h3><Link href="/nos-avantages">Nos avantages</Link><a href="mailto:contact@parrainio.fr">Contact</a></div>
      </div><div className={styles.footerBottom}>© 2026 Parrainio. Tous droits réservés.</div></div></footer>
    </main>
  );
}
