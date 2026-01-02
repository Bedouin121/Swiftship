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
  address?: string;
  thana?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  capacity: number;
  utilized: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  _id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  companyName: string;
  businessType: string;
  registrationNumber: string;
  taxId: string;
  website?: string;
  businessDescription: string;
  nidNumber: string;
  status: string;
  products: number;
  registeredAt?: string;
  createdAt: string;
}

export interface PendingVendor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  companyName: string;
  businessType: string;
  registrationNumber: string;
  taxId: string;
  website?: string;
  businessDescription: string;
  nidNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  city: string;
  companyName: string;
  businessType: string;
  registrationNumber: string;
  taxId: string;
  website?: string;
  businessDescription: string;
  nidNumber: string;
}

export interface LoginData {
  email: string;
  password: string;
  userType: string;
}

export interface AuthResponse {
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
}

export interface Driver {
  _id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  licenseNumber?: string;
  vehicleType?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  vehiclePlateNumber?: string;
  nidNumber?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
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
  phoneNumber?: string;
  productsCount: number;
  total: number;
  status: string;
  eta: string;
  placedAt?: string;
  createdAt: string;
  sourceMicrohubId?: string | Microhub;
  destinationMicrohubId?: string | Microhub;
  microhubId?: string; // Keep for backwards compatibility
  productId?: string;
  quantity?: number;
  deliveryType?: 'standard' | 'express';
  specifiedAddress?: string;
  deliveryLocation?: {
    coordinates: [number, number];
    address: string;
    addressDetails?: {
      address?: string;
      thana?: string;
      district?: string;
    };
  };
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

