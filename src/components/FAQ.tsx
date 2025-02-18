
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "How does the coloring page generator work?",
    answer:
      "Our AI-powered generator transforms your text descriptions into beautiful line art perfect for coloring. Simply enter your description, choose your preferred size, and let our technology create a unique coloring page just for you.",
  },
  {
    question: "Can I download and print the generated coloring pages?",
    answer:
      "Yes! All generated coloring pages are available in high resolution, making them perfect for printing. You can download them instantly after generation.",
  },
  {
    question: "What types of coloring pages can I create?",
    answer:
      "You can create any type of coloring page you can imagine! From landscapes and animals to abstract patterns and fantasy scenes - if you can describe it, our AI can create it.",
  },
  {
    question: "Are the generated coloring pages free to use?",
    answer:
      "Yes, once you generate a coloring page, you're free to use it for personal use. You can print it, color it, and share your colored creations with others.",
  },
];

export const FAQ = () => {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-up">
          <div className="text-center space-y-4">
            <h2 className="font-sans text-4xl font-bold text-primary">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Find answers to common questions about our coloring page generator.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};
