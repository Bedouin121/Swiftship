import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Package, MapPin, User, Phone, CheckCircle, XCircle, Navigation, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api-client";
import type { ApiListResponse, ApiItemResponse, Order, Driver } from "@/types/api";
import { haversineDistance } from "@/utils/distance";

export default function Assignments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  
  const { data: ordersData, isLoading } = useQuery<ApiListResponse<Order>>({
    queryKey: ["driver", "orders"],
    queryFn: () => apiRequest<ApiListResponse<Order>>("/orders"),
  });

  const { data: driverData } = useQuery<ApiItemResponse<Driver>>({
    queryKey: ["driver", "profile"],
    queryFn: () => apiRequest<ApiItemResponse<Driver>>("/drivers/profile"),
  });

  const orders = ordersData?.data ?? [];
  const driver = driverData?.data;
  
  // Filter orders by status
  const waitingOrders = orders.filter(order => order.status === "Waiting");
  const assignedOrders = orders.filter(order => order.status === "Pickup" || order.status === "Delivering");

  // Accept order mutation
  const acceptOrderMutation = useMutation({
    mutationFn: (orderId: string) => apiRequest(`/orders/${orderId}/accept`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver", "orders"] });
      toast({
        title: "Order Accepted",
        description: "You have successfully accepted the order. Check Active Deliveries.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Accept Order",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  });

  // Verify pickup OTP mutation
  const verifyPickupMutation = useMutation({
    mutationFn: ({ orderId, otp }: { orderId: string; otp: string }) => 
      apiRequest(`/orders/${orderId}/verify-pickup`, { 
        method: 'POST',
        body: { otp }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver", "orders"] });
      toast({
        title: "Pickup Verified",
        description: "Order has been picked up successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Invalid OTP",
        description: error.message || "Please check the OTP and try again",
        variant: "destructive",
      });
    }
  });

  // Complete delivery mutation
  const completeDeliveryMutation = useMutation({
    mutationFn: ({ orderId, otp }: { orderId: string; otp: string }) => 
      apiRequest(`/orders/${orderId}/complete`, { 
        method: 'POST',
        body: { otp }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver", "orders"] });
      toast({
        title: "Delivery Completed",
        description: "Order has been delivered successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Invalid Code",
        description: error.message || "Please enter 'abc' to complete delivery",
        variant: "destructive",
      });
    }
  });

  const handleAccept = (orderId: string) => {
    acceptOrderMutation.mutate(orderId);
  };

  const handleVerifyPickup = (orderId: string) => {
    const otp = otpInputs[orderId];
    if (!otp) {
      toast({
        title: "OTP Required",
        description: "Please enter the pickup OTP",
        variant: "destructive",
      });
      return;
    }
    verifyPickupMutation.mutate({ orderId, otp });
  };

  const handleCompleteDelivery = (orderId: string) => {
    const otp = otpInputs[orderId];
    if (!otp) {
      toast({
        title: "Code Required",
        description: "Please enter 'abc' to complete delivery",
        variant: "destructive",
      });
      return;
    }
    completeDeliveryMutation.mutate({ orderId, otp });
  };

  const handleGuideMe = (order: Order) => {
    if (order.status === "Pickup") {
      // Guide to pickup location (microhub)
      const microhubCoords = getDestinationMicrohubCoords(order);
      if (microhubCoords) {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${microhubCoords.lat},${microhubCoords.lng}`, '_blank');
      }
    } else if (order.status === "Delivering") {
      // Guide to delivery location
      const deliveryCoords = order.deliveryLocation?.coordinates;
      if (deliveryCoords) {
        const [deliveryLng, deliveryLat] = deliveryCoords;
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${deliveryLat},${deliveryLng}`, '_blank');
      }
    }
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

  const calculateDistance = (order: Order): number => {
    if (order.distance) return order.distance;
    
    const microhubCoords = getDestinationMicrohubCoords(order);
    if (!microhubCoords || !order.deliveryLocation?.coordinates) {
      return 0;
    }
    const [deliveryLng, deliveryLat] = order.deliveryLocation.coordinates;
    return haversineDistance(
      microhubCoords.lat,
      microhubCoords.lng,
      deliveryLat,
      deliveryLng
    );
  };

  const calculateProfit = (order: Order): number => {
    const distance = calculateDistance(order);
    const basePrice = 40; // Base price in taka
    const vehicleType = driver?.vehicleType?.toLowerCase();
    const ratePerKm = vehicleType === 'car' ? 18 : 12; // 18 for car, 12 for bike
    return basePrice + (distance * ratePerKm);
  };

  const calculatePayable = (order: Order): number => {
    const profit = calculateProfit(order);
    return order.total + 20 + profit; // Total + 20 taka + profit
  };

  const getPriorityColor = (deliveryType?: string) => {
    switch (deliveryType) {
      case "express": return "bg-orange-500";
      case "standard": return "bg-blue-500";
      default: return "bg-blue-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Waiting": return "bg-blue-500";
      case "Pickup": return "bg-orange-500";
      case "Delivering": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const updateOtpInput = (orderId: string, value: string) => {
    setOtpInputs(prev => ({ ...prev, [orderId]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
          Available Orders
        </h1>
        <p className="text-muted-foreground mt-1">
          {waitingOrders.length} new orders available, {assignedOrders.length} in progress
        </p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-4 animate-pulse" />
            <h3 className="text-lg font-medium">Loading orders...</h3>
          </CardContent>
        </Card>
      ) : (waitingOrders.length === 0 && assignedOrders.length === 0) ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Available Orders</h3>
            <p className="text-muted-foreground text-sm">New assignments will appear here when available.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Waiting Orders */}
          {waitingOrders.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Available for Pickup</h2>
              <div className="grid gap-4">
                {waitingOrders.map((order) => {
                  const distance = calculateDistance(order);
                  const profit = calculateProfit(order);
                  const payable = calculatePayable(order);
                  const pickupAddress = getDestinationMicrohubAddress(order);
                  const deliveryAddress = order.specifiedAddress || order.deliveryLocation?.address || 'Unknown address';

                  return (
                    <Card key={order._id} className="hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: order.deliveryType === "express" ? "#f97316" : "#3b82f6" }}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge className={getPriorityColor(order.deliveryType)}>
                              {order.deliveryType?.toUpperCase() || "STANDARD"}
                            </Badge>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Profit</div>
                            <div className="text-lg font-bold text-emerald-500">৳{profit.toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">Payable</div>
                            <div className="text-lg font-bold text-blue-500">৳{payable.toFixed(2)}</div>
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
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between p-2 rounded bg-muted/50">
                              <span className="text-sm text-muted-foreground">Items</span>
                              <span className="font-medium">{order.quantity || order.productsCount} items</span>
                            </div>
                            <div className="flex justify-between p-2 rounded bg-muted/50">
                              <span className="text-sm text-muted-foreground">Distance</span>
                              <span className="font-medium">{distance.toFixed(2)} km</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 pt-4 border-t">
                          <Button 
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                            onClick={() => handleAccept(order._id)}
                            disabled={acceptOrderMutation.isPending}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept Order
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Assigned Orders */}
          {assignedOrders.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Active Orders</h2>
              <div className="grid gap-4">
                {assignedOrders.map((order) => {
                  const distance = calculateDistance(order);
                  const profit = calculateProfit(order);
                  const payable = calculatePayable(order);
                  const pickupAddress = getDestinationMicrohubAddress(order);
                  const deliveryAddress = order.specifiedAddress || order.deliveryLocation?.address || 'Unknown address';

                  return (
                    <Card key={order._id} className="hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: order.status === "Pickup" ? "#f97316" : "#10b981" }}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge className={getPriorityColor(order.deliveryType)}>
                              {order.deliveryType?.toUpperCase() || "STANDARD"}
                            </Badge>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Profit</div>
                            <div className="text-lg font-bold text-emerald-500">৳{profit.toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">Payable</div>
                            <div className="text-lg font-bold text-blue-500">৳{payable.toFixed(2)}</div>
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
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between p-2 rounded bg-muted/50">
                              <span className="text-sm text-muted-foreground">Items</span>
                              <span className="font-medium">{order.quantity || order.productsCount} items</span>
                            </div>
                            <div className="flex justify-between p-2 rounded bg-muted/50">
                              <span className="text-sm text-muted-foreground">Distance</span>
                              <span className="font-medium">{distance.toFixed(2)} km</span>
                            </div>
                            {order.status === "Pickup" && (
                              <div className="flex justify-between p-2 rounded bg-blue-50 border border-blue-200">
                                <span className="text-sm text-blue-700">Status</span>
                                <span className="font-medium text-blue-700">Ready for Pickup</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-3 pt-4 border-t">
                          <Button 
                            className="w-full"
                            onClick={() => handleGuideMe(order)}
                          >
                            <Navigation className="w-4 h-4 mr-2" />
                            Guide Me to {order.status === "Pickup" ? "Pickup" : "Delivery"} Location
                          </Button>
                          
                          {order.status === "Pickup" && (
                            <div className="flex gap-2">
                              <Input
                                placeholder="Enter pickup OTP"
                                value={otpInputs[order._id] || ''}
                                onChange={(e) => updateOtpInput(order._id, e.target.value)}
                                className="flex-1"
                              />
                              <Button 
                                onClick={() => handleVerifyPickup(order._id)}
                                disabled={verifyPickupMutation.isPending}
                              >
                                <Key className="w-4 h-4 mr-2" />
                                Verify Pickup
                              </Button>
                            </div>
                          )}
                          
                          {order.status === "Delivering" && (
                            <div className="flex gap-2">
                              <Input
                                placeholder="Enter 'abc' to complete"
                                value={otpInputs[order._id] || ''}
                                onChange={(e) => updateOtpInput(order._id, e.target.value)}
                                className="flex-1"
                              />
                              <Button 
                                onClick={() => handleCompleteDelivery(order._id)}
                                disabled={completeDeliveryMutation.isPending}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Complete
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
