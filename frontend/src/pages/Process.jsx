import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Process() {
  return (
    <main>
      <section className="mb-3 rounded-b-[2rem] bg-[linear-gradient(135deg,rgba(0,102,190,0.93),rgba(8,117,206,0.88)),url('/home-water-splash.png')] bg-cover bg-center px-5 py-16 text-center sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <span className="text-xs font-bold tracking-[0.16em] text-sky-100">
            Our Process
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            9 Steps to Pure Perfection
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-sky-100 sm:text-lg">
            From source to sealed bottle — every step in the Ijaabo Water
            purification journey, engineered for safety and taste.
          </p>
        </div>
      </section>
      <section id="purification-process" className="mx-auto my-3 max-w-[1200px] rounded-3xl bg-[linear-gradient(135deg,rgba(0,102,190,0.93),rgba(8,117,206,0.88)),url('/home-water-splash.png')] bg-cover bg-center px-5 py-14 sm:py-16 lg:py-20">
        <header className="mx-auto mb-9 max-w-3xl text-center">
          <span className="text-xs font-bold tracking-[0.14em] text-sky-100">
            Our Purification Process
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            The Ijaabo 9-Step Purification Process
          </h2>
          <p className="mt-4 text-base leading-7 text-sky-100">
            Every drop passes through nine precise purification stages — from
            raw source water to a sealed, safe, great-tasting bottle.
          </p>
        </header>
        <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:rounded-3xl sm:p-4">
          <img
            className="mx-auto h-auto w-full rounded-xl object-contain"
            src="/productprocess.png"
            alt="Ijaabo Water nine-step purification process"
          />
        </figure>
      </section>
      <section className="my-3 rounded-[2rem] bg-[linear-gradient(135deg,rgba(0,102,190,0.93),rgba(8,117,206,0.88)),url('/home-water-splash.png')] bg-cover bg-center px-5 py-14 sm:py-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center rounded-2xl bg-[linear-gradient(rgba(0,72,150,0.92),rgba(0,88,188,0.88)),url('/home-water-splash.png')] bg-cover bg-[center_65%] px-6 py-10 text-center text-white sm:px-10 sm:py-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Every Bottle. Nine Steps. Zero Compromise.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-sky-100">
            Explore our full quality assurance program and lab-tested results.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              className="inline-flex min-h-12 items-center gap-2 rounded-md bg-[#ffdf65] px-6 text-sm font-bold text-[#073d73] transition hover:bg-[#ffe98f]"
              to="/quality-safety"
            >
              View Quality &amp; Safety <FiArrowUpRight />
            </Link>
            <Link
              className="inline-flex min-h-12 items-center gap-2 rounded-md border border-white/30 px-6 text-sm font-bold text-white hover:bg-white/10"
              to="/contact"
            >
              Order Water <FiArrowUpRight />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
