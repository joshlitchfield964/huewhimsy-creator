
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGeneratorContext } from "./GeneratorContext";

export const GenerationInfo = () => {
  const { 
    isPaidUser, 
    remainingMonthly, 
    session, 
    remainingToday, 
    navigate 
  } = useGeneratorContext();

  return (
    <div className="flex items-center justify-center gap-2 text-sm font-medium">
      <Info className="h-4 w-4 text-blue-500" />
      {isPaidUser ? (
        <span className="text-blue-600">
          You have {remainingMonthly !== null ? `${remainingMonthly} of ${remainingMonthly + (remainingMonthly === 0 ? 0 : 1) - 1}` : 'unlimited'} generations remaining this month
        </span>
      ) : session ? (
        remainingToday && remainingToday > 0 ? (
          <span className="text-blue-600">
            You have {remainingToday} free generation{remainingToday !== 1 ? 's' : ''} remaining today (5 per day)
          </span>
        ) : (
          <span className="text-gray-600">
            You've used your free generations for today. 
            <Button 
              variant="link" 
              className="px-1 h-auto text-primary" 
              onClick={() => navigate('/pricing')}
            >
              Upgrade for more
            </Button>
          </span>
        )
      ) : (
        remainingToday && remainingToday > 0 ? (
          <span className="text-blue-600">
            You have {remainingToday} free generation{remainingToday !== 1 ? 's' : ''} remaining today (3 per day)
          </span>
        ) : (
          <span className="text-gray-600">
            You've used your free generations for today. 
            <Button 
              variant="link" 
              className="px-1 h-auto text-primary" 
              onClick={() => navigate('/auth')}
            >
              Sign up for more
            </Button>
          </span>
        )
      )}
    </div>
  );
};
