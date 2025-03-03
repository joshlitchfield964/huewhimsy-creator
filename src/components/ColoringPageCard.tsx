
import { 
  Download, 
  Heart, 
  Printer, 
  FileDown, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ColoringPage } from "@/services/coloringPageService";
import { downloadAsPng, downloadAsPdf, printImage } from "@/utils/downloadUtils";
import { toast } from "sonner";

// Type definition for the categories we'll identify
export type ColoringPageCategory = 
  | "Animal" 
  | "Bird" 
  | "Mandala" 
  | "Christmas" 
  | "Halloween" 
  | "Superhero" 
  | "Fantasy" 
  | "Space" 
  | "Ocean" 
  | "Nature"
  | "Other";

interface ColoringPageCardProps {
  page: ColoringPage;
  isUserPage?: boolean;
  onLike?: (id: string) => void;
  onDeleteClick?: (page: ColoringPage) => void;
  onToggleVisibility?: (page: ColoringPage) => void;
}

// Function to identify the category of a coloring page based on its prompt
export const identifyCategory = (prompt: string): ColoringPageCategory => {
  const lowercasePrompt = prompt.toLowerCase();
  
  // Category identification logic
  if (/cat|dog|lion|tiger|elephant|bear|wolf|fox|rabbit|bunny|animal|pet|zoo/.test(lowercasePrompt)) {
    return "Animal";
  }
  if (/bird|eagle|parrot|owl|flamingo|peacock|feather|flying|wings/.test(lowercasePrompt)) {
    return "Bird";
  }
  if (/mandala|pattern|geometric|symmetrical|kaleidoscope|circular/.test(lowercasePrompt)) {
    return "Mandala";
  }
  if (/christmas|santa|reindeer|snow|winter|gift|present|holiday|december|xmas/.test(lowercasePrompt)) {
    return "Christmas";
  }
  if (/halloween|spooky|ghost|witch|pumpkin|skeleton|bat|haunted|scary/.test(lowercasePrompt)) {
    return "Halloween";
  }
  if (/superhero|hero|cape|super|power|marvel|dc|avenger|batman|superman|spiderman/.test(lowercasePrompt)) {
    return "Superhero";
  }
  if (/dragon|unicorn|fairy|magic|wizard|spell|enchanted|fantasy|magical/.test(lowercasePrompt)) {
    return "Fantasy";
  }
  if (/space|planet|star|galaxy|astronaut|rocket|alien|cosmos|universe/.test(lowercasePrompt)) {
    return "Space";
  }
  if (/ocean|sea|fish|mermaid|underwater|beach|wave|coral|reef|dolphin|whale/.test(lowercasePrompt)) {
    return "Ocean";
  }
  if (/flower|tree|plant|garden|forest|park|nature|landscape|mountain/.test(lowercasePrompt)) {
    return "Nature";
  }
  
  return "Other";
};

export const ColoringPageCard = ({
  page,
  isUserPage = false,
  onLike,
  onDeleteClick,
  onToggleVisibility
}: ColoringPageCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Function to handle copying the prompt to clipboard
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(page.prompt)
      .then(() => {
        toast.success("Prompt copied to clipboard!");
      })
      .catch((error) => {
        console.error("Error copying prompt:", error);
        toast.error("Failed to copy prompt");
      });
  };

  // Identify the category of the coloring page
  const category = identifyCategory(page.prompt);

  return (
    <div key={page.id} className="group relative bg-secondary rounded-xl overflow-hidden">
      <div className="absolute top-2 left-2 z-10">
        <span className="px-2 py-1 text-xs font-medium bg-black/60 text-white rounded-full">
          {category}
        </span>
      </div>
      <img
        src={page.imageUrl}
        alt={page.prompt}
        className="w-full aspect-square object-cover"
      />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
        {!isUserPage && onLike && (
          <Button
            variant="secondary"
            size="icon"
            onClick={() => onLike(page.id)}
            className="h-10 w-10"
          >
            <Heart className="h-5 w-5" />
          </Button>
        )}
        <Button
          variant="secondary"
          size="icon"
          onClick={() => downloadAsPng(page.imageUrl, page.id)}
          className="h-10 w-10"
        >
          <Download className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => downloadAsPdf(page)}
          className="h-10 w-10"
        >
          <FileDown className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => printImage(page.imageUrl)}
          className="h-10 w-10"
        >
          <Printer className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleCopyPrompt}
          className="h-10 w-10"
          title="Copy prompt"
        >
          <Copy className="h-5 w-5" />
        </Button>
        {isUserPage && onDeleteClick && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDeleteClick(page)}
            className="h-10 w-10"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        )}
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 truncate">{page.prompt}</p>
        <div className="flex items-center justify-between mt-2">
          {!isUserPage ? (
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500" />
              <span className="text-sm">{page.likes}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-400">{formatDate(page.createdAt)}</span>
            </div>
          )}
          {isUserPage && onToggleVisibility ? (
            <div className="flex items-center">
              <button 
                onClick={() => onToggleVisibility(page)}
                className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700"
              >
                {page.isPublic ? (
                  <>
                    <Eye className="h-3 w-3" /> Public
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3 w-3" /> Private
                  </>
                )}
              </button>
            </div>
          ) : (
            <span className="text-xs text-gray-400">{formatDate(page.createdAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
};
