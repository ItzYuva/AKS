'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft, FaCloudUploadAlt, FaImage } from 'react-icons/fa'
import Link from 'next/link'

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
      <Link href="/admin/blogs" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-6">
        <FaArrowLeft className="h-4 w-4" /> Back to Blogs
      </Link>
      <h1 className="text-3xl font-bold mb-8">New Blog</h1>

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
              <img src={imagePreview} alt="Preview" className="w-full aspect-video object-cover rounded-lg border border-gray-300 dark:border-gray-700" />
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
              className="w-full py-12 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-primary hover:text-primary transition-colors"
            >
              <FaCloudUploadAlt className="h-8 w-8" />
              <span className="text-sm font-medium">Click to upload cover image</span>
              <span className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input name="title" value={form.title} onChange={handleChange} required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium mb-2">Excerpt</label>
           <textarea name="excerpt" value={form.excerpt} onChange={handleChange} required rows={3}
             className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
        </div>

        <div>
           <div className="flex items-center justify-between mb-2">
             <label className="block text-sm font-medium">Content (Markdown supported)</label>
             <div className="flex items-center gap-2">
               <input
                 ref={inlineImageInputRef}
                 type="file"
                 accept="image/*"
                 onChange={handleInlineImageUpload}
                 className="hidden"
               />
               <button
                 type="button"
                 onClick={() => inlineImageInputRef.current?.click()}
                 disabled={uploadingInline}
                 className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary disabled:opacity-50 transition-colors"
               >
                 <FaImage className="h-3 w-3" />
                 {uploadingInline ? 'Uploading...' : 'Insert Image'}
               </button>
             </div>
           </div>
           <textarea ref={contentRef} name="content" value={form.content} onChange={handleChange} required rows={15} placeholder="Write your blog content in Markdown...&#10;&#10;Tip: Click 'Insert Image' to add images anywhere in your content"
             className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="e.g., AI, Machine Learning, RAG"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
        </div>

        <button type="submit" disabled={saving || uploading}
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all">
          {saving ? 'Creating...' : 'Create Blog'}
        </button>
      </form>
    </div>
  )
}
