import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <section className="bg-slate-100 py-12 sm:py-14 lg:py-16">
      <div className="mx-auto flex w-[calc(100%-2.25rem)] max-w-[1200px] flex-col justify-between gap-5 sm:w-[calc(100%-3rem)] md:flex-row md:items-center md:gap-10">
        <div>
          <span className="text-xs font-bold tracking-wider text-ocean">LET’S GET STARTED</span>
          <h2 className="mt-3 text-3xl leading-tight font-bold tracking-tight text-navy sm:text-4xl lg:text-[2.875rem]">Need a reliable<br />water supply?</h2>
        </div>
        <div className="max-w-md">
          <p className="mb-4 text-sm leading-7 text-slate-600 sm:text-base">Our team is ready to help with a home order, a business need, or a larger supply request.</p>
          <div className="flex items-center gap-5">
            <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-ocean px-6 text-sm font-bold text-white transition hover:bg-ocean-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" to="/contact">Order Water <span aria-hidden="true">→</span></Link>
            <Link className="text-sm font-bold text-ocean hover:text-ocean-dark focus-visible:outline-2 focus-visible:outline-gold" to="/contact">Contact Us</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
