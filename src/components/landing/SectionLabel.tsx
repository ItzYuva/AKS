export default function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="text-[13px] font-mono uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-400 mb-6">
      {children}
    </p>
  );
}
