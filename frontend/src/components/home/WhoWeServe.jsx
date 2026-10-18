import { FiBriefcase, FiCoffee, FiHome, FiHeart, FiShoppingBag, FiBookOpen } from "react-icons/fi";
import { Link } from "react-router-dom";

const customers = [
  [FiHome, "Households", "Water for everyday home needs.", "Request Home Water"],
  [FiShoppingBag, "Shops & Supermarkets", "Reliable water for retail businesses.", "Request Business Supply"],
  [FiCoffee, "Hotels & Restaurants", "Dependable water for guests and dining.", "Request Hotel Supply"],
  [FiBookOpen, "Schools & Universities", "Water supply for learning communities.", "Request School Supply"],
  [FiHeart, "NGOs & Institutions", "Water for programs and essential services.", "Request Institutional Supply"],
  [FiBriefcase, "Businesses & Events", "Plan supply for teams and gatherings.", "Request Bulk Supply"],
];

export default function WhoWeServe() {
  return (
    <section id="who-we-serve" className="my-15 bg-[linear-gradient(135deg,rgba(0,102,190,0.93),rgba(8,117,206,0.88)),url('/home-water-splash.png')] bg-cover bg-center py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-[calc(100%-2.25rem)] max-w-[1200px] sm:w-[calc(100%-3rem)]">
        <div className="mb-8 flex flex-col items-center text-center sm:mb-10">
          <span className="text-xs font-bold tracking-wider text-sky-100">WHO WE SERVE</span>
          <h2 className="mt-3 text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl lg:text-[3.25rem]">Water Solutions for Every Need</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-sky-100 sm:text-base">From households to international organizations — structured water supply for every customer type.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {customers.map(([Icon, title, copy, action]) => (
            <article className="flex min-h-60 flex-col items-start rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg sm:p-6" key={title}>
              <div className="grid size-11 place-items-center rounded-md bg-sky-50 text-xl text-ocean"><Icon aria-hidden="true" /></div>
              <h3 className="mb-2 mt-4 text-lg leading-snug font-bold text-navy">{title}</h3>
              <p className="mb-4 text-sm leading-6 text-slate-600">{copy}</p>
              <Link className="mt-auto flex min-h-11 w-full items-center justify-between gap-2 rounded-md bg-ocean px-3 text-sm font-bold text-white transition hover:bg-ocean-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" to="/contact">{action}<span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
