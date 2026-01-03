import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Truck, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight,
  Package,
  Zap
} from "lucide-react";

const Login = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Get user type from URL params (e.g., /login?type=vendor)
  const userType = searchParams.get("type") || "admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // First try vendor login
      const vendorResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api"}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          userType: "vendor",
        }),
      });

      if (vendorResponse.ok) {
        const vendorData = await vendorResponse.json();
        
        // Store vendor authentication data
        localStorage.setItem("token", vendorData.data.token);
        localStorage.setItem("user", JSON.stringify(vendorData.data.user));
        localStorage.setItem("userRole", "vendor");
        localStorage.setItem("vendorId", vendorData.data.user.id);

        // Navigate to vendor products page
        navigate("/vendor/products");
        return;
      }

      // Try driver login
      const driverResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api"}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          userType: "driver",
        }),
      });

      if (driverResponse.ok) {
        const driverData = await driverResponse.json();
        
        // Store driver authentication data
        localStorage.setItem("token", driverData.data.token);
        localStorage.setItem("user", JSON.stringify(driverData.data.user));
        localStorage.setItem("userRole", "driver");
        localStorage.setItem("driverId", driverData.data.user.id);

        // Navigate to driver dashboard
        navigate("/driver/dashboard");
        return;
      }

      // If vendor and driver login fail, try admin login
      const adminResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api"}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          userType: "admin",
        }),
      });

      if (adminResponse.ok) {
        const adminData = await adminResponse.json();
        
        // Store admin authentication data
        localStorage.setItem("token", adminData.data.token);
        localStorage.setItem("user", JSON.stringify(adminData.data.user));
        localStorage.setItem("userRole", "admin");

        // Navigate to admin dashboard
        navigate("/");
        return;
      }

      // If all fail, show error
      throw new Error("Invalid credentials or account not approved");
      
    } catch (error) {
      console.error("Login error:", error);
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
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent animate-gradient"></div>
        
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
            Revolutionizing<br />
            <span className="text-white/90">Last-Mile Delivery</span>
          </h1>
          
          <p className="text-xl text-white/80 mb-12 max-w-md leading-relaxed">
            Connect with customers, manage your fleet, and optimize deliveries all in one powerful platform.
          </p>

          {/* Feature highlights */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="p-2 bg-white/20 rounded-lg">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Smart Microhubs</h3>
                <p className="text-white/70 text-sm">Optimized storage & distribution</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="p-2 bg-white/20 rounded-lg">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Real-Time Tracking</h3>
                <p className="text-white/70 text-sm">Live delivery monitoring</p>
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
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back</h2>
            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 bg-muted/50 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12 bg-muted/50 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Remember me
                </Label>
              </div>
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 gradient-primary text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">
                New to SwiftShift?
              </span>
            </div>
          </div>

          {/* Sign up link */}
          <div className="text-center">
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors group"
            >
              Create an account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* User type quick links */}
          <div className="pt-4 border-t border-border">
            <p className="text-center text-sm text-muted-foreground mb-4">
              Join as
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/onboarding?type=customer"
                className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-all hover:scale-105"
              >
                Customer
              </Link>
              <Link
                to="/onboarding?type=vendor"
                className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-all hover:scale-105"
              >
                Vendor
              </Link>
              <Link
                to="/onboarding?type=driver"
                className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-all hover:scale-105"
              >
                Driver
              </Link>
            </div>
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

export default Login;
