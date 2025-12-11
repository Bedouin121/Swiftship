import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Package, MapPin, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api-client";
import type { ApiItemResponse, ApiListResponse, Microhub } from "@/types/api";

export default function Microhubs() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [selectedHub, setSelectedHub] = useState<Microhub | null>(null);

  const { data, isLoading } = useQuery<ApiListResponse<Microhub>>({
    queryKey: ["microhubs"],
    queryFn: () => apiRequest<ApiListResponse<Microhub>>("/microhubs", { role: "admin" }),
  });

  const hubs = data?.data ?? [];

  const addMutation = useMutation({
    mutationFn: (payload: Partial<Microhub>) =>
      apiRequest<ApiItemResponse<Microhub>>("/microhubs", {
        method: "POST",
        body: payload,
        role: "admin",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["microhubs"] });
      toast({ title: "Microhub added", description: "Microhub has been successfully added." });
      setAddDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Microhub> }) =>
      apiRequest<ApiItemResponse<Microhub>>(`/microhubs/${id}`, {
        method: "PUT",
        body: payload,
        role: "admin",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["microhubs"] });
      toast({ title: "Microhub updated", description: "Microhub has been successfully updated." });
      setManageDialogOpen(false);
    },
  });

  const handleAddMicrohub = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addMutation.mutate({
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      capacity: parseInt(formData.get("capacity") as string),
      utilized: 0,
    });
  };

  const handleUpdateMicrohub = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedHub) return;
    const formData = new FormData(e.currentTarget);
    updateMutation.mutate({
      id: selectedHub._id,
      payload: {
        name: formData.get("name") as string,
        location: formData.get("location") as string,
        capacity: parseInt(formData.get("capacity") as string),
        status: formData.get("status") as string,
      },
    });
  };

  const openManageDialog = (hub: Microhub) => {
    setSelectedHub(hub);
    setManageDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between relative">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Microhubs
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage your warehouse and microhub network</p>
        </div>
        <Button 
          onClick={() => setAddDialogOpen(true)}
          className="gradient-primary text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Package className="w-4 h-4 mr-2" />
          Add Microhub
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-effect border-2 card-hover overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Microhubs</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-110 transition-transform duration-300">
              <Package className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{hubs.length}</div>
            <p className="text-xs text-success mt-2 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              Live data
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-2 card-hover overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Capacity</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-secondary/20 to-accent/20 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-5 w-5 text-secondary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              {hubs.reduce((acc, hub) => acc + hub.capacity, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Square feet</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-2 card-hover overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Utilization</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-success/20 to-primary/20 group-hover:scale-110 transition-transform duration-300">
              <MapPin className="h-5 w-5 text-success" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">
              {hubs.length
                ? `${Math.round(
                    hubs.reduce((acc, hub) => acc + (hub.utilized / hub.capacity) * 100, 0) / hubs.length,
                  )}%`
                : "0%"}
            </div>
            <p className="text-xs text-success mt-2 font-medium">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-effect border-2 card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full" />
            All Microhubs
          </CardTitle>
          <CardDescription>Overview of all microhub locations and capacity</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading microhubs...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity (sq ft)</TableHead>
                  <TableHead>Utilized (sq ft)</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hubs.map((hub) => {
                  const utilization = Math.round((hub.utilized / hub.capacity) * 100);
                  return (
                    <TableRow key={hub._id}>
                      <TableCell className="font-medium">{hub.name}</TableCell>
                      <TableCell className="text-muted-foreground">{hub.location}</TableCell>
                      <TableCell>{hub.capacity.toLocaleString()}</TableCell>
                      <TableCell>{hub.utilized.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className={`h-full ${utilization > 85 ? "bg-warning" : "bg-primary"}`}
                              style={{ width: `${utilization}%` }}
                            />
                          </div>
                          <span className="text-sm">{utilization}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={hub.status === "active" ? "default" : "secondary"}
                          className={hub.status === "active" ? "bg-success text-success-foreground" : ""}
                        >
                          {hub.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => openManageDialog(hub)}>
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Microhub Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Microhub</DialogTitle>
            <DialogDescription>
              Add a new microhub location to your logistics network
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddMicrohub}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Microhub Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Dhanmondi Hub"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g., Dhanmondi, Dhaka"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacity (sq ft)</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  placeholder="e.g., 5000"
                  required
                  min="0"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Microhub</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Manage Microhub Dialog */}
      <Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Manage Microhub</DialogTitle>
            <DialogDescription>
              Update microhub details and status
            </DialogDescription>
          </DialogHeader>
          {selectedHub && (
            <form onSubmit={handleUpdateMicrohub}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Microhub Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={selectedHub.name}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    name="location"
                    defaultValue={selectedHub.location}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-capacity">Capacity (sq ft)</Label>
                  <Input
                    id="edit-capacity"
                    name="capacity"
                    type="number"
                    defaultValue={selectedHub.capacity}
                    required
                    min="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select name="status" defaultValue={selectedHub.status}>
                    <SelectTrigger id="edit-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setManageDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Microhub</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
