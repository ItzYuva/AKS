'use client'

import { FaArrowLeft, FaShareAlt } from 'react-icons/fa'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useState } from 'react'

interface BlogContentProps {
  blog: {
    title: string
    excerpt: string
    content: string
    coverImage?: string
    tags?: string[]
  }
}

export default function BlogContent({ blog }: BlogContentProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Back link */}
      <Link
        href="/blogs"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-8"
      >
        <FaArrowLeft className="w-3 h-3" />
        <span>Back to Blogs</span>
      </Link>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-medium text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight mb-4">
          {blog.title}
        </h1>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
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

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="mb-12 rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/15">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose dark:prose-invert prose-zinc max-w-none prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-p:leading-[1.8] prose-headings:font-medium prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100 prose-a:text-zinc-900 dark:prose-a:text-zinc-200 prose-a:underline prose-a:underline-offset-4 prose-img:rounded-2xl prose-img:border prose-img:border-zinc-200 dark:prose-img:border-white/15 prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100 prose-code:text-zinc-700 dark:prose-code:text-zinc-300">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({node, inline, className, children, ...props}: any) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <div className="relative group rounded-xl overflow-hidden my-8 border border-zinc-200 dark:border-white/15">
                  <div className="absolute top-0 right-0 px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={() => navigator.clipboard.writeText(String(children))}
                      className="text-zinc-400 text-xs px-3 py-1.5 rounded-md hover:text-zinc-200 bg-zinc-800"
                    >
                      Copy
                    </button>
                  </div>
                  <SyntaxHighlighter
                    {...props}
                    style={vscDarkPlus as any}
                    language={match[1]}
                    PreTag="div"
                    className="!m-0 !bg-[#0c0c0e] !p-6 !text-sm"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-1.5 py-0.5 rounded text-[0.9em] font-mono" {...props}>
                  {children}
                </code>
              )
            },
            h2({children}: any) {
              return <h2 className="text-2xl font-medium mt-12 mb-4 text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-white/10 pb-3">{children}</h2>
            },
            h3({children}: any) {
              return <h3 className="text-xl font-medium mt-8 mb-3 text-zinc-900 dark:text-zinc-100">{children}</h3>
            },
            blockquote({children}: any) {
              return <blockquote className="border-l-2 border-zinc-300 dark:border-zinc-600 pl-5 italic text-zinc-500 dark:text-zinc-400 my-6">{children}</blockquote>
            }
          }}
        >
          {blog.content}
        </ReactMarkdown>
      </div>

      {/* Footer */}
      <div className="mt-16 pt-6 border-t border-zinc-200 dark:border-white/10 flex justify-between items-center flex-col sm:flex-row gap-4">
        <Link
          href="/blogs"
          className="group inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <FaArrowLeft className="w-3 h-3" />
          <span className="group-hover:underline underline-offset-4">Back to Blogs</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <FaShareAlt className="w-3 h-3" />
          {copied ? 'Copied!' : 'Share Post'}
        </button>
      </div>
    </article>
  )
}
