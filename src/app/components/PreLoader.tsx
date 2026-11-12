'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function PreLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dismiss immediately once React has hydrated — the component mounting
    // means the page is interactive. A tiny minimum keeps the animation visible.
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-[#09090b]"
        >
          <div className="relative flex items-center justify-center">
            {/* Glow */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute w-24 h-24 rounded-full bg-zinc-400/20 dark:bg-zinc-500/15 blur-xl"
            />

            {/* Hexagon + Letter */}
            <svg width="64" height="64" viewBox="0 0 100 100" className="relative z-10">
              <motion.path
                d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z"
                fill="transparent"
                className="stroke-zinc-400 dark:stroke-zinc-500"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.8,
                  ease: 'easeInOut',
                }}
              />
              <motion.text
                x="50"
                y="58"
                textAnchor="middle"
                className="fill-zinc-700 dark:fill-zinc-300 font-semibold"
                style={{ fontSize: '24px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                A
              </motion.text>
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
