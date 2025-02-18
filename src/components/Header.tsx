import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Palette } from "lucide-react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Palette className="h-6 w-6 text-pink-500" />
            <span className="text-2xl font-display font-bold">
              Printable
              <span className="text-pink-500">Perks</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-primary transition">
              Home
            </Link>
            <a href="/#generator" className="text-gray-600 hover:text-primary transition">
              Create
            </a>
            <Link to="/gallery" className="text-gray-600 hover:text-primary transition">
              Gallery
            </Link>
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
            <Link
              to="/"
              className="text-gray-600 hover:text-primary transition py-2"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <a
              href="/#generator"
              className="text-gray-600 hover:text-primary transition py-2"
              onClick={toggleMenu}
            >
              Create
            </a>
            <Link
              to="/gallery"
              className="text-gray-600 hover:text-primary transition py-2"
              onClick={toggleMenu}
            >
              Gallery
            </Link>
            <Button className="bg-primary hover:bg-primary/90 w-full">
              Get Started
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};
