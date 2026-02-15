// src/api.ts
import { getAuth } from "firebase/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function getHeaders() {
  const auth = getAuth();
  const user = auth.currentUser;
  const token = await user?.getIdToken();
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

async function handleResponse(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
    const err = new Error("Request failed");
    (err as any).status = res.status;
    (err as any).body = body;
    throw err;
  }
  return body;
}

export const api = {
  get: async (endpoint: string) => {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}${endpoint}`, { headers });
    return handleResponse(res);
  },
  post: async (endpoint: string, data: any) => {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
};