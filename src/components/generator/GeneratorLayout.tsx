
import { GeneratorForm } from "./GeneratorForm";
import { Preview } from "./Preview";
import { GenerationInfo } from "./GenerationInfo";
import { useGeneratorContext } from "./GeneratorContext";

export const GeneratorLayout = () => {
  const { generatedImage } = useGeneratorContext();

  return (
    <div className="py-20 bg-white" id="generator">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-up">
          <div className="text-center space-y-4">
            <h2 className="font-sans text-4xl font-bold">
              Create Your{" "}
              <span className="text-purple-500">Magical</span>{" "}
              <span className="text-pink-500">Coloring</span>{" "}
              <span className="text-blue-500">Page</span>
            </h2>
            <p className="text-gray-600">
              Describe what you'd like to color, choose your preferred size, and let our{" "}
              <span className="text-orange-500 font-semibold">AI magic</span> do the work.
            </p>
            <GenerationInfo />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GeneratorForm />
            <div className="bg-secondary p-8 rounded-xl">
              <Preview generatedImage={generatedImage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
