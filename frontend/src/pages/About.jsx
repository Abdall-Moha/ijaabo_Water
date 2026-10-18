import {
  FiCheckCircle,
  FiHeart,
  FiLayers,
  FiRefreshCw,
  FiLock,
  FiTarget,
  FiUsers,
  FiDroplet,
  FiShare2,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const values = [
  [
    FiDroplet,
    "Quality",
    "Care across sourcing, treatment, packaging, and delivery.",
  ],
  [
    FiHeart,
    "Affordability",
    "Making safe water accessible to households and institutions.",
  ],
  [
    FiLock,
    "Integrity",
    "Transparency, fairness, and responsibility in how we work.",
  ],
  [
    FiRefreshCw,
    "Sustainability",
    "A focus on long-term water access and responsible operations.",
  ],
  [
    FiUsers,
    "Equal opportunity",
    "Employment and training opportunities for women, youth, and communities.",
  ],
  [
    FiTarget,
    "Community impact",
    "Supporting subsidized water access for vulnerable communities.",
  ],
  [
    FiCheckCircle,
    "Reliable service",
    "Dependable supply for homes, businesses, and institutions.",
  ],
  [
    FiShare2,
    "Partnership",
    "Working with organizations to expand access to clean water.",
  ],
];

const facts = [
  ["2012", "Founded"],
  ["5,000+", "Households reached"],
  ["114", "Jobs created"],
  ["10–15%", "Capacity supports subsidized access"],
];

export default function About() {
  return (
    <main>
      <section id="our-story" className="mb-10 rounded-b-[1rem] bg-[linear-gradient(135deg,rgba(0,102,190,0.93),rgba(8,117,206,0.88)),url('/home-water-splash.png')] bg-cover bg-center px-5 py-16 text-center sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <span className="text-xs font-bold tracking-[0.16em] text-sky-100">
            OUR STORY
          </span>
          <h1 className="mt-4 text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Trusted water.
            <br className="sm:hidden" />{" "}
            <span className="text-[#ffdf65]">Stronger Somalia.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-sky-100 sm:text-lg">
            Founded to answer Somalia’s need for clean, safe, and affordable
            drinking water, Ijaabo Water has served households, businesses,
            institutions, and communities since 2012.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#ffdf65] px-6 text-sm font-bold text-[#073d73] transition hover:bg-[#ffe98f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              to="/products-services"
            >
              Explore products &amp; services
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-6 text-sm font-bold text-navy transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              to="/contact"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      <section id="who-we-are" className="mx-auto my-3 grid w-[calc(100%-2.25rem)] max-w-[1200px] items-center gap-8 rounded-3xl bg-[linear-gradient(135deg,rgba(0,102,190,0.93),rgba(8,117,206,0.88)),url('/home-water-splash.png')] bg-cover bg-center px-5 py-14 sm:w-[calc(100%-3rem)] sm:px-8 sm:py-16 md:grid-cols-2 lg:gap-16 lg:py-20">
        <div className="overflow-hidden rounded-2xl bg-slate-100">
          <img
            className="max-h-[440px] w-full object-contain"
            src="/Ijaabo%20Bottle.webp"
            alt="Ijaabo Water bottle"
            loading="lazy"
          />
        </div>
        <div>
          <span className="text-xs font-bold tracking-[0.14em] text-sky-100">
            WHO WE ARE
          </span>
          <h2 className="mt-3 text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl">
            A Somali water company with a community purpose.
          </h2>
          <p className="mt-5 text-base leading-8 text-sky-100">
            Established by Somali entrepreneurs, Ijaabo Water set out to build a
            reliable, ethical, and sustainable company that contributes to
            national development, creates employment, and improves access to
            safe water.
          </p>
          <p className="mt-4 text-base leading-8 text-sky-100">
            From its roots as a local provider, the company now serves homes,
            businesses, institutions, and underserved communities, with
            operations and distribution infrastructure that continue to grow.
          </p>
        </div>
      </section>

      <section className="my-7 rounded-[2rem] bg-[linear-gradient(rgba(0,72,150,0.92),rgba(0,88,188,0.88)),url('/home-water-splash.png')] bg-cover bg-[center_65%] px-5 py-12 text-white sm:py-14">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-x-5 gap-y-7 md:grid-cols-4">
          {facts.map(([value, label]) => (
            <div className="border-l border-white/20 pl-4 sm:pl-6" key={label}>
              <b className="block text-3xl font-bold tracking-tight text-gold sm:text-4xl">
                {value}
              </b>
              <span className="mt-2 block text-sm leading-6 text-sky-100">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="mission-vision" className="my-7 bg-[linear-gradient(135deg,rgba(0,102,190,0.93),rgba(8,117,206,0.88)),url('/home-water-splash.png')] bg-cover bg-center px-5 py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto mb-9 max-w-3xl text-center">
            <span className="text-xs font-bold tracking-[0.14em] text-sky-100">
              PURPOSE &amp; DIRECTION
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Purpose-driven water solutions
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <div className="grid size-12 place-items-center rounded-xl bg-sky-100 text-2xl text-ocean">
                <FiTarget />
              </div>
              <h3 className="mt-5 text-xl font-bold text-navy">Our mission</h3>
              <p className="mt-3 text-base leading-7 text-slate-600">
                To provide clean, safe, reliable, and affordable drinking water
                while improving community wellbeing, creating employment
                opportunities, and supporting sustainable water access in
                Somalia.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <div className="grid size-12 place-items-center rounded-xl bg-amber-50 text-2xl text-amber-700">
                <FiLayers />
              </div>
              <h3 className="mt-5 text-xl font-bold text-navy">Our vision</h3>
              <p className="mt-3 text-base leading-7 text-slate-600">
                To be Somalia’s most trusted and impactful water company,
                leading in quality, coverage, sustainability, and community
                development by making clean water accessible to every Somali
                household and institution.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="our-values" className="my-3 rounded-[2rem] bg-[linear-gradient(135deg,rgba(0,102,190,0.93),rgba(8,117,206,0.88)),url('/home-water-splash.png')] bg-cover bg-center px-5 py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto mb-9 max-w-3xl text-center">
            <span className="text-xs font-bold tracking-[0.14em] text-sky-100">
              OUR VALUES
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Principles that guide our work
            </h2>
            <p className="mt-4 text-base leading-7 text-sky-100">
              These principles shape how Ijaabo serves customers and contributes
              to Somali communities.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(([Icon, title, copy]) => (
              <article
                className="rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg sm:p-6"
                key={title}
              >
                <div className="grid size-11 place-items-center rounded-xl bg-sky-50 text-xl text-ocean">
                  <Icon />
                </div>
                <h3 className="mt-4 text-lg font-bold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="my-3 rounded-[2rem] bg-[linear-gradient(135deg,rgba(0,102,190,0.93),rgba(8,117,206,0.88)),url('/home-water-splash.png')] bg-cover bg-center px-5 py-14 sm:py-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center rounded-2xl bg-[linear-gradient(rgba(0,72,150,0.92),rgba(0,88,188,0.88)),url('/home-water-splash.png')] bg-cover bg-center px-6 py-10 text-center sm:px-10">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Let’s build a reliable water supply.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-sky-100">
            Explore Ijaabo’s water products and services, or talk with the team
            about the needs of your household or organization.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#ffdf65] px-6 text-sm font-bold text-[#073d73] transition hover:bg-[#ffe98f]"
              to="/products-services"
            >
              Products &amp; Services
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-6 text-sm font-bold text-navy hover:bg-slate-100"
              to="/contact"
            >
              Contact Ijaabo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
