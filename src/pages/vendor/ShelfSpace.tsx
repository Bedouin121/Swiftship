import { useState } from "react";
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

export default function ShelfSpace() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bookings, setBookings] = useState([
    { id: 1, microhub: "Dhaka Central", shelfSize: "Medium", startDate: "2024-01-15", endDate: "2024-04-15", status: "Active" },
    { id: 2, microhub: "Chittagong Hub", shelfSize: "Large", startDate: "2024-02-01", endDate: "2024-05-01", status: "Active" },
    { id: 3, microhub: "Sylhet Station", shelfSize: "Small", startDate: "2023-12-01", endDate: "2024-01-31", status: "Expired" },
  ]);

  const handleBookShelf = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newBooking = {
      id: Date.now(),
      microhub: formData.get("microhub") as string,
      shelfSize: formData.get("shelfSize") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      status: "Active",
    };
    setBookings([...bookings, newBooking]);
    toast({ title: "Shelf space booked successfully" });
    setDialogOpen(false);
  };

  const handleRenew = (id: number) => {
    toast({ title: "Renewal request submitted" });
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
              {bookings.filter(b => b.status === "Active").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {new Set(bookings.map(b => b.microhub)).size}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-warning">1</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Shelf Bookings</CardTitle>
          <CardDescription>View and manage your shelf space rentals</CardDescription>
        </CardHeader>
        <CardContent>
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
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.microhub}</TableCell>
                  <TableCell>{booking.shelfSize}</TableCell>
                  <TableCell>{booking.startDate}</TableCell>
                  <TableCell>{booking.endDate}</TableCell>
                  <TableCell>
                    <Badge variant={booking.status === "Active" ? "default" : "secondary"}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {booking.status === "Active" && (
                      <Button size="sm" variant="outline" onClick={() => handleRenew(booking.id)}>
                        <Calendar className="w-4 h-4 mr-1" />
                        Renew
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Shelf Space</DialogTitle>
            <DialogDescription>Select a microhub and shelf size for your products</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBookShelf}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="microhub">Microhub Location</Label>
                <Select name="microhub" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select microhub" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dhaka Central">Dhaka Central</SelectItem>
                    <SelectItem value="Chittagong Hub">Chittagong Hub</SelectItem>
                    <SelectItem value="Sylhet Station">Sylhet Station</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="shelfSize">Shelf Size</Label>
                <Select name="shelfSize" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Small">Small (1 sqm)</SelectItem>
                    <SelectItem value="Medium">Medium (3 sqm)</SelectItem>
                    <SelectItem value="Large">Large (5 sqm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" name="startDate" type="date" required />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" name="endDate" type="date" required />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Book Shelf Space</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
