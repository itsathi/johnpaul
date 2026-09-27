"use client";

/**
 * The waveform.
 *
 * Two renderers behind one component, and the choice between them is the point.
 *
 *   live      — real frequency data off the engine's `AnalyserNode`. Drawn on
 *               its own rAF, reading the analyser directly. Never through React
 *               state: sixty `Uint8Array`s a second through a context value
 *               would re-render the entire site sixty times a second.
 *
 *   profile   — a fixed waveform shape derived from the track id, with the
 *               playhead drawn across it. This is what a track with no audio
 *               file gets, and it is deliberately NOT a fake spectrum: the bars
 *               never move on their own, so nothing here can be mistaken for
 *               the analysis of a sound that is not playing.
 *
 * Which one is used is decided by measurement rather than by assumption.
 * Cross-origin media that sends no CORS headers yields a zeroed frequency
 * array, so while audio is audibly playing the component samples frames and
 * drops back to `profile` if the data never moves. A "visualiser" therefore
 * never shows a dead flat line while a record is actually playing.
 */

import { useEffect, useMemo, useRef } from "react";
import { getEngine } from "@/lib/audio/engine";
import { usePrefersReducedMotion } from "@/lib/media-hooks";

const BAR_COUNT = 56;

/** Stable 32-bit FNV-1a — turns a track id into a repeatable shape. */
function seedFrom(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i += 1) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** A repeatable amplitude curve in 0–1. Musical-ish: it swells, it doesn't jitter. */
function profileBars(seed: number, count: number): number[] {
  const bars: number[] = [];
  let state = seed || 1;
  for (let i = 0; i < count; i += 1) {
    // xorshift32, so the curve is deterministic for a given track.
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    const noise = (state >>> 0) / 4294967295;
    const position = count > 1 ? i / (count - 1) : 0;
    // Two slow envelopes over the noise give the shape of a piece of music
    // rather than the shape of a random number generator.
    const swell = 0.55 + 0.45 * Math.sin(position * Math.PI * 1.7 + seed * 0.0011);
    const phrase = 0.7 + 0.3 * Math.sin(position * Math.PI * 5.3 + seed * 0.0007);
    bars.push(Math.min(1, Math.max(0.1, noise * 0.5 + swell * 0.3 + phrase * 0.28)));
  }
  return bars;
}

type WaveformProps = {
  /** The loaded track id. Drives the profile shape. */
  trackId: string | null;
  /** 0–1 playhead. */
  progress: number;
  playing: boolean;
  className?: string;
  /** Inline variant for track rows: no playhead split, no live analysis. */
  compact?: boolean;
};

export default function Waveform({
  trackId,
  progress,
  playing,
  className = "",
  compact = false,
}: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = usePrefersReducedMotion();

  /** Survives effect re-runs, so a single stutter never demotes a real one. */
  const silentReads = useRef(0);
  const demotedFor = useRef<string | null>(null);

  /* Memoised: a fresh array every render would re-run the draw effect on every
     render of every player component on the page. */
  const bars = useMemo(
    () => profileBars(seedFrom(trackId ?? "john-paul"), BAR_COUNT),
    [trackId],
  );

  const eligible = !reduced && !compact && playing;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frequency = new Uint8Array(64);

    let frame = 0;
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (width > 0 && height > 0) {
        const targetW = Math.round(width * dpr);
        const targetH = Math.round(height * dpr);
        if (canvas.width !== targetW || canvas.height !== targetH) {
          canvas.width = targetW;
          canvas.height = targetH;
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);

        /* Decide per frame whether real data is available. Doing it here rather
           than in an effect means the demotion is immediate and never requires
           a re-render to take effect. */
        let live = false;
        if (eligible && demotedFor.current !== trackId) {
          const analyser = getEngine().getAnalyser();
          if (analyser) {
            analyser.getByteFrequencyData(frequency);
            let peak = 0;
            for (let i = 0; i < frequency.length; i += 1) peak += frequency[i];
            if (peak > 0) {
              live = true;
              silentReads.current = 0;
            } else if ((silentReads.current += 1) > 4) {
              demotedFor.current = trackId;
            }
          } else {
            demotedFor.current = trackId;
          }
        }

        const values: number[] = [];
        if (live) {
          const usable = Math.max(1, Math.floor((frequency.length * 0.72) / BAR_COUNT));
          for (let i = 0; i < BAR_COUNT; i += 1) {
            let sum = 0;
            for (let j = 0; j < usable; j += 1) sum += frequency[i * usable + j] ?? 0;
            values.push(Math.min(1, sum / usable / 190));
          }
        }

        const gap = 2;
        const barWidth = Math.max(1.5, (width - gap * (BAR_COUNT - 1)) / BAR_COUNT);
        const centre = height / 2;

        for (let i = 0; i < BAR_COUNT; i += 1) {
          const x = i * (barWidth + gap);
          const amplitude = values.length ? (values[i] ?? 0) : (bars[i] ?? 0.1);
          const barHeight = Math.max(2, Math.max(0.06, amplitude) * height * 0.88);
          const played = i / BAR_COUNT <= progress;

          ctx.fillStyle = played ? "rgba(217,170,110,0.92)" : "rgba(236,230,218,0.2)";
          if (compact) {
            ctx.fillRect(x, centre - barHeight / 2, barWidth, barHeight);
          } else {
            const radius = Math.min(barWidth / 2, barHeight / 2);
            ctx.beginPath();
            ctx.roundRect(x, centre - barHeight / 2, barWidth, barHeight, radius);
            ctx.fill();
          }
        }
      }

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [bars, compact, eligible, playing, progress, reduced, trackId]);

  /* A new track deserves a fresh attempt at the analyser. */
  useEffect(() => {
    silentReads.current = 0;
    if (demotedFor.current === trackId) demotedFor.current = null;
  }, [trackId]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
