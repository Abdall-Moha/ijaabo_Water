import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <section className="my-10 rounded-[2rem] bg-[linear-gradient(135deg,rgba(0,102,190,0.93),rgba(8,117,206,0.88)),url('/home-water-splash.png')] bg-cover bg-center py-12 sm:py-14 lg:py-16">
      <div className="mx-auto flex w-[calc(100%-2.25rem)] max-w-[1200px] flex-col justify-between gap-5 sm:w-[calc(100%-3rem)] md:flex-row md:items-center md:gap-10">
        <div>
          <span className="text-xs font-bold tracking-wider text-sky-100">LET’S GET STARTED</span>
          <h2 className="mt-3 text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl lg:text-[2.875rem]">Need a reliable<br /><span className="text-[#ffdf65]">water supply?</span></h2>
        </div>
        <div className="max-w-md">
          <p className="mb-4 text-sm leading-7 text-sky-100 sm:text-base">Our team is ready to help with a home order, a business need, or a larger supply request.</p>
          <div className="flex items-center gap-5">
            <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#ffdf65] px-6 text-sm font-bold text-[#073d73] transition hover:bg-[#ffe98f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" to="/contact">Order Water <span aria-hidden="true">→</span></Link>
            <Link className="text-sm font-bold text-white underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-white" to="/contact">Contact Us</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
