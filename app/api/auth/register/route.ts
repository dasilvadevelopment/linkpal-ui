import { NextRequest, NextResponse } from "next/server";
import { DJANGO } from "@/lib/django";
import { setTokens } from "@/lib/session";

export async function POST(req: NextRequest) {
  const res = await fetch(`${DJANGO}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(await req.json()),
  });
  const data = await res.json();
  if (!res.ok) return NextResponse.json(data, { status: res.status });

  await setTokens(data.access, data.refresh);
  return NextResponse.json(data.user, { status: 201 });
}
