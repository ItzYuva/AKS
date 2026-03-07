import mongoose, { Schema, Model } from 'mongoose'

export interface ISkill {
  name: string
  level: string
}

export interface IExperience {
  title: string
  company: string
  period: string
  description: string[]
}

export interface IEducation {
  degree: string
  institution: string
  period: string
  description: string
}

export interface IAbout {
  _id?: string
  bio: string
  skills: ISkill[]
  experience: IExperience[]
  education: IEducation[]
  chatbotInfo?: string
  createdAt?: Date
  updatedAt?: Date
}

const AboutSchema = new Schema<IAbout>(
  {
    bio: { type: String, required: true },
    skills: [
      {
        name: { type: String, required: true },
        level: { type: String, required: true },
      },
    ],
    experience: [
      {
        title: { type: String, required: true },
        company: { type: String, required: true },
        period: { type: String, required: true },
        description: [{ type: String }],
      },
    ],
    education: [
      {
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        period: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    chatbotInfo: { type: String, default: '' },
  },
  { timestamps: true }
)

const About: Model<IAbout> =
  mongoose.models.About || mongoose.model<IAbout>('About', AboutSchema)

export default About
