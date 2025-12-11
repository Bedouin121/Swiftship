export type Role = "admin" | "vendor";

export interface ApiListResponse<T> {
  data: T[];
}

export interface ApiItemResponse<T> {
  data: T;
}

export interface DashboardMetrics {
  activeVendors: number;
  totalDeliveries: number;
  activeDrivers: number;
  microhubs: number;
  averageDeliveryTimeHours: number;
  successRate: number;
}

export interface DashboardActivity {
  id: string;
  vendor: string;
  action: string;
  time: string;
  status: string;
}

export interface DashboardResponse {
  metrics: DashboardMetrics;
  activities: DashboardActivity[];
}

export interface Microhub {
  _id: string;
  name: string;
  location: string;
  capacity: number;
  utilized: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  _id: string;
  name: string;
  email: string;
  status: string;
  products: number;
  registeredAt?: string;
  createdAt: string;
}

export interface Driver {
  _id: string;
  name: string;
  phone: string;
  deliveries: number;
  rating: number;
  status: string;
  joinedAt?: string;
  createdAt: string;
}

export interface InventoryLog {
  _id: string;
  type: "Inbound" | "Outbound";
  product: string;
  quantity: number;
  vendor: string;
  processedAt: string;
  processedBy: string;
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  createdAt: string;
}

export interface Order {
  _id: string;
  customerName: string;
  productsCount: number;
  total: number;
  status: string;
  eta: string;
  placedAt?: string;
  createdAt: string;
}

export interface Invoice {
  _id: string;
  vendor: string | { _id: string; name: string; email?: string };
  amount: number;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
  createdAt: string;
}

export interface FleetMetrics {
  totalDeliveries: number;
  onTimeRate: number;
  averageDeliveryTime: number;
  issuesReported: number;
  topPerformers: Driver[];
}

