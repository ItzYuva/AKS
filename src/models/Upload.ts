import mongoose, { Schema, Model } from 'mongoose'

export interface IUpload {
  _id?: string
  data: string       // base64-encoded image data
  contentType: string // e.g. image/png, image/jpeg
  filename: string
  createdAt?: Date
}

const UploadSchema = new Schema<IUpload>(
  {
    data: { type: String, required: true },
    contentType: { type: String, required: true },
    filename: { type: String, required: true },
  },
  { timestamps: true }
)

const Upload: Model<IUpload> =
  mongoose.models.Upload || mongoose.model<IUpload>('Upload', UploadSchema)

export default Upload
