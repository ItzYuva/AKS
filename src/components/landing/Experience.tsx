'use client';

import { useTheme } from '@/app/context/ThemeContext';
import SectionLabel from './SectionLabel';
import { findTechIcon } from './techStackData';

interface ExperienceEntry {
  title: string;
  company: string;
  period: string;
  description: string[];
  location?: string;
  type?: string;
  technologies?: string[];
}

interface Props {
  experience?: ExperienceEntry[];
}

const FALLBACK: ExperienceEntry[] = [
  {
    title: 'Associate System Engineer',
    company: 'TCS',
    period: 'Nov 2025 – Present',
    location: 'Remote',
    type: 'Full-time',
    description: [
      'Ericsson client engagement in telecom and network intelligence domain',
      'Building and maintaining API test automation frameworks with Node.js and TypeScript',
    ],
    technologies: ['Node.js', 'TypeScript'],
  },
  {
    title: 'Operations Intern',
    company: 'TCS',
    period: 'Mar 2025 – Oct 2025',
    location: 'Remote',
    type: 'Internship',
    description: [
      'Supported operational workflows and process automation initiatives',
    ],
    technologies: [],
  },
];

function isCurrent(period: string): boolean {
  return /present/i.test(period);
}

export default function Experience({ experience }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const raw: ExperienceEntry[] =
    experience && experience.length > 0 ? experience : FALLBACK;
  const entries = [...raw]
    .map((entry) => ({
      ...entry,
      location: entry.location || 'Remote',
      type: entry.type || (/intern/i.test(entry.title) ? 'Internship' : 'Full-time'),
    }))
    .sort((a, b) => {
      const aCurrent = /present/i.test(a.period) ? 1 : 0;
      const bCurrent = /present/i.test(b.period) ? 1 : 0;
      return bCurrent - aCurrent;
    });

  return (
    <section className="py-8">
      <SectionLabel>Experience</SectionLabel>

      <div className="relative pl-7 sm:pl-8">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-zinc-200 dark:bg-zinc-800" />

        {entries.map((entry, i) => {
          const current = isCurrent(entry.period);

          return (
            <div
              key={`${entry.company}-${i}`}
              className="relative pb-10 last:pb-0"
            >
              {/* Dot */}
              <div className="absolute -left-7 sm:-left-8 top-1.5">
                <div
                  className={`relative w-[15px] h-[15px] rounded-full border-2 ${
                    current
                      ? 'border-green-500 bg-green-500/20'
                      : 'border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800'
                  }`}
                >
                  {current && (
                    <span className="absolute inset-0 rounded-full bg-green-500/30 animate-ping" />
                  )}
                </div>
              </div>

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-4 mb-1">
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-200">
                  {entry.title}
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    {' '}
                    &middot; {entry.company}
                  </span>
                </h3>
                <span className="text-sm text-zinc-400 dark:text-zinc-500 font-mono whitespace-nowrap">
                  {entry.period}
                </span>
              </div>

              {/* Location / Type */}
              {(entry.location || entry.type) && (
                <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-2">
                  {[entry.location, entry.type]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              )}

              {/* Description bullets */}
              {entry.description.length > 0 && (
                <ul className="space-y-1.5 mb-3">
                  {entry.description.map((line, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-[15px] text-zinc-600 dark:text-zinc-400"
                    >
                      <span className="mt-2 w-1 h-1 rounded-full bg-zinc-400 dark:bg-zinc-600 shrink-0" />
                      {line}
                    </li>
                  ))}
                </ul>
              )}

              {/* Tech icons */}
              {entry.technologies && entry.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2.5 mt-2">
                  {entry.technologies.map((tech) => {
                    const item = findTechIcon(tech);
                    if (!item) {
                      return (
                        <span
                          key={tech}
                          className="text-[10px] font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded"
                        >
                          {tech}
                        </span>
                      );
                    }
                    const Icon = item.icon;
                    const color =
                      isDark && item.darkColor
                        ? item.darkColor
                        : item.color;
                    return (
                      <div key={tech} title={item.name}>
                        <Icon
                          className="w-4 h-4"
                          style={{ color }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
