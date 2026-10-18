import { useEffect, useState } from "react";
import {
  FiActivity,
  FiDroplet,
  FiFileText,
  FiFilter,
  FiShield,
  FiSun,
  FiWind,
  FiZap,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { api, getImageUrl } from "../services/api.js";

const steps = [
  [
    FiDroplet,
    "Source Water Intake",
    "Raw water is drawn from deep, protected wells and verified sources, then screened to remove large debris before treatment begins.",
  ],
  [
    FiFilter,
    "Sediment Filtration",
    "Multi-layer sediment filters trap sand, silt, rust, and suspended particles down to microscopic size.",
  ],
  [
    FiWind,
    "Activated Carbon Filtration",
    "Activated carbon removes chlorine, organic compounds, odours, and anything that affects taste and clarity.",
  ],
  [
    FiActivity,
    "Water Softening",
    "Ion-exchange softening reduces hardness minerals such as calcium and magnesium to protect the membranes.",
  ],
  [
    FiFilter,
    "Reverse Osmosis (RO)",
    "High-pressure RO membranes strip out dissolved salts, heavy metals, and up to 99% of remaining impurities.",
  ],
  [
    FiSun,
    "UV Sterilization",
    "Ultraviolet light destroys any remaining bacteria, viruses, and micro-organisms without adding chemicals.",
  ],
  [
    FiZap,
    "Ozonation",
    "Ozone is injected as a final disinfectant, keeping the water pure and fresh right up to the moment of sealing.",
  ],
  [
    FiDroplet,
    "Mineralization",
    "Essential minerals are re-balanced to restore a clean, natural, refreshing taste to the purified water.",
  ],
  [
    FiShield,
    "Hygienic Bottling",
    "Bottles are sterilized and filled in a sealed, controlled environment, then batch-tested before release.",
  ],
];
const faqs = [
  [
    "How often is Ijaabo Water tested?",
    "Every production batch undergoes internal quality testing before release. Independent laboratory testing is conducted quarterly or as required by regulatory bodies.",
  ],
  [
    "What parameters are tested?",
    "We test for microbiological contaminants (E. coli, total coliform, Legionella), chemical parameters (nitrates, heavy metals, chlorine residuals), and physical properties (turbidity, pH, conductivity).",
  ],
  [
    "Who conducts the testing?",
    "Testing is conducted by accredited third-party laboratories. Certification details are available in our downloadable quality reports.",
  ],
  [
    "Is Ijaabo Water safe for all ages?",
    "Yes. Ijaabo Water meets the drinking water safety standards required for consumption by all age groups including infants, children, and pregnant women.",
  ],
  [
    "How should I store Ijaabo Water?",
    "Each bottle is clearly labelled with a best-before date. We recommend consuming water before the printed expiry and storing in a cool, dry place away from direct sunlight.",
  ],
];
const certifications = [
  [
    FiShield,
    "WHO Standards",
    "Water quality parameters aligned with World Health Organization guidelines for drinking water.",
  ],
  [
    FiFileText,
    "National Compliance",
    "Full compliance with Somalia's national food and water safety regulations and standards.",
  ],
  [
    FiActivity,
    "Lab-Certified Testing",
    "Independent laboratory testing of each production batch by accredited testing authorities.",
  ],
];
const dateLabel = (value) =>
  value && !Number.isNaN(new Date(value).getTime())
    ? new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(value))
    : "Date not provided";
const eyebrow = "text-xs font-bold tracking-[0.16em] text-sky-100";
const heading = "mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl";

export default function QualitySafety() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    api
      .get("/quality-reports")
      .then(({ data }) => {
        if (active)
          setReports(Array.isArray(data) ? data.filter((r) => r.pdf) : []);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  const reportContent = loading ? (
    <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
      Loading quality reports…
    </p>
  ) : error ? (
    <p className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-950">
      Quality reports could not be loaded. Please try again later.
    </p>
  ) : reports.length === 0 ? (
    <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center font-semibold text-slate-600">
      This section will be Available Soon
    </p>
  ) : (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
          <tr>
            {["Report Title", "Date", "Testing Body", "Status", "Action"].map(
              (x) => (
                <th className="px-5 py-4" key={x}>
                  {x}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr className="border-t border-slate-100" key={r._id}>
              <td className="px-5 py-4 font-semibold text-navy">{r.title}</td>
              <td className="px-5 py-4">{dateLabel(r.reportDate)}</td>
              <td className="px-5 py-4 text-slate-500">Not provided</td>
              <td className="px-5 py-4">{r.status || "Not provided"}</td>
              <td className="px-5 py-4">
                <a
                  className="font-bold text-ocean hover:underline"
                  href={getImageUrl(r.pdf)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download PDF
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  const latestReport = reports[0];
  const latestContent = loading ? (
    <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
      Loading quality reports…
    </p>
  ) : error ? (
    <p className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-950">
      Quality reports could not be loaded. Please try again later.
    </p>
  ) : !latestReport ? (
    <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center font-semibold text-slate-600">
      This section will be Available Soon
    </p>
  ) : (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-navy">
            {latestReport.title || "Lab Test Results"}
          </h3>
          <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-navy">Report Date</dt>
              <dd className="mt-1 text-slate-600">
                {dateLabel(latestReport.reportDate)}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-navy">Testing Laboratory</dt>
              <dd className="mt-1 text-slate-600">Not provided</dd>
            </div>
            <div>
              <dt className="font-semibold text-navy">Tests Conducted</dt>
              <dd className="mt-1 text-slate-600">
                Microbiological · Chemical · Physical
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-navy">Report Status</dt>
              <dd className="mt-1 text-slate-600">
                {latestReport.status || "Not provided"}
              </dd>
            </div>
          </dl>
        </div>
        <a
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg bg-ocean px-4 text-sm font-bold text-white hover:bg-ocean-dark"
          href={getImageUrl(latestReport.pdf)}
          target="_blank"
          rel="noreferrer"
        >
          Download report <FiFileText />
        </a>
      </div>
    </article>
  );
  return (
    <main>
      <section className="mb-3 rounded-b-[2rem] bg-[linear-gradient(135deg,rgba(0,102,190,0.93),rgba(8,117,206,0.88)),url('/home-water-splash.png')] bg-cover bg-center px-5 py-16 text-center sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <span className={eyebrow}>Quality &amp; Safety</span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Every Drop. Independently Tested.
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-sky-100 sm:text-lg">
            Ijaabo Water's rigorous quality assurance process ensures every
            bottle meets international drinking water safety standards — from
            source to your hands.
          </p>
        </div>
      </section>
      <section id="purification-process" className="mx-auto my-3 max-w-[1200px] rounded-3xl bg-[linear-gradient(135deg,rgba(0,102,190,0.93),rgba(8,117,206,0.88)),url('/home-water-splash.png')] bg-cover bg-center px-5 py-14 sm:py-16 lg:py-20">
        <header className="mx-auto mb-9 max-w-3xl text-center">
          <span className={eyebrow}>Our Purification Process</span>
          <h2 className={heading}>The Ijaabo 9-Step Purification Process</h2>
          <p className="mt-4 text-base leading-7 text-sky-100">
            Every drop passes through nine precise purification stages — from
            raw source water to a sealed, safe, great-tasting bottle.
          </p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map(([Icon, title, copy], i) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg sm:p-6"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-sky-50 text-xl text-ocean">
                  <Icon />
                </span>
                <span className="text-2xl font-bold text-sky-100">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-navy">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="compliance" className="my-7 bg-[linear-gradient(135deg,rgba(0,102,190,0.93),rgba(8,117,206,0.88)),url('/home-water-splash.png')] bg-cover bg-center px-5 py-14 sm:py-16">
        <div className="mx-auto max-w-[1200px]">
          <header className="mx-auto mb-9 max-w-3xl text-center">
            <span className={eyebrow}>Standards</span>
            <h2 className={heading}>Compliance &amp; Certification</h2>
            <p className="mt-4 text-base leading-7 text-sky-100">
              Our water quality processes are benchmarked against international
              drinking water safety standards.
            </p>
          </header>
          <div className="grid gap-4 md:grid-cols-3">
            {certifications.map(([Icon, title, copy]) => (
              <article
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                key={title}
              >
                <span className="grid size-12 place-items-center rounded-xl bg-sky-50 text-2xl text-ocean">
                  <Icon />
                </span>
                <h3 className="mt-4 text-lg font-bold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="latest-report" className="mx-auto my-3 max-w-[1000px] rounded-3xl bg-[linear-gradient(135deg,rgba(0,102,190,0.93),rgba(8,117,206,0.88)),url('/home-water-splash.png')] bg-cover bg-center px-5 py-14 sm:py-16">
        <header className="mb-8 text-center">
          <span className={eyebrow}>Latest Report</span>
          <h2 className={heading}>Download Our Latest Quality Report</h2>
        </header>
        {latestContent}
      </section>
      <section id="report-archive" className="my-3 rounded-[2rem] bg-[linear-gradient(135deg,rgba(0,102,190,0.93),rgba(8,117,206,0.88)),url('/home-water-splash.png')] bg-cover bg-center px-5 py-14 sm:py-16">
        <div className="mx-auto max-w-[1100px]">
          <header className="mb-8 text-center">
            <span className={eyebrow}>Report Archive</span>
            <h2 className={heading}>Historical Quality Reports</h2>
            <p className="mt-4 text-base leading-7 text-sky-100">
              Full transparency — access all historical water quality test
              reports.
            </p>
          </header>
          {reportContent}
        </div>
      </section>
      <section id="faq" className="mx-auto my-3 max-w-4xl rounded-3xl bg-[linear-gradient(135deg,rgba(0,102,190,0.93),rgba(8,117,206,0.88)),url('/home-water-splash.png')] bg-cover bg-center px-5 py-14 sm:py-16">
        <header className="mb-8 text-center">
          <span className={eyebrow}>FAQ</span>
          <h2 className={heading}>Quality Questions Answered</h2>
        </header>
        <div className="space-y-3">
          {faqs.map(([q, a]) => (
            <details
              className="group rounded-2xl border border-slate-200 bg-white p-5 open:border-sky-200 open:shadow-sm"
              key={q}
            >
              <summary className="cursor-pointer list-none pr-8 font-semibold text-navy marker:hidden">
                {q}
                <span className="float-right text-xl text-ocean group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm leading-7 text-slate-600">{a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="my-3 mx-10 rounded-[2rem] bg-[linear-gradient(135deg,rgba(0,102,190,0.93),rgba(8,117,206,0.88)),url('/home-water-splash.png')] bg-cover bg-center px-5 pb-14">
        <div className="mx-auto flex max-w-5xl flex-col items-center rounded-2xl bg-[linear-gradient(rgba(0,72,150,0.92),rgba(0,88,188,0.88)),url('/home-water-splash.png')] bg-cover bg-[center_65%] px-6 py-10 text-center text-white sm:px-10">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Need more information?
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-sky-100">
            Contact Ijaabo Water with questions about its quality commitments or
            available reports.
          </p>
          <Link
            className="mt-6 rounded-md bg-[#ffdf65] px-6 py-3 font-bold text-[#073d73] transition hover:bg-[#ffe98f]"
            to="/contact"
          >
            Contact Ijaabo
          </Link>
        </div>
      </section>
    </main>
  );
}
