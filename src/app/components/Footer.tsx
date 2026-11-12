import Link from 'next/link'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-white/5">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-[15px] text-zinc-500 dark:text-zinc-400">
            <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/projects" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Projects
            </Link>
            <Link href="/blogs" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Blogs
            </Link>
            <Link href="/contact" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://x.com/AdityaSinha11"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-white transition-colors"
            >
              <FaXTwitter className="w-[20px] h-[20px]" />
            </a>
            <a
              href="https://github.com/ItzYuva"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-white transition-colors"
            >
              <FaGithub className="w-[20px] h-[20px]" />
            </a>
            <a
              href="https://www.linkedin.com/in/adityakumarsinha110403/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-white transition-colors"
            >
              <FaLinkedin className="w-[20px] h-[20px]" />
            </a>
          </div>
        </div>

        <p className="text-center text-sm text-zinc-400 dark:text-zinc-500 mt-6">
          &copy; {new Date().getFullYear()} Aditya Sinha
        </p>
      </div>
    </footer>
  )
}
