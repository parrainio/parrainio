"use client";

import type { ChangeEvent } from "react";
import styles from "./OfferSearch.module.css";

export function normalizeOfferSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export default function OfferSearch({ value, onChange, placeholder = "Rechercher une offre..." }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }

  return <label className={styles.search}>
    <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
    <span className="sr-only">Rechercher une offre</span>
    <input value={value} onChange={handleChange} placeholder={placeholder} type="search" />
  </label>;
}
