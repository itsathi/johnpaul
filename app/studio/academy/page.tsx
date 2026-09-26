import type { Metadata } from "next";
import Link from "next/link";
import { Cell, DataTable, DemoTag, Meter, Panel, Pending, Row, StatTile, StatusPill, StudioHeading } from "@/components/studio-kit";
import { curriculumStatus, roster, student } from "@/content/studio";
import { classes } from "@/content/academy-program";

export const metadata: Metadata = { title: "Academy" };

export default function StudioAcademy() {
  const active = roster.filter((r) => r.status === "Active").length;

  return (
    <div className="space-y-8">
      <StudioHeading
        eyebrow="Academy"
        title="Students, classes and curriculum."
        intro="Roster state, per-class curriculum completeness and the student-facing view. All records are placeholder data."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Roster rows" value={String(roster.length)} note="Placeholder records" />
        <StatTile label="Active" value={String(active)} note="Of the placeholder roster" />
        <StatTile
          label="Curricula detailed"
          value={`${curriculumStatus.filter((c) => c.detailed > 0).length} of ${classes.length}`}
          note="Only Making Tones has published detail"
        />
        <StatTile label="Waitlist" value={String(roster.filter((r) => r.status === "Waitlist").length)} note="Awaiting a cohort" />
      </div>

      <Panel title="Roster">
        <DataTable columns={["ID", "Name", "Track", "Progress", "Next", "Status"]}>
          {roster.map((r) => (
            <Row key={r.id}>
              <Cell mono>{r.id}</Cell>
              <Cell>{r.name}</Cell>
              <Cell>{r.track}</Cell>
              <Cell>
                <Meter value={r.progress} />
              </Cell>
              <Cell>{r.next}</Cell>
              <Cell>
                <StatusPill value={r.status} />
              </Cell>
            </Row>
          ))}
        </DataTable>
      </Panel>

      <Panel title="Curriculum state by class">
        <DataTable columns={["Class", "Modules", "Detailed", "Schedule", "Fee", "State"]}>
          {curriculumStatus.map((c) => (
            <Row key={c.slug}>
              <Cell>
                <Link
                  href={`/academy/classes/${c.slug}`}
                  className="text-paper transition-colors hover:text-brass-bright"
                >
                  {c.title}
                </Link>
              </Cell>
              <Cell mono>{String(c.modules)}</Cell>
              <Cell mono>{`${c.detailed} of ${c.modules}`}</Cell>
              <Cell>
                <Pending value={c.schedule} />
              </Cell>
              <Cell>
                <Pending value={c.fee} />
              </Cell>
              <Cell>
                <DemoTag label={c.source === "documented" ? "Documented" : "Placeholder"} />
              </Cell>
            </Row>
          ))}
        </DataTable>
      </Panel>

      {/* The student view is a real route, not a mock — it just has no data
          behind it, so the panel explains what would fill it. */}
      <Panel
        title="Student view"
        action={
          <Link
            href="/studio/academy/student"
            className="font-mono text-[0.56rem] uppercase tracking-[0.2em] text-brass-bright"
          >
            Open student dashboard →
          </Link>
        }
      >
        <div className="grid gap-6 p-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-paper">{student.name}</p>
            <p className="mt-1 text-xs text-mute">
              {student.track} · focus {student.focus} · {student.streak}-lesson streak
            </p>
            <p className="mt-4 border-l border-brass/40 pl-4 font-mono text-[0.58rem] uppercase leading-[1.9] tracking-[0.16em] text-mute">
              {student.notice}
            </p>
          </div>
          <ul className="space-y-3">
            {student.progress.map((p) => (
              <li key={p.label}>
                <p className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-bone/85">{p.label}</span>
                  <span className="font-mono text-[0.6rem] text-bone">{p.value}%</span>
                </p>
                <p className="mt-1.5">
                  <Meter value={p.value} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Panel>
    </div>
  );
}
