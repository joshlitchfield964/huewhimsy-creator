
import { GeneratorProvider } from "./generator/GeneratorContext";
import { GeneratorLayout } from "./generator/GeneratorLayout";

export const Generator = () => {
  return (
    <GeneratorProvider>
      <GeneratorLayout />
    </GeneratorProvider>
  );
};
