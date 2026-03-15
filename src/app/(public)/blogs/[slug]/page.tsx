import { notFound } from 'next/navigation'
import connectDB from '@/lib/mongodb'
import Blog from '@/models/Blog'
import BlogContent from './BlogContent'
import React from 'react'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  await connectDB()
  const blog = await Blog.findOne({ slug })
  
  if (!blog) {
    return { title: 'Blog Not Found' }
  }

  return {
    title: `${blog.title} | Aditya Sinha`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.coverImage ? [blog.coverImage] : [],
    },
  }
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  await connectDB()
  const blogData = await Blog.findOne({ slug })

  if (!blogData) {
    notFound()
  }

  // Convert mongoose document to plain JS object to pass to client component safely
  const blog = JSON.parse(JSON.stringify(blogData))

  return <BlogContent blog={blog} />
}
