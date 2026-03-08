import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import AdminDashboardClient from "./AdminDashboardClient";
import { getPortfolioData, getAnalyticsSummary } from "@/lib/dataStore";

export default async function AdminDashboard() {
  const cookieStore = await cookies();

  const token = cookieStore.get("admin_token")?.value;

  if (!token) redirect("/admin/login");

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "admin") redirect("/admin/login");

  const portfolioData = getPortfolioData();
  const analytics = getAnalyticsSummary();

  return (
    <AdminDashboardClient
      initialData={portfolioData}
      analytics={analytics}
      adminEmail={payload.email}
    />
  );
}
