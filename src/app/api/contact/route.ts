import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { sendContactEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed, resetIn } = rateLimit(`contact:${ip}`, 3, 60 * 60 * 1000);

  if (!allowed) {
    return NextResponse.json(
      {
        error: `Too many messages. Try again in ${Math.ceil(resetIn / 60000)} minutes.`,
      },
      { status: 429 },
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (
      typeof name !== "string" ||
      name.length > 100 ||
      typeof email !== "string" ||
      email.length > 254 ||
      typeof message !== "string" ||
      message.length > 5000 ||
      (subject && (typeof subject !== "string" || subject.length > 200))
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    await sendContactEmail({ name, email, subject, message });
    console.log("[contact] email sent from", email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(
      "[contact] FAILED:",
      err instanceof Error ? err.message : String(err),
    );
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
