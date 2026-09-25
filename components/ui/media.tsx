"use client";

import Image from "next/image";
import { useState } from "react";
import { wix } from "@/lib/media";

type MediaProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
  wixWidth?: number;
  wixHeight?: number;
  placeholderLabel?: string;
};

/**
 * Image with a graceful, on-brand fallback: if a remote image can't load
 * (offline demo, expired token), an elegant placeholder accepts John's real
 * photography later. Pass `wixWidth`/`wixHeight` to request a resized Wix CDN
 * image; otherwise `src` is used verbatim.
 */
export default function Media({
  src,
  alt,
  width = 1600,
  height = 1000,
  sizes,
  className = "",
  priority = false,
  wixWidth,
  wixHeight,
  placeholderLabel = "Portrait — image to be placed",
}: MediaProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative flex items-center justify-center overflow-hidden bg-coal ${
          className || ""
        }`}
      >
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(120% 120% at 30% 20%, #241d15 0%, #0f0d0b 60%, #070605 100%)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 200 120" className="h-full w-full opacity-[0.07]">
            {[0, 20, 40, 60, 80, 100].map((y) => (
              <path
                key={y}
                d={`M0 ${y} C 50 ${y - 18}, 150 ${y + 18}, 200 ${y}`}
                stroke="currentColor"
                fill="none"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>
        <div className="relative flex flex-col items-center gap-2 px-6 text-center">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.35em] text-bone">
            John Paul
          </span>
          <span className="max-w-[16rem] font-mono text-[0.55rem] uppercase tracking-[0.22em] text-mute">
            {placeholderLabel}
          </span>
        </div>
      </div>
    );
  }

  const resolved = wixWidth ? wix(src, wixWidth, wixHeight) : src;

  return (
    <Image
      src={resolved}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className={className || undefined}
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}