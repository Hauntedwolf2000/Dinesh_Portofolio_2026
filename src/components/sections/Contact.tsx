"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FiMail,
  FiSend,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiMessageCircle,
} from "react-icons/fi";
import { trackEvent } from "@/components/ui/Analytics";
import toast from "react-hot-toast";

const siteEmail = process.env.NEXT_PUBLIC_OWNER_EMAIL || "";
const github = process.env.NEXT_PUBLIC_GITHUB_URL || "#";
const linkedin = process.env.NEXT_PUBLIC_LINKEDIN_URL || "#";
const twitter = process.env.NEXT_PUBLIC_TWITTER_URL || "#";

interface Props {
  whatsapp?: string;
}

export default function Contact({ whatsapp }: Props) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // Normalise WhatsApp — strip everything except digits and leading +
  const waNumber = (whatsapp || "").trim();
  const waDigits = waNumber.replace(/[^0-9]/g, "");
  const waLink = waDigits ? `https://wa.me/${waDigits}` : "";
  const hasWA = Boolean(waDigits);

  const socials = [
    { href: github, Icon: FiGithub, label: "GitHub" },
    { href: linkedin, Icon: FiLinkedin, label: "LinkedIn" },
    ...(hasWA
      ? [{ href: waLink, Icon: FiMessageCircle, label: "WhatsApp" }]
      : []),
  ];

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    trackEvent("contact_click", { subject: form.subject });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Message sent! I'll get back to you soon 🚀");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error(
        "Failed to send message. Please try again or reach out directly.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputCls = `w-full px-4 py-3 rounded-xl text-sm
    dark:bg-dark-muted bg-gray-100 border border-dark-border/40
    dark:text-white text-gray-900 placeholder-gray-400
    focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20
    transition-all duration-200`;

  return (
    <section
      id="contact"
      className="section-padding relative overflow-hidden"
      ref={ref}
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-violet-600/15 blur-3xl" />
      </div>

      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <span className="section-label">Contact</span>
          <h2 className="section-title">
            Let&apos;s <span className="gradient-text">Work Together</span>
          </h2>
          <p className="section-subtitle">
            Have a project in mind? Drop me a message and let&apos;s create
            something amazing.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
          {/* ── Info column ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            <div>
              <h3 className="font-display font-bold text-xl dark:text-white mb-2">
                Get in Touch
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                I&apos;m always open to discussing new projects, LMS solutions,
                AI tools, or any exciting opportunity.
              </p>
            </div>

            {/* Email */}
            {siteEmail && (
              <a
                href={`mailto:${siteEmail}`}
                className="flex items-center gap-3 p-4 rounded-xl glass hover:bg-violet-500/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <FiMail className="text-white" size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-gray-400 mb-0.5">Email</div>
                  <div className="font-medium text-sm dark:text-white group-hover:text-violet-400 transition-colors truncate">
                    {siteEmail}
                  </div>
                </div>
              </a>
            )}

            {/* WhatsApp — shows only when number is set */}
            {hasWA && (
              <motion.a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex items-center gap-3 p-4 rounded-xl glass hover:bg-emerald-500/10 transition-all group border border-emerald-400/20"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <FiMessageCircle className="text-white" size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-gray-400 mb-0.5">WhatsApp</div>
                  <div className="font-medium text-sm dark:text-white group-hover:text-emerald-400 transition-colors">
                    {waNumber}
                  </div>
                  <div className="text-[10px] text-emerald-500 font-medium">
                    Click to open chat →
                  </div>
                </div>
              </motion.a>
            )}

            {/* Social icons */}
            <div>
              <div className="text-xs text-gray-400 mb-3 font-medium">
                Find me on
              </div>
              <div className="flex flex-wrap gap-3">
                {socials.map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="p-3 rounded-xl glass hover:bg-violet-500/20 hover:shadow-glow-sm
                      text-gray-500 dark:text-gray-400 hover:text-violet-400 transition-all hover:-translate-y-1"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Availability indicator */}
            <div className="p-4 rounded-xl glass border border-emerald-400/20">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-semibold text-emerald-400">
                  Available for work
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Open to freelance, consulting and full-time opportunities.
              </p>
            </div>
          </motion.div>

          {/* ── Form ────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 card space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">
                  Your Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="John Doe"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">
                  Your Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="john@example.com"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">
                Subject
              </label>
              <input
                value={form.subject}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subject: e.target.value }))
                }
                placeholder="LMS Project / AI Automation / etc."
                className={inputCls}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">
                Message *
              </label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                placeholder="Tell me about your project…"
                className={inputCls + " resize-none"}
              />
            </div>

            <motion.button
              onClick={handleSubmit}
              disabled={loading}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4"
            >
              {loading ? (
                <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <>
                  <FiSend size={18} /> Send Message
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
