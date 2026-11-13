"use client";

import { useEffect, useRef } from "react";

const GRID_SIZE = 56;
const INFLUENCE_RADIUS = 180;
const PUSH_STRENGTH = 30;

export default function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let mouse = { x: -9999, y: -9999 };
    let animationId: number;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function handleMouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    window.addEventListener("mousemove", handleMouseMove);

    function isDark() {
      return document.documentElement.classList.contains("dark");
    }

    function displace(gx: number, gy: number): [number, number] {
      const dx = gx - mouse.x;
      const dy = gy - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > INFLUENCE_RADIUS || dist < 1) return [gx, gy];
      const factor = (1 - dist / INFLUENCE_RADIUS) ** 2;
      const push = PUSH_STRENGTH * factor;
      return [gx + (dx / dist) * push, gy + (dy / dist) * push];
    }

    function draw() {
      const w = canvas!.width;
      const h = canvas!.height;
      ctx!.clearRect(0, 0, w, h);

      const dark = isDark();
      const baseAlpha = dark ? 0.14 : 0.15;
      const color = dark ? "255,255,255" : "0,0,0";

      const cols = Math.ceil(w / GRID_SIZE) + 2;
      const rows = Math.ceil(h / GRID_SIZE) + 2;

      for (let r = -1; r <= rows; r++) {
        const baseY = r * GRID_SIZE;
        for (let c = -1; c < cols; c++) {
          const x0 = c * GRID_SIZE;
          const x1 = (c + 1) * GRID_SIZE;
          const midX = (x0 + x1) / 2;
          const dx = midX - mouse.x;
          const dy = baseY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const t = dist < INFLUENCE_RADIUS ? (1 - dist / INFLUENCE_RADIUS) ** 2 : 0;
          const alpha = baseAlpha * (1 - t);
          if (alpha < 0.003) continue;

          const [px0, py0] = displace(x0, baseY);
          const [px1, py1] = displace(x1, baseY);

          ctx!.beginPath();
          ctx!.moveTo(px0, py0);
          ctx!.lineTo(px1, py1);
          ctx!.strokeStyle = `rgba(${color},${alpha})`;
          ctx!.lineWidth = 1;
          ctx!.stroke();
        }
      }

      for (let c = -1; c <= cols; c++) {
        const baseX = c * GRID_SIZE;
        for (let r = -1; r < rows; r++) {
          const y0 = r * GRID_SIZE;
          const y1 = (r + 1) * GRID_SIZE;
          const midY = (y0 + y1) / 2;
          const dx = baseX - mouse.x;
          const dy = midY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const t = dist < INFLUENCE_RADIUS ? (1 - dist / INFLUENCE_RADIUS) ** 2 : 0;
          const alpha = baseAlpha * (1 - t);
          if (alpha < 0.003) continue;

          const [px0, py0] = displace(baseX, y0);
          const [px1, py1] = displace(baseX, y1);

          ctx!.beginPath();
          ctx!.moveTo(px0, py0);
          ctx!.lineTo(px1, py1);
          ctx!.strokeStyle = `rgba(${color},${alpha})`;
          ctx!.lineWidth = 1;
          ctx!.stroke();
        }
      }

      animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 45 }}
      aria-hidden="true"
    />
  );
}
