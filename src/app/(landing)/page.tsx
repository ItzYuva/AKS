import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import Blog from '@/models/Blog';
import About from '@/models/About';
import Contact from '@/models/Contact';
import { getGitHubHeatmap } from '@/lib/github-heatmap';

import HeroAbout from '@/components/landing/HeroAbout';
import GitHubHeatmap from '@/components/landing/GitHubHeatmap';
import TechStack from '@/components/landing/TechStack';
import FeaturedProjects from '@/components/landing/FeaturedProjects';
import Experience from '@/components/landing/Experience';
import BlogsPreview from '@/components/landing/BlogsPreview';
import ContactSection from '@/components/landing/ContactSection';
import LandingFooter from '@/components/landing/LandingFooter';

export const revalidate = 3600;

interface AboutDoc {
  bio: string;
  skills: { name: string; level: string }[];
  experience: {
    title: string;
    company: string;
    period: string;
    description: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    period: string;
    description: string;
  }[];
}

interface ContactDoc {
  email: string;
  phone: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
}

interface ProjectDoc {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  githubLink: string;
  demoLink: string;
  image: string;
}

interface BlogDoc {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  createdAt?: string;
}

export default async function LandingPage() {
  const heatmapPromise = getGitHubHeatmap();

  let about: AboutDoc | null = null;
  let contact: ContactDoc | null = null;
  let projects: ProjectDoc[] = [];
  let blogs: BlogDoc[] = [];
  try {
    await connectDB();
    const [aboutDoc, contactDoc, projectDocs, blogDocs] =
      await Promise.all([
        About.findOne().lean(),
        Contact.findOne().lean(),
        Project.find().sort({ createdAt: -1 }).lean(),
        Blog.find().sort({ createdAt: -1 }).lean(),
      ]);

    about = aboutDoc
      ? (JSON.parse(JSON.stringify(aboutDoc)) as AboutDoc)
      : null;
    contact = contactDoc
      ? (JSON.parse(JSON.stringify(contactDoc)) as ContactDoc)
      : null;
    projects = JSON.parse(
      JSON.stringify(projectDocs)
    ) as ProjectDoc[];
    blogs = JSON.parse(JSON.stringify(blogDocs)) as BlogDoc[];
  } catch (error) {
    console.error('Failed to fetch landing data:', error);
  }

  const heatmapData = await heatmapPromise;

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-6">
      <HeroAbout about={about} contact={contact} />

      <GitHubHeatmap data={heatmapData} />

      <TechStack />
      <FeaturedProjects projects={projects} />
      <Experience experience={about?.experience} />
      <BlogsPreview blogs={blogs} />
      <ContactSection contact={contact} />
      <LandingFooter
        githubUrl={contact?.githubUrl}
        linkedinUrl={contact?.linkedinUrl}
        email={contact?.email}
      />
    </div>
  );
}
