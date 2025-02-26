
import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface PricingPlan {
  name: string;
  price: number;
  description: string;
  monthlyLimit: number;
  features: string[];
}

const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Starter",
    price: 3,
    description: "Perfect for occasional coloring enthusiasts",
    monthlyLimit: 100,
    features: [
      "100 coloring pages per month",
      "High-quality PNG downloads",
      "PDF format support",
      "Print-ready files",
      "Basic age group targeting"
    ]
  },
  {
    name: "Creator",
    price: 5,
    description: "Ideal for regular creative sessions",
    monthlyLimit: 200,
    features: [
      "200 coloring pages per month",
      "All Starter features",
      "Priority generation",
      "Advanced age group targeting",
      "Multiple page sizes"
    ]
  },
  {
    name: "Professional",
    price: 8,
    description: "Best for educators and content creators",
    monthlyLimit: 400,
    features: [
      "400 coloring pages per month",
      "All Creator features",
      "Fastest generation speed",
      "Bulk download options",
      "Commercial usage rights"
    ]
  }
];

export default function Pricing() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [subscribing, setSubscribing] = useState<string | null>(null);

  const handleSubscribe = async (plan: PricingPlan) => {
    if (!session) {
      toast.info("Please sign in to subscribe");
      navigate("/auth");
      return;
    }

    setSubscribing(plan.name);

    try {
      // In a real app, this would redirect to a payment processor
      // For this demo, we'll simulate a successful subscription
      
      // Create a subscription with a 30-day period
      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setDate(periodEnd.getDate() + 30);
      
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: session.user.id,
          plan_name: plan.name,
          plan_price: plan.price,
          monthly_generation_limit: plan.monthlyLimit,
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString()
        });

      if (error) throw error;

      toast.success(`Subscribed to ${plan.name} plan!`);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Subscription error:", error);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setSubscribing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-gray-600">
            Choose the perfect plan for your creative needs. All plans include access to our AI-powered coloring page generator.
          </p>
          <p className="mt-2 text-md text-primary font-medium">
            Free users get 1 free coloring page generation per day!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <Card key={plan.name} className="relative">
              <CardHeader>
                <CardTitle>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>
                </CardTitle>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full mt-6"
                  onClick={() => handleSubscribe(plan)}
                  disabled={subscribing !== null}
                >
                  {subscribing === plan.name ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Choose ${plan.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
