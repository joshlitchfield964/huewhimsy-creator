
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UserHistory } from "@/components/UserHistory";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { userGenerationService } from "@/services/userGenerationService";
import { CreditCard, Clock, BarChart3, User, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default function Dashboard() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("history");
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [generationStats, setGenerationStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // Fetch subscription data
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
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

  if (!session) {
    return null; // The ProtectedRoute will handle redirection
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow pt-16 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">
                Welcome, {session.user?.user_metadata?.full_name || 'Artist'}!
              </h1>
              <p className="text-gray-600">
                Manage your coloring pages and account settings
              </p>
            </div>

            <Tabs 
              defaultValue="history" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="history">My Coloring Pages</TabsTrigger>
                  <TabsTrigger value="usage">Usage & Billing</TabsTrigger>
                  <TabsTrigger value="account">Account Settings</TabsTrigger>
                </TabsList>
                
                <Button 
                  onClick={() => window.location.href = "/#generator"}
                  variant="default"
                >
                  Create New Coloring Page
                </Button>
              </div>
              
              <TabsContent value="history" className="space-y-4">
                <UserHistory />
              </TabsContent>

              <TabsContent value="usage" className="space-y-6">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                    <p>Loading your account information...</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Current Plan Card */}
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

                      {/* Generation Limits Card */}
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
                                {generationStats ? generationStats.remainingToday === 1 ? '0/1' : '1/1' : 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Monthly Limit:</span>
                              <span className="font-medium">
                                {subscriptionData 
                                  ? `${generationStats?.count || 0}/${subscriptionData.monthly_generation_limit}` 
                                  : '1/day (Free)'}
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

                      {/* Usage History Card */}
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
                                onClick={() => setActiveTab("history")}
                              >
                                View All Coloring Pages
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

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
                                You're currently on the <strong>Free Plan</strong> which allows 1 coloring page generation per day. 
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
                                {subscriptionData.monthly_generation_limit} coloring pages per month.
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
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="account" className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Email</p>
                        <p className="font-medium">{session.user?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                        <p className="font-medium">{session.user?.user_metadata?.full_name || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">User ID</p>
                        <p className="font-medium text-xs text-muted-foreground">{session.user?.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Account Created</p>
                        <p className="font-medium">{formatDate(session.user?.created_at)}</p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline"
                      onClick={async () => {
                        await supabase.auth.signOut();
                        navigate('/');
                      }}
                      className="mt-4"
                    >
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
