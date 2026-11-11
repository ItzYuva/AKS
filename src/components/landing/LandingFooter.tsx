'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { motion } from 'framer-motion';

interface Quote {
  text: string;
  author: string;
}

interface Props {
  visitorCount: number;
  githubUrl?: string;
  linkedinUrl?: string;
  email?: string;
}

const X_URL = 'https://x.com/AdityaSinha11';

function ordinalSuffix(n: number): string {
  const pr = new Intl.PluralRules('en-US', { type: 'ordinal' });
  const suffixes: Record<string, string> = {
    one: 'st',
    two: 'nd',
    few: 'rd',
    other: 'th',
  };
  return suffixes[pr.select(n)];
}

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Contact', href: '#contact' },
];

export default function LandingFooter({
  visitorCount,
  githubUrl = 'https://github.com/ItzYuva',
  linkedinUrl = 'https://www.linkedin.com/in/adityakumarsinha110403/',
  email = 'adityauv11@gmail.com',
}: Props) {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    fetch('/api/quote')
      .then((r) => r.json())
      .then((data) => {
        if (data.text && data.author) setQuote(data);
      })
      .catch(() => {});
  }, []);

  const socials = [
    { icon: FaXTwitter, href: X_URL, label: 'X (Twitter)' },
    { icon: FaGithub, href: githubUrl, label: 'GitHub' },
    { icon: FaLinkedin, href: linkedinUrl, label: 'LinkedIn' },
    { icon: FaEnvelope, href: `mailto:${email}`, label: 'Email' },
  ];

  return (
    <footer className="pt-8 pb-28 sm:pb-12">
      {/* Quote + visitor counter card */}
      <motion.div
        className="rounded-2xl border border-zinc-200 dark:border-white/15 bg-white dark:bg-[#0c0c0e] p-5 sm:p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="flex items-stretch gap-0">
          {/* Quote side */}
          {quote && (
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2.5 mb-2">
                <span className="text-zinc-300 dark:text-zinc-600 text-xl leading-none select-none shrink-0">&ldquo;</span>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {quote.text}
                </p>
              </div>
              <p className="text-[13px] text-zinc-400 dark:text-zinc-500 text-right pr-2">
                &mdash; {quote.author}
              </p>
            </div>
          )}

          {/* Divider + visitor counter */}
          {visitorCount > 0 && (
            <div className="flex items-center">
              <div className="w-px h-full bg-zinc-200 dark:bg-white/10 mx-5 sm:mx-6" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                You are the{' '}
                <span className="font-bold text-zinc-800 dark:text-white text-base">
                  {visitorCount.toLocaleString()}
                </span>
                <sup className="text-[10px] font-semibold text-zinc-800 dark:text-white">
                  {ordinalSuffix(visitorCount)}
                </sup>
                {' '}visitor
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Divider */}
      <div className="h-px bg-zinc-200 dark:bg-white/5 mb-6" />

      {/* Bottom row */}
      <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 text-center sm:text-left">
        {/* Left: copyright + nav links */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} Aditya Sinha
          </p>
          <nav className="flex items-center gap-4">
            {NAV_LINKS.map((link) =>
              link.href.startsWith('#') ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>

        {/* Right: social icons */}
        <div className="flex items-center gap-3">
          {socials.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('mailto') ? undefined : '_blank'}
                rel={s.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                className="group relative text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                aria-label={s.label}
              >
                <Icon className="w-4 h-4" />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-xs font-medium text-white dark:text-zinc-100 bg-zinc-800 dark:bg-zinc-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg">
                  {s.label}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
