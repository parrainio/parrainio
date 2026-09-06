"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./PublicHeader.module.css";

type OffersMenuProps = {
  categories: string[];
  hubSlugByCategory: Record<string, string>;
  active?: boolean;
};

/**
 * « Offres ▾ » — top-level navigation item.
 * The label itself stays a normal link to /offres; the arrow is a separate
 * toggle that opens the existing category hub links.
 * Desktop: hover opens, click-outside / Escape closes, keyboard reachable.
 * Mobile: the arrow is the explicit tap target (no long-press), « Offres »
 * remains a normal link.
 */
export default function OffersMenu({ categories, hubSlugByCategory, active }: OffersMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = () => {
    cancelClose();
    setOpen(true);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      closeTimer.current = null;
    }, 400);
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => () => cancelClose(), []);

  return (
    <div
      ref={rootRef}
      className={styles.categoriesMenu}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <span className={styles.offersItem}>
        <Link href="/offres" className={`${styles.offersLink} ${active ? styles.active : ""}`}>Offres</Link>
        <button
          type="button"
          className={`${styles.categoryTrigger} ${open ? styles.categoryTriggerOpen : ""}`}
          aria-expanded={open}
          aria-label="Choisir une catégorie d'offres"
          onClick={() => { cancelClose(); setOpen((value) => !value); }}
        >
          <span aria-hidden="true">▾</span>
        </button>
        <div className={styles.categoryDropdown} hidden={!open}>
          {categories.map((category) => {
            const hubSlug = hubSlugByCategory[category];
            const href = hubSlug ? `/categories/${hubSlug}` : `/offres?category=${encodeURIComponent(category)}#offres`;
            return <Link key={category} href={href} onClick={() => setOpen(false)}>{category}</Link>;
          })}
        </div>
      </span>
    </div>
  );
}
