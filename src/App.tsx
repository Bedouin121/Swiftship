import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { VendorSidebar } from "@/components/VendorSidebar";
import { DriverSidebar } from "@/components/DriverSidebar";
import Dashboard from "./pages/Dashboard";
import Microhubs from "./pages/Microhubs";
import Vendors from "./pages/Vendors";
import Drivers from "./pages/Drivers";
import Fleet from "./pages/Fleet";
import Billing from "./pages/Billing";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import Products from "./pages/vendor/Products";
import ShelfSpace from "./pages/vendor/ShelfSpace";
import Orders from "./pages/vendor/Orders";
import VendorAnalytics from "./pages/vendor/VendorAnalytics";
import DeliveryRange from "./pages/vendor/DeliveryRange";
import AdminStockTracking from "./pages/admin/microhubs/StockTracking";
import AdminInventoryLog from "./pages/admin/microhubs/InventoryLog";
import AdminStorageOptimization from "./pages/admin/microhubs/StorageOptimization";
import AdminResourceAllocation from "./pages/admin/microhubs/ResourceAllocation";
import DriverDashboard from "./pages/driver/DriverDashboard";
import DriverAssignments from "./pages/driver/Assignments";
import ActiveDeliveries from "./pages/driver/ActiveDeliveries";
import DeliveryConfirmation from "./pages/driver/DeliveryConfirmation";
import CompletedDeliveries from "./pages/driver/CompletedDeliveries";
import Login from "./pages/auth/Login";
import Onboarding from "./pages/auth/Onboarding";
import NotFound from "./pages/NotFound";
import LogoutHandler from "./components/LogoutHandler";

const queryClient = new QueryClient();

type Role = "admin" | "vendor" | "driver";

// Layout component for authenticated pages with sidebar
const AuthenticatedLayout = ({ children, currentRole, setCurrentRole }: {
  children: React.ReactNode;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
}) => {
  const getSidebar = () => {
    switch (currentRole) {
      case "vendor":
        return <VendorSidebar onRoleChange={setCurrentRole} />;
      case "driver":
        return <DriverSidebar onRoleChange={setCurrentRole} />;
      default:
        return <AdminSidebar onRoleChange={setCurrentRole} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative">
        {getSidebar()}
        <main className="flex-1 p-6 overflow-auto relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  
  // Get user role from localStorage
  const userRole = localStorage.getItem("userRole") as Role | null;
  const [currentRole, setCurrentRole] = useState<Role>(userRole || "admin");

  // Update currentRole when userRole changes
  useEffect(() => {
    if (userRole) {
      setCurrentRole(userRole);
    }
  }, [userRole]);

  // Check if current route is an auth route (no sidebar needed)
  const isAuthRoute = ['/login', '/onboarding'].includes(location.pathname);

  if (isAuthRoute) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    );
  }

  // Check if current route is a vendor/driver route that requires specific authentication
  const isVendorRoute = location.pathname.startsWith('/vendor');
  const isDriverRoute = location.pathname.startsWith('/driver');
  
  // Only redirect to login if trying to access vendor routes without vendor auth, or driver routes without driver auth
  // Admin (authenticated or not) can access everything
  if (isVendorRoute && userRole && userRole !== "vendor" && userRole !== "admin") {
    return <Navigate to="/login" replace />;
  }
  if (isDriverRoute && userRole && userRole !== "driver" && userRole !== "admin") {
    return <Navigate to="/login" replace />;
  }
  
  // If no user role, default to admin (allows unrestricted access)
  const effectiveRole = userRole || "admin";
  const effectiveCurrentRole = userRole ? currentRole : "admin";

  return (
    <AuthenticatedLayout currentRole={effectiveCurrentRole} setCurrentRole={setCurrentRole}>
      <Routes>
        {/* Admin Routes - Always accessible */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/microhubs" element={<Microhubs />} />
        <Route path="/admin/microhubs/stock-tracking" element={<AdminStockTracking />} />
        <Route path="/admin/microhubs/inventory-log" element={<AdminInventoryLog />} />
        <Route path="/admin/microhubs/storage-optimization" element={<AdminStorageOptimization />} />
        <Route path="/admin/microhubs/resource-allocation" element={<AdminResourceAllocation />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/fleet" element={<Fleet />} />
        <Route path="/billing" element={<Billing />} />

        {/* Vendor Routes - Accessible by vendors and admins */}
        {(effectiveRole === "vendor" || effectiveRole === "admin") && (
          <>
            <Route path="/vendor/products" element={<Products />} />
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/shelf-space" element={<ShelfSpace />} />
            <Route path="/vendor/orders" element={<Orders />} />
            <Route path="/vendor/analytics" element={<VendorAnalytics />} />
            <Route path="/vendor/delivery-range" element={<DeliveryRange />} />
          </>
        )}

        {/* Driver Routes - Accessible by drivers and admins */}
        {(effectiveRole === "driver" || effectiveRole === "admin") && (
          <>
            <Route path="/driver/dashboard" element={<DriverDashboard />} />
            <Route path="/driver/assignments" element={<DriverAssignments />} />
            <Route path="/driver/active" element={<ActiveDeliveries />} />
            <Route path="/driver/confirmation" element={<DeliveryConfirmation />} />
            <Route path="/driver/completed" element={<CompletedDeliveries />} />
          </>
        )}

        {/* Logout route */}
        <Route path="/logout" element={<LogoutHandler />} />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthenticatedLayout>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
