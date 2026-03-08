import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev_only_secret_do_not_use_in_prod",
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Security headers on ALL responses ──────────────────
  const res = NextResponse.next();

  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires these
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-src https://www.youtube.com https://player.vimeo.com",
      "media-src 'self' https: blob:",
    ].join("; "),
  );

  if (process.env.NODE_ENV === "production") {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  // ── Protect /admin/* routes ─────────────────────────────
  if (
    pathname.startsWith("/admin/dashboard") ||
    pathname.startsWith("/admin/api")
  ) {
    const token = req.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      await jwtVerify(token, secret);
      return res;
    } catch {
      // Token invalid or expired — clear cookie and redirect
      const redirect = NextResponse.redirect(new URL("/admin/login", req.url));
      redirect.cookies.delete("admin_token");
      return redirect;
    }
  }

  // ── Block direct access to data files ──────────────────
  if (pathname.startsWith("/data/") || pathname.endsWith(".json")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return res;
}

export const config = {
  matcher: [
    // Apply to all routes except static files and _next internals
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
