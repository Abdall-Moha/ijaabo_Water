import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, getImageUrl } from "../../services/api.js";

function ProductArtwork() {
  return <div className="grid h-full w-full place-items-center text-sm text-slate-500">Image unavailable</div>;
}

function ProductCard({ product }) {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg">
      <div className="flex h-40 items-center justify-center overflow-hidden bg-slate-100 p-3 sm:h-52 sm:p-4">
        {product.image ? <img className="max-h-full max-w-full object-contain object-center" src={getImageUrl(product.image)} alt={product.name} loading="lazy" /> : <ProductArtwork />}
      </div>
      <div className="p-4 sm:p-5">
        <span className="inline-block rounded bg-sky-50 px-2.5 py-1.5 text-xs font-bold text-ocean">{product.size}</span>
        <h3 className="mb-2 mt-3 text-lg leading-snug font-bold text-navy">{product.name}</h3>
        <p className="mb-4 min-h-12 text-sm leading-6 text-slate-600">{product.description || "Clean drinking water for your everyday needs."}</p>
        <Link className="inline-flex items-center gap-2 text-sm font-bold text-ocean hover:text-ocean-dark focus-visible:outline-2 focus-visible:outline-gold" to="/contact">Order this product <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}

function ProductMessage({ children, loading = false }) {
  return <div className="col-span-full flex min-h-48 flex-col items-center justify-center gap-2 rounded-lg bg-slate-50 px-5 text-center text-sm text-slate-600">
    {loading && <span className="mb-1 size-5 animate-spin rounded-full border-2 border-sky-100 border-t-ocean motion-reduce:animate-none" aria-hidden="true" />}
    {children}
  </div>;
}

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    api.get("/products").then(({ data }) => {
      if (active) setProducts(Array.isArray(data) ? data : []);
    }).catch(() => {
      if (active) setError(true);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-[calc(100%-2.25rem)] max-w-[1200px] sm:w-[calc(100%-3rem)]">
        <div className="mb-8 flex flex-col items-center text-center sm:mb-9">
          <span className="text-xs font-bold tracking-wider text-ocean">OUR PRODUCTS</span>
          <h2 className="mt-3 text-3xl leading-tight font-bold tracking-tight text-navy sm:text-4xl lg:text-[3.25rem]">Clean water in every size.</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {loading && <ProductMessage loading>Loading available products…</ProductMessage>}
          {!loading && error && <ProductMessage><b className="text-base text-navy">Products are temporarily unavailable.</b><span>Please contact us for the current range.</span></ProductMessage>}
          {!loading && !error && products.length === 0 && <ProductMessage><b className="text-base text-navy">Product information is being updated.</b><span>Call 2828 and our team can help with current availability.</span></ProductMessage>}
          {!loading && !error && products.map((product) => <ProductCard key={product._id || `${product.name}-${product.size}`} product={product} />)}
        </div>
      </div>
    </section>
  );
}
