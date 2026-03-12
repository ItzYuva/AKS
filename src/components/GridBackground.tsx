'use client';

import { useEffect, useRef, useCallback } from 'react';

const CELL_SIZE = 56;
const RADIUS = 6;

interface ThemeColors {
  base: string;
  border: string;
  getGlow: (dist: number) => string;
  getBorder: (dist: number) => string;
}

const darkTheme: ThemeColors = {
  base: 'transparent',
  border: 'rgba(0, 100, 255, 0.04)',
  getGlow: (dist: number) => {
    if (dist === 0) return 'rgba(0, 122, 255, 0.42)';
    const intensity = Math.max(0, 1 - dist / (RADIUS + 1));
    const alpha = (intensity * intensity * 0.36).toFixed(3);
    return `rgba(0, 100, 255, ${alpha})`;
  },
  getBorder: (dist: number) => {
    if (dist > RADIUS) return 'rgba(0, 100, 255, 0.04)';
    const intensity = Math.max(0, 1 - dist / (RADIUS + 1));
    const alpha = (0.04 + intensity * intensity * 0.38).toFixed(3);
    return `rgba(0, 100, 255, ${alpha})`;
  },
};

const lightTheme: ThemeColors = {
  base: 'transparent',
  border: 'rgba(0, 80, 200, 0.05)',
  getGlow: (dist: number) => {
    if (dist === 0) return 'rgba(0, 122, 255, 0.26)';
    const intensity = Math.max(0, 1 - dist / (RADIUS + 1));
    const alpha = (intensity * intensity * 0.20).toFixed(3);
    return `rgba(0, 100, 255, ${alpha})`;
  },
  getBorder: (dist: number) => {
    if (dist > RADIUS) return 'rgba(0, 80, 200, 0.05)';
    const intensity = Math.max(0, 1 - dist / (RADIUS + 1));
    const alpha = (0.05 + intensity * intensity * 0.24).toFixed(3);
    return `rgba(0, 100, 255, ${alpha})`;
  },
};

function getTheme(): ThemeColors {
  if (typeof document === 'undefined') return darkTheme;
  return document.documentElement.classList.contains('dark') ? darkTheme : lightTheme;
}

export default function GridBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cellsRef = useRef<HTMLDivElement[][]>([]);
  const prevHighlighted = useRef<Set<string>>(new Set());

  const getCellKey = (r: number, c: number) => `${r},${c}`;

  const resetAllCells = useCallback(() => {
    const theme = getTheme();
    const cells = cellsRef.current;
    for (let r = 0; r < cells.length; r++) {
      for (let c = 0; c < cells[r].length; c++) {
        cells[r][c].style.backgroundColor = theme.base;
        cells[r][c].style.borderColor = theme.border;
      }
    }
    prevHighlighted.current.clear();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const theme = getTheme();
    const col = Math.floor(e.clientX / CELL_SIZE);
    const row = Math.floor(e.clientY / CELL_SIZE);

    const cells = cellsRef.current;
    const totalRows = cells.length;
    const totalCols = totalRows > 0 ? cells[0].length : 0;

    const newHighlighted = new Set<string>();

    for (let dr = -RADIUS; dr <= RADIUS; dr++) {
      for (let dc = -RADIUS; dc <= RADIUS; dc++) {
        const r = row + dr;
        const c = col + dc;
        if (r < 0 || r >= totalRows || c < 0 || c >= totalCols) continue;

        const dist = Math.sqrt(dr * dr + dc * dc);
        if (dist > RADIUS) continue;

        const key = getCellKey(r, c);
        newHighlighted.add(key);

        cells[r][c].style.backgroundColor = theme.getGlow(dist);
        cells[r][c].style.borderColor = theme.getBorder(dist);
      }
    }

    prevHighlighted.current.forEach((key) => {
      if (!newHighlighted.has(key)) {
        const [r, c] = key.split(',').map(Number);
        if (r >= 0 && r < totalRows && c >= 0 && c < totalCols) {
          cells[r][c].style.backgroundColor = theme.base;
          cells[r][c].style.borderColor = theme.border;
        }
      }
    });

    prevHighlighted.current = newHighlighted;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const buildGrid = () => {
      const theme = getTheme();
      const width = window.innerWidth;
      const height = window.innerHeight;
      const cols = Math.ceil(width / CELL_SIZE) + 1;
      const rows = Math.ceil(height / CELL_SIZE) + 1;

      container.innerHTML = '';
      cellsRef.current = [];

      for (let r = 0; r < rows; r++) {
        const rowArr: HTMLDivElement[] = [];
        for (let c = 0; c < cols; c++) {
          const cell = document.createElement('div');
          cell.style.position = 'absolute';
          cell.style.left = `${c * CELL_SIZE}px`;
          cell.style.top = `${r * CELL_SIZE}px`;
          cell.style.width = `${CELL_SIZE}px`;
          cell.style.height = `${CELL_SIZE}px`;
          cell.style.backgroundColor = theme.base;
          cell.style.border = `1px solid ${theme.border}`;
          cell.style.transition = 'background-color 0.25s ease, border-color 0.25s ease';
          container.appendChild(cell);
          rowArr.push(cell);
        }
        cellsRef.current.push(rowArr);
      }
    };

    buildGrid();

    // Watch for theme changes to reset cell colors
    const observer = new MutationObserver(() => {
      resetAllCells();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(buildGrid, 200);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, [handleMouseMove, resetAllCells]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      style={{ backgroundColor: 'transparent' }}
    />
  );
}
