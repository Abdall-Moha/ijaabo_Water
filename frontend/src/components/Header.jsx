import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import Brand from "./Brand.jsx";
import { useAdminAuth } from "../admin/useAdminAuth.js";

// Each page with the sections shown in its dropdown: [label, section id]
const nav = [
  {
    label: "Home",
    path: "/",
    end: true,
    sections: [
      ["Our Products", "products"],
      ["Bulk Supply", "bulk-supply"],
      ["Why Ijaabo Water", "why-ijaabo"],
      ["Who We Serve", "who-we-serve"],
      ["Customer Voices", "testimonials"],
      ["Community Commitment", "community-impact"],
    ],
  },
  {
    label: "About",
    path: "/about",
    sections: [
      ["Our Story", "our-story"],
      ["Who We Are", "who-we-are"],
      ["Mission & Vision", "mission-vision"],
      ["Our Values", "our-values"],
    ],
  },
  {
    label: "Products & Services",
    path: "/products-services",
    sections: [
      ["What We Offer", "what-we-offer"],
      ["Product Range", "product-range"],
      ["Household Supply", "household-supply"],
      ["Bulk & Institutional", "bulk-institutional"],
    ],
  },
  {
    label: "Quality & Safety",
    path: "/quality-safety",
    sections: [
      ["Purification Process", "purification-process"],
      ["Compliance & Certification", "compliance"],
      ["Latest Report", "latest-report"],
      ["Report Archive", "report-archive"],
      ["FAQ", "faq"],
    ],
  },
  {
    label: "Our Process",
    path: "/process",
    sections: [["9-Step Purification", "purification-process"]],
  },
  {
    label: "Impact",
    path: "/impact",
    sections: [
      ["Impact Programs", "impact-programs"],
      ["Climate Responsibility", "climate"],
      ["Join Our Mission", "join-mission"],
    ],
  },
  {
    label: "Partners",
    path: "/partners",
    sections: [
      ["Client Categories", "partner-categories"],
      ["Why Partner With Us", "why-partner"],
      ["Our Partners", "our-partners"],
      ["Start a Partnership", "partner-with-us"],
    ],
  },
];

const linkClass = ({ isActive }) =>
  `whitespace-nowrap py-2 text-[13px] font-semibold transition-colors hover:text-ocean ${
    isActive ? "text-ocean" : "text-slate-600"
  }`;

export default function Header() {
  const { admin } = useAdminAuth();
  const isAdmin = admin?.role === "ADMIN";
  const [open, setOpen] = useState(false); // mobile menu
  const [dropdown, setDropdown] = useState(null); // desktop dropdown (page path)
  const [expanded, setExpanded] = useState(null); // mobile accordion (page path)
  const location = useLocation();

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);

    return () => document.body.classList.remove("menu-open");
  }, [open]);

  // Scroll straight to the chosen section after navigating to /page#section.
  // Waits for the page to render (and for any "scroll to top" on route change),
  // then keeps the section aligned while images and fonts finish loading.
  useEffect(() => {
    if (!location.hash) return undefined;

    const id = decodeURIComponent(location.hash.slice(1));
    const timers = [];
    let tries = 0;

    const align = (behavior) => {
      const element = document.getElementById(id);
      if (!element) return false;
      const top = element.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: Math.max(0, top), behavior });
      return true;
    };

    const find = () => {
      if (align("smooth")) {
        // Re-align after layout settles so the section never ends up off-target.
        [500, 1100].forEach((ms) =>
          timers.push(setTimeout(() => align("auto"), ms)),
        );
        return;
      }
      tries += 1;
      if (tries < 40) timers.push(setTimeout(find, 100));
    };

    timers.push(setTimeout(find, 150));

    return () => timers.forEach(clearTimeout);
  }, [location.pathname, location.hash, location.key]);

  function closeMenu() {
    setOpen(false);
    setExpanded(null);
    setDropdown(null);
  }

  return (
    <>
      {/* Fixed header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white">
        <div className="relative mx-auto flex h-[68px] w-[calc(100%-2rem)] max-w-[1200px] items-center justify-between px-0 sm:w-[calc(100%-3rem)]">
          {/* Logo on the left */}
          <div className="relative z-30 shrink-0">
            <Brand />
          </div>

          {/* Desktop navigation centered in the header */}
          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-3 xl:flex xl:gap-4"
            aria-label="Main navigation"
          >
            {nav.map(({ label, path, end, sections }) => (
              <div
                key={path}
                className="relative flex items-center"
                onMouseEnter={() => setDropdown(path)}
                onMouseLeave={() => setDropdown(null)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget))
                    setDropdown(null);
                }}
              >
                <NavLink
                  to={path}
                  end={end}
                  className={linkClass}
                  onClick={() => setDropdown(null)}
                >
                  {label}
                </NavLink>

                <button
                  type="button"
                  className="ml-0.5 grid size-6 place-items-center rounded text-slate-500 transition hover:text-ocean focus-visible:outline-2 focus-visible:outline-gold"
                  aria-label={`${label} sections`}
                  aria-haspopup="true"
                  aria-expanded={dropdown === path}
                  onClick={() => setDropdown(dropdown === path ? null : path)}
                >
                  <FiChevronDown
                    className={`transition-transform duration-200 ${
                      dropdown === path ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdown === path && (
                  <div className="absolute left-1/2 top-full z-40 -translate-x-1/2 pt-2">
                    <ul className="min-w-[220px] rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                      {sections.map(([sectionLabel, id]) => (
                        <li key={id}>
                          <Link
                            to={`${path}#${id}`}
                            onClick={() => setDropdown(null)}
                            className="block whitespace-nowrap rounded-lg px-3 py-2 text-[13px] font-semibold text-slate-600 transition hover:bg-sky-50 hover:text-ocean"
                          >
                            {sectionLabel}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="ml-auto hidden shrink-0 items-center gap-2 lg:flex">
            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 px-3 text-[13px] font-bold text-ocean transition hover:border-ocean hover:bg-sky-50"
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/contact"
              className="hidden h-10 items-center justify-center rounded-md bg-[#ffdf65] px-4 text-[#073d73] font-bold text-[#114c2c] transition hover:bg-[#ffe98f] xl:inline-flex"
            >
              Order Water
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="relative z-30 ml-auto grid size-10 shrink-0 place-items-center rounded-md border border-slate-200 bg-slate-50 text-xl text-navy transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold xl:hidden"
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile navigation */}
        <nav
          className={`fixed inset-y-0 left-0 z-20 flex w-[min(320px,85vw)] flex-col items-stretch gap-0 overflow-y-auto bg-white px-6 pb-8 pt-24 shadow-2xl transition-transform duration-300 motion-reduce:transition-none xl:hidden ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-label="Mobile navigation"
          aria-hidden={!open}
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
            Explore Ijaabo Water
          </p>

          {nav.map(({ label, path, end, sections }) => (
            <div key={path} className="border-b border-slate-100">
              <div className="flex items-center justify-between">
                <NavLink
                  to={path}
                  end={end}
                  onClick={closeMenu}
                  tabIndex={open ? 0 : -1}
                  className={({ isActive }) =>
                    `flex-1 py-3.5 text-sm font-semibold transition hover:text-ocean ${
                      isActive ? "text-ocean" : "text-slate-600"
                    }`
                  }
                >
                  {label}
                </NavLink>
                <button
                  type="button"
                  tabIndex={open ? 0 : -1}
                  aria-label={`${label} sections`}
                  aria-expanded={expanded === path}
                  onClick={() => setExpanded(expanded === path ? null : path)}
                  className="grid size-9 place-items-center text-slate-500"
                >
                  <FiChevronDown
                    className={`transition-transform duration-200 ${
                      expanded === path ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {expanded === path && (
                <ul className="mb-3 ml-3 border-l border-slate-200 pl-3">
                  {sections.map(([sectionLabel, id]) => (
                    <li key={id}>
                      <Link
                        to={`${path}#${id}`}
                        onClick={closeMenu}
                        tabIndex={open ? 0 : -1}
                        className="block py-2 text-sm text-slate-600 transition hover:text-ocean"
                      >
                        {sectionLabel}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={closeMenu}
              tabIndex={open ? 0 : -1}
              className="border-b border-slate-100 py-3.5 text-sm font-bold text-ocean transition hover:text-ocean-dark lg:hidden"
            >
              Dashboard
            </Link>
          )}

          <Link
            to="/contact"
            onClick={closeMenu}
            tabIndex={open ? 0 : -1}
            className="group inline-flex min-h-10 items-center justify-center gap-1 rounded-lg border border-[#ffdf65] bg-[#ffdf65] px-1 py-3 font-bold text-[#073d73] shadow-lg shadow-black/10 transition-colors duration-200 hover:bg-[#ffe98f] hover:border-[#ffe98f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Order Water
          </Link>
        </nav>

        {/* Background overlay for mobile navigation */}
        {open && (
          <button
            type="button"
            className="fixed inset-0 z-10 cursor-default bg-navy/55 xl:hidden"
            aria-label="Close navigation"
            onClick={closeMenu}
          />
        )}
      </header>
    </>
  );
}
