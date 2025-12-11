import type { Role } from "@/types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";
const DEMO_VENDOR_ID = import.meta.env.VITE_DEMO_VENDOR_ID ?? "";

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  role?: Role;
  vendorId?: string;
  headers?: HeadersInit;
};

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = "GET", body, role = "admin", vendorId, headers: customHeaders } = options;
  const headers = new Headers(customHeaders);
  headers.set("Content-Type", "application/json");
  headers.set("x-role", role);

  if (role === "vendor") {
    const effectiveVendorId = vendorId ?? DEMO_VENDOR_ID;
    if (!effectiveVendorId) {
      throw new Error("Vendor ID is required for vendor API calls. Set VITE_DEMO_VENDOR_ID or pass vendorId.");
    }
    headers.set("x-vendor-id", effectiveVendorId);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let errorMessage = `Request to ${path} failed`;
    try {
      const error = await response.json();
      if (error?.message) {
        errorMessage = error.message;
      }
    } catch {
      // ignore json parse errors
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

