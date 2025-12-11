import { useQuery } from "@tanstack/react-query";
import { Package, Users, Truck, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/api-client";
import type { DashboardResponse } from "@/types/api";

export default function Dashboard() {
  const { data, isLoading } = useQuery<DashboardResponse>({
    queryKey: ["dashboard"],
    queryFn: () => apiRequest<DashboardResponse>("/dashboard", { role: "admin" }),
  });

  const metrics = data?.metrics;
  const activities = data?.activities ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -top-10 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="relative">
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Overview of your logistics operations</p>
        </div>
      </div>

      {isLoading ? (
        <Card className="glass-effect border-2">
          <CardContent className="py-10 text-center text-muted-foreground">Loading metrics...</CardContent>
        </Card>
      ) : metrics ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard title="Active Vendors" value={metrics.activeVendors.toString()} change="+12% from last month" icon={Users} trend="up" />
          <MetricCard title="Total Deliveries" value={metrics.totalDeliveries.toString()} change="+8% from last month" icon={Package} trend="up" />
          <MetricCard title="Active Drivers" value={metrics.activeDrivers.toString()} change="+3% from last month" icon={Truck} trend="up" />
          <MetricCard title="Microhubs" value={metrics.microhubs.toString()} change="Live count" icon={Package} trend="neutral" />
          <MetricCard
            title="Avg. Delivery Time"
            value={`${metrics.averageDeliveryTimeHours}h`}
            change="-15% improvement"
            icon={Clock}
            trend="up"
          />
          <MetricCard title="Success Rate" value={`${metrics.successRate}%`} change="+2.1% from last month" icon={CheckCircle} trend="up" />
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-effect border-2 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates from your logistics network</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading activity...</p>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">{activity.vendor}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge
                        variant={
                          activity.status === "pending"
                            ? "secondary"
                            : activity.status === "approved"
                            ? "default"
                            : activity.status === "completed"
                            ? "outline"
                            : "secondary"
                        }
                        className={activity.status === "completed" ? "bg-success text-success-foreground" : ""}
                      >
                        {activity.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <p className="text-sm text-muted-foreground">No recent activity logged.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-effect border-2 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Performance Trends
            </CardTitle>
            <CardDescription>Key metrics over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">On-time Delivery</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-success" style={{ width: "94%" }} />
                  </div>
                  <span className="text-sm font-medium text-foreground">94%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: "97%" }} />
                  </div>
                  <span className="text-sm font-medium text-foreground">97%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Fleet Utilization</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: "87%" }} />
                  </div>
                  <span className="text-sm font-medium text-foreground">87%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Vendor Retention</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-chart-3" style={{ width: "92%" }} />
                  </div>
                  <span className="text-sm font-medium text-foreground">92%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
