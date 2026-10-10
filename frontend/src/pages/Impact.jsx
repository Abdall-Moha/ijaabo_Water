import { FiArrowUpRight, FiDroplet, FiGlobe, FiHeart, FiRefreshCw, FiUsers, FiWind } from "react-icons/fi";
import { Link } from "react-router-dom";

const stats = [
  ["9-Stage", "Purification Process", FiDroplet],
  ["100%", "Lab-Tested Water", FiUsers],
  ["↓CO₂", "Reduced Emissions", FiWind],
];

const programs = [
  {
    icon: FiDroplet,
    title: "Clean Water Infrastructure",
    description: "Our purification and distribution infrastructure provides reliable clean water access across Somalia. Modern treatment systems reduce operational costs, ensure consistent water quality, and deliver dependable supply even in areas with limited infrastructure.",
    sdgs: ["SDG 6 — Clean Water", "SDG 9 — Infrastructure", "SDG 13 — Climate Action"],
  },
  {
    icon: FiGlobe,
    title: "Community Water Access",
    description: "Ijaabo Water supports wider access to safe water for households and underserved communities — expanding distribution infrastructure, building community water points, and developing access models for areas outside Mogadishu.",
    sdgs: ["SDG 6 — Safe Water", "SDG 3 — Good Health"],
  },
  {
    icon: FiHeart,
    title: "Subsidized Water Support",
    description: "10–15% of Ijaabo Water's total production capacity is dedicated to providing free or subsidized water to vulnerable households, community organizations, and underserved neighborhoods — ensuring no one is excluded from clean water access due to economic hardship.",
    sdgs: ["SDG 1 — No Poverty", "SDG 6 — Clean Water", "SDG 10 — Reduced Inequalities"],
  },
  {
    icon: FiUsers,
    title: "Women & Youth Employment",
    description: "Ijaabo Water creates income opportunities by engaging women, youth, and community members across distribution networks, customer service operations, water point management, and micro-franchise distribution models — directly contributing to local economic development.",
    sdgs: ["SDG 5 — Gender Equality", "SDG 8 — Decent Work"],
  },
  {
    icon: FiRefreshCw,
    title: "Recycling & Responsible Packaging",
    description: "Ijaabo Water is developing a structured plastic bottle collection and recycling program — partnering with environmental organizations to reduce plastic waste, encourage bottle return, and transition to more sustainable packaging solutions over the coming years.",
    sdgs: ["SDG 12 — Responsible Consumption", "SDG 14 — Life Below Water"],
  },
  {
    icon: FiWind,
    title: "Greenhouse & Environmental Initiatives",
    description: "Our greenhouse programs connect sustainable agriculture with water management — supporting community food resilience, improving soil water retention, and creating green employment opportunities for youth and women in partnership with local communities.",
    sdgs: ["SDG 2 — Zero Hunger", "SDG 15 — Life on Land", "SDG 13 — Climate Action"],
  },
];

export default function Impact() {
  return (
    <main>
      <section className="bg-slate-50 px-5 py-16 text-center sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <span className="text-xs font-bold tracking-[0.16em] text-ocean">Impact &amp; Sustainability</span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-navy sm:text-5xl lg:text-6xl">Clean Water. Stronger Communities. Greener Somalia.</h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">Ijaabo Water is not just a water company — we are a force for social progress, environmental responsibility, and community resilience across Somalia.</p>
        </div>
      </section>
      <section className="mx-auto max-w-[1200px] px-5 py-14 sm:py-16">
        <header className="mx-auto mb-9 max-w-3xl text-center">
          <span className="text-xs font-bold tracking-[0.14em] text-ocean">What We're Doing</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">Our Impact Programs</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">From clean water infrastructure to local employment, Ijaabo Water's impact goes beyond the bottle.</p>
        </header>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {programs.map(({ icon: Icon, title, description, sdgs }) => (
            <article key={title} className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg sm:p-7">
              <span className="mb-5 grid size-12 place-items-center rounded-xl bg-sky-50 text-2xl text-ocean transition group-hover:bg-ocean group-hover:text-white"><Icon /></span>
              <h3 className="text-lg font-bold leading-6 text-navy">{title}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {sdgs.map((sdg) => <span key={sdg} className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-[#2B4593]">{sdg}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-slate-50 px-5 py-14 sm:py-16">
        <div className="mx-auto grid max-w-[1200px] items-center gap-8 md:grid-cols-2 lg:gap-16">
          <div>
            <span className="text-xs font-bold tracking-[0.14em] text-ocean">Climate Responsibility</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">Building a Climate-Resilient Water Future</h2>
            <p className="mt-5 text-base leading-8 text-slate-600">Water security and climate resilience are inseparable. Ijaabo Water's infrastructure and programs are designed to withstand and adapt to Somalia's changing climate conditions.</p>
            <p className="mt-4 text-base leading-8 text-slate-600">From energy-efficient treatment systems to community water storage designed for drought resilience — we are building water infrastructure that lasts.</p>
          </div>
          <img className="h-72 w-full rounded-2xl border border-slate-200 bg-white object-contain p-5 sm:h-96" src="/Ijaabo%20Bottle.webp" alt="Ijaabo Water bottle" loading="lazy" />
        </div>
      </section>
      <section className="bg-navy px-5 py-12 text-white sm:py-14">
        <div className="mx-auto grid max-w-[1200px] gap-4 sm:grid-cols-3">
          {stats.map(([value, label, Icon]) => <article className="rounded-2xl border border-white/15 bg-white/5 p-6 text-center" key={label}><Icon className="mx-auto text-2xl text-gold" /><b className="mt-3 block text-3xl font-bold text-gold sm:text-4xl">{value}</b><span className="mt-2 block text-sm text-sky-100">{label}</span></article>)}
        </div>
      </section>
      <section className="px-5 pt-14 sm:pb-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center rounded-2xl bg-sky-50 px-6 py-10 text-center sm:px-10">
          <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">Join Our Mission for Cleaner, Stronger Communities</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Partner with Ijaabo Water to scale sustainable water access, create jobs, and build climate resilience across Somalia.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link className="inline-flex min-h-12 items-center gap-2 rounded-md bg-ocean px-6 text-sm font-bold text-white hover:bg-ocean-dark" to="/partners">Become a Partner <FiArrowUpRight /></Link>
            <Link className="inline-flex min-h-12 items-center gap-2 rounded-md border border-slate-300 bg-white px-6 text-sm font-bold text-navy hover:bg-slate-100" to="/contact">Support Community Water <FiArrowUpRight /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
