"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register, AuthError } from "@/lib/auth";

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
      await register(
        String(f.get("username")),
        String(f.get("email")),
        String(f.get("password")),
        String(f.get("password2")),
      );
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

        <input name="email" type="email" placeholder="e-mail" required />
        {err?.errorFor("email") && <p>{err.errorFor("email")}</p>}

        <input name="password" type="password" placeholder="password" required />
        {err?.errorFor("password") && <p>{err.errorFor("password")}</p>}

        <input name="password2" type="password" placeholder="confirm password" required />
        {err?.errorFor("password2") && <p>{err.errorFor("password2")}</p>}

        <button disabled={busy}>{busy ? "Creating account" : "Create account"}</button>
      </form>
    </div>
  );
}