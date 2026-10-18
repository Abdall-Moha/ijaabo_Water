import { Link } from "react-router-dom";

export default function Placeholder({ title }) {
  return (
    <main className="min-h-[55vh] bg-[linear-gradient(135deg,rgba(0,102,190,0.93),rgba(8,117,206,0.88)),url('/home-water-splash.png')] bg-cover bg-center py-20">
      <div className="mx-auto w-[calc(100%-2.25rem)] max-w-[1200px] sm:w-[calc(100%-3rem)]">
        <span className="text-xs font-bold tracking-wider text-sky-100">
          IJAABO WATER
        </span>
        <h1 className="mb-3 mt-4 text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mb-6 text-base text-sky-100">
          This page is being prepared. Contact our team and we’ll be happy to
          help.
        </p>
        <Link
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#ffdf65] px-6 text-sm font-bold text-[#073d73] transition hover:bg-[#ffe98f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          to="/contact"
        >
          Contact us <span aria-hidden="true">→</span>
        </Link>
      </div>
    </main>
  );
}
