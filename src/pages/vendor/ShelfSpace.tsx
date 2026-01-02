import { useState, useEffect } from "react";
import { Calendar, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api-client";
import type { ApiListResponse } from "@/types/api";

interface Microhub {
  _id: string;
  name: string;
  location: string;
  address?: string;
  capacity: number;
  utilized: number;
  status: string;
}

interface ShelfBooking {
  _id: string;
  vendorId: string;
  microhubId: {
    _id: string;
    name: string;
    location: string;
    address?: string;
  };
  shelfSize: 'small' | 'medium' | 'large';
  utilizationPercentage: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface BookingStats {
  activeBookings: number;
  totalLocations: number;
  expiringSoon: number;
}

export default function ShelfSpace() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMicrohub, setSelectedMicrohub] = useState<string>("");
  const [selectedShelfSize, setSelectedShelfSize] = useState<string>("");

  // Fetch microhubs
  const { data: microhubsData, error: microhubsError, isLoading: microhubsLoading } = useQuery<ApiListResponse<Microhub>>({
    queryKey: ["microhubs"],
    queryFn: async () => {
      console.log("🔍 Fetching microhubs...");
      try {
        const result = await apiRequest<ApiListResponse<Microhub>>("/microhubs");
        console.log("✅ Microhubs fetched successfully:", result);
        return result;
      } catch (error) {
        console.error("❌ Error fetching microhubs:", error);
        throw error;
      }
    },
  });

  // Fetch shelf bookings
  const { data: bookingsData, isLoading: bookingsLoading } = useQuery<ApiListResponse<ShelfBooking>>({
    queryKey: ["shelf-bookings"],
    queryFn: () => apiRequest<ApiListResponse<ShelfBooking>>("/shelf-bookings"),
  });

  // Fetch booking statistics
  const { data: statsData } = useQuery<{ data: BookingStats }>({
    queryKey: ["shelf-bookings", "stats"],
    queryFn: () => apiRequest<{ data: BookingStats }>("/shelf-bookings/stats"),
  });

  const microhubs = microhubsData?.data?.filter(hub => hub.status === 'active') ?? [];
  const bookings = bookingsData?.data ?? [];
  const stats = statsData?.data ?? { activeBookings: 0, totalLocations: 0, expiringSoon: 0 };

  console.log("🏢 Microhubs data:", microhubsData);
  console.log("🏢 Filtered active microhubs:", microhubs);
  console.log("📦 Bookings:", bookings);
  console.log("📊 Stats:", stats);

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: (payload: {
      microhubId: string;
      shelfSize: string;
      startDate: string;
      endDate: string;
    }) =>
      apiRequest("/shelf-bookings", {
        method: "POST",
        body: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shelf-bookings"] });
      toast({ title: "Shelf space booked successfully" });
      setDialogOpen(false);
      setSelectedMicrohub("");
      setSelectedShelfSize("");
    },
    onError: (error: Error) => {
      toast({ 
        title: "Booking failed", 
        description: error.message,
        variant: "destructive"
      });
    },
  });

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: string) =>
      apiRequest(`/shelf-bookings/${bookingId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shelf-bookings"] });
      toast({ title: "Booking cancelled successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Cancellation failed", 
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const handleBookShelf = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createBookingMutation.mutate({
      microhubId: selectedMicrohub,
      shelfSize: selectedShelfSize,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
    });
  };

  const handleCancelBooking = (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      cancelBookingMutation.mutate(bookingId);
    }
  };

  const getShelfSizeDisplay = (size: string) => {
    const sizeMap = {
      small: "Small (10% capacity)",
      medium: "Medium (25% capacity)",
      large: "Large (50% capacity)"
    };
    return sizeMap[size as keyof typeof sizeMap] || size;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isBookingExpiringSoon = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return end <= oneWeekFromNow && end >= now;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Shelf Space</h1>
          <p className="text-muted-foreground">Manage your microhub shelf bookings</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Package className="w-4 h-4 mr-2" />
          Book Shelf Space
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {stats.activeBookings}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {stats.totalLocations}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-warning">{stats.expiringSoon}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Shelf Bookings</CardTitle>
          <CardDescription>View and manage your shelf space rentals</CardDescription>
        </CardHeader>
        <CardContent>
          {bookingsLoading ? (
            <p>Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="text-muted-foreground">No shelf bookings found. Book your first shelf space!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Microhub</TableHead>
                  <TableHead>Shelf Size</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{booking.microhubId.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {booking.microhubId.address || booking.microhubId.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getShelfSizeDisplay(booking.shelfSize)}</TableCell>
                    <TableCell>{formatDate(booking.startDate)}</TableCell>
                    <TableCell>
                      <div className={isBookingExpiringSoon(booking.endDate) ? "text-warning font-medium" : ""}>
                        {formatDate(booking.endDate)}
                        {isBookingExpiringSoon(booking.endDate) && (
                          <div className="text-xs">Expiring soon!</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={booking.status === "active" ? "default" : "secondary"}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {booking.status === "active" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={cancelBookingMutation.isPending}
                        >
                          <Calendar className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Shelf Space</DialogTitle>
            <DialogDescription>Select a microhub and shelf size for your products</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBookShelf}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="microhub">Microhub Location</Label>
                <Select value={selectedMicrohub} onValueChange={setSelectedMicrohub} required>
                  <SelectTrigger>
                    <SelectValue placeholder={
                      microhubsLoading ? "Loading microhubs..." : 
                      microhubsError ? "Error loading microhubs" :
                      microhubs.length === 0 ? "No active microhubs available" :
                      "Select microhub"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {microhubsLoading ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : microhubsError ? (
                      <SelectItem value="error" disabled>Error: {microhubsError.message}</SelectItem>
                    ) : microhubs.length === 0 ? (
                      <SelectItem value="empty" disabled>No active microhubs available</SelectItem>
                    ) : (
                      microhubs.map((hub) => (
                        <SelectItem key={hub._id} value={hub._id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{hub.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {hub.address || hub.location}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Capacity: {hub.utilized}/{hub.capacity} ({Math.round((hub.utilized/hub.capacity)*100)}% used)
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {selectedMicrohub && (
                <div>
                  <Label>Shelf Size</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {[
                      { value: 'small', label: 'Small', percentage: '10%', description: '10% of microhub capacity' },
                      { value: 'medium', label: 'Medium', percentage: '25%', description: '25% of microhub capacity' },
                      { value: 'large', label: 'Large', percentage: '50%', description: '50% of microhub capacity' }
                    ].map((size) => (
                      <Button
                        key={size.value}
                        type="button"
                        variant={selectedShelfSize === size.value ? "default" : "outline"}
                        className="justify-start h-auto p-3"
                        onClick={() => setSelectedShelfSize(size.value)}
                      >
                        <div className="text-left">
                          <div className="font-medium">{size.label} ({size.percentage})</div>
                          <div className="text-sm text-muted-foreground">{size.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {selectedShelfSize && (
                <>
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" name="startDate" type="date" required />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" name="endDate" type="date" required />
                  </div>
                </>
              )}
            </div>
            <DialogFooter className="mt-4">
              <Button 
                type="submit" 
                disabled={!selectedMicrohub || !selectedShelfSize || createBookingMutation.isPending}
              >
                {createBookingMutation.isPending ? "Booking..." : "Book Shelf Space"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
