import connectDB from '@/lib/mongodb'
import Blog from '@/models/Blog'
import BlogsList from './BlogsList'

export const dynamic = 'force-dynamic'

export default async function BlogsPage() {
  await connectDB()
  const blogs = await Blog.find().sort({ createdAt: -1 }).lean()
  const serializedBlogs = JSON.parse(JSON.stringify(blogs))

  return <BlogsList blogs={serializedBlogs} />
}
