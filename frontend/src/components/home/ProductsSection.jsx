import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, getImageUrl } from "../../services/api.js";

function ProductArtwork() {
  return <div className="grid h-full w-full place-items-center text-sm text-slate-500">Image unavailable</div>;
}

function ProductCard({ product }) {
  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg">
      <div className="flex h-32 shrink-0 items-center justify-center overflow-hidden bg-slate-100 p-2 min-[420px]:h-40 sm:h-52 sm:p-4">
        {product.image ? <img className="max-h-full max-w-full object-contain object-center" src={getImageUrl(product.image)} alt={product.name} loading="lazy" /> : <ProductArtwork />}
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <span className="inline-block self-start rounded bg-sky-50 px-2 py-1 text-[11px] font-bold text-ocean sm:px-2.5 sm:py-1.5 sm:text-xs">{product.size}</span>
        <h3 className="mb-1.5 mt-2 break-words text-sm leading-snug font-bold text-navy sm:mb-2 sm:mt-3 sm:text-lg">{product.name}</h3>
        <p className="mb-3 line-clamp-3 text-xs leading-5 text-slate-600 sm:mb-4 sm:line-clamp-none sm:min-h-12 sm:text-sm sm:leading-6">{product.description || "Clean drinking water for your everyday needs."}</p>
        <Link className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-ocean hover:text-ocean-dark focus-visible:outline-2 focus-visible:outline-gold sm:gap-2 sm:text-sm" to="/contact">Order this product <span aria-hidden="true">→</span></Link>
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
    <section id="products" className="my-7 bg-[linear-gradient(135deg,rgba(0,102,190,0.93),rgba(8,117,206,0.88)),url('/home-water-splash.png')] bg-cover bg-center py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-[calc(100%-2.25rem)] max-w-[1200px] sm:w-[calc(100%-3rem)]">
        <div className="mb-8 flex flex-col items-center text-center sm:mb-9">
          <span className="text-xs font-bold tracking-wider text-sky-100">OUR PRODUCTS</span>
          <h2 className="mt-3 text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl lg:text-[3.25rem]">Clean water in every size.</h2>
        </div>
        <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-3">
          {loading && <ProductMessage loading>Loading available products…</ProductMessage>}
          {!loading && error && <ProductMessage><b className="text-base text-navy">Products are temporarily unavailable.</b><span>Please contact us for the current range.</span></ProductMessage>}
          {!loading && !error && products.length === 0 && <ProductMessage><b className="text-base text-navy">Product information is being updated.</b><span>Call 2828 and our team can help with current availability.</span></ProductMessage>}
          {!loading && !error && products.map((product) => <ProductCard key={product._id || `${product.name}-${product.size}`} product={product} />)}
        </div>
      </div>
    </section>
  );
}