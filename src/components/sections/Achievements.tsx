"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FiTrendingUp,
  FiStar,
  FiMic,
  FiCode,
  FiUsers,
  FiAward,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { ImageModal } from "@/components/ui/Modals";
import type { Achievement } from "@/types";

interface Props {
  achievements: Achievement[];
}

const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  trophy: FiAward,
  code: FiCode,
  mic: FiMic,
  star: FiStar,
  users: FiUsers,
  trend: FiTrendingUp,
};

const GRADIENTS = [
  { from: "#7c3aed", to: "#6d28d9" },
  { from: "#db2777", to: "#be185d" },
  { from: "#0891b2", to: "#0e7490" },
  { from: "#059669", to: "#047857" },
  { from: "#d97706", to: "#b45309" },
  { from: "#4f46e5", to: "#4338ca" },
];

const AUTO_DELAY = 3800;

export default function Achievements({ achievements }: Props) {
  const [headerRef, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [modal, setModal] = useState<Achievement | null>(null);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const total = achievements.length;

  // Handle responsive sizing
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const go = useCallback(
    (n: number) => {
      setCurrent(((n % total) + total) % total);
    },
    [total],
  );

  useEffect(() => {
    if (paused || total <= 1) return;
    timerRef.current = setTimeout(() => go(current + 1), AUTO_DELAY);
    return () => clearTimeout(timerRef.current);
  }, [current, paused, total, go]);

  if (total === 0) return null;

  function getOffset(i: number) {
    let off = i - current;
    if (off > total / 2) off -= total;
    if (off < -total / 2) off += total;
    return off;
  }

  // Responsive Dimensions
  const ACTIVE_W = isMobile ? 300 : 340;
  const ACTIVE_H = isMobile ? 260 : 280;
  const SIDE_W = isMobile ? 220 : 260;
  const SIDE_H = isMobile ? 190 : 210;
  const SIDE_OFFSET = isMobile ? 160 : 240; // Tighter offset for mobile
  const STAGE_H = ACTIVE_H + 80;

  return (
    <section
      id="achievements"
      className="section-padding relative overflow-hidden py-20"
      ref={headerRef}
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-1/3 right-0 w-72 h-72 rounded-full bg-emerald-600/10 blur-3xl" />
        <div className="absolute top-1/4 left-0 w-64 h-64 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12 px-4"
        >
          <span className="text-violet-500 font-bold tracking-widest uppercase text-xs">
            Achievements
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 text-black dark:text-white">
            Proud{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500">
              Milestones
            </span>
          </h2>
        </motion.div>

        {/* ── Stage ── */}
        <div
          className="relative flex items-center justify-center mx-auto w-full touch-pan-y"
          style={{ height: STAGE_H, perspective: "1000px" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {achievements.map((ach, i) => {
            const off = getOffset(i);
            const isVisible = Math.abs(off) <= 1;
            const isActive = off === 0;

            const grad = GRADIENTS[i % GRADIENTS.length];
            const Icon = ICON_MAP[ach.icon || "star"] || FiStar;

            return (
              <motion.div
                key={ach.id ?? i}
                animate={{
                  x: off * SIDE_OFFSET,
                  scale: isActive ? 1 : 0.8,
                  opacity: isVisible ? (isActive ? 1 : 0.3) : 0,
                  zIndex: isActive ? 30 : 10,
                  width: isActive ? ACTIVE_W : SIDE_W,
                  height: isActive ? ACTIVE_H : SIDE_H,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={() => !isActive && go(i)}
                className="absolute flex-shrink-0 origin-center"
                style={{ cursor: isActive ? "default" : "pointer" }}
              >
                <div
                  className="w-full h-full rounded-2xl flex flex-col relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(30,20,50,0.95), rgba(20,10,40,0.95))",
                    backdropFilter: "blur(10px)",
                    border: isActive
                      ? `1.5px solid ${grad.from}55`
                      : "1px solid rgba(255,255,255,0.05)",
                    boxShadow: isActive ? `0 15px 40px ${grad.from}30` : "none",
                    padding: isActive ? "20px" : "15px",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[3px]"
                    style={{
                      background: `linear-gradient(90deg, ${grad.from}, ${grad.to})`,
                    }}
                  />

                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="flex items-center justify-center text-white rounded-xl shadow-lg"
                      style={{
                        width: isActive ? 44 : 34,
                        height: isActive ? 44 : 34,
                        background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
                      }}
                    >
                      <Icon size={isActive ? 20 : 16} />
                    </div>
                    <span
                      className="font-bold uppercase tracking-tighter"
                      style={{ fontSize: isActive ? 10 : 8, color: grad.from }}
                    >
                      {ach.category}
                    </span>
                  </div>

                  <h3
                    className="font-bold text-white leading-tight line-clamp-2"
                    style={{ fontSize: isActive ? 17 : 13 }}
                  >
                    {ach.title}
                  </h3>

                  {isActive && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-gray-400 text-xs mt-3 flex-1 line-clamp-3"
                    >
                      {ach.description}
                    </motion.p>
                  )}

                  <div className="flex items-center justify-between pt-3 mt-auto border-t border-white/5">
                    <span className="text-gray-500 text-[10px]">
                      {ach.date}
                    </span>
                    {ach.certificateUrl && isActive && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModal(ach);
                        }}
                        className="text-[10px] font-bold px-3 py-1.5 rounded-lg text-white"
                        style={{
                          background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
                        }}
                      >
                        View
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Desktop-only side arrows */}
          {total > 1 && (
            <div className="hidden md:block">
              <button
                onClick={() => go(current - 1)}
                className="absolute left-[-60px] top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:bg-violet-500/20 transition-all"
              >
                <FiChevronLeft size={24} />
              </button>
              <button
                onClick={() => go(current + 1)}
                className="absolute right-[-60px] top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:bg-violet-500/20 transition-all"
              >
                <FiChevronRight size={24} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile-friendly Controls (Arrows + Dots) */}
        {total > 1 && (
          <div className="flex flex-col items-center gap-6 mt-8 px-4">
            <div className="flex items-center gap-8 md:hidden">
              <button
                onClick={() => go(current - 1)}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white active:scale-90 transition-transform"
              >
                <FiChevronLeft size={24} />
              </button>

              <div className="flex gap-2">
                {achievements.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    className={`h-1.5 rounded-full transition-all ${i === current ? "w-8 bg-violet-500" : "w-1.5 bg-gray-700"}`}
                  />
                ))}
              </div>

              <button
                onClick={() => go(current + 1)}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white active:scale-90 transition-transform"
              >
                <FiChevronRight size={24} />
              </button>
            </div>

            {/* Desktop-only dots */}
            <div className="hidden md:flex gap-2">
              {achievements.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  className={`h-1.5 rounded-full transition-all ${i === current ? "w-8 bg-violet-500" : "w-2 bg-gray-700 hover:bg-gray-600"}`}
                />
              ))}
            </div>

            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest tabular-nums">
              {current + 1} / {total}
            </span>
          </div>
        )}
      </div>

      {modal?.certificateUrl && (
        <ImageModal
          open={!!modal}
          onClose={() => setModal(null)}
          imageUrl={modal.certificateUrl}
          title={modal.title}
          subtitle={modal.category}
          downloadUrl={modal.certificateUrl}
        />
      )}
    </section>
  );
}
