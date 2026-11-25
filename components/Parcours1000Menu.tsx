"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./PublicHeader.module.css";

type Parcours1000MenuProps = { active?: boolean };

export default function Parcours1000Menu({ active }: Parcours1000MenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<CSSProperties>({});
  const menuId = "parcours-1000-menu";

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      closeTimer.current = null;
    }, 350);
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const positionDropdown = () => {
      const trigger = toggleRef.current;
      if (!trigger) return;
      const bounds = trigger.getBoundingClientRect();
      const gutter = 16;
      const width = Math.min(340, window.innerWidth - gutter * 2);
      const left = Math.min(Math.max(bounds.left + bounds.width / 2 - width / 2, gutter), window.innerWidth - width - gutter);
      const arrowLeft = Math.max(8, Math.min(bounds.left + bounds.width / 2 - left - 5, width - 18));
      setDropdownPosition({ left, top: bounds.bottom + 8, width, "--dropdown-arrow-left": `${arrowLeft}px` } as CSSProperties);
    };
    positionDropdown();
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", positionDropdown);
    window.addEventListener("scroll", positionDropdown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", positionDropdown);
      window.removeEventListener("scroll", positionDropdown, true);
    };
  }, [open]);

  useEffect(() => () => cancelClose(), []);

  return (
    <div
      ref={rootRef}
      className={styles.parcoursMenu}
      onMouseEnter={() => {
        if (window.innerWidth > 900 && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          cancelClose();
          setOpen(true);
        }
      }}
      onMouseLeave={() => {
        if (window.innerWidth > 900 && window.matchMedia("(hover: hover) and (pointer: fine)").matches) scheduleClose();
      }}
    >
      <Link href="/offres?prime=100#offres" className={styles.parcoursLink} onClick={() => setOpen(false)}>
        Gagner 100 €
      </Link>
      <Link
        href="/gagner-1000-euros"
        className={`${styles.parcoursLink} ${styles.parcoursLinkMain}`}
        aria-current={active ? "page" : undefined}
      >
        Gagner 1 000 €
      </Link>
      <button
        ref={toggleRef}
        type="button"
        className={`${styles.parcoursToggle} ${open ? styles.parcoursToggleOpen : ""}`}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label="Afficher les deux parcours pour gagner plus de 1 000 euros"
        onClick={() => {
          cancelClose();
          const desktopHover = window.innerWidth > 900 && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
          if (desktopHover) setOpen(true);
          else setOpen((value) => !value);
        }}
      >
        <span aria-hidden="true">▾</span>
      </button>
      <div id={menuId} className={styles.parcoursDropdown} style={dropdownPosition} hidden={!open}>
        <Link href="/parcours-a" onClick={() => setOpen(false)}>
          <span>Parcours A</span>
          <small>Le parcours classique</small>
        </Link>
        <Link href="/parcours-b" onClick={() => setOpen(false)}>
          <span>Parcours B</span>
          <small>Le parcours alternatif</small>
        </Link>
      </div>
    </div>
  );
}
