import { Package, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function StorageOptimization() {
  const zones = [
    { name: "Zone A", capacity: 100, used: 85, efficiency: 92, priority: "High Turnover" },
    { name: "Zone B", capacity: 150, used: 120, efficiency: 88, priority: "Medium Turnover" },
    { name: "Zone C", capacity: 80, used: 45, efficiency: 65, priority: "Low Turnover" },
    { name: "Zone D", capacity: 120, used: 98, efficiency: 85, priority: "High Turnover" },
  ];

  const suggestions = [
    { title: "Relocate Low-Turnover Items", description: "Move items from Zone A to Zone C to optimize high-demand area", impact: "High", savings: "15% space" },
    { title: "Consolidate Zone B", description: "Merge similar products in Zone B to reduce picking time", impact: "Medium", savings: "20 mins/day" },
    { title: "Expand Zone D", description: "High demand in Zone D - consider expanding capacity", impact: "High", savings: "10% faster picking" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Storage Optimization</h1>
        <p className="text-muted-foreground">AI-powered storage layout and capacity management</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">450</p>
            <p className="text-sm text-muted-foreground mt-1">storage units</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">348</p>
            <p className="text-sm text-success mt-1">77% utilized</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">82%</p>
            <p className="text-sm text-success mt-1">+5% this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Optimization Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">A-</p>
            <p className="text-sm text-muted-foreground mt-1">Excellent</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zone Performance</CardTitle>
          <CardDescription>Capacity utilization and efficiency by zone</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {zones.map((zone, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{zone.name}</p>
                      <p className="text-sm text-muted-foreground">{zone.priority}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{zone.used} / {zone.capacity} units</p>
                    <p className="text-sm text-muted-foreground">{zone.efficiency}% efficient</p>
                  </div>
                </div>
                <Progress value={(zone.used / zone.capacity) * 100} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-warning" />
              Optimization Suggestions
            </div>
          </CardTitle>
          <CardDescription>AI-generated recommendations to improve storage efficiency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{suggestion.title}</CardTitle>
                      <CardDescription>{suggestion.description}</CardDescription>
                    </div>
                    <Badge variant={suggestion.impact === "High" ? "default" : "secondary"}>
                      {suggestion.impact} Impact
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span className="text-sm text-muted-foreground">Potential savings: {suggestion.savings}</span>
                    </div>
                    <Button size="sm">Apply Suggestion</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
