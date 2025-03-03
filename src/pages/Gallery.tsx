
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Gallery as GalleryComponent } from "@/components/Gallery";

export default function Gallery() {
  return (
    <div className="min-h-screen">
      <Header />
      <GalleryComponent />
      <Footer />
    </div>
  );
}
