
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
import { ColoringPageCard, identifyCategory, type ColoringPageCategory } from "./ColoringPageCard";
import { GallerySidebar } from "./GallerySidebar";

type SortOption = "likes" | "newest";

export const Gallery = () => {
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [pages, setPages] = useState<ColoringPage[]>([]);
  const [filteredPages, setFilteredPages] = useState<ColoringPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<ColoringPageCategory[]>([]);
  const [categories, setCategories] = useState<ColoringPageCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    fetchColoringPages();
    
    const handleResize = () => {
      setShowSidebar(window.innerWidth >= 768);
    };
    
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Apply filters whenever selectedCategories or searchQuery changes
    applyFilters(pages);
  }, [selectedCategories, searchQuery]);

  const fetchColoringPages = async () => {
    setIsLoading(true);
    try {
      const coloringPages = await coloringPageService.getPublicColoringPages();
      setPages(coloringPages);
      setFilteredPages(coloringPages);
      sortPages(coloringPages, sortBy);
      
      const categoryMap = new Map<ColoringPageCategory, number>();
      coloringPages.forEach(page => {
        const category = identifyCategory(page.prompt);
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });
      
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
    
    applyFilters(sortedPages);
  };

  const applyFilters = (pagesToFilter: ColoringPage[]) => {
    let result = [...pagesToFilter];
    
    // Only filter by categories if there are selected categories
    if (selectedCategories.length > 0) {
      result = result.filter(page => 
        selectedCategories.includes(identifyCategory(page.prompt))
      );
    }
    
    // Only filter by search if there is a search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(page => 
        page.prompt.toLowerCase().includes(query)
      );
    }
    
    console.log("Filtered pages:", result.length, "Selected categories:", selectedCategories);
    setFilteredPages(result);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSort = (option: SortOption) => {
    setSortBy(option);
    sortPages(pages, option);
  };
  
  const handleCategoryFilters = (categories: ColoringPageCategory[]) => {
    console.log("Setting categories:", categories);
    setSelectedCategories(categories);
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
            {searchQuery || selectedCategories.length > 0
              ? `No coloring pages found with your current filters`
              : "No coloring pages found in the gallery yet."}
          </p>
          <p className="text-gray-400">
            {selectedCategories.length > 0 || searchQuery
              ? "Try different search terms or categories" 
              : "Be the first to create and share one!"}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-up">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="relative py-8 md:py-12">
        <div className="absolute top-10 left-10 w-24 h-24 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto space-y-4 mb-6 md:mb-12">
            <div className="text-center space-y-4">
              <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500">
                Community Gallery
              </h2>
              <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto px-4">
                Discover and download coloring pages created by our creative community.
                Find inspiration or share your own masterpieces.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row relative bg-white rounded-xl shadow-md overflow-hidden">
            <div className={`${showSidebar ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
              <GallerySidebar 
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryFilters}
                searchQuery={searchQuery}
                onSearchChange={handleSearch}
              />
            </div>
            
            <div className="flex-1">
              <div className="px-4 md:px-6 py-4">
                <div className="flex items-center justify-end mb-6">                  
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2 border-purple-200 text-purple-700 hover:bg-purple-50">
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
        </div>
      </div>
    </div>
  );
};
