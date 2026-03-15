import connectDB from '@/lib/mongodb'
import Blog from '@/models/Blog'
import BlogsList from './BlogsList'

export const dynamic = 'force-dynamic'

export default async function BlogsPage() {
  let serializedBlogs = []

  try {
    await connectDB()
    const blogs = await Blog.find().sort({ createdAt: -1 }).lean()
    serializedBlogs = JSON.parse(JSON.stringify(blogs))
  } catch (error) {
    console.error("Failed to fetch blogs:", error)
  }

  return <BlogsList blogs={serializedBlogs} />
}
