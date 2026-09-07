import { clearTokens, getAccess, getRefresh, setTokens } from "@/lib/session";

export const DJANGO = process.env.API_URL ?? "http://127.0.0.1:8000/api";

/**
 * Call Django from a server context with the access token attached.
 * On 401 it tries the refresh token once, then gives up — the caller should
 * redirect to /login rather than loop.
 */
export async function django(path: string, init: RequestInit = {}) {
  const send = async (token?: string) =>
    fetch(`${DJANGO}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
      cache: "no-store",
    });

  let res = await send(await getAccess());
  if (res.status !== 401) return res;

  const refresh = await getRefresh();
  if (!refresh) return res;

  const renewed = await fetch(`${DJANGO}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!renewed.ok) {
    await clearTokens();
    return res;
  }
  const data = await renewed.json();
  // ROTATE_REFRESH_TOKENS is on, so a fresh refresh token comes back too.
  await setTokens(data.access, data.refresh ?? refresh);
  return send(data.access);
}
