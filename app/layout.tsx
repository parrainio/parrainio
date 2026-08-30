import "./globals.css";

export const metadata = {
  title: "Parrainio — Le nouveau réflexe pour vos parrainages",
  description:
    "Découvrez les meilleures offres de parrainage et récupérez jusqu'à 25 % de votre avantage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<html lang="fr" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}