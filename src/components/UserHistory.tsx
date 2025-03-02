
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { coloringPageService, type ColoringPage } from "@/services/coloringPageService";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ColoringPageCard } from "./ColoringPageCard";

export const UserHistory = () => {
  const [pages, setPages] = useState<ColoringPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<ColoringPage | null>(null);

  useEffect(() => {
    fetchUserColoringPages();
  }, []);

  const fetchUserColoringPages = async () => {
    setIsLoading(true);
    try {
      const userPages = await coloringPageService.getUserColoringPages();
      setPages(userPages);
    } catch (error) {
      console.error("Error fetching user coloring pages:", error);
      toast.error("Failed to load your coloring pages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePage = async () => {
    if (!pageToDelete) return;

    try {
      const success = await coloringPageService.deleteColoringPage(pageToDelete.id);
      if (success) {
        setPages(pages.filter(page => page.id !== pageToDelete.id));
        toast.success("Coloring page deleted successfully");
        setDeleteDialogOpen(false);
        setPageToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting coloring page:", error);
      toast.error("Failed to delete coloring page");
    }
  };

  const handleToggleVisibility = async (page: ColoringPage) => {
    try {
      const { data, error } = await supabase
        .from("coloring_pages")
        .update({ is_public: !page.isPublic })
        .eq("id", page.id)
        .select()
        .single();

      if (error) throw error;

      setPages(pages.map(p => 
        p.id === page.id 
          ? { ...p, isPublic: !p.isPublic } 
          : p
      ));

      toast.success(
        page.isPublic 
          ? "Coloring page is now private" 
          : "Coloring page is now public"
      );
    } catch (error) {
      console.error("Error updating visibility:", error);
      toast.error("Failed to update coloring page visibility");
    }
  };

  const handleDeleteButtonClick = (page: ColoringPage) => {
    setPageToDelete(page);
    setDeleteDialogOpen(true);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <span className="ml-2 text-lg text-gray-600">Loading your coloring pages...</span>
        </div>
      );
    }

    if (pages.length === 0) {
      return (
        <div className="text-center py-20 bg-secondary rounded-xl">
          <p className="text-gray-500 text-lg">You haven't created any coloring pages yet.</p>
          <p className="text-gray-400 mb-4">Head over to the generator to create your first masterpiece!</p>
          <Button onClick={() => window.location.href = "/#generator"}>
            Create Your First Coloring Page
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pages.map((page) => (
          <ColoringPageCard 
            key={page.id}
            page={page}
            isUserPage={true}
            onDeleteClick={handleDeleteButtonClick}
            onToggleVisibility={handleToggleVisibility}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Your Coloring Pages</h2>
          </div>

          {renderContent()}
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this coloring page. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePage} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
