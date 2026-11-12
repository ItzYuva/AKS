'use client'

import { useState, type FormEvent } from 'react'
import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineArrowRight,
} from 'react-icons/hi2'

interface ContactInfo {
  email: string
  phone: string
  location: string
  githubUrl: string
  linkedinUrl: string
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm({ contactInfo }: { contactInfo: ContactInfo | null }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<FormStatus>('idle')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to send message')
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-2xl font-medium text-zinc-900 dark:text-zinc-100 mb-2">
        Contact
      </h1>
      <p className="text-[15px] text-zinc-500 dark:text-zinc-400 mb-10 max-w-lg">
        Have a question or want to work together? Reach out and I&apos;ll get back to you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="rounded-2xl border border-zinc-200 dark:border-white/15 bg-white dark:bg-[#0c0c0e] p-6">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-200 mb-5">
            Get in Touch
          </h2>

          {contactInfo ? (
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                  <HiOutlineEnvelope className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200">Email</p>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                  <HiOutlinePhone className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200">Phone</p>
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                  <HiOutlineMapPin className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200">Location</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{contactInfo.location}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 animate-pulse">
                  <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
                  <div className="space-y-1.5 pt-0.5">
                    <div className="h-4 w-16 rounded bg-zinc-100 dark:bg-zinc-800" />
                    <div className="h-3.5 w-32 rounded bg-zinc-100 dark:bg-zinc-800" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-zinc-200 dark:border-white/15 bg-white dark:bg-[#0c0c0e] p-6">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-200 mb-5">
            Send a Message
          </h2>

          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-zinc-900 dark:text-white font-medium mb-1">Message sent!</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">I&apos;ll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                required
                minLength={2}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full h-11 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/10 text-base text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-400 transition-colors"
                placeholder="Full Name"
              />
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full h-11 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/10 text-base text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-400 transition-colors"
                placeholder="Email Address"
              />
              <textarea
                name="message"
                required
                minLength={10}
                rows={4}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-white/10 text-base text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-400 transition-colors resize-none"
                placeholder="Your Message"
              />

              {status === 'error' && (
                <p className="text-sm text-red-500">Failed to send message. Please try again.</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="group w-full h-11 rounded-lg border border-zinc-300 dark:border-white/15 bg-transparent text-zinc-700 dark:text-zinc-100 font-medium flex items-center justify-center gap-2 hover:text-zinc-900 dark:hover:text-white focus:outline-none disabled:opacity-50 transition-colors cursor-pointer"
              >
                {status === 'loading' ? (
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    Send Message
                    <HiOutlineArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
