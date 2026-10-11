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

const statuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "DELIVERED",
  "CANCELLED",
];
const pageSize = 12;
const dateLabel = (value) =>
  value
    ? new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "—";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);
  const [notice, setNotice] = useState(null);
  const [savingId, setSavingId] = useState("");

  const loadOrders = useCallback(async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(Array.isArray(data) ? data : []);
      setError("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not load orders.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => { if (active) loadOrders(); });
    return () => { active = false; };
  }, [loadOrders]);

  const filtered = useMemo(
    () =>
      orders.filter((order) => {
        const matchesText = `${order._id} ${order.fullName} ${order.phone}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesStatus = status === "all" || order.status === status;
        const orderTime = new Date(order.createdAt).getTime();
        const after =
          !fromDate || orderTime >= new Date(`${fromDate}T00:00:00`).getTime();
        const before =
          !toDate || orderTime <= new Date(`${toDate}T23:59:59`).getTime();
        return matchesText && matchesStatus && after && before;
      }),
    [orders, query, status, fromDate, toDate],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  async function changeStatus(order, newStatus) {
    setSavingId(order._id);
    setNotice(null);
    try {
      const { data } = await api.put(`/orders/${order._id}/status`, {
        status: newStatus,
      });
      setOrders((current) =>
        current.map((item) => (item._id === order._id ? data : item)),
      );
      setNotice({ tone: "success", text: "Order status updated." });
    } catch (saveError) {
      setNotice({
        tone: "error",
        text: saveError.response?.data?.message || "Could not update order status.",
      });
    } finally {
      setSavingId("");
    }
  }

  async function deleteOrder(order) {
    if (
      !window.confirm(
        `Delete order for ${order.fullName}? This cannot be undone.`,
      )
    )
      return;
    setNotice(null);
    try {
      await api.delete(`/orders/${order._id}`);
      setOrders((current) => current.filter((item) => item._id !== order._id));
      setNotice({ tone: "success", text: "Order deleted." });
      setViewing(null);
    } catch (deleteError) {
      setNotice({
        tone: "error",
        text: deleteError.response?.data?.message || "Could not delete order.",
      });
    }
  }

  if (loading && orders.length === 0)
    return <Loading label="Loading orders…" />;
  return (
    <div>
      <PageHeader
        title="Orders"
        description="Review customer orders, delivery details, line items, and fulfillment status."
      />
      {notice && (
        <div className="mb-4">
          <Notice tone={notice.tone}>{notice.text}</Notice>
        </div>
      )}
      {error && (
        <div className="mb-4">
          <Notice>{error}</Notice>
        </div>
      )}
      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="relative block xl:col-span-2">
            <span className="sr-only">Search orders</span>
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className={`${fieldClass} mt-0 pl-9`}
              placeholder="Search customer, phone, or order ID"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
          </label>
          <select
            aria-label="Filter order status"
            className={`${fieldClass} mt-0`}
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
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-slate-500">
              From
              <input
                className={`${fieldClass} mt-1`}
                type="date"
                value={fromDate}
                onChange={(event) => {
                  setFromDate(event.target.value);
                  setPage(1);
                }}
              />
            </label>
            <label className="text-xs text-slate-500">
              To
              <input
                className={`${fieldClass} mt-1`}
                type="date"
                value={toDate}
                onChange={(event) => {
                  setToDate(event.target.value);
                  setPage(1);
                }}
              />
            </label>
          </div>
        </div>
        {error ? null : filtered.length === 0 ? (
          <EmptyState>
            {orders.length
              ? "No orders match these filters."
              : "No orders have been submitted yet."}
          </EmptyState>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    {[
                      "Customer",
                      "Phone",
                      "Products",
                      "Submitted",
                      "Status",
                      "Actions",
                    ].map((label) => (
                      <th key={label} className="px-3 py-3">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-3 py-3 font-semibold">
                        {order.fullName}
                      </td>
                      <td className="px-3 py-3">{order.phone}</td>
                      <td className="px-3 py-3">
                        {order.products?.length || 0} items
                      </td>
                      <td className="px-3 py-3">
                        {dateLabel(order.createdAt)}
                      </td>
                      <td className="px-3 py-3">
                        {order.status === "DELIVERED" ? (
                          <StatusTag value={order.status} />
                        ) : (
                          <select
                            aria-label={`Status for ${order.fullName}`}
                            disabled={savingId === order._id}
                            className="rounded-lg border border-slate-300 px-2 py-2 text-xs"
                            value={order.status}
                            onChange={(event) =>
                              changeStatus(order, event.target.value)
                            }
                          >
                            {statuses.map((value) => (
                              <option key={value}>{value}</option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-1">
                          <button
                            title="View order"
                            aria-label={`View order for ${order.fullName}`}
                            className="grid size-9 place-items-center rounded-lg hover:bg-slate-100"
                            onClick={() => setViewing(order)}
                          >
                            <FiEye />
                          </button>
                          <button
                            title="Delete order"
                            aria-label={`Delete order for ${order.fullName}`}
                            className="grid size-9 place-items-center rounded-lg text-rose-700 hover:bg-rose-50"
                            onClick={() => deleteOrder(order)}
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
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-detail-title"
            className="my-auto w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl sm:p-7"
          >
            <div className="flex items-center justify-between">
              <h2 id="order-detail-title" className="text-xl font-bold">
                Order details
              </h2>
              <button
                onClick={() => setViewing(null)}
                className="rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
              >
                Close
              </button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Detail label="Order ID" value={viewing._id} />
              <Detail label="Customer" value={viewing.fullName} />
              <Detail label="Phone" value={viewing.phone} />
              <Detail label="Customer type" value={viewing.customerType} />
              <Detail
                label="Delivery location"
                value={viewing.deliveryLocation}
              />
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Status
                </p>
                <div className="mt-1">
                  <StatusTag value={viewing.status} />
                </div>
              </div>
              <Detail label="Submitted" value={dateLabel(viewing.createdAt)} />
            </div>
            <h3 className="mt-6 font-bold">Products</h3>
            <ul className="mt-2 divide-y divide-slate-100 rounded-lg border border-slate-200 px-4">
              {(viewing.products || []).map((item) => (
                <li
                  key={item._id || item.productId}
                  className="flex justify-between gap-3 py-3 text-sm"
                >
                  <span>{item.productName}</span>
                  <b>× {item.quantity}</b>
                </li>
              ))}
            </ul>
            <h3 className="mt-5 font-bold">Additional notes</h3>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {viewing.additionalNotes || "No additional notes."}
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
      <p className="mt-1 break-words text-sm text-slate-900">{value || "—"}</p>
    </div>
  );
}
