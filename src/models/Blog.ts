import mongoose, { Schema, Model } from 'mongoose'

export interface IBlog {
  _id?: string
  title: string
  excerpt: string
  slug: string
  content: string
  coverImage?: string
  tags?: string[]
  createdAt?: Date
  updatedAt?: Date
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    tags: { type: [String] },
  },
  { timestamps: true }
)

const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema)

export default Blog
