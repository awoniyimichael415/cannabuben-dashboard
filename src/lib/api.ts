import { getToken } from "./auth";
import { getAdminToken } from "./adminAuth";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ✅ Common auth headers (admin or normal user)
function getAuthHeaders(path?: string) {
  const token = getToken();
  const adminToken = getAdminToken();

  // If the path starts with /admin → use admin token
  if (path?.startsWith("/admin") && adminToken) {
    return { Authorization: `Bearer ${adminToken}` };
  }

  // Otherwise → use normal user token
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }

  return {};
}

// 🔹 GET helper (w/ auto-ban logout)
export async function apiGet(path: string) {
  const token = getToken(); // ✅ FIXED

  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  try {
    const json = await res.clone().json();

    // ✅ Auto logout if banned
    if (json?.banned === true) {
      alert("Your account has been banned. You have been logged out.");
      localStorage.clear();
      window.location.href = "/login";
      return res;
    }
  } catch {
    // ignore non-JSON responses
  }

  return res;
}

// 🔹 POST helper (protected routes)
export async function apiPost(path: string, body: any = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(path), // ✅ FIXED
    },
    body: JSON.stringify(body),
  });

  return res;
}
