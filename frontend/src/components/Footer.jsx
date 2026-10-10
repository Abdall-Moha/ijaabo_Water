import { Link } from "react-router-dom";
import Brand from "./Brand.jsx";

const columns = [
  [
    "Company",
    [
      ["About Ijaabo", "/about"],
      ["Our story", "/about"],
      ["Impact & sustainability", "/impact"],
      ["Leadership team", "/about"],
      ["Careers & training", "/about"],
    ],
  ],
  [
    "Services",
    [
      ["Bottled water", "/products-services"],
      ["Household supply", "/products-services"],
      ["Bulk supply", "/contact"],
      ["Institutional supply", "/contact"],
    ],
  ],
  [
    "Support",
    [
      ["Contact us", "/contact"],
      ["Order water", "/contact"],
      ["Customer care", "/contact"],
      ["Quality reports", "/quality-safety"],
      ["Become a partner", "/partners"],
    ],
  ],
];
const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-[#072a45] text-slate-200">
      <div className="mx-auto grid w-[calc(100%-2.25rem)] max-w-[1200px] grid-cols-2 gap-x-5 gap-y-8 py-9 sm:w-[calc(100%-3rem)] md:grid-cols-3 md:gap-7 md:py-12 xl:grid-cols-[1.65fr_repeat(3,.85fr)_1fr]">
        <div className="col-span-2 md:row-span-2 xl:col-span-1 xl:row-span-1">
          <Brand light />
          <p className="my-4 max-w-[300px] text-sm leading-7 text-slate-300">
            Delivering safe, affordable, and reliable drinking water for
            households, businesses, institutions, and communities across Somalia
            since 2012.
          </p>
          <a className="inline-flex items-center gap-2 text-sm text-white hover:text-gold focus-visible:outline-2 focus-visible:outline-gold" href="tel:2828">
            Call center: <b>2828</b>
          </a>
        </div>
        {columns.map(([heading, links]) => (
          <div className="flex flex-col items-start gap-3" key={heading}>
            <h3 className="mb-1 text-sm font-bold text-white">{heading}</h3>
            {links.map(([label, path]) => (
              <Link className="text-xs text-slate-300 transition hover:text-white sm:text-sm" to={path} key={label}>
                {label}
              </Link>
            ))}
          </div>
        ))}
        <div className="flex flex-col items-start gap-2">
          <h3 className="mb-1 text-sm font-bold text-white">Contact</h3>
          <span className="mt-1 text-[11px] uppercase tracking-wider text-slate-400">Call center</span>
          <a className="text-sm text-white hover:text-gold" href="tel:2828">2828</a>
          <span className="mt-1 text-[11px] uppercase tracking-wider text-slate-400">Email</span>
          <a className="text-sm text-white hover:text-gold" href="mailto:info@ijaabo.com">info@ijaabo.com</a>
          <span className="mt-1 text-[11px] uppercase tracking-wider text-slate-400">Location</span>
          <p className="m-0 text-sm text-white">Mogadishu, Somalia</p>
        </div>
      </div>
      <div className="mx-auto flex min-h-12 w-[calc(100%-2.25rem)] max-w-[1200px] items-center justify-between gap-3 border-t border-white/15 text-[10px] text-slate-400 sm:w-[calc(100%-3rem)] sm:text-xs">
        <span>© {currentYear} Ijaabo Water. All rights reserved.</span>
        <span>Pure water. Better tomorrow.</span>
      </div>
    </footer>
  );
}
