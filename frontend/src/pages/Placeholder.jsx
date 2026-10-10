import { Link } from "react-router-dom";

export default function Placeholder({ title }) {
  return (
    <main className="min-h-[55vh] bg-slate-50 py-20">
      <div className="mx-auto w-[calc(100%-2.25rem)] max-w-[1200px] sm:w-[calc(100%-3rem)]">
        <span className="text-xs font-bold tracking-wider text-ocean">IJAABO WATER</span>
        <h1 className="mb-3 mt-4 text-4xl leading-tight font-bold tracking-tight text-navy sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mb-6 text-base text-slate-600">This page is being prepared. Contact our team and we’ll be happy to help.</p>
        <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-ocean px-6 text-sm font-bold text-white transition hover:bg-ocean-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" to="/contact">Contact us <span aria-hidden="true">→</span></Link>
      </div>
    </main>
  );
}
