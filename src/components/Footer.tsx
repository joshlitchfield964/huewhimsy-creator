
import { Github, Twitter, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold">ColorPage AI</h3>
            <p className="text-gray-300">
              Transform your ideas into beautiful coloring pages with the power of AI.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-300 hover:text-white transition">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-300 hover:text-white transition">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-300 hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <div className="flex flex-col space-y-3">
              <div className="flex space-x-4">
                <a
                  href="https://twitter.com/colorpageai"
                  className="text-gray-300 hover:text-white transition"
                  aria-label="Twitter"
                >
                  <Twitter className="h-6 w-6" />
                </a>
                <a
                  href="https://github.com/colorpageai"
                  className="text-gray-300 hover:text-white transition"
                  aria-label="GitHub"
                >
                  <Github className="h-6 w-6" />
                </a>
              </div>
              <a href="mailto:info@colorpageai.com" className="text-gray-300 hover:text-white transition flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                info@colorpageai.com
              </a>
              <a href="tel:+15551234567" className="text-gray-300 hover:text-white transition flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                +1 (555) 123-4567
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} ColorPage AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
