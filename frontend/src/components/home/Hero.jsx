import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0066be] text-white">
      {/* Water splash background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <img
          src="/home-water-splash.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-[70%_65%]"
        />

        {/* Deep blue overlay, similar to the original design */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0058bc]/90 via-[#0066be]/70 to-[#1687e8]/20" />

        {/* Subtle light on the left to keep the design dimensional */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/10 via-transparent to-[#0058bc]/30" />
      </div>

      {/* Hero layout */}
      <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-8 px-5 pb-14 pt-28 sm:px-8 sm:pt-32 md:min-h-[680px] md:grid-cols-[1.15fr_0.85fr] md:gap-6 lg:px-12 lg:pb-16 lg:pt-32">
        {/* Left: Hero content */}
        <div className="relative z-10 flex flex-col justify-center">
          <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.25rem]">
            Clean water.
            <span className="mt-2 block text-[#ffdf65]">
              Stronger communities.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-white/90 sm:text-lg">
            Every drop matters. Ijaabo Water delivers quality drinking water
            you can trust, helping families, businesses, and communities stay
            refreshed every day.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/contact"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-lg border border-[#ffdf65] bg-[#ffdf65] px-7 py-4 font-bold text-[#073d73] shadow-lg shadow-black/10 transition-colors duration-200 hover:bg-[#ffe98f] hover:border-[#ffe98f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Order Water
              <span
                aria-hidden="true"
                className="text-lg transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>

            <Link
              to="/contact?customer=Business"
              className="inline-flex min-h-14 items-center justify-center rounded-lg border border-white/60 bg-[#0058bc]/25 px-7 py-4 font-semibold text-white backdrop-blur-sm transition-colors duration-200 hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Request Bulk Supply
            </Link>
          </div>

          {/* Trust points */}
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-4 text-sm font-medium text-white/90">
            <span className="inline-flex items-center gap-2">
              <span className="font-bold text-[#ffdf65]" aria-hidden="true">
                ✓
              </span>
              Quality-focused
            </span>

            <span className="inline-flex items-center gap-2">
              <span className="font-bold text-[#ffdf65]" aria-hidden="true">
                ✓
              </span>
              Reliable supply
            </span>

            <span className="inline-flex items-center gap-2">
              <span className="font-bold text-[#ffdf65]" aria-hidden="true">
                ✓
              </span>
              Serving communities
            </span>
          </div>
        </div>

        {/* Right: Ijaabo water bottle */}
        <div className="relative flex min-h-[320px] items-center justify-center sm:min-h-[400px] md:min-h-[480px]">
          {/* Soft blue glow behind the bottle */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300/20 blur-3xl sm:h-80 sm:w-80" />

          <img
            src="/Ijaabo%20Bottle.webp"
            alt="Ijaabo Water 20 litre bottle"
            fetchPriority="high"
            decoding="async"
            className="relative z-10 max-h-[430px] w-full max-w-[460px] object-contain drop-shadow-[0_18px_24px_rgba(0,20,40,0.4)]"
          />
        </div>
      </div>
    </section>
  );
}