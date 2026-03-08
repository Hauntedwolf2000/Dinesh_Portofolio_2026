import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { verifyToken } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

// Strictly allowed extensions with their valid MIME types
const ALLOWED: Record<string, string[]> = {
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".png": ["image/png"],
  ".gif": ["image/gif"],
  ".webp": ["image/webp"],
  ".svg": ["image/svg+xml"],
  ".pdf": ["application/pdf"],
  ".mp4": ["video/mp4"],
  ".webm": ["video/webm"],
  ".mov": ["video/quicktime"],
};

export async function POST(req: NextRequest) {
  // Auth
  const token = req.cookies.get("admin_token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit uploads: 30 per hour per admin
  const { allowed } = rateLimit(`upload:${payload.email}`, 30, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Upload limit reached. Try again later." },
      { status: 429 },
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = ((formData.get("folder") as string) || "misc")
      .replace(/[^a-zA-Z0-9-]/g, "") // sanitize folder name — strip everything except alphanumeric and dash
      .slice(0, 32); // max 32 chars

    if (!file)
      return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // Extension check
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED[ext]) {
      return NextResponse.json(
        {
          error: `File type not allowed. Allowed: ${Object.keys(ALLOWED).join(", ")}`,
        },
        { status: 400 },
      );
    }

    // MIME type must match extension — prevents disguised executables
    const allowedMimes = ALLOWED[ext];
    if (!allowedMimes.includes(file.type)) {
      return NextResponse.json(
        { error: "File type mismatch" },
        { status: 400 },
      );
    }

    // Size limits
    const isVideo = file.type.startsWith("video/");
    const maxBytes = isVideo ? 200 * 1024 * 1024 : 10 * 1024 * 1024;
    const maxLabel = isVideo ? "200 MB" : "10 MB";
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: `File too large (max ${maxLabel})` },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Safe filename — timestamp + random suffix, original name stripped
    const baseName = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 40);
    const rand = Math.random().toString(36).slice(2, 8);
    const filename = `${folder}_${Date.now()}_${rand}_${baseName}${ext}`;

    // Ensure no path traversal — filename must not contain ..
    if (
      filename.includes("..") ||
      filename.includes("/") ||
      filename.includes("\\")
    ) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "resources");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({ url: `/resources/${filename}` });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export const config = { api: { bodyParser: false } };
