import { useCallback, useEffect, useMemo, useState } from "react";
import { FiEye, FiSearch, FiTrash2 } from "react-icons/fi";
import { api } from "../../services/api.js";
import {
  EmptyState,
  fieldClass,
  Loading,
  Notice,
  PageHeader,
  Pagination,
  StatusTag,
} from "../AdminUI.jsx";

const statuses = ["NEW", "CONTACTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
const pageSize = 12;

export default function AdminInquiries() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);
  const [notice, setNotice] = useState("");
  const [savingId, setSavingId] = useState("");

  const load = useCallback(async () => {
    try {
      const { data } = await api.get("/partnership-requests");
      setRecords(Array.isArray(data) ? data : []);
      setError("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Could not load partnership inquiries.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => { if (active) load(); });
    return () => { active = false; };
  }, [load]);

  const filtered = useMemo(
    () =>
      records.filter((item) => {
        const text =
          `${item.organizationName} ${item.contactPhone} ${item.organizationType} ${item.partnershipInterest}`.toLowerCase();
        return (
          text.includes(query.toLowerCase()) &&
          (status === "all" || item.status === status)
        );
      }),
    [records, query, status],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  async function changeStatus(item, nextStatus) {
    setSavingId(item._id);
    setNotice("");
    try {
      const { data } = await api.put(
        `/partnership-requests/${item._id}/status`,
        { status: nextStatus },
      );
      setRecords((current) =>
        current.map((record) => (record._id === item._id ? data : record)),
      );
      setNotice("Inquiry status updated.");
    } catch (saveError) {
      setNotice(
        saveError.response?.data?.message || "Could not update inquiry status.",
      );
    } finally {
      setSavingId("");
    }
  }

  async function remove(item) {
    if (
      !window.confirm(
        `Delete the inquiry from ${item.organizationName}? This cannot be undone.`,
      )
    )
      return;
    try {
      await api.delete(`/partnership-requests/${item._id}`);
      setRecords((current) =>
        current.filter((record) => record._id !== item._id),
      );
      setNotice("Inquiry deleted.");
    } catch (deleteError) {
      setNotice(
        deleteError.response?.data?.message || "Could not delete inquiry.",
      );
    }
  }

  if (loading && records.length === 0)
    return <Loading label="Loading partnership inquiries…" />;
  return (
    <div>
      <PageHeader
        title="Partnership inquiries"
        description="Review organization enquiries submitted through the public partnership form."
      />
      {notice && (
        <div className="mb-4">
          <Notice tone="success">{notice}</Notice>
        </div>
      )}
      {error && (
        <div className="mb-4">
          <Notice>{error}</Notice>
        </div>
      )}
      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_220px]">
          <label className="relative block">
            <span className="sr-only">Search inquiries</span>
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className={`${fieldClass} mt-0 pl-9`}
              placeholder="Search organization, phone, interest"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
          </label>
          <select
            className={`${fieldClass} mt-0`}
            aria-label="Filter inquiry status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="all">All statuses</option>
            {statuses.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </div>
        {error ? null : filtered.length === 0 ? (
          <EmptyState>
            {records.length
              ? "No inquiries match these filters."
              : "No partnership inquiries have been submitted yet."}
          </EmptyState>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    {[
                      "Organization",
                      "Type",
                      "Interest",
                      "Submitted",
                      "Status",
                      "Actions",
                    ].map((label) => (
                      <th className="px-3 py-3" key={label}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-3 py-3 font-semibold">
                        {item.organizationName}
                      </td>
                      <td className="px-3 py-3">{item.organizationType}</td>
                      <td className="px-3 py-3">{item.partnershipInterest}</td>
                      <td className="px-3 py-3">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-3">
                        <select
                          className="rounded-lg border border-slate-300 px-2 py-2 text-xs"
                          aria-label={`Status for ${item.organizationName}`}
                          value={item.status}
                          disabled={savingId === item._id}
                          onChange={(event) =>
                            changeStatus(item, event.target.value)
                          }
                        >
                          {statuses.map((value) => (
                            <option key={value}>{value}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-1">
                          <button
                            className="grid size-9 place-items-center rounded-lg hover:bg-slate-100"
                            aria-label={`View inquiry from ${item.organizationName}`}
                            onClick={() => setViewing(item)}
                          >
                            <FiEye />
                          </button>
                          <button
                            className="grid size-9 place-items-center rounded-lg text-rose-700 hover:bg-rose-50"
                            aria-label={`Delete inquiry from ${item.organizationName}`}
                            onClick={() => remove(item)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} pages={pages} onChange={setPage} />
          </>
        )}
      </section>
      {viewing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-detail-title"
            className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex justify-between">
              <h2 id="inquiry-detail-title" className="text-xl font-bold">
                Partnership inquiry
              </h2>
              <button
                onClick={() => setViewing(null)}
                className="rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
              >
                Close
              </button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Detail label="Organization" value={viewing.organizationName} />
              <Detail label="Contact phone" value={viewing.contactPhone} />
              <Detail
                label="Organization type"
                value={viewing.organizationType}
              />
              <Detail
                label="Partnership interest"
                value={viewing.partnershipInterest}
              />
              <Detail
                label="Submitted"
                value={new Date(viewing.createdAt).toLocaleString()}
              />
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Status
                </p>
                <div className="mt-1">
                  <StatusTag value={viewing.status} />
                </div>
              </div>
            </div>
            <h3 className="mt-5 font-semibold">Message</h3>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {viewing.message}
            </p>
          </section>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm">{value || "—"}</p>
    </div>
  );
}
