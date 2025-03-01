
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface SubscriptionInfoProps {
  subscriptionData: any;
  formatDate: (date: string) => string;
}

export function SubscriptionInfo({ subscriptionData, formatDate }: SubscriptionInfoProps) {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Current Plan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Plan:</span>
            <span className="font-medium">
              {subscriptionData?.plan_name || 'Free'}
            </span>
          </div>
          {subscriptionData && (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium">${subscriptionData?.plan_price || 0}/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium capitalize">{subscriptionData?.status || 'active'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Renewal Date:</span>
                <span className="font-medium">{formatDate(subscriptionData?.current_period_end)}</span>
              </div>
            </>
          )}
          {!subscriptionData && (
            <Button 
              variant="outline" 
              className="w-full mt-2"
              onClick={() => navigate('/pricing')}
            >
              Upgrade
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
