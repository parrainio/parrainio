import Link from "next/link";
import { offers } from "@/data/offers";
import { CATEGORY_HUBS } from "@/lib/categoryHubs";
import OffersMenu from "./OffersMenu";
import styles from "./PublicHeader.module.css";

type PublicHeaderProps = { active?: "home" | "offers" | "how" | "faq" | "advantages" | "blog" | "ranking" | "reviews" | "favorites" | "codes"; campaignActive?: boolean };

export default function PublicHeader({ active, campaignActive = false }: PublicHeaderProps) {
  const categories = Array.from(new Set(offers.map((offer) => offer.categoryGroup)));
  const hubSlugByCategory = Object.fromEntries(
    CATEGORY_HUBS.map((hub) => [hub.group, hub.slug] as const)
  );
  const links = [
    ["home", "Accueil", "/"],
    ["codes", "Codes de parrainage", "/codes-parrainage"],
    ["ranking", "Meilleures primes", "/classement-primes-parrainage"],
    ["reviews", "Avis clients", "/avis-clients"],
    ["blog", "Guide", "/blog"],
  ] as const;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <Link href="/" className={styles.logo} aria-label="Parrainio, accueil"><span className={styles.logoMark}>P</span><span>Parrainio</span></Link>
          <nav className={styles.nav} aria-label="Navigation principale">
            {links.slice(0, 1).map(([key, label, href]) => <Link key={key} href={href} className={active === key ? styles.active : ""}>{label}</Link>)}
            <OffersMenu categories={categories} hubSlugByCategory={hubSlugByCategory} active={active === "offers"} />
            {campaignActive ? <Link href="/offres-boostees" className={styles.campaignNav}>Boostées</Link> : null}
            {links.slice(1).map(([key, label, href]) => <Link key={key} href={href} className={active === key ? styles.active : ""}>{label}</Link>)}
          </nav>
          <Link href="/offres" className={styles.cta}>Voir les offres <span>→</span></Link>
        </div>

      </div>
    </header>
  );
}
