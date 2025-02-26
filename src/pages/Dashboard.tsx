
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalendarIcon, CreditCard, ImageIcon, Loader2, User, Globe, Mail, Save, Sparkles, CheckCircle, UserCircle } from "lucide-react";
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
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
        .maybeSingle();  // Changed from single() to maybeSingle() to handle potential empty results

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
        .maybeSingle();  // Changed from single() to maybeSingle()

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
      
      setUpdatingProfile(true);

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
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUpdatingProfile(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-12 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 -z-10" />
        <div className="absolute bottom-1/4 left-10 w-48 h-48 bg-purple-100/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 -z-10" />
        
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Hello, {fullName || username || session?.user.email?.split('@')[0] || "Friend"}!
              </h1>
              <p className="text-lg text-gray-600">Welcome to your creative dashboard</p>
            </div>
            
            <Button 
              onClick={() => window.location.href = '/generator'}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 shadow-md mt-4 md:mt-0"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create New Image
            </Button>
          </div>
          
          <div className="grid gap-12">
            {/* Subscription and Usage Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-purple-500" />
                Subscription & Usage
              </h2>
              
              <div className="grid gap-8 md:grid-cols-3">
                {/* Subscription Info Card */}
                <Card className="md:col-span-2 border-none shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-t-lg border-b">
                    <CardTitle className="flex items-center">
                      <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
                      Subscription
                    </CardTitle>
                    <CardDescription>
                      Your current plan and usage statistics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {loadingSubscription ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : subscription ? (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between border-b pb-4">
                          <div>
                            <h3 className="font-semibold text-xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                              {subscription.plan_name} Plan
                            </h3>
                            <p className="text-sm text-gray-600">${subscription.plan_price}/month</p>
                          </div>
                          <div className="bg-gradient-to-r from-green-400 to-emerald-500 px-3 py-1 rounded-full text-white text-sm font-medium">
                            Active
                          </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                            <ImageIcon className="h-10 w-10 p-2 bg-white text-pink-500 rounded-full shadow-sm" />
                            <div>
                              <p className="font-medium text-gray-800">Images Remaining</p>
                              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                                {subscription.monthly_generation_limit - usedGenerations}
                              </p>
                              <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-gradient-to-r from-pink-400 to-purple-500 h-2.5 rounded-full"
                                  style={{ 
                                    width: `${Math.min(100, (usedGenerations / subscription.monthly_generation_limit) * 100)}%` 
                                  }}
                                />
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {usedGenerations} of {subscription.monthly_generation_limit} used
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                            <CalendarIcon className="h-10 w-10 p-2 bg-white text-blue-500 rounded-full shadow-sm" />
                            <div>
                              <p className="font-medium text-gray-800">Next Billing Date</p>
                              <p className="text-xl font-semibold text-blue-600">
                                {format(new Date(subscription.current_period_end), "MMMM d, yyyy")}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                Plan renews automatically
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="text-center py-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
                          <h3 className="font-semibold text-xl mb-2">Free Plan</h3>
                          <p className="text-gray-600 mb-4">You're currently on the free plan</p>
                          <div className="inline-block bg-white p-3 rounded-full shadow-sm mb-4">
                            <ImageIcon className="h-8 w-8 text-blue-500" />
                          </div>
                          <p className="font-medium">1 image generation per day</p>
                        </div>
                        <Button 
                          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 shadow-md"
                          onClick={() => window.location.href = '/pricing'}
                        >
                          Upgrade to Premium
                        </Button>
                      </div>
                    )}
                  </CardContent>
                  {subscription && (
                    <CardFooter className="flex justify-between border-t pt-6">
                      <div className="flex items-center text-sm text-gray-600 hover:text-purple-500 transition-colors cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Manage billing information
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => window.location.href = '/pricing'}
                        className="border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        Change Plan
                      </Button>
                    </CardFooter>
                  )}
                </Card>

                {/* Usage Stats Card */}
                <Card className="border-none shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg border-b">
                    <CardTitle className="flex items-center">
                      <ImageIcon className="mr-2 h-5 w-5 text-blue-500" />
                      Usage Stats
                    </CardTitle>
                    <CardDescription>This month's activity</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 mb-4">
                          <span className="text-3xl font-bold text-blue-600">{usedGenerations}</span>
                        </div>
                        <p className="text-gray-600">Images Generated</p>
                      </div>
                      
                      <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Total Generated</span>
                          <span className="font-bold text-indigo-600">{usedGenerations}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Remaining</span>
                          <span className="font-bold text-indigo-600">
                            {subscription ? subscription.monthly_generation_limit - usedGenerations : 1}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                            style={{ 
                              width: `${subscription 
                                ? Math.min(100, (usedGenerations / subscription.monthly_generation_limit) * 100)
                                : Math.min(100, usedGenerations * 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Profile Settings Section - Redesigned */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <UserCircle className="mr-2 h-5 w-5 text-pink-500" />
                Profile Settings
              </h2>
              
              <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 p-6 rounded-xl shadow-lg">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Profile Avatar Section */}
                  <div className="md:col-span-1 flex flex-col items-center justify-start">
                    <div className="relative">
                      <div className="w-36 h-36 rounded-full bg-gradient-to-r from-pink-300 to-purple-400 flex items-center justify-center shadow-lg">
                        <UserCircle className="w-20 h-20 text-white" />
                      </div>
                      <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md">
                        <User className="w-5 h-5 text-purple-500" />
                      </div>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <h3 className="font-bold text-lg">{fullName || username || "Your Name"}</h3>
                      <p className="text-gray-600 text-sm">{session?.user.email}</p>
                    </div>
                    
                    <div className="mt-6 w-full bg-white rounded-lg p-4 shadow-md">
                      <h4 className="font-medium text-gray-800 flex items-center mb-3">
                        <CalendarIcon className="w-4 h-4 mr-2 text-pink-500" />
                        Account Info
                      </h4>
                      <div className="text-sm space-y-2">
                        <p className="flex justify-between">
                          <span className="text-gray-600">Member since:</span>
                          <span className="font-medium">{profile?.updated_at ? format(new Date(profile.updated_at), "MMM d, yyyy") : "N/A"}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-medium text-green-600 flex items-center">
                            Active <CheckCircle className="ml-1 w-3 h-3" />
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Form Section */}
                  <div className="md:col-span-2">
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <h3 className="text-xl font-semibold mb-5 text-gray-800 flex items-center">
                        <User className="mr-2 h-5 w-5 text-purple-500" />
                        Personal Information
                      </h3>
                      
                      <div className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-5">
                          <div className="group space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700 group-hover:text-pink-500 transition-colors">
                              <Mail className="mr-2 h-4 w-4 text-gray-500" />
                              Email
                            </label>
                            <Input
                              type="text"
                              value={session?.user.email}
                              disabled
                              className="bg-gray-50 border-gray-200"
                            />
                            <p className="text-xs text-gray-500">Your email is used for login and cannot be changed</p>
                          </div>
                          
                          <div className="group space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700 group-hover:text-pink-500 transition-colors">
                              <User className="mr-2 h-4 w-4 text-gray-500" />
                              Username
                            </label>
                            <Input
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all"
                              placeholder="Choose a username"
                            />
                            <p className="text-xs text-gray-500">Your unique username on the platform</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-medium text-gray-700 hover:text-pink-500 transition-colors">
                            <User className="mr-2 h-4 w-4 text-gray-500" />
                            Full Name
                          </label>
                          <Input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all"
                            placeholder="Your full name"
                          />
                          <p className="text-xs text-gray-500">How you'd like to be addressed</p>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-medium text-gray-700 hover:text-pink-500 transition-colors">
                            <Globe className="mr-2 h-4 w-4 text-gray-500" />
                            Website
                          </label>
                          <Input
                            type="url"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="border-gray-200 focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all"
                            placeholder="https://your-website.com"
                          />
                          <p className="text-xs text-gray-500">Share your personal website or portfolio</p>
                        </div>
                        
                        <div className="pt-3">
                          <Button
                            onClick={updateProfile}
                            disabled={updatingProfile}
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 shadow-md flex items-center justify-center py-6"
                          >
                            {updatingProfile ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating Profile...
                              </>
                            ) : saveSuccess ? (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Profile Updated Successfully!
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Profile Information
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
