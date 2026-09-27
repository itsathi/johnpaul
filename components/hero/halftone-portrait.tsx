"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import RenderBoundary from "../ui/render-boundary";
import { wix } from "@/lib/media";
import { useIsDesktop, usePrefersReducedMotion } from "@/lib/media-hooks";
import { usePreloaderDone } from "@/lib/preload";
import { media } from "@/content/site";

const HalftoneScene = dynamic(
  () => import("../webgl/halftone-scene").then((m) => ({ default: m.default })),
  { ssr: false },
);

/* Same-origin through the image optimizer, so the texture is never tainted.
   1200/75 are the width and quality Next's own image config allows; the dot
   pitch is far coarser than that, so there is nothing to gain from more. */
const PORTRAIT_SRC = `/_next/image?url=${encodeURIComponent(
  wix(media.portrait, 1200),
)}&w=1200&q=75`;

const DURATION = 2600;

const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

/**
 * The opening shot: John's portrait, printed as a halftone plate out of a few
 * thousand dots. The plate is already whole when it arrives, then the dots come
 * apart and drift off the frame, uncovering the stage photograph underneath.
 * Scroll hands the plate back to noise so the hero dissolves into the page.
 *
 * The photograph stays in the DOM (and in the accessibility tree); this only
 * ever draws over it, and the whole thing is an enhancement — no WebGL, a
 * coarse grid, or a failed context all fall back to the plain image.
 */
export default function HalftonePortrait() {
  const reduced = usePrefersReducedMotion();
  const desktop = useIsDesktop(768);
  const loaded = usePreloaderDone();
  const [visible, setVisible] = useState(false);

  /* Starts whole, so the first painted frame is a finished plate rather than a
     flash of empty ground before the entrance has advanced. */
  const progress = useRef(1);
  const pointer = useRef({ x: -999, y: -999, amt: 0 });
  const started = useRef<number | null>(null);

  /* Fade the canvas in only once it is actually painting, so the photograph
     never flashes between two looks. */
  useEffect(() => {
    if (!loaded) return;
    const id = window.setTimeout(() => setVisible(true), 220);
    return () => window.clearTimeout(id);
  }, [loaded]);

  useEffect(() => {
    if (!loaded || reduced) return;
    started.current = performance.now();
    let raf = 0;

    const tick = () => {
      const t0 = started.current;
      if (t0 !== null) {
        const elapsed = performance.now() - t0;
        const entrance = easeOutQuint(Math.min(elapsed / DURATION, 1));

        /* The plate is the intro and the photograph is the arrival, so the
           entrance only ever takes coverage away. */
        let plate = 1 - entrance;

        /* Hand the plate back as the hero leaves, so the next section reads as
           a continuation rather than a hard cut. */
        const h = window.innerHeight || 1;
        const out = Math.min(Math.max(window.scrollY / (h * 0.75), 0), 1);
        const outEase = out * out * (3 - 2 * out);
        plate *= 1 - 0.88 * outEase;

        progress.current = plate;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loaded, reduced]);

  useEffect(() => {
    if (reduced || !desktop) return;
    const target = { x: -999, y: -999, amt: 0 };
    const p = pointer.current;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      target.amt = 1;
    };
    const onLeave = () => {
      target.amt = 0;
    };

    let raf = 0;
    const ease = () => {
      p.x += (target.x - p.x) * 0.16;
      p.y += (target.y - p.y) * 0.16;
      p.amt += (target.amt - p.amt) * 0.07;
      raf = requestAnimationFrame(ease);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    raf = requestAnimationFrame(ease);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [desktop, reduced]);

  if (reduced) return null;

  return (
    <div
      className="absolute inset-0 transition-opacity duration-1000 ease-out"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden
    >
      <RenderBoundary fallback={null}>
        <Suspense fallback={null}>
          <Canvas
            dpr={[1, 1.75]}
            gl={{ antialias: false, powerPreference: "high-performance" }}
            camera={{ position: [0, 0, 1], fov: 50 }}
            style={{ position: "absolute", inset: 0 }}
          >
            <HalftoneScene
              src={PORTRAIT_SRC}
              input={{ progress, pointer }}
              /* A coarser plate on small screens, and the dots flood into tone
                 sooner so a phone still lands on a face. */
              density={desktop ? 1 / 168 : 1 / 96}
              /* The plate follows the photograph's own framing, which is
                 already composed, rather than cropping into it. */
              zoom={desktop ? 1 : 1.12}
              focus={desktop ? [0.4, 0.52] : [0.44, 0.5]}
              bloom={desktop ? 0 : 0.72}
            />
          </Canvas>
        </Suspense>
      </RenderBoundary>
    </div>
  );
}
