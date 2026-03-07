import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PreLoader from '../components/PreLoader'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PreLoader />
      <Navbar />
      <main className="min-h-screen pt-16 md:pt-24">
        {children}
      </main>
      <Footer />
    </>
  )
}
