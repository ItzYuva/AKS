'use client'

import { motion } from 'framer-motion'
import { fadeInUp, cardHoverSmall } from '@/utils/animations'
import MasonryGrid from '@/app/components/MasonryGrid'
import Link from 'next/link'

interface Blog {
  _id: string
  title: string
  excerpt: string
  slug: string
  mediumUrl?: string
  coverImage?: string
  tags?: string[]
}

export default function BlogsList({ blogs }: { blogs: Blog[] }) {
  return (
    <div className="container max-w-7xl mx-auto py-12">
      <motion.h1
        className="text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Blog Posts
      </motion.h1>

      <MasonryGrid>
        {blogs.map((blog) => (
          <motion.article
            key={blog._id}
            className="bg-white/80 dark:bg-dark/50 rounded-lg shadow-md overflow-hidden flex flex-col"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            {...cardHoverSmall}
          >
            <Link href={`/blogs/${blog.slug}`} className="flex flex-col flex-grow">
              <div className="p-6 flex flex-col flex-grow">
                <motion.h2
                  className="text-xl font-semibold mb-2 hover:text-primary transition-colors"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {blog.title}
                </motion.h2>

                <motion.p
                  className="text-secondary mb-4 wrap-break-word flex-grow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {blog.excerpt}
                </motion.p>

                {blog.tags && blog.tags.length > 0 && (
                  <motion.div
                    className="flex flex-wrap gap-2 mt-auto pt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {blog.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-primary/10 text-primary dark:bg-primary/20 rounded-full text-xs font-semibold">
                        {tag}
                      </span>
                    ))}
                  </motion.div>
                )}
              </div>
            </Link>
          </motion.article>
        ))}
      </MasonryGrid>
    </div>
  )
}
