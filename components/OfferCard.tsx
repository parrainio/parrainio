type OfferCardProps = {
  brand: string;
  category: string;
  bonus: string;
  description: string;
  verifiedAt: string;
  logo?: string;
};

export default function OfferCard({
  brand,
  category,
  bonus,
  description,
  verifiedAt,
  logo,
}: OfferCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(0,0,0,0.09)]">
      <div className="p-6">
        {/* MARQUE */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-stone-200 bg-stone-50">
              {logo ? (
                <img
                  src={logo}
                  alt={`Logo ${brand}`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-lg font-black text-stone-700">
                  {brand.charAt(0)}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-stone-400">
                {category}
              </p>

              <h3 className="mt-0.5 truncate text-xl font-bold text-stone-950">
                {brand}
              </h3>
            </div>
          </div>

          {/* VERIFICATION */}
          <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Vérifiée
          </div>
        </div>

        {/* BONUS */}
        <div className="mt-6 rounded-2xl bg-stone-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-stone-400">
            Bonus disponible
          </p>

          <p className="mt-1 text-3xl font-black tracking-tight text-stone-950">
            {bonus}
          </p>
        </div>

        {/* DESCRIPTION */}
        <p className="mt-5 min-h-[3.5rem] text-sm leading-6 text-stone-600">
          {description}
        </p>

        {/* DATE */}
        <div className="mt-4 flex items-center gap-2 text-xs text-stone-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Vérifiée le {verifiedAt}
        </div>

        {/* CTA */}
        <a
          href="#"
          className="mt-5 flex min-h-12 w-full items-center justify-center rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-orange-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Profiter de l'offre
          <span
            aria-hidden="true"
            className="ml-2 transition-transform duration-200 group-hover:translate-x-0.5"
          >
            →
          </span>
        </a>

        <p className="mt-3 text-center text-xs text-stone-400">
          Informations vérifiées par Parrainio
        </p>
      </div>
    </article>
  );
}