
import { useState, useEffect } from "react";
import { ChevronDown, Loader2, Filter, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { coloringPageService, type ColoringPage } from "@/services/coloringPageService";
import { ColoringPageCard, identifyCategory, type ColoringPageCategory } from "./ColoringPageCard";

type SortOption = "likes" | "newest";

export const Gallery = () => {
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [pages, setPages] = useState<ColoringPage[]>([]);
  const [filteredPages, setFilteredPages] = useState<ColoringPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<ColoringPageCategory | null>(null);
  const [categories, setCategories] = useState<ColoringPageCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchColoringPages();
  }, []);

  const fetchColoringPages = async () => {
    setIsLoading(true);
    try {
      const coloringPages = await coloringPageService.getPublicColoringPages();
      setPages(coloringPages);
      setFilteredPages(coloringPages);
      sortPages(coloringPages, sortBy);
      
      // Extract and count all categories from the pages
      const categoryMap = new Map<ColoringPageCategory, number>();
      coloringPages.forEach(page => {
        const category = identifyCategory(page.prompt);
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });
      
      // Convert map keys to array and sort by count
      const sortedCategories = Array.from(categoryMap.keys())
        .sort((a, b) => (categoryMap.get(b) || 0) - (categoryMap.get(a) || 0));
      
      setCategories(sortedCategories);
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
    
    // Apply filters to sorted pages
    applyFilters(sortedPages);
  };

  const applyFilters = (pagesToFilter: ColoringPage[]) => {
    let result = [...pagesToFilter];
    
    // Apply category filter
    if (categoryFilter) {
      result = result.filter(page => identifyCategory(page.prompt) === categoryFilter);
    }
    
    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(page => 
        page.prompt.toLowerCase().includes(query)
      );
    }
    
    setFilteredPages(result);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(pages);
  };

  const handleSort = (option: SortOption) => {
    setSortBy(option);
    sortPages(pages, option);
  };
  
  const handleCategoryFilter = (category: ColoringPageCategory | null) => {
    setCategoryFilter(category);
    const updatedPages = [...pages];
    applyFilters(updatedPages);
  };

  const handleLike = async (id: string) => {
    try {
      const success = await coloringPageService.likeColoringPage(id);
      if (success) {
        const updatedPages = pages.map((page) =>
          page.id === id ? { ...page, likes: page.likes + 1 } : page
        );
        setPages(updatedPages);
        applyFilters(updatedPages);
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

    if (filteredPages.length === 0) {
      return (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            {searchQuery
              ? `No coloring pages found matching "${searchQuery}"`
              : categoryFilter 
                ? `No coloring pages found in the "${categoryFilter}" category` 
                : "No coloring pages found in the gallery yet."}
          </p>
          <p className="text-gray-400">
            {categoryFilter || searchQuery
              ? "Try a different search or category filter" 
              : "Be the first to create and share one!"}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPages.map((page) => (
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

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for coloring pages..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 w-full"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Category: {categoryFilter || "All"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleCategoryFilter(null)}>
                    All Categories
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem 
                      key={category} 
                      onClick={() => handleCategoryFilter(category)}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
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
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};
