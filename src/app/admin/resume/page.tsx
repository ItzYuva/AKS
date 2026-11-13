'use client'

import { useState, useEffect, useRef } from 'react'
import { FaFilePdf, FaUpload, FaCheck, FaExternalLinkAlt } from 'react-icons/fa'

export default function AdminResumePage() {
  const [exists, setExists] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/resume')
      .then((r) => r.json())
      .then((data) => setExists(data.exists))
      .catch(() => {})
  }, [])

  const uploadFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setMessage({ type: 'error', text: 'Only PDF files are allowed.' })
      return
    }

    setUploading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setExists(true)
      setMessage({ type: 'success', text: 'Resume uploaded successfully!' })
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Upload failed' })
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  return (
    <div>
      <h1 className="text-3xl font-medium mb-2">Resume</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8">
        Upload your resume PDF. It will be available for download at /resume.pdf
      </p>

      {/* Status */}
      <div className="bg-white dark:bg-[#0c0c0e] rounded-2xl border border-zinc-200 dark:border-white/15 p-6 mb-6">
        <div className="flex items-center gap-3">
          <FaFilePdf className={`h-5 w-5 ${exists ? 'text-green-500' : 'text-zinc-400'}`} />
          <div>
            <p className="font-medium">
              {exists ? 'Resume is uploaded' : 'No resume uploaded yet'}
            </p>
            {exists && (
              <a
                href="/api/resume/download"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-900 dark:text-zinc-100 hover:underline inline-flex items-center gap-1 mt-1"
              >
                View current resume <FaExternalLinkAlt className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Upload area */}
      <div
        className={`bg-white dark:bg-[#0c0c0e] rounded-2xl border-2 border-dashed p-10 text-center transition-colors cursor-pointer ${
          dragOver
            ? 'border-zinc-400 bg-zinc-100 dark:bg-zinc-800/50'
            : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
        }`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <FaUpload className={`h-8 w-8 mx-auto mb-4 ${uploading ? 'text-zinc-600 dark:text-zinc-300 animate-pulse' : 'text-zinc-400'}`} />

        {uploading ? (
          <p className="text-zinc-600 dark:text-zinc-300 font-medium">Uploading...</p>
        ) : (
          <>
            <p className="text-zinc-600 dark:text-zinc-300 font-medium mb-1">
              {exists ? 'Click to replace resume' : 'Click to upload resume'}
            </p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              or drag and drop a PDF file here (max 10MB)
            </p>
          </>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
        }`}>
          {message.type === 'success' && <FaCheck className="h-4 w-4" />}
          {message.text}
        </div>
      )}
    </div>
  )
}
