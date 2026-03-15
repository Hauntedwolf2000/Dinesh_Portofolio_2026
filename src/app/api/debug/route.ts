import { NextResponse } from "next/server";

// DELETE THIS FILE after debugging — only for temporary use
export async function GET() {
  return NextResponse.json({
    ADMIN_EMAIL: process.env.ADMIN_EMAIL
      ? "✅ SET: " + process.env.ADMIN_EMAIL
      : "❌ EMPTY",
    JWT_SECRET: process.env.JWT_SECRET
      ? "✅ SET (length: " + process.env.JWT_SECRET.length + ")"
      : "❌ EMPTY",
    RESEND_API_KEY: process.env.RESEND_API_KEY ? "✅ SET" : "❌ EMPTY",
    SMTP_USER: process.env.SMTP_USER
      ? "✅ SET: " + process.env.SMTP_USER
      : "❌ EMPTY",
    NODE_ENV: process.env.NODE_ENV,
  });
}
