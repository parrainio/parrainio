"use client";

import Link from "next/link";
import type { SVGProps } from "react";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { type Offer, getOfferReferralUrl } from "@/data/offers";
import PublicHeader from "@/components/PublicHeader";
import OfferRewards from "@/components/OfferRewards";
import MomentSelection from "@/components/MomentSelection";
import OfferLogo from "@/components/OfferLogo";
import OfferFilterBar from "@/components/OfferFilterBar";
import FavoriteButton from "@/components/FavoriteButton";
import { formatProductNames, parseProductReverses } from "@/lib/productNames";
import {
  PRIME_THRESHOLDS,
  CONDITION_OPTIONS,
  filterOffers,
} from "@/lib/offerFilters";
import { SITE_URL } from "@/lib/siteUrl";
import { CATEGORY_HUBS } from "@/lib/categoryHubs";
import styles from "./page.module.css";

type OffersCatalogProps = {
  offers: Offer[];
};

type IconName = "arrow" | "check" | "search" | "gift" | "info";

function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const common: SVGProps<SVGSVGElement> = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "arrow") {
    return (
      <svg {...common}>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    );
  }

  if (name === "check") {
    return (
      <svg {...common}>
        <path d="m5 12 4.2 4.2L19 6.5" />
      </svg>
    );
  }

  if (name === "search") {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="6" />
        <path d="m16 16 4 4" />
      </svg>
    );
  }

  if (name === "gift") {
    return (
      <svg {...common}>
        <rect x="3" y="8" width="18" height="13" rx="2" />
        <path d="M12 8v13M3 12h18" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5m0-8h.01" />
    </svg>
  );
}

export default function OffersCatalog({ offers }: OffersCatalogProps) {
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const [search, setSearch] = useState("");
  const [activePrime, setActivePrime] = useState<string | null>(null);
  const [activeCondition, setActiveCondition] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(
    requestedCategory && offers.some((offer) => offer.categoryGroup === requestedCategory)
      ? requestedCategory
      : "Toutes"
  );

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(offers.map((offer) => offer.categoryGroup))
    );

    return ["Toutes", ...uniqueCategories];
  }, [offers]);

  const hubSlugByCategory = useMemo(
    () =>
      Object.fromEntries(
        CATEGORY_HUBS.map((hub) => [hub.group, hub.slug] as const)
      ),
    []
  );

  /* Carte hero : offre mise en avant, alimentée par les données gérées
     (même source que la fiche Fortuneo — aucun montant ni lien hardcodé). */
  const featuredOffer = useMemo(
    () => offers.find((offer) => offer.slug === "fortuneo") ?? null,
    [offers]
  );
  const featuredCtaHref = featuredOffer
    ? getOfferReferralUrl(featuredOffer) ?? featuredOffer.officialWebsiteUrl ?? null
    : null;
  /* Reversement Parrainio : affiché tel que fourni par la source de vérité.
     Si la donnée distingue plusieurs produits (ex. « FOSFO : 17,50 € ; GOLD :
     27 € »), chaque montant est présenté sous son produit — sans calcul,
     fusion ni inversion. */
  const featuredProductReverses = useMemo(
    () => (featuredOffer?.parrainioReward ? parseProductReverses(featuredOffer.parrainioReward) : null),
    [featuredOffer]
  );

  /* Filtres actifs → valeurs typées consommées par le filtrage. */
  const primeThreshold = useMemo(
    () => (activePrime ? PRIME_THRESHOLDS.find((t) => t.label === activePrime)?.value ?? null : null),
    [activePrime]
  );

  const conditionKey = useMemo(
    () => (activeCondition ? CONDITION_OPTIONS.find((c) => c.label === activeCondition)?.key ?? null : null),
    [activeCondition]
  );

  const filteredOffers = useMemo(
    () => filterOffers(offers, { search, primeThreshold, condition: conditionKey }),
    [conditionKey, offers, primeThreshold, search]
  );

  /* Compteurs affichés dans les menus : nombre d'offres éligibles au filtre,
     les autres filtres actifs (recherche, condition) étant également pris
     en compte pour refléter le résultat réel de la combinaison. */
  const primeOptions = useMemo(
    () =>
      PRIME_THRESHOLDS.map(({ value, label }) => ({
        value,
        label,
        count: filterOffers(offers, { search, primeThreshold: value, condition: conditionKey }).length,
      })),
    [conditionKey, offers, search]
  );

  const conditionOptions = useMemo(
    () =>
      CONDITION_OPTIONS.map(({ key, label }) => ({
        key,
        label,
        count: filterOffers(offers, { search, primeThreshold, condition: key }).length,
      })),
    [offers, primeThreshold, search]
  );

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Offres de parrainage Parrainio",
    itemListElement: offers.map((offer, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: offer.name,
      url: `${SITE_URL}/offres/${offer.slug}`,
    })),
  };

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <PublicHeader active="offers" />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>
                <span />
                Les offres Parrainio
              </p>

              <h1>
                Toutes les offres de parrainage, <em>en un coup d’œil.</em>
              </h1>

              <p>
                Découvrez les meilleures offres de parrainage du moment, comparez les primes, les conditions et le reversement Parrainio avant de vous lancer.
              </p>

              <div className={styles.heroActions}>
                <a
                  href="#offres"
                  className={styles.primaryButton}
                >
                  Voir les offres
                  <Icon name="arrow" size={18} />
                </a>

                <Link
                  href="/pourquoi-parrainio"
                  className={styles.secondaryButton}
                >
                  Comprendre vos avantages
                </Link>
              </div>

              <div className={styles.heroNote}>
                <Icon name="info" size={16} />
                <span>
                  Les montants et conditions peuvent varier selon
                  l’offre.
                </span>
              </div>
            </div>

            <div
              className={styles.heroVisual}
              aria-label={featuredOffer ? `Offre mise en avant : ${featuredOffer.name}` : "Une offre Parrainio clairement détaillée"}
            >
              <div
                className={styles.blobOne}
                aria-hidden="true"
              />

              <div
                className={styles.blobTwo}
                aria-hidden="true"
              />

              <div className={styles.visualCard}>
                <div className={styles.visualHead}>
                  <div>
                    {featuredOffer ? (
                      <OfferLogo
                        name={featuredOffer.name}
                        logo={featuredOffer.logo}
                        color={featuredOffer.color}
                        logoLetter={featuredOffer.logoLetter}
                        size={32}
                      />
                    ) : (
                      <span className={styles.visualMark}>P</span>
                    )}

                    <div>
                      <strong>{featuredOffer?.name ?? "Parrainio"}</strong>
                      <small>{featuredOffer?.category ?? "Vue d’ensemble"}</small>
                    </div>
                  </div>

                  <span>Offre vérifiée</span>
                </div>

                <div className={styles.visualLine} />

                <p className={styles.visualLabel}>
                  Avantage filleul
                </p>

                <p className={styles.visualAmount}>
                  {featuredOffer?.partnerReward ?? "—"}
                </p>

                {featuredOffer?.parrainioReward ? (
                  <div className={styles.visualReverse}>
                    <span>Parrainio reverse en plus</span>
                    {featuredProductReverses ? (
                      <ul className={styles.reverseProducts}>
                        {featuredProductReverses.map((product) => (
                          <li key={product.label}>
                            <strong>{product.label}</strong>
                            <span>{product.amount}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <strong>{formatProductNames(featuredOffer.parrainioReward)}</strong>
                    )}
                  </div>
                ) : null}

                {featuredCtaHref ? (
                  <a
                    className={styles.visualCta}
                    href={featuredCtaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    En profiter →
                  </a>
                ) : featuredOffer ? (
                  <Link
                    className={styles.visualCta}
                    href={`/offres/${featuredOffer.slug}`}
                  >
                    Voir l&apos;offre →
                  </Link>
                ) : null}
              </div>

              <span
                className={styles.coin}
                aria-hidden="true"
              >
                €
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* OFFRES */}
      <MomentSelection offers={offers} />

      <section
        id="offres"
        className={styles.offersSection}
      >
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}>
                Opportunités disponibles
              </p>

              <h2>
                Trouvez votre prochaine{" "}
                <em>offre avantageuse.</em>
              </h2>
            </div>

            <p>
              {filteredOffers.length}{" "}
              {filteredOffers.length > 1
                ? "offres présentées"
                : "offre présentée"}
            </p>
          </div>

          <OfferFilterBar
            search={search}
            onSearchChange={setSearch}
            primeLabel={activePrime}
            onPrimeSelect={setActivePrime}
            primeOptions={primeOptions}
            conditionLabel={activeCondition}
            onConditionSelect={setActiveCondition}
            conditionOptions={conditionOptions}
 />

          {/* CATÉGORIES */}
          <div className={styles.categoryBar}>
            <div
              className={styles.categoryScroll}
              role="tablist"
              aria-label="Filtrer les offres par catégorie"
            >
              {categories.map((category) => {
                const isActive =
                  activeCategory === category;
                const hubSlug =
                  category !== "Toutes"
                    ? hubSlugByCategory[category]
                    : undefined;

                if (hubSlug) {
                  return (
                    <Link
                      key={category}
                      href={`/categories/${hubSlug}#offres`}
                      role="tab"
                      aria-selected={isActive}
                      className={styles.categoryLink}
                    >
                      {category}
                    </Link>
                  );
                }

                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`${styles.categoryLink} ${
                      isActive
                        ? styles.categoryActive
                        : ""
                    }`}
                    onClick={() =>
                      setActiveCategory(category)
                    }
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CARTES */}
          {filteredOffers.length > 0 ? (
            <div className={styles.offersGrid}>
              {filteredOffers.map((offer) => (
                <article
                  className={styles.offerCard}
                  key={offer.slug}
                >
                  <div className={styles.offerTop}>
                    <div className={styles.brand}>
                      <OfferLogo name={offer.name} logo={offer.logo} color={offer.color} logoLetter={offer.logoLetter} size={44} />

                      <div>
                        <small>{offer.categoryGroup}</small>
                        <h3>{offer.name}</h3>
                      </div>
                    </div>

                    <span className={styles.topActions}>
                      <span className={styles.available}>
                        <i />
                        Disponible
                      </span>
                      <FavoriteButton slug={offer.slug} />
                    </span>
                  </div>

                  <p className={styles.description}>
                    {offer.description}
                  </p>

                  <OfferRewards offer={offer} />

                  <p className={styles.condition}>
                    <Icon name="check" size={15} />
                    Selon les conditions de l&apos;offre
                  </p>

                  <Link
                    href={`/offres/${offer.slug}`}
                    className={styles.offerLink}
                  >
                    Voir l&apos;offre {offer.name}
                    <Icon
                      name="arrow"
                      size={17}
                    />
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <strong>
                {search
                  ? "Aucune offre trouvée."
                  : activePrime || activeCondition
                    ? "Aucune offre ne correspond à ces critères vérifiés."
                    : "Aucune offre dans cette catégorie"}
              </strong>

              <span>
                {activeCondition && !search && !activePrime
                  ? "Les conditions sont affichées uniquement lorsqu'elles sont vérifiées dans les données de l'offre — aucune offre éligible connue à ce jour."
                  : "De nouvelles offres arriveront prochainement."}
              </span>

              <button
                type="button"
                className={styles.emptyLink}
                onClick={() => {
                  setActiveCategory("Toutes");
                  setActivePrime(null);
                  setActiveCondition(null);
                  setSearch("");
                }}
              >
                Voir toutes les offres
                <Icon
                  name="arrow"
                  size={16}
                />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SEO / FAQ */}
      <section className={styles.seoSection}>
        <div className={styles.container}>
          <div className={styles.seoGrid}>
            <div>
              <p className={styles.kicker}>Le guide Parrainio</p>
              <h2>Bien choisir son offre de <em>parrainage.</em></h2>
              <p>Une offre de parrainage permet à un nouveau client de profiter d&apos;une prime lorsqu&apos;il s&apos;inscrit grâce à un client existant. Parrainio rassemble ces bons plans et présente clairement les montants, les conditions et les étapes à suivre.</p>
              <p>Après validation du parrainage par le partenaire, Parrainio reverse jusqu&apos;à 25 % de la commission reçue. Comparez les offres selon la prime partenaire, le délai, les conditions et le reversement potentiel pour choisir celle qui correspond à votre situation.</p>
            </div>
            <div className={styles.faqCard}>
              <h2>Questions fréquentes</h2>
              <details open><summary>Comment fonctionne une offre de parrainage ?</summary><p>Inscrivez-vous via le parcours indiqué, respectez les conditions du partenaire, puis faites confirmer votre parrainage auprès de Parrainio.</p></details>
              <details><summary>Comment fonctionne le reversement Parrainio ?</summary><p>Après confirmation du parrainage, Parrainio reverse jusqu&apos;à 25 % de la commission reçue.</p></details>
              <details><summary>Quand reçoit-on le reversement Parrainio ?</summary><p>Le reversement intervient après la validation du parrainage par le partenaire et la confirmation auprès de Parrainio.</p></details>
              <details><summary>Comment choisir la meilleure offre de parrainage ?</summary><p>Comparez la prime, les conditions, le délai de validation et le reversement potentiel avant de vous lancer.</p></details>
            </div>
          </div>
        </div>
      </section>

      {/* READING */}
      <section className={styles.readingSection}>
        <div className={styles.container}>
          <div className={styles.readingCard}>
            <div>
              <p className={styles.kicker}>
                Toujours plus clair
              </p>

              <h2>
                Tout ce qu&apos;il faut savoir,{" "}
                <em>avant de choisir.</em>
              </h2>

              <p>
                Chaque offre détaille son fonctionnement,
                ses conditions et les montants potentiels.
                Vous gardez toutes les informations utiles
                sous les yeux.
              </p>
            </div>

            <div className={styles.readingPoints}>
              <p>
                <span>
                  <Icon name="search" size={20} />
                </span>

                <strong>
                  Une lecture rapide
                  <small>
                    Les éléments importants sont regroupés.
                  </small>
                </strong>
              </p>

              <p>
                <span>
                  <Icon name="gift" size={20} />
                </span>

                <strong>
                  Des montants distincts
                  <small>
                    Votre gain partenaire et le reversement Parrainio sont
                    séparés.
                  </small>
                </strong>
              </p>

              <p>
                <span>
                  <Icon name="check" size={20} />
                </span>

                <strong>
                  Les conditions visibles
                  <small>
                    À consulter avant de profiter d&apos;une
                    offre.
                  </small>
                </strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <span
              className={styles.ctaCoin}
              aria-hidden="true"
            >
              €
            </span>

            <div>
              <p className={styles.kicker}>
                Le principe Parrainio
              </p>

              <h2>
                La prime partenaire,{" "}
                <em>et potentiellement plus.</em>
              </h2>

              <p>
                Découvrez comment fonctionne le
                reversement Parrainio.
              </p>
            </div>

            <Link
              href="/pourquoi-parrainio"
              className={styles.ctaButton}
            >
              Voir nos avantages
              <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div>
              <Link
                href="/"
                className={styles.footerLogo}
              >
                <span className={styles.logoMark}>
                  P
                </span>
                Parrainio
              </Link>

              <p>
                Le nouveau réflexe pour découvrir et
                profiter des offres de parrainage.
              </p>
            </div>

            <div>
              <h3>Découvrir</h3>

              <Link href="/">
                Accueil
              </Link>

              <Link href="/classement-primes-parrainage">
                Classement des primes
              </Link>

              <Link href="/pourquoi-parrainio">
                Comment ça marche
              </Link>
            </div>

            <div>
              <h3>Parrainio</h3>

              <Link href="/pourquoi-parrainio">
                Nos avantages
              </Link>

              <a href="mailto:parrainage@parrainio.fr">
                Contact
              </a>
            </div>

            <div>
              <h3>Informations légales</h3>

              <Link href="/mentions-legales">
                Mentions légales
              </Link>

              <Link href="/confidentialite">
                Politique de confidentialité
              </Link>

              <Link href="/cgu">
                Conditions générales
              </Link>
            </div>
          </div>

          <div className={styles.footerBottom}>
            © 2026 Parrainio. Tous droits réservés.
          </div>
        </div>
      </footer>
    </main>
  );
}