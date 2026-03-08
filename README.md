# 🚀 Dinesh's Portfolio — Next.js 14

A blazing-fast, feature-rich portfolio with an admin CMS and analytics dashboard.

## ✨ Features

- **Next.js 14** App Router + ISR (60s revalidation)
- **Framer Motion** animations (particles, scroll reveals, page transitions)
- **Dark / Light** theme with `next-themes`
- **Admin CMS** — manage all sections (login via email OTP)
- **Analytics Dashboard** — page views, unique visitors, project clicks, resume downloads, device breakdown
- **Sections:** Hero, About, Skills, Experience, Projects, Certifications, Achievements, Testimonials, Resume, Contact
- **Responsive** — mobile-first design
- **Syne + DM Sans** typography

---

## 🛠 Tech Stack

| Layer      | Tech                              |
|-----------|-----------------------------------|
| Framework  | Next.js 14 (App Router)           |
| Styling    | Tailwind CSS v3                   |
| Animation  | Framer Motion v11                 |
| Auth       | JWT (jose) + Email OTP            |
| Email      | Nodemailer (Gmail SMTP)           |
| Data       | JSON files (upgrade to DB easily) |
| Hosting    | Vercel (free tier) ✅              |

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env.local

# 3. Edit .env.local (see below)

# 4. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔧 Environment Variables

Edit `.env.local`:

```env
# Admin email — the ONLY email that can log in
ADMIN_EMAIL=your-email@gmail.com

# Strong random string (32+ chars)
JWT_SECRET=run_openssl_rand_-hex_32_here

# OTP expiry
OTP_EXPIRY_MINUTES=10

# Gmail SMTP (use App Password, not your main password)
# Go to: Google Account → Security → 2-Step Verification → App passwords
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx_xxxx_xxxx_xxxx

NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_OWNER_NAME=Dinesh
NEXT_PUBLIC_OWNER_TITLE=Full Stack Developer
NEXT_PUBLIC_OWNER_EMAIL=your-email@gmail.com
NEXT_PUBLIC_GITHUB_URL=https://github.com/yourhandle
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/yourhandle
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/yourhandle
```

---

## 🔐 Admin Panel

1. Go to `/admin/login`
2. Enter your `ADMIN_EMAIL`
3. Check your inbox for the OTP
4. Enter OTP → You're in!

**Admin capabilities:**
- ✏️ Edit About section (bio, location, availability)
- 📁 Add/Edit/Delete Projects
- 🛠 Add/Edit/Delete Skills
- 💼 Add/Edit/Delete Work Experience
- 🏆 Add/Edit/Delete Certifications
- ⭐ Add/Edit/Delete Achievements
- 💬 Add/Edit/Delete Testimonials
- 📄 Update Resume URL
- 📊 View Analytics Dashboard

---

## 📊 Analytics

Built-in analytics tracks:
- Total page views
- Unique visitors (by IP)
- Project link clicks
- Resume downloads
- Contact button clicks
- Daily visit chart (14 days)
- Device type breakdown
- Top clicked projects

All stored in `data/analytics.json`.

---

## 🚀 Deploy to Vercel (Free)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Project → Settings → Environment Variables
```

**Important:** Add all `.env.local` variables to Vercel's environment variables.

> **Note:** The `data/` directory (JSON files) resets on each Vercel deployment.
> For persistent data, migrate to a database:
> - **Supabase** (free, PostgreSQL)
> - **PlanetScale** (free, MySQL)
> - **MongoDB Atlas** (free, 512MB)

---

## 🌐 Alternative Free Hosting

| Platform   | Notes                              |
|-----------|------------------------------------|
| **Vercel** | Best for Next.js, free tier great  |
| **Netlify**| Works, add Next.js plugin          |
| **Railway**| $5 credit/mo, persistent storage  |
| **Render** | Free tier, cold starts             |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Portfolio homepage
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Design tokens & styles
│   ├── admin/
│   │   ├── login/page.tsx    # Admin login (OTP)
│   │   └── dashboard/        # Admin panel
│   └── api/
│       ├── track/            # Analytics tracking
│       ├── auth/             # OTP auth
│       ├── portfolio/        # CRUD API
│       └── analytics/        # Analytics summary
├── components/
│   ├── layout/               # Navbar, Footer
│   ├── sections/             # Hero, About, Skills, etc.
│   ├── admin/                # Admin panel components
│   └── ui/                   # CursorGlow, Analytics
├── lib/
│   ├── dataStore.ts          # Read/write JSON
│   ├── auth.ts               # JWT + OTP
│   ├── mailer.ts             # Nodemailer
│   └── utils.ts              # Helpers
├── types/index.ts            # TypeScript types
data/
├── portfolio.json            # Portfolio content
└── analytics.json            # Analytics events
```

---

## 🎨 Customization

1. **Colors:** Edit `tailwind.config.js` → `theme.extend.colors`
2. **Fonts:** Change Google Fonts in `app/layout.tsx` and `globals.css`
3. **Content:** Login to admin panel → edit everything visually
4. **Resume:** Put your PDF in `/public/resume.pdf` and set path in admin

---

## 📝 Adding Gmail App Password

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → 2-Step Verification (must be ON)
3. At bottom: App passwords
4. Select app: Mail → Device: Other → Name: "Portfolio"
5. Copy the 16-char password → paste into `SMTP_PASS`
