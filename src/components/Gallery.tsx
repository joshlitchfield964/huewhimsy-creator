
import { useState, useEffect } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { coloringPageService, type ColoringPage } from "@/services/coloringPageService";
import { ColoringPageCard } from "./ColoringPageCard";

type SortOption = "likes" | "newest";

export const Gallery = () => {
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [pages, setPages] = useState<ColoringPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchColoringPages();
  }, []);

  const fetchColoringPages = async () => {
    setIsLoading(true);
    try {
      const coloringPages = await coloringPageService.getPublicColoringPages();
      setPages(coloringPages);
      sortPages(coloringPages, sortBy);
    } catch (error) {
      console.error("Error fetching coloring pages:", error);
      toast.error("Failed to load coloring pages");
    } finally {
      setIsLoading(false);
    }
  };

  const sortPages = (pagesToSort: ColoringPage[], option: SortOption) => {
    const sortedPages = [...pagesToSort].sort((a, b) => {
      if (option === "likes") {
        return b.likes - a.likes;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    setPages(sortedPages);
  };

  const handleSort = (option: SortOption) => {
    setSortBy(option);
    sortPages(pages, option);
  };

  const handleLike = async (id: string) => {
    try {
      const success = await coloringPageService.likeColoringPage(id);
      if (success) {
        setPages(
          pages.map((page) =>
            page.id === id ? { ...page, likes: page.likes + 1 } : page
          )
        );
        toast.success("Added to favorites!");
      }
    } catch (error) {
      console.error("Error liking coloring page:", error);
      toast.error("Failed to like coloring page");
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <span className="ml-2 text-lg text-gray-600">Loading gallery...</span>
        </div>
      );
    }

    if (pages.length === 0) {
      return (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No coloring pages found in the gallery yet.</p>
          <p className="text-gray-400">Be the first to create and share one!</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pages.map((page) => (
          <ColoringPageCard 
            key={page.id}
            page={page}
            onLike={handleLike}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="font-sans text-4xl font-bold">
              Community{" "}
              <span className="text-purple-500">Gallery</span>
            </h2>
            <p className="text-gray-600">
              Discover and download coloring pages created by our community
            </p>
          </div>

          <div className="flex justify-end mb-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Sort by: {sortBy === "likes" ? "Most Liked" : "Newest"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleSort("newest")}>
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("likes")}>
                  Most Liked
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};
