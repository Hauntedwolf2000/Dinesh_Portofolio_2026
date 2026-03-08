"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FiDownload, FiFileText, FiEye } from "react-icons/fi";
import { PDFModal } from "@/components/ui/Modals";
import { trackEvent } from "@/components/ui/Analytics";

interface Props {
  resumeUrl: string;
}

export default function Resume({ resumeUrl }: Props) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [pdfOpen, setPdfOpen] = useState(false);

  const url = resumeUrl || "/resume.pdf";

  const handleDownload = () => trackEvent("resume_download");

  return (
    <section
      id="resume"
      className="section-padding relative overflow-hidden"
      ref={ref}
    >
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden p-px"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #ec4899, #06b6d4)",
          }}
        >
          <div className="rounded-3xl dark:bg-dark-card bg-white px-8 md:px-16 py-16 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(
      circle at 20% 50%, #7c3aed 0%, transparent 50%
    ),
    radial-gradient(
      circle at 80% 50%, #ec4899 0%, transparent 50%
    )`,
              }}
            />

            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center mx-auto shadow-glow-lg">
                <FiFileText size={36} className="text-white" />
              </div>
            </motion.div>

            <h2 className="font-display text-4xl md:text-5xl font-bold dark:text-white mb-4">
              Download My <span className="gradient-text">Resume</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Get a detailed overview of my skills, experience, and
              accomplishments — updated regularly.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {/* Download */}
              <motion.a
                href={url}
                download
                onClick={handleDownload}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="relative overflow-hidden px-10 py-4 rounded-full font-semibold text-white
                  text-lg flex items-center gap-3 group"
                style={{
                  background: "linear-gradient(135deg,#7c3aed,#ec4899)",
                  boxShadow: "0 4px 24px rgba(124,58,237,0.4)",
                }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <FiDownload size={20} /> Download PDF
                </span>
                <motion.span className="absolute inset-0 bg-white/15 -skew-x-12 -translate-x-full group-hover:translate-x-[220%] transition-transform duration-500" />
              </motion.a>

              {/* View in modal */}
              <motion.button
                onClick={() => setPdfOpen(true)}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-outline text-lg px-10 py-4 flex items-center gap-2"
              >
                <FiEye size={18} /> View Online
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <PDFModal
        open={pdfOpen}
        onClose={() => setPdfOpen(false)}
        pdfUrl={url}
        title="Resume"
        downloadUrl={url}
      />
    </section>
  );
}
