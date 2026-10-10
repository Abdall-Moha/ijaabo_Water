
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import Brand from "./Brand.jsx";

const links = [
  ["About", "/about"],
  ["Products & Services", "/products-services"],
  ["Quality & Safety", "/quality-safety"],
  ["Our Process", "/process"],
  ["Impact", "/impact"],
  ["Partners", "/partners"],
];

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);

    return () => document.body.classList.remove("menu-open");
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      {/* Fixed header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white">
        <div className="relative mx-auto flex h-[68px] w-[calc(100%-2rem)] max-w-[1200px] items-center justify-between sm:w-[calc(100%-3rem)]">

          {/* Logo on the left */}
          <div className="relative z-30 shrink-0">
            <Brand />
          </div>

          {/* Desktop navigation centered in the header */}
          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 xl:gap-6 lg:flex"
            aria-label="Main navigation"
          >
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `whitespace-nowrap py-2 text-[13px] font-semibold transition-colors hover:text-ocean ${
                  isActive ? "text-ocean" : "text-slate-600"
                }`
              }
            >
              Home
            </NavLink>

            {links.map(([label, path]) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `whitespace-nowrap py-2 text-[13px] font-semibold transition-colors hover:text-ocean ${
                    isActive ? "text-ocean" : "text-slate-600"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Order button on the right */}
          <Link
            to="/contact"
            className="ml-auto mr-4 hidden h-10 shrink-0 items-center justify-center rounded-md bg-gold px-4 text-[13px] font-bold text-navy transition hover:bg-amber-300 lg:inline-flex"
          >
            Order Water
          </Link>

          {/* Mobile menu button */}
          <button
            className="relative z-30 grid size-10 shrink-0 place-items-center rounded-md border border-slate-200 bg-slate-50 text-xl text-navy transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold lg:hidden"
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
          className={`fixed inset-y-0 right-0 z-20 flex w-[min(320px,85vw)] flex-col items-stretch gap-0 overflow-y-auto bg-white px-6 pb-8 pt-24 shadow-2xl transition-transform duration-300 motion-reduce:transition-none lg:hidden ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          aria-label="Mobile navigation"
          aria-hidden={!open}
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
            Explore Ijaabo Water
          </p>

          <NavLink
            to="/"
            end
            onClick={closeMenu}
            tabIndex={open ? 0 : -1}
            className={({ isActive }) =>
              `border-b border-slate-100 py-3.5 text-sm font-semibold transition hover:text-ocean ${
                isActive ? "text-ocean" : "text-slate-600"
              }`
            }
          >
            Home
          </NavLink>

          {links.map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              onClick={closeMenu}
              tabIndex={open ? 0 : -1}
              className={({ isActive }) =>
                `border-b border-slate-100 py-3.5 text-sm font-semibold transition hover:text-ocean ${
                  isActive ? "text-ocean" : "text-slate-600"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          <Link
            to="/contact"
            onClick={closeMenu}
            tabIndex={open ? 0 : -1}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-gold px-5 text-sm font-bold text-navy transition hover:bg-amber-300"
          >
            Order Water
          </Link>
        </nav>

        {/* Background overlay for mobile navigation */}
        {open && (
          <button
            type="button"
            className="fixed inset-0 z-10 cursor-default bg-navy/55 lg:hidden"
            aria-label="Close navigation"
            onClick={closeMenu}
          />
        )}
      </header>
    </>
  );
}