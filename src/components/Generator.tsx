
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Download, Printer, Wand2 } from "lucide-react";
import { toast } from "sonner";

const RESOLUTIONS = [
  { label: "Square (1024x1024)", value: "1024x1024" },
  { label: "Portrait (1024x1536)", value: "1024x1536" },
  { label: "Landscape (1536x1024)", value: "1536x1024" },
];

export const Generator = () => {
  const [prompt, setPrompt] = useState("");
  const [resolution, setResolution] = useState("1024x1024");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description first");
      return;
    }

    setIsGenerating(true);
    // TODO: Implement actual API call
    toast.info("Generation started...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Temporary placeholder image for demonstration
    setGeneratedImage("/placeholder.svg");
    setIsGenerating(false);
    toast.success("Your coloring page is ready!");
  };

  const handleDownloadPNG = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = "coloring-page.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Downloaded as PNG!");
  };

  const handleDownloadPDF = () => {
    if (!generatedImage) return;
    // TODO: Implement PDF conversion
    toast.success("Downloaded as PDF!");
  };

  const handlePrint = () => {
    if (!generatedImage) return;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Coloring Page</title>
          </head>
          <body style="margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh;">
            <img src="${generatedImage}" style="max-width: 100%; max-height: 100vh;" />
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
    toast.success("Preparing print preview!");
  };

  return (
    <div id="generator" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-up">
          <div className="text-center space-y-4">
            <h2 className="font-display text-4xl font-bold">
              Create Your{" "}
              <span className="text-purple-500">Magical</span>{" "}
              <span className="text-pink-500">Coloring</span>{" "}
              <span className="text-blue-500">Page</span>
            </h2>
            <p className="text-gray-600">
              Describe what you'd like to color, choose your preferred size, and let our{" "}
              <span className="text-orange-500 font-semibold">AI magic</span> do the work.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6 bg-secondary p-8 rounded-xl">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Describe your perfect coloring page
                </label>
                <Textarea
                  placeholder="E.g., A magical forest with unicorns and fairies..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Choose page size
                </label>
                <Select value={resolution} onValueChange={setResolution}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOLUTIONS.map((res) => (
                      <SelectItem key={res.value} value={res.value}>
                        {res.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                {isGenerating ? (
                  "Generating..."
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    Generate Coloring Page
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-6 bg-secondary p-8 rounded-xl">
              <div className="aspect-square relative bg-white rounded-lg overflow-hidden border-2 border-dashed border-gray-200">
                {generatedImage ? (
                  <img
                    src={generatedImage}
                    alt="Generated coloring page"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Your coloring page will appear here
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleDownloadPNG}
                  disabled={!generatedImage}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  PNG
                </Button>
                <Button
                  onClick={handleDownloadPDF}
                  disabled={!generatedImage}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button
                  onClick={handlePrint}
                  disabled={!generatedImage}
                  variant="outline"
                  className="flex-1"
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
