import { getToken } from "./auth";
import { getAdminToken } from "./adminAuth";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// 🔹 Reusable GET helper
export async function apiGet(path: string) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  try {
    const json = await res.clone().json();

    // 🚫 Auto logout if banned
    if (json?.banned === true) {
      alert("Your account has been banned. You have been logged out.");
      localStorage.clear();
      window.location.href = "/login";
      return res;
    }
  } catch {
    // ignore if not JSON
  }

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
