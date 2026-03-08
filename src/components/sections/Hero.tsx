"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import {
  FiGithub,
  FiLinkedin,
  FiArrowDown,
  FiBook,
  FiCpu,
  FiZap,
} from "react-icons/fi";

interface Props {
  about: { bioH: string; location: string; available: boolean };
}

const name = process.env.NEXT_PUBLIC_OWNER_NAME || "Dinesh";
const github = process.env.NEXT_PUBLIC_GITHUB_URL || "#";
const linkedin = process.env.NEXT_PUBLIC_LINKEDIN_URL || "#";

const ORBS = [
  {
    w: 400,
    h: 400,
    x: "-5%",
    y: "-10%",
    color: "rgba(124,58,237,0.2)",
    dur: 9,
    delay: 0,
  },
  {
    w: 300,
    h: 300,
    x: "65%",
    y: "55%",
    color: "rgba(236,72,153,0.16)",
    dur: 11,
    delay: -4,
  },
  {
    w: 220,
    h: 220,
    x: "50%",
    y: "-5%",
    color: "rgba(6,182,212,0.13)",
    dur: 8,
    delay: -7,
  },
  {
    w: 160,
    h: 160,
    x: "10%",
    y: "65%",
    color: "rgba(139,92,246,0.18)",
    dur: 13,
    delay: -2,
  },
];

const PARTICLES = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: (i * 137.5) % 100,
  y: (i * 73.1) % 100,
  s: (i % 3) + 1,
  dur: 4 + (i % 6),
  del: (i % 5) * 0.8,
}));

const STATS = [
  { value: "1.5+", label: "Years Exp", Icon: FiZap },
  { value: "10+", label: "Projects", Icon: FiBook },
  { value: "1", label: "LMS Platform", Icon: FiCpu },
  { value: "20+", label: "Problems Solved", Icon: FiGithub },
];

export default function Hero({ about }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const yVal = useTransform(scrollY, [0, 400], [0, 50]);

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e: MouseEvent) =>
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 24,
        y: (e.clientY / window.innerHeight - 0.5) * 24,
      });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 0.3), 16);
    return () => clearInterval(id);
  }, []);

  const bioText = about.bioH;

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Base bg */}
      <div className="absolute inset-0 -z-20 dark:bg-dark-bg bg-[#f8f7ff]" />

      {/* Animated grid lines */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={"h" + i}
            className="absolute w-full h-px"
            style={{
              top: 12 + i * 11 + "%",
              background: "rgba(124,58,237,0.06)",
            }}
            initial={{ scaleX: 0, originX: "0%" }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.8, delay: i * 0.08, ease: "easeOut" }}
          />
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <motion.div
            key={"v" + i}
            className="absolute h-full w-px"
            style={{
              left: (i + 1) * 9 + "%",
              background: "rgba(124,58,237,0.04)",
            }}
            initial={{ scaleY: 0, originY: "0%" }}
            animate={{ scaleY: 1 }}
            transition={{
              duration: 1.8,
              delay: 0.3 + i * 0.06,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Orbs (hidden on small screens for perf) */}
      <div className="hidden sm:block">
        {ORBS.map((o, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none -z-10"
            style={{
              width: o.w,
              height: o.h,
              left: o.x,
              top: o.y,
              background:
                "radial-gradient(circle, " + o.color + " 0%, transparent 70%)",
              filter: "blur(55px)",
              x: mouse.x * (i % 2 === 0 ? 1 : -1),
              y: mouse.y * (i % 2 === 0 ? 0.5 : -0.5),
            }}
            animate={{ scale: [1, 1.1, 1], rotate: [0, 4, -4, 0] }}
            transition={{
              duration: o.dur,
              delay: o.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Particles */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: p.x + "%",
              top: p.y + "%",
              width: p.s,
              height: p.s,
              background:
                p.id % 3 === 0
                  ? "rgba(124,58,237,0.7)"
                  : p.id % 3 === 1
                    ? "rgba(236,72,153,0.6)"
                    : "rgba(6,182,212,0.6)",
            }}
            animate={{
              y: [0, -(16 + p.s * 5), 0],
              opacity: [0.1, 0.7, 0.1],
              scale: [1, 1.6, 1],
            }}
            transition={{
              duration: p.dur,
              delay: p.del,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ── Main content ──────────────────────────────────── */}
      <motion.div
        style={{ opacity, y: yVal }}
        className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-8 lg:px-10 pt-24 pb-28"
      >
        <div className="flex flex-col items-center text-center">
          {/* Availability pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            <div
              className="inline-flex items-center gap-2 glass px-4 sm:px-5 py-2 sm:py-2.5 rounded-full
              text-xs sm:text-sm font-medium text-violet-600 dark:text-violet-300
              border border-violet-400/30 relative overflow-hidden max-w-[88vw]"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
              />
              <motion.span
                animate={{ rotate: [0, 18, -8, 18, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                className="text-base sm:text-lg flex-shrink-0 relative z-10"
              >
                👋
              </motion.span>
              <span className="relative z-10">Hi, I&apos;m {name}</span>
              {about.available && (
                <span className="flex items-center gap-1 sm:gap-1.5 ml-1 pl-2 sm:pl-3 border-l border-violet-400/30 flex-shrink-0 relative z-10">
                  <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-400" />
                  </span>
                  <span className="text-emerald-400 text-[10px] sm:text-xs font-semibold whitespace-nowrap">
                    Open to work
                  </span>
                </span>
              )}
            </div>
          </motion.div>

          {/* Big headline */}
          <div className="mb-4 sm:mb-6 w-full ">
            {["E-Learning Fullstack", "Developer"].map((word, wi) => (
              <div
                key={word}
                className="overflow-hidden"
                style={{ lineHeight: 1.05 }}
              >
                <motion.span
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.85,
                    delay: 0.1 + wi * 0.13,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={
                    "font-display block font-extrabold " +
                    "text-[2.3rem] xs:text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] " +
                    (wi === 0
                      ? "dark:text-white text-gray-900"
                      : "gradient-text")
                  }
                >
                  {word}
                </motion.span>
              </div>
            ))}
          </div>

          {/* Typing subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-2 mb-3 sm:mb-4 w-full
              text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400"
            style={{ minHeight: 28 }}
          >
            <FiBook className="text-violet-500 flex-shrink-0" size={17} />
            <span className="whitespace-nowrap text-sm sm:text-base">
              I build&nbsp;
            </span>
            <TypeAnimation
              sequence={[
                "LMS Integrations 🎓",
                2400,
                "SCORM Experiences 📦",
                2400,
                "AI Automation Tools 🤖",
                2400,
                "E-Learning Platform ⚡",
                2400,
                "Problem-Solving Solutions 🧩",
                2400,
              ]}
              wrapper="span"
              repeat={Infinity}
              className="gradient-text font-semibold text-sm sm:text-base"
            />
          </motion.div>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-base md:text-lg text-gray-500 dark:text-gray-400 
             leading-relaxed mb-8 max-w-2xl mx-auto"
          >
            {bioText}
          </motion.p>

          {/* CTA buttons + socials */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-12 sm:mb-14"
          >
            {/* Primary CTA */}
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden rounded-full font-semibold text-white
                text-sm sm:text-base flex items-center gap-2 group
                px-6 sm:px-8 py-3 sm:py-3.5"
              style={{
                background: "linear-gradient(135deg,#7c3aed,#ec4899)",
                boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                See My Work
                <motion.span
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  <FiArrowDown size={15} />
                </motion.span>
              </span>
              <motion.span className="absolute inset-0 bg-white/15 -skew-x-12 -translate-x-full group-hover:translate-x-[220%] transition-transform duration-500" />
            </motion.a>

            {/* Secondary CTA */}
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="btn-outline px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base"
            >
              Let&apos;s Connect
            </motion.a>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {[
                {
                  href: github,
                  Icon: FiGithub,
                  label: "GitHub",
                  cls: "hover:bg-gray-800 hover:text-white hover:border-gray-800",
                },
                {
                  href: linkedin,
                  Icon: FiLinkedin,
                  label: "LinkedIn",
                  cls: "hover:bg-blue-600 hover:text-white hover:border-blue-600",
                },
              ].map(({ href, Icon, label, cls }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={
                    "p-2.5 sm:p-3 rounded-full glass border border-white/10 text-gray-600 dark:text-gray-400 transition-all duration-300 " +
                    cls
                  }
                >
                  <Icon size={19} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Stats — 2×2 on mobile, row on sm+ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-8 md:gap-14 w-full max-w-[280px] sm:max-w-none"
          >
            {STATS.map(({ value, label, Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.08 }}
                whileHover={{ y: -4 }}
                className="text-center cursor-default group"
              >
                <Icon
                  className="mx-auto mb-1.5 text-violet-400/50 group-hover:text-violet-400 transition-colors"
                  size={14}
                />
                <div className="font-display font-extrabold gradient-text text-2xl sm:text-3xl leading-none">
                  {value === "inf" ? "∞" : value}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 leading-tight">
                  {label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue — pinned to bottom, clear of all content via pb-28 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20"
      >
        <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.28em] uppercase text-gray-400/50">
          Scroll
        </span>
        <div
          className="w-4 h-6 sm:w-5 sm:h-8 rounded-full border-2 border-gray-400/25 dark:border-gray-600/35
          flex items-start justify-center pt-1 sm:pt-1.5"
        >
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [1, 0.1, 1] }}
            transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
            className="w-0.5 h-1.5 sm:w-1 sm:h-2 rounded-full bg-gradient-to-b from-violet-500 to-pink-500"
          />
        </div>
      </motion.div>
    </section>
  );
}
