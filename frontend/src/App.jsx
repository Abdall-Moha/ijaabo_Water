import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import ProductsServices from "./pages/ProductsServices.jsx";
import QualitySafety from "./pages/QualitySafety.jsx";
import Process from "./pages/Process.jsx";
import Impact from "./pages/Impact.jsx";
import Partners from "./pages/Partners.jsx";
import Contact from "./pages/Contact.jsx";
import Placeholder from "./pages/Placeholder.jsx";
import { RequireAdmin } from "./admin/AdminLayout.jsx";
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminOverview from "./admin/pages/AdminOverview.jsx";
import AdminProducts from "./admin/pages/AdminProducts.jsx";
import AdminOrders from "./admin/pages/AdminOrders.jsx";
import AdminQualityReports from "./admin/pages/AdminQualityReports.jsx";
import AdminPartners from "./admin/pages/AdminPartners.jsx";
import AdminInquiries from "./admin/pages/AdminInquiries.jsx";
import AdminSettings from "./admin/pages/AdminSettings.jsx";
import AdminUsers from "./admin/pages/AdminUsers.jsx";

function AdminNotFound() {
  return <section className="rounded-xl border border-slate-200 bg-white p-8"><h2 className="text-xl font-bold">Admin page not found</h2><p className="mt-2 text-sm text-slate-600">Choose a page from the admin menu.</p></section>;
}

export default function App() {
  const { pathname } = useLocation();
  const isAdminPage = pathname.startsWith("/admin");

  return <>
    {!isAdminPage && <Header />}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/products-services" element={<ProductsServices />} />
      <Route path="/quality-safety" element={<QualitySafety />} />
      <Route path="/process" element={<Process />} />
      <Route path="/impact" element={<Impact />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin" element={<RequireAdmin />}>
        <Route index element={<AdminOverview />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="quality-reports" element={<AdminQualityReports />} />
        <Route path="partners" element={<AdminPartners />} />
        <Route path="inquiries" element={<AdminInquiries />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="*" element={<AdminNotFound />} />
      </Route>
      <Route path="*" element={<Placeholder title="Page not found" />} />
    </Routes>
    {!isAdminPage && <Footer />}
  </>;
}
