'use client'

import Link from 'next/link';
import Image from 'next/image';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { fadeInUp, fadeIn, scaleIn } from '@/utils/animations';

export default function Hero() {
  return (
    <section className="py-8 sm:py-12 md:py-28">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            className='flex justify-center items-center mb-3 sm:mb-4'
            {...scaleIn}
            transition={{ delay: 0.2 }}
          >
            <Image src="/profile.avif" alt="Profile" width={100} height={100} className="rounded-full mb-2 sm:mb-4 w-24 h-24 sm:w-32 sm:h-32 object-cover ring-2 ring-primary" />
          </motion.div>
          <motion.h1
            className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-6"
            {...fadeInUp}
            transition={{ delay: 0.3 }}
          >
            Hi, I&apos;m <motion.span
              className="text-primary"
              {...fadeIn}
              transition={{ delay: 0.8 }}
            >
              Aditya Sinha
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-base sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-5 sm:mb-8"
            {...fadeInUp}
            transition={{ delay: 0.4 }}
          >
            AI Engineer Building Intelligent Systems
          </motion.p>
          <motion.div
            className="flex justify-center space-x-4 mb-5 sm:mb-8"
            {...fadeInUp}
            transition={{ delay: 0.5 }}
          >
            <motion.a
              href="https://github.com/ItzYuva"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaGithub />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/adityakumarsinha110403/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaLinkedin />
            </motion.a>
          </motion.div>
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0"
            {...fadeInUp}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/projects"
                className="bg-primary inline-block w-full sm:w-auto text-white text-center px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                View Projects
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/contact"
                className="inline-block w-full sm:w-auto bg-gray-500 text-center text-gray-800 dark:text-white px-8 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Contact Me
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 