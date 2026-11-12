'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Home', homeHref: '#', otherHref: '/' },
  { label: 'Projects', homeHref: '#projects', otherHref: '/projects' },
  { label: 'Blogs', homeHref: '#blogs', otherHref: '/blogs' },
  { label: 'Contact', homeHref: '#contact', otherHref: '/#contact' },
];

export default function LandingNavbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md"
    >
      <div className="max-w-4xl mx-auto px-5 md:px-6 flex items-center justify-between h-16">
        {/* Desktop links — left side */}
        <div className="hidden min-[480px]:flex items-center gap-3 sm:gap-6">
          {NAV_LINKS.map((link) => {
            const href = isHome ? link.homeHref : link.otherHref;
            const useAnchor = href.startsWith('#');
            return useAnchor ? (
              <a
                key={link.label}
                href={href}
                className="text-[15px] min-h-[44px] flex items-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={href}
                className="text-[15px] min-h-[44px] flex items-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger — left side */}
        <button
          className="min-[480px]:hidden p-2 -ml-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? (
            <XMarkIcon className="h-5 w-5" />
          ) : (
            <Bars3Icon className="h-5 w-5" />
          )}
        </button>

        {/* Theme toggle — right side */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <SunIcon className="h-[18px] w-[18px]" />
          ) : (
            <MoonIcon className="h-[18px] w-[18px]" />
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="min-[480px]:hidden border-t border-zinc-200 dark:border-white/5 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md"
          >
            <div className="max-w-4xl mx-auto px-5 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const href = isHome ? link.homeHref : link.otherHref;
                const useAnchor = href.startsWith('#');
                return useAnchor ? (
                  <a
                    key={link.label}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
