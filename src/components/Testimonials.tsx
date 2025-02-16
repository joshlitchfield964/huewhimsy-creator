
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Art Teacher",
    image: "https://i.pravatar.cc/100?img=1",
    content:
      "This tool has transformed my art classes. My students love creating their own coloring pages, and it's helped spark their creativity!",
    stars: 5,
  },
  {
    name: "Michael Chen",
    role: "Parent",
    image: "https://i.pravatar.cc/100?img=2",
    content:
      "Amazing platform! My kids can now turn their imaginative stories into coloring books. It's both educational and fun.",
    stars: 5,
  },
  {
    name: "Emma Davis",
    role: "Illustrator",
    image: "https://i.pravatar.cc/100?img=3",
    content:
      "As an illustrator, I'm impressed by the quality of the generated line art. It's become a valuable tool in my creative process.",
    stars: 5,
  },
];

export const Testimonials = () => {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12 animate-fade-up">
          <div className="text-center space-y-4">
            <h2 className="font-display text-4xl font-bold">
              What Our <span className="text-blue-500">Users</span> Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of happy users creating amazing coloring pages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-secondary rounded-xl space-y-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
