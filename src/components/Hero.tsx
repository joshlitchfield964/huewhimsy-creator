
import { Button } from "@/components/ui/button";
import { MoveDown, Sparkles } from "lucide-react";
import { toast } from "sonner";

const randomPrompts = [
  "A magical forest with unicorns playing among rainbow waterfalls",
  "A cozy treehouse filled with fairy lights and reading nooks",
  "An underwater city with mermaids and friendly sea creatures",
  "A space adventure with astronaut cats exploring new planets",
  "A whimsical garden party with dancing flowers and butterflies",
  "A dragon's treasure cave filled with sparkling gems and gold",
];

export const Hero = () => {
  const scrollToGenerator = () => {
    document.getElementById("generator")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  const getRandomPrompt = () => {
    const prompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    // Copy to clipboard
    navigator.clipboard.writeText(prompt).then(() => {
      toast.success("Prompt copied to clipboard!", {
        description: prompt,
      });
    });
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-secondary">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/80 z-0" />
      <div className="container mx-auto px-4 py-8 md:py-16 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="text-left max-w-2xl space-y-8 animate-fade-down">
            <h1 className="font-sans text-5xl md:text-7xl font-bold leading-tight">
              Transform <span className="text-pink-500">Words</span> into Beautiful{" "}
              <span className="text-purple-500">Coloring</span>{" "}
              <span className="text-blue-500">Pages</span>
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
                onClick={scrollToHowItWorks}
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
