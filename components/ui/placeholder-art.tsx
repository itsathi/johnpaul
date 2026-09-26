import { createRng } from "@/lib/random";

type PlaceholderArtProps = {
  /** Any integer. The same seed always produces the same plate. */
  seed: number;
  className?: string;
  /** Short mono caption set in the lower-left, e.g. "Awaiting artwork". */
  label?: string;
};

/**
 * Quantises a generated coordinate. `Math.sin`/`Math.cos` are not bit-identical
 * between Node and the browser, so an unquantised value can differ in its last
 * decimal between the server and client renders and trip a hydration mismatch —
 * the contour field in `kolkata-roots` guards the same way.
 */
const px = (n: number) => n.toFixed(2);

/**
 * A generated, on-brand plate used wherever real artwork does not exist yet —
 * merchandise, class cards, product imagery. It is deliberately abstract so it
 * can never be mistaken for a photograph of John, and deterministic from its
 * seed so a card looks the same on every render.
 *
 * The vocabulary (concentric engraving, brass hairlines, registration ticks)
 * is shared with the Kalpana artwork, so placeholders sit inside the same
 * visual world as the real sections.
 */
export default function PlaceholderArt({
  seed,
  className = "",
  label = "Artwork to come",
}: PlaceholderArtProps) {
  const rng = createRng(seed);
  const rings = 5 + Math.floor(rng() * 4);
  const ticks = 40 + Math.floor(rng() * 20);
  const waveSeed = Math.floor(rng() * 100) / 100;
  const glyph = Math.floor(rng() * 3);

  return (
    <div className={`relative overflow-hidden bg-coal ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 120% at 28% 18%, #241d15 0%, #0f0d0b 58%, #070605 100%)",
        }}
      />

      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id={`pa-brass-${seed}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d9aa6e" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#bc8a4c" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        <g
          stroke={`url(#pa-brass-${seed})`}
          fill="none"
          strokeWidth="0.6"
          vectorEffect="non-scaling-stroke"
        >
          {Array.from({ length: rings }, (_, i) => (
            <circle
              key={i}
              cx="100"
              cy="100"
              r={px(22 + i * (54 / Math.max(rings - 1, 1)))}
              opacity={px(0.85 - i * 0.07)}
            />
          ))}
        </g>

        {/* perimeter registration ticks */}
        <g stroke="#bc8a4c" strokeWidth="0.8" opacity="0.28">
          {Array.from({ length: ticks }, (_, i) => {
            const a = (i / ticks) * Math.PI * 2;
            const long = i % 4 === 0;
            const r1 = 84;
            const r2 = long ? 90 : 87;
            return (
              <line
                key={i}
                x1={px(100 + Math.cos(a) * r1)}
                y1={px(100 + Math.sin(a) * r1)}
                x2={px(100 + Math.cos(a) * r2)}
                y2={px(100 + Math.sin(a) * r2)}
              />
            );
          })}
        </g>

        {/* the glyph — one of three engraved marks */}
        <g
          stroke="#d9aa6e"
          fill="none"
          strokeWidth="0.9"
          opacity="0.6"
          strokeLinecap="round"
        >
          {glyph === 0 ? (
            <path
              d={
                `M62 100 C ${px(74 + waveSeed * 10)} 70, ${px(88 - waveSeed * 8)} 130, 100 100 ` +
                `C ${px(112 + waveSeed * 8)} 70, ${px(126 - waveSeed * 10)} 130, 138 100`
              }
            />
          ) : glyph === 1 ? (
            <>
              {[-14, -7, 0, 7, 14].map((dy) => (
                <line key={dy} x1="64" y1={100 + dy} x2="136" y2={100 + dy} />
              ))}
            </>
          ) : (
            <>
              <circle cx="100" cy="100" r="17" />
              <line x1="100" y1="76" x2="100" y2="124" />
              <line x1="76" y1="100" x2="124" y2="100" />
            </>
          )}
        </g>
      </svg>

      <div className="absolute inset-0 flex items-end justify-between p-4">
        <span className="font-mono text-[0.5rem] uppercase tracking-[0.3em] text-mute">
          {label}
        </span>
        <span className="font-mono text-[0.5rem] tracking-[0.2em] text-mute/70">
          JP
        </span>
      </div>
    </div>
  );
}
