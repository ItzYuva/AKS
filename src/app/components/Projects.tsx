'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { fadeInUp, cardHoverSmall } from '@/utils/animations'
import MasonryGrid from './MasonryGrid'

interface Project {
  _id: string
  title: string
  description: string
  technologies: string[]
  githubLink: string
  demoLink: string
  image: string
}

const PLACEHOLDER_PATTERNS = ['demo.com', 'example.com', 'placeholder', '#', 'localhost']

function getDemoHref(url: string): { href: string; external: boolean } {
  if (!url || PLACEHOLDER_PATTERNS.some(p => url.toLowerCase().includes(p))) {
    return { href: '/demo-unavailable', external: false }
  }
  return { href: url, external: true }
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProjects(data)
        } else {
          console.error("API returned non-array data:", data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Fetch failed", err)
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <section className="py-20">
      <div className="container max-w-7xl mx-auto px-4 text-center text-secondary">
        Loading projects...
      </div>
    </section>
  )

  return (
    <section className="py-10 sm:py-20">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <motion.h2
          className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-12 text-center"
          {...fadeInUp}
        >
          Featured Projects
        </motion.h2>

        <MasonryGrid>
          {projects.slice(0, 6).map((project) => (
            <motion.article
              key={project._id}
              className="bg-white/80 dark:bg-dark/50 rounded-lg shadow-md p-6 overflow-hidden"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              {...cardHoverSmall}
            >
              <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <motion.h3
                className="text-xl font-semibold mb-2"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {project.title}
              </motion.h3>
              <motion.p
                className="text-gray-600 dark:text-gray-300 mb-4 wrap-break-word"
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
            </motion.article>
          ))}
        </MasonryGrid>

        {projects.length > 6 && (
          <motion.div
            className="flex justify-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/projects"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Show More
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}