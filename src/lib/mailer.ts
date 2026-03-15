export async function sendOTPEmail(to: string, otp: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const expiry = process.env.OTP_EXPIRY_MINUTES || "10";
  const name = process.env.SMTP_FROM_NAME || "Portfolio Admin";

  if (!apiKey)
    throw new Error("RESEND_API_KEY is not set in environment variables");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${name} <hauntedwolf2000@gmail.com>`,
      to: [to],
      subject: "🔐 Your Admin Login OTP",
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;background:#0d0d14;color:#e2e8f0;border-radius:16px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#7c3aed,#ec4899);padding:32px;text-align:center;">
            <h1 style="margin:0;color:white;font-size:28px;">Admin Login</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);">Portfolio Dashboard Access</p>
          </div>
          <div style="padding:32px;text-align:center;">
            <p style="color:#94a3b8;margin-bottom:24px;">Your one-time password (valid for ${expiry} minutes):</p>
            <div style="background:#12121e;border:2px solid #7c3aed;border-radius:12px;padding:24px;display:inline-block;">
              <span style="font-size:42px;font-weight:800;letter-spacing:12px;color:#a78bfa;font-family:monospace;">${otp}</span>
            </div>
            <p style="color:#64748b;font-size:13px;margin-top:24px;">If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend API error: ${err}`);
  }
}

export async function sendContactEmail(opts: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.ADMIN_EMAIL!;
  const ownerName = process.env.NEXT_PUBLIC_OWNER_NAME || "Portfolio Owner";
  const fromName = process.env.SMTP_FROM_NAME || "Portfolio Contact";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  if (!apiKey)
    throw new Error("RESEND_API_KEY is not set in environment variables");

  function esc(s: string) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const safeName = esc(opts.name.trim());
  const safeEmail = esc(opts.email.trim());
  const safeSubject = opts.subject ? esc(opts.subject.trim()) : "";
  const safeMessage = esc(opts.message.trim());

  // Email to you
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${fromName} <onboarding@resend.dev>`,
      to: [ownerEmail],
      reply_to: opts.email,
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
                  <td style="padding:8px 0;font-weight:600;">${safeName}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Email</td>
                  <td style="padding:8px 0;"><a href="mailto:${safeEmail}" style="color:#a78bfa;">${safeEmail}</a></td></tr>
              ${
                safeSubject
                  ? `<tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;">Subject</td>
                  <td style="padding:8px 0;">${safeSubject}</td></tr>`
                  : ""
              }
            </table>
            <div style="background:#12121e;border-left:3px solid #7c3aed;border-radius:8px;padding:18px 20px;">
              <p style="margin:0;color:#cbd5e1;line-height:1.7;white-space:pre-wrap;">${safeMessage}</p>
            </div>
            <div style="margin-top:24px;">
              <a href="mailto:${safeEmail}?subject=Re: ${encodeURIComponent((opts.subject || "Your message").slice(0, 200))}"
                 style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#ec4899);color:#fff;
                        text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600;font-size:14px;">
                Reply to ${safeName}
              </a>
            </div>
          </div>
        </div>
      `,
    }),
  });

  // Auto-reply to visitor
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${ownerName} <onboarding@resend.dev>`,
      to: [opts.email],
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
    }),
  });
}
