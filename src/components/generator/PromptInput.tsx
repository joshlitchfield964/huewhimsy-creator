
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Copy } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { ColoringPageCategory } from "@/components/ColoringPageCard";

const randomPrompts = [
  "A magical forest with unicorns playing among rainbow waterfalls",
  "A cozy treehouse filled with fairy lights and reading nooks",
  "An underwater city with mermaids and friendly sea creatures",
  "A space adventure with astronaut cats exploring new planets",
  "A whimsical garden party with dancing flowers and butterflies",
  "A dragon's treasure cave filled with sparkling gems and gold",
];

// Prompts by category
const categoryPrompts: Record<ColoringPageCategory, string[]> = {
  "Animal": [
    "A playful fox in a forest",
    "Cute pandas eating bamboo",
    "A majestic lion with a detailed mane",
    "Elephants playing in a watering hole",
    "Wolves howling at the moon",
  ],
  "Bird": [
    "Colorful parrots in a tropical forest",
    "An owl perched on a tree branch at night",
    "Hummingbirds drinking from flower nectar",
    "Peacocks with ornate tail feathers",
    "Eagles soaring over mountains",
  ],
  "Mandala": [
    "Intricate floral mandala with symmetrical patterns",
    "Geometric mandala with repeating shapes",
    "Nature-inspired mandala with leaves and flowers",
    "Cosmic mandala with stars and celestial bodies",
    "Ocean-themed mandala with waves and shells",
  ],
  "Christmas": [
    "Santa's workshop with busy elves",
    "Reindeer pulling a sleigh in the snow",
    "A cozy Christmas living room with a decorated tree",
    "Snowmen and children playing in the snow",
    "Christmas ornaments and holiday decorations",
  ],
  "Halloween": [
    "Haunted house with ghosts and bats",
    "Cute pumpkins with carved faces",
    "Friendly witches brewing potions",
    "Halloween party with monsters dancing",
    "Spooky forest with twisted trees",
  ],
  "Superhero": [
    "A superhero flying through the city",
    "Team of superheroes with different powers",
    "Superhero headquarters with gadgets",
    "Superhero saving civilians from danger",
    "Origin story of a new superhero",
  ],
  "Fantasy": [
    "Dragons protecting their treasure",
    "Unicorns in an enchanted forest",
    "Fairies living in mushroom houses",
    "Magical castle floating in the clouds",
    "Wizards practicing spells in a tower",
  ],
  "Space": [
    "Astronauts exploring a new planet",
    "Space station orbiting Earth",
    "Alien civilization with unusual architecture",
    "Rocket launching into space",
    "Planets and stars in our solar system",
  ],
  "Ocean": [
    "Underwater coral reef with colorful fish",
    "Mermaid kingdom beneath the waves",
    "Dolphins playing in the open ocean",
    "Pirate treasure at the bottom of the sea",
    "Whale family swimming together",
  ],
  "Nature": [
    "Flower garden with butterflies and bees",
    "Rainforest with exotic plants and animals",
    "Mountain landscape with waterfalls",
    "Changing seasons in a forest scene",
    "Desert oasis with palm trees",
  ],
  "Other": randomPrompts,
};

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

export const PromptInput = ({ prompt, setPrompt }: PromptInputProps) => {
  const [selectedCategory, setSelectedCategory] = useState<ColoringPageCategory | null>(null);

  const getRandomPrompt = () => {
    let promptsToChooseFrom = randomPrompts;
    
    if (selectedCategory) {
      promptsToChooseFrom = categoryPrompts[selectedCategory];
    }
    
    const randomPrompt = promptsToChooseFrom[Math.floor(Math.random() * promptsToChooseFrom.length)];
    setPrompt(randomPrompt);
    toast.success("Random prompt inserted!", {
      description: randomPrompt,
    });
  };

  const handleCategorySelect = (category: ColoringPageCategory) => {
    setSelectedCategory(category);
    const promptsForCategory = categoryPrompts[category];
    const randomPrompt = promptsForCategory[Math.floor(Math.random() * promptsForCategory.length)];
    setPrompt(randomPrompt);
    toast.success(`${category} prompt inserted!`, {
      description: randomPrompt,
    });
  };

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setPrompt(clipboardText);
        toast.success("Prompt pasted from clipboard!");
      }
    } catch (error) {
      console.error("Failed to read clipboard:", error);
      toast.error("Could not access clipboard");
    }
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
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="group text-sm gap-2 w-full border"
          onClick={getRandomPrompt}
        >
          <Sparkles className="w-4 h-4 text-yellow-500" />
          Random Prompt
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="group text-sm gap-2 w-full border"
          onClick={handlePasteFromClipboard}
        >
          <Copy className="w-4 h-4 text-blue-500" />
          Paste from Clipboard
        </Button>
      </div>
      
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Select a category for prompts:
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(categoryPrompts).map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              className={selectedCategory === category ? "bg-primary text-white" : ""}
              onClick={() => handleCategorySelect(category as ColoringPageCategory)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
