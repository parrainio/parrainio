import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // « Comment ça marche » + « Nos avantages » are merged into one
      // destination: /pourquoi-parrainio. Permanent redirects preserve the
      // existing URLs' SEO equity and keep any external link working.
      { source: "/comment-ca-marche", destination: "/pourquoi-parrainio", permanent: true },
      { source: "/nos-avantages", destination: "/pourquoi-parrainio", permanent: true },
      // « Baromètre du parrainage » renamed to « Les chiffres du parrainage 2026 »:
      // permanent redirect preserves the previously published URL's SEO equity.
      { source: "/barometre-parrainage", destination: "/chiffres-parrainio-2026", permanent: true },
    ];
  },
};

export default nextConfig;
