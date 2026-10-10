import { useEffect, useState } from "react";
import { FiDroplet, FiHome, FiTruck, FiUsers, FiArrowUpRight, FiCoffee, FiBookOpen, FiBriefcase, FiHeart, FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";
import { api, getImageUrl } from "../services/api.js";

const officialProducts = [
  { size: "20 Litre", name: "Home & Office Gallon", use: "Homes · Offices · Restaurants · Institutions", description: "The standard gallon for household and office use, compatible with standard water coolers and dispenser units.", image: "/Ijaabo%20Bottle.webp" },
  { size: "1.5 Litre", name: "Family Daily Bottle", use: "Family · Daily Use · Retail", description: "Designed for everyday family drinking needs — affordable, clean, and widely available in retail stores.", image: "https://ijaabowater.so/wp-content/themes/ijaabo-water/images/Asset%206.webp" },
  { size: "600ml", name: "Carry & Go Bottle", use: "Schools · Offices · Events", description: "Portable and convenient — ideal for schools, workplace hydration stations, and large event supplies.", image: "https://ijaabowater.so/wp-content/themes/ijaabo-water/images/Asset%209.webp" },
  { size: "500ml", name: "Standard Retail Bottle", use: "Retail · Supermarkets · Hotels", description: "A retail size stocked by supermarkets, hotels, and convenience stores.", image: "/Hero%20Image.jpg" },
  { size: "350ml", name: "Meeting Room Bottle", use: "Conferences · Hospitality · Hotels", description: "A compact bottle for boardrooms, conference tables, and hospitality service.", image: "https://ijaabowater.so/wp-content/themes/ijaabo-water/images/Asset%208.webp" },
  { size: "330ml", name: "Slim Serving Bottle", use: "Events · Catering · Restaurants", description: "A compact option for restaurant table settings, catering, and event water supply.", image: "https://ijaabowater.so/wp-content/themes/ijaabo-water/images/Asset%2010.webp" },
];

const offers = [
  [FiDroplet, "Bottled Water", "Bottled water in six sizes, from 330ml to 20 litres, for different customer needs.", "Browse bottle sizes", "#product-range"],
  [FiHome, "Household Water Supply", "Structured subscription-based supply for families and neighborhoods, with metered access.", "Ask about home supply", "/contact"],
  [FiTruck, "Institutional & Bulk Supply", "Supply arrangements for businesses, schools, hospitals, hotels, NGOs, and government institutions.", "Request a discussion", "/contact"],
  [FiUsers, "Training & Employment", "Skills development, water operations training, and micro-franchise distribution opportunities for women and youth.", "Contact the team", "/contact"],
];

const customerTypes = [
  [FiShoppingBag, "Supermarkets", "Retail and wholesale supply enquiries."],
  [FiCoffee, "Hotels & restaurants", "Water supply for hospitality and dining."],
  [FiBookOpen, "Schools & universities", "Supply for schools and campuses."],
  [FiHeart, "Hospitals & clinics", "Discuss water needs for care facilities."],
  [FiBriefcase, "Government & offices", "Institutional and workplace supply."],
  [FiUsers, "NGOs, organizations & events", "Supply for programs and gatherings."],
];

function ProductCard({ product, fallbackImage }) {
  const [imageFailed, setImageFailed] = useState(false);
  const image = product.image ? getImageUrl(product.image) : fallbackImage;
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg">
      <div className="flex h-48 items-center justify-center overflow-hidden bg-slate-50 p-3 sm:h-56 sm:p-4">
        {image && !imageFailed ? <img className="max-h-full max-w-full object-contain object-center" src={image} alt={`${product.name} ${product.size}`} loading="lazy" onError={() => setImageFailed(true)} /> : <div className="grid h-full place-items-center text-2xl font-semibold text-sky-200">{product.size}</div>}
      </div>
      <div className="p-5 sm:p-6">
        <span className="inline-flex rounded-md bg-sky-50 px-3 py-1.5 text-sm font-bold text-ocean">{product.size}</span>
        <h3 className="mt-3 text-xl font-bold text-navy">{product.name}</h3>
        {product.use && <p className="mt-1 text-xs font-semibold leading-5 text-ocean">{product.use}</p>}
        <p className="mt-3 min-h-14 text-sm leading-6 text-slate-600">{product.description || "Contact our team for information about this product."}</p>
        <Link className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-ocean hover:text-ocean-dark focus-visible:outline-2 focus-visible:outline-gold" to="/contact">Ask about this size <FiArrowUpRight /></Link>
      </div>
    </article>
  );
}

export default function ProductsServices() {
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

  const displayProducts = products.map((product) => {
    const official = officialProducts.find((item) => item.size.toLowerCase().replace(/\s/g, "") === String(product.size).toLowerCase().replace(/\s/g, ""));
    return { ...product, use: official?.use, fallbackImage: official?.image };
  });

  return (
    <main>
      <section className="bg-slate-50 px-5 py-16 text-center sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <span className="text-xs font-bold tracking-[0.16em] text-ocean">PRODUCTS &amp; SERVICES</span>
          <h1 className="mt-4 text-4xl leading-tight font-bold tracking-tight text-navy sm:text-5xl lg:text-6xl">Clean water in<br className="sm:hidden" /> <span className="text-water">every form.</span></h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">Bottled water, household supply, and institutional distribution — water solutions for individual customers and large organizations.</p>
        </div>
      </section>

      <section className="px-5 py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto mb-9 max-w-3xl text-center"><span className="text-xs font-bold tracking-[0.14em] text-ocean">WHAT WE OFFER</span><h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">Comprehensive water solutions</h2><p className="mt-4 text-base leading-7 text-slate-600">Ijaabo serves individual customers, families, businesses, and institutions with water supply services.</p></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {offers.map(([Icon, title, copy, action, href]) => <article className="flex min-h-64 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg sm:p-6" key={title}><div className="grid size-12 place-items-center rounded-xl bg-sky-50 text-2xl text-ocean"><Icon /></div><h3 className="mt-5 text-lg font-bold text-navy">{title}</h3><p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{copy}</p><Link className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-ocean hover:text-ocean-dark" to={href}>{action}<FiArrowUpRight /></Link></article>)}
          </div>
        </div>
      </section>

      <section id="product-range" className="bg-slate-50 px-5 py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto mb-9 max-w-3xl text-center"><span className="text-xs font-bold tracking-[0.14em] text-ocean">PRODUCT RANGE</span><h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">Ijaabo Water bottle sizes</h2><p className="mt-4 text-base leading-7 text-slate-600">The company’s published range includes six sizes. Contact Ijaabo for current availability and ordering information.</p></div>
          {loading && <p className="mb-5 text-center text-sm text-slate-500">Loading current product information…</p>}
          {!loading && error && <p className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-900">The live product catalog is temporarily unavailable. Please try again later or call 2828.</p>}
          {!loading && !error && products.length === 0 && <p className="mb-5 rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-600">No active products are currently published.</p>}
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">{displayProducts.map((product, index) => <ProductCard key={product._id || `${product.name}-${product.size}`} product={product} fallbackImage={product.fallbackImage || officialProducts[index % officialProducts.length].image} />)}</div>
        </div>
      </section>

      <section className="mx-auto grid w-[calc(100%-2.25rem)] max-w-[1200px] items-center gap-8 py-14 sm:w-[calc(100%-3rem)] sm:py-16 md:grid-cols-2 lg:gap-16 lg:py-20">
        <div className="order-2 md:order-1"><span className="text-xs font-bold tracking-[0.14em] text-ocean">HOUSEHOLD SUPPLY</span><h2 className="mt-3 text-3xl leading-tight font-bold tracking-tight text-navy sm:text-4xl">Clean water, delivered to your door.</h2><p className="mt-4 text-base leading-8 text-slate-600">Ijaabo describes its household service as structured water access for families and neighborhoods, with subscription-based and metered supply models designed for reliable and fair access.</p><p className="mt-3 text-base leading-8 text-slate-600">The company says it is continuing to expand access beyond its current coverage through stronger infrastructure and distribution.</p><Link className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md bg-ocean px-6 text-sm font-bold text-white hover:bg-ocean-dark" to="/contact">Ask about household supply</Link></div>
        <div className="order-1 flex h-64 items-center justify-center overflow-hidden rounded-2xl bg-sky-50 sm:h-80 md:order-2"><img className="h-full w-full object-contain p-4" src="/Ijaabo%20Bottle.webp" alt="Ijaabo Water household gallon" loading="lazy" /></div>
      </section>

      <section className="bg-slate-50 px-5 py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto mb-9 max-w-3xl text-center"><span className="text-xs font-bold tracking-[0.14em] text-ocean">BULK &amp; INSTITUTIONAL</span><h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">Supply for organizations and communities</h2><p className="mt-4 text-base leading-7 text-slate-600">Ijaabo lists supply services for a range of business, public, and community customers.</p></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{customerTypes.map(([Icon, title, copy]) => <article className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-md" key={title}><div className="grid size-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-xl text-ocean"><Icon /></div><div><h3 className="text-lg font-bold text-navy">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{copy}</p></div></article>)}</div>
          <div className="mt-8 text-center"><Link className="inline-flex min-h-12 items-center justify-center rounded-md bg-ocean px-6 text-sm font-bold text-white hover:bg-ocean-dark" to="/contact">Discuss a supply request</Link></div>
        </div>
      </section>
    </main>
  );
}
