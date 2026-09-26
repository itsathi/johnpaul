"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import SectionTag from "./ui/section-tag";
import RenderBoundary from "./ui/render-boundary";
import { bindLabInput } from "./webgl/lab-state";
import { useIsDesktop, usePrefersReducedMotion } from "@/lib/media";

const MusicScene = dynamic(
  () => import("./webgl/music-scene").then((m) => ({ default: m.default })),
  { ssr: false },
);

/** Static, CSS-only stand-in used when WebGL is off-limits. */
function MusicFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg viewBox="0 0 600 220" className="h-2/3 max-h-[260px] w-full opacity-60">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path
            key={i}
            d={`M20 ${110 + (i % 2 ? 14 : -14)} C 140 ${
              110 + Math.sin(i) * 42
            }, 240 ${108 + Math.cos(i) * 40}, 360 ${110 + (i % 3 ? 10 : -10)} S 540 ${
              106 + (i % 2 ? 20 : -20)
            }, 580 110`}
            fill="none"
            stroke={i % 2 ? "rgba(217,170,110,0.5)" : "rgba(207,199,182,0.35)"}
            strokeWidth="1"
            style={{ transformOrigin: "center", animation: `grain ${0.9 + i * 0.35}s ease-in-out infinite alternate` }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function MusicLab() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const desktop = useIsDesktop(1024);

  useEffect(() => {
    // only wire scroll/pointer into the 3D scene when it will actually run
    if (reduced || !desktop) return;
    return bindLabInput();
  }, [reduced, desktop]);

  return (
    <section
      id="lab"
      className="relative h-[120vh] overflow-hidden bg-ink"
      aria-label="An abstract musical 3D environment"
    >
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end">
        <div className="mx-auto flex w-full max-w-[92rem] items-end justify-between px-6 pb-16 md:px-10 md:pb-20 lg:px-14">
          <div>
            <SectionTag index="07" label="The laboratory" />
            <p
              className="mt-6 max-w-2xl font-display leading-[1.05] tracking-[-0.02em] text-paper"
              style={{
                fontSize: "clamp(1.9rem, 4.2vw, 4rem)",
                textShadow: "0 2px 40px rgba(0,0,0,0.6)",
              }}
            >
              Every string, sample and
              <em className="italic text-brass-bright"> silence</em>, arranged.
            </p>
          </div>
          <p className="hidden max-w-xs pb-2 font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.26em] text-bone/70 md:block">
            A quiet instrument: pure light, in motion.
          </p>
        </div>
      </div>

      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ opacity: reduced || !desktop ? 0.4 : 1 }}
      >
        {reduced || !desktop ? (
          <MusicFallback />
        ) : (
          <RenderBoundary fallback={<MusicFallback />}>
            <Suspense fallback={<MusicFallback />}>
              <Canvas
                dpr={[1, 1.5]}
                gl={{ antialias: true, powerPreference: "high-performance" }}
                camera={{ position: [0, 2.2, 7.4], fov: 55 }}
              >
                <MusicScene />
              </Canvas>
            </Suspense>
          </RenderBoundary>
        )}
      </div>
    </section>
  );
}