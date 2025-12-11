import { Package, ShoppingCart, Calendar, BarChart3, MapPin } from "lucide-react";
import { NavLink } from "@/components/NavLink";
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
} from "@/components/ui/sidebar";
import { RoleSwitcher } from "@/components/RoleSwitcher";

const menuItems = [
  { title: "Products", url: "/vendor/products", icon: Package },
  { title: "Shelf Space", url: "/vendor/shelf-space", icon: ShoppingCart },
  { title: "Orders", url: "/vendor/orders", icon: Calendar },
  { title: "Analytics", url: "/vendor/analytics", icon: BarChart3 },
  { title: "Delivery Range", url: "/vendor/delivery-range", icon: MapPin },
];

interface VendorSidebarProps {
  onRoleChange: (role: "admin" | "vendor") => void;
}

export function VendorSidebar({ onRoleChange }: VendorSidebarProps) {
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
        <RoleSwitcher currentRole="vendor" onRoleChange={onRoleChange} />
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
    </Sidebar>
  );
}
