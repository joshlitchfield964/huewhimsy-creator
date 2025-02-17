
import { useState } from "react";
import {
  Download,
  Heart,
  Printer,
  FileDown,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type SortOption = "likes" | "newest";

interface ColoringPage {
  id: string;
  imageUrl: string;
  likes: number;
  prompt: string;
  createdAt: string;
}

const dummyPages: ColoringPage[] = [
  {
    id: "1",
    imageUrl: "/placeholder.svg",
    likes: 42,
    prompt: "A magical forest with unicorns",
    createdAt: "2024-03-10",
  },
  {
    id: "2",
    imageUrl: "/placeholder.svg",
    likes: 35,
    prompt: "Space cats exploring planets",
    createdAt: "2024-03-11",
  },
  // Add more dummy data as needed
];

export const Gallery = () => {
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [pages, setPages] = useState(dummyPages);

  const handleSort = (option: SortOption) => {
    setSortBy(option);
    const sortedPages = [...pages].sort((a, b) => {
      if (option === "likes") {
        return b.likes - a.likes;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    setPages(sortedPages);
  };

  const handleLike = (id: string) => {
    setPages(
      pages.map((page) =>
        page.id === id ? { ...page, likes: page.likes + 1 } : page
      )
    );
    toast.success("Added to favorites!");
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
                    onClick={() => {
                      // TODO: Implement PDF conversion
                      toast.success("Downloaded as PDF!");
                    }}
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
                  <div className="flex items-center gap-2 mt-2">
                    <Heart className="h-4 w-4 text-pink-500" />
                    <span className="text-sm">{page.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
