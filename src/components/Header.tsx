
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Palette, LogOut } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

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
            {session ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary transition">
                  Dashboard
                </Link>
                <Button 
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={() => navigate("/auth")}
              >
                Get Started
              </Button>
            )}
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
            {session ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-primary transition py-2"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <Button 
                  variant="outline"
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                className="bg-primary hover:bg-primary/90 w-full"
                onClick={() => {
                  navigate("/auth");
                  toggleMenu();
                }}
              >
                Get Started
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
