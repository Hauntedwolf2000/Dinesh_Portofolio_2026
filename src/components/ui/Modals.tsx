'use client'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiDownload, FiExternalLink, FiMaximize } from 'react-icons/fi'

/* ─── Image Modal ──────────────────────────────────────────── */
interface ImageModalProps {
  open:     boolean
  onClose:  () => void
  imageUrl: string
  title:    string
  subtitle?: string
  downloadUrl?: string
}

export function ImageModal({ open, onClose, imageUrl, title, subtitle, downloadUrl }: ImageModalProps) {
  useEffect(() => {
    if (!open) return
    const close = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', close)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', close)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

          {/* Panel */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 30 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{    scale: 0.88, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden
              dark:bg-dark-card bg-white border border-violet-500/30 shadow-[0_0_80px_rgba(124,58,237,0.3)]"
          >
            {/* Glow line at top */}
            <div className="h-0.5 w-full bg-gradient-to-r from-violet-600 via-pink-500 to-cyan-500 flex-shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0
              border-b border-violet-500/10 dark:bg-dark-surface/50 bg-gray-50/80">
              <div>
                <h3 className="font-display font-bold text-lg dark:text-white text-gray-900 leading-tight">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-sm text-violet-400 mt-0.5">{subtitle}</p>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4">
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl glass hover:bg-violet-500/20 text-gray-500 dark:text-gray-400
                      hover:text-violet-400 transition-all duration-200"
                    title="Download"
                  >
                    <FiDownload size={16} />
                  </a>
                )}
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl glass hover:bg-violet-500/20 text-gray-500 dark:text-gray-400
                    hover:text-violet-400 transition-all duration-200"
                  title="Open in new tab"
                >
                  <FiExternalLink size={16} />
                </a>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl glass hover:bg-red-500/20 text-gray-500 dark:text-gray-400
                    hover:text-red-400 transition-all duration-200"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center
              dark:bg-dark-bg/50 bg-gray-100/50 min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={title}
                className="max-w-full max-h-[65vh] object-contain rounded-xl shadow-2xl"
                style={{ boxShadow: '0 0 40px rgba(124,58,237,0.2)' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── PDF Modal ────────────────────────────────────────────── */
interface PDFModalProps {
  open:        boolean
  onClose:     () => void
  pdfUrl:      string
  title:       string
  downloadUrl?: string
}

export function PDFModal({ open, onClose, pdfUrl, title, downloadUrl }: PDFModalProps) {
  useEffect(() => {
    if (!open) return
    const close = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', close)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', close)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" />

          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 30 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{    scale: 0.88, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-4xl h-[90vh] flex flex-col rounded-2xl overflow-hidden
              dark:bg-dark-card bg-white border border-violet-500/30 shadow-[0_0_80px_rgba(124,58,237,0.3)]"
          >
            <div className="h-0.5 w-full bg-gradient-to-r from-violet-600 via-pink-500 to-cyan-500 flex-shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0
              border-b border-violet-500/10 dark:bg-dark-surface/50 bg-gray-50/80">
              <h3 className="font-display font-bold text-lg dark:text-white text-gray-900">{title}</h3>
              <div className="flex items-center gap-2">
                {(downloadUrl || pdfUrl) && (
                  <a
                    href={downloadUrl || pdfUrl}
                    download
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl glass
                      hover:bg-violet-500/20 text-gray-500 dark:text-gray-300 hover:text-violet-400
                      transition-all text-sm font-medium"
                  >
                    <FiDownload size={14} /> Download
                  </a>
                )}
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl glass hover:bg-violet-500/20 text-gray-500 dark:text-gray-400
                    hover:text-violet-400 transition-all"
                  title="Open in new tab"
                >
                  <FiMaximize size={16} />
                </a>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl glass hover:bg-red-500/20 text-gray-500 dark:text-gray-400
                    hover:text-red-400 transition-all"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* PDF iframe */}
            <div className="flex-1 overflow-hidden dark:bg-dark-bg bg-gray-100">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                className="w-full h-full border-0"
                title={title}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
