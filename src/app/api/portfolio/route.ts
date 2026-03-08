import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getPortfolioData, savePortfolioData } from "@/lib/dataStore";
import { v4 as uuidv4 } from "uuid";

// ── Strict section allowlist — no dynamic keys accepted ─────
const ALLOWED_SECTIONS = new Set([
  "projects",
  "skills",
  "experience",
  "certifications",
  "achievements",
  "testimonials",
  "about",
  "resume",
]);

type Section =
  | "projects"
  | "skills"
  | "experience"
  | "certifications"
  | "achievements"
  | "testimonials"
  | "about"
  | "resume";

// ── Auth helper ──────────────────────────────────────────────
async function authenticate(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ── Sanitize a value: trim strings, cap lengths, block objects ─
function sanitizeValue(val: unknown, maxLen = 5000): unknown {
  if (typeof val === "string") return val.trim().slice(0, maxLen);
  if (typeof val === "number") return isFinite(val) ? val : 0;
  if (typeof val === "boolean") return val;
  if (Array.isArray(val))
    return val.map((v) => sanitizeValue(v, 500)).slice(0, 200);
  return val; // null / undefined pass through
}

// ── Deep-sanitize a flat object (no nested objects allowed) ──
function sanitizeItem(raw: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw)) {
    // Block prototype pollution
    if (k === "__proto__" || k === "constructor" || k === "prototype") continue;
    // Only allow safe key names
    if (!/^[a-zA-Z0-9_-]{1,64}$/.test(k)) continue;
    out[k] = sanitizeValue(v);
  }
  return out;
}

// ════════════════════════════════════════════════════════════
//  GET — public, read-only
// ════════════════════════════════════════════════════════════
export async function GET(req: NextRequest) {
  try {
    const section = req.nextUrl.searchParams.get("section");

    // Validate section if provided
    if (section && !ALLOWED_SECTIONS.has(section)) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }

    const data = getPortfolioData();

    if (section === "resume")
      return NextResponse.json({ resumeUrl: data.resumeUrl ?? "" });
    if (section)
      return NextResponse.json(
        (data as unknown as Record<string, unknown>)[section] ?? null,
      );
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}

// ════════════════════════════════════════════════════════════
//  POST — create new item (admin only)
// ════════════════════════════════════════════════════════════
export async function POST(req: NextRequest) {
  const user = await authenticate(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const { section, item } = body as {
      section: string;
      item: Record<string, unknown>;
    };

    if (!section || !ALLOWED_SECTIONS.has(section)) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return NextResponse.json(
        { error: "item must be an object" },
        { status: 400 },
      );
    }

    const safeItem = sanitizeItem(item);
    const data = getPortfolioData();

    if (section === "about") {
      data.about = { ...data.about, ...safeItem } as typeof data.about;
      savePortfolioData(data);
      return NextResponse.json({ ok: true, data: data.about });
    }

    if (section === "resume") {
      data.resumeUrl =
        typeof safeItem.resumeUrl === "string"
          ? safeItem.resumeUrl
          : (data.resumeUrl ?? "");
      savePortfolioData(data);
      return NextResponse.json({ ok: true });
    }

    const arr = (data as unknown as Record<string, unknown[]>)[
      section
    ] as Record<string, unknown>[];
    if (!Array.isArray(arr))
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });

    // Cap array length to prevent unbounded growth
    if (arr.length >= 200) {
      return NextResponse.json(
        { error: "Maximum items reached for this section" },
        { status: 400 },
      );
    }

    const newItem = {
      ...safeItem,
      id: typeof safeItem.id === "string" ? safeItem.id : uuidv4(),
    };
    arr.push(newItem);
    savePortfolioData(data);
    return NextResponse.json({ ok: true, item: newItem });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

// ════════════════════════════════════════════════════════════
//  PUT — update existing item (admin only)
// ════════════════════════════════════════════════════════════
export async function PUT(req: NextRequest) {
  const user = await authenticate(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const { section, item } = body as {
      section: string;
      item: Record<string, unknown>;
    };

    if (!section || !ALLOWED_SECTIONS.has(section)) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return NextResponse.json(
        { error: "item must be an object" },
        { status: 400 },
      );
    }

    const safeItem = sanitizeItem(item);
    const data = getPortfolioData();

    if (section === "about") {
      data.about = { ...data.about, ...safeItem } as typeof data.about;
      savePortfolioData(data);
      return NextResponse.json({ ok: true });
    }

    if (section === "resume") {
      data.resumeUrl =
        typeof safeItem.resumeUrl === "string"
          ? safeItem.resumeUrl
          : (data.resumeUrl ?? "");
      savePortfolioData(data);
      return NextResponse.json({ ok: true });
    }

    const arr = (data as unknown as Record<string, unknown[]>)[
      section
    ] as Record<string, unknown>[];
    if (!Array.isArray(arr))
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });

    const id = typeof safeItem.id === "string" ? safeItem.id : null;
    if (!id)
      return NextResponse.json(
        { error: "item.id is required for update" },
        { status: 400 },
      );

    const idx = arr.findIndex((i) => i.id === id);
    if (idx === -1)
      return NextResponse.json({ error: "Item not found" }, { status: 404 });

    arr[idx] = { ...arr[idx], ...safeItem };
    savePortfolioData(data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// ════════════════════════════════════════════════════════════
//  DELETE — remove item (admin only)
// ════════════════════════════════════════════════════════════
export async function DELETE(req: NextRequest) {
  const user = await authenticate(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const section = req.nextUrl.searchParams.get("section");
    const id = req.nextUrl.searchParams.get("id");

    if (!section || !ALLOWED_SECTIONS.has(section)) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }
    if (!id || typeof id !== "string" || id.length > 100) {
      return NextResponse.json(
        { error: "Valid id is required" },
        { status: 400 },
      );
    }

    const data = getPortfolioData();
    const arr = (data as unknown as Record<string, unknown[]>)[
      section
    ] as Record<string, unknown>[];
    if (!Array.isArray(arr))
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });

    const idx = arr.findIndex((i) => i.id === id);
    if (idx === -1)
      return NextResponse.json({ error: "Item not found" }, { status: 404 });

    arr.splice(idx, 1);
    savePortfolioData(data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
