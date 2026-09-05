import { NextRequest, NextResponse } from "next/server";
import { DJANGO } from "@/lib/django";
import { setTokens } from "@/lib/session";

export async function POST(req: NextRequest) {
  const res = await fetch(`${DJANGO}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(await req.json()),
  });
  const data = await res.json();
  if (!res.ok) {
    // simplejwt returns {"detail": "No active account found with the given
    // credentials"} — reshape it so the form can render it like any other error.
    return NextResponse.json(
      { detail: data.detail ?? "Wrong username or password." },
      { status: res.status },
    );
  }
  await setTokens(data.access, data.refresh);

  const me = await fetch(`${DJANGO}/auth/me/`, {
    headers: { Authorization: `Bearer ${data.access}` },
    cache: "no-store",
  });
  return NextResponse.json(await me.json());
}
