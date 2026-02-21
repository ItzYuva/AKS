'use client'

import { useState, useEffect } from 'react'
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { fadeInUp, fadeIn, slideInLeft, slideInRight } from '@/utils/animations'

interface FormData {
  name: string
  email: string
  message: string
}

interface ContactInfo {
  email: string
  phone: string
  location: string
  githubUrl: string
  linkedinUrl: string
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<FormStatus>('idle')
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)

  useEffect(() => {
    fetch('/api/contact-info')
      .then(res => res.json())
      .then(data => setContactInfo(data))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error('Failed to send message')
      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="container max-w-7xl mx-auto py-12">
      <motion.h1
        className="text-4xl font-bold mb-8 text-center"
        {...fadeInUp}
      >
        Contact Me
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <motion.div className="space-y-8" {...slideInLeft}>
          <motion.div {...fadeInUp}>
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-secondary">
              I&apos;m always open to discussing new projects, creative ideas, or
              opportunities to be a part of your visions.
            </p>
          </motion.div>

          <motion.div
            className="space-y-6 mt-8"
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            {contactInfo ? (
              <>
                <motion.div
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.4 }}
                >
                  <FaEnvelope className="h-6 w-6 text-[#007AFF]" />
                  <div>
                    <h3 className="font-semibold text-lg dark:text-white text-gray-900">Email</h3>
                    <a href={`mailto:${contactInfo.email}`} className="dark:text-gray-400 text-gray-600 hover:text-[#007AFF] transition-colors">
                      {contactInfo.email}
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <FaPhone className="h-6 w-6 text-[#007AFF]" />
                  <div>
                    <h3 className="font-semibold text-lg dark:text-white text-gray-900">Phone</h3>
                    <a href={`tel:${contactInfo.phone}`} className="dark:text-gray-400 text-gray-600 hover:text-[#007AFF] transition-colors">
                      {contactInfo.phone}
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <FaMapMarkerAlt className="h-6 w-6 text-[#007AFF]" />
                  <div>
                    <h3 className="font-semibold text-lg dark:text-white text-gray-900">Location</h3>
                    <p className="dark:text-gray-400 text-gray-600">{contactInfo.location}</p>
                  </div>
                </motion.div>
              </>
            ) : (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="h-6 w-6 rounded-md bg-gray-200 dark:bg-gray-700" />
                    <div className="space-y-2">
                      <div className="h-5 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                      <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className="bg-white dark:bg-dark/50 p-6 rounded-lg shadow-md"
          {...slideInRight}
        >
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text" id="name" name="name"
                value={formData.name} onChange={handleChange} required
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email" id="email" name="email"
                value={formData.email} onChange={handleChange} required
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
              <textarea
                id="message" name="message"
                value={formData.message} onChange={handleChange} required rows={4}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </motion.div>

            <motion.button
              type="submit" disabled={status === 'loading'}
              className="w-full btn btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </motion.button>

            {status === 'success' && (
              <motion.p className="text-[#007AFF] text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                Message sent successfully!
              </motion.p>
            )}
            {status === 'error' && (
              <motion.p className="text-red-500 text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                Failed to send message. Please try again.
              </motion.p>
            )}
          </motion.form>
        </motion.div>
      </div>
    </div>
  )
}
