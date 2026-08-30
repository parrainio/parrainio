"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./PublicHeader.module.css";

export default function CategoryMenu({ categories }: { categories: string[] }) {
  const [open, setOpen] = useState(false);
  return <div className={styles.categoriesMenu} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
    <button type="button" className={`${styles.categoryTrigger} ${open ? styles.categoryTriggerOpen : ""}`} aria-expanded={open} onClick={() => setOpen((value) => !value)}>Catégories <span aria-hidden="true">⌄</span></button>
    {open && <div className={styles.categoryDropdown} onClick={() => setOpen(false)}>{categories.map((category) => <Link key={category} href={`/offres?category=${encodeURIComponent(category)}#offres`}>{category}</Link>)}</div>}
  </div>;
}
