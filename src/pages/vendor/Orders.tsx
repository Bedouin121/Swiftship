import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Package, Truck, CheckCircle, Clock, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api-client";
import type { ApiListResponse, Order, Microhub, Product, ApiItemResponse } from "@/types/api";
import BarikoiMapWithRadius from "@/components/BarikoiMapWithRadius";

export default function Orders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [addOrderDialogOpen, setAddOrderDialogOpen] = useState(false);
  const [selectedSourceMicrohub, setSelectedSourceMicrohub] = useState<Microhub | null>(null);
  const [selectedDestinationMicrohub, setSelectedDestinationMicrohub] = useState<Microhub | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    coords: { lng: number; lat: number } | null;
    address: string;
    addressDetails?: { address?: string; thana?: string; district?: string };
  }>({ coords: null, address: "" });
  const [phoneNumber, setPhoneNumber] = useState("+880");

  const BARIKOI_API_KEY = import.meta.env.VITE_BARIKOI_API_KEY;

  const { data, isLoading } = useQuery<ApiListResponse<Order>>({
    queryKey: ["vendor", "orders"],
    queryFn: () => apiRequest<ApiListResponse<Order>>("/orders"),
  });

  const { data: microhubsData } = useQuery<ApiListResponse<Microhub>>({
    queryKey: ["microhubs"],
    queryFn: () => apiRequest<ApiListResponse<Microhub>>("/microhubs"),
  });

  const { data: productsData } = useQuery<ApiListResponse<Product>>({
    queryKey: ["vendor", "products"],
    queryFn: () => apiRequest<ApiListResponse<Product>>("/products"),
  });

  const orders = data?.data ?? [];
  const microhubs = microhubsData?.data ?? [];
  const products = productsData?.data ?? [];

  const createOrderMutation = useMutation({
    mutationFn: (payload: any) =>
      apiRequest<ApiItemResponse<Order>>("/orders", {
        method: "POST",
        body: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", "orders"] });
      setAddOrderDialogOpen(false);
      setSelectedSourceMicrohub(null);
      setSelectedDestinationMicrohub(null);
      setSelectedLocation({ coords: null, address: "" });
      setPhoneNumber("+880");
      toast({ title: "Order created successfully" });
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (orderId: string) =>
      apiRequest("/orders/" + orderId, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", "orders"] });
      toast({ title: "Order deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to delete order", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      deleteOrderMutation.mutate(orderId);
    }
  };

  const handleLocationSelect = (
    coords: { lng: number; lat: number }, 
    location: string,
    addressDetails?: { address?: string; thana?: string; district?: string }
  ) => {
    setSelectedLocation({ coords, address: location, addressDetails });
  };

  const handleSubmitOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!selectedSourceMicrohub || !selectedDestinationMicrohub || !selectedLocation.coords) {
      toast({ title: "Please select source microhub, destination microhub, and delivery location", variant: "destructive" });
      return;
    }

    if (phoneNumber.length !== 14) {
      toast({ title: "Please enter a valid phone number (10 digits after +880)", variant: "destructive" });
      return;
    }

    const payload: any = {
      sourceMicrohubId: selectedSourceMicrohub._id,
      destinationMicrohubId: selectedDestinationMicrohub._id,
      productId: formData.get("productId") as string,
      quantity: parseInt(formData.get("quantity") as string),
      deliveryType: formData.get("deliveryType") as string,
      customerName: formData.get("customerName") as string,
      phoneNumber: phoneNumber,
      specifiedAddress: formData.get("specifiedAddress") as string,
      deliveryLocation: {
        coordinates: [selectedLocation.coords.lng, selectedLocation.coords.lat],
        address: selectedLocation.address,
      },
    };

    // Add address details if available
    if (selectedLocation.addressDetails) {
      payload.deliveryLocation.addressDetails = selectedLocation.addressDetails;
    }

    createOrderMutation.mutate(payload);
  };

  const handleSourceMicrohubSelect = (microhubId: string) => {
    const microhub = microhubs.find(m => m._id === microhubId);
    setSelectedSourceMicrohub(microhub || null);
  };

  const handleDestinationMicrohubSelect = (microhubId: string) => {
    const microhub = microhubs.find(m => m._id === microhubId);
    setSelectedDestinationMicrohub(microhub || null);
    setSelectedLocation({ coords: null, address: "" });
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ensure +880 prefix is always present and can't be deleted
    if (value.startsWith("+880")) {
      // Only allow digits after +880, max 10 digits
      const digits = value.slice(4).replace(/\D/g, "").slice(0, 10);
      setPhoneNumber("+880" + digits);
    } else if (value === "") {
      setPhoneNumber("+880");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed": return <CheckCircle className="w-4 h-4 text-success" />;
      case "Pickup": 
      case "Delivering": return <Truck className="w-4 h-4 text-primary" />;
      case "Waiting": return <Package className="w-4 h-4 text-warning" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed": return "default";
      case "Pickup":
      case "Delivering": return "default";
      case "Waiting": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground">Track and manage your order deliveries</p>
        </div>
        <Button onClick={() => setAddOrderDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Order
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{orders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Waiting</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-muted-foreground">
              {orders.filter((o) => o.status === "Waiting").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {orders.filter((o) => o.status === "Pickup" || o.status === "Delivering").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">
              {orders.filter((o) => o.status === "Completed").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>View and track all your orders</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading orders...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pickup OTP</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{order._id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.productsCount}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>{order.placedAt ? new Date(order.placedAt).toLocaleString() : "-"}</TableCell>
                    <TableCell>{order.eta}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {(order as any).pickupOtp ? (
                        <div className="bg-blue-50 border border-blue-200 rounded px-2 py-1 text-center">
                          <span className="font-mono font-bold text-blue-800">
                            {(order as any).pickupOtp}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteOrder(order._id)}
                          disabled={deleteOrderMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={addOrderDialogOpen} onOpenChange={setAddOrderDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Order</DialogTitle>
            <DialogDescription>Create a new order with delivery location</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitOrder}>
            <div className="space-y-6">
              {/* Customer Name */}
              <div>
                <Label htmlFor="customerName">Name</Label>
                <Input id="customerName" name="customerName" required />
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input 
                  id="phoneNumber" 
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  required
                  placeholder="+8801234567890"
                />
                <p className="text-xs text-muted-foreground mt-1">Bangladeshi phone number (+880 followed by 10 digits)</p>
              </div>

              {/* Source Microhub Selection */}
              <div>
                <Label htmlFor="sourceMicrohub">Select Source Microhub</Label>
                <Select onValueChange={handleSourceMicrohubSelect} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a source microhub" />
                  </SelectTrigger>
                  <SelectContent>
                    {microhubs.map((microhub) => (
                      <SelectItem key={microhub._id} value={microhub._id}>
                        {microhub.name} - {microhub.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Destination Microhub Selection */}
              <div>
                <Label htmlFor="destinationMicrohub">Select Destination Microhub</Label>
                <Select onValueChange={handleDestinationMicrohubSelect} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a destination microhub" />
                  </SelectTrigger>
                  <SelectContent>
                    {microhubs.map((microhub) => (
                      <SelectItem key={microhub._id} value={microhub._id}>
                        {microhub.name} - {microhub.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Map with 5km radius - Only shown when destination microhub is selected */}
              {selectedDestinationMicrohub && selectedDestinationMicrohub.latitude && selectedDestinationMicrohub.longitude && (
                <div>
                  <Label>Delivery Location (within 5km radius)</Label>
                  <div className="mt-2">
                    <BarikoiMapWithRadius
                      onLocationSelect={handleLocationSelect}
                      apiKey={BARIKOI_API_KEY}
                      centerCoords={[selectedDestinationMicrohub.longitude, selectedDestinationMicrohub.latitude]}
                      radiusKm={5}
                      initialZoom={13}
                      height="400px"
                    />
                    <div className="mt-2 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Selected Destination Microhub: {selectedDestinationMicrohub.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Click on the map within the 5km radius to select delivery location
                      </p>
                      {selectedLocation.address && (
                        <p className="text-sm text-success mt-1">
                          Selected: {selectedLocation.address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Specified Address */}
              <div>
                <Label htmlFor="specifiedAddress">Specify Address</Label>
                <Input 
                  id="specifiedAddress" 
                  name="specifiedAddress" 
                  required
                  placeholder="Enter specific address details"
                />
              </div>

              {/* Product Selection */}
              <div>
                <Label htmlFor="productId">Select Product</Label>
                <Select name="productId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product._id} value={product._id}>
                        {product.name} - ${product.price} (Stock: {product.stock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input 
                  id="quantity" 
                  name="quantity" 
                  type="number" 
                  min="1" 
                  required 
                />
              </div>

              {/* Delivery Type */}
              <div>
                <Label htmlFor="deliveryType">Delivery Type</Label>
                <Select name="deliveryType" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select delivery type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Delivery (3-5 hours)</SelectItem>
                    <SelectItem value="express">Express Delivery (1-2 hours)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setAddOrderDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createOrderMutation.isPending}>
                {createOrderMutation.isPending ? "Creating..." : "Create Order"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
