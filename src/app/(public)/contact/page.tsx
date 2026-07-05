import connectDB from '@/lib/mongodb'
import Contact from '@/models/Contact'
import ContactForm from './ContactForm'

// Cached static render; contact info is baked into the HTML (no client fetch,
// no per-visit DB hit). Admin edits trigger on-demand revalidation.
export const revalidate = 3600

export default async function ContactPage() {
  let contactInfo = null

  try {
    await connectDB()
    const contact = await Contact.findOne().lean()
    contactInfo = contact ? JSON.parse(JSON.stringify(contact)) : null
  } catch (error) {
    console.error('Failed to fetch contact info:', error)
  }

  return (
    <div className="container max-w-7xl mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Me</h1>
      <ContactForm contactInfo={contactInfo} />
    </div>
  )
}
