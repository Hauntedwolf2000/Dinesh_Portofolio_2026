import { SignJWT, jwtVerify } from "jose";

// Crash loudly at startup if JWT_SECRET is missing or weak
const rawSecret = process.env.JWT_SECRET;
if (
  !rawSecret ||
  rawSecret.length < 32 ||
  rawSecret === "fallback_secret_please_change"
) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "FATAL: JWT_SECRET is missing or too weak. Set a 64-char random string in env.",
    );
  } else {
    console.warn(
      "[auth] WARNING: JWT_SECRET not set or weak. DO NOT deploy this to production.",
    );
  }
}

const secret = new TextEncoder().encode(
  rawSecret || "dev_only_secret_do_not_use_in_prod",
);

// ── Global in-memory OTP store ───────────────────────────────
// Declared on globalThis so it survives Next.js hot-reloads in dev
// and persists across requests on the same Railway instance in prod

type OTPEntry = { code: string; expiresAt: number; attempts: number };

declare global {
  // eslint-disable-next-line no-var
  var __otpStore: Map<string, OTPEntry> | undefined;
}

const otpStore: Map<string, OTPEntry> =
  globalThis.__otpStore ?? (globalThis.__otpStore = new Map());

// Purge expired entries to prevent unbounded memory growth
function purgeExpired() {
  const now = Date.now();
  for (const [key, entry] of otpStore) {
    if (now > entry.expiresAt) otpStore.delete(key);
  }
}

export function generateOTP(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return String(100000 + (array[0] % 900000));
}

export function storeOTP(email: string, code: string) {
  purgeExpired();
  const minutes = Math.min(
    parseInt(process.env.OTP_EXPIRY_MINUTES || "10"),
    30,
  );
  otpStore.set(email.toLowerCase().trim(), {
    code,
    expiresAt: Date.now() + minutes * 60 * 1000,
    attempts: 0,
  });
}

export function verifyOTP(email: string, code: string): boolean {
  const key = email.toLowerCase().trim();
  const entry = otpStore.get(key);

  if (!entry) return false;

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(key);
    return false;
  }

  // Max 5 wrong attempts before locking the OTP
  if (entry.attempts >= 5) {
    otpStore.delete(key);
    return false;
  }

  if (entry.code !== code.trim()) {
    entry.attempts++;
    return false;
  }

  // Valid — delete after single use
  otpStore.delete(key);
  return true;
}

export async function signToken(email: string): Promise<string> {
  return new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);
}

export async function verifyToken(
  token: string,
): Promise<{ email: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { email: string; role: string };
  } catch {
    return null;
  }
}

export function isAdminEmail(email: string): boolean {
  const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const inputEmail = (email || "").toLowerCase().trim();
  return (
    inputEmail === adminEmail &&
    adminEmail !== "" &&
    adminEmail !== "hauntedwolf2000@gmail.com"
  );
}
