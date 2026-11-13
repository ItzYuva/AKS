export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-zinc-200 dark:border-white/15 bg-white dark:bg-[#0c0c0e] p-6"
          >
            <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-lg mb-4" />
            <div className="h-7 w-16 bg-zinc-200 dark:bg-zinc-800 rounded mb-2" />
            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-zinc-200 dark:border-white/15 bg-white dark:bg-[#0c0c0e] p-6">
        <div className="h-5 w-40 bg-zinc-200 dark:bg-zinc-800 rounded mb-4" />
        <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
      </div>
    </div>
  )
}
