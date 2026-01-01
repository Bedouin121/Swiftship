import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";

export default function VendorDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between relative">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Vendor Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Welcome to your vendor portal</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass-effect border-2 card-hover overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-110 transition-transform duration-300">
              <Package className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">0</div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Products listed</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-2 card-hover overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-success/20 to-primary/20 group-hover:scale-110 transition-transform duration-300">
              <ShoppingCart className="h-5 w-5 text-success" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">0</div>
            <p className="text-xs text-success mt-2 font-medium">Orders received</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-2 card-hover overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-warning/10 to-warning/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-warning/20 to-accent/20 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-5 w-5 text-warning" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-warning to-accent bg-clip-text text-transparent">৳0</div>
            <p className="text-xs text-warning mt-2 font-medium">Total earnings</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-2 card-hover overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-secondary/20 to-accent/20 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-5 w-5 text-secondary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">0</div>
            <p className="text-xs text-secondary mt-2 font-medium">Unique customers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-effect border-2">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Complete these steps to start selling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm">Account approved ✓</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
              <span className="text-sm">Add your first product</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
              <span className="text-sm">Set up delivery preferences</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
              <span className="text-sm">Configure payment settings</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest business activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">Start by adding products to see activity here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}