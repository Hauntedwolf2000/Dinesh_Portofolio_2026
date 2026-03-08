"use client";
import { useState } from "react";
import { FiPlay } from "react-icons/fi";
import CRUDManager from "./CRUDManager";
import FileUpload from "@/components/ui/FileUpload";
import type {
  Project,
  Skill,
  Experience,
  Certification,
  Achievement,
  Testimonial,
} from "@/types";

/* ══════════════════════════════════════════════════════════
   PROJECTS
══════════════════════════════════════════════════════════ */
export function ProjectsManager({
  items,
  onSave,
}: {
  items: Project[];
  onSave: () => void;
}) {
  return (
    <CRUDManager
      section="projects"
      title="Projects"
      items={items}
      onSave={onSave}
      defaultItem={
        {
          title: "",
          description: "",
          longDescription: "",
          tech: [],
          category: "Full Stack",
          liveUrl: "",
          githubUrl: "",
          image: "",
          videoUrl: "",
          featured: false,
          createdAt: new Date().toISOString().split("T")[0],
        } as Partial<Project>
      }
      fields={[
        {
          key: "title",
          label: "Title",
          type: "text",
          placeholder: "My Project",
          required: true,
        },
        {
          key: "category",
          label: "Category",
          type: "select",
          options: [
            "Full Stack",
            "Frontend",
            "Backend",
            "AI/ML",
            "E-Learning",
            "LMS",
            "Mobile",
            "DevOps",
            "Other",
          ],
        },
        {
          key: "description",
          label: "Short Description",
          type: "textarea",
          placeholder: "Brief overview…",
          required: true,
        },
        {
          key: "longDescription",
          label: "Long Description",
          type: "textarea",
          placeholder: "Detailed overview…",
        },
        {
          key: "tech",
          label: "Tech Stack",
          type: "array",
          placeholder: "React, SCORM, n8n…",
        },
        {
          key: "image",
          label: "Thumbnail URL",
          type: "text",
          placeholder: "/resources/project.png or https://…",
        },
        {
          key: "videoUrl",
          label: "Demo Video  — YouTube link, Vimeo link, or uploaded .mp4",
          type: "text",
          placeholder: "https://youtube.com/watch?v=…  or  /resources/demo.mp4",
        },
        {
          key: "liveUrl",
          label: "Live URL",
          type: "text",
          placeholder: "https://…",
        },
        {
          key: "githubUrl",
          label: "GitHub URL",
          type: "text",
          placeholder: "https://github.com/…",
        },
        { key: "featured", label: "Featured", type: "checkbox" },
        {
          key: "createdAt",
          label: "Date",
          type: "text",
          placeholder: "YYYY-MM-DD",
        },
      ]}
      extraFields={(form, setField) => (
        <>
          {/* ── Thumbnail upload ───── */}
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">
              Thumbnail — Upload Image
            </label>
            <FileUpload
              folder="project"
              accept="image/*"
              label="Upload Thumbnail"
              type="image"
              preview={form.image as string}
              onUpload={(url) => setField("image", url)}
            />
          </div>

          {/* ── Video upload ─────────── */}
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">
              Demo Video — Upload File
              <span className="ml-1.5 text-violet-400 font-normal text-[11px]">
                max 200 MB · mp4 / webm / mov
              </span>
            </label>
            <FileUpload
              folder="project-video"
              accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
              label="Upload Demo Video"
              type="any"
              onUpload={(url) => setField("videoUrl", url)}
            />
          </div>

          {/* ── Live video preview (full width) ── */}
          {(form.videoUrl as string) && (
            <div className="sm:col-span-2">
              {/^https?:\/\/(www\.)?(youtube|youtu\.be|vimeo)/.test(
                form.videoUrl as string,
              ) ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-violet-500/5 border border-violet-400/20 text-xs text-gray-400">
                  <FiPlay
                    size={12}
                    className="text-violet-400 fill-current flex-shrink-0"
                  />
                  External video linked — will open in modal on the portfolio
                </div>
              ) : (
                <div>
                  <label className="text-xs font-medium text-gray-400 mb-1.5 block">
                    Video Preview
                  </label>
                  <video
                    src={form.videoUrl as string}
                    className="w-full max-h-48 rounded-xl object-contain bg-black border border-violet-500/20"
                    controls
                    preload="metadata"
                  />
                </div>
              )}
            </div>
          )}
        </>
      )}
      renderCard={(p: Project) => (
        <div>
          {/* Card thumbnail */}
          <div className="w-full h-28 rounded-xl mb-3 overflow-hidden relative bg-dark-muted border border-dark-border/30">
            {p.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-full object-cover"
              />
            ) : p.videoUrl &&
              /youtube\.com|youtu\.be/.test(p.videoUrl as string) ? (
              (() => {
                const yt = (p.videoUrl as string).match(
                  /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
                );
                return yt ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                ) : null;
              })()
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-display font-bold text-3xl text-gray-600 dark:text-gray-500 opacity-40">
                  {p.title.charAt(0)}
                </span>
              </div>
            )}
            {(p.videoUrl as string) && (
              <span
                className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-semibold
                text-violet-300 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm"
              >
                <FiPlay size={8} className="fill-current" /> Video
              </span>
            )}
          </div>

          <div className="flex items-start gap-2 mb-1">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold dark:text-white text-sm truncate">
                {p.title}
              </h3>
              <span className="tech-tag text-xs">{p.category}</span>
            </div>
            {p.featured && (
              <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full flex-shrink-0">
                ⭐
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
            {p.description}
          </p>
        </div>
      )}
    />
  );
}

/* ══════════════════════════════════════════════════════════
   SKILLS
══════════════════════════════════════════════════════════ */
export function SkillsManager({
  items,
  onSave,
}: {
  items: Skill[];
  onSave: () => void;
}) {
  return (
    <CRUDManager
      section="skills"
      title="Skills"
      items={items}
      onSave={onSave}
      defaultItem={
        { name: "", level: 75, category: "Frontend" } as Partial<Skill>
      }
      fields={[
        {
          key: "name",
          label: "Skill Name",
          type: "text",
          placeholder: "Moodle LMS",
          required: true,
        },
        {
          key: "category",
          label: "Category",
          type: "select",
          options: [
            "Frontend",
            "Backend",
            "Database",
            "DevOps",
            "Tools",
            "E-Learning",
            "LMS",
            "AI/ML",
            "Mobile",
            "Other",
          ],
        },
        {
          key: "level",
          label: "Level (0 – 100)",
          type: "number",
          min: 0,
          max: 100,
        },
      ]}
      renderCard={(s: Skill) => (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold dark:text-white text-sm">
              {s.name}
            </div>
            <span className="font-bold gradient-text">{s.level}%</span>
          </div>
          <span className="tech-tag text-xs">{s.category}</span>
          <div className="skill-bar mt-3">
            <div className="skill-fill" style={{ width: `${s.level}%` }} />
          </div>
        </div>
      )}
    />
  );
}

/* ══════════════════════════════════════════════════════════
   EXPERIENCE
══════════════════════════════════════════════════════════ */
export function ExperienceManager({
  items,
  onSave,
}: {
  items: Experience[];
  onSave: () => void;
}) {
  return (
    <CRUDManager
      section="experience"
      title="Experience"
      items={items}
      onSave={onSave}
      defaultItem={
        {
          company: "",
          role: "",
          description: "",
          startDate: "",
          endDate: "",
          current: false,
          location: "",
          logo: "",
          achievements: [],
        } as Partial<Experience>
      }
      fields={[
        {
          key: "role",
          label: "Job Title",
          type: "text",
          placeholder: "E-Learning Developer",
          required: true,
        },
        {
          key: "company",
          label: "Company",
          type: "text",
          placeholder: "Acme Corp",
          required: true,
        },
        {
          key: "logo",
          label: "Logo URL",
          type: "text",
          placeholder: "/resources/logo.png or https://…",
        },
        {
          key: "location",
          label: "Location",
          type: "text",
          placeholder: "Remote / City",
        },
        {
          key: "startDate",
          label: "Start (YYYY-MM)",
          type: "text",
          placeholder: "2023-01",
        },
        {
          key: "endDate",
          label: "End (YYYY-MM)",
          type: "text",
          placeholder: "Leave blank if current",
        },
        { key: "current", label: "Current Job", type: "checkbox" },
        {
          key: "description",
          label: "Description",
          type: "textarea",
          placeholder: "Role description…",
        },
        {
          key: "achievements",
          label: "Key Achievements",
          type: "array",
          placeholder: "Built SCORM module for 10k learners…",
        },
      ]}
      extraFields={(form, setField) => (
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-gray-400 mb-1.5 block">
            Company Logo — Upload
          </label>
          <FileUpload
            folder="logo"
            accept="image/*"
            label="Upload Company Logo"
            type="image"
            preview={form.logo as string}
            onUpload={(url) => setField("logo", url)}
          />
        </div>
      )}
      renderCard={(e: Experience) => (
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center">
              {e.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={e.logo}
                  alt={e.company}
                  className="w-full h-full object-contain bg-white p-0.5"
                />
              ) : (
                <span className="text-white font-bold text-xs">
                  {e.company.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <div className="font-semibold dark:text-white text-sm">
                {e.role}
              </div>
              <div className="text-xs text-violet-400">{e.company}</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {e.startDate} — {e.current ? "Present" : e.endDate}
          </div>
          {e.current && (
            <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full mt-1 inline-block">
              ● Current
            </span>
          )}
        </div>
      )}
    />
  );
}

/* ══════════════════════════════════════════════════════════
   CERTIFICATIONS
══════════════════════════════════════════════════════════ */
export function CertificationsManager({
  items,
  onSave,
}: {
  items: Certification[];
  onSave: () => void;
}) {
  return (
    <CRUDManager
      section="certifications"
      title="Certifications"
      items={items}
      onSave={onSave}
      defaultItem={
        {
          name: "",
          issuer: "",
          date: "",
          credentialUrl: "",
          certificateUrl: "",
          image: "",
          badgeColor: "#7c3aed",
        } as Partial<Certification>
      }
      fields={[
        {
          key: "name",
          label: "Certification Name",
          type: "text",
          placeholder: "AWS Developer",
          required: true,
        },
        {
          key: "issuer",
          label: "Issuing Organization",
          type: "text",
          placeholder: "Amazon Web Services",
        },
        {
          key: "date",
          label: "Date (YYYY-MM)",
          type: "text",
          placeholder: "2024-03",
        },
        {
          key: "credentialUrl",
          label: "Verify / Credential URL",
          type: "text",
          placeholder: "https://…",
        },
        {
          key: "certificateUrl",
          label: "Certificate Image URL",
          type: "text",
          placeholder: "/resources/cert.jpg or https://…",
        },
        {
          key: "image",
          label: "Issuer Logo URL",
          type: "text",
          placeholder: "/resources/aws-logo.png",
        },
        {
          key: "badgeColor",
          label: "Badge Colour (hex)",
          type: "text",
          placeholder: "#FF9900",
        },
      ]}
      extraFields={(form, setField) => (
        <>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">
              Certificate Image — Upload (shown in modal when clicked)
            </label>
            <FileUpload
              folder="certificate"
              accept="image/*"
              label="Upload Certificate Image"
              type="image"
              preview={form.certificateUrl as string}
              onUpload={(url) => setField("certificateUrl", url)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">
              Issuer Logo — Upload
            </label>
            <FileUpload
              folder="logo"
              accept="image/*"
              label="Upload Issuer Logo"
              type="image"
              preview={form.image as string}
              onUpload={(url) => setField("image", url)}
            />
          </div>
        </>
      )}
      renderCard={(c: Certification) => (
        <div>
          <div
            className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
            style={{ background: c.badgeColor || "#7c3aed" }}
          />
          <div className="flex items-start gap-3 pt-2">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
              style={{
                background: `${c.badgeColor || "#7c3aed"}20`,
                border: `2px solid ${c.badgeColor || "#7c3aed"}40`,
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
                <span
                  className="font-bold text-lg"
                  style={{ color: c.badgeColor || "#7c3aed" }}
                >
                  ✓
                </span>
              )}
            </div>
            <div className="min-w-0">
              <div className="font-semibold dark:text-white text-sm leading-tight">
                {c.name}
              </div>
              <div
                className="text-xs font-medium mt-0.5"
                style={{ color: c.badgeColor || "#7c3aed" }}
              >
                {c.issuer}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{c.date}</div>
              {c.certificateUrl && (
                <span className="text-[10px] text-violet-400 mt-1 inline-block">
                  🖼 Certificate attached
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    />
  );
}

/* ══════════════════════════════════════════════════════════
   ACHIEVEMENTS
══════════════════════════════════════════════════════════ */
export function AchievementsManager({
  items,
  onSave,
}: {
  items: Achievement[];
  onSave: () => void;
}) {
  return (
    <CRUDManager
      section="achievements"
      title="Achievements"
      items={items}
      onSave={onSave}
      defaultItem={
        {
          title: "",
          description: "",
          date: "",
          icon: "star",
          category: "Award",
          certificateUrl: "",
        } as Partial<Achievement>
      }
      fields={[
        {
          key: "title",
          label: "Title",
          type: "text",
          placeholder: "Hackathon Winner",
          required: true,
        },
        {
          key: "category",
          label: "Category",
          type: "select",
          options: [
            "Award",
            "Community",
            "Speaking",
            "Education",
            "Publication",
            "Other",
          ],
        },
        {
          key: "description",
          label: "Description",
          type: "textarea",
          placeholder: "Tell the story…",
        },
        {
          key: "date",
          label: "Date (YYYY-MM)",
          type: "text",
          placeholder: "2024-08",
        },
        {
          key: "icon",
          label: "Icon",
          type: "select",
          options: ["trophy", "code", "mic", "star", "users", "trend"],
        },
        {
          key: "certificateUrl",
          label: "Certificate Image URL",
          type: "text",
          placeholder: "/resources/award.jpg",
        },
      ]}
      extraFields={(form, setField) => (
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-gray-400 mb-1.5 block">
            Certificate / Award Image — Upload (shown in modal)
          </label>
          <FileUpload
            folder="achievement"
            accept="image/*"
            label="Upload Certificate / Award"
            type="image"
            preview={form.certificateUrl as string}
            onUpload={(url) => setField("certificateUrl", url)}
          />
        </div>
      )}
      renderCard={(a: Achievement) => (
        <div>
          <div className="font-semibold dark:text-white text-sm">{a.title}</div>
          <span className="tech-tag text-xs mt-1 inline-block">
            {a.category}
          </span>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
            {a.description}
          </p>
          {a.certificateUrl && (
            <span className="text-[10px] text-violet-400 mt-1 inline-block">
              🖼 Certificate attached
            </span>
          )}
        </div>
      )}
    />
  );
}

/* ══════════════════════════════════════════════════════════
   TESTIMONIALS
══════════════════════════════════════════════════════════ */
export function TestimonialsManager({
  items,
  onSave,
}: {
  items: Testimonial[];
  onSave: () => void;
}) {
  return (
    <CRUDManager
      section="testimonials"
      title="Testimonials"
      items={items}
      onSave={onSave}
      defaultItem={
        {
          name: "",
          role: "",
          company: "",
          content: "",
          rating: 5,
          linkedinUrl: "",
          avatar: "",
        } as Partial<Testimonial>
      }
      fields={[
        {
          key: "name",
          label: "Name",
          type: "text",
          placeholder: "Jane Smith",
          required: true,
        },
        {
          key: "role",
          label: "Job Title",
          type: "text",
          placeholder: "Product Manager",
        },
        {
          key: "company",
          label: "Company",
          type: "text",
          placeholder: "Acme Inc.",
        },
        {
          key: "content",
          label: "Testimonial",
          type: "textarea",
          placeholder: "Write testimonial here…",
          required: true,
        },
        {
          key: "rating",
          label: "Rating (1–5)",
          type: "number",
          min: 1,
          max: 5,
        },
        {
          key: "linkedinUrl",
          label: "LinkedIn Profile URL  (clicking their name opens this)",
          type: "text",
          placeholder: "https://linkedin.com/in/username",
        },
        {
          key: "avatar",
          label:
            'Profile Photo URL  — right-click their LinkedIn photo → "Copy image address" → paste here',
          type: "text",
          placeholder: "https://media.licdn.com/dms/image/…",
        },
      ]}
      extraFields={(form, setField) => (
        <div className="sm:col-span-2 space-y-3">
          {/* Live photo preview */}
          {(form.avatar as string) ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-500/5 border border-violet-400/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.avatar as string}
                alt="Photo preview"
                className="w-12 h-12 rounded-full object-cover border-2 border-violet-400/30 flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="text-xs text-gray-400">
                Photo preview — this is what visitors will see.
              </span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-400/20 text-xs text-gray-400 leading-relaxed">
              <span className="text-blue-400 font-semibold block mb-1">
                💡 How to get the LinkedIn photo URL:
              </span>
              1. Open their LinkedIn profile in a browser
              <br />
              2. Right-click their profile picture →{" "}
              <strong className="text-gray-300">Copy image address</strong>
              <br />
              3. Paste the URL into the{" "}
              <strong className="text-gray-300">Profile Photo URL</strong> field
              above
            </div>
          )}

          {/* Upload fallback */}
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">
              Or upload a photo from your device
            </label>
            <FileUpload
              folder="avatar"
              accept="image/*"
              label="Upload Profile Photo"
              type="image"
              preview={form.avatar as string}
              onUpload={(url) => setField("avatar", url)}
            />
          </div>
        </div>
      )}
      renderCard={(t: Testimonial) => (
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              {t.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                t.name.charAt(0)
              )}
            </div>
            <div className="min-w-0">
              <div className="font-semibold dark:text-white text-sm truncate">
                {t.name}
              </div>
              <div className="text-xs text-violet-400 truncate">
                {t.role} · {t.company}
              </div>
              {t.linkedinUrl && (
                <span className="text-[10px] text-blue-400 flex items-center gap-1 mt-0.5">
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  LinkedIn linked
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-0.5 mb-2">
            {Array.from({ length: t.rating }).map((_, i) => (
              <span key={i} className="text-amber-400 text-xs">
                ★
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 italic">
            &ldquo;{t.content}&rdquo;
          </p>
        </div>
      )}
    />
  );
}
