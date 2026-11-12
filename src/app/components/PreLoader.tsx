'use client';

import { useEffect, useState } from 'react';

export default function PreLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setIsLoading(false), 500);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-[#09090b] transition-opacity duration-500"
      style={{ opacity: fadeOut ? 0 : 1 }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-zinc-200 dark:border-zinc-700 border-t-zinc-500 dark:border-t-zinc-400 rounded-full animate-spin" />
      </div>
    </div>
  );
}
