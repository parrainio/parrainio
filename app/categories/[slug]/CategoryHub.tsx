"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Offer } from "@/data/offers";
import PublicHeader from "@/components/PublicHeader";
import OfferSearch, { normalizeOfferSearch } from "@/components/OfferSearch";
import OfferLogo from "@/components/OfferLogo";
import OfferRewards from "@/components/OfferRewards";
import type { CategoryHubContent } from "@/lib/categoryHubs";
import { SITE_URL } from "@/lib/siteUrl";
import styles from "../page.module.css";

type CategoryHubProps = {
  hub: CategoryHubContent;
  offers: Offer[];
};

function ArrowIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="17" viewBox="0 0 24 24" width="17">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" strokeWidth="1.9" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.9" />
      <path d="M12 11v5m0-8h.01" strokeLinecap="round" stroke="currentColor" strokeWidth="1.9" />
    </svg>
  );
}

/**
 * Rendu d'un paragraphe éditorial avec liens inline au format [ancre](/chemin).
 * Aucun autre formatage n'est supporté : les hubs restent des textes sobres.
 */
function EditorialParagraph({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <p>
      {parts.map((part, index) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!match) return <span key={index}>{part}</span>;
        const [, anchor, href] = match;
        return (
          <Link key={index} href={href}>
            {anchor}
          </Link>
        );
      })}
    </p>
  );
}

export default function CategoryHub({ hub, offers }: CategoryHubProps) {
  const [search, setSearch] = useState("");
  const filteredOffers = useMemo(() => {
    const query = normalizeOfferSearch(search);
    return offers.filter((offer) => !query || normalizeOfferSearch(`${offer.name} ${offer.slug}`).includes(query));
  }, [offers, search]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Offres", item: `${SITE_URL}/offres` },
          { "@type": "ListItem", position: 3, name: hub.group, item: `${SITE_URL}/categories/${hub.slug}` },
        ],
      },
      {
        "@type": "CollectionPage",
        name: hub.title,
        description: hub.metaDescription,
        url: `${SITE_URL}/categories/${hub.slug}`,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: offers.map((offer, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: offer.name,
            url: `${SITE_URL}/offres/${offer.slug}`,
          })),
        },
      },
    ],
  };

  const [guideLead, ...guideRest] = hub.guideTitle.split(" ");
  const guideAccent = guideRest.pop() ?? "";
  const guideMain = [guideLead, ...guideRest].join(" ");

  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PublicHeader active="offers" />

      {/* HERO compact */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">→</span>
            <Link href="/offres">Offres</Link>
            <span aria-hidden="true">→</span>
            <strong>{hub.group}</strong>
          </nav>

          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span />
              Catégorie {hub.group}
            </p>

            <h1>
              {hub.h1Lead} <em>{hub.h1Accent}</em>
            </h1>

            <p>{hub.intro[0]}</p>

            <p className={styles.heroNote}>
              <InfoIcon />
              <span>
                Les montants et conditions varient selon les offres :
                chaque fiche détaille les conditions du partenaire.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* OFFRES */}
      <section className={styles.offersSection}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}>Les offres {hub.group.toLowerCase()}</p>
              <h2>
                Trouvez la vôtre parmi les offres{" "}
                <em>de la catégorie.</em>
              </h2>
            </div>

            <p>
              {filteredOffers.length} {filteredOffers.length > 1 ? "offres" : "offre"}
            </p>
          </div>

          <OfferSearch
            value={search}
            onChange={setSearch}
            className={styles.hubSearch}
          />

          {filteredOffers.length > 0 ? (
            <div className={styles.offersGrid}>
              {filteredOffers.map((offer) => (
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
                      <small>{offer.category}</small>
                      <h3>{offer.name}</h3>
                    </div>
                  </div>

                  <span className={styles.available}>
                    <i />
                    Disponible
                  </span>
                </div>

                <p className={styles.cardDescription}>{offer.description}</p>

                <div className={styles.cardRewards}>
                  <OfferRewards offer={offer} />
                </div>

                <Link href={`/offres/${offer.slug}`} className={styles.offerLink}>
                  Voir l&apos;offre {offer.name}
                  <ArrowIcon />
                </Link>
              </article>
            ))}
            </div>
          ) : (
            <div className={styles.searchEmpty}>
              <strong>Aucune offre trouvée.</strong>
              <span>
                Essayez un autre nom d&apos;offre dans les offres {hub.group.toLowerCase()}.
              </span>
            </div>
          )}

          <div className={styles.catalogLinks}>
            <Link href="/offres" className={styles.ctaButton}>
              Voir toutes les offres de parrainage
              <ArrowIcon />
            </Link>
            <Link
              href={`/offres?category=${encodeURIComponent(hub.group)}#offres`}
              className={styles.catalogFilterLink}
            >
              Ou filtrer directement les offres {hub.group} sur le catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* GUIDE / ÉDITORIAL */}
      <section className={styles.guideSection}>
        <div className={styles.container}>
          <div className={styles.guideGrid}>
            <div className={styles.guideCopy}>
              <p className={styles.kicker}>Le guide Parrainio</p>
              <h2>
                {guideMain} <em>{guideAccent}</em>
              </h2>
              {hub.intro.slice(1).map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
              {hub.editorial.map((paragraph) => (
                <EditorialParagraph key={paragraph.slice(0, 40)} text={paragraph} />
              ))}
              <EditorialParagraph text={hub.conclusion} />
            </div>

            <div className={styles.infoCard}>
              <h2>Bon à savoir</h2>
              {hub.infoCards.map((card) => (
                <div className={styles.infoCardItem} key={card.title}>
                  <strong>{card.title}</strong>
                  <p>{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AUTRES CATÉGORIES — liens croisés curatés */}
      <section className={styles.hubNavSection}>
        <div className={styles.container}>
          <p className={styles.hubNavHeading}>Explorer aussi nos autres catégories</p>
          <div className={styles.hubNav} aria-label="Autres catégories">
            {hub.hubLinks.map((link) => (
              <Link
                key={link.slug}
                href={`/categories/${link.slug}`}
                className={styles.hubNavLink}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/offres" className={styles.hubNavLink}>
              Toutes les offres
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div>
              <p className={styles.kicker}>Le principe Parrainio</p>
              <h2>
                La prime partenaire, <em>et potentiellement plus.</em>
              </h2>
              <p>
                Après validation du parrainage par le partenaire, Parrainio
                reverse jusqu&apos;à 25 % de la commission reçue. Comparez les
                offres, respectez les conditions, puis demandez votre reverse.
              </p>
            </div>

            <div className={styles.ctaActions}>
              <Link href="/comment-ca-marche" className={styles.ctaButton}>
                Comment ça marche
                <ArrowIcon />
              </Link>
              <Link href="/nos-avantages" className={styles.ctaButton}>
                Voir nos avantages
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div>
              <Link href="/" className={styles.footerLogo}>
                <span className={styles.logoMark}>P</span>
                Parrainio
              </Link>

              <p>
                Le nouveau réflexe pour découvrir et profiter des offres de
                parrainage.
              </p>
            </div>

            <div>
              <h3>Découvrir</h3>

              <Link href="/">Accueil</Link>
              <Link href="/comment-ca-marche">Comment ça marche</Link>
              <Link href="/offres">Offres</Link>
              <Link href="/classement-primes-parrainage">Classement des primes</Link>
            </div>

            <div>
              <h3>Parrainio</h3>

              <Link href="/nos-avantages">Nos avantages</Link>
              <a href="mailto:parrainage@parrainio.fr">Contact</a>
            </div>

            <div>
              <h3>Informations légales</h3>

              <Link href="/mentions-legales">Mentions légales</Link>
              <Link href="/confidentialite">Politique de confidentialité</Link>
              <Link href="/cgu">Conditions générales</Link>
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
