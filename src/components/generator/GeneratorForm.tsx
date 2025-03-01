
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { toast } from "sonner";
import { PromptInput } from "./PromptInput";
import { ResolutionSelect } from "./ResolutionSelect";
import { AgeGroupSelect } from "./AgeGroupSelect";
import { ModelSelect } from "./ModelSelect";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useGeneratorContext } from "./GeneratorContext";
import { runwareService } from "@/services/runware";
import { userGenerationService } from "@/services/userGenerationService";
import { coloringPageService } from "@/services/coloringPageService";

const RESOLUTIONS = [
  { label: "Square (1024x1024)", value: { width: 1024, height: 1024 } },
  { label: "Portrait (1024x1536)", value: { width: 1024, height: 1536 } },
  { label: "Landscape (1536x1024)", value: { width: 1536, height: 1024 } },
];

export const GeneratorForm = () => {
  const {
    prompt,
    setPrompt,
    resolution,
    setResolution,
    ageGroup,
    setAgeGroup,
    model,
    setModel,
    isGenerating,
    setIsGenerating,
    setGeneratedImage,
    freeGenerationAvailable,
    remainingToday,
    isPaidUser,
    remainingMonthly,
    makePublic,
    setMakePublic,
    session,
    navigate,
    checkAvailability,
  } = useGeneratorContext();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description first");
      return;
    }

    if (!freeGenerationAvailable && !isPaidUser) {
      const message = session 
        ? "You've used your 5 free generations for today" 
        : "You've used your 3 free generations for today";
      
      toast(message, {
        description: "Sign up or upgrade to a paid plan for more generations.",
        action: {
          label: session ? "View Plans" : "Sign Up",
          onClick: () => navigate(session ? "/pricing" : "/auth"),
        },
      });
      return;
    }
    
    if (isPaidUser && remainingMonthly !== null && remainingMonthly <= 0) {
      toast("You've reached your monthly generation limit", {
        description: "Your plan allows a limited number of generations per month.",
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

      await userGenerationService.recordGeneration();
      await checkAvailability();

      setGeneratedImage(result.imageURL);
      
      const savedPage = await coloringPageService.saveColoringPage({
        imageUrl: result.imageURL,
        prompt: prompt,
        isPublic: makePublic,
      });
      
      if (savedPage) {
        if (makePublic) {
          toast.success("Your coloring page has been added to the gallery!");
        } else if (session) {
          toast.success("Your coloring page has been saved to your history!");
        }
      }
      
      toast.success("Your coloring page is ready!");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 bg-secondary p-8 rounded-xl">
      <PromptInput prompt={prompt} setPrompt={setPrompt} />
      <ModelSelect model={model} setModel={setModel} />
      <AgeGroupSelect ageGroup={ageGroup} setAgeGroup={setAgeGroup} />
      <ResolutionSelect
        resolution={resolution}
        setResolution={setResolution}
        options={RESOLUTIONS}
      />
      
      {session && (
        <div className="flex items-center space-x-2">
          <Switch 
            id="make-public" 
            checked={makePublic}
            onCheckedChange={setMakePublic}
          />
          <Label htmlFor="make-public" className="text-sm">
            Share in public gallery
          </Label>
        </div>
      )}
      
      <Button
        onClick={handleGenerate}
        disabled={isGenerating || (!freeGenerationAvailable && !isPaidUser) || (isPaidUser && remainingMonthly !== null && remainingMonthly <= 0)}
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
          </Button> to get 5 free generations per day instead of 3
        </p>
      )}
    </div>
  );
};
