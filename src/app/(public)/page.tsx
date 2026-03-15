import Blogs from "../components/Blogs";
import Hero from "../components/Hero";
import GitHubActivity from "../components/GitHubActivity";
import Projects from "../components/Projects";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import Blog from "@/models/Blog";

export const dynamic = 'force-dynamic';

export default async function Home() {
  await connectDB();
  const [projects, blogs] = await Promise.all([
    Project.find().sort({ createdAt: -1 }).lean(),
    Blog.find().sort({ createdAt: -1 }).lean(),
  ]);

  // Serialize MongoDB documents to plain objects
  const serializedProjects = JSON.parse(JSON.stringify(projects));
  const serializedBlogs = JSON.parse(JSON.stringify(blogs));

  return (
    <main>
      <Hero />
      <Projects projects={serializedProjects} />
      <Blogs blogs={serializedBlogs} />
      <GitHubActivity />
    </main>
  );
}
