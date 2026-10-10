import { Link } from "react-router-dom";

const customers = ["Hotels", "Hospitals", "Schools", "NGOs", "Government", "Businesses"];

export default function BulkSupply() {
  return (
    <section className="bg-slate-100 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto grid w-[calc(100%-2.25rem)] max-w-[1200px] items-center gap-7 sm:w-[calc(100%-3rem)] md:grid-cols-2 md:gap-9 lg:gap-16">
        <div className="flex h-60 items-center justify-center overflow-hidden sm:h-80 lg:h-[390px]">
          <img className="h-full w-full object-contain" src="/Ijaabo%20Bottle.webp" alt="Ijaabo Water 20 litre bottle" loading="lazy" />
        </div>
        <div>
          <span className="text-xs font-bold tracking-wider text-ocean">Bulk &amp; Institutional Supply</span>
          <h2 className="mt-3 text-3xl leading-tight font-bold tracking-tight text-navy sm:text-4xl lg:text-[3.25rem]">Water that keeps<br />your day moving.</h2>
          <p className="my-4 max-w-xl text-sm leading-7 text-slate-600 sm:my-5 sm:text-base sm:leading-8">Reliable water supply for the places people gather, learn, work, and receive care. Talk with our team about the needs of your organization.</p>
          <div className="mb-6 mt-5 flex max-w-xl flex-wrap gap-2">
            {customers.map((item) => <span className="rounded border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 sm:text-sm" key={item}>{item}</span>)}
          </div>
          <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-ocean px-6 text-sm font-bold text-white transition hover:bg-ocean-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" to="/contact">Discuss your supply <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  );
}
