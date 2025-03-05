
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Generator } from "@/components/Generator";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { FAQ } from "@/components/FAQ";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import { FontTest } from "@/components/FontTest";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Header />
      <FontTest />
      <Hero />
      <Generator />
      <HowItWorks />
      <Features />
      <FAQ />
      <Newsletter />
      <Footer />
    </div>
  );
}
