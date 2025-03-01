
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UserHistory } from "@/components/UserHistory";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { UsageBilling } from "@/components/dashboard/UsageBilling";
import { UserProfile } from "@/components/dashboard/UserProfile";

export default function Dashboard() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("history");

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
                <UsageBilling 
                  userId={session.user.id}
                  onViewAllClick={() => setActiveTab("history")}
                />
              </TabsContent>
              
              <TabsContent value="account" className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
                <UserProfile session={session} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
