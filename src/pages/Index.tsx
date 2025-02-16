
import { Hero } from "@/components/Hero";
import { Generator } from "@/components/Generator";
import { Newsletter } from "@/components/Newsletter";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Generator />
      <Newsletter />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
