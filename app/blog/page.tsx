import Link from "next/link";
import type { Metadata } from "next";
import PublicHeader from "@/components/PublicHeader";
import SiteFooter from "@/components/SiteFooter";
import { OG_IMAGE } from "@/lib/ogImage";
import { SITE_URL } from "@/lib/siteUrl";
import { blogArticles, formatBlogDate } from "@/data/blogArticles";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Blog Parrainio : bons plans, parrainage et économies",
  description:
    "Le blog Parrainio explique le parrainage et les économies du quotidien : primes de bienvenue, cashback, bons plans et astuces pour dépenser moins, avec des conditions toujours vérifiées.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    url: "/blog",
    type: "website",
    siteName: "Parrainio",
    locale: "fr_FR",
    images: [OG_IMAGE],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Guides & astuces", item: `${SITE_URL}/blog` },
      ],
    },
    {
      "@type": "Blog",
      name: "Guides & astuces",
      description: metadata.description,
      url: `${SITE_URL}/blog`,
    },
  ],
};

export default function BlogIndexPage() {
  const articles = blogArticles;

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicHeader active="blog" />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">→</span>
            <strong>Guides & astuces</strong>
          </nav>
          <span className={styles.kicker}>
            <span />
            Guides & astuces
          </span>
          <h1>Guides & astuces pour profiter des offres de parrainage</h1>
          <p className={styles.lead}>
            Guides pratiques, comparatifs et astuces pour tirer le meilleur du
            parrainage et faire des économies au quotidien : primes de
            bienvenue, cashback, bons plans — avec des informations vérifiées
            et des conditions expliquées en clair.
          </p>
        </div>
      </section>

      {/* ARTICLES */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <h2>
              Les guides <em>récents</em>
            </h2>
            <p>
              De nouveaux contenus sont publiés régulièrement : conseils,
              explications et comparaisons pour économiser sans piège.
            </p>
          </div>

          {articles.length > 0 ? (
            <div className={styles.cardsGrid}>
              {articles.map((article) => (
                <article key={article.slug}>
                  <Link
                    href={`/blog/${article.slug}`}
                    className={styles.articleCard}
                  >
                    <span className={styles.cardCategory}>
                      {article.category}
                    </span>
                    <h3>{article.title}</h3>
                    <p>{article.excerpt}</p>
                    <span className={styles.cardMeta}>
                      <time dateTime={article.datePublished}>
                        {formatBlogDate(article.datePublished)}
                      </time>
                      <span className={styles.cardArrow}>Lire l&apos;article →</span>
                    </span>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <strong>Les premiers articles arrivent bientôt.</strong>
              <p>
                La rubrique Guides & astuces prend forme : explications sur le
                fonctionnement du parrainage, décryptage des primes et du
                cashback, et astuces pour économiser au quotidien y seront
                publiés prochainement.
              </p>
              <Link href="/offres" className={styles.emptyCta}>
                En attendant, découvrez les offres →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div>
              <h2>
                En attendant les articles, <em>comparez les offres.</em>
              </h2>
              <p>
                Le catalogue détaille les conditions de chaque offre, et les
                comparateurs réunissent les univers les plus recherchés.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <Link href="/offres" className={styles.primaryButton}>
                Voir toutes les offres
              </Link>
              <Link
                href="/classement-primes-parrainage"
                className={styles.secondaryButton}
              >
                Classement des primes →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}