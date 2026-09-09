"use client";

import Link from "next/link";
import type { SVGProps } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  getFavorites,
  initFavorites,
  isFavorite,
  removeFavorite,
  subscribeFavorites,
} from "@/lib/favorites";
import { offers } from "@/data/offers";
import OfferRewards from "@/components/OfferRewards";
import OfferLogo from "@/components/OfferLogo";
import FavoriteButton from "@/components/FavoriteButton";
import PublicHeader from "@/components/PublicHeader";
import SiteFooter from "@/components/SiteFooter";
import FavoritesDock from "@/components/FavoritesDock";
import styles from "@/app/offres/page.module.css";
import dockStyles from "@/components/FavoritesDock.module.css";

/**
 * Page « Mes offres favorites » (/favoris) — contenu 100 % navigateur
 * (localStorage via lib/favorites), sans compte.
 *
 * - cartes identiques à celles du catalogue (mêmes classes CSS, mêmes
 *   composants) ;
 * - retrait possible directement depuis la page ;
 * - page noindex : aucune donnée SEO, contenu vide côté serveur.
 *
 * Note : le contenu étant client-only, aucune donnée n'est accessible sans
 * JavaScript — c'est le même compromis que le panneau et les cœurs.
 */

type IconName = "arrow" | "info" | "check";

function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const props: SVGProps<SVGSVGElement> = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  if (name === "arrow") {
    return (
      <svg {...props}>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    );
  }
  if (name === "info") {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8h.01M12 11v5" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function FavorisPage() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => setSlugs(initFavorites().filter((slug) => isFavorite(slug)));
    sync();
    setHydrated(true);
    return subscribeFavorites(sync);
  }, []);

  const favorites = useMemo(
    () =>
      slugs
        .map((slug) => offers.find((offer) => offer.slug === slug))
        .filter((offer): offer is (typeof offers)[number] => Boolean(offer)),
    [slugs]
  );

  return (
    <main className={styles.page}>
      <PublicHeader />
      <FavoritesDock />

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span />
              Mes offres favorites
            </p>
            <h1>
              Vos offres, <em>en un coup d’œil.</em>
            </h1>
            <p>
              Retrouvez ici toutes les offres que vous avez enregistrées, stockées dans
              ce navigateur. Aucun compte n&apos;est nécessaire.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.offersSection} id="offres">
        <div className={styles.container}>
          {!hydrated ? (
            <div className={styles.emptyState}>
              <strong>Chargement de vos favoris…</strong>
            </div>
          ) : favorites.length === 0 ? (
            <div className={styles.emptyState}>
              <strong>Aucun favori pour le moment</strong>
              <p>Enregistrez vos offres préférées grâce au cœur présent sur chaque carte.</p>
              <Link href="/offres" className={styles.primaryButton}>
                Découvrir les offres <Icon name="arrow" size={18} />
              </Link>
            </div>
          ) : (
            <>
              <div className={styles.sectionHead}>
                <div>
                  <p className={styles.kicker}>Offres enregistrées</p>
                  <h2>
                    {favorites.length === 1
                      ? "1 offre enregistrée"
                      : `${favorites.length} offres enregistrées`}
                  </h2>
                </div>
              </div>
              <div className={styles.offersGrid}>
                {favorites.map((offer) => {
                  return (
                    <article className={styles.offerCard} key={offer.slug}>
                      <div className={styles.offerTop}>
                        <div className={styles.brand}>
                          <OfferLogo
                            name={offer.name}
                            logo={offer.logo}
                            color={offer.color}
                            logoLetter={offer.logoLetter}
                            size={44}
                          />
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

                      <p className={styles.description}>{offer.description}</p>

                      <OfferRewards offer={offer} />

                      <p className={styles.condition}>
                        <Icon name="check" size={15} />
                        Selon les conditions de l&apos;offre
                      </p>

                      <Link href={`/offres/${offer.slug}`} className={styles.offerLink}>
                        Voir l&apos;offre {offer.name}
                        <Icon name="arrow" size={17} />
                      </Link>
                    </article>
                  );
                })}
              </div>
            </>
          )}

          <div className={dockStyles.browseAgain}>
            <Link href="/offres" className={styles.secondaryButton}>
              Revenir aux offres
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
