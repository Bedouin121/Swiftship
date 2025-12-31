import { LayoutDashboard, Package, CheckCircle, Truck, Camera } from "lucide-react";
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
  { title: "Dashboard", url: "/driver/dashboard", icon: LayoutDashboard },
  { title: "Available Orders", url: "/driver/assignments", icon: Package },
  { title: "Active Deliveries", url: "/driver/active", icon: Truck },
  { title: "Delivery Confirmation", url: "/driver/confirmation", icon: Camera },
  { title: "Completed", url: "/driver/completed", icon: CheckCircle },
];

interface DriverSidebarProps {
  onRoleChange: (role: "admin" | "vendor" | "driver") => void;
}

export function DriverSidebar({ onRoleChange }: DriverSidebarProps) {
  return (
    <Sidebar className="border-r-2 border-border/50 backdrop-blur-sm">
      <SidebarHeader className="border-b-2 border-border/50 p-4 bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg animate-glow">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              SwiftShip
            </h2>
            <p className="text-xs text-muted-foreground font-medium">Driver Portal</p>
          </div>
        </div>
        <RoleSwitcher currentRole="driver" onRoleChange={onRoleChange} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider">Driver</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10 hover:text-foreground transition-all duration-300 hover:translate-x-1"
                      activeClassName="bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-600 font-semibold shadow-md border-l-4 border-emerald-500"
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
