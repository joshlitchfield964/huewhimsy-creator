
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { userGenerationService } from "@/services/userGenerationService";
import { format } from "date-fns";
import { SubscriptionInfo } from "./SubscriptionInfo";
import { GenerationLimits } from "./GenerationLimits";
import { UsageHistory } from "./UsageHistory";
import { SubscriptionBenefits } from "./SubscriptionBenefits";

interface UsageBillingProps {
  userId: string;
  onViewAllClick: () => void;
}

export function UsageBilling({ userId, onViewAllClick }: UsageBillingProps) {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [generationStats, setGenerationStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // Fetch subscription data
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (subscriptionError) throw subscriptionError;

      // Fetch generation stats
      const stats = await userGenerationService.getUserGenerationStats();

      setSubscriptionData(subscriptionData?.[0] || null);
      setGenerationStats(stats);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <p>Loading your account information...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SubscriptionInfo 
          subscriptionData={subscriptionData} 
          formatDate={formatDate} 
        />
        <GenerationLimits 
          generationStats={generationStats}
          subscriptionData={subscriptionData}
        />
        <UsageHistory 
          generationStats={generationStats}
          formatDate={formatDate}
          onViewAllClick={onViewAllClick}
        />
      </div>
      <SubscriptionBenefits subscriptionData={subscriptionData} />
    </div>
  );
}
