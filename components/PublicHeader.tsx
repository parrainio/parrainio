import Link from "next/link";
import { offers } from "@/data/offers";
import { CATEGORY_HUBS } from "@/lib/categoryHubs";
import CategoryMenu from "./CategoryMenu";
import styles from "./PublicHeader.module.css";

type PublicHeaderProps = { active?: "home" | "offers" | "how" | "faq" | "advantages" | "blog" | "ranking" };

export default function PublicHeader({ active }: PublicHeaderProps) {
  const categories = Array.from(new Set(offers.map((offer) => offer.categoryGroup)));
  const hubSlugByCategory = Object.fromEntries(
    CATEGORY_HUBS.map((hub) => [hub.group, hub.slug] as const)
  );
  const links = [
    ["home", "Accueil", "/"],
    ["offers", "Offres", "/offres"],
    ["ranking", "Classement", "/classement-primes-parrainage"],
    ["blog", "Guides & astuces", "/blog"],
    ["how", "Comment ça marche", "/comment-ca-marche"],
    ["faq", "FAQ", "/#faq"],
    ["advantages", "Nos avantages", "/nos-avantages"],
  ] as const;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <Link href="/" className={styles.logo} aria-label="Parrainio, accueil"><span className={styles.logoMark}>P</span><span>Parrainio</span></Link>
          <nav className={styles.nav} aria-label="Navigation principale">
            {links.slice(0, 1).map(([key, label, href]) => <Link key={key} href={href} className={active === key ? styles.active : ""}>{label}</Link>)}
            <CategoryMenu categories={categories} hubSlugByCategory={hubSlugByCategory} />
            {links.slice(1).map(([key, label, href]) => <Link key={key} href={href} className={active === key ? styles.active : ""}>{label}</Link>)}
          </nav>
          <Link href="/offres" className={styles.cta}>Voir les offres <span>→</span></Link>
        </div>

      </div>
    </header>
  );
}
