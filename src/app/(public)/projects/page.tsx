import connectDB from '@/lib/mongodb'
import Project from '@/models/Project'
import ProjectsList from './ProjectsList'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  let serializedProjects = []

  try {
    await connectDB()
    const projects = await Project.find().sort({ createdAt: -1 }).lean()
    serializedProjects = JSON.parse(JSON.stringify(projects))
  } catch (error) {
    console.error("Failed to fetch projects:", error)
  }

  return <ProjectsList projects={serializedProjects} />
}
