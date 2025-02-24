
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AgeGroup } from "@/services/runware";

const AGE_GROUPS: { label: string; value: AgeGroup }[] = [
  { label: "Toddler (1-3 years)", value: "toddler" },
  { label: "Preschool (3-5 years)", value: "preschool" },
  { label: "School (6-12 years)", value: "school" },
  { label: "Teen (13-17 years)", value: "teen" },
  { label: "Adult (18+ years)", value: "adult" },
];

interface AgeGroupSelectProps {
  ageGroup: AgeGroup;
  setAgeGroup: (ageGroup: AgeGroup) => void;
}

export const AgeGroupSelect = ({ ageGroup, setAgeGroup }: AgeGroupSelectProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Select age group
      </label>
      <Select value={ageGroup} onValueChange={(value) => setAgeGroup(value as AgeGroup)}>
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Select age group" />
        </SelectTrigger>
        <SelectContent>
          {AGE_GROUPS.map((group) => (
            <SelectItem key={group.value} value={group.value}>
              {group.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
