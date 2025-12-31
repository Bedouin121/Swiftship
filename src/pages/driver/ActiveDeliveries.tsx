import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, MapPin, User, Phone, Navigation, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type DeliveryStatus = "assigned" | "picked_up" | "in_transit" | "arrived";

interface ActiveDelivery {
  id: string;
  orderId: string;
  customer: string;
  phone: string;
  pickupAddress: string;
  deliveryAddress: string;
  items: number;
  status: DeliveryStatus;
  acceptedAt: string;
}

export default function ActiveDeliveries() {
  const { toast } = useToast();
  const [deliveries, setDeliveries] = useState<ActiveDelivery[]>([
    {
      id: "DEL-001",
      orderId: "ORD-2024-004",
      customer: "Rahim Khan",
      phone: "+880 1712-111222",
      pickupAddress: "Microhub Gulshan, Road 45, Dhaka",
      deliveryAddress: "House 25, Road 10, Banani, Dhaka",
      items: 2,
      status: "picked_up",
      acceptedAt: "10:30 AM",
    },
    {
      id: "DEL-002",
      orderId: "ORD-2024-005",
      customer: "Salma Akter",
      phone: "+880 1812-333444",
      pickupAddress: "Microhub Dhanmondi, Road 27, Dhaka",
      deliveryAddress: "Flat 3A, Rose Tower, Mohammadpur, Dhaka",
      items: 4,
      status: "assigned",
      acceptedAt: "11:15 AM",
    },
  ]);

  // FR-15: Delivery Workflow Status Updates
  const handleStatusChange = (deliveryId: string, newStatus: DeliveryStatus) => {
    setDeliveries(prev => 
      prev.map(d => d.id === deliveryId ? { ...d, status: newStatus } : d)
    );
    
    const statusMessages: Record<DeliveryStatus, string> = {
      assigned: "Order assigned",
      picked_up: "Order picked up from microhub",
      in_transit: "Order is now in transit",
      arrived: "Arrived at delivery location",
    };
    
    toast({
      title: "Status Updated",
      description: statusMessages[newStatus],
    });
  };

  const getStatusColor = (status: DeliveryStatus) => {
    switch (status) {
      case "assigned": return "bg-blue-500";
      case "picked_up": return "bg-yellow-500";
      case "in_transit": return "bg-orange-500";
      case "arrived": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: DeliveryStatus) => {
    switch (status) {
      case "assigned": return "Assigned";
      case "picked_up": return "Picked Up";
      case "in_transit": return "In Transit";
      case "arrived": return "Arrived";
      default: return status;
    }
  };

  const getNextStatus = (currentStatus: DeliveryStatus): DeliveryStatus | null => {
    const flow: DeliveryStatus[] = ["assigned", "picked_up", "in_transit", "arrived"];
    const currentIndex = flow.indexOf(currentStatus);
    return currentIndex < flow.length - 1 ? flow[currentIndex + 1] : null;
  };

  const getNextStatusLabel = (currentStatus: DeliveryStatus): string => {
    switch (currentStatus) {
      case "assigned": return "Mark as Picked Up";
      case "picked_up": return "Start Transit";
      case "in_transit": return "Mark as Arrived";
      default: return "Complete Delivery";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
          Active Deliveries
        </h1>
        <p className="text-muted-foreground mt-1">
          {deliveries.length} active deliveries in progress
        </p>
      </div>

      {deliveries.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Active Deliveries</h3>
            <p className="text-muted-foreground text-sm">Accept orders from Available Orders to start delivering.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {deliveries.map((delivery) => (
            <Card key={delivery.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{delivery.orderId}</CardTitle>
                    <Badge className={getStatusColor(delivery.status)}>
                      {getStatusLabel(delivery.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    Accepted at {delivery.acceptedAt}
                  </div>
                </div>
                <CardDescription>Delivery ID: {delivery.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{delivery.customer}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {delivery.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Package className="w-4 h-4 mt-1 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">Pickup Location</p>
                        <p className="text-sm text-muted-foreground">{delivery.pickupAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-1 text-red-500" />
                      <div>
                        <p className="text-sm font-medium">Delivery Location</p>
                        <p className="text-sm text-muted-foreground">{delivery.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* FR-15: Status Update Controls */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm font-medium mb-2">Update Status</p>
                      <Select 
                        value={delivery.status} 
                        onValueChange={(value) => handleStatusChange(delivery.id, value as DeliveryStatus)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="assigned">Assigned</SelectItem>
                          <SelectItem value="picked_up">Picked Up</SelectItem>
                          <SelectItem value="in_transit">In Transit</SelectItem>
                          <SelectItem value="arrived">Arrived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-between p-2 rounded bg-muted/50">
                      <span className="text-sm text-muted-foreground">Items</span>
                      <span className="font-medium">{delivery.items} items</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4 border-t">
                  {getNextStatus(delivery.status) && (
                    <Button 
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                      onClick={() => handleStatusChange(delivery.id, getNextStatus(delivery.status)!)}
                    >
                      {getNextStatusLabel(delivery.status)}
                    </Button>
                  )}
                  {delivery.status === "arrived" && (
                    <Button 
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                      onClick={() => window.location.href = "/driver/confirmation"}
                    >
                      Complete Delivery
                    </Button>
                  )}
                  <Button variant="outline" className="flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    Navigate
                  </Button>
                  <Button variant="outline">
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
