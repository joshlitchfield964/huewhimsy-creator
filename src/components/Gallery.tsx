
import { useState, useEffect } from "react";
import {
  Download,
  Heart,
  Printer,
  FileDown,
  ChevronDown,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { coloringPageService, type ColoringPage } from "@/services/coloringPageService";
import { jsPDF } from "jspdf";
import { format } from "date-fns";

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

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <span className="ml-2 text-lg text-gray-600">Loading gallery...</span>
            </div>
          ) : pages.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No coloring pages found in the gallery yet.</p>
              <p className="text-gray-400">Be the first to create and share one!</p>
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
                      onClick={() => handleLike(page.id)}
                      className="h-10 w-10"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
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
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 truncate">{page.prompt}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-pink-500" />
                        <span className="text-sm">{page.likes}</span>
                      </div>
                      <span className="text-xs text-gray-400">{formatDate(page.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
