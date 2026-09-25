"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion, useViewportSize } from "@/lib/media";

const BRIGHT = "236, 230, 218";

/**
 * A field of guitar strings rendered on canvas. Each string sways with a
 * standing wave that fans out near the pointer; a soft pluck travels down the
 * lines. Subtle, purposeful, musical. Desktop only.
 */
export default function StringVisual() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const size = useViewportSize();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let raf = 0;
    let strings: number[] = [];
    const mouse = { x: -1, y: -1, active: false };
    const gap = 96;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      strings = [];
      for (let x = 0; x <= width; x += gap) strings.push(x);
    };

    const draw = (t = 0) => {
      ctx.clearRect(0, 0, width, height);
      const travel = (t * 0.0006) % 1;

      strings.forEach((x, i) => {
        const phase = i * 0.55;
        const proximity = mouse.active
          ? Math.max(0, 1 - Math.abs(mouse.x - x) / 320)
          : 0;
        const locals = proximity * 0.55 + 0.45;

        ctx.beginPath();
        ctx.moveTo(x, 0);
        for (let y = 0; y <= height; y += 7) {
          const standing = Math.sin(y * 0.012 + t * 0.0015 + phase) * 7 * locals;
          const pluck = Math.exp(-Math.pow((y / height - travel) * 7, 2)) * 26;
          const pluckWave = Math.sin((y / height - travel) * 42) * pluck;
          const sway = Math.sin(t * 0.0005 + phase) * 2;
          ctx.lineTo(x + standing + pluckWave + sway, y);
        }

        const alpha = 0.1 + proximity * 0.42;
        ctx.strokeStyle = `rgba(${BRIGHT}, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    };

    const onPointer = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      if (reduced) draw(0);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });

    if (reduced) {
      draw(0);
    } else {
      const loop = (t: number) => {
        draw(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [reduced, size.width, size.height]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}