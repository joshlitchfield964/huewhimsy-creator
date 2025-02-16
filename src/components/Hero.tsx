
import { Button } from "@/components/ui/button";
import { MoveDown } from "lucide-react";

export const Hero = () => {
  const scrollToGenerator = () => {
    document.getElementById("generator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-secondary">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/80 z-0" />
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="text-left max-w-2xl space-y-8 animate-fade-down">
            <h1 className="font-display text-5xl md:text-7xl font-bold">
              Transform{" "}
              <span className="text-pink-500">Words</span> into
              <span className="block mt-2">
                Beautiful{" "}
                <span className="text-purple-500">Coloring</span>{" "}
                <span className="text-blue-500">Pages</span>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Create <span className="text-orange-500 font-semibold">unique</span> coloring pages from your{" "}
              <span className="text-green-500 font-semibold">imagination</span>. Simply describe what you want, and watch as{" "}
              <span className="text-purple-500 font-semibold">AI</span> brings your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={scrollToGenerator}
                size="lg"
                className="bg-primary text-white hover:bg-primary/90 text-lg px-8"
              >
                Start Creating
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="group text-lg"
                onClick={scrollToGenerator}
              >
                See How It Works
                <MoveDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
              </Button>
            </div>
          </div>
          <div className="w-full max-w-md lg:max-w-xl animate-fade-up">
            <img
              src="/lovable-uploads/6eeb0c41-2def-4dd9-a76f-ced53b7f7cbb.png"
              alt="Coloring page creator illustration"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
