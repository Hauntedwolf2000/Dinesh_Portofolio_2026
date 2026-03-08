import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const ownerName  = process.env.NEXT_PUBLIC_OWNER_NAME  || 'Dinesh'
const ownerTitle = process.env.NEXT_PUBLIC_OWNER_TITLE || 'Full Stack Developer'
const siteUrl    = process.env.NEXT_PUBLIC_SITE_URL    || 'https://dinesh2000.netlify.app'

export const metadata: Metadata = {
  title:       `${ownerName} | ${ownerTitle}`,
  description: `Portfolio of ${ownerName} — ${ownerTitle}. Building modern web experiences.`,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title:       `${ownerName} | ${ownerTitle}`,
    description: `Portfolio of ${ownerName} — ${ownerTitle}`,
    url:         siteUrl,
    siteName:    `${ownerName}'s Portfolio`,
    type:        'website',
  },
  twitter: {
    card:        'summary_large_image',
    title:       `${ownerName} | ${ownerTitle}`,
    description: `Portfolio of ${ownerName} — ${ownerTitle}`,
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#12121e',
                color:      '#f1f0ff',
                border:     '1px solid #7c3aed',
                borderRadius: '12px',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
