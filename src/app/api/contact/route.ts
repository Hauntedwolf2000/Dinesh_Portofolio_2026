import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { rateLimit } from "@/lib/rateLimit";

// HTML-escape to prevent injecting HTML into emails
function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export async function POST(req: NextRequest) {
  // Rate limit: 3 messages per IP per hour
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

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Type and length checks
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

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const ownerEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER!;
    const ownerName = process.env.NEXT_PUBLIC_OWNER_NAME || "Portfolio Owner";
    const fromName = process.env.SMTP_FROM_NAME || "Portfolio Contact";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

    // Sanitize all user input before putting in email
    const safeName = esc(name.trim());
    const safeEmail = esc(email.trim());
    const safeSubject = subject ? esc(subject.trim()) : "";
    const safeMessage = esc(message.trim());

    await transporter.sendMail({
      from: `"${fromName}" <${process.env.SMTP_USER}>`,
      to: ownerEmail,
      replyTo: `"${safeName}" <${safeEmail}>`,
      subject: `📩 New message from ${safeName}${safeSubject ? ` — ${safeSubject}` : ""}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;background:#0d0d14;color:#e2e8f0;border-radius:16px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#7c3aed,#ec4899);padding:28px 32px;">
            <h1 style="margin:0;color:#fff;font-size:22px;">New Contact Message</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">${siteUrl}</p>
          </div>
          <div style="padding:28px 32px;">
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
              <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;width:90px;">From</td>
                  <td style="padding:8px 0;font-weight:600;color:#e2e8f0;">${safeName}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Email</td>
                  <td style="padding:8px 0;"><a href="mailto:${safeEmail}" style="color:#a78bfa;">${safeEmail}</a></td></tr>
              ${
                safeSubject
                  ? `<tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Subject</td>
                  <td style="padding:8px 0;color:#e2e8f0;">${safeSubject}</td></tr>`
                  : ""
              }
            </table>
            <div style="background:#12121e;border-left:3px solid #7c3aed;border-radius:8px;padding:18px 20px;">
              <p style="margin:0;color:#cbd5e1;line-height:1.7;white-space:pre-wrap;">${safeMessage}</p>
            </div>
            <div style="margin-top:24px;">
              <a href="mailto:${safeEmail}?subject=Re: ${encodeURIComponent((subject || "Your message").slice(0, 200))}"
                 style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#ec4899);color:#fff;
                        text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600;font-size:14px;">
                Reply to ${safeName}
              </a>
            </div>
          </div>
          <div style="padding:16px 32px;background:#0a0a12;text-align:center;">
            <p style="margin:0;color:#475569;font-size:12px;">Sent from your portfolio contact form</p>
          </div>
        </div>
      `,
    });

    // Auto-reply to sender
    await transporter.sendMail({
      from: `"${ownerName}" <${process.env.SMTP_USER}>`,
      to: `"${safeName}" <${safeEmail}>`,
      subject: `Thanks for reaching out, ${safeName}! 👋`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;background:#0d0d14;color:#e2e8f0;border-radius:16px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#7c3aed,#ec4899);padding:28px 32px;">
            <h1 style="margin:0;color:#fff;font-size:22px;">Thanks for reaching out!</h1>
          </div>
          <div style="padding:28px 32px;">
            <p style="color:#cbd5e1;line-height:1.7;">Hi ${safeName},</p>
            <p style="color:#cbd5e1;line-height:1.7;">I've received your message and will get back to you as soon as possible — usually within 24–48 hours.</p>
            <div style="background:#12121e;border-left:3px solid #7c3aed;border-radius:8px;padding:16px 20px;margin:20px 0;">
              <p style="margin:0;color:#64748b;font-size:12px;margin-bottom:6px;">Your message:</p>
              <p style="margin:0;color:#94a3b8;font-size:13px;white-space:pre-wrap;">${safeMessage}</p>
            </div>
            <p style="color:#cbd5e1;line-height:1.7;">Best,<br/><strong style="color:#a78bfa;">${esc(ownerName)}</strong></p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
