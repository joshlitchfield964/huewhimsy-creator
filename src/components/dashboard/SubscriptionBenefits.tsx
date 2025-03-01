
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SubscriptionBenefitsProps {
  subscriptionData: any;
}

export function SubscriptionBenefits({ subscriptionData }: SubscriptionBenefitsProps) {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Benefits</CardTitle>
        <CardDescription>
          Upgrade your account to access more features and generate more coloring pages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!subscriptionData && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">
                You're currently on the <strong>Free Plan</strong> which allows 5 coloring pages per day. 
                Upgrade to a paid plan to create more coloring pages and access additional features.
              </p>
              <Button 
                className="mt-3" 
                onClick={() => navigate('/pricing')}
              >
                View Pricing Plans
              </Button>
            </div>
          )}
          
          {subscriptionData && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">
                You're subscribed to the <strong>{subscriptionData.plan_name} Plan</strong> which gives you 
                {' '}{subscriptionData.monthly_generation_limit} coloring pages per month.
              </p>
              <Button 
                variant="outline"
                className="mt-3" 
                onClick={() => navigate('/pricing')}
              >
                Manage Subscription
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
