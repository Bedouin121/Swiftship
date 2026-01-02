import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, DollarSign, TrendingUp, Clock } from "lucide-react";
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
import type { ApiListResponse, Invoice } from "@/types/api";

export default function Billing() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<ApiListResponse<Invoice>>({
    queryKey: ["invoices"],
    queryFn: () => apiRequest<ApiListResponse<Invoice>>("/billing/invoices"),
  });

  const invoices = data?.data ?? [];

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Invoice["status"] }) =>
      apiRequest(`/billing/invoices/${id}`, {
        method: "PATCH",
        body: { status },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invoices"] }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Billing & Invoicing</h1>
        <p className="text-muted-foreground mt-1">Manage vendor billing and payment tracking</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ৳{invoices.reduce((acc, invoice) => acc + invoice.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-success mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Invoices</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {invoices.filter((invoice) => invoice.status === "pending").length}
            </div>
            <p className="text-xs text-warning mt-1">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Paid Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {invoices.filter((invoice) => invoice.status === "paid").length}
            </div>
            <p className="text-xs text-success mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {invoices.filter((invoice) => invoice.status === "overdue").length}
            </div>
            <p className="text-xs text-destructive mt-1">Needs action</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>Latest billing and payment activity</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading invoices...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => {
                  const vendorName = typeof invoice.vendor === "string" ? invoice.vendor : invoice.vendor?.name ?? "Unknown";
                  return (
                    <TableRow key={invoice._id}>
                      <TableCell className="font-medium">{invoice._id}</TableCell>
                      <TableCell>{vendorName}</TableCell>
                      <TableCell className="font-medium">৳{invoice.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={invoice.status === "paid" ? "default" : "secondary"}
                          className={`
                        ${invoice.status === "paid" ? "bg-success text-success-foreground" : ""}
                        ${invoice.status === "pending" ? "bg-warning text-warning-foreground" : ""}
                        ${invoice.status === "overdue" ? "bg-destructive text-destructive-foreground" : ""}
                      `}
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {invoice.status !== "paid" && (
                            <Button variant="default" size="sm" onClick={() => statusMutation.mutate({ id: invoice._id, status: "paid" })}>
                              Mark Paid
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            View
                          </Button>
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
