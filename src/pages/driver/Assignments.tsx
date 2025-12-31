import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, Clock, User, Phone, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Assignment {
  id: string;
  orderId: string;
  customer: string;
  phone: string;
  pickupAddress: string;
  deliveryAddress: string;
  items: number;
  estimatedTime: string;
  distance: string;
  earnings: string;
  priority: "normal" | "urgent" | "express";
}

export default function Assignments() {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "ASN-001",
      orderId: "ORD-2024-001",
      customer: "Ahmed Rahman",
      phone: "+880 1712-345678",
      pickupAddress: "Microhub Gulshan, Road 45, Dhaka",
      deliveryAddress: "House 12, Road 8, Banani, Dhaka",
      items: 3,
      estimatedTime: "25 min",
      distance: "4.2 km",
      earnings: "৳150",
      priority: "normal",
    },
    {
      id: "ASN-002",
      orderId: "ORD-2024-002",
      customer: "Fatima Begum",
      phone: "+880 1812-456789",
      pickupAddress: "Microhub Dhanmondi, Road 27, Dhaka",
      deliveryAddress: "Flat 5B, Green Tower, Mirpur, Dhaka",
      items: 1,
      estimatedTime: "35 min",
      distance: "6.8 km",
      earnings: "৳200",
      priority: "urgent",
    },
    {
      id: "ASN-003",
      orderId: "ORD-2024-003",
      customer: "Karim Uddin",
      phone: "+880 1912-567890",
      pickupAddress: "Microhub Uttara, Sector 7, Dhaka",
      deliveryAddress: "House 45, Road 12, Uttara, Dhaka",
      items: 5,
      estimatedTime: "15 min",
      distance: "2.1 km",
      earnings: "৳100",
      priority: "express",
    },
  ]);

  // FR-14: Accept/Reject Assignments
  const handleAccept = (assignmentId: string) => {
    setAssignments(prev => prev.filter(a => a.id !== assignmentId));
    toast({
      title: "Assignment Accepted",
      description: `You have accepted assignment ${assignmentId}. Navigate to Active Deliveries to start.`,
    });
  };

  const handleReject = (assignmentId: string) => {
    setAssignments(prev => prev.filter(a => a.id !== assignmentId));
    toast({
      title: "Assignment Rejected",
      description: `Assignment ${assignmentId} has been rejected and returned to the pool.`,
      variant: "destructive",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500";
      case "express": return "bg-orange-500";
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
          {assignments.length} new delivery assignments waiting for you
        </p>
      </div>

      {/* FR-13: View New Assignments */}
      {assignments.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Available Orders</h3>
            <p className="text-muted-foreground text-sm">New assignments will appear here when available.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: assignment.priority === "urgent" ? "#ef4444" : assignment.priority === "express" ? "#f97316" : "#3b82f6" }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{assignment.orderId}</CardTitle>
                    <Badge className={getPriorityColor(assignment.priority)}>
                      {assignment.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-2xl font-bold text-emerald-500">{assignment.earnings}</span>
                </div>
                <CardDescription>Assignment ID: {assignment.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{assignment.customer}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {assignment.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Package className="w-4 h-4 mt-1 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">Pickup Location</p>
                        <p className="text-sm text-muted-foreground">{assignment.pickupAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-1 text-red-500" />
                      <div>
                        <p className="text-sm font-medium">Delivery Location</p>
                        <p className="text-sm text-muted-foreground">{assignment.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 rounded bg-muted/50">
                      <span className="text-sm text-muted-foreground">Items</span>
                      <span className="font-medium">{assignment.items} items</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-muted/50">
                      <span className="text-sm text-muted-foreground">Distance</span>
                      <span className="font-medium">{assignment.distance}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-muted/50">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Est. Time
                      </span>
                      <span className="font-medium">{assignment.estimatedTime}</span>
                    </div>
                  </div>
                </div>
                
                {/* FR-14: Accept/Reject Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                    onClick={() => handleAccept(assignment.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept Order
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => handleReject(assignment.id)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
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
