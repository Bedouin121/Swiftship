import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Truck, CheckCircle, Clock, TrendingUp } from "lucide-react";
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
import type { ApiListResponse, Driver } from "@/types/api";

export default function Drivers() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<ApiListResponse<Driver>>({
    queryKey: ["drivers"],
    queryFn: () => apiRequest<ApiListResponse<Driver>>("/drivers", { role: "admin" }),
  });

  const drivers = data?.data ?? [];

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest(`/drivers/${id}/status`, {
        method: "PATCH",
        body: { status },
        role: "admin",
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["drivers"] }),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between relative">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-warning bg-clip-text text-transparent">
            Drivers
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage driver registrations and performance</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-effect border-2 card-hover overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Drivers</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-success/20 to-primary/20 group-hover:scale-110 transition-transform duration-300">
              <Truck className="h-5 w-5 text-success" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">
              {drivers.filter((driver) => driver.status === "active").length}
            </div>
            <p className="text-xs text-success mt-2 font-medium">+3% from last month</p>
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
              {drivers.filter((driver) => driver.status === "pending").length}
            </div>
            <p className="text-xs text-warning mt-2 font-medium">Awaiting verification</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-2 card-hover overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Rating</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {drivers.length
                ? (drivers.reduce((acc, driver) => acc + driver.rating, 0) / drivers.length).toFixed(1)
                : "0"}
            </div>
            <p className="text-xs text-success mt-2 font-medium">Excellent performance</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-effect border-2 card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-accent to-warning rounded-full" />
            Driver Management
          </CardTitle>
          <CardDescription>Review driver applications and monitor performance</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading drivers...</p>
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
                        className={`${
                          driver.status === "active" ? "bg-success text-success-foreground" : ""
                        } ${driver.status === "pending" ? "bg-warning text-warning-foreground" : ""}`}
                      >
                        {driver.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {driver.status === "pending" ? (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-success text-success-foreground hover:bg-success/90"
                              onClick={() => statusMutation.mutate({ id: driver._id, status: "active" })}
                            >
                              Approve
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => statusMutation.mutate({ id: driver._id, status: "inactive" })}>
                              Reject
                            </Button>
                          </>
                        ) : (
                          <Button variant="outline" size="sm">
                            View Profile
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
