"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FiGrid,
  FiCode,
  FiBriefcase,
  FiAward,
  FiStar,
  FiUsers,
  FiFileText,
  FiLogOut,
  FiBarChart2,
  FiUser,
  FiMenu,
  FiX,
  FiTrendingUp,
  FiEye,
  FiMousePointer,
  FiDownload,
  FiSave,
} from "react-icons/fi";
import type { PortfolioData, AnalyticsSummary } from "@/types";
import FileUpload from "@/components/ui/FileUpload";
import AboutManager from "@/components/admin/AboutManager";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import {
  ProjectsManager,
  SkillsManager,
  ExperienceManager,
  CertificationsManager,
  AchievementsManager,
  TestimonialsManager,
} from "@/components/admin/AllManagers";

interface Props {
  initialData: PortfolioData;
  analytics: AnalyticsSummary;
  adminEmail: string;
}

const NAV_ITEMS = [
  { id: "analytics", icon: FiBarChart2, label: "Analytics" },
  { id: "about", icon: FiUser, label: "About" },
  { id: "projects", icon: FiGrid, label: "Projects" },
  { id: "skills", icon: FiCode, label: "Skills" },
  { id: "experience", icon: FiBriefcase, label: "Experience" },
  { id: "certifications", icon: FiAward, label: "Certifications" },
  { id: "achievements", icon: FiStar, label: "Achievements" },
  { id: "testimonials", icon: FiUsers, label: "Testimonials" },
  { id: "resume", icon: FiFileText, label: "Resume" },
];

export default function AdminDashboardClient({
  initialData,
  analytics,
  adminEmail,
}: Props) {
  const router = useRouter();
  const [data, setData] = useState<PortfolioData>(initialData);
  const [section, setSection] = useState("analytics");
  const [sidebarOpen, setSidebar] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Logged out");
    router.push("/admin/login");
  };

  const refreshData = async () => {
    const res = await fetch("/api/portfolio");
    if (res.ok) setData(await res.json());
  };

  const quickStats = [
    {
      icon: FiEye,
      label: "Total Visits",
      value: analytics.totalVisits,
      color: "from-violet-600 to-purple-700",
    },
    {
      icon: FiUsers,
      label: "Unique Visitors",
      value: analytics.uniqueVisitors,
      color: "from-cyan-600 to-blue-700",
    },
    {
      icon: FiMousePointer,
      label: "Project Clicks",
      value: analytics.projectClicks,
      color: "from-pink-600 to-rose-700",
    },
    {
      icon: FiDownload,
      label: "Resume DLs",
      value: analytics.resumeDownloads,
      color: "from-emerald-600 to-green-700",
    },
  ];

  return (
    <div className="min-h-screen dark:bg-dark-bg bg-gray-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebar(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64
        dark:bg-dark-surface bg-white border-r border-dark-border/30
        flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-6 border-b border-dark-border/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center shadow-glow-sm">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <div className="font-display font-bold text-sm dark:text-white">
                Admin Panel
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                {adminEmail}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => {
                setSection(id);
                setSidebar(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                section === id
                  ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-glow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-violet-500/10 hover:text-violet-500"
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-dark-border/30">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-violet-400 px-4 py-2 mb-1 transition-colors"
          >
            <FiTrendingUp size={14} /> View Portfolio
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 dark:bg-dark-surface/90 bg-white/90 backdrop-blur-xl border-b border-dark-border/30 px-6 py-4 flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-xl glass text-gray-600 dark:text-gray-300"
            onClick={() => setSidebar((v) => !v)}
          >
            {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
          <h1 className="font-display font-bold text-xl dark:text-white capitalize">
            {NAV_ITEMS.find((n) => n.id === section)?.label || "Dashboard"}
          </h1>

          <div className="hidden xl:flex items-center gap-4 ml-auto">
            {quickStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2 glass px-3 py-1.5 rounded-lg"
              >
                <div
                  className={`w-6 h-6 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0`}
                >
                  <stat.icon size={12} className="text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold dark:text-white">
                    {stat.value.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-gray-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {section === "analytics" && (
                <AnalyticsDashboard analytics={analytics} />
              )}
              {section === "about" && (
                <AboutManager about={data.about} onSave={refreshData} />
              )}
              {section === "projects" && (
                <ProjectsManager
                  items={data.projects ?? []}
                  onSave={refreshData}
                />
              )}
              {section === "skills" && (
                <SkillsManager items={data.skills ?? []} onSave={refreshData} />
              )}
              {section === "experience" && (
                <ExperienceManager
                  items={data.experience ?? []}
                  onSave={refreshData}
                />
              )}
              {section === "certifications" && (
                <CertificationsManager
                  items={data.certifications ?? []}
                  onSave={refreshData}
                />
              )}
              {section === "achievements" && (
                <AchievementsManager
                  items={data.achievements ?? []}
                  onSave={refreshData}
                />
              )}
              {section === "testimonials" && (
                <TestimonialsManager
                  items={data.testimonials ?? []}
                  onSave={refreshData}
                />
              )}
              {section === "resume" && (
                <ResumeManager
                  resumeUrl={data.resumeUrl ?? ""}
                  onSave={refreshData}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function ResumeManager({
  resumeUrl,
  onSave,
}: {
  resumeUrl: string;
  onSave: () => void;
}) {
  const [url, setUrl] = useState(resumeUrl ?? "");
  const [loading, setLoading] = useState(false);

  const save = async (finalUrl: string) => {
    setLoading(true);
    const res = await fetch("/api/portfolio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        section: "resume",
        item: { resumeUrl: finalUrl },
      }),
    });
    if (res.ok) {
      toast.success("Resume URL updated!");
      onSave();
    } else toast.error("Failed to update");
    setLoading(false);
  };

  const inputCls = `w-full px-4 py-3 rounded-xl text-sm dark:bg-dark-muted bg-gray-100
    border border-dark-border/40 dark:text-white text-gray-900 placeholder-gray-400
    focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all`;

  return (
    <div className="max-w-xl">
      <h2 className="font-display font-bold text-xl dark:text-white mb-6">
        Resume Settings
      </h2>
      <div className="card space-y-5">
        <div>
          <label className="text-sm font-medium text-gray-400 mb-2 block">
            Upload PDF from Device
            <span className="ml-2 text-violet-400 font-normal text-xs">
              (saved to /public/resources/)
            </span>
          </label>
          <FileUpload
            folder="resume"
            accept=".pdf,application/pdf"
            label="Upload Resume PDF"
            type="pdf"
            preview={url}
            onUpload={(uploadedUrl) => {
              setUrl(uploadedUrl);
              save(uploadedUrl);
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-dark-border/30" />
          <span className="text-xs text-gray-500">or paste a URL</span>
          <div className="flex-1 h-px bg-dark-border/30" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-400 mb-2 block">
            Resume URL (PDF link)
          </label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/resources/resume.pdf  or  https://drive.google.com/..."
            className={inputCls}
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload your PDF above, or link to Google Drive, Notion, etc.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => save(url)}
            disabled={loading}
            className="btn-primary text-sm flex items-center gap-2"
          >
            {loading ? (
              <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
            ) : (
              <>
                <FiSave size={14} /> Save Resume URL
              </>
            )}
          </button>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-sm flex items-center gap-2"
            >
              <FiEye size={14} /> Preview
            </a>
          )}
          {url && (
            <button
              onClick={async () => {
                if (
                  !confirm(
                    "Remove the resume URL? This will hide the resume section.",
                  )
                )
                  return;
                setUrl("");
                await save("");
              }}
              className="text-sm flex items-center gap-2 px-4 py-2 rounded-xl
                text-red-400 border border-red-400/20 hover:bg-red-500/10
                transition-all duration-200"
            >
              🗑 Delete Resume
            </button>
          )}
        </div>

        {url && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-xs text-emerald-400 break-all">
            Current: <span className="font-mono">{url}</span>
          </div>
        )}
      </div>
    </div>
  );
}
