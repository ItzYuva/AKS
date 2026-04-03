import mongoose, { Schema, Document } from 'mongoose'

export interface IPageView extends Document {
  page: string
  referrer?: string
  userAgent?: string
  ip?: string
  country?: string
  region?: string
  city?: string
  device?: string
  browser?: string
  sessionId?: string
  createdAt: Date
  updatedAt: Date
}

const PageViewSchema = new Schema<IPageView>(
  {
    page: { type: String, required: true },
    referrer: { type: String },
    userAgent: { type: String },
    ip: { type: String },
    country: { type: String },
    region: { type: String },
    city: { type: String },
    device: { type: String },
    browser: { type: String },
    sessionId: { type: String },
  },
  { timestamps: true }
)

PageViewSchema.index({ page: 1 })
PageViewSchema.index({ createdAt: 1 })
PageViewSchema.index({ country: 1 })
PageViewSchema.index({ sessionId: 1 })

export default mongoose.models.PageView || mongoose.model<IPageView>('PageView', PageViewSchema)
