'use client'

import { motion } from 'framer-motion'
import { FaArrowLeft, FaShareAlt, FaUserCircle } from 'react-icons/fa'
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
    <article className="min-h-screen pt-24 pb-12 bg-transparent relative z-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-white/95 dark:bg-[#020b18]/95 backdrop-blur-2xl border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          
          <div className="p-6 md:p-10 lg:p-12">
            {/* Header section (Title, Author, Tags) */}
            <motion.div 
              className="mb-10 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-gray-900 dark:text-white tracking-tight">
                {blog.title}
              </h1>
              
              <div className="flex justify-center items-center gap-4 mb-2 flex-wrap">
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    {blog.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 rounded-full text-[10px] md:text-xs font-semibold uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Cover Image */}
            {blog.coverImage && (
              <motion.div 
                className="mb-16 w-full overflow-hidden rounded-2xl shadow-xl relative aspect-video border border-gray-100 dark:border-gray-800"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <img 
                  src={blog.coverImage} 
                  alt={blog.title} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}

            {/* Content Area */}
            <div className="max-w-3xl mx-auto">
              <motion.div
                className="prose dark:prose-invert prose-lg md:prose-xl max-w-none prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:whitespace-pre-wrap prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-xl font-sans leading-relaxed tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({node, inline, className, children, ...props}: any) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <div className="relative group rounded-xl overflow-hidden my-8 shadow-2xl bg-[#1e1e1e]">
                          <div className="absolute top-0 right-0 px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button 
                              onClick={() => navigator.clipboard.writeText(String(children))}
                              className="bg-gray-800 text-gray-300 text-xs px-3 py-1.5 rounded-md hover:text-white"
                            >
                              Copy
                            </button>
                          </div>
                          <SyntaxHighlighter
                            {...props}
                            style={vscDarkPlus as any}
                            language={match[1]}
                            PreTag="div"
                            className="!m-0 !bg-transparent !p-6 !text-sm"
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className="bg-gray-100 dark:bg-gray-800 text-primary px-1.5 py-0.5 rounded text-[0.9em]" {...props}>
                          {children}
                        </code>
                      )
                    },
                    h2({children}: any) {
                      return <h2 className="text-3xl font-extrabold mt-14 mb-6 text-gray-900 dark:text-white border-b-2 border-primary/20 pb-4">{children}</h2>
                    },
                    h3({children}: any) {
                      return <h3 className="text-2xl font-bold mt-10 mb-4 text-gray-900 dark:text-white">{children}</h3>
                    },
                    blockquote({children}: any) {
                      return <blockquote className="border-l-4 border-primary pl-6 italic text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 py-4 pr-6 rounded-r-2xl my-8 text-xl font-medium">{children}</blockquote>
                    }
                  }}
                >
                  {blog.content}
                </ReactMarkdown>
              </motion.div>

              {/* Footer */}
              <motion.div 
                className="mt-20 pt-8 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center flex-col sm:flex-row gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link 
                  href="/blogs" 
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:border-primary/50 transition-all font-medium"
                >
                  <FaArrowLeft /> Back to Blogs
                </Link>

                <button 
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-medium"
                >
                  <FaShareAlt /> {copied ? 'Copied!' : 'Share Post'}
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
