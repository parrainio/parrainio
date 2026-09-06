import Link from "next/link";
import { offers } from "@/data/offers";
import { CATEGORY_HUBS } from "@/lib/categoryHubs";
import OffersMenu from "./OffersMenu";
import styles from "./PublicHeader.module.css";

type PublicHeaderProps = { active?: "home" | "offers" | "how" | "faq" | "advantages" | "blog" | "ranking" | "reviews" | "favorites" };

export default function PublicHeader({ active }: PublicHeaderProps) {
  const categories = Array.from(new Set(offers.map((offer) => offer.categoryGroup)));
  const hubSlugByCategory = Object.fromEntries(
    CATEGORY_HUBS.map((hub) => [hub.group, hub.slug] as const)
  );
  const links = [
    ["home", "Accueil", "/"],
    ["ranking", "Classement", "/classement-primes-parrainage"],
    ["reviews", "Avis clients", "/avis-clients"],
    ["blog", "Guide", "/blog"],
    ["faq", "FAQ", "/#faq"],
    ["how", "Pourquoi Parrainio ?", "/pourquoi-parrainio"],
  ] as const;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <Link href="/" className={styles.logo} aria-label="Parrainio, accueil"><span className={styles.logoMark}>P</span><span>Parrainio</span></Link>
          <nav className={styles.nav} aria-label="Navigation principale">
            {links.slice(0, 1).map(([key, label, href]) => <Link key={key} href={href} className={active === key ? styles.active : ""}>{label}</Link>)}
            <OffersMenu categories={categories} hubSlugByCategory={hubSlugByCategory} active={active === "offers"} />
            {links.slice(1).map(([key, label, href]) => <Link key={key} href={href} className={active === key ? styles.active : ""}>{label}</Link>)}
          </nav>
          <Link href="/offres" className={styles.cta}>Voir les offres <span>→</span></Link>
        </div>

      </div>
    </header>
  );
}
