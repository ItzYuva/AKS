'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import {
  HiOutlineMapPin,
  HiOutlineEnvelope,
  HiOutlineArrowDownTray,
} from 'react-icons/hi2';
import SpotifyWidget from './SpotifyWidget';

interface AboutData {
  bio: string;
  skills: { name: string; level: string }[];
  experience: {
    title: string;
    company: string;
    period: string;
    description: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    period: string;
    description: string;
  }[];
}

interface ContactData {
  email: string;
  phone: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
}

interface Props {
  about: AboutData | null;
  contact: ContactData | null;
}

const TECH_KEYWORDS = [
  'TypeScript',
  'JavaScript',
  'Python',
  'Next.js',
  'Node.js',
  'React',
  'MongoDB',
  'Tailwind CSS',
  'Docker',
  'Express',
];

function highlightTech(text: string): React.ReactNode[] {
  const escaped = TECH_KEYWORDS.map((t) =>
    t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  const pattern = new RegExp(`(${escaped.join('|')})`, 'g');
  const parts = text.split(pattern);

  return parts.map((part, i) =>
    TECH_KEYWORDS.includes(part) ? (
      <span key={i} className="text-zinc-900 dark:text-white font-medium">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

const X_URL = 'https://x.com/AdityaSinha11';

const TITLES = ['AI Engineer', 'ML Engineer', 'Backend Developer'];

export default function HeroAbout({ about, contact }: Props) {
  const email = contact?.email || 'adityauv11@gmail.com';
  const location = contact?.location || 'Mumbai, India';
  const githubUrl =
    contact?.githubUrl || 'https://github.com/ItzYuva';
  const linkedinUrl =
    contact?.linkedinUrl ||
    'https://www.linkedin.com/in/adityakumarsinha110403/';

  const bio =
    about?.bio ||
    'I build AI-powered products end-to-end, from RAG pipelines and agents to the backends and interfaces around them. Currently working with TypeScript, Next.js, Node.js, and Python.';

  const [titleIndex, setTitleIndex] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'exit' | 'prep' | 'enter'>('idle');

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase('exit');
      setTimeout(() => {
        setTitleIndex((prev) => (prev + 1) % TITLES.length);
        setPhase('prep');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setPhase('enter');
            setTimeout(() => setPhase('idle'), 450);
          });
        });
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="scroll-mt-16 pt-12 sm:pt-16 pb-4">
      {/* Avatar + Name */}
      <div className="flex items-center gap-4 sm:gap-5 mb-8">
        <Image
          src="/profile.avif"
          alt="Aditya Sinha"
          width={80}
          height={80}
          className="rounded-2xl w-16 h-16 sm:w-20 sm:h-20 object-cover"
          priority
        />
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-white tracking-tight">
            Aditya Sinha
          </h1>
          <div className="h-7 mt-0.5 overflow-hidden">
            <p
              className="text-zinc-500 dark:text-zinc-400 text-base"
              style={{
                transition: phase === 'prep' ? 'none' : 'opacity 400ms cubic-bezier(0.4,0,0.2,1), transform 400ms cubic-bezier(0.4,0,0.2,1)',
                opacity: phase === 'idle' || phase === 'enter' ? 1 : 0,
                transform:
                  phase === 'exit' ? 'translateY(-14px)'
                    : phase === 'prep' ? 'translateY(14px)'
                    : 'translateY(0)',
              }}
            >
              {TITLES[titleIndex]}
            </p>
          </div>
        </div>
      </div>

      {/* Meta row — left-aligned inline flex */}
      <div className="flex flex-wrap items-start gap-x-10 gap-y-4 mb-7">
        <div>
          <p className="text-[13px] uppercase tracking-[0.15em] font-medium text-zinc-400 dark:text-zinc-400 mb-1.5">
            Location
          </p>
          <div className="flex items-center gap-1.5 text-[17px] font-medium text-zinc-700 dark:text-zinc-300">
            <HiOutlineMapPin className="w-[18px] h-[18px] text-zinc-400 shrink-0" />
            <span>{location}</span>
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-[13px] uppercase tracking-[0.15em] font-medium text-zinc-400 dark:text-zinc-400 mb-1.5">
            Email
          </p>
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-1.5 text-[17px] font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors min-w-0"
          >
            <HiOutlineEnvelope className="w-[18px] h-[18px] text-zinc-400 shrink-0" />
            <span className="truncate">{email}</span>
          </a>
        </div>

        <div>
          <p className="text-[13px] uppercase tracking-[0.15em] font-medium text-zinc-400 dark:text-zinc-400 mb-1.5">
            Resume
          </p>
          <a
            href="/api/resume/download"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[17px] font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors"
          >
            <HiOutlineArrowDownTray className="w-[18px] h-[18px] text-zinc-400 shrink-0" />
            <span>Download</span>
          </a>
        </div>
      </div>

      {/* Bio */}
      <p className="text-zinc-600 dark:text-zinc-400 leading-[1.8] mb-6 max-w-2xl text-[17px]">
        {highlightTech(bio)}
      </p>

      {/* Spotify */}
      <div>
        <SpotifyWidget />
      </div>

      {/* Social icons */}
      <div className="flex items-center gap-5 mt-4">
        {[
          { icon: FaXTwitter, href: X_URL, label: 'X (Twitter)', external: true },
          { icon: FaGithub, href: githubUrl, label: 'GitHub', external: true },
          { icon: FaLinkedin, href: linkedinUrl, label: 'LinkedIn', external: true },
          { icon: FaEnvelope, href: `mailto:${email}`, label: 'Email', external: false },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <a
              key={s.label}
              href={s.href}
              target={s.external ? '_blank' : undefined}
              rel={s.external ? 'noopener noreferrer' : undefined}
              className="group relative text-zinc-400 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              aria-label={s.label}
            >
              <Icon className="w-5 h-5" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-xs font-medium text-white dark:text-zinc-100 bg-zinc-800 dark:bg-zinc-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg">
                {s.label}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
