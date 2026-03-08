import { getPortfolioData } from '@/lib/dataStore'
import Navbar       from '@/components/layout/Navbar'
import Footer       from '@/components/layout/Footer'
import Hero         from '@/components/sections/Hero'
import About        from '@/components/sections/About'
import Skills       from '@/components/sections/Skills'
import Experience   from '@/components/sections/Experience'
import Projects     from '@/components/sections/Projects'
import Certifications from '@/components/sections/Certifications'
import Achievements from '@/components/sections/Achievements'
import Testimonials from '@/components/sections/Testimonials'
import Resume       from '@/components/sections/Resume'
import Contact      from '@/components/sections/Contact'
import CursorGlow   from '@/components/ui/CursorGlow'
import Analytics    from '@/components/ui/Analytics'

export const revalidate = 60 // ISR: refresh every 60s

export default async function HomePage() {
  const data = getPortfolioData()

  return (
    <>
      <CursorGlow />
      <Analytics />
      <Navbar />
      <main className="relative overflow-x-hidden">
        <Hero about={data.about} />
        <About about={data.about} />
        <Skills skills={data.skills} />
        <Experience experience={data.experience} />
        <Projects projects={data.projects} />
        <Certifications certifications={data.certifications} />
        <Achievements achievements={data.achievements} />
        <Testimonials testimonials={data.testimonials} />
        <Resume resumeUrl={data.resumeUrl} />
        <Contact whatsapp={data.about.whatsapp} />
      </main>
      <Footer />
    </>
  )
}
