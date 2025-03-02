
import { 
  Download, 
  Heart, 
  Printer, 
  FileDown, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ColoringPage } from "@/services/coloringPageService";
import { downloadAsPng, downloadAsPdf, printImage } from "@/utils/downloadUtils";

interface ColoringPageCardProps {
  page: ColoringPage;
  isUserPage?: boolean;
  onLike?: (id: string) => void;
  onDeleteClick?: (page: ColoringPage) => void;
  onToggleVisibility?: (page: ColoringPage) => void;
}

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

  return (
    <div key={page.id} className="group relative bg-secondary rounded-xl overflow-hidden">
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
