"use client";

import { motion } from "framer-motion";
import Media from "./media";

type MediaRevealProps = {
  src: string;
  alt: string;
  className?: string;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  wixWidth?: number;
  wixHeight?: number;
  caption?: string;
};

/**
 * A photographic moment revealed with a vertical curtain + slow settle.
 * Editorial, restrained.
 */
export default function MediaReveal({
  src,
  alt,
  className = "",
  ratio = "aspect-[4/5]",
  sizes,
  priority = false,
  wixWidth,
  wixHeight,
  caption,
}: MediaRevealProps) {
  return (
    <figure className={`group ${className}`}>
      <motion.div
        className={`relative overflow-hidden ${ratio} bg-coal`}
        initial={{ clipPath: "inset(12% 8% 12% 8%)", opacity: 0.4 }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="absolute inset-0 h-full w-full"
          initial={{ scale: 1.18 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Media
            src={src}
            alt={alt}
            sizes={sizes}
            priority={priority}
            wixWidth={wixWidth}
            wixHeight={wixHeight}
            className="h-full w-full object-cover"
          />
        </motion.div>
        <div className="vignette absolute inset-0" />
      </motion.div>
      {caption ? (
        <figcaption className="mt-3 flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.28em] text-mute">
          <span className="h-px w-6 bg-line" />
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}