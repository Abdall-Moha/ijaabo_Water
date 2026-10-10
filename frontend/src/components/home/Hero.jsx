
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="bg-slate-50 pt-[68px] text-navy">
      <div className="mx-auto grid min-h-[480px] w-[calc(100%-2.25rem)] max-w-[1200px] grid-cols-1 items-center gap-7 py-9 sm:w-[calc(100%-3rem)] md:min-h-[500px] md:grid-cols-2 md:gap-8 md:py-11">
        {/* Hero content */}
        <div className="max-w-xl">
          <span className="text-sm font-bold tracking-wide text-water">
            Trusted since 2012
          </span>

          <h1 className="my-4 text-[clamp(2.7rem,6vw,4.75rem)] leading-[1.02] font-extrabold tracking-[-0.055em] text-navy">
            Clean water.
            <br />
            <span className="text-water">Stronger</span> communities.
          </h1>

          <p className="max-w-[500px] text-[15px] leading-7 text-slate-600 sm:text-base lg:text-[17px] lg:leading-8">
            Safe, affordable, and reliable drinking water for households,
            businesses, institutions, and communities across Somalia.
          </p>

          {/* Hero buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-md bg-gold px-4 text-xs font-bold text-navy transition hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:flex-none sm:px-6 sm:text-sm"
              to="/contact"
            >
              Order Water <span aria-hidden="true">→</span>
            </Link>

            <Link
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-md border border-slate-400 px-3 text-xs font-bold text-navy transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:flex-none sm:px-6 sm:text-sm"
              to="/contact"
            >
              Request Bulk Supply
            </Link>
          </div>
        </div>

        {/* Bottle image */}
        <div className="flex aspect-[1.3] max-h-[420px] min-h-[210px] w-full items-center justify-center overflow-hidden bg-transparent md:aspect-auto md:h-[360px] lg:h-[420px]">
          <img
            className="h-full w-full object-contain"
            src="/Ijaabo%20Bottle.webp"
            alt="Ijaabo Water bottled drinking water"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}