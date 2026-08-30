import Link from "next/link";
import styles from "./page.module.css";

type DotProps = {
  x: number;
  y: number;
  size: number;
  color: string;
};

type CoinProps = {
  className?: string;
  size: number;
  rotation: string;
};

type ClassNameProps = {
  className?: string;
};

type TrustBlockProps = {
  number: string;
  title: string;
  text: string;
};

type MiniProofProps = {
  text: string;
};

type StepCardProps = {
  number: string;
  title: string;
  text: string;
};

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#faf9f5] text-[#17221e]">
      <header className="relative z-50 border-b border-[#17221e]/10 bg-[#faf9f5]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[82px] max-w-[1280px] items-center justify-between px-6 lg:px-8">
          <Link href="/" className="group">
            <div className="flex items-baseline">
              <span className="text-[29px] font-black tracking-[-2px]">parrainio</span>
              <span className="ml-[2px] text-[29px] font-black text-[#ee6a2c]">.</span>
            </div>
            <div className="-mt-1 text-[10px] font-semibold tracking-[0.18em] text-[#89938e]">
              LE PARRAINAGE AUTREMENT
            </div>
          </Link>

          <nav className="hidden items-center gap-10 text-[14px] font-semibold md:flex">
            <Link href="/offres" className="transition-colors duration-200 hover:text-[#176955]">
              Les offres
            </Link>
            <Link href="#concept" className="transition-colors duration-200 hover:text-[#176955]">
              Comment ça marche ?
            </Link>
            <Link href="#avantage" className="transition-colors duration-200 hover:text-[#176955]">
              Notre avantage
            </Link>
          </nav>

          <Link
            href="/offres"
            className="rounded-full bg-[#176955] px-6 py-3 text-[13px] font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-[1px] hover:bg-[#115846]"
          >
            Voir les offres
          </Link>
        </div>
      </header>

      <section className="relative">
        <div className="pointer-events-none absolute -left-[180px] top-[80px] h-[560px] w-[560px] rounded-full bg-[#e8f1e7] opacity-70 blur-[100px]" />
        <div className="pointer-events-none absolute right-[-180px] top-[10px] h-[500px] w-[500px] rounded-full bg-[#f8e6d5] opacity-60 blur-[100px]" />

        <div className="relative mx-auto max-w-[1280px] px-6 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_570px]">
            <div className="relative z-20 max-w-[700px]">
              <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-[#dce5df] bg-white/80 px-4 py-2 shadow-sm">
                <span className="relative flex h-[8px] w-[8px]">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#ee6a2c] opacity-25" />
                  <span className="relative h-[8px] w-[8px] rounded-full bg-[#ee6a2c]" />
                </span>
                <span className="text-[12px] font-bold tracking-[-0.1px] text-[#416055]">
                  Le parrainage évolue
                </span>
              </div>

              <h1 className="max-w-[720px] text-[56px] font-black leading-[.94] tracking-[-4px] sm:text-[70px] lg:text-[82px]">
                Trouvez.
                <br />
                <span className="text-[#176955]">Gagnez.</span>
                <br />
                <span className="relative inline-block">
                  Et récupérez <span className="relative ml-2 inline-block text-[#ee6a2c]">25 %</span>
                </span>
              </h1>

              <p className="mt-8 max-w-[630px] text-[17px] leading-[1.7] tracking-[-0.15px] text-[#6f7975] sm:text-[19px]">
                Retrouvez les meilleures offres de parrainage, au même endroit.
                <br className="hidden sm:block" />
                Et avec Parrainio, <strong className="font-bold text-[#1c2823]">25 % de notre commission vous revient.</strong>
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/offres"
                  className="group inline-flex h-[55px] items-center justify-center rounded-[16px] bg-[#ee6a2c] px-7 text-[14px] font-extrabold text-white shadow-lg transition-all duration-300 hover:-translate-y-[2px] hover:bg-[#e05e24]"
                >
                  Découvrir les offres
                  <span className="ml-4 text-[20px] transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href="#concept"
                  className="inline-flex h-[55px] items-center justify-center rounded-[16px] border border-[#dce3df] bg-white/70 px-7 text-[14px] font-bold text-[#34443d] shadow-sm transition-all duration-300 hover:bg-white"
                >
                  Comment ça marche ?
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2">
                <MiniProof text="100 % gratuit" />
                <MiniProof text="Offres vérifiées" />
                <MiniProof text="25 % reversés" />
              </div>
            </div>

            <div className="relative mx-auto h-[570px] w-full max-w-[570px] lg:-mr-5">
              <div className="absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e6eee4] opacity-80 blur-[45px]" />

              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 570 570" fill="none" aria-hidden="true">
                <defs>
                  <radialGradient id="softBlob">
                    <stop offset="0" stopColor="#e7eee4" stopOpacity="0.9" />
                    <stop offset="0.72" stopColor="#edf1e8" stopOpacity="0.55" />
                    <stop offset="1" stopColor="#edf1e8" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <ellipse cx="300" cy="275" rx="220" ry="235" fill="url(#softBlob)" />
                <ellipse cx="295" cy="290" rx="180" ry="205" stroke="#dfe8dc" strokeWidth="1" opacity="0.8" />
                <ellipse cx="295" cy="290" rx="205" ry="230" stroke="#e5ece1" strokeWidth="1" opacity="0.65" />
              </svg>

              <Dot x={63} y={155} size={4} color="#b7cdbd" />
              <Dot x={83} y={155} size={4} color="#d8b68f" />
              <Dot x={103} y={155} size={4} color="#b7cdbd" />
              <Dot x={123} y={155} size={4} color="#d9e3d8" />
              <Dot x={63} y={175} size={4} color="#d9e3d8" />
              <Dot x={83} y={175} size={4} color="#b7cdbd" />
              <Dot x={103} y={175} size={4} color="#eea172" />
              <Dot x={123} y={175} size={4} color="#b7cdbd" />
              <Dot x={465} y={115} size={5} color="#e8a06f" />
              <Dot x={485} y={135} size={4} color="#b8ccbc" />
              <Dot x={465} y={155} size={4} color="#d9c2a8" />
              <Dot x={485} y={175} size={5} color="#b8ccbc" />

              <svg className="absolute left-[-10px] top-[120px] h-[90px] w-[160px]" viewBox="0 0 160 90" fill="none" aria-hidden="true">
                <path d="M3 55C25 56 33 38 53 36C74 34 72 72 94 69C113 66 116 34 153 27" stroke="#ed8b58" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="3" cy="55" r="4" fill="#ee6a2c" />
              </svg>

              <div className="absolute left-[90px] top-[65px] h-[265px] w-[285px] rotate-[-5deg] rounded-[30px] border border-white bg-[#fffdfa] shadow-2xl">
                <div className="p-7">
                  <div className="text-[10px] font-bold uppercase tracking-[1.6px] text-[#8b938e]">Offre du moment</div>
                  <div className="mt-5 text-[14px] font-semibold text-[#59645f]">Jusqu&apos;à</div>
                  <div className="mt-1 text-[62px] font-black leading-none tracking-[-4px] text-[#ee6a2c]">260 €</div>
                  <div className="mt-4 h-px w-[55px] bg-[#e7ded5]" />
                  <div className="mt-4 text-[11px] leading-5 text-[#8a938e]">bonus maximum<br />selon l&apos;offre</div>
                </div>
              </div>

              <div className="absolute right-[18px] top-[120px] h-[285px] w-[315px] rotate-[6deg] overflow-hidden rounded-[32px] border-[7px] border-white bg-[#176955] shadow-2xl">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 315 285" fill="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="greenCard" x1="0" y1="0" x2="315" y2="285" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#207b65" />
                      <stop offset="0.5" stopColor="#176955" />
                      <stop offset="1" stopColor="#105847" />
                    </linearGradient>
                    <radialGradient id="greenGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(235 55) rotate(135) scale(170)">
                      <stop stopColor="#76b09c" stopOpacity="0.22" />
                      <stop offset="1" stopColor="#76b09c" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <rect width="315" height="285" fill="url(#greenCard)" />
                  <rect width="315" height="285" fill="url(#greenGlow)" />
                  <circle cx="282" cy="8" r="105" stroke="white" strokeOpacity="0.035" strokeWidth="35" />
                  <circle cx="5" cy="282" r="110" stroke="white" strokeOpacity="0.025" strokeWidth="35" />
                </svg>

                <div className="relative p-7">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-[2px] text-[#b8d5ca]">PARRAINIO</div>
                      <div className="mt-2 text-[14px] font-bold text-white">Votre avantage</div>
                    </div>
                    <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/10 bg-white/10 text-[14px] font-bold text-white">€</div>
                  </div>

                  <div className="mt-[40px] text-center">
                    <div className="text-[96px] font-black leading-[.75] tracking-[-8px] text-white">
                      25<span className="ml-1 text-[48px] tracking-[-4px]">%</span>
                    </div>
                    <div className="mt-6 text-[11px] font-medium text-[#bcd6cd]">de notre commission</div>
                    <div className="mt-1 text-[14px] font-bold text-white">vous revient</div>
                  </div>

                  <div className="absolute bottom-5 left-7 right-7">
                    <div className="flex items-center justify-between border-t border-white/10 pt-3">
                      <span className="text-[9px] text-[#a9cabe]">PARRAINIO REVERSE EN PLUS</span>
                      <span className="text-[11px] font-black text-[#ffd0b7]">+25 %</span>
                    </div>
                  </div>
                </div>
              </div>

              <Coin className="absolute left-[50px] top-[260px] z-30" size={92} rotation="-18deg" />
              <Coin className="absolute right-[-4px] top-[340px] z-30" size={82} rotation="17deg" />
              <CoinStack className="absolute bottom-[38px] left-[135px] z-20" />
              <BotanicalPlant className="absolute bottom-[-30px] right-[38px] z-10 h-[390px] w-[205px]" />

              <svg className="absolute bottom-[90px] left-[28px] h-[145px] w-[100px] rotate-[-10deg]" viewBox="0 0 100 145" fill="none" aria-hidden="true">
                <path d="M45 140C45 108 45 75 54 43C58 28 64 16 75 4" stroke="#7ba084" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M51 73C37 62 27 61 15 67C27 78 39 81 51 73Z" fill="#bad2b8" />
                <path d="M54 54C67 43 78 43 88 48C77 60 66 61 54 54Z" fill="#a7c5aa" />
              </svg>

              <div className="absolute bottom-[145px] left-[75px] text-[26px] font-light text-[#b5cbb8]">✦</div>
              <div className="absolute bottom-[170px] right-[5px] h-[18px] w-[18px] rounded-full bg-[#ee6a2c] shadow-lg" />
              <div className="absolute bottom-[120px] right-[-8px] h-[23px] w-[23px] rounded-full border-[3px] border-[#d8b18d]" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dfe7e1] bg-white">
        <div className="mx-auto grid max-w-[1180px] divide-y divide-[#e5e9e6] px-6 py-2 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-8">
          <TrustBlock number="25 %" title="vous revient" text="Une partie de notre commission est reversée." />
          <TrustBlock number="150+" title="offres" text="Des offres de parrainage réunies au même endroit." />
          <TrustBlock number="100 %" title="gratuit" text="La recherche et l'accès aux offres ne vous coûtent rien." />
        </div>
      </section>

      <section id="concept" className="relative mx-auto max-w-[1180px] px-6 py-28 lg:px-8">
        <div className="max-w-[650px]">
          <div className="text-[11px] font-black uppercase tracking-[2px] text-[#ee6a2c]">Comment ça marche</div>
          <h2 className="mt-4 text-[42px] font-black leading-[1] tracking-[-2.7px] sm:text-[54px]">
            Cherchez.<br />Choisissez.<br /><span className="text-[#176955]">Profitez.</span>
          </h2>
          <p className="mt-6 max-w-[560px] text-[16px] leading-7 text-[#747e79]">
            Parrainio simplifie la recherche d&apos;offres de parrainage et vous permet de profiter d&apos;une partie de la commission générée par notre plateforme.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          <StepCard number="01" title="Trouvez une offre" text="Parcourez les offres disponibles ou recherchez directement une marque." />
          <StepCard number="02" title="Passez par Parrainio" text="Suivez le lien et réalisez les conditions demandées par l&apos;offre." />
          <StepCard number="03" title="Récupérez votre avantage" text="Lorsque les conditions sont remplies, vous bénéficiez de la reverse Parrainio." />
        </div>
      </section>

      <section id="avantage" className="relative overflow-hidden bg-[#17372e]">
        <div className="pointer-events-none absolute right-[-150px] top-[-180px] h-[500px] w-[500px] rounded-full border-[80px] border-white/5" />
        <div className="pointer-events-none absolute bottom-[-200px] left-[-150px] h-[500px] w-[500px] rounded-full border-[70px] border-white/5" />

        <div className="relative mx-auto max-w-[1180px] px-6 py-24 lg:px-8 lg:py-28">
          <div className="grid items-center gap-16 lg:grid-cols-[1fr_390px]">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[2px] text-[#efaa84]">La différence Parrainio</div>
              <h2 className="mt-5 max-w-[690px] text-[43px] font-black leading-[.98] tracking-[-2.7px] text-white sm:text-[58px]">
                Pourquoi laisser<br />toute la commission<br /><span className="text-[#efaa84]">ailleurs ?</span>
              </h2>
              <p className="mt-7 max-w-[620px] text-[16px] leading-7 text-[#b7c9c1]">
                Parrainio fait le choix de partager une partie de sa commission avec les utilisateurs qui passent par la plateforme.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-px w-[50px] bg-[#efaa84]" />
                <span className="text-[13px] font-semibold text-[#d0ddd8]">Simple. Visible. Transparent.</span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-sm">
              <div className="text-[11px] font-bold uppercase tracking-[1.8px] text-[#a9c0b7]">Votre part</div>
              <div className="mt-8 flex items-end">
                <span className="text-[108px] font-black leading-[.7] tracking-[-9px] text-white">25</span>
                <span className="mb-[-3px] ml-2 text-[45px] font-black tracking-[-3px] text-[#efaa84]">%</span>
              </div>
              <p className="mt-7 text-[13px] leading-6 text-[#b1c3bb]">de notre commission<br />peut vous revenir.</p>
              <div className="mt-7 h-[5px] overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-1/4 rounded-full bg-[#efaa84]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[900px] px-6 py-28 text-center lg:px-8 lg:py-36">
          <div className="mx-auto flex h-[54px] w-[54px] items-center justify-center rounded-2xl bg-[#e9f1e9] text-[12px] font-black text-[#176955]">25 %</div>
          <h2 className="mt-7 text-[42px] font-black leading-[1] tracking-[-2.7px] sm:text-[56px]">
            Le bon parrainage,<br />c&apos;est celui qui<span className="text-[#176955]"> rapporte plus.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[560px] text-[16px] leading-7 text-[#737d78]">
            Découvrez les offres disponibles et trouvez simplement celle qui vous correspond.
          </p>
          <Link href="/offres" className="mt-9 inline-flex h-[56px] items-center rounded-[16px] bg-[#ee6a2c] px-8 text-[14px] font-extrabold text-white shadow-lg transition-all duration-300 hover:-translate-y-[2px] hover:bg-[#df5e25]">
            Voir les offres <span className="ml-4 text-[20px]">→</span>
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#e2e6e3] bg-white">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-7 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <div className="flex items-baseline">
              <span className="text-[21px] font-black tracking-[-1.3px]">parrainio</span>
              <span className="text-[21px] font-black text-[#ee6a2c]">.</span>
            </div>
            <div className="mt-1 text-[10px] font-semibold tracking-[.12em] text-[#9aa39f]">LE PARRAINAGE AUTREMENT</div>
          </div>

          <div className="flex flex-wrap gap-7 text-[12px] font-semibold text-[#6e7974]">
            <Link href="/offres" className="transition-colors hover:text-[#176955]">Les offres</Link>
            <Link href="#concept" className="transition-colors hover:text-[#176955]">Comment ça marche</Link>
            <a href="mailto:contact@parrainio.fr" className="transition-colors hover:text-[#176955]">Contact</a>
          </div>
        </div>
      </footer>

    </main>
  );
}

function Dot({ x, y, size, color }: DotProps) {
  return (
    <span
      className="absolute rounded-full"
      style={{ left: x, top: y, width: size, height: size, backgroundColor: color }}
      aria-hidden="true"
    />
  );
}

function Coin({ className, size, rotation }: CoinProps) {
  const id = `coin-${size}-${rotation.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <div
      className={`${styles.coinFloat} ${className ?? ""}`}
      style={{ width: size, height: size, transform: `rotate(${rotation})` }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
        <defs>
          <radialGradient id={`${id}-face`} cx="30%" cy="24%" r="78%">
            <stop offset="0" stopColor="#fff4bd" />
            <stop offset="0.18" stopColor="#f9d979" />
            <stop offset="0.45" stopColor="#e9b84f" />
            <stop offset="0.72" stopColor="#c98922" />
            <stop offset="0.9" stopColor="#a96712" />
            <stop offset="1" stopColor="#7d4b0c" />
          </radialGradient>
          <linearGradient id={`${id}-shine`} x1="20" y1="15" x2="75" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="white" stopOpacity="0.8" />
            <stop offset="0.25" stopColor="white" stopOpacity="0.12" />
            <stop offset="0.55" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <filter id={`${id}-shadow`} x="-40%" y="-40%" width="180%" height="200%">
            <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#805718" floodOpacity="0.28" />
          </filter>
        </defs>

        <ellipse cx="50" cy="91" rx="29" ry="6" fill="#805718" opacity="0.16" filter={`url(#${id}-shadow)`} />
        <ellipse cx="50" cy="53" rx="36" ry="33" fill="#a96c14" />
        <ellipse cx="50" cy="49" rx="36" ry="33" fill={`url(#${id}-face)`} stroke="#8c5810" strokeWidth="1.5" />
        <circle cx="50" cy="49" r="29" fill="none" stroke="#ffe9a0" strokeWidth="2" opacity="0.75" />
        <circle cx="50" cy="49" r="25" fill="none" stroke="#b97817" strokeWidth="1" opacity="0.7" />
        <circle cx="50" cy="49" r="20" fill="none" stroke="#ffe6a0" strokeWidth="1" opacity="0.55" />
        <text x="50" y="59" textAnchor="middle" fontSize="25" fontWeight="900" fill="#9a6212" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>€</text>
        <ellipse cx="38" cy="30" rx="14" ry="7" transform="rotate(-28 38 30)" fill={`url(#${id}-shine)`} />
        <ellipse cx="29" cy="39" rx="5" ry="3" transform="rotate(-35 29 39)" fill="white" opacity="0.34" />
      </svg>
    </div>
  );
}

function CoinStack({ className }: ClassNameProps) {
  return (
    <div className={className} aria-hidden="true">
      <svg width="210" height="150" viewBox="0 0 210 150" fill="none" className="overflow-visible">
        <defs>
          <linearGradient id="stackGold" x1="20" y1="20" x2="180" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff0ad" />
            <stop offset="0.22" stopColor="#f5ce66" />
            <stop offset="0.5" stopColor="#d99d31" />
            <stop offset="0.75" stopColor="#b97515" />
            <stop offset="1" stopColor="#8c550d" />
          </linearGradient>
          <radialGradient id="stackTop" cx="35%" cy="25%">
            <stop stopColor="#fff4c3" />
            <stop offset="0.25" stopColor="#f7d777" />
            <stop offset="0.7" stopColor="#d99b2c" />
            <stop offset="1" stopColor="#a96611" />
          </radialGradient>
          <filter id="stackShadow" x="-40%" y="-40%" width="180%" height="200%">
            <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#765018" floodOpacity="0.25" />
          </filter>
        </defs>

        <ellipse cx="100" cy="132" rx="80" ry="10" fill="#79531c" opacity="0.15" filter="url(#stackShadow)" />
        <path d="M35 98V111C35 123 64 132 101 132C138 132 167 123 167 111V98" fill="#a96a12" />
        <ellipse cx="101" cy="98" rx="66" ry="22" fill="url(#stackTop)" stroke="#9b6210" strokeWidth="1.5" />
        <path d="M46 76V89C46 100 70 108 101 108C132 108 156 100 156 89V76" fill="#b97815" />
        <ellipse cx="101" cy="76" rx="55" ry="19" fill="url(#stackGold)" stroke="#9a6110" strokeWidth="1.5" />
        <path d="M60 56V68C60 77 78 83 101 83C124 83 142 77 142 68V56" fill="#bb7b16" />
        <ellipse cx="101" cy="56" rx="41" ry="15" fill="url(#stackTop)" stroke="#98600f" strokeWidth="1.4" />
        <ellipse cx="101" cy="56" rx="29" ry="10" fill="none" stroke="#f8dd89" strokeWidth="1" opacity="0.65" />
        <text x="101" y="62" textAnchor="middle" fontSize="12" fontWeight="900" fill="#9c6312">€</text>
        <ellipse cx="46" cy="96" rx="35" ry="12" fill="url(#stackTop)" stroke="#a36912" strokeWidth="1.5" transform="rotate(-8 46 96)" />
        <ellipse cx="46" cy="96" rx="24" ry="8" fill="none" stroke="#f6d87e" strokeWidth="1" opacity="0.65" transform="rotate(-8 46 96)" />
        <circle cx="158" cy="91" r="27" fill="url(#stackGold)" stroke="#96600f" strokeWidth="1.5" />
        <circle cx="158" cy="91" r="20" fill="none" stroke="#ffe9a0" strokeWidth="1.5" opacity="0.7" />
        <text x="158" y="99" textAnchor="middle" fontSize="19" fontWeight="900" fill="#9a6211">€</text>
        <ellipse cx="150" cy="78" rx="8" ry="4" transform="rotate(-30 150 78)" fill="white" opacity="0.35" />
      </svg>
    </div>
  );
}

function BotanicalPlant({ className }: ClassNameProps) {
  return (
    <svg className={className} viewBox="0 0 205 390" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="stemGradient" x1="90" y1="390" x2="112" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#527d60" />
          <stop offset="0.5" stopColor="#6e9874" />
          <stop offset="1" stopColor="#88aa85" />
        </linearGradient>
        <linearGradient id="leafGradient1" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#d5e5cf" />
          <stop offset="0.45" stopColor="#a9c8a8" />
          <stop offset="1" stopColor="#719b77" />
        </linearGradient>
        <linearGradient id="leafGradient2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#bdd6bb" />
          <stop offset="0.5" stopColor="#88ad89" />
          <stop offset="1" stopColor="#5e8a68" />
        </linearGradient>
        <filter id="leafShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#42694d" floodOpacity="0.13" />
        </filter>
      </defs>

      <path d="M101 390C101 330 100 280 105 223C110 166 112 112 103 48" stroke="url(#stemGradient)" strokeWidth="4" strokeLinecap="round" />
      <path d="M104 119C123 93 143 73 163 48" stroke="#719778" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M104 183C128 163 150 145 177 127" stroke="#719778" strokeWidth="2.3" strokeLinecap="round" />
      <path d="M103 258C130 239 151 219 176 199" stroke="#719778" strokeWidth="2.3" strokeLinecap="round" />
      <path d="M105 220C83 202 64 187 42 169" stroke="#719778" strokeWidth="2.2" strokeLinecap="round" />

      <g filter="url(#leafShadow)">
        <path d="M160 50C170 28 190 17 203 21C202 42 186 60 161 64C157 60 157 55 160 50Z" fill="url(#leafGradient1)" />
        <path d="M160 59C174 47 187 35 198 24" stroke="#e0eadc" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
        <path d="M176 45L170 34M185 37L180 28" stroke="#d8e6d4" strokeWidth="1" opacity="0.65" />
      </g>
      <g filter="url(#leafShadow)">
        <path d="M173 127C184 104 201 95 205 99C205 119 192 138 171 142C168 138 169 132 173 127Z" fill="url(#leafGradient2)" />
        <path d="M172 138C185 126 195 113 202 102" stroke="#d8e5d4" strokeWidth="1.4" strokeLinecap="round" opacity="0.72" />
      </g>
      <g filter="url(#leafShadow)">
        <path d="M171 199C183 179 199 170 204 175C204 195 192 211 171 215C168 211 168 204 171 199Z" fill="url(#leafGradient1)" />
        <path d="M171 211C184 200 194 188 201 177" stroke="#dbe8d7" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      </g>
      <g filter="url(#leafShadow)">
        <path d="M42 168C29 148 12 143 5 149C8 170 24 184 45 184C48 179 47 173 42 168Z" fill="url(#leafGradient2)" />
        <path d="M44 179C31 168 18 157 8 151" stroke="#d9e6d5" strokeWidth="1.4" strokeLinecap="round" opacity="0.72" />
      </g>
      <g filter="url(#leafShadow)">
        <path d="M104 119C83 101 72 78 79 60C102 65 116 83 114 106C112 113 108 117 104 119Z" fill="url(#leafGradient1)" />
        <path d="M105 112C98 94 90 76 81 63" stroke="#e0eadb" strokeWidth="1.6" strokeLinecap="round" opacity="0.75" />
        <path d="M95 92L84 84M99 101L89 96" stroke="#dbe8d7" strokeWidth="1" opacity="0.65" />
      </g>
      <g filter="url(#leafShadow)">
        <path d="M106 223C124 204 145 198 157 206C151 228 132 242 108 240C104 235 103 229 106 223Z" fill="url(#leafGradient2)" />
        <path d="M109 235C125 223 141 213 154 208" stroke="#d9e7d5" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      </g>
      <g filter="url(#leafShadow)">
        <path d="M101 287C82 275 72 259 77 247C94 250 106 263 107 281C106 284 104 286 101 287Z" fill="url(#leafGradient1)" />
        <path d="M103 281C95 269 87 257 79 250" stroke="#dce9d8" strokeWidth="1.3" strokeLinecap="round" opacity="0.65" />
      </g>
      <g filter="url(#leafShadow)">
        <path d="M104 330C120 318 137 318 146 327C136 341 120 346 105 340C102 337 102 334 104 330Z" fill="url(#leafGradient2)" />
        <path d="M108 337C120 331 131 327 142 326" stroke="#d9e7d5" strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />
      </g>
    </svg>
  );
}

function TrustBlock({ number, title, text }: TrustBlockProps) {
  return (
    <div className="flex items-center gap-5 px-4 py-6 md:px-8">
      <div className="shrink-0 text-[27px] font-black tracking-[-1.5px] text-[#176955]">{number}</div>
      <div>
        <div className="text-[12px] font-extrabold text-[#24352e]">{title}</div>
        <div className="mt-1 max-w-[210px] text-[11px] leading-5 text-[#89928e]">{text}</div>
      </div>
    </div>
  );
}

function MiniProof({ text }: MiniProofProps) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-semibold text-[#87918c]">
      <span className="flex h-[17px] w-[17px] items-center justify-center rounded-full bg-[#e6f0e7] text-[9px] font-black text-[#176955]">✓</span>
      {text}
    </div>
  );
}

function StepCard({ number, title, text }: StepCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[25px] border border-[#e0e5e1] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-[3px] hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-[#eaf2ea] text-[11px] font-black text-[#176955]">
          {number}
        </div>
        <span className="text-[22px] text-[#d9e1dd] transition-colors duration-300 group-hover:text-[#ee6a2c]">→</span>
      </div>
      <h3 className="mt-8 text-[17px] font-extrabold tracking-[-0.3px]">{title}</h3>
      <p className="mt-3 text-[13px] leading-6 text-[#7b8580]">{text}</p>
    </div>
  );
}
