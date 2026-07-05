import connectDB from '@/lib/mongodb'
import About from '@/models/About'
import AboutContent, { type AboutData } from './AboutContent'

// Cached static render; about content is baked into the HTML (no client fetch,
// no per-visit DB hit). Admin edits trigger on-demand revalidation.
export const revalidate = 3600

export default async function AboutPage() {
  let about: AboutData | null = null

  try {
    await connectDB()
    const doc = await About.findOne().lean()
    about = doc ? JSON.parse(JSON.stringify(doc)) : null
  } catch (error) {
    console.error('Failed to fetch about info:', error)
  }

  return <AboutContent about={about} />
}
