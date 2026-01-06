import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { cn } from "@/lib/utils";
import { 
  Truck, 
  ArrowRight,
  ArrowLeft,
  User,
  Package,
  MapPin
} from "lucide-react";

const CustomerLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const digits = phoneNumber.replace(/\D/g, '');
      
      if (digits.length !== 10) {
        throw new Error("Please enter a valid 10-digit phone number");
      }

      const fullPhoneNumber = `+880${digits}`;

      localStorage.setItem("customerPhone", fullPhoneNumber);
      localStorage.setItem("userRole", "customer");

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
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 animate-gradient" />
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-float" style={{ animationDelay: "4s" }} />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px"
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-start p-12 xl:p-16 text-primary-foreground">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-4 bg-white/15 rounded-2xl backdrop-blur-sm border border-white/20 shadow-glow">
              <Truck className="w-10 h-10" />
            </div>
            <span className="text-4xl font-bold tracking-tight">SwiftShift</span>
          </div>
          
          <h1 className="text-5xl xl:text-6xl font-extrabold mb-6 leading-tight">
            Welcome Back,<br />
            <span className="text-white/80">Customer</span>
          </h1>
          
          <p className="text-xl text-white/70 mb-16 max-w-md leading-relaxed font-light">
            Track your orders and manage deliveries with our seamless platform.
          </p>

          <div className="space-y-4 w-full max-w-sm">
            {[
              { icon: User, title: "Quick Access", desc: "Login with just your phone" },
              { icon: Package, title: "Order History", desc: "View all past deliveries" },
              { icon: MapPin, title: "Live Tracking", desc: "Real-time order updates" },
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className="flex items-center gap-4 p-4 glass rounded-2xl transition-all duration-300 hover:bg-white/15 hover:scale-[1.02] cursor-default"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-3 bg-white/20 rounded-xl">
                  <feature.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">{feature.title}</h3>
                  <p className="text-white/60 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 bg-background relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="w-full max-w-md space-y-10 relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="p-3 gradient-primary rounded-2xl text-primary-foreground shadow-soft">
              <Truck className="w-8 h-8" />
            </div>
            <span className="text-3xl font-bold text-foreground">SwiftShift</span>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Customer Login</h2>
            <p className="text-muted-foreground text-lg">Enter your phone number to view your orders</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="phone" className="text-foreground font-semibold text-base">
                Phone Number
              </Label>
              <PhoneInput
                id="phone"
                placeholder="1234 567 890"
                value={phoneNumber}
                onChange={setPhoneNumber}
                countryCode="+880"
                required
              />
              <p className="text-sm text-muted-foreground pl-1">
                Enter your 10-digit Bangladeshi phone number
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 gradient-primary text-primary-foreground font-semibold text-lg rounded-xl shadow-soft hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">or</span>
            </div>
          </div>

          {/* Back to main login */}
          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Back to main login</span>
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
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CustomerLogin;