import { MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DeliveryRange() {
  const deliveryZones = [
    { name: "Dhaka Central", coverage: "5 km", deliveryTime: "2-3 hours", active: true },
    { name: "Dhaka North", coverage: "8 km", deliveryTime: "3-4 hours", active: true },
    { name: "Dhaka South", coverage: "7 km", deliveryTime: "3-4 hours", active: true },
    { name: "Chittagong", coverage: "6 km", deliveryTime: "4-5 hours", active: true },
    { name: "Sylhet", coverage: "4 km", deliveryTime: "2-3 hours", active: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Delivery Range</h1>
        <p className="text-muted-foreground">View your delivery coverage and estimated times</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {deliveryZones.filter(z => z.active).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">30 km</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg Delivery Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">3.2 hours</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interactive Delivery Map</CardTitle>
          <CardDescription>Visual representation of your delivery coverage zones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Interactive map visualization would be rendered here</p>
              <p className="text-sm text-muted-foreground mt-2">Using Mapbox or Google Maps API</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Zones</CardTitle>
          <CardDescription>Coverage details for each zone</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {deliveryZones.map((zone, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{zone.name}</CardTitle>
                    <Badge variant={zone.active ? "default" : "secondary"}>
                      {zone.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Coverage Radius:</span>
                      <span className="text-sm font-medium">{zone.coverage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Est. Delivery Time:</span>
                      <span className="text-sm font-medium">{zone.deliveryTime}</span>
                    </div>
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
