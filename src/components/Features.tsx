
import { Palette, Wand2, Download } from "lucide-react";

const features = [
  {
    icon: <Wand2 className="w-12 h-12 text-purple-500" />,
    title: "AI-Powered Creation",
    description:
      "Transform your text descriptions into beautiful line art using advanced AI technology. Any idea you can describe can become a coloring page.",
  },
  {
    icon: <Palette className="w-12 h-12 text-pink-500" />,
    title: "Multiple Formats",
    description:
      "Choose from different page sizes and orientations. Perfect for both kids and adults, suitable for any coloring medium.",
  },
  {
    icon: <Download className="w-12 h-12 text-blue-500" />,
    title: "Easy Export",
    description:
      "Download your coloring pages instantly in PNG or PDF format, or print directly from your browser. Share and enjoy your creations.",
  },
];

export const Features = () => {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12 animate-fade-up">
          <div className="text-center space-y-4">
            <h2 className="font-display text-4xl font-bold">
              Powerful <span className="text-purple-500">Features</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to create beautiful coloring pages from your imagination
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-secondary rounded-xl text-center space-y-4 hover:scale-105 transition-transform"
              >
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
