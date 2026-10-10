import {
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiLoader,
} from "react-icons/fi";

export function PageHeader({ title, description, action }) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
        )}
      </div>
      {action}
    </header>
  );
}

export function Notice({ children, tone = "error" }) {
  const styles =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : "border-rose-200 bg-rose-50 text-rose-900";
  return (
    <div
      role="status"
      className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${styles}`}
    >
      <FiAlertCircle className="mt-0.5 shrink-0" />
      {children}
    </div>
  );
}

export function Loading({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-10 text-sm text-slate-600">
      <FiLoader className="animate-spin" />
      {label}
    </div>
  );
}

export function EmptyState({ children = "No records found." }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
      {children}
    </div>
  );
}

export function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
      <span>
        Page {page} of {pages}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="grid size-10 place-items-center rounded-lg border border-slate-300 disabled:opacity-40"
          aria-label="Previous page"
        >
          <FiChevronLeft />
        </button>
        <button
          type="button"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
          className="grid size-10 place-items-center rounded-lg border border-slate-300 disabled:opacity-40"
          aria-label="Next page"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}

export function StatusTag({ value }) {
  const good = [
    "DELIVERED",
    "PASSED",
    "CONFIRMED",
    "COMPLETED",
    "ACTIVE",
  ].includes(String(value).toUpperCase());
  const bad = ["FAILED", "CANCELLED", "INACTIVE"].includes(
    String(value).toUpperCase(),
  );
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${good ? "bg-emerald-100 text-emerald-800" : bad ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}
    >
      {value || "Unknown"}
    </span>
  );
}

export const fieldClass =
  "mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none focus:border-[#2B4593] focus:ring-2 focus:ring-blue-100";
export const buttonClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#2B4593] px-4 text-sm font-semibold text-white transition hover:bg-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B4593] disabled:cursor-wait disabled:opacity-60";
