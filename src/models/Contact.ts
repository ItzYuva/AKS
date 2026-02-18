import mongoose, { Schema, Model } from 'mongoose'

export interface IContact {
  _id?: string
  email: string
  phone: string
  location: string
  githubUrl: string
  linkedinUrl: string
  createdAt?: Date
  updatedAt?: Date
}

const ContactSchema = new Schema<IContact>(
  {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    githubUrl: { type: String, required: true },
    linkedinUrl: { type: String, required: true },
  },
  { timestamps: true }
)

const Contact: Model<IContact> =
  mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema)

export default Contact
