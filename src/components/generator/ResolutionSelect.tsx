
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RESOLUTIONS = [
  { label: "Square (1024x1024)", value: "1024x1024" },
  { label: "Portrait (1024x1536)", value: "1024x1536" },
  { label: "Landscape (1536x1024)", value: "1536x1024" },
];

interface ResolutionSelectProps {
  resolution: string;
  setResolution: (resolution: string) => void;
}

export const ResolutionSelect = ({ resolution, setResolution }: ResolutionSelectProps) => {
  return (
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
  );
};
