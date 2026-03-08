"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FiAward,
  FiExternalLink,
  FiCalendar,
  FiCheckCircle,
} from "react-icons/fi";
import { ImageModal } from "@/components/ui/Modals";
import type { Certification } from "@/types";

interface Props {
  certifications: Certification[];
}

export default function Certifications({ certifications }: Props) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [active, setActive] = useState(0);
  const [modal, setModal] = useState<Certification | null>(null);

  const isMobile = () =>
    typeof window !== "undefined" && window.innerWidth < 1024;

  const handleTabClick = useCallback((c: Certification, i: number) => {
    setActive(i);
    if (isMobile() && c.certificateUrl) setModal(c);
  }, []);

  const cert = certifications[active];

  return (
    <section
      id="certifications"
      className="section-padding relative overflow-hidden"
      ref={ref}
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full bg-violet-600/8 blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full bg-amber-500/6 blur-3xl" />
      </div>

      <div className="container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <span className="section-label">Certifications</span>
          <h2 className="section-title">
            My <span className="gradient-text">Credentials</span>
          </h2>
          <p className="section-subtitle">
            Professional certifications that validate my expertise
          </p>
        </motion.div>

        {certifications.length === 0 ? (
          <p className="text-center text-gray-400 py-12">
            No certifications added yet.
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* LEFT — horizontal tab list (stacked rows) */}
            <div className="flex flex-col gap-3">
              {certifications.map((c, i) => (
                <motion.button
                  key={c.id}
                  onClick={() => handleTabClick(c, i)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                  className={`
                    relative group w-full text-left px-4 py-3.5 rounded-xl
                    border transition-all duration-250 flex items-center gap-4
                    ${
                      active === i
                        ? "bg-violet-600/10 border-violet-500/40 shadow-lg shadow-violet-500/10"
                        : "bg-dark-card/40 border-dark-border/30 hover:bg-white/5 hover:border-dark-border/60"
                    }
                  `}
                >
                  {/* Active bottom bar */}
                  {active === i && (
                    <motion.div
                      layoutId="activeBar"
                      className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                      style={{ background: c.badgeColor || "#7c3aed" }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 35,
                      }}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                    style={{
                      background: `${c.badgeColor || "#7c3aed"}18`,
                      border: `1.5px solid ${active === i ? (c.badgeColor || "#7c3aed") + "80" : "transparent"}`,
                    }}
                  >
                    {c.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.image}
                        alt={c.issuer}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <FiAward
                        size={16}
                        style={{ color: c.badgeColor || "#7c3aed" }}
                      />
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold leading-tight truncate transition-colors duration-200 ${active === i ? "text-white" : "text-gray-300"}`}
                    >
                      {c.name}
                    </p>
                    <p
                      className="text-xs mt-0.5 truncate font-medium"
                      style={{
                        color:
                          active === i ? c.badgeColor || "#7c3aed" : "#6b7280",
                      }}
                    >
                      {c.issuer}
                    </p>
                  </div>

                  {/* Date pill */}
                  <div
                    className={`text-[10px] font-medium px-2 py-1 rounded-lg flex-shrink-0 transition-colors duration-200
                    ${active === i ? "bg-violet-500/20 text-violet-300" : "bg-white/5 text-gray-500"}`}
                  >
                    {new Date(c.date + "-01").toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* RIGHT — certificate detail panel (desktop only) */}
            <div className="hidden lg:block relative rounded-2xl border border-dark-border/40 bg-dark-card/30 backdrop-blur-sm overflow-hidden min-h-[420px]">
              <AnimatePresence mode="wait">
                {cert && (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0 flex flex-col p-6"
                  >
                    {/* Top accent line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-px"
                      style={{
                        background: `linear-gradient(90deg, ${cert.badgeColor || "#7c3aed"}90, transparent 70%)`,
                      }}
                    />

                    {/* Cert info row */}
                    <div className="flex items-start gap-4 mb-5">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden shadow-lg"
                        style={{
                          background: `${cert.badgeColor || "#7c3aed"}20`,
                          border: `2px solid ${cert.badgeColor || "#7c3aed"}50`,
                        }}
                      >
                        {cert.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={cert.image}
                            alt={cert.issuer}
                            className="w-full h-full object-contain p-1.5"
                          />
                        ) : (
                          <FiAward
                            size={26}
                            style={{ color: cert.badgeColor || "#7c3aed" }}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-base dark:text-white leading-snug">
                          {cert.name}
                        </h3>
                        <p
                          className="font-semibold text-sm mt-1"
                          style={{ color: cert.badgeColor || "#7c3aed" }}
                        >
                          {cert.issuer}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
                          <FiCalendar size={11} />
                          {new Date(cert.date + "-01").toLocaleDateString(
                            "en-US",
                            { month: "long", year: "numeric" },
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Certificate image preview */}
                    {cert.certificateUrl ? (
                      <div
                        className="flex-1 rounded-xl overflow-hidden border border-dark-border/40 relative group cursor-pointer min-h-0"
                        onClick={() => setModal(cert)}
                        style={{
                          boxShadow: `0 0 32px ${cert.badgeColor || "#7c3aed"}12`,
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={cert.certificateUrl}
                          alt={cert.name}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
                            <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                              <FiCheckCircle size={20} className="text-white" />
                            </div>
                            <span className="text-white text-xs font-semibold tracking-wide">
                              View Full Certificate
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 rounded-xl border border-dark-border/30 flex items-center justify-center min-h-0">
                        <div className="text-center text-gray-600">
                          <FiAward
                            size={36}
                            className="mx-auto mb-2 opacity-30"
                          />
                          <p className="text-xs">No certificate image</p>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-4">
                      {cert.certificateUrl && (
                        <button
                          onClick={() => setModal(cert)}
                          className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg
                            bg-gradient-to-r from-violet-600/20 to-pink-500/20
                            border border-violet-500/30 text-violet-400
                            hover:from-violet-600/40 hover:to-pink-500/40
                            transition-all duration-200 hover:scale-105"
                        >
                          <FiCheckCircle size={12} /> View Certificate
                        </button>
                      )}
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-violet-400 transition-colors font-medium"
                        >
                          <FiExternalLink size={12} /> Verify Credential
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>

      {modal && (
        <ImageModal
          open={!!modal}
          onClose={() => setModal(null)}
          imageUrl={modal.certificateUrl!}
          title={modal.name}
          subtitle={`Issued by ${modal.issuer}`}
          downloadUrl={modal.certificateUrl}
        />
      )}
    </section>
  );
}
