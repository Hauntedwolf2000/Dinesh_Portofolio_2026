'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiBriefcase, FiCalendar, FiMapPin, FiCheckCircle } from 'react-icons/fi'
import type { Experience as Exp } from '@/types'

interface Props { experience: Exp[] }

export default function Experience({ experience }: Props) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const fmt = (d: string) =>
    new Date(d + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

  return (
    <section id="experience" className="section-padding relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-1/4 left-0 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <span className="section-label">Experience</span>
          <h2 className="section-title">
            Work <span className="gradient-text">History</span>
          </h2>
          <p className="section-subtitle">My professional journey and key contributions</p>
        </motion.div>

        {experience.length === 0 && (
          <p className="text-center text-gray-400 py-12">No experience added yet.</p>
        )}

        <div className="relative max-w-3xl mx-auto">
          {/* Timeline line */}
          {experience.length > 0 && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-violet-600 via-pink-500 to-cyan-500 origin-top hidden sm:block"
            />
          )}

          <div className="space-y-8">
            {experience.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 + 0.2 }}
                className="relative sm:pl-20"
              >
                {/* Timeline dot */}
                <div className="hidden sm:flex absolute left-5 top-6 w-6 h-6 rounded-full border-2 border-violet-500 bg-dark-surface items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
                </div>

                <div className="card group relative overflow-hidden">
                  {/* Shimmer on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(135deg, rgba(124,58,237,0.05) 0%, rgba(236,72,153,0.05) 100%)',
                    }}
                  />

                  {/* Current badge */}
                  {exp.current && (
                    <div className="absolute top-4 right-4">
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Current
                      </span>
                    </div>
                  )}

                  <div className="flex items-start gap-4 mb-4">
                    {/* Company logo / badge */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-glow-sm">
                      {exp.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={exp.logo}
                          alt={exp.company}
                          className="w-full h-full object-contain bg-white p-1"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center">
                          <FiBriefcase className="text-white" size={20} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-lg dark:text-white pr-20">
                        {exp.role}
                      </h3>
                      <div className="font-semibold text-violet-500 dark:text-violet-400">
                        {exp.company}
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <FiCalendar size={12} />
                          {fmt(exp.startDate)} — {exp.current ? 'Present' : exp.endDate ? fmt(exp.endDate) : ''}
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <FiMapPin size={12} />
                            {exp.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                    {exp.description}
                  </p>

                  {exp.achievements.length > 0 && (
                    <div className="space-y-2">
                      {exp.achievements.map((ach, j) => (
                        <div key={j} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <FiCheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0" size={14} />
                          {ach}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
