
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { UserGenerationStats } from "@/services/generation/types";

interface UsageHistoryProps {
  generationStats: UserGenerationStats | null;
  formatDate: (date: string) => string;
  onViewAllClick: () => void;
}

export function UsageHistory({ generationStats, formatDate, onViewAllClick }: UsageHistoryProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Usage History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Generations:</span>
            <span className="font-medium">{generationStats?.count || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Generated:</span>
            <span className="font-medium">
              {generationStats?.lastGeneratedAt 
                ? formatDate(generationStats.lastGeneratedAt) 
                : 'Never'}
            </span>
          </div>
          <div className="pt-2">
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full"
              onClick={onViewAllClick}
            >
              View All Coloring Pages
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
