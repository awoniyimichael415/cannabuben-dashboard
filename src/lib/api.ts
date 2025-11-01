import { getToken } from "./auth";
import { getAdminToken } from "./adminAuth";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * ✅ Automatically chooses the correct token.
 * - For /api/admin/... → uses admin token.
 * - For /api/... → uses user token.
 */
function getAuthHeaders(path = "") {
  const adminToken = getAdminToken();
  const userToken = getToken();

  // Prefer admin token for admin routes only
  const isAdminRoute = path.startsWith("/api/admin");
  const token = isAdminRoute ? adminToken : userToken;

  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 🔹 GET helper
export async function apiGet(path: string) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(path),
    },
  });
  return res;
}

// 🔹 POST helper
export async function apiPost(path: string, body: any = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(path),
    },
    body: JSON.stringify(body),
  });
  return res;
}
