import fs from "fs";
import path from "path";
import { PortfolioData, AnalyticsEvent } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const PORTFOLIO_FILE = path.join(DATA_DIR, "portfolio.json");
const ANALYTICS_FILE = path.join(DATA_DIR, "analytics.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ─── Portfolio ─────────────────────────────────────────────
export function getPortfolioData(): PortfolioData {
  ensureDir();
  if (!fs.existsSync(PORTFOLIO_FILE)) {
    const empty: PortfolioData = {
      about: { bio: "", bioH: "", location: "", available: true },
      projects: [],
      skills: [],
      experience: [],
      certifications: [],
      achievements: [],
      testimonials: [],
      resumeUrl: "",
    };
    fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(empty, null, 2));
    return empty;
  }
  return JSON.parse(fs.readFileSync(PORTFOLIO_FILE, "utf-8"));
}

export function savePortfolioData(data: PortfolioData) {
  ensureDir();
  fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(data, null, 2));
}

// ─── Analytics ─────────────────────────────────────────────
interface AnalyticsStore {
  events: AnalyticsEvent[];
  uniqueIPs: string[];
}

export function getAnalyticsData(): AnalyticsStore {
  ensureDir();
  if (!fs.existsSync(ANALYTICS_FILE)) {
    const empty: AnalyticsStore = { events: [], uniqueIPs: [] };
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(empty, null, 2));
    return empty;
  }
  return JSON.parse(fs.readFileSync(ANALYTICS_FILE, "utf-8"));
}

export function saveAnalyticsData(data: AnalyticsStore) {
  ensureDir();
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2));
}

export function recordEvent(event: AnalyticsEvent, ip?: string) {
  const store = getAnalyticsData();
  store.events.push(event);
  // Keep last 10,000 events to avoid bloat
  if (store.events.length > 10000) {
    store.events = store.events.slice(-10000);
  }
  if (ip && !store.uniqueIPs.includes(ip)) {
    store.uniqueIPs.push(ip);
  }
  saveAnalyticsData(store);
}

export function getAnalyticsSummary() {
  const store = getAnalyticsData();
  const events = store.events;
  const now = new Date();

  const today = now.toISOString().split("T")[0];
  const weekAgo = new Date(
    now.getTime() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();
  const monthAgo = new Date(
    now.getTime() - 30 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const pageViews = events.filter((e) => e.type === "page_view");
  const projClicks = events.filter((e) => e.type === "project_click");

  // Visits by day (last 14 days)
  const visitsByDay: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    visitsByDay[d] = 0;
  }
  pageViews.forEach((e) => {
    const d = e.timestamp.split("T")[0];
    if (d in visitsByDay) visitsByDay[d]++;
  });

  // Top projects
  const projMap: Record<string, { title: string; clicks: number }> = {};
  projClicks.forEach((e) => {
    const id = e.metadata?.projectId || "unknown";
    const title = e.metadata?.title || "Unknown";
    if (!projMap[id]) projMap[id] = { title, clicks: 0 };
    projMap[id].clicks++;
  });
  const topProjects = Object.entries(projMap)
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  // Device breakdown (basic UA sniffing)
  const deviceMap: Record<string, number> = {
    Mobile: 0,
    Tablet: 0,
    Desktop: 0,
  };
  pageViews.forEach((e) => {
    const ua = (e.userAgent || "").toLowerCase();
    if (/mobile/i.test(ua) && !/tablet/i.test(ua)) deviceMap.Mobile++;
    else if (/tablet|ipad/i.test(ua)) deviceMap.Tablet++;
    else deviceMap.Desktop++;
  });

  return {
    totalVisits: pageViews.length,
    uniqueVisitors: store.uniqueIPs.length,
    projectClicks: projClicks.length,
    resumeDownloads: events.filter((e) => e.type === "resume_download").length,
    contactClicks: events.filter((e) => e.type === "contact_click").length,
    todayVisits: pageViews.filter((e) => e.timestamp.startsWith(today)).length,
    weekVisits: pageViews.filter((e) => e.timestamp >= weekAgo).length,
    monthVisits: pageViews.filter((e) => e.timestamp >= monthAgo).length,
    topProjects,
    visitsByDay: Object.entries(visitsByDay).map(([date, count]) => ({
      date,
      count,
    })),
    deviceBreakdown: Object.entries(deviceMap).map(([device, count]) => ({
      device,
      count,
    })),
  };
}
