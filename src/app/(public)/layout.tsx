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
      <main className="min-h-screen pt-14">
        {children}
      </main>
      <Footer />
    </>
  )
}
