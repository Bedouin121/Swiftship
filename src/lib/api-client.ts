import type { Role } from "@/types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
};

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers: customHeaders } = options;
  const headers = new Headers(customHeaders);
  headers.set("Content-Type", "application/json");

  // Get JWT token from localStorage
  const token = localStorage.getItem("token");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
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

    // Handle authentication errors
    if (response.status === 401) {
      // Clear invalid token and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      window.location.href = "/login";
      return Promise.reject(new Error("Authentication failed. Please login again."));
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

