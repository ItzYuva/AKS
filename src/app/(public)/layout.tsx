import PreLoader from '../components/PreLoader'
import LandingNavbar from '@/components/landing/LandingNavbar'
import LandingFooter from '@/components/landing/LandingFooter'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PreLoader />
      <LandingNavbar />
      <main className="min-h-screen pt-16">
        {children}
      </main>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <LandingFooter />
      </div>
    </>
  )
}
