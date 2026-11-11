'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiOutlineArrowUpRight } from 'react-icons/hi2';
import { useTheme } from '@/app/context/ThemeContext';
import SectionLabel from './SectionLabel';
import { findTechIcon } from './techStackData';

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  githubLink: string;
  demoLink: string;
  image: string;
}

const PLACEHOLDER_PATTERNS = [
  'demo.com',
  'example.com',
  'placeholder',
  '#',
  'localhost',
];

function getLiveUrl(project: Project): string {
  const demo = project.demoLink;
  if (
    demo &&
    !PLACEHOLDER_PATTERNS.some((p) => demo.toLowerCase().includes(p))
  ) {
    return demo;
  }
  return project.githubLink;
}

export default function FeaturedProjects({
  projects,
}: {
  projects: Project[];
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const FEATURED_TITLES = ['munshi', 'audio visualizer', 'audi visualizer'];
  let featured = projects.filter((p) =>
    FEATURED_TITLES.some((t) =>
      p.title.toLowerCase().includes(t)
    )
  );
  if (featured.length === 0) featured = projects.slice(0, 2);
  featured = featured.slice(0, 2);

  if (featured.length === 0) return null;

  return (
    <section id="projects" className="scroll-mt-16 py-8">
      <SectionLabel>Featured Projects</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {featured.map((project, i) => (
          <motion.article
            key={project._id}
            className="group rounded-2xl border border-zinc-200 dark:border-white/15 bg-white dark:bg-[#0c0c0e] overflow-hidden hover:border-zinc-300 dark:hover:border-white/25 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              ease: 'easeOut',
              delay: i * 0.1,
            }}
          >
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-zinc-900 dark:text-white text-lg">
                  {project.title}
                </h3>
                <a
                  href={getLiveUrl(project)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 p-1.5 rounded-lg text-zinc-400 hover:text-primary hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                  aria-label={`Visit ${project.title}`}
                >
                  <HiOutlineArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              <p className="text-[15px] text-zinc-500 dark:text-zinc-300 mb-4 line-clamp-2">
                {project.description}
              </p>

              {/* Tech icons */}
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech) => {
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
            </div>
          </motion.article>
        ))}
      </div>

      <Link
        href="/projects"
        className="inline-flex items-center gap-1 mt-6 text-sm text-primary hover:underline underline-offset-4"
      >
        View all projects
        <HiOutlineArrowUpRight className="w-3.5 h-3.5" />
      </Link>
    </section>
  );
}
