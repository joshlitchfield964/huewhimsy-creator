
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Resolution {
  width: number;
  height: number;
}

interface ResolutionOption {
  label: string;
  value: Resolution;
}

interface ResolutionSelectProps {
  resolution: Resolution;
  setResolution: (resolution: Resolution) => void;
  options: ResolutionOption[];
}

export const ResolutionSelect = ({
  resolution,
  setResolution,
  options
}: ResolutionSelectProps) => {
  const getCurrentValue = () => {
    const option = options.find(
      opt => opt.value.width === resolution.width && opt.value.height === resolution.height
    );
    return option ? `${option.value.width}x${option.value.height}` : "";
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Choose page size
      </label>
      <Select
        value={getCurrentValue()}
        onValueChange={(value) => {
          const option = options.find(
            opt => `${opt.value.width}x${opt.value.height}` === value
          );
          if (option) {
            setResolution(option.value);
          }
        }}
      >
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Select size" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem
              key={`${opt.value.width}x${opt.value.height}`}
              value={`${opt.value.width}x${opt.value.height}`}
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
