import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center">
            <span className="text-2xl font-display font-bold">
              Printable
              <span className="text-pink-500">Perks</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-600 hover:text-primary transition">
              Home
            </a>
            <a href="#generator" className="text-gray-600 hover:text-primary transition">
              Create
            </a>
            <a href="#" className="text-gray-600 hover:text-primary transition">
              Gallery
            </a>
            <Button className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </nav>

          <button
            className="md:hidden p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-b">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <a
              href="#"
              className="text-gray-600 hover:text-primary transition py-2"
              onClick={toggleMenu}
            >
              Home
            </a>
            <a
              href="#generator"
              className="text-gray-600 hover:text-primary transition py-2"
              onClick={toggleMenu}
            >
              Create
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-primary transition py-2"
              onClick={toggleMenu}
            >
              Gallery
            </a>
            <Button className="bg-primary hover:bg-primary/90 w-full">
              Get Started
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};
