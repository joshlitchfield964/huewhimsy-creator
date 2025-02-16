
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    toast.success("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <div className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-up">
          <h2 className="font-display text-4xl font-bold text-primary">
            Get Weekly Inspiration
          </h2>
          <p className="text-gray-600">
            Subscribe to receive our top weekly coloring pages and creative
            inspiration directly in your inbox.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white"
            />
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
