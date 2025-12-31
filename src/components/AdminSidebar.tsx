import { LayoutDashboard, Package, Users, Truck, UserCheck, FileText, Warehouse, ClipboardList, LayoutGrid, Boxes } from "lucide-react";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Vendors", url: "/vendors", icon: Users },
  { title: "Drivers", url: "/drivers", icon: Truck },
  { title: "Fleet Performance", url: "/fleet", icon: UserCheck },
  { title: "Billing", url: "/billing", icon: FileText },
];

const microhubManagementItems = [
  { title: "Stock Tracking", url: "/admin/microhubs/stock-tracking", icon: Package },
  { title: "Inventory Log", url: "/admin/microhubs/inventory-log", icon: ClipboardList },
  { title: "Storage Optimization", url: "/admin/microhubs/storage-optimization", icon: LayoutGrid },
  { title: "Resource Allocation", url: "/admin/microhubs/resource-allocation", icon: Boxes },
];

interface AdminSidebarProps {
  onRoleChange: (role: "admin" | "vendor" | "driver") => void;
}

export function AdminSidebar({ onRoleChange }: AdminSidebarProps) {
  return (
    <Sidebar className="border-r-2 border-border/50 backdrop-blur-sm">
      <SidebarHeader className="border-b-2 border-border/50 p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg animate-glow">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SwiftShip
            </h2>
            <p className="text-xs text-muted-foreground font-medium">Admin Panel</p>
          </div>
        </div>
        <RoleSwitcher currentRole="admin" onRoleChange={onRoleChange} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:text-foreground transition-all duration-300 hover:translate-x-1"
                      activeClassName="bg-gradient-to-r from-primary/15 to-secondary/15 text-primary font-semibold shadow-md border-l-4 border-primary"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Microhubs with submenu */}
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:text-foreground transition-all duration-300">
                      <Warehouse className="w-5 h-5" />
                      <span className="font-medium">Microhubs</span>
                      <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <NavLink
                            to="/microhubs"
                            end
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:text-foreground transition-all duration-300 hover:translate-x-1"
                            activeClassName="bg-gradient-to-r from-primary/15 to-secondary/15 text-primary font-semibold shadow-sm"
                          >
                            <Package className="w-4 h-4" />
                            <span>Overview</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      {microhubManagementItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink
                              to={item.url}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:text-foreground transition-all duration-300 hover:translate-x-1"
                              activeClassName="bg-gradient-to-r from-primary/15 to-secondary/15 text-primary font-semibold shadow-sm"
                            >
                              <item.icon className="w-4 h-4" />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
