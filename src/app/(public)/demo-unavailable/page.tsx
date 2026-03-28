'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaTools, FaArrowLeft } from 'react-icons/fa'
import { fadeInUp, fadeIn } from '@/utils/animations'

export default function DemoUnavailable() {
  return (
    <div className="container max-w-7xl mx-auto py-24 px-4 flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div
        className="text-center max-w-lg"
        {...fadeInUp}
      >
        <motion.div
          className="flex justify-center mb-6"
          {...fadeIn}
          transition={{ delay: 0.2 }}
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <FaTools className="text-primary w-8 h-8" />
          </div>
        </motion.div>

        <motion.h1
          className="text-3xl sm:text-4xl font-bold mb-4"
          {...fadeInUp}
          transition={{ delay: 0.3 }}
        >
          Demo Temporarily Unavailable
        </motion.h1>

        <motion.p
          className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed"
          {...fadeInUp}
          transition={{ delay: 0.4 }}
        >
          This project&apos;s live demo is currently offline for maintenance or updates.
          I&apos;ll have it back up and running soon — thanks for your patience!
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          {...fadeInUp}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
