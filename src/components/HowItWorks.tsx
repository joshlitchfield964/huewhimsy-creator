
import { FileText, Palette, Share } from "lucide-react";

const steps = [
  {
    icon: <FileText className="w-10 h-10 text-purple-500" />,
    title: "Describe Your Vision",
    description:
      "Start by describing what you want in your coloring page. Be as detailed as you like!",
  },
  {
    icon: <Palette className="w-10 h-10 text-pink-500" />,
    title: "AI Creates Your Page",
    description:
      "Our AI technology transforms your description into a beautiful line art drawing.",
  },
  {
    icon: <Share className="w-10 h-10 text-blue-500" />,
    title: "Download & Share",
    description:
      "Download your creation in your preferred format or print it directly.",
  },
];

export const HowItWorks = () => {
  return (
    <div id="how-it-works" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12 animate-fade-up">
          <div className="text-center space-y-4">
            <h2 className="font-sans text-4xl font-bold">
              How It <span className="text-pink-500">Works</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Creating your perfect coloring page is easy as 1-2-3
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="p-6 bg-white rounded-xl text-center space-y-4">
                  <div className="flex justify-center">{step.icon}</div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-4xl text-gray-300 font-display">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
