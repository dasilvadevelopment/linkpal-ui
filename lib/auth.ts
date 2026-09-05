export type User = { id: number; username: string; email: string };

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
  const res = await fetch(`/api/auth/register`, {
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

export async function login(
  username: string,
  password: string,
): Promise<User> {
  const res = await fetch(`/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (res.ok) return res.json();

  const data = await res.json();
  throw new AuthError({ detail: [data.detail ?? "Login failed."] });
}
