
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Generator } from "@/components/Generator";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { Gallery } from "@/components/Gallery";
import { FAQ } from "@/components/FAQ";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Generator />
      <HowItWorks />
      <Features />
      <Gallery />
      <FAQ />
      <Newsletter />
      <Footer />
    </div>
  );
}
