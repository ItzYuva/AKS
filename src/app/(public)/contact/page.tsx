import connectDB from '@/lib/mongodb'
import Contact from '@/models/Contact'
import ContactForm from './ContactForm'

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

  return <ContactForm contactInfo={contactInfo} />
}
