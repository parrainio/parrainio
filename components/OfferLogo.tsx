import type { CSSProperties } from "react";

type OfferLogoProps = {
  name: string;
  logo: string | null;
  color: string;
  logoLetter: string;
  size?: number;
  className?: string;
};

export default function OfferLogo({
  name,
  logo,
  color,
  logoLetter,
  size = 40,
  className,
}: OfferLogoProps) {
  const style: CSSProperties = {
    width: size,
    height: size,
    borderRadius: Math.max(10, Math.round(size * 0.28)),
    backgroundColor: logo ? "#fff" : color,
    color: "#fff",
    display: "grid",
    placeItems: "center",
    overflow: "hidden",
    flex: "none",
    boxShadow: "0 6px 14px rgba(23,61,53,.10)",
    border: logo ? "1px solid rgba(20,65,55,.08)" : "0",
  };

  if (logo) {
    return (
      <span className={className} style={style}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          src={logo}
          style={{ width: "72%", height: "72%", objectFit: "contain" }}
        />
      </span>
    );
  }

  return (
    <span className={className} style={{ ...style, fontWeight: 800, fontSize: size * 0.38 }} aria-hidden>
      {logoLetter}
    </span>
  );
}
