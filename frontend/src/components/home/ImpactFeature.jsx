import { FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function ImpactFeature() {
  return (
    <section className="bg-ocean-dark py-12 text-white sm:py-14 lg:py-16">
      <div className="mx-auto grid w-[calc(100%-2.25rem)] max-w-[1200px] items-center gap-6 sm:w-[calc(100%-3rem)] md:grid-cols-[56px_1fr_220px] md:gap-7">
        <div className="grid size-12 place-items-center rounded-full border border-white/30 text-2xl text-gold sm:size-14"><FiUsers aria-hidden="true" /></div>
        <div>
          <span className="text-xs font-bold tracking-wider text-sky-100">OUR COMMUNITY COMMITMENT</span>
          <h2 className="mt-3 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">More access.<br /><span className="text-sky-200">More opportunity.</span></h2>
          <p className="my-3 max-w-xl text-sm leading-7 text-sky-100 sm:text-base">Since 2012, Ijaabo Water has worked to grow access to drinking water and create opportunity through local employment.</p>
          <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-bold text-navy transition hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" to="/impact">Discover our impact <span aria-hidden="true">→</span></Link>
        </div>
        <div className="border-t border-white/25 pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <span className="text-4xl font-bold tracking-tight text-gold">15%</span>
          <b className="mt-2 block max-w-[220px] text-sm leading-6">of water capacity supports free or subsidized access</b>
          <small className="mt-2 block text-xs text-sky-100">As reported by Ijaabo Water</small>
        </div>
      </div>
    </section>
  );
}
