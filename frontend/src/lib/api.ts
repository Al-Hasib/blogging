const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface FetchOptions extends RequestInit {
  token?: string;
}

async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOpts } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOpts.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOpts,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || "API request failed");
  }

  return res.json();
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export async function refreshToken(): Promise<string | null> {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return null;

  try {
    const data = await fetchAPI<{ access: string }>("/auth/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh }),
    });
    localStorage.setItem("access_token", data.access);
    return data.access;
  } catch {
    clearTokens();
    return null;
  }
}

export const api = {
  get: <T>(endpoint: string, token?: string) =>
    fetchAPI<T>(endpoint, { token: token || getToken() || undefined }),

  post: <T>(endpoint: string, body: unknown, token?: string) =>
    fetchAPI<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      token: token || getToken() || undefined,
    }),

  patch: <T>(endpoint: string, body: unknown, token?: string) =>
    fetchAPI<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
      token: token || getToken() || undefined,
    }),

  delete: <T>(endpoint: string, token?: string) =>
    fetchAPI<T>(endpoint, {
      method: "DELETE",
      token: token || getToken() || undefined,
    }),

  upload: <T>(endpoint: string, formData: FormData, token?: string) => {
    const t = token || getToken() || undefined;
    const headers: Record<string, string> = {};
    if (t) headers["Authorization"] = `Bearer ${t}`;
    return fetchAPI<T>(endpoint, {
      method: "POST",
      body: formData,
      headers,
    });
  },
};
