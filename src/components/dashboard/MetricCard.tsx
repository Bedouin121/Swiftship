import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
}

export function MetricCard({ title, value, change, icon: Icon, trend = "neutral" }: MetricCardProps) {
  const trendColors = {
    up: "text-success",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  };

  const gradientBg = {
    up: "from-success/10 to-success/5",
    down: "from-destructive/10 to-destructive/5",
    neutral: "from-primary/10 to-primary/5",
  };

  return (
    <Card className="glass-effect border-2 card-hover overflow-hidden relative group">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientBg[trend]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {value}
        </div>
        {change && (
          <p className={`text-xs ${trendColors[trend]} mt-2 font-medium`}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
