
import { useState, useEffect } from "react";
import {
  Download,
  Trash2,
  Printer,
  FileDown,
  Eye,
  EyeOff,
  Loader2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { coloringPageService, type ColoringPage } from "@/services/coloringPageService";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
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

  const handlePdfDownload = async (page: ColoringPage) => {
    try {
      // Create a temporary image element to get dimensions
      const img = new Image();
      img.src = page.imageUrl;
      await new Promise((resolve) => (img.onload = resolve));

      // Calculate PDF dimensions to match image aspect ratio
      const imgAspectRatio = img.width / img.height;
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = pdfWidth / imgAspectRatio;

      // Create PDF with calculated dimensions
      const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? "portrait" : "landscape",
        unit: "mm",
      });

      // Add image to PDF, centered and scaled to fit the page
      pdf.addImage(
        page.imageUrl,
        "PNG",
        0,
        0,
        pdfWidth,
        pdfHeight
      );

      // Add prompt text at the bottom
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`"${page.prompt}"`, 10, pdfHeight - 5);

      // Download the PDF
      pdf.save(`coloring-page-${page.id}.pdf`);
      toast.success("Downloaded as PDF!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    }
  };

  const handlePrint = (imageUrl: string) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Coloring Page</title>
          </head>
          <body style="margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh;">
            <img src="${imageUrl}" style="max-width: 100%; max-height: 100vh;" />
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Your Coloring Pages</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <span className="ml-2 text-lg text-gray-600">Loading your coloring pages...</span>
            </div>
          ) : pages.length === 0 ? (
            <div className="text-center py-20 bg-secondary rounded-xl">
              <p className="text-gray-500 text-lg">You haven't created any coloring pages yet.</p>
              <p className="text-gray-400 mb-4">Head over to the generator to create your first masterpiece!</p>
              <Button onClick={() => window.location.href = "/#generator"}>
                Create Your First Coloring Page
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="group relative bg-secondary rounded-xl overflow-hidden"
                >
                  <img
                    src={page.imageUrl}
                    alt={page.prompt}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = page.imageUrl;
                        link.download = `coloring-page-${page.id}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        toast.success("Downloaded as PNG!");
                      }}
                      className="h-10 w-10"
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => handlePdfDownload(page)}
                      className="h-10 w-10"
                    >
                      <FileDown className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => handlePrint(page.imageUrl)}
                      className="h-10 w-10"
                    >
                      <Printer className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setPageToDelete(page);
                        setDeleteDialogOpen(true);
                      }}
                      className="h-10 w-10"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 truncate">{page.prompt}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-400">{formatDate(page.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <button 
                          onClick={() => handleToggleVisibility(page)}
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
