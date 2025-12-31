import { useQuery } from "@tanstack/react-query";
import { MapPin, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import StockTrackingMap from "@/components/StockTrackingMap";
import { apiRequest } from "@/lib/api-client";
import type { ApiListResponse, Microhub } from "@/types/api";

export default function StockTracking() {
  const { data, isLoading } = useQuery<ApiListResponse<Microhub>>({
    queryKey: ["microhubs"],
    queryFn: () => apiRequest<ApiListResponse<Microhub>>("/microhubs", { role: "admin" }),
  });

  const stockItems = data?.data ?? [];
  const BARIKOI_API_KEY = import.meta.env.VITE_BARIKOI_API_KEY;

  const summarizeStatus = (hub: Microhub) => {
    const utilization = Math.round((hub.utilized / hub.capacity) * 100);
    if (utilization < 60) return "In Stock";
    if (utilization < 85) return "Low Stock";
    return "Critical";
  };

  const getStatusBadge = (hub: Microhub) => {
    const status = summarizeStatus(hub);
    switch (status) {
      case "In Stock":
        return <Badge variant="default">In Stock</Badge>;
      case "Low Stock":
        return <Badge variant="secondary">Low Stock</Badge>;
      case "Critical":
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Stock Tracking</h1>
        <p className="text-muted-foreground">Real-time inventory monitoring with location mapping</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {stockItems.reduce((acc, hub) => acc + hub.utilized, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Unique Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{stockItems.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-warning">
              {stockItems.filter((hub) => summarizeStatus(hub) === "Low Stock").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Critical Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">
              {stockItems.filter((hub) => summarizeStatus(hub) === "Critical").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Warehouse Location Map</CardTitle>
          <CardDescription>Visual layout of stock locations with utilization levels</CardDescription>
        </CardHeader>
        <CardContent>
          {BARIKOI_API_KEY ? (
            <StockTrackingMap 
              microhubs={stockItems} 
              apiKey={BARIKOI_API_KEY}
              height="400px"
            />
          ) : (
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">Map unavailable - API key not configured</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stock Details</CardTitle>
          <CardDescription>Current inventory levels and locations</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading stock data...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Microhub</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Utilized</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockItems.map((hub) => {
                  const utilization = Math.round((hub.utilized / hub.capacity) * 100);
                  const movement = utilization > 85 ? "-5" : "+3";
                  return (
                    <TableRow key={hub._id}>
                      <TableCell className="font-medium">{hub.name}</TableCell>
                      <TableCell>{hub.location}</TableCell>
                      <TableCell>{hub.capacity.toLocaleString()}</TableCell>
                      <TableCell>{hub.utilized.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(hub)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {movement.startsWith("+") ? (
                            <TrendingUp className="w-4 h-4 text-success" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-destructive" />
                          )}
                          <span className={movement.startsWith("+") ? "text-success" : "text-destructive"}>{movement}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
