import { Users, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function ResourceAllocation() {
  const staff = [
    { name: "John Doe", role: "Warehouse Manager", shift: "Morning", utilization: 95, tasks: 12 },
    { name: "Jane Smith", role: "Stock Handler", shift: "Morning", utilization: 88, tasks: 10 },
    { name: "Bob Wilson", role: "Logistics Coordinator", shift: "Afternoon", utilization: 92, tasks: 8 },
    { name: "Alice Brown", role: "Stock Handler", shift: "Afternoon", utilization: 78, tasks: 7 },
    { name: "Charlie Davis", role: "Quality Inspector", shift: "Evening", utilization: 85, tasks: 6 },
  ];

  const equipment = [
    { name: "Forklift #1", type: "Heavy Lift", status: "Active", utilization: 92, location: "Zone A" },
    { name: "Forklift #2", type: "Heavy Lift", status: "Active", utilization: 87, location: "Zone B" },
    { name: "Pallet Jack #1", type: "Light Lift", status: "Active", utilization: 75, location: "Zone C" },
    { name: "Scanner Unit #1", type: "Technology", status: "Idle", utilization: 45, location: "Station 1" },
  ];

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "text-success";
    if (utilization >= 70) return "text-primary";
    return "text-warning";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Resource Allocation</h1>
        <p className="text-muted-foreground">Manage staff and equipment capacity</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{staff.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {equipment.filter(e => e.status === "Active").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg Staff Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {Math.round(staff.reduce((acc, s) => acc + s.utilization, 0) / staff.length)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg Equipment Use</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {Math.round(equipment.reduce((acc, e) => acc + e.utilization, 0) / equipment.length)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Allocation</CardTitle>
          <CardDescription>Current staff deployment and utilization</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Active Tasks</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{member.shift}</Badge>
                  </TableCell>
                  <TableCell>{member.tasks}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${getUtilizationColor(member.utilization)}`}>
                          {member.utilization}%
                        </span>
                      </div>
                      <Progress value={member.utilization} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span className="text-sm text-success">Efficient</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Equipment Allocation</CardTitle>
          <CardDescription>Equipment status and utilization tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {equipment.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="font-medium">{item.name}</p>
                    <Badge variant={item.status === "Active" ? "default" : "secondary"}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{item.type}</span>
                    <span>•</span>
                    <span>{item.location}</span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className={`text-sm font-medium ${getUtilizationColor(item.utilization)}`}>
                    {item.utilization}% utilized
                  </p>
                  <div className="w-32">
                    <Progress value={item.utilization} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
