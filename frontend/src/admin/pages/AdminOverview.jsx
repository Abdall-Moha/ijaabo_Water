import { useEffect, useState } from "react";
import { FiActivity, FiBox, FiFileText, FiPlus, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import { api } from "../../services/api.js";
import { EmptyState, Loading, PageHeader, StatusTag } from "../AdminUI.jsx";

const resources = [
  ["products", "/products/admin"],
  ["orders", "/orders"],
  ["inquiries", "/partnership-requests"],
];
const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
        new Date(date),
      )
    : "—";

export default function AdminOverview() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    Promise.all(
      resources.map(async ([key, path]) => {
        try {
          const response = await api.get(path);
          return [key, Array.isArray(response.data) ? response.data : []];
        } catch {
          return [key, null];
        }
      }),
    )
      .then((results) => {
        if (active) setData(Object.fromEntries(results));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <Loading label="Loading dashboard data…" />;
  const products = data.products;
  const orders = data.orders;
  const inquiries = data.inquiries;
  const metrics = [
    ["Products", products?.length, FiBox],
    [
      "Published products",
      products?.filter((product) => product.isActive).length,
      FiBox,
    ],
    ["Total orders", orders?.length, FiActivity],
    [
      "Pending orders",
      orders?.filter((order) => order.status === "PENDING").length,
      FiActivity,
    ],
    [
      "Delivered orders",
      orders?.filter((order) => order.status === "DELIVERED").length,
      FiActivity,
    ],
    ["Partnership inquiries", inquiries?.length, FiUsers],
  ];
  const statusCounts =
    orders?.reduce(
      (result, order) => ({
        ...result,
        [order.status]: (result[order.status] || 0) + 1,
      }),
      {},
    ) || {};
  const recentOrders = orders?.slice(0, 5) || [];
  const recentInquiries = inquiries?.slice(0, 5) || [];

  return (
    <div>
      <PageHeader
        title="Dashboard overview"
        description="Current totals and recent activity from your Ijaabo Water records."
        action={
          <Link
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#2B4593] px-4 text-sm font-semibold text-white hover:bg-blue-900"
            to="/admin/products"
          >
            <FiPlus />
            Add product
          </Link>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
        {metrics.map(([label, value, Icon]) => (
          <article
            key={label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="min-w-0 text-xs font-medium leading-5 text-slate-600 sm:text-sm">
                {label}
              </p>
              <Icon className="shrink-0 text-lg text-[#2B4593] sm:text-xl" />
            </div>
            <p className="mt-3 break-words text-xl font-bold text-slate-900 sm:text-3xl">
              {value === undefined
                ? "Unavailable"
                : value === null
                  ? "Unavailable"
                  : value}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Recent orders</h2>
            <Link
              className="text-sm font-semibold text-[#2B4593] hover:underline"
              to="/admin/orders"
            >
              View all
            </Link>
          </div>
          {orders === null ? (
            <p className="text-sm text-rose-700">Orders could not be loaded.</p>
          ) : recentOrders.length === 0 ? (
            <EmptyState>No orders have been submitted yet.</EmptyState>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="text-xs uppercase text-slate-500">
                  <tr>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-t border-slate-100">
                      <td className="py-3 font-medium">{order.fullName}</td>
                      <td className="py-3">{order.phone}</td>
                      <td className="py-3">{formatDate(order.createdAt)}</td>
                      <td className="py-3">
                        <StatusTag value={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">
              Order status distribution
            </h2>
            <FiActivity className="text-[#2B4593]" />
          </div>
          {orders === null ? (
            <p className="text-sm text-rose-700">Orders could not be loaded.</p>
          ) : !orders.length ? (
            <EmptyState>No order data to chart yet.</EmptyState>
          ) : (
            <div className="space-y-3">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{status.replaceAll("_", " ")}</span>
                    <b>{count}</b>
                  </div>
                  <progress
                    className="h-2 w-full accent-[#2B4593]"
                    value={count}
                    max={orders.length}
                    aria-label={`${status} orders`}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">
            Recent partnership inquiries
          </h2>
          <Link
            className="text-sm font-semibold text-[#2B4593] hover:underline"
            to="/admin/inquiries"
          >
            Manage inquiries
          </Link>
        </div>
        {inquiries === null ? (
          <p className="text-sm text-rose-700">
            Partnership inquiries could not be loaded.
          </p>
        ) : recentInquiries.length === 0 ? (
          <EmptyState>
            No partnership inquiries have been submitted yet.
          </EmptyState>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {recentInquiries.map((item) => (
              <article
                key={item._id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">
                    {item.organizationName}
                  </h3>
                  <StatusTag value={item.status} />
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {item.organizationType}
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  {formatDate(item.createdAt)}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
      <p className="mt-5 flex items-center gap-2 text-xs text-slate-500">
        <FiFileText />
        Counts represent database records returned by the admin API.
      </p>
    </div>
  );
}
