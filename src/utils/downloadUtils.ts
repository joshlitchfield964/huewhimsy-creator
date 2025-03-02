
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { ColoringPage } from "@/services/coloringPageService";

export const downloadAsPng = (imageUrl: string, id: string) => {
  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = `coloring-page-${id}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success("Downloaded as PNG!");
};

export const downloadAsPdf = async (page: ColoringPage) => {
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

export const printImage = (imageUrl: string) => {
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
