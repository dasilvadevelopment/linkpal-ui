const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

export class AuthError extends Error {
  fieldErrors: Record<string, string[]>;

  constructor(fieldErrors: Record<string, string[]>) {
    super("Authentication failed");
    this.name = "AuthError";
    this.fieldErrors = fieldErrors;
  }

  errorFor(field: string): string | undefined {
    return this.fieldErrors[field]?.[0];
  }
}

export async function register(
  username: string,
  email: string,
  password: string,
  password2: string,
): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, password2 }),
  });

  if (res.ok) return;

  if (res.status === 400) {
    throw new AuthError(await res.json());
  }

  throw new Error(`Registration failed (${res.status})`);
}
