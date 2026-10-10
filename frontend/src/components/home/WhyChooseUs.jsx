import { FiHeart, FiPackage, FiShield, FiTruck } from "react-icons/fi";

const benefits = [
  [FiTruck, "Reliable supply", "A dependable supply for homes, businesses, and community needs.", "bg-sky-50 text-ocean"],
  [FiPackage, "Multiple product sizes", "Bottled water options from 330ml to 20 litres.", "bg-amber-50 text-amber-700"],
  [FiShield, "Quality focused", "Careful attention to water quality across the supply process.", "bg-slate-100 text-slate-600"],
  [FiHeart, "Community impact", "A portion of capacity supports subsidized water access.", "bg-emerald-50 text-emerald-700"],
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-[calc(100%-2.25rem)] max-w-[1200px] sm:w-[calc(100%-3rem)]">
        <div className="mb-8 flex flex-col items-center text-center sm:mb-10">
          <span className="text-xs font-bold tracking-wider text-ocean">WHY IJAABO WATER</span>
          <h2 className="mt-3 text-3xl leading-tight font-bold tracking-tight text-navy sm:text-4xl lg:text-[3.25rem]">Built on trust.<br />Delivered with reliability.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">From sourcing to delivery, we work to serve Somalia’s homes, businesses, and communities with care.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {benefits.map(([Icon, title, copy, iconStyle]) => (
            <article className="min-h-48 rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg sm:p-6" key={title}>
              <div className={`grid size-11 place-items-center rounded-md text-xl ${iconStyle}`}><Icon aria-hidden="true" /></div>
              <h3 className="mb-2 mt-4 text-lg leading-snug font-bold text-navy">{title}</h3>
              <p className="text-sm leading-6 text-slate-600">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
