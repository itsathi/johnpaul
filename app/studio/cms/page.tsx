import type { Metadata } from "next";
import Link from "next/link";
import { Cell, DataTable, Meter, Panel, Row, StatTile, StatusPill, StudioHeading } from "@/components/studio-kit";
import { collections } from "@/content/studio";
import { healthChecks } from "@/content/studio";

export const metadata: Metadata = { title: "Content" };

export default function StudioCms() {
  const ready = healthChecks.filter((h) => h.ok).length;

  return (
    <div className="space-y-8">
      <StudioHeading
        eyebrow="Content"
        title="Every collection in one place."
        intro="The content layer this site reads from. Published collections map to real routes; the rest are honest placeholders."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Collections" value={String(collections.length)} note="Across the platform" />
        <StatTile label="Published" value={String(collections.filter((c) => c.state === "Published").length)} note="Live on the public site" />
        <StatTile label="In review" value={String(collections.filter((c) => c.state === "In review").length)} note="Awaiting artist detail" />
        <StatTile label="Checks passing" value={`${ready} of ${healthChecks.length}`} note="Readiness checks" />
      </div>

      <Panel title="Collections">
        <DataTable columns={["Collection", "Entries", "Updated", "Owner", "State", ""]}>
          {collections.map((c) => (
            <Row key={c.key}>
              <Cell>{c.label}</Cell>
              <Cell mono>{String(c.entries)}</Cell>
              <Cell>{c.updated}</Cell>
              <Cell>{c.owner}</Cell>
              <Cell>
                <StatusPill value={c.state} />
              </Cell>
              <Cell>
                <Link
                  href={c.href}
                  className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-brass-bright"
                >
                  View →
                </Link>
              </Cell>
            </Row>
          ))}
        </DataTable>
      </Panel>

      <Panel title="Readiness">
        <div className="space-y-5 p-5">
          {healthChecks.map((h) => (
            <div key={h.label}>
              <p className="flex flex-wrap items-baseline justify-between gap-3">
                <span className="text-sm text-paper">{h.label}</span>
                <span className="font-mono text-[0.62rem] text-bone">{h.value}</span>
              </p>
              <p className="mt-2">
                <Meter value={h.ok ? 100 : 35} label={h.ok ? "ready" : "incomplete"} />
              </p>
              <p className="mt-2 text-xs text-mute">{h.note}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
