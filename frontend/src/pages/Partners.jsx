import { useEffect, useState } from "react";
import { FiActivity, FiArrowUpRight, FiBookOpen, FiBriefcase, FiCalendar, FiCheckCircle, FiCoffee, FiDroplet, FiFileText, FiHome, FiLayers, FiRefreshCw, FiShoppingBag, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import { api, getImageUrl } from "../services/api.js";

const organizationTypes = ["Development Partner / INGO", "Government Institution", "NGO / Community Organization", "Hotel / Restaurant", "School / University", "Private Business", "Corporate Client", "Event Organizer", "Other"];
const interests = ["Bulk Water Supply Contract", "Community Water Program", "WASH Program Supply", "Retail Distribution Partnership", "Investment / Development Partnership", "Other"];
const categories = [
  [FiUsers, "Development Partners", "INGO, UN agencies, bilateral donors funding water access, WASH, and sustainability programs."],
  [FiHome, "Government Institutions", "Federal and regional government offices, ministries, and public sector institutions."],
  [FiBriefcase, "Private Businesses", "Companies, enterprises, and corporate clients requiring consistent water supply."],
  [FiCoffee, "Hotels & Restaurants", "Hospitality sector clients requiring premium, reliable water supply and customized delivery."],
  [FiBookOpen, "Schools & Universities", "Educational institutions ensuring safe, consistent drinking water for students and staff."],
  [FiUsers, "NGOs & Community Organizations", "Local and international NGOs focused on WASH, community health, and water security programs."],
  [FiShoppingBag, "Corporate Clients", "Large corporations and office buildings requiring structured water supply contracts."],
  [FiCalendar, "Event Organizers", "Event companies, conference organizers, and public gatherings requiring large-scale event water supply."],
];
const partnershipBenefits = [
  [FiCheckCircle, "Certified Quality", "All water is independently tested and meets international safety standards — giving partners confidence in the quality they deliver."],
  [FiLayers, "Scalable Supply", "From small institutions to large NGO distribution programs — our supply capacity scales with your needs."],
  [FiRefreshCw, "Sustainable Infrastructure", "Energy-efficient production and eco-conscious operations support sustainability-focused partner mandates."],
  [FiDroplet, "Community Impact", "Partnership with Ijaabo Water directly contributes to community water access, employment, and social impact."],
  [FiActivity, "Flexible Contracts", "Structured supply agreements, volume pricing, and flexible delivery arrangements for all partner types."],
  [FiFileText, "Transparent Reporting", "Partners receive quality reports, delivery records, and impact data for compliance and reporting requirements."],
];
const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-ocean focus:ring-2 focus:ring-sky-100";
const titleClass = "mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl";

export default function Partners() {
  const [partners, setPartners] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [partnersError, setPartnersError] = useState(false);
  const [form, setForm] = useState({ organizationName: "", contactPhone: "", organizationType: "", partnershipInterest: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState({ type: "", text: "" });

  useEffect(() => {
    let active = true;
    api.get("/partners")
      .then(({ data }) => { if (active) setPartners(Array.isArray(data) ? data : []); })
      .catch(() => { if (active) setPartnersError(true); })
      .finally(() => { if (active) setLoadingPartners(false); });
    return () => { active = false; };
  }, []);

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setResult({ type: "", text: "" });
    try {
      await api.post("/partnership-requests", { ...form, message: form.message.trim() || "Partnership inquiry" });
      setResult({ type: "success", text: "Your partnership request has been received. Our team will be in touch." });
      setForm({ organizationName: "", contactPhone: "", organizationType: "", partnershipInterest: "", message: "" });
    } catch (error) {
      setResult({ type: "error", text: error.response?.data?.message || "We could not submit your request. Please try again or contact our team." });
    } finally {
      setBusy(false);
    }
  }

  return <main>
    <section className="bg-slate-50 px-5 py-16 text-center sm:py-20 lg:py-24"><div className="mx-auto max-w-4xl"><span className="text-xs font-bold tracking-[0.16em] text-ocean">Partners &amp; Clients</span><h1 className="mt-4 text-4xl font-bold tracking-tight text-navy sm:text-5xl lg:text-6xl">Build a Stronger Somalia, Together</h1><p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">Partner with Ijaabo Water to expand clean water access, support vulnerable communities, and create lasting climate-resilient infrastructure.</p></div></section>

    <section className="mx-auto max-w-[1200px] px-5 py-14 sm:py-16"><header className="mx-auto mb-9 max-w-3xl text-center"><span className="text-xs font-bold tracking-[0.14em] text-ocean">Who We Work With</span><h2 className={titleClass}>Partners &amp; Client Categories</h2><p className="mt-4 text-base leading-7 text-slate-600">From development organizations to private businesses — Ijaabo Water builds structured partnerships with organizations that share our commitment to clean water and community impact.</p></header><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{categories.map(([Icon, name, description]) => <article className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg sm:p-6" key={name}><span className="grid size-11 place-items-center rounded-xl bg-sky-50 text-xl text-ocean"><Icon /></span><h3 className="mt-4 text-lg font-bold text-navy">{name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></article>)}</div></section>

    <section className="bg-slate-50 px-5 py-14 sm:py-16"><div className="mx-auto max-w-[1200px]"><header className="mx-auto mb-9 max-w-3xl text-center"><span className="text-xs font-bold tracking-[0.14em] text-ocean">Partnership Value</span><h2 className={titleClass}>Why Partner With Ijaabo Water?</h2><p className="mt-4 text-base leading-7 text-slate-600">A partnership with Ijaabo Water is a partnership with a mission-driven company committed to clean water access, community impact, and sustainable development in Somalia.</p></header><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{partnershipBenefits.map(([Icon, name, description]) => <article className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg sm:p-6" key={name}><span className="grid size-11 place-items-center rounded-xl bg-sky-50 text-xl text-ocean"><Icon /></span><h3 className="mt-4 text-lg font-bold text-navy">{name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></article>)}</div></div></section>

    <section className="mx-auto max-w-[1200px] px-5 py-14 sm:py-16"><header className="mx-auto mb-8 max-w-3xl text-center"><span className="text-xs font-bold tracking-[0.14em] text-ocean">Our Partners</span><h2 className={titleClass}>Trusted by Leading Organizations</h2><p className="mt-4 text-base leading-7 text-slate-600">Ijaabo Water partners with development organizations, institutions, businesses, and community organizations committed to clean water access.</p></header>{loadingPartners ? <p className="rounded-2xl border border-slate-200 p-8 text-center text-slate-600">Loading partners…</p> : partnersError ? <p className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-950">Partner information could not be loaded. Please try again later.</p> : partners.length === 0 ? <p className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center font-semibold text-slate-600">This section will be Available Soon</p> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{partners.map((partner) => <article key={partner._id} className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">{partner.logo && <img src={getImageUrl(partner.logo)} alt={`${partner.name} logo`} className="h-16 max-w-full object-contain" />}<h3 className="font-bold text-navy">{partner.name}</h3></article>)}</div>}</section>

    <section className="bg-slate-50 px-5 py-14 sm:py-16"><div className="mx-auto max-w-3xl"><header className="mb-8 text-center"><span className="text-xs font-bold tracking-[0.14em] text-ocean">Partner With Us</span><h2 className={titleClass}>Start a Partnership Conversation</h2><p className="mt-4 text-base leading-7 text-slate-600">Tell us about your organization and water supply needs — our partnerships team will respond within 2 business days.</p></header><form onSubmit={submit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold text-navy">Organization Name *<input className={inputClass} name="organizationName" value={form.organizationName} onChange={update} required /></label><label className="text-sm font-semibold text-navy">Contact Phone *<input className={inputClass} name="contactPhone" type="tel" value={form.contactPhone} onChange={update} required /></label><label className="text-sm font-semibold text-navy">Organization Type *<select className={inputClass} name="organizationType" value={form.organizationType} onChange={update} required><option value="">Select type</option>{organizationTypes.map((type) => <option key={type}>{type}</option>)}</select></label><label className="text-sm font-semibold text-navy">Partnership Interest *<select className={inputClass} name="partnershipInterest" value={form.partnershipInterest} onChange={update} required><option value="">Select interest</option>{interests.map((interest) => <option key={interest}>{interest}</option>)}</select></label></div><label className="block text-sm font-semibold text-navy">Message (optional)<textarea className={`${inputClass} min-h-32 py-3`} name="message" value={form.message} onChange={update} /></label>{result.text && <p role="status" className={`rounded-xl p-4 text-sm ${result.type === "success" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>{result.text}</p>}<button disabled={busy} className="min-h-12 w-full rounded-lg bg-ocean px-6 text-sm font-bold text-white transition hover:bg-ocean-dark disabled:cursor-wait disabled:opacity-60">{busy ? "Submitting…" : "Send Partnership Request"}</button></form></div></section>

    <section className="px-5 py-14"><div className="mx-auto flex max-w-5xl flex-col items-center rounded-2xl bg-navy px-6 py-10 text-center text-white sm:px-10"><h2 className="text-3xl font-bold sm:text-4xl">Ready to Scale Clean Water Access Together?</h2><p className="mt-4 max-w-2xl leading-7 text-sky-100">Contact our partnerships team to explore how Ijaabo Water can support your organization's water needs and impact goals.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Link className="rounded-md bg-gold px-6 py-3 text-sm font-bold text-navy" to="/contact">Contact Partnerships</Link><Link className="rounded-md border border-white/30 px-6 py-3 text-sm font-bold" to="/contact#order-form">Request Institutional Supply <FiArrowUpRight className="inline" /></Link></div></div></section>
  </main>;
}
