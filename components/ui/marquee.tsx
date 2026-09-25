import type { ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
  pauseOnHover?: boolean;
};

/**
 * Infinite horizontal typographic marquee. Content is duplicated once; CSS
 * translates the track by exactly 50% for a seamless loop.
 */
export default function Marquee({
  children,
  duration = 48,
  reverse = false,
  className = "",
  pauseOnHover = false,
}: MarqueeProps) {
  return (
    <div
      className={`relative flex overflow-hidden ${className}`}
      style={{ maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)" }}
    >
      <div
        className={`flex shrink-0 items-center whitespace-nowrap will-change-transform ${
          pauseOnHover ? "kinetic-pause" : ""
        }`}
      >
        <div
          className="animate-marquee-x flex shrink-0 items-center"
          style={
            {
              "--marquee-duration": `${duration}s`,
              animationDirection: reverse ? "reverse" : "normal",
            } as never
          }
        >
          {children}
          {children}
        </div>
      </div>
    </div>
  );
}