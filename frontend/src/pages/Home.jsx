import Hero from "../components/home/Hero.jsx";
import Statistics from "../components/home/Statistics.jsx";
import ProductsSection from "../components/home/ProductsSection.jsx";
import BulkSupply from "../components/home/BulkSupply.jsx";
import WhyChooseUs from "../components/home/WhyChooseUs.jsx";
import WhoWeServe from "../components/home/WhoWeServe.jsx";
import ImpactFeature from "../components/home/ImpactFeature.jsx";
import CallToAction from "../components/home/CallToAction.jsx";
import Testimonials from "../components/home/Testimonials.jsx";

export default function Home() {
  return (
    <main>
      <Hero />
      <Statistics />
      <ProductsSection />
      <BulkSupply />
      <WhyChooseUs />
      <WhoWeServe />
      <Testimonials />
      <ImpactFeature />
      <CallToAction />
    </main>
  );
}
