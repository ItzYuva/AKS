'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeInUp, cardHoverSmall } from '@/utils/animations'
import MasonryGrid from './MasonryGrid'

interface Blog {
  _id: string
  title: string
  excerpt: string
  slug: string
  mediumUrl?: string
  coverImage?: string
  tags?: string[]
}

export default function Blogs({ blogs }: { blogs: Blog[] }) {

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
              className="bg-white/80 dark:bg-dark/50 rounded-lg shadow-md overflow-hidden flex flex-col"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              {...cardHoverSmall}
            >
              <Link href={`/blogs/${blog.slug}`} className="flex flex-col flex-grow">
                <div className="p-6 flex flex-col flex-grow">
                  <motion.h3
                    className="text-xl font-semibold mb-2 hover:text-primary transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {blog.title}
                  </motion.h3>
                  <motion.p
                    className="text-gray-600 dark:text-gray-300 mb-4 wrap-break-word flex-grow"
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
                      {blog.tags.slice(0, 3).map((tag, index) => (
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