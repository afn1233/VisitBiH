import { useAuthStore } from '../store/useAuthStore';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Thin fetch wrapper shared by every api/* module: builds the URL, attaches
 * the auth token, serializes JSON, and turns non-2xx responses into errors
 * with a readable message pulled from the backend's `detail` field.
 */
export default async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = useAuthStore.getState().token;
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = res.statusText || `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.detail) message = data.detail;
    } catch {
      // no JSON body to read a message from
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}
