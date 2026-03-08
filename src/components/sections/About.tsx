"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FiMapPin, FiMail, FiCode, FiCoffee, FiZap } from "react-icons/fi";
import type { PortfolioData } from "@/types";

interface Props {
  about: PortfolioData["about"];
}

const name = process.env.NEXT_PUBLIC_OWNER_NAME || "Dinesh";
const email = process.env.NEXT_PUBLIC_OWNER_EMAIL || "";

export default function About({ about }: Props) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const facts = [
    { icon: FiCode, label: "Lines of code written", value: "200,000+" },
    { icon: FiCoffee, label: "Cups of coffee consumed", value: "1000+" },
    { icon: FiZap, label: "Problems solved", value: "50+" },
  ];

  return (
    <section
      id="about"
      className="section-padding relative overflow-hidden pt-10"
      ref={ref}
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-0 w-64 h-64 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-pink-600/10 blur-3xl" />
      </div>

      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <span className="section-label">About Me</span>
          <h2 className="section-title">
            Crafting Code with <span className="gradient-text">Passion</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Avatar / Visual side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative flex flex-col items-center justify-center h-full pb-16"
          >
            {/* Decorative rings */}
            <div className="relative w-72 h-72 mx-auto lg:mx-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-600 to-pink-500 animate-spin-slow opacity-30" />
              <div
                className="absolute inset-3 rounded-full bg-gradient-to-tl from-cyan-500 to-violet-600 animate-spin-slow opacity-20"
                style={{ animationDirection: "reverse" }}
              />
              <div className="absolute inset-6 rounded-full overflow-hidden border-4 border-violet-500/40 flex items-center justify-center bg-gradient-to-br from-violet-600 to-pink-500">
                {about.profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={about.profileImage}
                    alt={name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="font-display text-7xl font-bold text-white">
                    {name.charAt(0)}
                  </span>
                )}
              </div>
              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 glass px-4 py-2 rounded-xl border border-violet-400/30"
              >
                <span className="text-sm font-semibold text-violet-400">
                  ⚡ Full Stack
                </span>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -bottom-4 -left-12 glass px-4 py-2 rounded-xl border border-pink-400/30"
              >
                <span className="text-sm font-semibold text-pink-400">
                  🚀 1.5+ Years
                </span>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -bottom-0 -right-28 glass px-4 py-2 rounded-xl border border-pink-400/30"
              >
                <span className="text-sm font-semibold text-pink-400">
                  ⚒️ Scorm Developer
                </span>
              </motion.div>
            </div>

            {/* Fun facts */}
            <div className="mt-8 grid grid-cols-3 gap-3 pt-12">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="card text-center p-4">
                  <Icon className="mx-auto mb-2 text-violet-500" size={20} />
                  <div className="font-display font-bold text-lg gradient-text">
                    {value}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-tight">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {about.bio}
            </p>

            <div className="flex flex-wrap gap-4">
              {about.location && (
                <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <FiMapPin className="text-violet-500" />
                  {about.location}
                </span>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-violet-500 transition-colors"
                >
                  <FiMail className="text-violet-500" />
                  {email}
                </a>
              )}
            </div>

            {/* What I do */}
            <div className="space-y-3">
              <h3 className="font-display font-semibold text-lg dark:text-white">
                What I Do
              </h3>
              {[
                {
                  emoji: "🎨",
                  title: "Frontend Development",
                  desc: "Pixel-perfect UIs with React, Next.js and modern CSS",
                },
                {
                  emoji: "⚙️",
                  title: "Backend Engineering",
                  desc: "Scalable APIs and microservices with Node.js & express.js",
                },
                {
                  emoji: "☁️",
                  title: "Cloud & DevOps",
                  desc: "Deployment pipelines on Netlify and Vercel",
                },
                {
                  emoji: "🤖",
                  title: "AI Integration",
                  desc: "Building AI-powered features with OpenAI, Ollama, and custom models",
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  whileHover={{ x: 4 }}
                  className="flex gap-4 p-3 rounded-xl hover:bg-violet-500/10 transition-all duration-200"
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <div className="font-semibold text-sm dark:text-white">
                      {item.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {item.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-4 pt-2">
              <a href="#projects" className="btn-primary text-sm">
                View Projects
              </a>
              <a href="#contact" className="btn-outline text-sm">
                Contact Me
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
