import { NextRequest, NextResponse } from "next/server";
import { verifyOTP, isAdminEmail, signToken } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  // Rate limit: 10 attempts per IP per 15 minutes — blocks brute force
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed, resetIn } = rateLimit(`verify:${ip}`, 10, 15 * 60 * 1000);

  if (!allowed) {
    return NextResponse.json(
      {
        error: `Too many attempts. Try again in ${Math.ceil(resetIn / 60000)} minutes.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(resetIn / 1000)) },
      },
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { email, otp } = body;

    if (
      !email ||
      !otp ||
      typeof email !== "string" ||
      typeof otp !== "string"
    ) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 },
      );
    }

    // OTP must be exactly 6 digits
    if (!/^\d{6}$/.test(otp.trim())) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    if (!isAdminEmail(email)) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const valid = verifyOTP(email, otp);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 401 },
      );
    }

    const token = await signToken(email);

    const res = NextResponse.json({ message: "Logged in successfully" });
    res.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // upgraded from lax to strict
      maxAge: 60 * 60 * 8, // 8 hours (was 7 days — shorter is safer)
      path: "/admin", // scoped to /admin only
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
