"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, AuthError } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const [err, setErr] = useState<AuthError | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const f = new FormData(e.currentTarget);
    try {
      await login(String(f.get("username")), String(f.get("password")));
      router.push("/soullinks");
    } catch (e) {
      if (e instanceof AuthError) setErr(e);
      else throw e;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto h-screen border">
      <form onSubmit={onSubmit}>
        <input name="username" placeholder="username" required />
        {err?.errorFor("username") && <p>{err.errorFor("username")}</p>}

        <input name="password" type="password" placeholder="password" required />
        {err?.errorFor("password") && <p>{err.errorFor("password")}</p>}

        {err?.errorFor("detail") && <p>{err.errorFor("detail")}</p>}

        <button disabled={busy}>{busy ? "Signing in" : "Sign in"}</button>
      </form>
    </div>
  );
}
