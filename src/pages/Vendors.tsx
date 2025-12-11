import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Users, CheckCircle, Clock, XCircle } from "lucide-react";
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
import { apiRequest } from "@/lib/api-client";
import type { ApiListResponse, Vendor } from "@/types/api";

export default function Vendors() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<ApiListResponse<Vendor>>({
    queryKey: ["vendors"],
    queryFn: () => apiRequest<ApiListResponse<Vendor>>("/vendors", { role: "admin" }),
  });

  const vendors = data?.data ?? [];

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest(`/vendors/${id}/status`, {
        method: "PATCH",
        body: { status },
        role: "admin",
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

      <div className="grid gap-6 md:grid-cols-3">
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-warning/20 to-accent/20 group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-5 w-5 text-warning" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-warning to-accent bg-clip-text text-transparent">
              {vendors.filter((vendor) => vendor.status === "pending").length}
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
            <p className="text-xs text-success mt-2 font-medium">Approval rate</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-effect border-2 card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-secondary to-accent rounded-full" />
            Vendor Applications
          </CardTitle>
          <CardDescription>Review and manage vendor registrations</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading vendors...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor Name</TableHead>
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
                    <TableCell className="text-muted-foreground">{vendor.email}</TableCell>
                    <TableCell>{vendor.products}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {vendor.registeredAt ? new Date(vendor.registeredAt).toLocaleString() : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={vendor.status === "approved" ? "default" : "secondary"}
                        className={`flex items-center gap-1 w-fit ${
                          vendor.status === "approved" ? "bg-success text-success-foreground" : ""
                        } ${vendor.status === "pending" ? "bg-warning text-warning-foreground" : ""}`}
                      >
                        {getStatusIcon(vendor.status)}
                        {formatStatus(vendor.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {vendor.status === "pending" ? (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-success text-success-foreground hover:bg-success/90"
                              onClick={() => statusMutation.mutate({ id: vendor._id, status: "approved" })}
                            >
                              Approve
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => statusMutation.mutate({ id: vendor._id, status: "rejected" })}>
                              Reject
                            </Button>
                          </>
                        ) : (
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
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
    </div>
  );
}
