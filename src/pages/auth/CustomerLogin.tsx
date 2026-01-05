import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Truck, 
  Phone, 
  ArrowRight,
  ArrowLeft,
  User
} from "lucide-react";

const CustomerLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate phone number format
      if (!phoneNumber || phoneNumber.length < 10) {
        throw new Error("Please enter a valid phone number");
      }

      // Normalize phone number - add + if not present and starts with 880
      let normalizedPhone = phoneNumber.trim();
      if (!normalizedPhone.startsWith('+') && normalizedPhone.startsWith('880')) {
        normalizedPhone = '+' + normalizedPhone;
      }

      // Store customer phone number in localStorage
      localStorage.setItem("customerPhone", normalizedPhone);
      localStorage.setItem("userRole", "customer");

      // Navigate to customer panel
      navigate("/customer/dashboard");
      
    } catch (error) {
      console.error("Customer login error:", error);
      alert(error instanceof Error ? error.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 animate-gradient"></div>
        
        {/* Floating shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-float" style={{ animationDelay: "2s" }}></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px"
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Truck className="w-10 h-10" />
            </div>
            <span className="text-4xl font-bold tracking-tight">SwiftShift</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Welcome<br />
            <span className="text-white/90">Customer</span>
          </h1>
          
          <p className="text-xl text-white/80 mb-12 max-w-md leading-relaxed">
            Track your orders and manage your deliveries with ease.
          </p>

          {/* Feature highlights */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="p-2 bg-white/20 rounded-lg">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Quick Access</h3>
                <p className="text-white/70 text-sm">Login with just your phone number</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="p-2 bg-white/20 rounded-lg">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Order Tracking</h3>
                <p className="text-white/70 text-sm">View all your order history</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="p-3 gradient-primary rounded-2xl text-white">
              <Truck className="w-8 h-8" />
            </div>
            <span className="text-3xl font-bold text-foreground">SwiftShift</span>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-foreground mb-2">Customer Login</h2>
            <p className="text-muted-foreground">
              Enter your phone number to view your orders
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground font-medium">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="8801713092195 or +8801713092195"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-12 h-12 bg-muted/50 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 gradient-primary text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Logging in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Login
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>

          {/* Back to main login */}
          <div className="text-center pt-4 border-t border-border">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to main login
            </Link>
          </div>
        </div>
      </div>

      {/* Add keyframes for gradient animation */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default CustomerLogin;