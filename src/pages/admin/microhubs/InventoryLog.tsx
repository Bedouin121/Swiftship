import { useQuery } from "@tanstack/react-query";
import { ArrowDownCircle, ArrowUpCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/api-client";
import type { ApiListResponse, InventoryLog as InventoryLogType } from "@/types/api";

export default function InventoryLog() {
  const { data, isLoading } = useQuery<ApiListResponse<InventoryLogType>>({
    queryKey: ["inventory", "logs"],
    queryFn: () => apiRequest<ApiListResponse<InventoryLogType>>("/inventory/logs", { role: "admin" }),
  });

  const logs = data?.data ?? [];

  const getTypeIcon = (type: string) => {
    return type === "Inbound" ? (
      <ArrowDownCircle className="w-4 h-4 text-success" />
    ) : (
      <ArrowUpCircle className="w-4 h-4 text-primary" />
    );
  };

  const getTypeBadge = (type: string) => {
    return type === "Inbound" ? (
      <Badge variant="default" className="bg-success">Inbound</Badge>
    ) : (
      <Badge variant="default">Outbound</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Inventory Log</h1>
        <p className="text-muted-foreground">Track all inbound and outbound inventory movements</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Movements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{logs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inbound Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ArrowDownCircle className="w-5 h-5 text-success" />
              <p className="text-3xl font-bold text-foreground">
                {logs.filter(l => l.type === "Inbound").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Outbound Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ArrowUpCircle className="w-5 h-5 text-primary" />
              <p className="text-3xl font-bold text-foreground">
                {logs.filter(l => l.type === "Outbound").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Net Change</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">+135</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Movements</CardTitle>
          <CardDescription>All inventory transactions for today</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading logs...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Processed By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(log.type)}
                        {getTypeBadge(log.type)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{log.product}</TableCell>
                    <TableCell>{log.quantity}</TableCell>
                    <TableCell>{log.vendor}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        {new Date(log.processedAt).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>{log.processedBy}</TableCell>
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
