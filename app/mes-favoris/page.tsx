import type { Metadata } from "next";
import PublicHeader from "@/components/PublicHeader";
import SiteFooter from "@/components/SiteFooter";
import FavoritesList from "./FavoritesList";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mes favoris | Parrainio",
  robots: { index: false, follow: false },
};

/**
 * « Mes favoris » — page fonctionnelle, sans contenu SEO :
 * le contenu provient uniquement du navigateur du visiteur (localStorage),
 * la page est noindex et absente du sitemap.
 */
export default function MesFavorisPage() {
  return (
    <main className={styles.page}>
      <PublicHeader active="favorites" />
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1>Mes favoris</h1>
          <p>
            Retrouvez ici les offres que vous avez ajoutées à vos favoris, enregistrées dans ce
            navigateur. Aucun compte n&apos;est nécessaire.
          </p>
        </div>
      </section>
      <section className={styles.listSection}>
        <div className={styles.container}>
          <FavoritesList />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
