import { NextRequest, NextResponse } from "next/server";
import { generateOTP, storeOTP, isAdminEmail } from "@/lib/auth";
import { sendOTPEmail } from "@/lib/mailer";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
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

    if (!isAdminEmail(email)) {
      return NextResponse.json({
        message: "If that email is registered, an OTP was sent.",
      });
    }

    const otp = generateOTP();
    storeOTP(email, otp);
    await sendOTPEmail(email, otp);
    console.log("[send-otp] email sent successfully to", email);
    return NextResponse.json({
      message: "If that email is registered, an OTP was sent.",
    });
  } catch (err) {
    console.error(
      "[send-otp] FAILED:",
      err instanceof Error ? err.message : String(err),
    );
    return NextResponse.json({ error: "Failed to send OTP." }, { status: 500 });
  }
}
