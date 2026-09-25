import TextReveal from "./text-reveal";

type SectionTagProps = {
  index?: string;
  label: string;
  className?: string;
};

/** Small editorial eyebrow: index · label · hairline. */
export default function SectionTag({
  index,
  label,
  className = "",
}: SectionTagProps) {
  return (
    <div
      className={`flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-mute ${className}`}
    >
      {index ? <span className="text-brass">{index}</span> : null}
      <span className="h-px w-8 bg-line" />
      <TextReveal className="inline-block">
        {label}
      </TextReveal>
    </div>
  );
}