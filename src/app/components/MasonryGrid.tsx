'use client'

import { ReactNode } from 'react'

interface Props {
  children: ReactNode[]
}

export default function MasonryGrid({ children }: Props) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6">
      {children.map((child, i) => (
        <div key={i} className="break-inside-avoid mb-4 sm:mb-6">
          {child}
        </div>
      ))}
    </div>
  )
}
