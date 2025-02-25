
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const PRICING_PLANS = [
  {
    name: "Starter",
    price: 3,
    description: "Perfect for occasional coloring enthusiasts",
    features: [
      "50 coloring pages per month",
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
    features: [
      "100 coloring pages per month",
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
    features: [
      "200 coloring pages per month",
      "All Creator features",
      "Fastest generation speed",
      "Bulk download options",
      "Commercial usage rights"
    ]
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-gray-600">
            Choose the perfect plan for your creative needs. All plans include access to our AI-powered coloring page generator.
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
                <Button className="w-full mt-6">Choose {plan.name}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
