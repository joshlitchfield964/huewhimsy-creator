
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";

interface PreviewProps {
  generatedImage: string;
}

export const Preview = ({ generatedImage }: PreviewProps) => {
  const handlePdfDownload = async () => {
    if (!generatedImage) return;

    try {
      // Create a temporary image element to get dimensions
      const img = new Image();
      img.src = generatedImage;
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
        generatedImage,
        "PNG",
        0,
        0,
        pdfWidth,
        pdfHeight
      );

      // Download the PDF
      pdf.save("coloring-page.pdf");
      toast.success("Downloaded as PDF!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="space-y-6">
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
          onClick={() => {
            if (!generatedImage) return;
            const link = document.createElement("a");
            link.href = generatedImage;
            link.download = "coloring-page.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Downloaded as PNG!");
          }}
          disabled={!generatedImage}
          variant="outline"
          className="flex-1"
        >
          <Download className="mr-2 h-4 w-4" />
          PNG
        </Button>
        <Button
          onClick={handlePdfDownload}
          disabled={!generatedImage}
          variant="outline"
          className="flex-1"
        >
          <Download className="mr-2 h-4 w-4" />
          PDF
        </Button>
        <Button
          onClick={() => {
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
          }}
          disabled={!generatedImage}
          variant="outline"
          className="flex-1"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
      </div>
    </div>
  );
};
