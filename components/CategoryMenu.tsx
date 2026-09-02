"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./PublicHeader.module.css";

export default function CategoryMenu({ categories }: { categories: string[] }) {
  const [open, setOpen] = useState(false);
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

  useEffect(() => () => cancelClose(), []);

  return <div className={styles.categoriesMenu} onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
    <button type="button" className={`${styles.categoryTrigger} ${open ? styles.categoryTriggerOpen : ""}`} aria-expanded={open} onClick={() => { cancelClose(); setOpen((value) => !value); }}>Catégories <span aria-hidden="true">⌄</span></button>
    <div className={styles.categoryDropdown} hidden={!open}>{categories.map((category) => <Link key={category} href={`/offres?category=${encodeURIComponent(category)}#offres`}>{category}</Link>)}</div>
  </div>;
}
