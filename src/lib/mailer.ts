import nodemailer from 'nodemailer'

export async function sendOTPEmail(to: string, otp: string) {
  const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
    port:   parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const name = process.env.SMTP_FROM_NAME || 'Portfolio Admin'
  const from = `"${name}" <${process.env.SMTP_USER}>`

  await transporter.sendMail({
    from,
    to,
    subject: '🔐 Your Admin Login OTP',
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; background: #0d0d14; color: #e2e8f0; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 32px; text-align: center;">
          <h1 style="margin:0; color: white; font-size: 28px;">Admin Login</h1>
          <p style="margin:8px 0 0; color: rgba(255,255,255,0.8);">Portfolio Dashboard Access</p>
        </div>
        <div style="padding: 32px; text-align: center;">
          <p style="color: #94a3b8; margin-bottom: 24px;">Your one-time password (valid for ${process.env.OTP_EXPIRY_MINUTES || 10} minutes):</p>
          <div style="background: #12121e; border: 2px solid #7c3aed; border-radius: 12px; padding: 24px; display: inline-block; margin: 0 auto;">
            <span style="font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #a78bfa; font-family: monospace;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 13px; margin-top: 24px;">If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    `,
  })
}
