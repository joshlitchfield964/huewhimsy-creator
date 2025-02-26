
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wand2, Info } from "lucide-react";
import { toast } from "sonner";
import { PromptInput } from "./generator/PromptInput";
import { ResolutionSelect } from "./generator/ResolutionSelect";
import { Preview } from "./generator/Preview";
import { AgeGroupSelect } from "./generator/AgeGroupSelect";
import { ModelSelect, MODELS } from "./generator/ModelSelect";
import { runwareService } from "@/services/runware";
import { userGenerationService } from "@/services/userGenerationService";
import { useAuth } from "./AuthProvider";
import type { AgeGroup } from "@/services/runware";
import { useNavigate } from "react-router-dom";

const RESOLUTIONS = [
  { label: "Square (1024x1024)", value: { width: 1024, height: 1024 } },
  { label: "Portrait (1024x1536)", value: { width: 1024, height: 1536 } },
  { label: "Landscape (1536x1024)", value: { width: 1536, height: 1024 } },
];

export const Generator = () => {
  const [prompt, setPrompt] = useState("");
  const [resolution, setResolution] = useState(RESOLUTIONS[0].value);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("school");
  const [model, setModel] = useState<typeof MODELS[number]["value"]>(MODELS[0].value);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [freeGenerationAvailable, setFreeGenerationAvailable] = useState<boolean | null>(null);
  const [remainingToday, setRemainingToday] = useState<number | null>(null);
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check free generation availability when component mounts or session changes
    const checkAvailability = async () => {
      if (session) {
        try {
          const stats = await userGenerationService.getUserGenerationStats();
          if (stats) {
            setFreeGenerationAvailable(stats.freeGenerationAvailable);
            setRemainingToday(stats.remainingToday);
          }
        } catch (error) {
          console.error("Error checking generation availability:", error);
        }
      }
    };

    checkAvailability();
  }, [session]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description first");
      return;
    }

    // If user is not logged in, prompt them to log in
    if (!session) {
      toast.info("Please sign in to generate coloring pages");
      navigate("/auth");
      return;
    }

    // Check if free user has reached their daily limit
    if (!freeGenerationAvailable) {
      toast("You've used your free generation for today", {
        description: "Upgrade to a paid plan for more generations.",
        action: {
          label: "View Plans",
          onClick: () => navigate("/pricing"),
        },
      });
      return;
    }

    setIsGenerating(true);
    toast.info("Generation started...");

    try {
      const result = await runwareService.generateImage({
        positivePrompt: prompt,
        ageGroup,
        width: resolution.width,
        height: resolution.height,
        model: model,
      });

      // Record this generation
      await userGenerationService.recordGeneration();
      
      // Update the remaining generations for today
      const stats = await userGenerationService.getUserGenerationStats();
      if (stats) {
        setFreeGenerationAvailable(stats.freeGenerationAvailable);
        setRemainingToday(stats.remainingToday);
      }

      setGeneratedImage(result.imageURL);
      toast.success("Your coloring page is ready!");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
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
            {session && remainingToday !== null && (
              <div className="flex items-center justify-center gap-2 text-sm font-medium">
                <Info className="h-4 w-4 text-blue-500" />
                {remainingToday > 0 ? (
                  <span className="text-blue-600">
                    You have {remainingToday} free generation{remainingToday !== 1 ? 's' : ''} remaining today
                  </span>
                ) : (
                  <span className="text-gray-600">
                    You've used your free generation for today. 
                    <Button 
                      variant="link" 
                      className="px-1 h-auto text-primary" 
                      onClick={() => navigate('/pricing')}
                    >
                      Upgrade for more
                    </Button>
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6 bg-secondary p-8 rounded-xl">
              <PromptInput prompt={prompt} setPrompt={setPrompt} />
              <ModelSelect model={model} setModel={setModel} />
              <AgeGroupSelect ageGroup={ageGroup} setAgeGroup={setAgeGroup} />
              <ResolutionSelect
                resolution={resolution}
                setResolution={setResolution}
                options={RESOLUTIONS}
              />
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || (session && !freeGenerationAvailable)}
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
              {!session && (
                <p className="text-sm text-center text-gray-600">
                  <Button 
                    variant="link" 
                    className="px-0 h-auto" 
                    onClick={() => navigate('/auth')}
                  >
                    Sign in
                  </Button> to get 1 free generation per day
                </p>
              )}
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
