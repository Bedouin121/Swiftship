import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Users, CheckCircle, Clock, XCircle, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ImagePreview } from "@/components/ui/image-preview";
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
import type { ApiListResponse, Vendor, PendingVendor } from "@/types/api";
import { useState } from "react";

export default function Vendors() {
  const queryClient = useQueryClient();
  const [selectedVendor, setSelectedVendor] = useState<Vendor | PendingVendor | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: vendorsData, isLoading: vendorsLoading } = useQuery<ApiListResponse<Vendor>>({
    queryKey: ["vendors"],
    queryFn: () => apiRequest<ApiListResponse<Vendor>>("/vendors"),
  });

  const { data: pendingVendorsData, isLoading: pendingLoading } = useQuery<ApiListResponse<PendingVendor>>({
    queryKey: ["pending-vendors"],
    queryFn: () => apiRequest<ApiListResponse<PendingVendor>>("/vendors/pending"),
  });

  const vendors = vendorsData?.data ?? [];
  const pendingVendors = pendingVendorsData?.data ?? [];

  const approveMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/vendors/approve/${id}`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["pending-vendors"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/vendors/reject/${id}`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-vendors"] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest(`/vendors/${id}/status`, {
        method: "PATCH",
        body: { status },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatStatus = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);

  const handleViewDetails = (vendor: Vendor | PendingVendor) => {
    setSelectedVendor(vendor);
    setIsDetailsOpen(true);
  };

  const VendorDetailsDialog = () => {
    if (!selectedVendor) return null;

    const isPending = 'companyName' in selectedVendor;

    return (
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isPending ? 'Pending Vendor Application' : 'Vendor Details'}
            </DialogTitle>
            <DialogDescription>
              {isPending 
                ? 'Review the vendor application details below'
                : 'View vendor information and manage status'
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
                    {isPending 
                      ? `${(selectedVendor as PendingVendor).firstName} ${(selectedVendor as PendingVendor).lastName}`
                      : (selectedVendor as Vendor).name
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-sm">{selectedVendor.email}</p>
                </div>
                {isPending && (
                  <>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                      <p className="text-sm">{(selectedVendor as PendingVendor).phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">NID Number</Label>
                      <p className="text-sm">{(selectedVendor as PendingVendor).nidNumber}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Address Information */}
            {isPending && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Address Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                    <p className="text-sm">{(selectedVendor as PendingVendor).address}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">City</Label>
                    <p className="text-sm">{(selectedVendor as PendingVendor).city}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Business Information */}
            {isPending && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Business Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Company Name</Label>
                      <p className="text-sm">{(selectedVendor as PendingVendor).companyName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Business Type</Label>
                      <p className="text-sm">{(selectedVendor as PendingVendor).businessType}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Registration Number</Label>
                      <p className="text-sm">{(selectedVendor as PendingVendor).registrationNumber}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Tax ID</Label>
                      <p className="text-sm">{(selectedVendor as PendingVendor).taxId}</p>
                    </div>
                  </div>
                  
                  {(selectedVendor as PendingVendor).website && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Website</Label>
                      <p className="text-sm">
                        <a 
                          href={(selectedVendor as PendingVendor).website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {(selectedVendor as PendingVendor).website}
                        </a>
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ImagePreview
                      label="NID Image (Front)"
                      imageUrl={(selectedVendor as PendingVendor).nidImageUrl}
                    />
                    <ImagePreview
                      label="Trade License"
                      imageUrl={(selectedVendor as PendingVendor).tradeLicenseUrl}
                    />
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
                    {isPending ? (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Pending Review
                      </Badge>
                    ) : (
                      <Badge 
                        variant={(selectedVendor as Vendor).status === 'approved' ? 'default' : 'secondary'}
                        className="flex items-center gap-1"
                      >
                        {getStatusIcon((selectedVendor as Vendor).status)}
                        {formatStatus((selectedVendor as Vendor).status)}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {isPending && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        rejectMutation.mutate(selectedVendor._id);
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
                        approveMutation.mutate(selectedVendor._id);
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
                {new Date(selectedVendor.createdAt).toLocaleDateString('en-US', {
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
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
        <div className="relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
            Vendors
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage vendor registrations and approvals</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass-effect border-2 card-hover overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Vendors</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{vendors.length}</div>
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
              {pendingVendors.length}
            </div>
            <p className="text-xs text-warning mt-2 font-medium">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-2 card-hover overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved Vendors</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-success/20 to-primary/20 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">
              {vendors.filter((vendor) => vendor.status === "approved").length}
            </div>
            <p className="text-xs text-success mt-2 font-medium">Active vendors</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-2 card-hover overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-destructive/20 to-red-400/20 group-hover:scale-110 transition-transform duration-300">
              <XCircle className="h-5 w-5 text-destructive" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-destructive to-red-400 bg-clip-text text-transparent">
              {vendors.filter((vendor) => vendor.status === "rejected").length}
            </div>
            <p className="text-xs text-destructive mt-2 font-medium">Declined applications</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Applications */}
      {pendingVendors.length > 0 && (
        <Card className="glass-effect border-2 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-warning to-accent rounded-full" />
              Pending Applications
            </CardTitle>
            <CardDescription>Review new vendor applications awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingLoading ? (
              <p className="text-sm text-muted-foreground">Loading pending applications...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Business Type</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingVendors.map((vendor) => (
                    <TableRow key={vendor._id}>
                      <TableCell className="font-medium">
                        {vendor.firstName} {vendor.lastName}
                      </TableCell>
                      <TableCell>{vendor.companyName}</TableCell>
                      <TableCell className="text-muted-foreground">{vendor.email}</TableCell>
                      <TableCell className="capitalize">{vendor.businessType}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(vendor.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(vendor)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-success text-success-foreground hover:bg-success/90"
                            onClick={() => approveMutation.mutate(vendor._id)}
                            disabled={approveMutation.isPending}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => rejectMutation.mutate(vendor._id)}
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

      {/* Approved/Existing Vendors */}
      <Card className="glass-effect border-2 card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-secondary to-accent rounded-full" />
            Registered Vendors
          </CardTitle>
          <CardDescription>Manage existing vendor accounts and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {vendorsLoading ? (
            <p className="text-sm text-muted-foreground">Loading vendors...</p>
          ) : vendors.length === 0 ? (
            <p className="text-sm text-muted-foreground">No vendors registered yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor._id}>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>{vendor.companyName}</TableCell>
                    <TableCell className="text-muted-foreground">{vendor.email}</TableCell>
                    <TableCell>{vendor.products}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {vendor.registeredAt ? new Date(vendor.registeredAt).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={vendor.status === "approved" ? "default" : "secondary"}
                        className={`flex items-center gap-1 w-fit ${
                          vendor.status === "approved" ? "bg-success text-success-foreground" : ""
                        } ${vendor.status === "pending" ? "bg-warning text-warning-foreground" : ""} ${
                          vendor.status === "rejected" ? "bg-destructive text-destructive-foreground" : ""
                        }`}
                      >
                        {getStatusIcon(vendor.status)}
                        {formatStatus(vendor.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(vendor)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                        {vendor.status === "pending" && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-success text-success-foreground hover:bg-success/90"
                              onClick={() => statusMutation.mutate({ id: vendor._id, status: "approved" })}
                              disabled={statusMutation.isPending}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => statusMutation.mutate({ id: vendor._id, status: "rejected" })}
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

      <VendorDetailsDialog />
    </div>
  );
}
