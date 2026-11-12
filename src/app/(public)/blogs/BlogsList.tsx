'use client'

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
  createdAt?: string
}

export default function BlogsList({ blogs }: { blogs: Blog[] }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl font-medium text-zinc-900 dark:text-zinc-100 mb-2">
        Blog Posts
      </h1>
      <p className="text-[15px] text-zinc-500 dark:text-zinc-400 mb-12 max-w-lg">
        Thoughts on engineering, AI, and things I&apos;ve learned along the way.
      </p>

      <MasonryGrid>
        {blogs.map((blog) => {
          const date = blog.createdAt
            ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : null

          return (
            <Link
              key={blog._id}
              href={`/blogs/${blog.slug}`}
              className="block rounded-2xl border border-zinc-200 dark:border-white/15 bg-white dark:bg-[#0c0c0e] overflow-hidden hover:border-zinc-300 dark:hover:border-white/25 transition-colors group"
            >
              <div className="p-5 flex flex-col">
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <h2 className="font-medium text-zinc-900 dark:text-zinc-200 text-lg group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                    {blog.title}
                  </h2>
                </div>

                {date && (
                  <span className="text-sm text-zinc-400 dark:text-zinc-500 font-mono mb-3">
                    {date}
                  </span>
                )}

                <p className="text-[15px] text-zinc-500 dark:text-zinc-400 mb-4 wrap-break-word">
                  {blog.excerpt}
                </p>

                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </MasonryGrid>
    </div>
  )
}
