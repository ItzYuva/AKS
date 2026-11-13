'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function NavigationProgress() {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const prevPath = useRef(pathname)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname
      setVisible(true)
      setProgress(30)

      timerRef.current = setTimeout(() => setProgress(70), 100)
      const t2 = setTimeout(() => setProgress(100), 250)
      const t3 = setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 400)

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current)
        clearTimeout(t2)
        clearTimeout(t3)
      }
    }
  }, [pathname])

  if (!visible && progress === 0) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5">
      <div
        className="h-full bg-zinc-700 dark:bg-zinc-300 transition-all duration-200 ease-out"
        style={{ width: `${progress}%`, opacity: visible ? 1 : 0 }}
      />
    </div>
  )
}
