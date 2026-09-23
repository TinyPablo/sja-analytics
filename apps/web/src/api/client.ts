/**
 * All requests go through the nginx front at the same origin, so a relative
 * base is all that is needed - there is no CORS involved in any environment.
 */
const API_BASE = "/api";

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    throw new Error(`GET ${path} failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}
