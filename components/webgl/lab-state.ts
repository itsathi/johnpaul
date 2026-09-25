"use client";

/**
 * Mutable scribbles shared between the page wrapper and the R3F scene —
 * read every frame, written on scroll/pointer events. Cheap and allocation-free.
 */
export const scroll = { progress: 0 };
export const pointer = { x: 0, y: 0 };

export function bindLabInput() {
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scroll.progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  };
  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pointermove", onPointer, { passive: true });
  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("pointermove", onPointer);
  };
}