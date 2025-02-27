
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Palette, Sparkles, Rocket, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTermsError(false);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/dashboard");
      } else {
        // Check if terms are accepted for signup
        if (!acceptTerms) {
          setTermsError(true);
          throw new Error("You must accept the Terms of Service and Privacy Policy to create an account");
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        toast.success("Registration successful! Please check your email to confirm your account.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 -z-10" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-8 animate-fade-up">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Palette className="h-16 w-16 text-pink-500 animate-pulse" />
                  <Sparkles className="h-6 w-6 text-purple-500 absolute -top-2 -right-2 animate-bounce" />
                </div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                {isLogin ? "Welcome back!" : "Join the fun!"}
              </h2>
              <p className="mt-2 text-gray-600">
                {isLogin ? "Let's create some magic together" : "Start your creative adventure"}
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {!isLogin && (
                  <div className="group">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 group-hover:text-pink-500 transition-colors">
                      Full Name
                    </label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={!isLogin}
                      className="mt-1 transition-all duration-300 hover:border-purple-300 focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                )}
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 group-hover:text-pink-500 transition-colors">
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 transition-all duration-300 hover:border-purple-300 focus:ring-2 focus:ring-purple-200"
                  />
                </div>
                <div className="group">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 group-hover:text-pink-500 transition-colors">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 transition-all duration-300 hover:border-purple-300 focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                {!isLogin && (
                  <div className="pt-2">
                    <div className="flex items-start">
                      <Checkbox 
                        id="terms" 
                        checked={acceptTerms}
                        onCheckedChange={(checked) => {
                          setAcceptTerms(checked === true);
                          if (checked) setTermsError(false);
                        }}
                        className="mt-1 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                      />
                      <label 
                        htmlFor="terms" 
                        className={`ml-2 text-sm ${termsError ? 'text-red-500' : 'text-gray-600'}`}
                      >
                        I agree to PrintablePerks' {' '}
                        <Link to="/terms-of-service" className="text-purple-600 hover:text-purple-800 hover:underline" target="_blank">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy-policy" className="text-purple-600 hover:text-purple-800 hover:underline" target="_blank">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                    {termsError && (
                      <div className="flex items-center mt-2 text-red-500 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span>You must accept the terms to continue</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:opacity-90 transition-opacity text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 group"
                disabled={loading}
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    {isLogin ? "Sign in" : "Sign up"}
                    <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setTermsError(false);
                  }}
                  className="text-sm text-purple-600 hover:text-pink-500 transition-colors hover:underline inline-flex items-center gap-1"
                >
                  <Sparkles className="w-4 h-4" />
                  {isLogin
                    ? "Don't have an account? Join us!"
                    : "Already have an account? Welcome back!"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
