// src/lib/api.ts
import { getToken } from "./auth";

const LOCAL = "http://localhost:5000";
const PROD = "https://cannabuben-backend-fkxi.onrender.com";

// Use VITE_API_URL if defined, otherwise auto-select based on hostname
export const API_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? LOCAL
    : PROD);

export async function apiGet(path: string) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${getToken() || ""}` },
  });
  return res;
}

export async function apiPost(path: string, body: any) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken() || ""}`,
    },
    body: JSON.stringify(body),
  });
  return res;
}
