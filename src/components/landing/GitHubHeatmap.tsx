'use client';

import { useRef } from 'react';
import type { HeatmapData, HeatmapWeek } from '@/lib/github-heatmap';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function getLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

function computeMonthLabels(weeks: HeatmapWeek[]) {
  const labels: { label: string; col: number }[] = [];
  let lastMonth = -1;

  weeks.forEach((week, i) => {
    const firstDay = week.days[0];
    if (!firstDay) return;
    const month = new Date(firstDay.date + 'T12:00:00Z').getMonth();
    if (month !== lastMonth) {
      labels.push({ label: MONTHS[month], col: i });
      lastMonth = month;
    }
  });

  return labels;
}

function generatePlaceholder(): { weeks: HeatmapWeek[]; total: number } {
  const weeks: HeatmapWeek[] = [];
  const now = new Date();
  const start = new Date(now);
  start.setFullYear(start.getFullYear() - 1);
  start.setDate(start.getDate() - start.getDay());

  let total = 0;
  let current = new Date(start);

  while (current <= now) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(current);
      date.setDate(date.getDate() + d);
      if (date > now) break;
      const count = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 12);
      total += count;
      days.push({
        date: date.toISOString().slice(0, 10),
        count,
        weekday: d,
      });
    }
    weeks.push({ days });
    current.setDate(current.getDate() + 7);
  }

  return { weeks, total };
}

export default function GitHubHeatmap({ data }: { data: HeatmapData }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const hasData = !data.error && data.weeks.length > 0;
  const placeholder = hasData ? null : generatePlaceholder();
  const weeks = hasData ? data.weeks : placeholder!.weeks;
  const totalContributions = hasData
    ? data.totalContributions
    : placeholder!.total;

  const monthLabels = computeMonthLabels(weeks);
  const cols = weeks.length;

  const first = weeks[0]?.days[0]?.date ?? '';
  const lastWeek = weeks[weeks.length - 1];
  const last = lastWeek?.days[lastWeek.days.length - 1]?.date ?? '';
  const startYear = first.slice(0, 4);
  const endYear = last.slice(0, 4);
  const yearLabel =
    startYear === endYear
      ? startYear
      : `${startYear}–${endYear.slice(2)}`;

  const cells: { date: string; count: number; weekday: number; col: number }[] = [];
  weeks.forEach((week, wi) => {
    for (let d = 0; d < 7; d++) {
      const day = week.days.find((dd) => dd.weekday === d);
      cells.push(
        day
          ? { ...day, col: wi }
          : { date: '', count: -1, weekday: d, col: wi }
      );
    }
  });

  return (
    <section className="pt-8 pb-8">
      {!hasData && (
        <p className="text-xs text-amber-500/80 mb-3">
          ⚠ Heatmap using placeholder data — set GITHUB_TOKEN to show real contributions
        </p>
      )}

      <div ref={containerRef}>
        {/* Month labels */}
        <div
          className="grid mb-1.5"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: '2px',
          }}
        >
          {Array.from({ length: cols }, (_, i) => {
            const m = monthLabels.find((ml) => ml.col === i);
            return (
              <span
                key={i}
                className="text-[10px] sm:text-[12px] uppercase tracking-wide text-zinc-500 dark:text-zinc-500 overflow-visible whitespace-nowrap"
              >
                {m ? m.label : ''}
              </span>
            );
          })}
        </div>

        {/* Contribution grid — fits container width, no overflow */}
        <div
          className="grid"
          style={{
            gridTemplateRows: 'repeat(7, 1fr)',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridAutoFlow: 'column',
            gap: '2px',
          }}
        >
          {cells.map((cell, i) => {
            if (cell.count < 0) {
              return <div key={i} className="aspect-square" />;
            }
            const level = getLevel(cell.count);
            return (
              <div
                key={i}
                className="aspect-square rounded-[2px] sm:rounded-[3px]"
                style={{
                  backgroundColor: `var(--heatmap-${level})`,
                }}
                title={`${cell.count} contribution${cell.count !== 1 ? 's' : ''} on ${cell.date}`}
              />
            );
          })}
        </div>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between mt-3 text-[11px] sm:text-[13px] uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-500">
        <span>
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            {totalContributions.toLocaleString()}
          </span>
          {' '}Contributions{yearLabel ? ` · ${yearLabel}` : ''}
        </span>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="mr-0.5">Less</span>
          {[0, 1, 2, 3, 4].map((lvl) => (
            <div
              key={lvl}
              className="rounded-[2px] sm:rounded-[3px] w-2 h-2 sm:w-3 sm:h-3"
              style={{
                backgroundColor: `var(--heatmap-${lvl})`,
              }}
            />
          ))}
          <span className="ml-0.5">More</span>
        </div>
      </div>
    </section>
  );
}
