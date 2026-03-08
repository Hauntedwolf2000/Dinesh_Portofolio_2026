'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import type { Skill } from '@/types'

interface Props { skills: Skill[] }

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: 'from-violet-500 to-purple-600',
  Backend:  'from-cyan-500 to-blue-600',
  Database: 'from-emerald-500 to-green-600',
  DevOps:   'from-orange-500 to-amber-600',
  Tools:    'from-pink-500 to-rose-600',
  Other:    'from-gray-500 to-slate-600',
}

export default function Skills({ skills }: Props) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const categories = [...Array.from(new Set(skills.map(s => s.category))), 'All']
  const [active, setActive] = useState('Frontend')

  const filtered = active === 'All' ? skills : skills.filter(s => s.category === active)

  return (
    <section id="skills" className="section-padding relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-cyan-600/10 blur-3xl" />
      </div>

      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <span className="section-label">Skills</span>
          <h2 className="section-title">
            My <span className="gradient-text">Tech Stack</span>
          </h2>
          <p className="section-subtitle">
            Technologies I use to bring ideas to life
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                active === cat
                  ? 'bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-glow-sm'
                  : 'glass text-gray-600 dark:text-gray-400 hover:text-violet-500 hover:border-violet-400/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Skills grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((skill, i) => {
            const gradient = CATEGORY_COLORS[skill.category] || CATEGORY_COLORS.Other
            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="card group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-glow-sm`}>
                      <span className="text-white font-bold text-sm">{skill.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm dark:text-white">{skill.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{skill.category}</div>
                    </div>
                  </div>
                  <span className="font-display font-bold text-lg gradient-text">{skill.level}%</span>
                </div>

                {/* Skill bar */}
                <div className="skill-bar">
                  <motion.div
                    className="skill-fill"
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                    transition={{ duration: 1.2, delay: i * 0.05 + 0.3, ease: 'easeOut' }}
                  />
                </div>

                {/* Level label */}
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-2">
                  <span>Beginner</span>
                  <span className={`font-medium ${
                    skill.level >= 80 ? 'text-emerald-500' :
                    skill.level >= 60 ? 'text-yellow-500' : 'text-gray-400'
                  }`}>
                    {skill.level >= 80 ? 'Expert' : skill.level >= 60 ? 'Proficient' : 'Learning'}
                  </span>
                  <span>Expert</span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {skills.length === 0 && (
          <p className="text-center text-gray-400 py-12">No skills added yet.</p>
        )}
      </div>
    </section>
  )
}
