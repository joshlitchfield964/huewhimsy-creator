
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

const randomPrompts = [
  "A magical forest with unicorns playing among rainbow waterfalls",
  "A cozy treehouse filled with fairy lights and reading nooks",
  "An underwater city with mermaids and friendly sea creatures",
  "A space adventure with astronaut cats exploring new planets",
  "A whimsical garden party with dancing flowers and butterflies",
  "A dragon's treasure cave filled with sparkling gems and gold",
];

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

export const PromptInput = ({ prompt, setPrompt }: PromptInputProps) => {
  const getRandomPrompt = () => {
    const prompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    setPrompt(prompt);
    toast.success("Random prompt inserted!", {
      description: prompt,
    });
  };

  return (
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
      <Button
        variant="ghost"
        size="sm"
        className="group text-sm gap-2 w-full border"
        onClick={getRandomPrompt}
      >
        <Sparkles className="w-4 h-4 text-yellow-500" />
        Get Random Prompt
      </Button>
    </div>
  );
};
