import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Truck, 
  Phone, 
  LogOut,
  Package,
  MapPin,
  DollarSign,
  Clock,
  User,
  ShoppingBag,
  Lock
} from "lucide-react";

interface Order {
  _id: string;
  customerName: string;
  customerPhone: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
  deliveryType: string;
  deliveryAddress: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  deliveryOtp?: string;
}

const CustomerDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customerPhone, setCustomerPhone] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const phone = localStorage.getItem("customerPhone");
    const userRole = localStorage.getItem("userRole");
    
    if (!phone || userRole !== "customer") {
      navigate("/customer-login");
      return;
    }
    
    setCustomerPhone(phone);
    fetchOrders(phone);
  }, [navigate]);

  const fetchOrders = async (phone: string) => {
    try {
      setIsLoading(true);
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api"}/orders/customer/${encodeURIComponent(phone)}`;
      
      const response = await fetch(apiUrl);
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.data || []);
      } else {
        console.error("Failed to fetch orders:", response.status);
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("customerPhone");
    localStorage.removeItem("userRole");
    navigate("/customer-login");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "preparing":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "ready":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "picked_up":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 gradient-primary rounded-xl text-white">
                <Truck className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-foreground">SwiftShift</span>
              <Badge variant="secondary" className="ml-2">Customer</Badge>
            </div>

            {/* User info and logout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span className="font-medium">{customerPhone}</span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Orders</h1>
          <p className="text-muted-foreground">
            Track and view all your order history
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <span className="text-muted-foreground">Loading your orders...</span>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Orders Found</h3>
              <p className="text-muted-foreground">
                No orders found for this phone number. Orders will appear here once you place them.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <Card key={order._id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-foreground">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Customer</p>
                        <p className="font-medium text-foreground">{order.customerName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium text-foreground">{order.customerPhone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Items Ordered</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-1">
                          <span className="text-foreground">{item.name}</span>
                          <span className="text-muted-foreground">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Truck className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Delivery Type</p>
                        <p className="font-medium text-foreground capitalize">{order.deliveryType}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <MapPin className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Delivery Address</p>
                        <p className="font-medium text-foreground">{order.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery OTP for active orders */}
                  {(order.status === 'pickup' || order.status === 'delivering') && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1 bg-yellow-100 rounded">
                          <Lock className="w-4 h-4 text-yellow-600" />
                        </div>
                        <span className="font-semibold text-yellow-800">Delivery OTP</span>
                      </div>
                      <p className="text-sm text-yellow-700 mb-2">
                        Share this OTP with the delivery driver when they arrive:
                      </p>
                      <div className="bg-white rounded border border-yellow-300 p-3 text-center">
                        <span className="text-2xl font-bold text-yellow-800 tracking-wider">
                          {(order as any).deliveryOtp || 'Loading...'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Total Price */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="text-lg font-semibold text-foreground">Total Price</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      ৳{order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;