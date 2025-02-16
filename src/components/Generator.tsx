
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Wand2 } from "lucide-react";
import { toast } from "sonner";

const RESOLUTIONS = [
  { label: "Square (1024x1024)", value: "1024x1024" },
  { label: "Portrait (1024x1536)", value: "1024x1536" },
  { label: "Landscape (1536x1024)", value: "1536x1024" },
];

export const Generator = () => {
  const [prompt, setPrompt] = useState("");
  const [resolution, setResolution] = useState("1024x1024");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description first");
      return;
    }

    setIsGenerating(true);
    // TODO: Implement actual API call
    toast.info("Generation started...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGenerating(false);
    toast.success("Your coloring page is ready!");
  };

  return (
    <div id="generator" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-up">
          <div className="text-center space-y-4">
            <h2 className="font-display text-4xl font-bold text-primary">
              Create Your Coloring Page
            </h2>
            <p className="text-gray-600">
              Describe what you'd like to color, choose your preferred size, and let our AI do the magic.
            </p>
          </div>

          <div className="space-y-6 bg-secondary p-8 rounded-xl">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Describe your perfect coloring page
              </label>
              <Textarea
                placeholder="E.g., A magical forest with unicorns and fairies..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Choose page size
              </label>
              <Select value={resolution} onValueChange={setResolution}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {RESOLUTIONS.map((res) => (
                    <SelectItem key={res.value} value={res.value}>
                      {res.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
        </div>
      </div>
    </div>
  );
};
