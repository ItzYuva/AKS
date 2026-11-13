'use client'

import { useState, useEffect, useRef, use } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft, FaCloudUploadAlt } from 'react-icons/fa'
import Link from 'next/link'

export default function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(r => r.json())
      .then(data => {
        setForm({
          title: data.title || '',
          description: data.description || '',
          technologies: Array.isArray(data.technologies) ? data.technologies.join(', ') : '',
          githubLink: data.githubLink || '',
          demoLink: data.demoLink || '',
          image: data.image || '',
        })
        if (data.image) setImagePreview(data.image)
        setLoading(false)
      })
  }, [id])

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
        setImagePreview(form.image || null)
      }
    } catch {
      alert('Upload failed')
      setImagePreview(form.image || null)
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
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
      }),
    })
    if (res.ok) router.push('/admin/projects')
    else setSaving(false)
  }

  if (loading) return <p className="text-zinc-500">Loading...</p>

  return (
    <div>
      <Link href="/admin/projects" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6">
        <FaArrowLeft className="h-4 w-4" /> Back to Projects
      </Link>
      <h1 className="text-3xl font-medium mb-8">Edit Project</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input name="title" value={form.title} onChange={handleChange} required
            className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/50 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-400" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={3}
            className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/50 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-400" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Technologies (comma-separated)</label>
          <input name="technologies" value={form.technologies} onChange={handleChange} required
            className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/50 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">GitHub Link</label>
            <input name="githubLink" value={form.githubLink} onChange={handleChange} required
              className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/50 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-400" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Demo Link</label>
            <input name="demoLink" value={form.demoLink} onChange={handleChange} required
              className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800/50 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-400" />
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
              <img src={imagePreview} alt="Preview" className="w-full aspect-video object-cover rounded-lg border border-zinc-200 dark:border-white/15" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs px-3 py-1.5 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Change Image
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
              <span className="text-sm font-medium">Click to upload image</span>
              <span className="text-xs text-zinc-400">PNG, JPG, WEBP up to 5MB</span>
            </button>
          )}
        </div>

        <button type="submit" disabled={saving || uploading || !form.image}
          className="px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 transition-all">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
