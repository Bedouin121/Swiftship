import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, CheckCircle, Package, MapPin, User, Send, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PendingConfirmation {
  id: string;
  orderId: string;
  customer: string;
  phone: string;
  address: string;
  items: number;
  otp?: string;
}

export default function DeliveryConfirmation() {
  const { toast } = useToast();
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  
  const [pendingConfirmations, setPendingConfirmations] = useState<PendingConfirmation[]>([
    {
      id: "DEL-003",
      orderId: "ORD-2024-006",
      customer: "Nasir Ahmed",
      phone: "+880 1712-XXX-XXX",
      address: "House 15, Road 5, Gulshan, Dhaka",
      items: 3,
      otp: "123456", // Simulated OTP
    },
    {
      id: "DEL-004",
      orderId: "ORD-2024-007",
      customer: "Rima Sultana",
      phone: "+880 1812-XXX-XXX",
      address: "Flat 8C, Blue Tower, Banani, Dhaka",
      items: 1,
      otp: "654321", // Simulated OTP
    },
  ]);

  const selectedOrder = pendingConfirmations.find(d => d.orderId === selectedDelivery);

  const handleSendOtp = () => {
    if (!selectedDelivery) {
      toast({
        title: "Select a Delivery",
        description: "Please select a delivery first.",
        variant: "destructive",
      });
      return;
    }

    // Simulate sending OTP to customer
    setOtpSent(true);
    toast({
      title: "OTP Sent",
      description: `A 6-digit OTP has been sent to the customer's phone.`,
    });
  };

  const handleVerifyOtp = () => {
    if (!otpValue || otpValue.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    // Simulate OTP verification
    setTimeout(() => {
      if (selectedOrder && otpValue === selectedOrder.otp) {
        toast({
          title: "Delivery Confirmed!",
          description: `Order ${selectedDelivery} has been verified and marked as delivered.`,
        });
        
        // Remove from pending list
        setPendingConfirmations(prev => prev.filter(d => d.orderId !== selectedDelivery));
        
        // Reset state
        setSelectedDelivery(null);
        setOtpSent(false);
        setOtpValue("");
      } else {
        toast({
          title: "Invalid OTP",
          description: "The OTP entered is incorrect. Please try again.",
          variant: "destructive",
        });
      }
      setIsVerifying(false);
    }, 1000);
  };

  const handleResendOtp = () => {
    toast({
      title: "OTP Resent",
      description: "A new OTP has been sent to the customer's phone.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
          Delivery Confirmation
        </h1>
        <p className="text-muted-foreground mt-1">
          Verify delivery with customer OTP
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pending Confirmations List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-500" />
              Pending Confirmations
            </CardTitle>
            <CardDescription>Select a delivery to confirm</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingConfirmations.map((delivery) => (
                <div
                  key={delivery.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedDelivery === delivery.orderId
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                      : "border-border hover:border-emerald-300"
                  }`}
                  onClick={() => {
                    setSelectedDelivery(delivery.orderId);
                    setOtpSent(false);
                    setOtpValue("");
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{delivery.orderId}</span>
                    <Badge variant="outline">{delivery.items} items</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-3 h-3" />
                    {delivery.customer}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {delivery.address}
                  </div>
                </div>
              ))}
              
              {pendingConfirmations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                  <p>All deliveries confirmed!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* OTP Verification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              OTP Verification
            </CardTitle>
            <CardDescription>Enter the OTP provided by the customer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!selectedDelivery ? (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <KeyRound className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  Select a delivery from the list to start verification
                </p>
              </div>
            ) : !otpSent ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium mb-1">Selected Order</p>
                  <p className="text-lg font-bold text-emerald-500">{selectedDelivery}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder?.customer}</p>
                </div>
                
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Send className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Send OTP to customer's registered phone number
                  </p>
                  <Button 
                    className="bg-emerald-500 hover:bg-emerald-600"
                    onClick={handleSendOtp}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send OTP to Customer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">OTP Sent Successfully</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    A 6-digit code has been sent to {selectedOrder?.phone}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP from Customer</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-2xl tracking-widest font-mono"
                    maxLength={6}
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Ask the customer for the OTP they received
                  </p>
                </div>

                <Button 
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                  onClick={handleVerifyOtp}
                  disabled={otpValue.length !== 6 || isVerifying}
                >
                  {isVerifying ? (
                    <>Verifying...</>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Verify & Confirm Delivery
                    </>
                  )}
                </Button>

                <Button 
                  variant="ghost" 
                  className="w-full text-muted-foreground"
                  onClick={handleResendOtp}
                >
                  Didn't receive? Resend OTP
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
