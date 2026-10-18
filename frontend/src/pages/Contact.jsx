import { useEffect, useMemo, useState } from "react";
import { FiMail, FiMapPin, FiPhone, FiMinus, FiPlus } from "react-icons/fi";
import { api } from "../services/api.js";

const requestedProducts = [
  "20L Gallon",
  "1.5L Bottles",
  "600ml Bottles",
  "500ml Bottles",
  "350ml Bottles",
  "330ml Bottles",
];

const customerTypes = [
  "Household",
  "Shop",
  "Supermarket",
  "Hotel",
  "Restaurant",
  "School",
  "University",
  "NGO",
  "Government Office",
  "Corporate Client",
  "Event",
  "Other",
];

const emptyQuantities = Object.fromEntries(
  requestedProducts.map((name) => [name, 0]),
);

const inputClass =
  "mt-3 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-ocean focus:ring-2 focus:ring-sky-100";

function matchesRequestedSize(product, requested) {
  const details = `${product.name || ""} ${product.size || ""}`
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  if (requested.startsWith("20L")) {
    return (
      details.includes("20l") ||
      details.includes("20litre") ||
      details.includes("20liter") ||
      details.includes("gallon")
    );
  }

  const size = requested.match(/\d+(?:\.\d+)?\s*(?:ml|l)/i)?.[0];
  if (!size) return false;

  const normalizedSize = size.toLowerCase().replace(/[^a-z0-9]/g, "");
  return details.includes(normalizedSize);
}

export default function Contact() {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);
  const [quantities, setQuantities] = useState(emptyQuantities);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    customerType: "",
    deliveryLocation: "",
    additionalNotes: "",
  });

  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState({ type: "", text: "" });

  // Load available products from the backend.
  useEffect(() => {
    let active = true;

    api
      .get("/products")
      .then(({ data }) => {
        if (active) setProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setProductsError(true);
      })
      .finally(() => {
        if (active) setProductsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Prepare selected products for the order request.
  const selected = useMemo(
    () =>
      requestedProducts.flatMap((name) => {
        const quantity = quantities[name];
        const product = products.find((item) =>
          matchesRequestedSize(item, name),
        );

        return quantity > 0 && product
          ? [{ productId: product._id, quantity, label: name }]
          : [];
      }),
    [quantities, products],
  );

  const selectedTotal = selected.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  // Update the quantity using the input or + and - buttons.
  function changeQuantity(name, value) {
    const quantity = Math.max(0, Math.floor(Number(value) || 0));

    setQuantities((current) => ({
      ...current,
      [name]: quantity,
    }));
  }

  function adjustQuantity(name, amount) {
    setQuantities((current) => ({
      ...current,
      [name]: Math.max(0, current[name] + amount),
    }));
  }

  // Validate and submit the order.
  async function submit(event) {
    event.preventDefault();
    setResult({ type: "", text: "" });

    if (selectedTotal < 1) {
      setResult({
        type: "error",
        text: "Please choose a quantity for at least one product.",
      });
      return;
    }

    const chosenCount = Object.values(quantities).filter(
      (quantity) => quantity > 0,
    ).length;

    if (selected.length !== chosenCount) {
      setResult({
        type: "error",
        text: "A selected size is unavailable in the product catalog. Please adjust your selection or contact us.",
      });
      return;
    }

    setBusy(true);

    try {
      const { data } = await api.post("/orders", {
        fullName: form.fullName,
        phone: form.phone,
        customerType: form.customerType,
        products: selected.map(({ productId, quantity }) => ({
          productId,
          quantity,
        })),
        deliveryLocation: form.deliveryLocation,
        additionalNotes: form.additionalNotes,
      });

      setResult({
        type: "success",
        text:
          data?.message ||
          "Your order request was accepted. Our team will confirm the details with you.",
      });

      setQuantities(emptyQuantities);
      setForm({
        fullName: "",
        phone: "",
        customerType: "",
        deliveryLocation: "",
        additionalNotes: "",
      });
    } catch (error) {
      setResult({
        type: "error",
        text:
          error.response?.data?.message ||
          "We could not submit your order. Please try again or call 2828.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-16">
      <div className="mx-auto grid w-full max-w-[1120px] items-start gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
        {/* Contact information */}
        <section className="h-fit rounded-2xl bg-[linear-gradient(rgba(0,72,150,0.92),rgba(0,88,188,0.88)),url('/home-water-splash.png')] bg-cover bg-center p-6 sm:p-8">
          <div className="mb-8 text-center">
            <span className="text-xs font-bold tracking-[0.18em] text-sky-100">
              CONTACT & ORDER
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
              Get in Touch
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-sky-100">
              Contact our team for orders, partnerships, and delivery questions.
            </p>
          </div>

          <div className="space-y-7">
            <ContactDetail Icon={FiMapPin} label="Headquarters">
              Mogadishu, Somalia
            </ContactDetail>

            <ContactDetail Icon={FiPhone} label="Call Center">
              <a
                href="tel:2828"
                className="font-semibold text-[#ffdf65] hover:underline"
              >
                2828
              </a>
            </ContactDetail>

            <ContactDetail Icon={FiMail} label="General Email">
              <a
                href="mailto:info@ijaabo.com"
                className="break-all font-semibold text-[#ffdf65] hover:underline"
              >
                info@ijaabo.com
              </a>
            </ContactDetail>

            <ContactDetail Icon={FiMail} label="Sales Inquiry">
              <a
                href="mailto:sales@ijaabo.com"
                className="break-all font-semibold text-[#ffdf65] hover:underline"
              >
                sales@ijaabo.com
              </a>
            </ContactDetail>

            <ContactDetail Icon={FiMail} label="Partnership Inquiry">
              <a
                href="mailto:partners@ijaabo.com"
                className="break-all font-semibold text-[#ffdf65] hover:underline"
              >
                partners@ijaabo.com
              </a>
            </ContactDetail>
          </div>
        </section>

        {/* Order form */}
        <section
          id="order-form"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Place a Water Order
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-600">
              Complete the form and our team will confirm your order and
              delivery details within 24 hours.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-7">
            {/* Customer details */}
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-navy">
                Full Name *
                <input
                  className={inputClass}
                  name="fullName"
                  value={form.fullName}
                  onChange={updateForm}
                  required
                />
              </label>

              <label className="block text-sm font-semibold text-navy">
                Phone Number *
                <input
                  className={inputClass}
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={updateForm}
                  required
                />
              </label>

              <label className="block text-sm font-semibold text-navy">
                Customer Type *
                <select
                  className={inputClass}
                  name="customerType"
                  value={form.customerType}
                  onChange={updateForm}
                  required
                >
                  <option value="">Select type</option>
                  {customerTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-navy">
                Delivery Location *
                <input
                  className={inputClass}
                  name="deliveryLocation"
                  placeholder="Your district / address"
                  value={form.deliveryLocation}
                  onChange={updateForm}
                  required
                />
              </label>
            </div>

            {/* Product quantities */}
            <fieldset>
              <legend className="text-base font-bold text-navy">
                Products and quantities *
              </legend>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Use the + and − buttons to select your quantities.
              </p>

              {productsLoading && (
                <p className="mt-4 text-sm text-slate-500">
                  Loading available products...
                </p>
              )}

              {productsError && (
                <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                  Product availability could not be loaded. Please refresh and
                  try again.
                </p>
              )}

              {!productsLoading && !productsError && products.length === 0 && (
                <p className="mt-4 rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
                  No products are currently available.
                </p>
              )}

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {requestedProducts.map((name) => {
                  const product = products.find((item) =>
                    matchesRequestedSize(item, name),
                  );

                  return (
                    <div
                      key={name}
                      className="flex min-h-[88px] items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-slate-300"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-navy">
                          {name}
                        </p>

                        {product && (
                          <p className="mt-2 truncate text-xs text-slate-500">
                            {product.name}
                          </p>
                        )}

                        {!productsLoading && !product && !productsError && (
                          <p className="mt-2 text-xs text-slate-400">
                            Unavailable
                          </p>
                        )}
                      </div>

                      {/* Quantity controls */}
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          aria-label={`Decrease ${name} quantity`}
                          disabled={!product || quantities[name] === 0}
                          onClick={() => adjustQuantity(name, -1)}
                          className="grid size-9 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-ocean hover:bg-sky-50 hover:text-ocean focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <FiMinus size={15} strokeWidth={2.5} />
                        </button>

                        <input
                          aria-label={`${name} quantity`}
                          className="h-9 w-12 rounded-lg border border-slate-200 bg-white text-center text-sm font-bold text-navy outline-none focus:border-ocean focus:ring-2 focus:ring-sky-100 disabled:bg-slate-50"
                          type="number"
                          min="0"
                          step="1"
                          disabled={!product}
                          value={quantities[name]}
                          onChange={(event) =>
                            changeQuantity(name, event.target.value)
                          }
                        />

                        <button
                          type="button"
                          aria-label={`Increase ${name} quantity`}
                          disabled={!product}
                          onClick={() => adjustQuantity(name, 1)}
                          className="grid size-9 place-items-center rounded-lg bg-ocean text-white transition hover:bg-ocean-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <FiPlus size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </fieldset>

            {/* Order summary */}
            <section
              aria-live="polite"
              className="rounded-xl border border-sky-100 bg-sky-50 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-navy">Order summary</h3>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ocean">
                  {selected.length} {selected.length === 1 ? "item" : "items"}
                </span>
              </div>

              {selected.length > 0 ? (
                <ul className="mt-4 space-y-3 text-sm text-slate-700">
                  {selected.map((item) => (
                    <li key={item.label} className="flex justify-between gap-3">
                      <span>{item.label}</span>
                      <span className="font-semibold">{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Your selected products will appear here.
                </p>
              )}

              <div className="mt-5 flex justify-between border-t border-sky-100 pt-4 text-sm font-bold text-navy">
                <span>Total units</span>
                <span>{selectedTotal}</span>
              </div>
            </section>

            {/* Additional notes */}
            <label className="block text-sm font-semibold text-navy">
              Additional Notes
              <textarea
                className={`${inputClass} min-h-28 py-3`}
                name="additionalNotes"
                placeholder="Any special delivery instructions? (Optional)"
                value={form.additionalNotes}
                onChange={updateForm}
              />
            </label>

            {/* Submission feedback */}
            {result.text && (
              <p
                role="status"
                className={`rounded-lg p-4 text-sm leading-6 ${
                  result.type === "success"
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-rose-50 text-rose-800"
                }`}
              >
                {result.text}
              </p>
            )}

            <button
              type="submit"
              disabled={busy || productsLoading || products.length === 0}
              className="min-h-12 w-full rounded-lg bg-[#ffdf65] px-5 text-sm font-bold text-[#073d73] transition hover:bg-[#ffe98f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Submitting order..." : "Send Order Request"}
            </button>

            <p className="text-center text-xs leading-6 text-slate-500">
              Our team will confirm your order within 24 hours.
              <br />
              Same-day delivery available in Mogadishu.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}

// Reusable contact information row.
function ContactDetail({ Icon, label, children }) {
  return (
    <div className="flex items-start gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-lg text-ocean shadow-sm">
        <Icon />
      </span>

      <div className="min-w-0 pt-0.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-sky-100">
          {label}
        </h2>

        <div className="mt-2 break-words text-sm leading-6 text-white">
          {children}
        </div>
      </div>
    </div>
  );
}
