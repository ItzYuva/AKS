import mongoose, { Schema, Model } from 'mongoose'

export interface IProject {
  _id?: string
  title: string
  description: string
  technologies: string[]
  githubLink: string
  demoLink: string
  image: string
  createdAt?: Date
  updatedAt?: Date
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [{ type: String, required: true }],
    githubLink: { type: String, required: true },
    demoLink: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
)

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)

export default Project
