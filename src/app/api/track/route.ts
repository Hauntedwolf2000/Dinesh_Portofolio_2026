import { NextRequest, NextResponse } from "next/server";
import { recordEvent } from "@/lib/dataStore";
import { rateLimit } from "@/lib/rateLimit";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_TYPES = new Set([
  "page_view",
  "project_click",
  "resume_download",
  "contact_click",
]);

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  // Rate limit: 60 tracking events per IP per minute (prevents pollution)
  const { allowed } = rateLimit(`track:${ip}`, 60, 60 * 1000);
  if (!allowed) return NextResponse.json({ ok: false }, { status: 429 });

  try {
    const body = await req.json().catch(() => ({}));

    // Validate event type against strict allowlist
    if (!body.type || !ALLOWED_TYPES.has(body.type)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Sanitize metadata — only allow simple string/number values, no nested objects
    const safeMetadata: Record<string, string> = {};
    if (body.metadata && typeof body.metadata === "object") {
      for (const [k, v] of Object.entries(body.metadata)) {
        if (typeof v === "string" || typeof v === "number") {
          const safeKey = String(k)
            .replace(/[^a-zA-Z0-9_]/g, "")
            .slice(0, 32);
          safeMetadata[safeKey] =
            typeof v === "string" ? v.slice(0, 200) : String(v);
        }
      }
    }

    recordEvent(
      {
        id: uuidv4(),
        type: body.type,
        metadata: safeMetadata,
        timestamp: new Date().toISOString(),
        ip,
        userAgent:
          typeof body.userAgent === "string"
            ? body.userAgent.slice(0, 300)
            : req.headers.get("user-agent") || "",
      },
      ip,
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
