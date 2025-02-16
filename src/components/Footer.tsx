
import { Github, Twitter } from "lucide-react";

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
                <a href="#" className="text-gray-300 hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  Create
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  Gallery
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition"
                aria-label="GitHub"
              >
                <Github className="h-6 w-6" />
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
