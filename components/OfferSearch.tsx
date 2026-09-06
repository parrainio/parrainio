"use client";

import type { ChangeEvent } from "react";
import styles from "./OfferSearch.module.css";

export { normalizeOfferSearch } from "@/lib/offerFilters";

export default function OfferSearch({ value, onChange, placeholder = "Rechercher une offre", className }: { value: string; onChange: (value: string) => void; placeholder?: string; className?: string }) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }

  return <label className={[styles.search, className].filter(Boolean).join(" ")} aria-label="Rechercher une offre">
    <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
    <input value={value} onChange={handleChange} placeholder={placeholder} type="search" />
  </label>;
}
