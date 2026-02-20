'use client'

import { useState, useEffect } from 'react'

export default function AdminContact() {
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    email: '',
    phone: '',
    location: '',
    githubUrl: '',
    linkedinUrl: '',
  })

  useEffect(() => {
    fetch('/api/contact-info')
      .then(r => r.json())
      .then(data => {
        if (data?._id) {
          setForm({
            email: data.email || '',
            phone: data.phone || '',
            location: data.location || '',
            githubUrl: data.githubUrl || '',
            linkedinUrl: data.linkedinUrl || '',
          })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    const res = await fetch('/api/contact-info', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    if (res.ok) setSuccess(true)
  }

  const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"

  if (loading) return <p className="text-gray-500">Loading...</p>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Contact Info</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} required className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <input name="location" value={form.location} onChange={handleChange} required className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">GitHub URL</label>
          <input name="githubUrl" value={form.githubUrl} onChange={handleChange} required className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
          <input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} required className={inputClass} />
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all">
            {saving ? 'Saving...' : 'Save Contact Info'}
          </button>
          {success && <span className="text-green-500 font-medium">Saved successfully!</span>}
        </div>
      </form>
    </div>
  )
}
