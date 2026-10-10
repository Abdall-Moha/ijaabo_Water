import { useCallback, useEffect, useMemo, useState } from "react";
import { FiEdit2, FiEye, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
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

const blank = {
  name: "",
  size: "",
  description: "",
  image: "",
  isActive: true,
};
const pageSize = 10;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [form, setForm] = useState(blank);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const loadProducts = useCallback(async () => {
    try {
      const { data } = await api.get("/products/admin");
      setProducts(Array.isArray(data) ? data : []);
      setError("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not load products.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => { if (active) loadProducts(); });
    return () => { active = false; };
  }, [loadProducts]);

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const searchMatches =
          `${product.name} ${product.size} ${product.description || ""}`
            .toLowerCase()
            .includes(query.toLowerCase());
        const statusMatches =
          visibility === "all" ||
          (visibility === "active" ? product.isActive : !product.isActive);
        return searchMatches && statusMatches;
      }),
    [products, query, visibility],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  function startCreate() {
    setEditing("new");
    setForm(blank);
    setFile(null);
    setNotice("");
  }
  function startEdit(product) {
    setEditing(product._id);
    setForm({
      name: product.name,
      size: product.size,
      description: product.description || "",
      image: product.image || "",
      isActive: product.isActive,
    });
    setFile(null);
    setNotice("");
  }
  function closeForm() {
    if (!busy) setEditing(null);
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    const body = new FormData();
    body.append("name", form.name.trim());
    body.append("size", form.size.trim());
    body.append("description", form.description.trim());
    body.append("isActive", String(form.isActive));
    if (file) body.append("image", file);
    else if (form.image) body.append("image", form.image);
    try {
      if (editing === "new") await api.post("/products", body);
      else await api.put(`/products/${editing}`, body);
      setEditing(null);
      setNotice(editing === "new" ? "Product created." : "Product updated.");
      await loadProducts();
    } catch (saveError) {
      setNotice(
        saveError.response?.data?.message ||
          "Could not save product. Your form entries are still here.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove(product) {
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`))
      return;
    setNotice("");
    try {
      await api.delete(`/products/${product._id}`);
      setNotice("Product deleted.");
      await loadProducts();
    } catch (deleteError) {
      setNotice(
        deleteError.response?.data?.message || "Could not delete product.",
      );
    }
  }

  if (loading && products.length === 0)
    return <Loading label="Loading products…" />;
  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage the product catalog shown on the public Products & Services page."
        action={
          <button className={buttonClass} onClick={startCreate}>
            <FiPlus />
            Add product
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
        <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_200px]">
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className={`${fieldClass} mt-0 pl-9`}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search name, size, description"
            />
          </label>
          <select
            className={`${fieldClass} mt-0`}
            aria-label="Filter visibility"
            value={visibility}
            onChange={(event) => {
              setVisibility(event.target.value);
              setPage(1);
            }}
          >
            <option value="all">All visibility</option>
            <option value="active">Published</option>
            <option value="inactive">Draft / inactive</option>
          </select>
        </div>
        {error ? null : filtered.length === 0 ? (
          <EmptyState>
            {products.length
              ? "No products match these filters."
              : "No products have been created yet."}
          </EmptyState>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    {["Product", "Size", "Visibility", "Actions"].map(
                      (label) => (
                        <th key={label} className="px-3 py-3">
                          {label}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            <img
                              className="size-11 rounded-lg border border-slate-200 object-contain"
                              src={getImageUrl(product.image)}
                              alt=""
                            />
                          ) : (
                            <span className="grid size-11 place-items-center rounded-lg bg-slate-100 text-xs text-slate-500">
                              No img
                            </span>
                          )}
                          <span className="font-semibold text-slate-900">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3">{product.size}</td>
                      <td className="px-3 py-3">
                        <StatusTag
                          value={product.isActive ? "ACTIVE" : "INACTIVE"}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-1">
                          <button
                            aria-label={`View ${product.name}`}
                            title="View"
                            className="grid size-9 place-items-center rounded-lg hover:bg-slate-100"
                            onClick={() => setViewing(product)}
                          >
                            <FiEye />
                          </button>
                          <button
                            aria-label={`Edit ${product.name}`}
                            title="Edit"
                            className="grid size-9 place-items-center rounded-lg hover:bg-slate-100"
                            onClick={() => startEdit(product)}
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            aria-label={`Delete ${product.name}`}
                            title="Delete"
                            className="grid size-9 place-items-center rounded-lg text-rose-700 hover:bg-rose-50"
                            onClick={() => remove(product)}
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

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-form-title"
            className="my-auto w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl sm:p-7"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 id="product-form-title" className="text-xl font-bold">
                {editing === "new" ? "Create product" : "Edit product"}
              </h2>
              <button
                type="button"
                className="rounded px-3 py-1 text-slate-600 hover:bg-slate-100"
                onClick={closeForm}
              >
                Close
              </button>
            </div>
            <form onSubmit={save} className="space-y-4">
              <label className="block text-sm font-semibold">
                Product name *
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
                Size *
                <input
                  className={fieldClass}
                  placeholder="For example, 1.5 Litre"
                  value={form.size}
                  onChange={(event) =>
                    setForm({ ...form, size: event.target.value })
                  }
                  required
                />
              </label>
              <label className="block text-sm font-semibold">
                Description
                <textarea
                  className={`${fieldClass} min-h-24 py-3`}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                />
              </label>
              <label className="block text-sm font-semibold">
                Product image
                <input
                  className={`${fieldClass} py-2`}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                />
              </label>
              {file && (
                <img
                  className="h-32 w-full rounded-lg border border-slate-200 object-contain"
                  src={URL.createObjectURL(file)}
                  alt="Selected product preview"
                />
              )}
              <label className="block text-sm font-semibold">
                Image URL (optional)
                <input
                  className={fieldClass}
                  value={form.image}
                  onChange={(event) =>
                    setForm({ ...form, image: event.target.value })
                  }
                />
              </label>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={Boolean(form.isActive)}
                    onChange={(event) =>
                      setForm({ ...form, isActive: event.target.checked })
                    }
                  />
                  Published
                </label>
              </div>
              {notice && <Notice>{notice}</Notice>}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="min-h-10 rounded-lg border border-slate-300 px-4 text-sm"
                  onClick={closeForm}
                  disabled={busy}
                >
                  Cancel
                </button>
                <button className={buttonClass} disabled={busy}>
                  {busy ? "Saving…" : "Save product"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
      {viewing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-detail-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex justify-between">
              <h2 id="product-detail-title" className="text-xl font-bold">
                Product details
              </h2>
              <button
                onClick={() => setViewing(null)}
                className="text-slate-500"
              >
                Close
              </button>
            </div>
            {viewing.image && (
              <img
                className="mt-4 h-48 w-full rounded-xl bg-slate-50 object-contain p-3"
                src={getImageUrl(viewing.image)}
                alt={`${viewing.name} product`}
              />
            )}
            <h3 className="mt-4 font-bold">
              {viewing.name} · {viewing.size}
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {viewing.description || "No description provided."}
            </p>
            <p className="mt-3 text-sm">
              Visibility: {viewing.isActive ? "Published" : "Inactive"}
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
