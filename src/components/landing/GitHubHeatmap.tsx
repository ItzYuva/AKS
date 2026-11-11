'use client';

import { useRef, useState, useCallback } from 'react';
import type { HeatmapData, HeatmapWeek } from '@/lib/github-heatmap';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const CELL = 11;
const GAP = 4;
const STEP = CELL + GAP;

const LEVEL_CLASSES = [
  'fill-zinc-700/40 hover:opacity-80 cursor-pointer',
  'fill-zinc-600/45 hover:opacity-80 cursor-pointer',
  'fill-zinc-500/55 hover:opacity-80 cursor-pointer',
  'fill-zinc-400/60 hover:opacity-80 cursor-pointer',
  'fill-zinc-300/70 hover:opacity-80 cursor-pointer',
];

function getLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z');
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
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

  const gridOriginY = 16;
  const svgWidth = cols * STEP - GAP;
  const svgHeight = gridOriginY + 7 * STEP - GAP;

  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const handleMouseEnter = useCallback((e: React.MouseEvent<SVGRectElement>, count: number, date: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    setTooltip({
      text: `${count} contribution${count !== 1 ? 's' : ''} on ${formatDate(date)}`,
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top - containerRect.top,
    });
  }, []);

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  return (
    <section className="pt-8 pb-8">
      {!hasData && (
        <p className="text-xs text-amber-500/80 mb-3">
          ⚠ Heatmap using placeholder data — set GITHUB_TOKEN to show real contributions
        </p>
      )}

      <div ref={containerRef} className="relative w-full">
        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute z-50 px-3 py-1.5 text-xs font-medium text-white bg-zinc-800 dark:bg-zinc-700 rounded-md whitespace-nowrap pointer-events-none shadow-lg"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: 'translate(-50%, -100%) translateY(-8px)',
            }}
          >
            {tooltip.text}
          </div>
        )}

        <svg
          className="block w-full h-auto"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          role="img"
          aria-label="GitHub contribution heatmap"
        >
          {/* Month labels */}
          {monthLabels.map((m, i) => (
            <text
              key={i}
              x={m.col * STEP}
              y={10}
              className="fill-zinc-500 dark:fill-zinc-500"
              fontSize="10"
              fontFamily="inherit"
              textAnchor="start"
            >
              {m.label.toUpperCase()}
            </text>
          ))}

          {/* Contribution cells */}
          {weeks.map((week, wi) =>
            Array.from({ length: 7 }, (_, d) => {
              const day = week.days.find((dd) => dd.weekday === d);
              if (!day) return null;
              const level = getLevel(day.count);
              const x = wi * STEP;
              const y = gridOriginY + d * STEP;
              return (
                <rect
                  key={`${wi}-${d}`}
                  x={x}
                  y={y}
                  width={CELL}
                  height={CELL}
                  rx={0}
                  ry={0}
                  className={LEVEL_CLASSES[level]}
                  data-count={day.count}
                  data-date={day.date}
                  data-level={level}
                  onMouseEnter={(e) => handleMouseEnter(e, day.count, day.date)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })
          )}
        </svg>
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
              className="w-2.5 h-2.5 sm:w-3 sm:h-3"
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
