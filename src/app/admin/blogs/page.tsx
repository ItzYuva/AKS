'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import DeleteConfirmModal from '../components/DeleteConfirmModal'

interface Blog {
  _id: string
  title: string
  slug: string
}

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchBlogs = () => {
    fetch('/api/blogs')
      .then(r => r.json())
      .then(data => { setBlogs(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchBlogs() }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    await fetch(`/api/blogs/${deleteId}`, { method: 'DELETE' })
    setDeleteId(null)
    fetchBlogs()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-medium">Blogs</h1>
        <Link
          href="/admin/blogs/new"
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          <FaPlus className="h-4 w-4" />
          New Blog
        </Link>
      </div>

      {loading ? (
        <p className="text-zinc-500">Loading...</p>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#0c0c0e] rounded-2xl border border-zinc-200 dark:border-white/15">
          <p className="text-zinc-500 mb-4">No blogs yet</p>
          <Link href="/admin/blogs/new" className="text-zinc-900 dark:text-zinc-100 hover:underline">Create your first blog</Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0c0c0e] rounded-2xl border border-zinc-200 dark:border-white/15 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-white/15">
                <th className="text-left p-4 font-medium text-zinc-500 dark:text-zinc-400">Title</th>
                <th className="text-right p-4 font-medium text-zinc-500 dark:text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id} className="border-b border-zinc-100 dark:border-white/10 last:border-0">
                  <td className="p-4">
                    <span className="font-medium">{blog.title}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blogs/${blog._id}/edit`}
                        className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <FaEdit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(blog._id)}
                        className="p-2 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteId}
        itemName="Blog"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
