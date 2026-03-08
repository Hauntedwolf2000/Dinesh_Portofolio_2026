import { SignJWT, jwtVerify } from "jose";
import fs from "fs";
import path from "path";

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

// ── File-persisted OTP store ─────────────────────────────────
const OTP_FILE = path.join(process.cwd(), "data", "otp_store.json");

type OTPStore = Record<
  string,
  { code: string; expiresAt: number; attempts: number }
>;

function readOTPStore(): OTPStore {
  try {
    if (fs.existsSync(OTP_FILE)) {
      return JSON.parse(fs.readFileSync(OTP_FILE, "utf-8"));
    }
  } catch {
    /* ignore */
  }
  return {};
}

function writeOTPStore(store: OTPStore) {
  try {
    fs.mkdirSync(path.dirname(OTP_FILE), { recursive: true });
    fs.writeFileSync(OTP_FILE, JSON.stringify(store, null, 2));
  } catch {
    /* ignore */
  }
}

export function generateOTP(): string {
  // Crypto-random 6-digit OTP
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return String(100000 + (array[0] % 900000));
}

export function storeOTP(email: string, code: string) {
  const minutes = Math.min(
    parseInt(process.env.OTP_EXPIRY_MINUTES || "10"),
    30,
  );
  const store = readOTPStore();
  store[email.toLowerCase().trim()] = {
    code,
    expiresAt: Date.now() + minutes * 60 * 1000,
    attempts: 0,
  };
  writeOTPStore(store);
}

export function verifyOTP(email: string, code: string): boolean {
  const store = readOTPStore();
  const key = email.toLowerCase().trim();
  const entry = store[key];

  if (!entry) return false;

  if (Date.now() > entry.expiresAt) {
    delete store[key];
    writeOTPStore(store);
    return false;
  }

  // Max 5 wrong attempts before locking the OTP
  if (entry.attempts >= 5) {
    delete store[key];
    writeOTPStore(store);
    return false;
  }

  if (entry.code !== code.trim()) {
    entry.attempts++;
    writeOTPStore(store);
    return false;
  }

  // Valid — delete after single use
  delete store[key];
  writeOTPStore(store);
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
