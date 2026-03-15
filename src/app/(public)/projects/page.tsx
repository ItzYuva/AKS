import connectDB from '@/lib/mongodb'
import Project from '@/models/Project'
import ProjectsList from './ProjectsList'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  await connectDB()
  const projects = await Project.find().sort({ createdAt: -1 }).lean()
  const serializedProjects = JSON.parse(JSON.stringify(projects))

  return <ProjectsList projects={serializedProjects} />
}
