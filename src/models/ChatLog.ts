import mongoose, { Schema, Document } from 'mongoose'

export interface IChatLog extends Document {
  question: string
  sessionId?: string
  ip?: string
  createdAt: Date
  updatedAt: Date
}

const ChatLogSchema = new Schema<IChatLog>(
  {
    question: { type: String, required: true },
    sessionId: { type: String },
    ip: { type: String },
  },
  { timestamps: true }
)

ChatLogSchema.index({ createdAt: 1 })

export default mongoose.models.ChatLog || mongoose.model<IChatLog>('ChatLog', ChatLogSchema)
