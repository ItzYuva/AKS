'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft, FaCloudUploadAlt } from 'react-icons/fa'
import Link from 'next/link'

export default function NewProject() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    technologies: '',
    githubLink: '',
    demoLink: '',
    image: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
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
        setForm(prev => ({ ...prev, image: data.url }))
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.image) {
      alert('Please upload an image first')
      return
    }
    setSaving(true)
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
      }),
    })
    if (res.ok) router.push('/admin/projects')
    else setSaving(false)
  }

  return (
    <div>
      <Link href="/admin/projects" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-6">
        <FaArrowLeft className="h-4 w-4" /> Back to Projects
      </Link>
      <h1 className="text-3xl font-bold mb-8">New Project</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input name="title" value={form.title} onChange={handleChange} required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Technologies (comma-separated)</label>
          <input name="technologies" value={form.technologies} onChange={handleChange} required placeholder="React, Node.js, MongoDB"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">GitHub Link</label>
            <input name="githubLink" value={form.githubLink} onChange={handleChange} required placeholder="https://github.com/..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Demo Link</label>
            <input name="demoLink" value={form.demoLink} onChange={handleChange} required placeholder="https://..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Project Image</label>
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
                  setForm(prev => ({ ...prev, image: '' }))
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
              <span className="text-sm font-medium">Click to upload image</span>
              <span className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</span>
            </button>
          )}
        </div>

        <button type="submit" disabled={saving || uploading || !form.image}
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all">
          {saving ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  )
}
