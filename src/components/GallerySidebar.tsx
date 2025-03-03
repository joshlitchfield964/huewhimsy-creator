
import { useState } from "react";
import { Filter, Sparkles, Star, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { type ColoringPageCategory } from "./ColoringPageCard";

interface GallerySidebarProps {
  categories: ColoringPageCategory[];
  selectedCategories: ColoringPageCategory[];
  onCategoryChange: (categories: ColoringPageCategory[]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const GallerySidebar = ({
  categories,
  selectedCategories,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  isCollapsed,
  onToggleCollapse,
}: GallerySidebarProps) => {
  const toggleCategory = (category: ColoringPageCategory) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const clearFilters = () => {
    onCategoryChange([]);
    onSearchChange("");
  };

  const selectAllCategories = () => {
    onCategoryChange([...categories]);
  };

  return (
    <div 
      className={`bg-gradient-to-bl from-purple-50 to-white border-r border-purple-100 h-full transition-all duration-300 ease-in-out overflow-hidden ${
        isCollapsed ? "w-12" : "w-64"
      }`}
    >
      <div className="p-4 flex justify-between items-center border-b border-purple-100">
        {!isCollapsed && (
          <h3 className="font-medium text-purple-800 flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filters
          </h3>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleCollapse}
          className="text-purple-700 hover:text-purple-900 hover:bg-purple-100"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-6 overflow-auto h-[calc(100%-60px)]">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-800">Search</label>
            <Input
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="border-purple-200 focus-visible:ring-purple-500"
            />
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-purple-800">Categories</label>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={selectAllCategories}
                  className="text-xs h-7 px-2 text-purple-700 hover:text-purple-900 hover:bg-purple-100"
                >
                  All
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-xs h-7 px-2 text-purple-700 hover:text-purple-900 hover:bg-purple-100"
                >
                  Clear
                </Button>
              </div>
            </div>
            
            <Card className="p-3 bg-white/70 backdrop-blur-sm border-purple-100">
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                      className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Inspirational Quote */}
          <Card className="p-4 bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200">
            <div className="flex gap-2 items-start">
              <Sparkles className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs italic text-purple-800">
                  "Creativity takes courage. Let your imagination run wild with our coloring pages!"
                </p>
                <div className="flex items-center mt-2">
                  <Star className="h-3 w-3 text-yellow-500" fill="#EAB308" />
                  <Star className="h-3 w-3 text-yellow-500" fill="#EAB308" />
                  <Star className="h-3 w-3 text-yellow-500" fill="#EAB308" />
                  <Star className="h-3 w-3 text-yellow-500" fill="#EAB308" />
                  <Star className="h-3 w-3 text-yellow-500" fill="#EAB308" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
