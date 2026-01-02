import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/api-client";
import type { FleetMetrics } from "@/types/api";

export default function Fleet() {
  const { data, isLoading } = useQuery<FleetMetrics>({
    queryKey: ["fleet", "metrics"],
    queryFn: () => apiRequest<FleetMetrics>("/fleet/metrics"),
  });

  const performanceMetrics = data?.topPerformers ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Fleet Performance</h1>
        <p className="text-muted-foreground mt-1">Monitor driver performance and delivery metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Deliveries</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{data?.totalDeliveries ?? 0}</div>
            <p className="text-xs text-success mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">On-Time Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{data ? `${data.onTimeRate}%` : "0%"}</div>
            <p className="text-xs text-success mt-1">+2% improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Delivery Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{data ? `${data.averageDeliveryTime}h` : "0h"}</div>
            <p className="text-xs text-success mt-1">-15min faster</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Issues Reported</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{data?.issuesReported ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">This week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performers This Month</CardTitle>
          <CardDescription>Driver performance metrics and ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading fleet metrics...</p>
            ) : (
              performanceMetrics.map((metric) => {
                const efficiency = metric.deliveries === 0 ? 0 : Math.round((metric.deliveries / (metric.deliveries + 5)) * 100);
                return (
                  <div key={metric._id} className="space-y-3 pb-6 border-b border-border last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">{metric.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {metric.deliveries} deliveries • Rating {metric.rating.toFixed(1)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground">{metric.rating.toFixed(1)}</div>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">On-time Delivery</span>
                        <span className="font-medium text-foreground">{efficiency}%</span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div className={`h-full ${efficiency >= 95 ? "bg-success" : "bg-primary"}`} style={{ width: `${efficiency}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
