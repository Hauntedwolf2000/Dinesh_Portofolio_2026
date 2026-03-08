import { NextRequest, NextResponse } from "next/server";
import { generateOTP, storeOTP, isAdminEmail } from "@/lib/auth";
import { sendOTPEmail } from "@/lib/mailer";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  // Rate limit: 5 OTP requests per IP per 15 minutes
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed, resetIn } = rateLimit(`otp:${ip}`, 5, 15 * 60 * 1000);

  if (!allowed) {
    return NextResponse.json(
      {
        error: `Too many requests. Try again in ${Math.ceil(resetIn / 60000)} minutes.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(resetIn / 1000)) },
      },
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { email } = body;

    if (!email || typeof email !== "string" || email.length > 254) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 },
      );
    }

    // Always return same message — prevents email enumeration
    if (!isAdminEmail(email)) {
      return NextResponse.json({
        message: "If that email is registered, an OTP was sent.",
      });
    }

    const otp = generateOTP();
    storeOTP(email, otp);
    await sendOTPEmail(email, otp);

    return NextResponse.json({
      message: "If that email is registered, an OTP was sent.",
    });
  } catch (err) {
    // Never leak error details to client
    console.error("[send-otp] error occurred");
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
