import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Package, MapPin, User, Clock, CheckCircle, Search, ShieldCheck } from "lucide-react";

interface CompletedDelivery {
  id: string;
  orderId: string;
  customer: string;
  address: string;
  items: number;
  completedAt: string;
  earnings: string;
}

export default function CompletedDeliveries() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const [completedDeliveries] = useState<CompletedDelivery[]>([
    {
      id: "DEL-001",
      orderId: "ORD-2024-001",
      customer: "Ahmed Rahman",
      address: "House 12, Road 8, Banani, Dhaka",
      items: 3,
      completedAt: "Today, 10:45 AM",
      earnings: "৳150",
    },
    {
      id: "DEL-002",
      orderId: "ORD-2024-002",
      customer: "Fatima Begum",
      address: "Flat 5B, Green Tower, Mirpur, Dhaka",
      items: 1,
      completedAt: "Today, 11:30 AM",
      earnings: "৳200",
    },
    {
      id: "DEL-003",
      orderId: "ORD-2024-003",
      customer: "Karim Uddin",
      address: "House 45, Road 12, Uttara, Dhaka",
      items: 5,
      completedAt: "Today, 12:15 PM",
      earnings: "৳100",
    },
    {
      id: "DEL-004",
      orderId: "ORD-2024-004",
      customer: "Nasreen Akter",
      address: "Flat 2A, Rose Garden, Dhanmondi, Dhaka",
      items: 2,
      completedAt: "Yesterday, 4:30 PM",
      earnings: "৳175",
    },
    {
      id: "DEL-005",
      orderId: "ORD-2024-005",
      customer: "Rafiq Islam",
      address: "House 78, Road 3, Gulshan, Dhaka",
      items: 4,
      completedAt: "Yesterday, 5:45 PM",
      earnings: "৳225",
    },
  ]);

  const filteredDeliveries = completedDeliveries.filter(
    (delivery) =>
      delivery.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalEarnings = completedDeliveries.reduce((sum, d) => {
    const amount = parseInt(d.earnings.replace("৳", "").replace(",", ""));
    return sum + amount;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Completed Deliveries
          </h1>
          <p className="text-muted-foreground mt-1">
            {completedDeliveries.length} deliveries completed
          </p>
        </div>
        <Card className="border-emerald-500/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Earnings</p>
            <p className="text-2xl font-bold text-emerald-500">৳{totalEarnings.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by order ID, customer, or address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Completed Deliveries List */}
      <div className="grid gap-4">
        {filteredDeliveries.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Completed Deliveries</h3>
              <p className="text-muted-foreground text-sm">
                {searchQuery ? "No deliveries match your search." : "Complete deliveries to see them here."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredDeliveries.map((delivery) => (
            <Card key={delivery.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-lg">{delivery.orderId}</span>
                      <Badge className="bg-green-500">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        OTP Verified
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4" />
                        {delivery.customer}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {delivery.completedAt}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground md:col-span-2">
                        <MapPin className="w-4 h-4" />
                        {delivery.address}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Earned</p>
                    <p className="text-xl font-bold text-emerald-500">{delivery.earnings}</p>
                    <p className="text-xs text-muted-foreground">{delivery.items} items</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
