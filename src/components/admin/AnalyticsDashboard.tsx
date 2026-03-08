"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiEye,
  FiUsers,
  FiMousePointer,
  FiDownload,
  FiPhone,
  FiTrendingUp,
  FiMonitor,
  FiSmartphone,
  FiTablet,
  FiTrash2,
} from "react-icons/fi";
import toast from "react-hot-toast";
import type { AnalyticsSummary } from "@/types";

interface Props {
  analytics: AnalyticsSummary;
}

export default function AnalyticsDashboard({ analytics }: Props) {
  const [clearing, setClearing] = useState(false);

  const clearAnalytics = async () => {
    if (!confirm("Delete ALL analytics data? This cannot be undone.")) return;
    setClearing(true);
    try {
      const res = await fetch("/api/analytics", { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Analytics data cleared!");
      // Reload the page so counts refresh to 0
      window.location.reload();
    } catch {
      toast.error("Failed to clear analytics");
    } finally {
      setClearing(false);
    }
  };
  const stats = [
    {
      icon: FiEye,
      label: "Total Page Views",
      value: analytics.totalVisits,
      sub: `${analytics.todayVisits} today`,
      color: "from-violet-600 to-purple-700",
    },
    {
      icon: FiUsers,
      label: "Unique Visitors",
      value: analytics.uniqueVisitors,
      sub: `${analytics.weekVisits} this week`,
      color: "from-cyan-600 to-blue-700",
    },
    {
      icon: FiMousePointer,
      label: "Project Clicks",
      value: analytics.projectClicks,
      sub: "all time",
      color: "from-pink-600 to-rose-700",
    },
    {
      icon: FiDownload,
      label: "Resume Downloads",
      value: analytics.resumeDownloads,
      sub: "all time",
      color: "from-emerald-600 to-green-700",
    },
    {
      icon: FiPhone,
      label: "Contact Clicks",
      value: analytics.contactClicks,
      sub: "all time",
      color: "from-amber-600 to-orange-700",
    },
    {
      icon: FiTrendingUp,
      label: "Monthly Views",
      value: analytics.monthVisits,
      sub: "last 30 days",
      color: "from-indigo-600 to-violet-700",
    },
  ];

  const maxVisit = Math.max(...analytics.visitsByDay.map((v) => v.count), 1);

  const deviceIcon: Record<string, React.ComponentType<{ size?: number }>> = {
    Desktop: FiMonitor,
    Mobile: FiSmartphone,
    Tablet: FiTablet,
  };

  return (
    <div className="space-y-8">
      {/* Clear data button */}
      <div className="flex justify-end">
        <button
          onClick={clearAnalytics}
          disabled={clearing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-red-400 border border-red-400/20 hover:bg-red-500/10 transition-all duration-200"
        >
          {clearing ? (
            <span className="animate-spin w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full" />
          ) : (
            <FiTrash2 size={14} />
          )}
          Clear Analytics Data
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            className="card relative overflow-hidden group"
          >
            <div
              className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${s.color} opacity-10 -translate-y-8 translate-x-8`}
            />
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg flex-shrink-0`}
              >
                <s.icon size={22} className="text-white" />
              </div>
              <div>
                <div className="font-display font-bold text-3xl dark:text-white">
                  {s.value.toLocaleString()}
                </div>
                <div className="text-sm font-medium dark:text-gray-200 text-gray-700">
                  {s.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {s.sub}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Visits chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="card lg:col-span-2"
        >
          <h3 className="font-display font-bold text-lg dark:text-white mb-6">
            Daily Visits (Last 14 Days)
          </h3>
          <div className="flex items-end gap-1.5 h-40">
            {analytics.visitsByDay.map((day, i) => (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div className="w-full relative group/bar">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.count / maxVisit) * 140}px` }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.03,
                      ease: "easeOut",
                    }}
                    className="w-full rounded-t-md bg-gradient-to-t from-violet-600 to-pink-500 min-h-[2px] cursor-pointer"
                    style={{
                      boxShadow:
                        day.count > 0
                          ? "0 -2px 10px rgba(124,58,237,0.5)"
                          : "none",
                    }}
                  />
                  {/* Tooltip */}
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/bar:block
                    bg-dark-card border border-dark-border text-xs text-white px-2 py-1 rounded-lg whitespace-nowrap z-10"
                  >
                    {day.count} visits
                    <br />
                    <span className="text-gray-400">{day.date.slice(5)}</span>
                  </div>
                </div>
                <span className="text-[9px] text-gray-500 rotate-45 origin-left">
                  {day.date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Device breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="card"
        >
          <h3 className="font-display font-bold text-lg dark:text-white mb-6">
            Device Types
          </h3>
          <div className="space-y-4">
            {analytics.deviceBreakdown.map((d) => {
              const total =
                analytics.deviceBreakdown.reduce((a, b) => a + b.count, 0) || 1;
              const pct = Math.round((d.count / total) * 100);
              const Icon = deviceIcon[d.device] || FiMonitor;
              return (
                <div key={d.device}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-sm dark:text-gray-300">
                      <Icon size={14} />
                      {d.device}
                    </div>
                    <span className="text-xs font-bold gradient-text">
                      {pct}%
                    </span>
                  </div>
                  <div className="skill-bar">
                    <motion.div
                      className="skill-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {d.count.toLocaleString()} visits
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Top Projects */}
      {analytics.topProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="card"
        >
          <h3 className="font-display font-bold text-lg dark:text-white mb-6">
            Most Clicked Projects
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-dark-border/40">
                  <th className="pb-3 font-medium">#</th>
                  <th className="pb-3 font-medium">Project</th>
                  <th className="pb-3 font-medium text-right">Clicks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/20">
                {analytics.topProjects.map((p, i) => (
                  <tr
                    key={p.id}
                    className="hover:bg-violet-500/5 transition-colors"
                  >
                    <td className="py-3 text-gray-400 font-mono">{i + 1}</td>
                    <td className="py-3 dark:text-white font-medium">
                      {p.title}
                    </td>
                    <td className="py-3 text-right">
                      <span className="tech-tag">{p.clicks}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {analytics.totalVisits === 0 && (
        <div className="text-center py-16 text-gray-400">
          <FiEye size={40} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No analytics data yet</p>
          <p className="text-sm mt-1">
            Analytics will appear as visitors browse your portfolio.
          </p>
        </div>
      )}
    </div>
  );
}
