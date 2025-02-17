
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { toast } from "sonner";
import { PromptInput } from "./generator/PromptInput";
import { ResolutionSelect } from "./generator/ResolutionSelect";
import { Preview } from "./generator/Preview";

export const Generator = () => {
  const [prompt, setPrompt] = useState("");
  const [resolution, setResolution] = useState("1024x1024");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description first");
      return;
    }

    setIsGenerating(true);
    // TODO: Implement actual API call
    toast.info("Generation started...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Temporary placeholder image for demonstration
    setGeneratedImage("/placeholder.svg");
    setIsGenerating(false);
    toast.success("Your coloring page is ready!");
  };

  return (
    <div id="generator" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-up">
          <div className="text-center space-y-4">
            <h2 className="font-sans text-4xl font-bold">
              Create Your{" "}
              <span className="text-purple-500">Magical</span>{" "}
              <span className="text-pink-500">Coloring</span>{" "}
              <span className="text-blue-500">Page</span>
            </h2>
            <p className="text-gray-600">
              Describe what you'd like to color, choose your preferred size, and let our{" "}
              <span className="text-orange-500 font-semibold">AI magic</span> do the work.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6 bg-secondary p-8 rounded-xl">
              <PromptInput prompt={prompt} setPrompt={setPrompt} />
              <ResolutionSelect resolution={resolution} setResolution={setResolution} />
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                {isGenerating ? (
                  "Generating..."
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    Generate Coloring Page
                  </>
                )}
              </Button>
            </div>
            <div className="bg-secondary p-8 rounded-xl">
              <Preview generatedImage={generatedImage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
