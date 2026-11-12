'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa'
import { HiOutlineArrowUpRight } from 'react-icons/hi2'
import MasonryGrid from '@/app/components/MasonryGrid'

const PLACEHOLDER_PATTERNS = ['demo.com', 'example.com', 'placeholder', '#', 'localhost']

function getDemoHref(url: string): { href: string; external: boolean } {
  if (!url || PLACEHOLDER_PATTERNS.some(p => url.toLowerCase().includes(p))) {
    return { href: '/demo-unavailable', external: false }
  }
  return { href: url, external: true }
}

interface Project {
  _id: string
  title: string
  description: string
  technologies: string[]
  githubLink: string
  demoLink: string
  image: string
}

export default function ProjectsList({ projects }: { projects: Project[] }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl font-medium text-zinc-900 dark:text-zinc-100 mb-2">
        Projects
      </h1>
      <p className="text-[15px] text-zinc-500 dark:text-zinc-400 mb-12">
        A collection of things I&apos;ve built. Click on the links to view the code or live demo.
      </p>

      <MasonryGrid>
        {projects.map((project) => {
          const { href: demoHref, external } = getDemoHref(project.demoLink)
          return (
            <div
              key={project._id}
              className="rounded-2xl border border-zinc-200 dark:border-white/15 bg-white dark:bg-[#0c0c0e] overflow-hidden hover:border-zinc-300 dark:hover:border-white/25 transition-colors"
            >
              <div className="aspect-video bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  className="object-cover w-full h-full"
                  width={500}
                  height={300}
                />
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-200 text-lg">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                      aria-label={`${project.title} source code`}
                    >
                      <FaGithub className="w-4 h-4" />
                    </a>
                    {external ? (
                      <a
                        href={demoHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        aria-label={`Visit ${project.title}`}
                      >
                        <HiOutlineArrowUpRight className="w-4 h-4" />
                      </a>
                    ) : (
                      <Link
                        href={demoHref}
                        className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        aria-label={`Visit ${project.title}`}
                      >
                        <HiOutlineArrowUpRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>

                <p className="text-[15px] text-zinc-500 dark:text-zinc-400 mb-4 wrap-break-word">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </MasonryGrid>
    </div>
  )
}
