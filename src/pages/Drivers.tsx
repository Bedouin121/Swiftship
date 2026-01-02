import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Truck, CheckCircle, Clock, XCircle, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/api-client";
import type { ApiListResponse, Driver } from "@/types/api";
import { useState } from "react";

export default function Drivers() {
  const queryClient = useQueryClient();
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: driversData, isLoading: driversLoading } = useQuery<ApiListResponse<Driver>>({
    queryKey: ["drivers"],
    queryFn: () => apiRequest<ApiListResponse<Driver>>("/drivers", { role: "admin" }),
  });

  const { data: pendingDriversData, isLoading: pendingLoading } = useQuery<ApiListResponse<Driver>>({
    queryKey: ["pending-drivers"],
    queryFn: () => apiRequest<ApiListResponse<Driver>>("/drivers/pending", { role: "admin" }),
  });

  const drivers = driversData?.data ?? [];
  const pendingDrivers = pendingDriversData?.data ?? [];

  const approveMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/drivers/approve/${id}`, {
        method: "POST",
        role: "admin",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["pending-drivers"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/drivers/reject/${id}`, {
        method: "POST",
        role: "admin",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-drivers"] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest(`/drivers/${id}/status`, {
        method: "PATCH",
        body: { status },
        role: "admin",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "inactive":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatStatus = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);

  const handleViewDetails = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDetailsOpen(true);
  };

  const DriverDetailsDialog = () => {
    if (!selectedDriver) return null;

    const isPending = selectedDriver.status === 'pending';

    return (
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isPending ? 'Pending Driver Application' : 'Driver Details'}
            </DialogTitle>
            <DialogDescription>
              {isPending 
                ? 'Review the driver application details below'
                : 'View driver information and manage status'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                  <p className="text-sm">
                    {selectedDriver.firstName && selectedDriver.lastName 
                      ? `${selectedDriver.firstName} ${selectedDriver.lastName}`
                      : selectedDriver.name
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                  <p className="text-sm">{selectedDriver.phone}</p>
                </div>
                {selectedDriver.email && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-sm">{selectedDriver.email}</p>
                  </div>
                )}
                {selectedDriver.nidNumber && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">NID Number</Label>
                    <p className="text-sm">{selectedDriver.nidNumber}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Address Information */}
            {(selectedDriver.address || selectedDriver.city) && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Address Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedDriver.address && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                      <p className="text-sm">{selectedDriver.address}</p>
                    </div>
                  )}
                  {selectedDriver.city && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">City</Label>
                      <p className="text-sm">{selectedDriver.city}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* License & Vehicle Information */}
            {(selectedDriver.licenseNumber || selectedDriver.vehicleType) && (
              <div>
                <h3 className="text-lg font-semibold mb-3">License & Vehicle Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {selectedDriver.licenseNumber && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">License Number</Label>
                        <p className="text-sm">{selectedDriver.licenseNumber}</p>
                      </div>
                    )}
                    {selectedDriver.vehicleType && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Vehicle Type</Label>
                        <p className="text-sm">{selectedDriver.vehicleType}</p>
                      </div>
                    )}
                    {selectedDriver.vehicleModel && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Vehicle Model</Label>
                        <p className="text-sm">{selectedDriver.vehicleModel}</p>
                      </div>
                    )}
                    {selectedDriver.vehicleYear && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Vehicle Year</Label>
                        <p className="text-sm">{selectedDriver.vehicleYear}</p>
                      </div>
                    )}
                    {selectedDriver.vehiclePlateNumber && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Plate Number</Label>
                        <p className="text-sm">{selectedDriver.vehiclePlateNumber}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            {(selectedDriver.emergencyContact || selectedDriver.emergencyPhone) && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Emergency Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedDriver.emergencyContact && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Contact Name</Label>
                      <p className="text-sm">{selectedDriver.emergencyContact}</p>
                    </div>
                  )}
                  {selectedDriver.emergencyPhone && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Contact Phone</Label>
                      <p className="text-sm">{selectedDriver.emergencyPhone}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Performance Information (for registered drivers) */}
            {!isPending && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Performance Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Total Deliveries</Label>
                    <p className="text-sm">{selectedDriver.deliveries}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Rating</Label>
                    <p className="text-sm">
                      {selectedDriver.rating > 0 
                        ? `${selectedDriver.rating.toFixed(1)} / 5.0`
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Status and Actions */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Status & Actions</h3>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Current Status</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant={selectedDriver.status === 'active' ? 'default' : 'secondary'}
                      className="flex items-center gap-1"
                    >
                      {getStatusIcon(selectedDriver.status)}
                      {formatStatus(selectedDriver.status)}
                    </Badge>
                  </div>
                </div>
                
                {isPending && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        rejectMutation.mutate(selectedDriver._id);
                        setIsDetailsOpen(false);
                      }}
                      variant="destructive"
                      size="sm"
                      disabled={rejectMutation.isPending}
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => {
                        approveMutation.mutate(selectedDriver._id);
                        setIsDetailsOpen(false);
                      }}
                      size="sm"
                      disabled={approveMutation.isPending}
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Registration Date */}
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Applied On</Label>
              <p className="text-sm">
                {new Date(selectedDriver.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between relative">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-warning bg-clip-text text-transparent">
            Drivers
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage driver registrations and approvals</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass-effect border-2 card-hover overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Drivers</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-110 transition-transform duration-300">
              <Truck className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{drivers.length}</div>
            <p className="text-xs text-success mt-2 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              Live data
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-2 card-hover overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-warning/10 to-warning/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Applications</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-warning/20 to-accent/20 group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-5 w-5 text-warning" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-warning to-accent bg-clip-text text-transparent">
              {pendingDrivers.length}
            </div>
            <p className="text-xs text-warning mt-2 font-medium">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-2 card-hover overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Drivers</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-success/20 to-primary/20 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">
              {drivers.filter((driver) => driver.status === "active").length}
            </div>
            <p className="text-xs text-success mt-2 font-medium">Active drivers</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-2 card-hover overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inactive</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-destructive/20 to-red-400/20 group-hover:scale-110 transition-transform duration-300">
              <XCircle className="h-5 w-5 text-destructive" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-destructive to-red-400 bg-clip-text text-transparent">
              {drivers.filter((driver) => driver.status === "inactive").length}
            </div>
            <p className="text-xs text-destructive mt-2 font-medium">Inactive drivers</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Applications */}
      {pendingDrivers.length > 0 && (
        <Card className="glass-effect border-2 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-warning to-accent rounded-full" />
              Pending Applications
            </CardTitle>
            <CardDescription>Review new driver applications awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingLoading ? (
              <p className="text-sm text-muted-foreground">Loading pending applications...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Vehicle Type</TableHead>
                    <TableHead>License Number</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingDrivers.map((driver) => (
                    <TableRow key={driver._id}>
                      <TableCell className="font-medium">
                        {driver.firstName && driver.lastName 
                          ? `${driver.firstName} ${driver.lastName}`
                          : driver.name
                        }
                      </TableCell>
                      <TableCell className="text-muted-foreground">{driver.phone}</TableCell>
                      <TableCell className="text-muted-foreground">{driver.email || 'N/A'}</TableCell>
                      <TableCell className="capitalize">{driver.vehicleType || 'N/A'}</TableCell>
                      <TableCell>{driver.licenseNumber || 'N/A'}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(driver.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(driver)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-success text-success-foreground hover:bg-success/90"
                            onClick={() => approveMutation.mutate(driver._id)}
                            disabled={approveMutation.isPending}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => rejectMutation.mutate(driver._id)}
                            disabled={rejectMutation.isPending}
                          >
                            Reject
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
      )}

      {/* Registered Drivers */}
      <Card className="glass-effect border-2 card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-accent to-warning rounded-full" />
            Registered Drivers
          </CardTitle>
          <CardDescription>Manage existing driver accounts and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {driversLoading ? (
            <p className="text-sm text-muted-foreground">Loading drivers...</p>
          ) : drivers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No drivers registered yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Total Deliveries</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((driver) => (
                  <TableRow key={driver._id}>
                    <TableCell className="font-medium">{driver.name}</TableCell>
                    <TableCell className="text-muted-foreground">{driver.phone}</TableCell>
                    <TableCell>{driver.deliveries}</TableCell>
                    <TableCell>
                      {driver.rating > 0 ? (
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">{driver.rating.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground">/ 5.0</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {driver.joinedAt ? new Date(driver.joinedAt).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={driver.status === "active" ? "default" : "secondary"}
                        className={`flex items-center gap-1 w-fit ${
                          driver.status === "active" ? "bg-success text-success-foreground" : ""
                        } ${driver.status === "pending" ? "bg-warning text-warning-foreground" : ""} ${
                          driver.status === "inactive" ? "bg-destructive text-destructive-foreground" : ""
                        }`}
                      >
                        {getStatusIcon(driver.status)}
                        {formatStatus(driver.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(driver)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                        {driver.status === "pending" && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-success text-success-foreground hover:bg-success/90"
                              onClick={() => statusMutation.mutate({ id: driver._id, status: "active" })}
                              disabled={statusMutation.isPending}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => statusMutation.mutate({ id: driver._id, status: "inactive" })}
                              disabled={statusMutation.isPending}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <DriverDetailsDialog />
    </div>
  );
}
