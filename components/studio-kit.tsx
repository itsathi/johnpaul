import type { ReactNode } from "react";

/** The admin's shared vocabulary: headings, stat tiles, tables and the standing
 *  "this is a placeholder" markers. Server components — the admin reads
 *  entirely from static content. */

export function StudioHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="border-b border-line pb-7">
      <p className="flex items-center gap-4 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-mute">
        <span className="text-brass">Studio</span>
        <span className="h-px w-8 bg-line" />
        <span>{eyebrow}</span>
      </p>
      <h1
        className="mt-5 font-display leading-[0.98] tracking-[-0.02em] text-paper"
        style={{ fontSize: "clamp(2rem, 4.6vw, 3.4rem)" }}
      >
        {title}
      </h1>
      {intro ? <p className="mt-4 max-w-2xl text-sm leading-relaxed text-bone/85">{intro}</p> : null}
    </header>
  );
}

export function StatTile({
  label,
  value,
  note,
  ok,
}: {
  label: string;
  value: string;
  note?: string;
  ok?: boolean;
}) {
  return (
    <div className="border border-line p-5">
      <p className="font-mono text-[0.55rem] uppercase tracking-[0.24em] text-mute">{label}</p>
      <p className="mt-3 font-display text-3xl leading-none tracking-tight text-paper">{value}</p>
      {note ? (
        <p className="mt-3 font-mono text-[0.55rem] uppercase leading-[1.8] tracking-[0.16em] text-mute">
          {ok === undefined ? note : ok ? `✓ ${note}` : `! ${note}`}
        </p>
      ) : null}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border border-line">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <h2 className="font-mono text-[0.6rem] uppercase tracking-[0.26em] text-paper">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/** A data table. `columns` are the visible headers; cells are supplied per row
 *  by the caller so each admin page can shape its own rows. */
export function DataTable({
  columns,
  children,
}: {
  columns: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-left">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c}
                scope="col"
                className="border-b border-line px-5 py-3 font-mono text-[0.53rem] uppercase tracking-[0.22em] text-mute"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <tr className="border-b border-line/60 transition-colors last:border-b-0 hover:bg-smoke/60">{children}</tr>;
}

export function Cell({
  children,
  mono = false,
}: {
  children: ReactNode;
  mono?: boolean;
}) {
  return (
    <td
      className={`px-5 py-3.5 align-middle text-sm text-bone/90 ${
        mono ? "font-mono text-[0.7rem] text-bone" : ""
      }`}
    >
      {children}
    </td>
  );
}

export function Pending({ value }: { value: string | null | undefined }) {
  if (value) return <>{value}</>;
  return (
    <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-mute">
      To be confirmed
    </span>
  );
}

/** A progress bar for roster/enrolment state. */
export function Meter({ value, label }: { value: number; label?: string }) {
  return (
    <span className="flex items-center gap-3">
      <span className="block h-1 w-24 bg-line">
        <span
          className="block h-full bg-brass"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </span>
      <span className="font-mono text-[0.62rem] text-bone">{value}%</span>
      {label ? (
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-mute">
          {label}
        </span>
      ) : null}
    </span>
  );
}

export function StatusPill({ value }: { value: string }) {
  const tone =
    value === "Active" || value === "Published" || value === "Confirmed"
      ? "border-brass/50 text-brass-bright"
      : value === "New" || value === "In review"
        ? "border-line text-bone"
        : "border-line/60 text-mute";
  return (
    <span className={`border px-2.5 py-1 font-mono text-[0.52rem] uppercase tracking-[0.2em] ${tone}`}>
      {value}
    </span>
  );
}

export function DemoTag({ label = "Placeholder" }: { label?: string }) {
  return (
    <span className="border border-line px-2 py-0.5 font-mono text-[0.5rem] uppercase tracking-[0.2em] text-mute">
      {label}
    </span>
  );
}
