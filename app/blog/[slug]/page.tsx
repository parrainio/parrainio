import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicHeader from "@/components/PublicHeader";
import SiteFooter from "@/components/SiteFooter";
import { OG_IMAGE } from "@/lib/ogImage";
import { SITE_URL } from "@/lib/siteUrl";
import {
  blogArticles,
  formatBlogDate,
  getBlogArticle,
  type BlogArticle,
  type BlogBlock,
} from "@/data/blogArticles";
import styles from "./page.module.css";
import {
  ArticleImage,
  ChecklistBox,
  Callout,
  IconCards,
  ProcessFlow,
  SubscriptionFigure,
} from "@/components/BlogVisuals";

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} | ${article.titleSuffix ?? "Blog Parrainio"}`,
    description: article.excerpt,
    alternates: { canonical: `${SITE_URL}/blog/${article.slug}` },
    openGraph: {
      url: `/blog/${article.slug}`,
      type: "article",
      siteName: "Parrainio",
      locale: "fr_FR",
      title: `${article.title} | ${article.titleSuffix ?? "Blog Parrainio"}`,
      description: article.excerpt,
      publishedTime: article.dateModified
        ? undefined
        : article.datePublished,
      modifiedTime: article.dateModified,
      images: [OG_IMAGE],
    },
  };
}

/** Rend le texte avec liens internes au format [ancre](/chemin). */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
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
    </>
  );
}

/** Rend un bloc de contenu d'article (paragraphe, sous-titre ou liste). */
function ArticleBlock({ block }: { block: BlogBlock }) {
  if (typeof block === "string" || block.type === "p") {
    const text = typeof block === "string" ? block : block.text;
    return (
      <p>
        <Inline text={text} />
      </p>
    );
  }
  if (block.type === "h2") {
    return <h2>{block.text}</h2>;
  }
  if (block.type === "list") {
    const ListTag = block.ordered ? "ol" : "ul";
    return (
      <ListTag>
        {block.items.map((item) => (
          <li key={item.slice(0, 60)}>
            <Inline text={item} />
          </li>
        ))}
      </ListTag>
    );
  }
  /* Blocs visuels génériques du blog */
  if (block.type === "figure") {
    if (block.variant === "subscriptions") return <SubscriptionFigure />;
    return null;
  }
  if (block.type === "image") {
    return <ArticleImage src={block.src} alt={block.alt} caption={block.caption} />;
  }
  if (block.type === "process") {
    return <ProcessFlow steps={block.steps} />;
  }
  if (block.type === "cards") {
    return <IconCards items={block.items} />;
  }
  if (block.type === "callout") {
    return <Callout title={block.title} text={block.text} items={block.items} />;
  }
  if (block.type === "checklist") {
    return <ChecklistBox items={block.items} />;
  }
  return null;
}

function relatedArticles(article: BlogArticle) {
  const others = blogArticles.filter((candidate) => candidate.slug !== article.slug);
  const sameCategory = others.filter(
    (candidate) => candidate.category === article.category,
  );
  const rest = others.filter((candidate) => candidate.category !== article.category);
  return [...sameCategory, ...rest].slice(0, 3);
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) notFound();

  const related = relatedArticles(article);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Guides & astuces", item: `${SITE_URL}/blog` },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: `${SITE_URL}/blog/${article.slug}`,
          },
        ],
      },
      {
        "@type": "Article",
        headline: article.title,
        description: article.excerpt,
        datePublished: article.datePublished,
        ...(article.dateModified ? { dateModified: article.dateModified } : {}),
        mainEntityOfPage: `${SITE_URL}/blog/${article.slug}`,
        image: `${SITE_URL}${OG_IMAGE.url}`,
        author: {
          "@type": "Organization",
          name: "Parrainio",
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "Parrainio",
          url: SITE_URL,
        },
      },
    ],
  };

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicHeader active="blog" />

      {/* HERO ARTICLE */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">→</span>
            <Link href="/blog">Guides & astuces</Link>
            <span aria-hidden="true">→</span>
            <strong>{article.title}</strong>
          </nav>
          <span className={styles.categoryPill}>{article.category}</span>
          <h1>{article.h1 ?? article.title}</h1>
          <p className={styles.articleDates}>
            Publié le {formatBlogDate(article.datePublished)}
            {article.dateModified && (
              <> · Mis à jour le {formatBlogDate(article.dateModified)}</>
            )}
          </p>
          <p className={styles.lead}>{article.excerpt}</p>
        </div>
      </section>

      {/* CONTENU */}
      <section className={styles.section}>
        <div className={styles.container}>
          <article className={styles.articleBody}>
            {article.body.map((block, index) => (
              <ArticleBlock key={index} block={block} />
            ))}
          </article>
        </div>
      </section>

      {/* ARTICLES CONNEXES */}
      {related.length > 0 && (
        <section className={styles.sectionAlt}>
          <div className={styles.container}>
            <div className={styles.sectionHead}>
              <h2>
                À lire <em>aussi</em>
              </h2>
            </div>
            <div className={styles.relatedGrid}>
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className={styles.relatedCard}
                >
                  <span>{item.category}</span>
                  <strong>{item.title}</strong>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div>
              <h2>
                Prêt à passer <em>à l&apos;action ?</em>
              </h2>
              <p>
                Comparez les offres de parrainage actuelles et leurs conditions
                sur le catalogue Parrainio.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <Link href="/offres" className={styles.primaryButton}>
                Voir toutes les offres
              </Link>
              <Link href="/blog" className={styles.secondaryButton}>
                Retour aux guides →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}