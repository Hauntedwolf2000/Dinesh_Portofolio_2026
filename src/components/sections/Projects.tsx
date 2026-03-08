"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FiExternalLink,
  FiGithub,
  FiStar,
  FiPlay,
  FiX,
  FiMaximize2,
} from "react-icons/fi";
import { trackEvent } from "@/components/ui/Analytics";
import type { Project } from "@/types";

interface Props {
  projects: Project[];
}

/* ─── helpers ──────────────────────────────────────────────── */

/** Convert any YouTube / Vimeo / raw-mp4 URL to an embeddable form */
function toEmbedUrl(url: string): {
  type: "youtube" | "vimeo" | "mp4";
  src: string;
} {
  // YouTube
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (yt)
    return {
      type: "youtube",
      src: `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`,
    };

  // Vimeo
  const vi = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vi)
    return {
      type: "vimeo",
      src: `https://player.vimeo.com/video/${vi[1]}?autoplay=1`,
    };

  // Raw mp4 / local file
  return { type: "mp4", src: url };
}

/** Derive a static thumbnail from YouTube/Vimeo for the card preview */
function getThumbnail(url: string): string | null {
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (yt) return `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`;

  const vi = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vi) return `https://vumbnail.com/${vi[1]}.jpg`;

  return null; // for mp4 we show gradient placeholder
}

/* ─── Video Modal ──────────────────────────────────────────── */
function VideoModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  if (!project.videoUrl) return null;
  const embed = toEmbedUrl(project.videoUrl);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 260 }}
        className="relative w-full max-w-4xl z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h3 className="font-display font-bold text-white text-lg leading-tight">
              {project.title}
            </h3>
            <span className="text-xs text-violet-400">{project.category}</span>
          </div>
          <div className="flex items-center gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl glass text-violet-400 hover:bg-violet-500/20 transition-colors"
                title="Open live demo"
              >
                <FiMaximize2 size={16} />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl glass text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Video */}
        <div
          className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-violet-500/20"
          style={{ aspectRatio: "16/9" }}
        >
          {embed.type === "mp4" ? (
            <video
              src={embed.src}
              controls
              autoPlay
              className="w-full h-full object-contain bg-black"
            />
          ) : (
            <iframe
              src={embed.src}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        {/* Footer links */}
        <div className="flex flex-wrap gap-3 mt-3 px-1">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              <FiExternalLink size={12} /> Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 font-medium transition-colors"
            >
              <FiGithub size={12} /> Source Code
            </a>
          )}
          <div className="flex flex-wrap gap-1.5 ml-auto">
            {project.tech.slice(0, 5).map((t) => (
              <span key={t} className="tech-tag">
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main component ───────────────────────────────────────── */
export default function Projects({ projects }: Props) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const categories = [
    "All",
    ...Array.from(new Set(projects.map((p) => p.category))),
  ];
  const [active, setActive] = useState("All");
  const [videoProject, setVideoProject] = useState<Project | null>(null);

  const filtered =
    active === "All" ? projects : projects.filter((p) => p.category === active);

  const handleCardClick = (p: Project) => {
    trackEvent("project_click", { projectId: p.id, title: p.title });
    if (p.videoUrl) setVideoProject(p);
  };

  return (
    <section
      id="projects"
      className="section-padding relative overflow-hidden"
      ref={ref}
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full bg-pink-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-cyan-600/10 blur-3xl" />
      </div>

      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <span className="section-label">Portfolio</span>
          <h2 className="section-title">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="section-subtitle">
            A selection of projects that showcase my skills and creativity
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                active === cat
                  ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-glow-sm"
                  : "glass text-gray-600 dark:text-gray-400 hover:text-violet-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => {
              const hasVideo = Boolean(project.videoUrl);
              const vidThumb = hasVideo
                ? getThumbnail(project.videoUrl!)
                : null;
              const thumbToShow = project.image || vidThumb;

              return (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ y: -8 }}
                  className={`card group relative overflow-hidden ${hasVideo ? "cursor-pointer" : ""}`}
                  onClick={() => handleCardClick(project)}
                >
                  {/* Featured badge */}
                  {project.featured && (
                    <div className="absolute top-4 right-4 z-10">
                      <span
                        className="flex items-center gap-1 text-xs font-semibold text-amber-400
                        bg-amber-400/10 px-2 py-1 rounded-full border border-amber-400/30"
                      >
                        <FiStar size={10} className="fill-current" /> Featured
                      </span>
                    </div>
                  )}

                  {/* Video badge */}
                  {hasVideo && (
                    <div className="absolute top-4 left-4 z-10">
                      <span
                        className="flex items-center gap-1 text-xs font-semibold text-violet-300
                        bg-violet-600/30 px-2 py-1 rounded-full border border-violet-400/40 backdrop-blur-sm"
                      >
                        <FiPlay size={9} className="fill-current" /> Video
                      </span>
                    </div>
                  )}

                  {/* Thumbnail / placeholder */}
                  <div className="h-44 rounded-xl mb-4 overflow-hidden relative">
                    {thumbToShow ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbToShow}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div
                        className="w-full h-full bg-gradient-to-br from-violet-600/30 to-pink-500/30
                        flex items-center justify-center relative"
                      >
                        <div
                          className="absolute inset-0 opacity-40"
                          style={{
                            backgroundImage: `radial-gradient(circle at 30% 50%, rgba(124,58,237,0.6) 0%, transparent 50%),
                              radial-gradient(circle at 70% 50%, rgba(236,72,153,0.6) 0%, transparent 50%)`,
                          }}
                        />
                        <span className="font-display font-bold text-4xl text-white/60 relative z-10">
                          {project.title.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      flex items-center justify-center gap-3"
                    >
                      {/* Big play button for video projects */}
                      {hasVideo && (
                        <div
                          className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm
                          border-2 border-white/50 flex items-center justify-center
                          group-hover:scale-110 transition-transform duration-300"
                        >
                          <FiPlay
                            size={22}
                            className="text-white fill-current ml-1"
                          />
                        </div>
                      )}

                      {/* External links (non-video) */}
                      {!hasVideo && (
                        <div className="flex gap-2 absolute bottom-4">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 rounded-full bg-white text-gray-900 hover:bg-violet-500 hover:text-white transition-colors"
                            >
                              <FiExternalLink size={15} />
                            </a>
                          )}
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 rounded-full bg-white text-gray-900 hover:bg-violet-500 hover:text-white transition-colors"
                            >
                              <FiGithub size={15} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="tech-tag text-xs mb-2 inline-block">
                    {project.category}
                  </span>

                  <h3
                    className="font-display font-bold text-lg dark:text-white mb-2
                    group-hover:text-violet-400 transition-colors"
                  >
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.slice(0, 4).map((t) => (
                      <span key={t} className="tech-tag">
                        {t}
                      </span>
                    ))}
                    {project.tech.length > 4 && (
                      <span className="tech-tag">
                        +{project.tech.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Bottom links */}
                  <div className="flex gap-3 mt-4 pt-4 border-t border-dark-border/40">
                    {hasVideo && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setVideoProject(project);
                        }}
                        className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium"
                      >
                        <FiPlay size={12} className="fill-current" /> Watch Demo
                      </button>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium"
                      >
                        <FiExternalLink size={12} /> Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors font-medium"
                      >
                        <FiGithub size={12} /> Source
                      </a>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {projects.length === 0 && (
          <p className="text-center text-gray-400 py-12">
            No projects added yet.
          </p>
        )}
      </div>

      {/* Video modal */}
      <AnimatePresence>
        {videoProject && (
          <VideoModal
            project={videoProject}
            onClose={() => setVideoProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
