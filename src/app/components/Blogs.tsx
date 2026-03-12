'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaCalendarAlt, FaClock } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { fadeInUp, cardHoverSmall } from '@/utils/animations'
import MasonryGrid from './MasonryGrid'

interface Blog {
  _id: string
  title: string
  excerpt: string
  date: string
  readTime: string
  slug: string
  mediumUrl: string
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBlogs(data)
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
        Loading blogs...
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
          Latest Blog Posts
        </motion.h2>

        <MasonryGrid>
          {blogs.slice(0, 6).map((blog) => (
            <motion.article
              key={blog._id}
              className="bg-white/80 dark:bg-dark/50 rounded-lg shadow-md p-6 overflow-hidden"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              {...cardHoverSmall}
            >
              <a href={blog.mediumUrl} target="_blank" rel="noopener noreferrer">
                <motion.h3
                  className="text-xl font-semibold mb-2 hover:text-primary transition-colors"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {blog.title}
                </motion.h3>
              </a>
              <motion.p
                className="text-gray-600 dark:text-gray-300 mb-4 wrap-break-word"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {blog.excerpt}
              </motion.p>
              <motion.div
                className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.span
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaCalendarAlt className="mr-2" />
                  {blog.date}
                </motion.span>
                <motion.span
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaClock className="mr-2" />
                  {blog.readTime}
                </motion.span>
              </motion.div>
            </motion.article>
          ))}
        </MasonryGrid>

        {blogs.length > 6 && (
          <motion.div
            className="flex justify-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/blogs"
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