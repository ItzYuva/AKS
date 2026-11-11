'use client';

import { useTheme } from '@/app/context/ThemeContext';
import { motion } from 'framer-motion';
import { techStack } from './techStackData';
import SectionLabel from './SectionLabel';

export default function TechStack() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className="py-8">
      <SectionLabel>Tech Stack</SectionLabel>
      <motion.div
        className="flex flex-wrap gap-5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {techStack.map((item) => {
          const color =
            isDark && item.darkColor ? item.darkColor : item.color;
          const Icon = item.icon;
          return (
            <div key={item.name} className="group relative cursor-pointer">
              <Icon
                className="w-8 h-8 sm:w-9 sm:h-9 transition-transform duration-200 group-hover:scale-110"
                style={{ color }}
              />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-xs font-medium text-white dark:text-zinc-100 bg-zinc-800 dark:bg-zinc-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg">
                {item.name}
              </span>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
