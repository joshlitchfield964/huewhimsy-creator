
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Gallery as GalleryComponent } from "@/components/Gallery";

export default function Gallery() {
  return (
    <div className="flex flex-col min-h-screen bg-purple-50/50">
      <Header />
      <main className="flex-1 w-full overflow-hidden">
        <GalleryComponent />
      </main>
      <Footer />
    </div>
  );
}
