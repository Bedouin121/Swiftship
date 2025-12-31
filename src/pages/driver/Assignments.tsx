import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, User, Phone, CheckCircle, XCircle, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api-client";
import type { ApiListResponse, Order, Microhub } from "@/types/api";
import { haversineDistance } from "@/utils/distance";

export default function Assignments() {
  const { toast } = useToast();
  
  const { data, isLoading } = useQuery<ApiListResponse<Order>>({
    queryKey: ["driver", "orders"],
    queryFn: () => apiRequest<ApiListResponse<Order>>("/orders", { role: "admin" }),
  });

  const orders = data?.data ?? [];
  // Filter for pending orders (available assignments)
  const availableOrders = orders.filter(order => order.status === "Pending");

  // FR-14: Accept/Reject Assignments
  const handleAccept = (orderId: string) => {
    // TODO: Implement API call to accept order
    toast({
      title: "Assignment Accepted",
      description: `You have accepted order ${orderId}. Navigate to Active Deliveries to start.`,
    });
  };

  const handleReject = (orderId: string) => {
    // TODO: Implement API call to reject order
    toast({
      title: "Assignment Rejected",
      description: `Order ${orderId} has been rejected and returned to the pool.`,
      variant: "destructive",
    });
  };

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

  const getPriorityColor = (deliveryType?: string) => {
    switch (deliveryType) {
      case "express": return "bg-orange-500";
      case "standard": return "bg-blue-500";
      default: return "bg-blue-500";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
          Available Orders
        </h1>
        <p className="text-muted-foreground mt-1">
          {availableOrders.length} new delivery assignments waiting for you
        </p>
      </div>

      {/* FR-13: View New Assignments */}
      {isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-4 animate-pulse" />
            <h3 className="text-lg font-medium">Loading orders...</h3>
          </CardContent>
        </Card>
      ) : availableOrders.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Available Orders</h3>
            <p className="text-muted-foreground text-sm">New assignments will appear here when available.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {availableOrders.map((order) => {
            const distance = calculateDistance(order);
            const deliveryCoords = order.deliveryLocation?.coordinates;
            const [deliveryLng, deliveryLat] = deliveryCoords || [0, 0];
            const pickupAddress = getDestinationMicrohubAddress(order);
            const deliveryAddress = order.specifiedAddress || order.deliveryLocation?.address || 'Unknown address';

            return (
              <Card key={order._id} className="hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: order.deliveryType === "express" ? "#f97316" : "#3b82f6" }}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{order._id}</CardTitle>
                      <Badge className={getPriorityColor(order.deliveryType)}>
                        {order.deliveryType?.toUpperCase() || "STANDARD"}
                      </Badge>
                    </div>
                    <span className="text-2xl font-bold text-emerald-500">৳{order.total.toFixed(2)}</span>
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
                    <div className="space-y-2">
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
                  
                  {/* FR-14: Accept/Reject Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button 
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                      onClick={() => handleAccept(order._id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept Order
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                      onClick={() => handleReject(order._id)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
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
