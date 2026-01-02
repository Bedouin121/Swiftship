import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { apiRequest } from "@/lib/api-client";

type SalesDataPoint = { month: string; sales: number; orders: number };
type CategoryDataPoint = { name: string; value: number };
type FulfillmentDataPoint = { day: string; fulfilled: number; pending: number };

export default function VendorAnalytics() {
  const salesQuery = useQuery<{ data: SalesDataPoint[] }>({
    queryKey: ["analytics", "sales"],
    queryFn: () => apiRequest<{ data: SalesDataPoint[] }>("/analytics/vendor/sales"),
  });
  const categoriesQuery = useQuery<{ data: CategoryDataPoint[] }>({
    queryKey: ["analytics", "categories"],
    queryFn: () => apiRequest<{ data: CategoryDataPoint[] }>("/analytics/vendor/categories"),
  });
  const fulfillmentQuery = useQuery<{ data: FulfillmentDataPoint[] }>({
    queryKey: ["analytics", "fulfillment"],
    queryFn: () => apiRequest<{ data: FulfillmentDataPoint[] }>("/analytics/vendor/fulfillment"),
  });

  const salesData = salesQuery.data?.data ?? [];
  const productData = categoriesQuery.data?.data ?? [];
  const fulfillmentData = fulfillmentQuery.data?.data ?? [];

  const totalSales = salesData.reduce((acc, point) => acc + point.sales, 0);
  const totalOrders = salesData.reduce((acc, point) => acc + point.orders, 0);
  const avgOrderValue = totalOrders ? totalSales / totalOrders : 0;
  const totalFulfilled = fulfillmentData.reduce((acc, point) => acc + point.fulfilled, 0);
  const totalPending = fulfillmentData.reduce((acc, point) => acc + point.pending, 0);
  const fulfillmentRate = fulfillmentData.length ? (totalFulfilled / (totalFulfilled + totalPending || 1)) * 100 : 0;

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Track your sales and fulfillment metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">${totalSales.toLocaleString()}</p>
            <p className="text-sm text-success mt-1">Live sales (last months)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{totalOrders}</p>
            <p className="text-sm text-success mt-1">Orders tracked</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">${avgOrderValue.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-1">Avg order value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fulfillment Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{`${Math.round(fulfillmentRate)}%`}</p>
            <p className="text-sm text-success mt-1">Fulfillment rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales & Orders Trend</CardTitle>
            <CardDescription>Monthly sales and order count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="sales" stroke="hsl(var(--primary))" name="Sales ($)" />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="hsl(var(--chart-2))" name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Category Distribution</CardTitle>
            <CardDescription>Sales by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Fulfillment Rate</CardTitle>
            <CardDescription>Fulfilled vs pending orders by day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fulfillmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="fulfilled" fill="hsl(var(--success))" name="Fulfilled (%)" />
                <Bar dataKey="pending" fill="hsl(var(--warning))" name="Pending (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
