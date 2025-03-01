
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { UserGenerationStats } from "@/services/generation/types";

interface GenerationLimitsProps {
  generationStats: UserGenerationStats | null;
  subscriptionData: any;
}

export function GenerationLimits({ generationStats, subscriptionData }: GenerationLimitsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Generation Limits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Today's Usage:</span>
            <span className="font-medium">
              {generationStats 
                ? subscriptionData 
                  ? 'Unlimited daily' 
                  : `${5 - generationStats.remainingToday}/${5}`
                : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Monthly Limit:</span>
            <span className="font-medium">
              {subscriptionData 
                ? `${subscriptionData.monthly_generation_limit - (generationStats?.remainingMonthly || 0)}/${subscriptionData.monthly_generation_limit}` 
                : '5/day (Free)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Free Generations:</span>
            <span className="font-medium">
              {generationStats?.freeGenerationAvailable ? 'Available' : 'Used for today'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Next Free Generation:</span>
            <span className="font-medium">
              {!generationStats?.freeGenerationAvailable ? 'Tomorrow' : 'Available now'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
