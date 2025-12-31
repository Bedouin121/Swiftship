import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Package, Truck, CheckCircle, Clock, Plus } from "lucide-react";
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
  const [selectedMicrohub, setSelectedMicrohub] = useState<Microhub | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    coords: { lng: number; lat: number } | null;
    address: string;
  }>({ coords: null, address: "" });

  const BARIKOI_API_KEY = import.meta.env.VITE_BARIKOI_API_KEY;

  const { data, isLoading } = useQuery<ApiListResponse<Order>>({
    queryKey: ["vendor", "orders"],
    queryFn: () => apiRequest<ApiListResponse<Order>>("/orders", { role: "vendor" }),
  });

  const { data: microhubsData } = useQuery<ApiListResponse<Microhub>>({
    queryKey: ["microhubs"],
    queryFn: () => apiRequest<ApiListResponse<Microhub>>("/microhubs", { role: "admin" }),
  });

  const { data: productsData } = useQuery<ApiListResponse<Product>>({
    queryKey: ["vendor", "products"],
    queryFn: () => apiRequest<ApiListResponse<Product>>("/products", { role: "vendor" }),
  });

  const orders = data?.data ?? [];
  const microhubs = microhubsData?.data ?? [];
  const products = productsData?.data ?? [];

  const createOrderMutation = useMutation({
    mutationFn: (payload: any) =>
      apiRequest<ApiItemResponse<Order>>("/orders", {
        method: "POST",
        body: payload,
        role: "vendor",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor", "orders"] });
      setAddOrderDialogOpen(false);
      setSelectedMicrohub(null);
      setSelectedLocation({ coords: null, address: "" });
      toast({ title: "Order created successfully" });
    },
  });

  const handleLocationSelect = (coords: { lng: number; lat: number }, location: string) => {
    setSelectedLocation({ coords, address: location });
  };

  const handleSubmitOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!selectedMicrohub || !selectedLocation.coords) {
      toast({ title: "Please select a microhub and delivery location", variant: "destructive" });
      return;
    }

    const payload = {
      microhubId: selectedMicrohub._id,
      productId: formData.get("productId") as string,
      quantity: parseInt(formData.get("quantity") as string),
      deliveryType: formData.get("deliveryType") as string,
      customerName: formData.get("customerName") as string,
      deliveryLocation: {
        coordinates: [selectedLocation.coords.lng, selectedLocation.coords.lat],
        address: selectedLocation.address,
      },
    };

    createOrderMutation.mutate(payload);
  };

  const handleMicrohubSelect = (microhubId: string) => {
    const microhub = microhubs.find(m => m._id === microhubId);
    setSelectedMicrohub(microhub || null);
    setSelectedLocation({ coords: null, address: "" });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered": return <CheckCircle className="w-4 h-4 text-success" />;
      case "In Transit": return <Truck className="w-4 h-4 text-primary" />;
      case "Processing": return <Package className="w-4 h-4 text-warning" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Delivered": return "default";
      case "In Transit": return "default";
      case "Processing": return "secondary";
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
            <CardTitle>Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-muted-foreground">
              {orders.filter((o) => o.status === "Pending").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {orders.filter((o) => o.status === "In Transit").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">
              {orders.filter((o) => o.status === "Delivered").length}
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
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
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
                <Label htmlFor="customerName">Customer Name</Label>
                <Input id="customerName" name="customerName" required />
              </div>

              {/* Microhub Selection */}
              <div>
                <Label htmlFor="microhub">Select Microhub</Label>
                <Select onValueChange={handleMicrohubSelect} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a microhub" />
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

              {/* Map with 5km radius */}
              {selectedMicrohub && selectedMicrohub.latitude && selectedMicrohub.longitude && (
                <div>
                  <Label>Delivery Location (within 5km radius)</Label>
                  <div className="mt-2">
                    <BarikoiMapWithRadius
                      onLocationSelect={handleLocationSelect}
                      apiKey={BARIKOI_API_KEY}
                      centerCoords={[selectedMicrohub.longitude, selectedMicrohub.latitude]}
                      radiusKm={5}
                      initialZoom={13}
                      height="400px"
                    />
                    <div className="mt-2 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Selected Microhub: {selectedMicrohub.name}</p>
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
