import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Package, Truck, CheckCircle, Clock, MapPin, TrendingUp } from "lucide-react";

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(false);

  const stats = [
    { title: "Today's Deliveries", value: "12", icon: Package, color: "text-blue-500" },
    { title: "In Progress", value: "2", icon: Truck, color: "text-orange-500" },
    { title: "Completed", value: "10", icon: CheckCircle, color: "text-green-500" },
    { title: "Avg. Delivery Time", value: "28 min", icon: Clock, color: "text-purple-500" },
  ];

  const recentDeliveries = [
    { id: "DEL-001", customer: "John Doe", address: "123 Main St, Dhaka", status: "Delivered", time: "10:30 AM" },
    { id: "DEL-002", customer: "Jane Smith", address: "456 Oak Ave, Dhaka", status: "In Transit", time: "11:15 AM" },
    { id: "DEL-003", customer: "Bob Wilson", address: "789 Pine Rd, Dhaka", status: "Picked Up", time: "11:45 AM" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Driver Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your delivery overview.</p>
        </div>
        
        {/* FR-12: Driver Availability Status */}
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium">Availability Status</span>
                <span className={`text-xs ${isOnline ? "text-green-500" : "text-gray-500"}`}>
                  {isOnline ? "You're Online" : "You're Offline"}
                </span>
              </div>
              <Switch
                checked={isOnline}
                onCheckedChange={setIsOnline}
                className="data-[state=checked]:bg-green-500"
              />
              <Badge variant={isOnline ? "default" : "secondary"} className={isOnline ? "bg-green-500" : ""}>
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Deliveries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-500" />
              Recent Deliveries
            </CardTitle>
            <CardDescription>Your latest delivery activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDeliveries.map((delivery) => (
                <div key={delivery.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{delivery.id}</span>
                      <Badge variant={
                        delivery.status === "Delivered" ? "default" :
                        delivery.status === "In Transit" ? "secondary" : "outline"
                      } className={
                        delivery.status === "Delivered" ? "bg-green-500" :
                        delivery.status === "In Transit" ? "bg-orange-500" : ""
                      }>
                        {delivery.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{delivery.customer}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {delivery.address}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">{delivery.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Today's Performance
            </CardTitle>
            <CardDescription>Your delivery metrics for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-sm">On-Time Delivery Rate</span>
                <span className="font-bold text-green-500">95%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-sm">Customer Rating</span>
                <span className="font-bold text-yellow-500">4.8 ⭐</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-sm">Distance Covered</span>
                <span className="font-bold">45.2 km</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-sm">Earnings Today</span>
                <span className="font-bold text-emerald-500">৳1,250</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
