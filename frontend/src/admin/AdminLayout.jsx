import { useState } from "react";
import {
  FiActivity,
  FiBox,
  FiExternalLink,
  FiFileText,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";
import {
  Navigate,
  NavLink,
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAdminAuth } from "./useAdminAuth.js";

const navigation = [
  ["Overview", "/admin", FiGrid, true],
  ["Products", "/admin/products", FiBox],
  ["Orders", "/admin/orders", FiActivity],
  ["Quality Reports", "/admin/quality-reports", FiFileText],
  ["Partners", "/admin/partners", FiUsers],
  ["Partnership Inquiries", "/admin/inquiries", FiUsers],
  ["Users", "/admin/users", FiUser],
  ["Settings", "/admin/settings", FiSettings],
];

const titles = Object.fromEntries(
  navigation.map(([title, path]) => [path, title]),
);

export function RequireAdmin() {
  const { admin, checking } = useAdminAuth();
  const location = useLocation();
  if (checking)
    return (
      <div className="grid min-h-screen place-items-center text-sm text-slate-600">
        Verifying admin access…
      </div>
    );
  if (!admin || admin.role !== "ADMIN")
    return <NavigateToLogin from={location.pathname} />;
  return <AdminLayout />;
}

function NavigateToLogin({ from }) {
  return <Navigate to="/admin-login" replace state={{ from }} />;
}

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const pageTitle = titles[location.pathname] || "Admin Dashboard";

  function signOut() {
    logout();
    navigate("/admin-login", { replace: true });
  }

  return (
    <div className="relative h-dvh overflow-hidden bg-slate-100 text-slate-800 lg:flex">
      {menuOpen && (
        <button
          aria-label="Close admin menu"
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-dvh w-72 flex-col overflow-hidden bg-[#00008B] text-white transition-transform duration-200 lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/15 px-5">
          <div>
            <b className="text-lg tracking-wide">IJAABO</b>
            <span className="ml-2 text-xs text-blue-200">ADMIN</span>
          </div>
          <button
            className="grid size-10 place-items-center rounded-lg hover:bg-white/10 lg:hidden"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <FiX />
          </button>
        </div>
        <nav
          aria-label="Admin navigation"
          className="min-h-0 flex-1 space-y-0.5 overflow-y-auto p-3 lg:space-y-0 lg:overflow-hidden"
        >
          {navigation.map(([label, path, Icon, exact]) => (
            <NavLink
              key={path}
              to={path}
              end={exact}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition lg:min-h-9 ${isActive ? "bg-white text-[#00008B]" : "text-blue-100 hover:bg-white/10 hover:text-white"}`
              }
            >
              <Icon className="text-lg" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto shrink-0 space-y-1 border-t border-white/15 p-2 sm:p-3">
          <button
            className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-semibold text-blue-100 hover:bg-white/10 hover:text-white"
            onClick={signOut}
          >
            <FiLogOut className="text-lg" />
            Log out
          </button>
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex min-h-9 items-center gap-2 border-t border-white/10 px-3 pt-1 text-xs font-medium text-blue-100 transition hover:text-white"
          >
            <FiExternalLink className="text-sm" />
            Go to Website
          </Link>
        </div>
      </aside>
      <div className="h-dvh min-w-0 flex-1 overflow-y-auto lg:ml-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="grid size-10 place-items-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open admin menu"
            >
              <FiMenu />
            </button>
            <h1 className="text-lg font-bold text-slate-900">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {admin?.name}
              </p>
              <p className="text-xs text-slate-500">{admin?.email}</p>
            </div>
            <button
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 lg:hidden"
              onClick={signOut}
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </header>
        <div className="mx-auto w-full min-w-0 max-w-[1440px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
