import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getPortfolioData, savePortfolioData } from "@/lib/dataStore";
import { v4 as uuidv4 } from "uuid";

type Section =
  | "projects"
  | "skills"
  | "experience"
  | "certifications"
  | "achievements"
  | "testimonials"
  | "about"
  | "resume";

async function authenticate(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(req: NextRequest) {
  const section = req.nextUrl.searchParams.get("section") as Section;
  const data = getPortfolioData();
  if (section === "resume")
    return NextResponse.json({ resumeUrl: data.resumeUrl });
  if (section && section in data)
    return NextResponse.json(
      (data as unknown as Record<string, unknown>)[section],
    );
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const user = await authenticate(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { section, item } = body as {
    section: Section;
    item: Record<string, unknown>;
  };
  if (!section || !item)
    return NextResponse.json(
      { error: "section and item required" },
      { status: 400 },
    );

  const data = getPortfolioData();

  if (section === "about") {
    data.about = { ...data.about, ...item };
    savePortfolioData(data);
    return NextResponse.json({ ok: true, data: data.about });
  }

  if (section === "resume") {
    data.resumeUrl = String(item.resumeUrl ?? data.resumeUrl);
    savePortfolioData(data);
    return NextResponse.json({ ok: true });
  }

  const arr = (data as Record<string, unknown[]>)[section] as Record<
    string,
    unknown
  >[];
  if (!Array.isArray(arr))
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });

  const newItem = { ...item, id: item.id || uuidv4() };
  arr.push(newItem);
  savePortfolioData(data);
  return NextResponse.json({ ok: true, item: newItem });
}

export async function PUT(req: NextRequest) {
  const user = await authenticate(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { section, item } = body as {
    section: Section;
    item: Record<string, unknown>;
  };
  if (!section || !item)
    return NextResponse.json(
      { error: "section and item required" },
      { status: 400 },
    );

  const data = getPortfolioData();

  if (section === "about") {
    data.about = { ...data.about, ...item };
    savePortfolioData(data);
    return NextResponse.json({ ok: true });
  }

  if (section === "resume") {
    data.resumeUrl = String(item.resumeUrl ?? data.resumeUrl);
    savePortfolioData(data);
    return NextResponse.json({ ok: true });
  }

  const arr = (data as Record<string, unknown[]>)[section] as Record<
    string,
    unknown
  >[];
  if (!Array.isArray(arr))
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });

  const idx = arr.findIndex((i) => i.id === item.id);
  if (idx === -1)
    return NextResponse.json({ error: "Item not found" }, { status: 404 });

  arr[idx] = { ...arr[idx], ...item };
  savePortfolioData(data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const user = await authenticate(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const section = req.nextUrl.searchParams.get("section") as Section;
  const id = req.nextUrl.searchParams.get("id");
  if (!section || !id)
    return NextResponse.json(
      { error: "section and id required" },
      { status: 400 },
    );

  const data = getPortfolioData();
  const arr = (data as Record<string, unknown[]>)[section] as Record<
    string,
    unknown
  >[];
  if (!Array.isArray(arr))
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });

  const idx = arr.findIndex((i) => i.id === id);
  if (idx === -1)
    return NextResponse.json({ error: "Item not found" }, { status: 404 });

  arr.splice(idx, 1);
  savePortfolioData(data);
  return NextResponse.json({ ok: true });
}
