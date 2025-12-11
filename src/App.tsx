import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { VendorSidebar } from "@/components/VendorSidebar";
import Dashboard from "./pages/Dashboard";
import Microhubs from "./pages/Microhubs";
import Vendors from "./pages/Vendors";
import Drivers from "./pages/Drivers";
import Fleet from "./pages/Fleet";
import Billing from "./pages/Billing";
import Products from "./pages/vendor/Products";
import ShelfSpace from "./pages/vendor/ShelfSpace";
import Orders from "./pages/vendor/Orders";
import VendorAnalytics from "./pages/vendor/VendorAnalytics";
import DeliveryRange from "./pages/vendor/DeliveryRange";
import AdminStockTracking from "./pages/admin/microhubs/StockTracking";
import AdminInventoryLog from "./pages/admin/microhubs/InventoryLog";
import AdminStorageOptimization from "./pages/admin/microhubs/StorageOptimization";
import AdminResourceAllocation from "./pages/admin/microhubs/ResourceAllocation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

type Role = "admin" | "vendor";

const App = () => {
  const [currentRole, setCurrentRole] = useState<Role>("admin");

  const getSidebar = () => {
    switch (currentRole) {
      case "vendor":
        return <VendorSidebar onRoleChange={setCurrentRole} />;
      default:
        return <AdminSidebar onRoleChange={setCurrentRole} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="min-h-screen flex w-full relative">
              {getSidebar()}
              <main className="flex-1 p-6 overflow-auto relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
                <div className="relative z-10">
                  <Routes>
                  {/* Admin Routes */}
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

                  {/* Vendor Routes */}
                  <Route path="/vendor/products" element={<Products />} />
                  <Route path="/vendor/shelf-space" element={<ShelfSpace />} />
                  <Route path="/vendor/orders" element={<Orders />} />
                  <Route path="/vendor/analytics" element={<VendorAnalytics />} />
                  <Route path="/vendor/delivery-range" element={<DeliveryRange />} />

                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                </div>
              </main>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
