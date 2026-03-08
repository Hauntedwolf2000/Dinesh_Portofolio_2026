'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi'

const NAV_LINKS = [
  { href: '#about',          label: 'About' },
  { href: '#skills',         label: 'Skills' },
  { href: '#experience',     label: 'Experience' },
  { href: '#projects',       label: 'Projects' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#achievements',   label: 'Achievements' },
  { href: '#testimonials',   label: 'Testimonials' },
  { href: '#contact',        label: 'Contact' },
]

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted,   setMounted]   = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-3 dark:bg-dark-surface/90 bg-white/90 backdrop-blur-xl shadow-card-dark border-b border-dark-border/40'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="container-max flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <a href="#" className="font-display font-bold text-2xl gradient-text">
            &lt;Dinesh /&gt;
          </a>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="relative px-3 py-2 text-sm font-medium transition-colors duration-200
                    text-gray-600 dark:text-gray-400
                    hover:text-violet-600 dark:hover:text-violet-400
                    group"
                >
                  {label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-600 to-pink-500 
                    transition-all duration-300 group-hover:w-full rounded-full" />
                </a>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl glass transition-all duration-300
                  hover:bg-violet-500/20 hover:shadow-glow-sm text-gray-600 dark:text-gray-300"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={theme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0,   opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
                  </motion.span>
                </AnimatePresence>
              </button>
            )}

            <a
              href="#contact"
              className="hidden sm:block btn-primary text-sm py-2 px-5"
            >
              Hire Me
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="lg:hidden p-2 rounded-xl glass text-gray-600 dark:text-gray-300"
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[72px] z-40 lg:hidden
              dark:bg-dark-surface/95 bg-white/95 backdrop-blur-xl
              border-b border-dark-border/40 shadow-2xl"
          >
            <ul className="flex flex-col py-4 px-6 gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-base font-medium text-gray-700 dark:text-gray-300
                      hover:text-violet-600 dark:hover:text-violet-400 transition-colors
                      border-b border-gray-100 dark:border-dark-border last:border-0"
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li className="pt-3">
                <a href="#contact" onClick={() => setMobileOpen(false)} className="btn-primary block text-center text-sm">
                  Hire Me
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
