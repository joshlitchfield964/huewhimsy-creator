
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { userGenerationService } from "@/services/userGenerationService";
import type { AgeGroup } from "@/services/runware";
import { ModelSelect, MODELS } from "@/components/generator/ModelSelect";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";

interface GenerationState {
  prompt: string;
  setPrompt: (prompt: string) => void;
  resolution: { width: number; height: number };
  setResolution: (resolution: { width: number; height: number }) => void;
  ageGroup: AgeGroup;
  setAgeGroup: (ageGroup: AgeGroup) => void;
  model: typeof MODELS[number]["value"];
  setModel: (model: typeof MODELS[number]["value"]) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  generatedImage: string;
  setGeneratedImage: (image: string) => void;
  freeGenerationAvailable: boolean | null;
  setFreeGenerationAvailable: (available: boolean | null) => void;
  remainingToday: number | null;
  setRemainingToday: (remaining: number | null) => void;
  isPaidUser: boolean;
  setIsPaidUser: (isPaid: boolean) => void;
  remainingMonthly: number | null;
  setRemainingMonthly: (remaining: number | null) => void;
  makePublic: boolean;
  setMakePublic: (makePublic: boolean) => void;
  session: any;
  navigate: ReturnType<typeof useNavigate>;
  checkAvailability: () => Promise<void>;
}

const GeneratorContext = createContext<GenerationState | undefined>(undefined);

export function useGeneratorContext() {
  const context = useContext(GeneratorContext);
  if (context === undefined) {
    throw new Error("useGeneratorContext must be used within a GeneratorProvider");
  }
  return context;
}

export function GeneratorProvider({ children }: { children: ReactNode }) {
  const [prompt, setPrompt] = useState("");
  const [resolution, setResolution] = useState({ width: 1024, height: 1024 });
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("school");
  const [model, setModel] = useState<typeof MODELS[number]["value"]>(MODELS[0].value);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [freeGenerationAvailable, setFreeGenerationAvailable] = useState<boolean | null>(null);
  const [remainingToday, setRemainingToday] = useState<number | null>(null);
  const [isPaidUser, setIsPaidUser] = useState<boolean>(false);
  const [remainingMonthly, setRemainingMonthly] = useState<number | null>(null);
  const [makePublic, setMakePublic] = useState(true);
  const { session } = useAuth();
  const navigate = useNavigate();

  const checkAvailability = async () => {
    try {
      const stats = await userGenerationService.getUserGenerationStats();
      if (stats) {
        setFreeGenerationAvailable(stats.freeGenerationAvailable);
        setRemainingToday(stats.remainingToday);
        setIsPaidUser(stats.isPaidUser);
        setRemainingMonthly(stats.remainingMonthly);
      }
    } catch (error) {
      console.error("Error checking generation availability:", error);
    }
  };

  useEffect(() => {
    checkAvailability();
  }, [session]);

  const value = {
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
    generatedImage,
    setGeneratedImage,
    freeGenerationAvailable,
    setFreeGenerationAvailable,
    remainingToday,
    setRemainingToday,
    isPaidUser,
    setIsPaidUser,
    remainingMonthly,
    setRemainingMonthly,
    makePublic,
    setMakePublic,
    session,
    navigate,
    checkAvailability,
  };

  return (
    <GeneratorContext.Provider value={value}>
      {children}
    </GeneratorContext.Provider>
  );
}
