import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiHeart } from 'react-icons/fi'

const name     = process.env.NEXT_PUBLIC_OWNER_NAME   || 'Dinesh'
const github   = process.env.NEXT_PUBLIC_GITHUB_URL   || '#'
const linkedin = process.env.NEXT_PUBLIC_LINKEDIN_URL || '#'
const twitter  = process.env.NEXT_PUBLIC_TWITTER_URL  || '#'
const email    = process.env.NEXT_PUBLIC_OWNER_EMAIL  || ''

const socials = [
  { href: github,            icon: FiGithub,   label: 'GitHub' },
  { href: linkedin,          icon: FiLinkedin, label: 'LinkedIn' },
  { href: `mailto:${email}`, icon: FiMail,     label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-violet-500/10 dark:border-dark-border/40 py-12 px-4">
      <div className="absolute inset-0 bg-gradient-to-t from-violet-600/5 to-transparent pointer-events-none" />

      <div className="container-max relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div>
            <span className="font-display font-bold text-xl gradient-text">&lt;{name} /&gt;</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Building learning experiences, one line at a time.
            </p>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {socials.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-3 rounded-xl glass hover:bg-violet-500/20 hover:shadow-glow-sm
                  text-gray-500 dark:text-gray-400 hover:text-violet-500 dark:hover:text-violet-400
                  transition-all duration-300 hover:-translate-y-1"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            Made with <FiHeart className="text-pink-500" size={14} /> by {name} · {new Date().getFullYear()}
          </p>
        </div>

        {/* Admin link — clearly visible in both themes */}
        <div className="mt-8 text-center">
          <a
            href="/admin/login"
            className="inline-block text-xs font-medium px-3 py-1 rounded-full
              text-gray-400 dark:text-gray-500
              bg-gray-100 dark:bg-dark-muted
              border border-gray-200 dark:border-dark-border
              hover:text-violet-600 dark:hover:text-violet-400
              hover:border-violet-400/40
              transition-all duration-200"
          >
            ⚙ Admin
          </a>
        </div>
      </div>
    </footer>
  )
}
