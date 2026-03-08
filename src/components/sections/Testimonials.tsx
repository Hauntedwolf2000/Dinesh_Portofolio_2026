"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiLinkedin,
  FiExternalLink,
} from "react-icons/fi";
import type { Testimonial } from "@/types";

interface Props {
  testimonials: Testimonial[];
}

/* Avatar — uses the `avatar` field directly, falls back to initial letter */
function Avatar({ t, size = "lg" }: { t: Testimonial; size?: "sm" | "lg" }) {
  const [errored, setErrored] = useState(false);
  const dim = size === "lg" ? "w-14 h-14" : "w-10 h-10";
  const txt = size === "lg" ? "text-xl" : "text-sm";

  return (
    <div
      className={`${dim} rounded-full bg-gradient-to-br from-violet-600 to-pink-500
      flex items-center justify-center flex-shrink-0 overflow-hidden shadow-glow-sm`}
    >
      {t.avatar && !errored ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={t.avatar}
          alt={t.name}
          className="w-full h-full object-cover rounded-full"
          onError={() => setErrored(true)}
        />
      ) : (
        <span className={`text-white font-bold ${txt} select-none`}>
          {t.name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

export default function Testimonials({ testimonials }: Props) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [idx, setIdx] = useState(0);

  if (testimonials.length === 0) return null;

  const t = testimonials[idx];
  const prev = () =>
    setIdx((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIdx((i) => (i + 1) % testimonials.length);

  return (
    <section
      id="testimonials"
      className="section-padding relative overflow-hidden"
      ref={ref}
    >
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-96 h-96 rounded-full bg-violet-600/10 blur-3xl"
        />
      </div>

      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <span className="section-label">Testimonials</span>
          <h2 className="section-title">
            What People <span className="gradient-text">Say</span>
          </h2>
          <p className="section-subtitle">
            Kind words from colleagues and clients
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="card relative overflow-hidden p-7 sm:p-10 md:p-12"
              >
                {/* Quote decoration */}
                <div
                  className="absolute top-5 left-7 text-8xl font-serif
                  text-violet-500/10 select-none leading-none pointer-events-none"
                >
                  "
                </div>

                {/* LinkedIn badge — top right */}
                {t.linkedinUrl && (
                  <a
                    href={t.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-5 right-5 flex items-center gap-1.5
                      text-[11px] font-semibold text-blue-400 hover:text-blue-300
                      glass px-2.5 py-1 rounded-full border border-blue-400/20
                      hover:border-blue-400/50 hover:bg-blue-500/10
                      transition-all duration-200 group"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiLinkedin size={12} />
                    LinkedIn
                    <FiExternalLink
                      size={10}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </a>
                )}

                {/* Stars */}
                <div className="flex gap-1 mb-5 mt-2">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <FiStar
                      key={i}
                      className="text-amber-400 fill-current"
                      size={17}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p
                  className="text-base sm:text-lg md:text-xl
                  text-gray-600 dark:text-gray-200
                  leading-relaxed mb-8 relative z-10 italic"
                >
                  &ldquo;{t.content}&rdquo;
                </p>

                {/* Author — clickable if linkedinUrl is set */}
                {t.linkedinUrl ? (
                  <a
                    href={t.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group w-fit"
                  >
                    <div className="relative">
                      <Avatar t={t} size="lg" />
                      <span
                        className="absolute inset-0 rounded-full ring-2 ring-blue-400/0
                        group-hover:ring-blue-400/70 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <div
                        className="font-display font-bold dark:text-white
                        group-hover:text-blue-400 transition-colors flex items-center gap-1.5"
                      >
                        {t.name}
                        <FiLinkedin
                          size={13}
                          className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                      <div className="text-sm text-violet-400">{t.role}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {t.company}
                      </div>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-4">
                    <Avatar t={t} size="lg" />
                    <div>
                      <div className="font-display font-bold dark:text-white">
                        {t.name}
                      </div>
                      <div className="text-sm text-violet-400">{t.role}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {t.company}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Prev / Next */}
            {testimonials.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-7">
                <button
                  onClick={prev}
                  className="p-3 rounded-xl glass hover:bg-violet-500/20 hover:shadow-glow-sm
                    text-gray-600 dark:text-gray-300 transition-all"
                >
                  <FiChevronLeft size={20} />
                </button>

                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIdx(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === idx
                          ? "w-8 bg-gradient-to-r from-violet-500 to-pink-500"
                          : "w-2 bg-gray-400 dark:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={next}
                  className="p-3 rounded-xl glass hover:bg-violet-500/20 hover:shadow-glow-sm
                    text-gray-600 dark:text-gray-300 transition-all"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Avatar strip */}
          {testimonials.length > 1 && (
            <div className="flex justify-center -space-x-3 mt-7">
              {testimonials.map((person, i) => (
                <button
                  key={person.id ?? i}
                  onClick={() => setIdx(i)}
                  title={person.name}
                  className={`relative rounded-full border-2 transition-all duration-300 overflow-visible
                    ${
                      i === idx
                        ? "border-violet-500 scale-110 z-10"
                        : "border-dark-border opacity-60 hover:opacity-90 hover:scale-105"
                    }`}
                >
                  <Avatar t={person} size="sm" />
                  {/* LinkedIn dot */}
                  {person.linkedinUrl && (
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5
                      bg-blue-500 rounded-full border-2 border-dark-bg
                      flex items-center justify-center z-20"
                    >
                      <FiLinkedin size={7} className="text-white" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
