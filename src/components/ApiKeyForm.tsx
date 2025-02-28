
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function ApiKeyForm() {
  const [apiKey, setApiKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the edge function to update the API key
      const { data, error } = await supabase.functions.invoke('update-runware-key', {
        body: { apiKey },
      });
      
      if (error) throw error;
      
      toast.success("API key updated successfully!");
      setApiKey("");
    } catch (error) {
      console.error("Error updating API key:", error);
      toast.error("Failed to update API key. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Update Runware API Key</CardTitle>
        <CardDescription>
          Enter your Runware API key to enable coloring page generation.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter your Runware API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update API Key"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
