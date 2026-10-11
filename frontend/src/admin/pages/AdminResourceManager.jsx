import { useCallback, useEffect, useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { api, getImageUrl } from "../../services/api.js";
import {
  buttonClass,
  EmptyState,
  fieldClass,
  Loading,
  Notice,
  PageHeader,
  Pagination,
  StatusTag,
} from "../AdminUI.jsx";

const pageSize = 10;
const configs = {
  reports: {
    title: "Quality Reports",
    description:
      "Publish and maintain real quality reports and their PDF files.",
    listUrl: "/quality-reports/admin",
    url: "/quality-reports",
    name: "title",
    fileName: "pdf",
    fileLabel: "Report PDF",
    accept: "application/pdf",
    date: true,
  },
  partners: {
    title: "Partners",
    description:
      "Manage real partner organizations and their public visibility.",
    listUrl: "/partners/admin",
    url: "/partners",
    name: "name",
    fileName: "logo",
    fileLabel: "Partner logo",
    accept: "image/jpeg,image/png,image/webp",
    date: false,
  },
};

function emptyForm(type) {
  if (type === "reports")
    return { title: "", reportDate: "", status: "PASSED" };
  return { name: "", logo: "", website: "", isActive: true };
}

export default function AdminResourceManager({ type }) {
  const config = configs[type];
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editor, setEditor] = useState(null);
  const [form, setForm] = useState(emptyForm(type));
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    try {
      const { data } = await api.get(config.listUrl);
      setRecords(Array.isArray(data) ? data : []);
      setError("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          `Could not load ${config.title.toLowerCase()}.`,
      );
    } finally {
      setLoading(false);
    }
  }, [config.listUrl, config.title]);
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) load();
    });
    return () => {
      active = false;
    };
  }, [load]);

  const filtered = useMemo(
    () =>
      records.filter((item) =>
        `${item[config.name]} ${item.description || ""} ${item.website || ""}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [records, query, config.name],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  function create() {
    setEditor("new");
    setForm(emptyForm(type));
    setFile(null);
    setNotice("");
  }
  function edit(item) {
    setEditor(item._id);
    const next = { ...emptyForm(type) };
    for (const key of Object.keys(next)) {
      if (key in item)
        next[key] =
          key === "reportDate" && item[key]
            ? new Date(item[key]).toISOString().slice(0, 10)
            : String(item[key]);
    }
    if ("isActive" in item) next.isActive = item.isActive;
    setForm(next);
    setFile(null);
    setNotice("");
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      const body = new FormData();
      for (const [key, value] of Object.entries(form)) {
        if (value !== "" && key !== config.fileName)
          body.append(key, String(value));
      }
      if (file) body.append(config.fileName, file);
      if (editor === "new") await api.post(config.url, body);
      else await api.put(`${config.url}/${editor}`, body);
      setNotice(
        `${config.title.slice(0, -1)} ${editor === "new" ? "created" : "updated"}.`,
      );
      setEditor(null);
      await load();
    } catch (saveError) {
      setNotice(
        saveError.response?.data?.message ||
          `Could not save record. Your form entries are still here.`,
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete ${item[config.name]}? This cannot be undone.`))
      return;
    try {
      await api.delete(`${config.url}/${item._id}`);
      setNotice("Record deleted.");
      await load();
    } catch (deleteError) {
      setNotice(
        deleteError.response?.data?.message || "Could not delete record.",
      );
    }
  }

  if (loading && records.length === 0)
    return <Loading label={`Loading ${config.title.toLowerCase()}…`} />;
  return (
    <div>
      <PageHeader
        title={config.title}
        description={config.description}
        action={
          <button className={buttonClass} onClick={create}>
            <FiPlus />
            Add {type === "reports" ? "report" : "partner"}
          </button>
        }
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
        <input
          aria-label={`Search ${config.title}`}
          className={`${fieldClass} mt-0 mb-4 max-w-md`}
          placeholder={`Search ${config.title.toLowerCase()}`}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
        />
        {error ? null : filtered.length === 0 ? (
          <EmptyState>
            {records.length
              ? "No records match this search."
              : `No ${config.title.toLowerCase()} have been added yet.`}
          </EmptyState>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-3">Record</th>
                    <th className="px-3 py-3">Details</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          {(type === "partners" ? item.logo : item.image) &&
                            type !== "reports" && (
                              <img
                                className="size-10 rounded-lg border border-slate-200 object-contain"
                                src={getImageUrl(
                                  type === "partners" ? item.logo : item.image,
                                )}
                                alt=""
                              />
                            )}
                          <span className="font-semibold">
                            {item[config.name]}
                          </span>
                        </div>
                      </td>
                      <td className="max-w-md truncate px-3 py-3 text-slate-600">
                        {type === "reports" ? (
                          <span>
                            {new Date(item.reportDate).toLocaleDateString()} ·{" "}
                            {item.pdf ? (
                              <a
                                className="font-semibold text-[#2B4593] hover:underline"
                                href={getImageUrl(item.pdf)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Open PDF
                              </a>
                            ) : (
                              "No file"
                            )}
                          </span>
                        ) : type === "partners" ? (
                          item.website || "No website listed"
                        ) : (
                          item.description
                        )}
                      </td>
                      <td className="px-3 py-3">
                        {type === "reports" ? (
                          <StatusTag value={item.status} />
                        ) : (
                          <StatusTag
                            value={item.isActive ? "ACTIVE" : "INACTIVE"}
                          />
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-1">
                          <button
                            aria-label={`Edit ${item[config.name]}`}
                            className="grid size-9 place-items-center rounded-lg hover:bg-slate-100"
                            onClick={() => edit(item)}
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            aria-label={`Delete ${item[config.name]}`}
                            className="grid size-9 place-items-center rounded-lg text-rose-700 hover:bg-rose-50"
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

      {editor && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="resource-editor-title"
            className="my-auto w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl sm:p-7"
          >
            <div className="mb-5 flex justify-between">
              <h2 id="resource-editor-title" className="text-xl font-bold">
                {editor === "new" ? "Add" : "Edit"}{" "}
                {type === "reports" ? "quality report" : "partner"}
              </h2>
              <button
                type="button"
                onClick={() => !busy && setEditor(null)}
                className="rounded px-3 text-sm text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
            <form onSubmit={save} className="space-y-4">
              {type === "reports" ? (
                <>
                  <label className="block text-sm font-semibold">
                    Report title *
                    <input
                      className={fieldClass}
                      value={form.title}
                      onChange={(event) =>
                        setForm({ ...form, title: event.target.value })
                      }
                      required
                    />
                  </label>
                  <label className="block text-sm font-semibold">
                    Report date *
                    <input
                      className={fieldClass}
                      type="date"
                      value={form.reportDate}
                      onChange={(event) =>
                        setForm({ ...form, reportDate: event.target.value })
                      }
                      required
                    />
                  </label>
                  <label className="block text-sm font-semibold">
                    Status
                    <select
                      className={fieldClass}
                      value={form.status}
                      onChange={(event) =>
                        setForm({ ...form, status: event.target.value })
                      }
                    >
                      <option>PASSED</option>
                      <option>FAILED</option>
                    </select>
                  </label>
                </>
              ) : (
                <>
                  <label className="block text-sm font-semibold">
                    Partner name *
                    <input
                      className={fieldClass}
                      value={form.name}
                      onChange={(event) =>
                        setForm({ ...form, name: event.target.value })
                      }
                      required
                    />
                  </label>
                  <label className="block text-sm font-semibold">
                    Website
                    <input
                      className={fieldClass}
                      type="url"
                      value={form.website}
                      onChange={(event) =>
                        setForm({ ...form, website: event.target.value })
                      }
                    />
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input
                      type="checkbox"
                      checked={Boolean(form.isActive)}
                      onChange={(event) =>
                        setForm({ ...form, isActive: event.target.checked })
                      }
                    />
                    Visible on public website
                  </label>
                </>
              )}
              <label className="block text-sm font-semibold">
                {config.fileLabel}
                {type === "reports" && " *"}
                <input
                  className={`${fieldClass} py-2`}
                  type="file"
                  accept={config.accept}
                  required={type === "reports" && editor === "new"}
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                />
              </label>
              {file && type === "partners" && (
                <img
                  className="h-32 w-full rounded-lg border border-slate-200 object-contain"
                  src={URL.createObjectURL(file)}
                  alt="Selected image preview"
                />
              )}
              {type === "partners" && (
                <label className="block text-sm font-semibold">
                  Logo URL (optional)
                  <input
                    className={fieldClass}
                    type="url"
                    value={form.logo}
                    onChange={(event) =>
                      setForm({ ...form, logo: event.target.value })
                    }
                  />
                </label>
              )}
              {notice && <Notice>{notice}</Notice>}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="min-h-10 rounded-lg border border-slate-300 px-4 text-sm"
                  onClick={() => setEditor(null)}
                  disabled={busy}
                >
                  Cancel
                </button>
                <button className={buttonClass} disabled={busy}>
                  {busy ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
