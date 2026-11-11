'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import SectionLabel from './SectionLabel';

interface BlogEntry {
  _id: string;
  title: string;
  slug: string;
  createdAt?: string;
}

export default function BlogsPreview({ blogs }: { blogs: BlogEntry[] }) {
  const recent = blogs.slice(0, 3);

  if (recent.length === 0) return null;

  return (
    <section className="py-8">
      <SectionLabel>Latest Blogs</SectionLabel>
      <motion.div
        className="space-y-1"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {recent.map((blog) => {
          const date = blog.createdAt
            ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : null;

          return (
            <Link
              key={blog._id}
              href={`/blogs/${blog.slug}`}
              className="flex items-baseline justify-between gap-4 py-3 group rounded-lg -mx-3 px-3 hover:bg-zinc-100 dark:hover:bg-white/[0.03] transition-colors"
            >
              <span className="text-base text-zinc-700 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors line-clamp-1">
                {blog.title}
              </span>
              {date && (
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono whitespace-nowrap shrink-0">
                  {date}
                </span>
              )}
            </Link>
          );
        })}
      </motion.div>

      <Link
        href="/blogs"
        className="inline-block mt-4 text-sm text-primary hover:underline underline-offset-4"
      >
        View all posts
      </Link>
    </section>
  );
}
