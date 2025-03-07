
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const MODELS = [
  { label: "Stable Diffusion 3", value: "runware:100@1" },
  { label: "Juggernaut Pro", value: "rundiffusion:130@100" },
  { label: "FLUX.1 [dev]", value: "runware:flux-dev@1" }
] as const;

type ModelValue = typeof MODELS[number]["value"];

interface ModelSelectProps {
  model: ModelValue;
  setModel: (value: ModelValue) => void;
}

export const ModelSelect = ({ model, setModel }: ModelSelectProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Choose AI Model
      </label>
      <Select
        value={model}
        onValueChange={(value: ModelValue) => setModel(value)}
      >
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Select model" />
        </SelectTrigger>
        <SelectContent>
          {MODELS.map((model) => (
            <SelectItem
              key={model.value}
              value={model.value}
            >
              {model.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
