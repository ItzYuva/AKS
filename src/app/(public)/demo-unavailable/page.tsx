'use client'

import Link from 'next/link'
import { FaTools, FaArrowLeft } from 'react-icons/fa'

export default function DemoUnavailable() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <FaTools className="text-zinc-400 dark:text-zinc-500 w-6 h-6" />
          </div>
        </div>

        <h1 className="text-2xl font-medium text-zinc-900 dark:text-zinc-100 mb-3">
          Demo Temporarily Unavailable
        </h1>

        <p className="text-[15px] text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
          This project&apos;s live demo is currently offline for maintenance or updates.
          I&apos;ll have it back up and running soon — thanks for your patience!
        </p>

        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <FaArrowLeft className="w-3 h-3" />
          <span className="group-hover:underline underline-offset-4">Back to Projects</span>
        </Link>
      </div>
    </div>
  )
}
