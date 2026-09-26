import type { Metadata } from "next";
import Link from "next/link";
import { Cell, DataTable, Panel, Pending, Row, StatTile, StatusPill, StudioHeading } from "@/components/studio-kit";
import { student } from "@/content/studio";

export const metadata: Metadata = { title: "Student" };

export default function StudentView() {
  return (
    <div className="space-y-8">
      <StudioHeading
        eyebrow="Student"
        title={student.name}
        intro={student.notice}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Track" value={student.track} note="Placeholder" />
        <StatTile label="Focus" value={student.focus} note="Set at booking" />
        <StatTile label="Streak" value={`${student.streak} lessons`} note="Placeholder" />
        <StatTile label="Account" value={student.since} note="No real student" />
      </div>

      <Panel title="Next session">
        <dl className="grid gap-x-10 gap-y-5 p-5 sm:grid-cols-2">
          {[
            { label: "Title", value: student.nextSession.title },
            { label: "When", value: student.nextSession.when },
            { label: "Format", value: student.nextSession.format },
            { label: "Duration", value: student.nextSession.duration },
            { label: "Focus", value: student.nextSession.focus },
            { label: "Fee", value: null },
          ].map((s) => (
            <div key={s.label} className="border-t border-line pt-4">
              <dt className="font-mono text-[0.53rem] uppercase tracking-[0.24em] text-mute">
                {s.label}
              </dt>
              <dd className="mt-2 text-sm text-paper">
                <Pending value={s.value} />
              </dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel title="Lesson history">
        <DataTable columns={["#", "Lesson", "When", "State"]}>
          {student.lessons.map((l) => (
            <Row key={l.no}>
              <Cell mono>{String(l.no).padStart(2, "0")}</Cell>
              <Cell>
                <span className="block text-paper">{l.title}</span>
                <span className="mt-1 block text-xs text-mute">{l.note}</span>
              </Cell>
              <Cell mono>{l.when}</Cell>
              <Cell>
                <StatusPill value={l.done ? "Complete" : "Pending"} />
              </Cell>
            </Row>
          ))}
        </DataTable>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Feedback">
          <ul>
            {student.feedback.map((f) => (
              <li key={f.when} className="border-b border-line/60 px-5 py-4 last:border-b-0">
                <p className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-mute">
                  {f.when}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-bone/85">{f.text}</p>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Resources">
          <ul>
            {student.resources.map((r) => (
              <li
                key={r.label}
                className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line/60 px-5 py-4 last:border-b-0"
              >
                <span className="text-sm text-paper">{r.label}</span>
                <span>
                  <Pending value={r.note === "To be confirmed" ? null : r.note} />
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <p>
        <Link
          href="/studio/academy"
          className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-brass-bright"
        >
          ← Back to academy admin
        </Link>
      </p>
    </div>
  );
}
