import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalendarIcon, CreditCard, ImageIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  updated_at: string;
}

interface Subscription {
  id: string;
  plan_name: string;
  plan_price: number;
  monthly_generation_limit: number;
  current_period_start: string;
  current_period_end: string;
  status: string;
}

export default function Dashboard() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usedGenerations, setUsedGenerations] = useState<number>(0);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [website, setWebsite] = useState("");
  const [loadingSubscription, setLoadingSubscription] = useState(false);

  useEffect(() => {
    if (session?.user.id) {
      getProfile();
      getSubscription();
    }
  }, [session]);

  const getProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', session?.user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setUsername(data.username || "");
        setFullName(data.full_name || "");
        setWebsite(data.website || "");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select()
        .eq('user_id', session?.user.id)
        .single();

      if (error) throw error;

      if (data) {
        setSubscription(data);
        setUsedGenerations(data.current_period_end ? 0 : data.monthly_generation_limit);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingSubscription(false);
    }
  };

  const updateProfile = async () => {
    try {
      if (!session?.user.id) throw new Error("No user");

      const updates = {
        id: session.user.id,
        username,
        full_name: fullName,
        website,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates);

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Account Dashboard</h1>
        
        <div className="grid gap-8 md:grid-cols-3 mb-8">
          {/* Subscription Info Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>
                Your current plan and usage statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingSubscription ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : subscription ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium text-lg">{subscription.plan_name} Plan</h3>
                      <p className="text-sm text-muted-foreground">${subscription.plan_price}/month</p>
                    </div>
                    <div className="bg-primary/10 px-3 py-1 rounded-full text-primary text-sm font-medium">
                      Active
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <ImageIcon className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Images Remaining</p>
                        <p className="text-2xl font-bold">{subscription.monthly_generation_limit - usedGenerations}</p>
                        <p className="text-sm text-muted-foreground">
                          {usedGenerations} of {subscription.monthly_generation_limit} used
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CalendarIcon className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Next Billing Date</p>
                        <p className="text-lg">
                          {format(new Date(subscription.current_period_end), "MMMM d, yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Plan renews automatically
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <h3 className="font-medium text-lg">Free Plan</h3>
                    <p className="text-muted-foreground mb-2">You're currently on the free plan</p>
                    <p className="font-medium">1 image generation per day</p>
                  </div>
                  <Button className="w-full" onClick={() => window.location.href = '/pricing'}>
                    Upgrade to Premium
                  </Button>
                </div>
              )}
            </CardContent>
            {subscription && (
              <CardFooter className="flex justify-between border-t pt-6">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Manage billing information
                </div>
                <Button variant="outline" onClick={() => window.location.href = '/pricing'}>
                  Change Plan
                </Button>
              </CardFooter>
            )}
          </Card>

          {/* Usage Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Stats</CardTitle>
              <CardDescription>Your generated images this month</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Generated</span>
                  <span className="font-bold">{usedGenerations}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Remaining</span>
                  <span className="font-bold">
                    {subscription ? subscription.monthly_generation_limit - usedGenerations : 1}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ 
                      width: `${subscription 
                        ? Math.min(100, (usedGenerations / subscription.monthly_generation_limit) * 100)
                        : Math.min(100, usedGenerations * 100)}%` 
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Settings Card */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="text"
                value={session?.user.email}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Website</label>
              <Input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <Button
              onClick={updateProfile}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Update Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
