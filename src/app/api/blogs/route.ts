import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Blog from '@/models/Blog'

// GET all blogs
export async function GET() {
  try {
    await connectDB()
    const blogs = await Blog.find().sort({ createdAt: -1 })
    return NextResponse.json(blogs)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

// POST create a new blog
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    const blog = await Blog.create(body)
    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 })
  }
}