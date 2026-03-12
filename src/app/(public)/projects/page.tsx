'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { fadeInUp, cardHoverSmall } from '@/utils/animations'
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

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => { setProjects(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="container max-w-7xl mx-auto py-12 text-center text-secondary">
      Loading projects...
    </div>
  )

  return (
    <div className="container max-w-7xl mx-auto py-12">
      <motion.h1
        className="text-4xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Projects
      </motion.h1>
      <motion.p
        className="text-lg text-secondary mb-24 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Here are some of my recent projects. Click on the links to view the code or live demo.
      </motion.p>

      <MasonryGrid>
        {projects.map((project) => (
          <motion.div
            key={project._id}
            className="bg-white/80 dark:bg-dark/50 rounded-lg shadow-md overflow-hidden"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            {...cardHoverSmall}
          >
            <motion.div
              className="aspect-video bg-gray-200 dark:bg-gray-800"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src={project.image}
                alt={project.title}
                className="object-cover w-full h-full"
                width={500}
                height={500}
              />
            </motion.div>

            <div className="p-6">
              <motion.h3
                className="text-xl font-semibold mb-2"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {project.title}
              </motion.h3>
              <motion.p
                className="text-secondary mb-4 wrap-break-word"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {project.description}
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-2 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {project.technologies.map((tech) => (
                  <motion.span
                    key={tech}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </motion.div>

              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaGithub className="h-5 w-5" />
                  <span>Code</span>
                </motion.a>
                {(() => {
                  const { href, external } = getDemoHref(project.demoLink)
                  return external ? (
                    <motion.a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaExternalLinkAlt className="h-5 w-5" />
                      <span>Live Demo</span>
                    </motion.a>
                  ) : (
                    <Link
                      href={href}
                      className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
                    >
                      <FaExternalLinkAlt className="h-5 w-5" />
                      <span>Live Demo</span>
                    </Link>
                  )
                })()}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </MasonryGrid>
    </div>
  )
}
