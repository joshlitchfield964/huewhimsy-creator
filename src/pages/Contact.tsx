
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success("Your message has been sent! We'll get back to you soon.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-display bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              Have questions about PrintablePerks? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="md:col-span-1 space-y-6">
              <Card className="p-6 shadow-lg bg-white border-0 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-70"></div>
                
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Information</h2>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-3 rounded-full mr-4">
                      <Mail className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Email</h3>
                      <a href="mailto:info@printableperks.com" className="text-purple-600 hover:underline">
                        info@printableperks.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-3 rounded-full mr-4">
                      <Phone className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Phone</h3>
                      <a href="tel:+1-555-123-4567" className="text-purple-600 hover:underline">
                        +1 (555) 123-4567
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-3 rounded-full mr-4">
                      <MapPin className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Office</h3>
                      <p className="text-gray-600">
                        123 Innovation Drive<br />
                        San Francisco, CA 94103
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-3 rounded-full mr-4">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Hours</h3>
                      <p className="text-gray-600">
                        Monday - Friday<br />
                        9:00 AM - 5:00 PM PST
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <h3 className="text-xl font-bold mb-3">Need immediate help?</h3>
                <p className="mb-4">Check out our comprehensive FAQ section for quick answers to common questions.</p>
                <Button variant="secondary" className="w-full bg-white text-purple-600 hover:bg-gray-100" onClick={() => window.location.href = "/#faq"}>
                  View FAQ
                </Button>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <Card className="p-8 shadow-xl bg-white border-0 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-pink-100 rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-70"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-100 rounded-full transform translate-x-1/3 translate-y-1/3 opacity-70"></div>
                
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">Send us a Message</h2>
                  <p className="text-gray-600 mb-6">Fill out the form below and we'll get back to you as soon as possible.</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">
                          Your Name
                        </label>
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          required
                          className="border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 rounded-md"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="johndoe@example.com"
                          required
                          className="border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                        Subject
                      </label>
                      <Select value={subject} onValueChange={setSubject}>
                        <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 rounded-md">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="billing">Billing Question</SelectItem>
                          <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                          <SelectItem value="feedback">Feedback/Suggestion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-gray-700">
                        Your Message
                      </label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please provide details about your inquiry..."
                        required
                        className="min-h-[150px] border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 rounded-md"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-3 rounded-md shadow-md flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center font-display">Find Us</h2>
            <div className="max-w-5xl mx-auto rounded-xl overflow-hidden shadow-xl h-[400px] bg-gray-200 flex items-center justify-center">
              {/* This would normally be a real map. For now, displaying a placeholder */}
              <div className="text-center p-8">
                <MapPin className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <p className="text-lg text-gray-600">Interactive map would be displayed here</p>
                <p className="text-gray-500">123 Innovation Drive, San Francisco, CA 94103</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
