import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, MapPin, User, Phone, Navigation, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api-client";
import type { ApiListResponse, Order } from "@/types/api";
import { haversineDistance } from "@/utils/distance";

type DeliveryStatus = "assigned" | "picked_up" | "in_transit" | "arrived";

export default function ActiveDeliveries() {
  const { toast } = useToast();
  
  const { data, isLoading } = useQuery<ApiListResponse<Order>>({
    queryKey: ["driver", "orders"],
    queryFn: () => apiRequest<ApiListResponse<Order>>("/orders", { role: "admin" }),
  });

  const orders = data?.data ?? [];
  // Filter for active deliveries (not pending, not delivered)
  const activeDeliveries = orders.filter(
    order => order.status !== "Pending" && order.status !== "Delivered"
  );

  const handleGuideMe = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  const getDestinationMicrohubAddress = (order: Order): string => {
    const destinationMicrohub = order.destinationMicrohubId;
    if (typeof destinationMicrohub === 'object' && destinationMicrohub !== null) {
      return destinationMicrohub.location || destinationMicrohub.name || 'Unknown location';
    }
    return 'Unknown location';
  };

  const getDestinationMicrohubCoords = (order: Order): { lat: number; lng: number } | null => {
    const destinationMicrohub = order.destinationMicrohubId;
    if (typeof destinationMicrohub === 'object' && destinationMicrohub !== null) {
      if (destinationMicrohub.latitude && destinationMicrohub.longitude) {
        return { lat: destinationMicrohub.latitude, lng: destinationMicrohub.longitude };
      }
    }
    return null;
  };

  const calculateDistance = (order: Order): number | null => {
    const microhubCoords = getDestinationMicrohubCoords(order);
    if (!microhubCoords || !order.deliveryLocation?.coordinates) {
      return null;
    }
    // deliveryLocation.coordinates is [longitude, latitude]
    const [deliveryLng, deliveryLat] = order.deliveryLocation.coordinates;
    return haversineDistance(
      microhubCoords.lat,
      microhubCoords.lng,
      deliveryLat,
      deliveryLng
    );
  };

  // FR-15: Delivery Workflow Status Updates
  const handleStatusChange = (orderId: string, newStatus: DeliveryStatus) => {
    // TODO: Implement API call to update order status
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

  const mapOrderStatusToDeliveryStatus = (status: string): DeliveryStatus => {
    switch (status) {
      case "Processing": return "assigned";
      case "In Transit": return "in_transit";
      default: return "assigned";
    }
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
          {activeDeliveries.length} active deliveries in progress
        </p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-4 animate-pulse" />
            <h3 className="text-lg font-medium">Loading orders...</h3>
          </CardContent>
        </Card>
      ) : activeDeliveries.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Active Deliveries</h3>
            <p className="text-muted-foreground text-sm">Accept orders from Available Orders to start delivering.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {activeDeliveries.map((order) => {
            const deliveryStatus = mapOrderStatusToDeliveryStatus(order.status);
            const distance = calculateDistance(order);
            const deliveryCoords = order.deliveryLocation?.coordinates;
            const [deliveryLng, deliveryLat] = deliveryCoords || [0, 0];
            const pickupAddress = getDestinationMicrohubAddress(order);
            const deliveryAddress = order.specifiedAddress || order.deliveryLocation?.address || 'Unknown address';

            return (
              <Card key={order._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{order._id}</CardTitle>
                      <Badge className={getStatusColor(deliveryStatus)}>
                        {getStatusLabel(deliveryStatus)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {order.placedAt ? new Date(order.placedAt).toLocaleTimeString() : 'N/A'}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <User className="w-4 h-4 mt-1 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {order.phoneNumber || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Package className="w-4 h-4 mt-1 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">Pickup Location</p>
                          <p className="text-sm text-muted-foreground">{pickupAddress}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-1 text-red-500" />
                        <div>
                          <p className="text-sm font-medium">Delivery Location</p>
                          <p className="text-sm text-muted-foreground">{deliveryAddress}</p>
                        </div>
                      </div>
                      {deliveryCoords && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => handleGuideMe(deliveryLat, deliveryLng)}
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Guide Me
                        </Button>
                      )}
                    </div>
                    
                    {/* FR-15: Status Update Controls */}
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm font-medium mb-2">Update Status</p>
                        <Select 
                          value={deliveryStatus} 
                          onValueChange={(value) => handleStatusChange(order._id, value as DeliveryStatus)}
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
                        <span className="font-medium">{order.quantity || order.productsCount} items</span>
                      </div>
                      <div className="flex justify-between p-2 rounded bg-muted/50">
                        <span className="text-sm text-muted-foreground">Distance</span>
                        <span className="font-medium">
                          {distance !== null ? `${distance.toFixed(2)} km` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4 border-t">
                    {getNextStatus(deliveryStatus) && (
                      <Button 
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                        onClick={() => handleStatusChange(order._id, getNextStatus(deliveryStatus)!)}
                      >
                        {getNextStatusLabel(deliveryStatus)}
                      </Button>
                    )}
                    {deliveryStatus === "arrived" && (
                      <Button 
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                        onClick={() => window.location.href = "/driver/confirmation"}
                      >
                        Complete Delivery
                      </Button>
                    )}
                    {deliveryCoords && (
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={() => handleGuideMe(deliveryLat, deliveryLng)}
                      >
                        <Navigation className="w-4 h-4" />
                        Navigate
                      </Button>
                    )}
                    <Button variant="outline">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
