import Link from "next/link";
import type { Metadata } from "next";
import { CATEGORY_HUBS, getCategoryHub } from "@/lib/categoryHubs";
import { getCategoryHubOffers } from "@/lib/categoryHubOffers";
import { SITE_URL } from "@/lib/siteUrl";
import { OG_IMAGE } from "@/lib/ogImage";
import CategoryHub from "./CategoryHub";
import styles from "../page.module.css";

type HubParams = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CATEGORY_HUBS.map((hub) => ({ slug: hub.slug }));
}

export async function generateMetadata({ params }: HubParams): Promise<Metadata> {
  const { slug } = await params;
  const hub = getCategoryHub(slug);

  if (!hub) {
    return {
      title: "Catégorie introuvable | Parrainio",
      description: "Cette catégorie d'offres de parrainage n'existe pas sur Parrainio.",
    };
  }

  return {
    title: hub.title,
    description: hub.metaDescription,
    alternates: { canonical: `${SITE_URL}/categories/${hub.slug}` },
    openGraph: {
      title: hub.title,
      description: hub.metaDescription,
      url: `/categories/${hub.slug}`,
      type: "website",
      siteName: "Parrainio",
      locale: "fr_FR",
      images: [OG_IMAGE],
    },
  };
}

export default async function CategoryHubPage({ params }: HubParams) {
  const { slug } = await params;
  const hub = getCategoryHub(slug);

  if (!hub) {
    return <CategoryHubNotFound />;
  }

  return <CategoryHub hub={hub} offers={getCategoryHubOffers(hub.group)} />;
}

function CategoryHubNotFound() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 style={{ padding: "80px 0" }}>
            Cette catégorie n&apos;existe pas (encore).{" "}
            <Link href="/offres">Voir toutes les offres</Link>
          </h1>
        </div>
      </section>
    </main>
  );
}
