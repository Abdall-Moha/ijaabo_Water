import { FiStar } from "react-icons/fi";

const testimonials = [
  ["Ijaabo Water has been our household supplier for over 3 years. Always on time, always clean, and the staff are professional.", "Amina Hassan", "Household Customer, Mogadishu"],
  ["We switched our hotel's water supply to Ijaabo and never looked back — consistent quality and dependable bulk delivery every week.", "Mohamed Ali", "Operations Manager, Hotel Partner"],
  ["As an NGO working in underserved districts, Ijaabo Water's subsidized water program has been a real lifeline for the communities we serve.", "Fatima Warsame", "Program Coordinator, NGO Partner"],
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="my-15 bg-[linear-gradient(135deg,rgba(0,102,190,0.93),rgba(8,117,206,0.88)),url('/home-water-splash.png')] bg-cover bg-center py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-[calc(100%-2.25rem)] max-w-[1200px] sm:w-[calc(100%-3rem)]">
        <div className="mb-8 flex flex-col items-center text-center sm:mb-10">
          <span className="text-xs font-bold tracking-wider text-sky-100">CUSTOMER VOICES</span>
          <h2 className="mt-3 text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl lg:text-[3.25rem]">What Our Customers Say</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-sky-100 sm:text-base">Experiences shared by Ijaabo Water customers and partners.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {testimonials.map(([quote, name, role]) => (
            <figure className="flex min-h-60 flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg sm:p-6" key={name}>
              <div className="flex gap-1 text-amber-500" aria-label="Five decorative stars"><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /><FiStar className="fill-current" /></div>
              <blockquote className="my-5 flex-1 text-sm leading-7 text-slate-700 sm:text-base">{quote}</blockquote>
              <figcaption className="flex items-center gap-3 border-t border-slate-100 pt-4">
                <span className="grid size-10 place-items-center rounded-full bg-sky-50 text-sm font-bold text-ocean">{name.split(" ").map((part) => part[0]).join("")}</span>
                <span><b className="block text-sm font-bold text-navy">{name}</b><small className="mt-1 block text-xs text-slate-500">{role}</small></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
