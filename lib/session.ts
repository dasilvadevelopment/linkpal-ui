import { cookies } from "next/headers";

const ACCESS = "lp_access";
const REFRESH = "lp_refresh";

export async function setTokens(access: string, refresh: string) {
  const jar = await cookies();
  const secure = process.env.NODE_ENV === "production";
  jar.set(ACCESS, access, {
    httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 60 * 30,
  });
  jar.set(REFRESH, refresh, {
    httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearTokens() {
  const jar = await cookies();
  jar.delete(ACCESS);
  jar.delete(REFRESH);
}

export async function getAccess() {
  return (await cookies()).get(ACCESS)?.value;
}

export async function getRefresh() {
  return (await cookies()).get(REFRESH)?.value;
}
