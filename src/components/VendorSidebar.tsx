import { Package, ShoppingCart, Calendar, BarChart3, MapPin, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Products", url: "/vendor/products", icon: Package },
  { title: "Shelf Space", url: "/vendor/shelf-space", icon: ShoppingCart },
  { title: "Orders", url: "/vendor/orders", icon: Calendar },
  { title: "Analytics", url: "/vendor/analytics", icon: BarChart3 },
  { title: "Delivery Range", url: "/vendor/delivery-range", icon: MapPin },
];

interface VendorSidebarProps {
  onRoleChange: (role: "admin" | "vendor" | "driver") => void;
}

export function VendorSidebar({ onRoleChange }: VendorSidebarProps) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("vendorId");
    localStorage.removeItem("driverId");
    
    // Navigate to login page
    navigate("/login");
  };

  return (
    <Sidebar className="border-r-2 border-border/50 backdrop-blur-sm">
      <SidebarHeader className="border-b-2 border-border/50 p-4 bg-gradient-to-br from-secondary/5 to-accent/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-lg animate-glow">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              SwiftShip
            </h2>
            <p className="text-xs text-muted-foreground font-medium">Vendor Portal</p>
          </div>
        </div>
        
        {/* User info */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium text-foreground">{user.name || "Vendor"}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider">Vendor</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-gradient-to-r hover:from-secondary/10 hover:to-accent/10 hover:text-foreground transition-all duration-300 hover:translate-x-1"
                      activeClassName="bg-gradient-to-r from-secondary/15 to-accent/15 text-secondary font-semibold shadow-md border-l-4 border-secondary"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t-2 border-border/50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-600/10 hover:text-red-600 transition-all duration-300 hover:translate-x-1 w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
