import mongoose, { Schema, Model } from 'mongoose'

export interface IBlog {
  _id?: string
  title: string
  excerpt: string
  date: string
  readTime: string
  slug: string
  mediumUrl: string
  createdAt?: Date
  updatedAt?: Date
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    date: { type: String, required: true },
    readTime: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    mediumUrl: { type: String, required: true },
  },
  { timestamps: true }
)

const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema)

export default Blog
