'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft, FaCloudUploadAlt } from 'react-icons/fa'
import Link from 'next/link'
import MarkdownEditor from '../MarkdownEditor'

export default function NewBlog() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingInline, setUploadingInline] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inlineImageInputRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    slug: '',
    content: '',
    coverImage: '',
    tags: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'title' ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') } : {}),
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImagePreview(URL.createObjectURL(file))
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok) {
        setForm(prev => ({ ...prev, coverImage: data.url }))
      } else {
        alert(data.error || 'Upload failed')
        setImagePreview(null)
      }
    } catch {
      alert('Upload failed')
      setImagePreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingInline(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok) {
        const textarea = contentRef.current
        if (textarea) {
          const cursorPos = textarea.selectionStart
          const before = form.content.slice(0, cursorPos)
          const after = form.content.slice(cursorPos)
          const markdown = `\n![${file.name}](${data.url})\n`
          setForm(prev => ({ ...prev, content: before + markdown + after }))
          // Restore cursor position after the inserted text
          setTimeout(() => {
            textarea.focus()
            const newPos = cursorPos + markdown.length
            textarea.setSelectionRange(newPos, newPos)
          }, 0)
        }
      } else {
        alert(data.error || 'Upload failed')
      }
    } catch {
      alert('Upload failed')
    } finally {
      setUploadingInline(false)
      if (inlineImageInputRef.current) inlineImageInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    }
    const res = await fetch('/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) router.push('/admin/blogs')
    else setSaving(false)
  }

  return (
    <div>
      <Link href="/admin/blogs" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6">
        <FaArrowLeft className="h-4 w-4" /> Back to Blogs
      </Link>
      <h1 className="text-3xl font-medium mb-8">New Blog</h1>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        
        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium mb-2">Cover Image (Optional)</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="Preview" className="w-full aspect-video object-cover rounded-lg border border-zinc-200 dark:border-white/15" />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null)
                  setForm(prev => ({ ...prev, coverImage: '' }))
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600"
              >
                X
              </button>
              {uploading && (
                 <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium">Uploading...</span>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-12 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg flex flex-col items-center justify-center gap-2 text-zinc-500 hover:border-zinc-400 dark:hover:border-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              <FaCloudUploadAlt className="h-8 w-8" />
              <span className="text-sm font-medium">Click to upload cover image</span>
              <span className="text-xs text-zinc-400">PNG, JPG, WEBP up to 5MB</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input name="title" value={form.title} onChange={handleChange} required
              className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/50 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-400" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} required
              className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/50 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-400" />
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium mb-2">Excerpt</label>
           <textarea name="excerpt" value={form.excerpt} onChange={handleChange} required rows={3}
             className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/50 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-400" />
        </div>

        <div>
           <label className="block text-sm font-medium mb-2">Content</label>
           <input
             ref={inlineImageInputRef}
             type="file"
             accept="image/*"
             onChange={handleInlineImageUpload}
             className="hidden"
           />
           <MarkdownEditor
             value={form.content}
             onChange={(val) => setForm(prev => ({ ...prev, content: val }))}
             onImageInsert={() => inlineImageInputRef.current?.click()}
             uploadingInline={uploadingInline}
             textareaRef={contentRef}
           />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="e.g., AI, Machine Learning, RAG"
            className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/50 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-400" />
        </div>

        <button type="submit" disabled={saving || uploading}
          className="px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 transition-all">
          {saving ? 'Creating...' : 'Create Blog'}
        </button>
      </form>
    </div>
  )
}
