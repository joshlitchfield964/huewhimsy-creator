
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Set up countdown timer for automatic redirect
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redirect to homepage after countdown finishes
    const redirect = setTimeout(() => {
      navigate("/");
    }, 5000);

    // Clean up timers on component unmount
    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
      <div className="text-center max-w-md px-4">
        <div className="mb-6">
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">404</div>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Oops! Page not found</h1>
        </div>

        <p className="text-gray-600 mb-6">
          We couldn't find the page you're looking for. You'll be automatically redirected to the homepage in <span className="font-bold text-pink-500">{countdown}</span> seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go Home Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
