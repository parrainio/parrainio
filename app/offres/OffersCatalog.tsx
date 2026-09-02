"use client";

import Link from "next/link";
import type { SVGProps } from "react";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { type Offer } from "@/data/offers";
import PublicHeader from "@/components/PublicHeader";
import OfferRewards from "@/components/OfferRewards";
import OfferLogo from "@/components/OfferLogo";
import OfferSearch, { normalizeOfferSearch } from "@/components/OfferSearch";
import { SELECTION_DU_MOMENT } from "@/data/featuredOffersConfig";
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

  const filteredOffers = useMemo(() => {
    const query = normalizeOfferSearch(search);
    return offers.filter((offer) => {
      const matchesCategory = activeCategory === "Toutes" || offer.categoryGroup === activeCategory;
      const searchable = normalizeOfferSearch(`${offer.name} ${offer.slug}`);
      return matchesCategory && (!query || searchable.includes(query));
    });
  }, [activeCategory, offers, search]);

  const featuredSlugs = SELECTION_DU_MOMENT;
  const featuredOffers = featuredSlugs
    .map((slug) => offers.find((offer) => offer.slug === slug))
    .filter((offer): offer is Offer => Boolean(offer));

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Offres de parrainage Parrainio",
    itemListElement: offers.map((offer, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: offer.name,
      url: `https://parrainio.fr/offres/${offer.slug}`,
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
                Offres de parrainage : <em>primes et bons plans.</em>
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
                  href="/nos-avantages"
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
              aria-label="Une offre Parrainio clairement détaillée"
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
                    <span className={styles.visualMark}>P</span>

                    <div>
                      <strong>Parrainio</strong>
                      <small>Vue d&apos;ensemble</small>
                    </div>
                  </div>

                  <span>Simple à lire</span>
                </div>

                <div className={styles.visualLine} />

                <p className={styles.visualLabel}>
                  Une offre, en clair
                </p>

                <p className={styles.visualAmount}>
                  200 <small>€</small>
                </p>

                <div className={styles.visualRows}>
                  <div>
                    <span>VOUS GAGNEZ</span>
                    <strong>200 €</strong>
                  </div>

                  <div>
                    <span>Reversement potentiel</span>
                    <strong>+50 €</strong>
                  </div>
                </div>

                <div className={styles.visualTotal}>
                  <span>Avantage potentiel</span>
                  <strong>250 €</strong>
                </div>
              </div>

              <span
                className={styles.coin}
                aria-hidden="true"
              >
                €
              </span>
              <div className={styles.visualBadge}>
                <Icon name="gift" size={18} />
                <span>Jusqu&apos;à <strong>25 %</strong><br />de notre commission</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OFFRES */}
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <div className={styles.featuredCompactRow}>
            <h2><span>SÉLECTION DU</span> <em>MOMENT</em></h2>
            <div className={styles.featuredGrid}>
            {featuredOffers.map((offer) => (
              <article className={styles.featuredCard} key={offer.slug}>
                <div className={styles.featuredBrand}>
                  <OfferLogo name={offer.name} logo={offer.logo} color={offer.color} logoLetter={offer.logoLetter} size={38} />
                  <div><small>{offer.categoryGroup}</small><h3>{offer.name}</h3></div>
                </div>
                <OfferRewards offer={offer} compact />
                <Link href={`/offres/${offer.slug}`} className={styles.featuredCta}>Voir l&apos;offre <Icon name="arrow" size={16} /></Link>
              </article>
            ))}
            </div>
          </div>
        </div>
      </section>

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

          <OfferSearch value={search} onChange={setSearch} />

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

                    <span className={styles.available}>
                      <i />
                      Disponible
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
                    Voir l&apos;offre
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
                {search ? "Aucune offre trouvée." : "Aucune offre dans cette catégorie"}
              </strong>

              <span>
                De nouvelles offres arriveront
                prochainement.
              </span>

              <button
                type="button"
                className={styles.emptyLink}
                onClick={() =>
                  setActiveCategory("Toutes")
                }
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
              href="/nos-avantages"
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

              <Link href="/comment-ca-marche">
                Comment ça marche
              </Link>
            </div>

            <div>
              <h3>Parrainio</h3>

              <Link href="/nos-avantages">
                Nos avantages
              </Link>

              <a href="mailto:contact@parrainio.fr">
                Contact
              </a>
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