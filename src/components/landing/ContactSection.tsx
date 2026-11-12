'use client';

import {
  HiOutlineEnvelope,
  HiOutlineArrowUpRight,
  HiOutlineClock,
  HiOutlineCheck,
} from 'react-icons/hi2';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import SectionLabel from './SectionLabel';
import ContactForm from './ContactForm';

interface ContactData {
  email: string;
  phone: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
}

interface Props {
  contact: ContactData | null;
}

const X_URL = 'https://x.com/AdityaSinha11';

export default function ContactSection({ contact }: Props) {
  const email = contact?.email || 'adityauv11@gmail.com';
  const githubUrl =
    contact?.githubUrl || 'https://github.com/ItzYuva';
  const linkedinUrl =
    contact?.linkedinUrl ||
    'https://www.linkedin.com/in/adityakumarsinha110403/';

  const links = [
    {
      icon: HiOutlineEnvelope,
      title: 'Email',
      subtitle: email,
      href: `mailto:${email}`,
      label: 'Email',
    },
    {
      icon: FaLinkedin,
      title: 'LinkedIn',
      subtitle: 'Connect with me',
      href: linkedinUrl,
      label: 'LinkedIn',
    },
    {
      icon: FaGithub,
      title: 'GitHub',
      subtitle: 'Check out my code',
      href: githubUrl,
      label: 'GitHub',
    },
    {
      icon: FaXTwitter,
      title: 'X (Twitter)',
      subtitle: 'Follow for updates & insights',
      href: X_URL,
      label: 'X (Twitter)',
    },
  ];

  return (
    <section id="contact" className="scroll-mt-16 py-8">
      <SectionLabel>Let&apos;s Work Together</SectionLabel>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Get in Touch card */}
        <div
          className="rounded-2xl border border-zinc-200 dark:border-white/15 bg-white dark:bg-[#0c0c0e] p-6 flex flex-col"
        >
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-200 mb-1.5">
            Get in Touch
          </h3>
          <p className="text-[15px] text-zinc-500 dark:text-zinc-400 mb-5">
            Choose your preferred method to connect.
          </p>

          <div className="space-y-1 flex-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.title}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  className="flex items-center gap-3 p-3 -mx-1 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/[0.03] transition-colors group min-h-[44px]"
                  aria-label={link.label}
                >
                  <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                      {link.title}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-500 truncate">
                      {link.subtitle}
                    </p>
                  </div>
                  <HiOutlineArrowUpRight className="w-4 h-4 text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors shrink-0" />
                </a>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-500">
              <HiOutlineClock className="w-3.5 h-3.5" />
              <span>Replies within 24 hours</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-500">
              <HiOutlineCheck className="w-3.5 h-3.5" />
              <span>Open to full-time, freelance &amp; collaborations</span>
            </div>
          </div>
        </div>

        {/* Send a Message card */}
        <div
          className="rounded-2xl border border-zinc-200 dark:border-white/15 bg-white dark:bg-[#0c0c0e] p-6"
        >
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-200 mb-1.5">
            Send a Message
          </h3>
          <p className="text-[15px] text-zinc-500 dark:text-zinc-400 mb-5">
            Fill out the form and I&apos;ll get back to you.
          </p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
