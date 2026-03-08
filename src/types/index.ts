export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  tech: string[]
  category: string
  liveUrl?: string
  githubUrl?: string
  image?: string
  featured: boolean
  createdAt: string
}

export interface Skill {
  id: string
  name: string
  level: number       // 0-100
  category: string    // Frontend | Backend | DevOps | Tools | etc.
  icon?: string
}

export interface Experience {
  id: string
  company: string
  role: string
  description: string
  startDate: string
  endDate?: string    // undefined = current
  current: boolean
  location?: string
  logo?: string
  achievements: string[]
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  credentialUrl?: string
  certificateUrl?: string  // image URL to show in modal
  image?: string
  badgeColor?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  date: string
  icon?: string
  category: string
  certificateUrl?: string  // image URL for certificate modal
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  avatar?: string
  rating: number
  linkedinUrl?: string
}

export interface AnalyticsEvent {
  id: string
  type: 'page_view' | 'project_click' | 'resume_download' | 'contact_click' | 'social_click'
  metadata?: Record<string, string>
  timestamp: string
  ip?: string
  userAgent?: string
  country?: string
}

export interface AnalyticsSummary {
  totalVisits: number
  uniqueVisitors: number
  projectClicks: number
  resumeDownloads: number
  contactClicks: number
  todayVisits: number
  weekVisits: number
  monthVisits: number
  topProjects: { id: string; title: string; clicks: number }[]
  visitsByDay: { date: string; count: number }[]
  deviceBreakdown: { device: string; count: number }[]
}

export interface PortfolioData {
  projects:       Project[]
  skills:         Skill[]
  experience:     Experience[]
  certifications: Certification[]
  achievements:   Achievement[]
  testimonials:   Testimonial[]
  resumeUrl:      string
  about: {
    bio:          string
    location:     string
    available:    boolean
    profileImage?: string   // URL to profile photo
    whatsapp?:    string    // phone number e.g. +919876543210
  }
}

export interface OTPStore {
  [email: string]: {
    code:      string
    expiresAt: number
  }
}
