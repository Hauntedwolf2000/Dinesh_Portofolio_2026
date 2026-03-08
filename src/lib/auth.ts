import { SignJWT, jwtVerify } from "jose";
import fs from "fs";
import path from "path";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret_please_change",
);

// ── File-persisted OTP store (survives hot reloads) ─────────
const OTP_FILE = path.join(process.cwd(), "data", "otp_store.json");

type OTPStore = Record<string, { code: string; expiresAt: number }>;

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
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeOTP(email: string, code: string) {
  const minutes = parseInt(process.env.OTP_EXPIRY_MINUTES || "10");
  const store = readOTPStore();
  store[email.toLowerCase().trim()] = {
    code,
    expiresAt: Date.now() + minutes * 60 * 1000,
  };
  writeOTPStore(store);
  console.log(`[OTP] Stored for ${email}, expires in ${minutes}min`);
}

export function verifyOTP(email: string, code: string): boolean {
  const store = readOTPStore();
  const key = email.toLowerCase().trim();
  const entry = store[key];

  console.log(
    `[OTP] Verifying for ${email} — stored: ${entry?.code}, received: ${code}`,
  );

  if (!entry) {
    console.log("[OTP] No entry found for this email");
    return false;
  }
  if (Date.now() > entry.expiresAt) {
    console.log("[OTP] Expired");
    delete store[key];
    writeOTPStore(store);
    return false;
  }
  if (entry.code !== code.trim()) {
    console.log("[OTP] Code mismatch");
    return false;
  }
  // Valid — delete after use
  delete store[key];
  writeOTPStore(store);
  return true;
}

export async function signToken(email: string): Promise<string> {
  return new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
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
  console.log(
    `[isAdminEmail] comparing "${inputEmail}" === "${adminEmail}" → ${inputEmail === adminEmail}`,
  );
  return inputEmail === adminEmail;
}
