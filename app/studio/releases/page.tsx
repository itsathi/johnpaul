import type { Metadata } from "next";
import Link from "next/link";
import { Cell, DataTable, DemoTag, Meter, Panel, Pending, Row, StudioHeading } from "@/components/studio-kit";
import { releases, kalpanaProgress } from "@/content/releases";

export const metadata: Metadata = { title: "Releases" };

export default function StudioReleases() {
  return (
    <div className="space-y-8">
      <StudioHeading
        eyebrow="Releases"
        title="Kalpana, chapter by chapter."
        intro="The album is released in chapters. Four of eight are public, so the CMS tracks which are live and which are still reserved positions."
      />

      <Panel title="Album progress">
        <div className="p-5">
          <p className="flex flex-wrap items-baseline justify-between gap-4">
            <span className="font-display text-3xl leading-none tracking-tight text-paper">
              {kalpanaProgress.released} of {kalpanaProgress.total} chapters released
            </span>
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-mute">
              {kalpanaProgress.note}
            </span>
          </p>
          <p className="mt-4">
            <Meter
              value={Math.round((kalpanaProgress.released / kalpanaProgress.total) * 100)}
              label="published"
            />
          </p>
        </div>
      </Panel>

      <Panel title="Releases">
        <DataTable columns={["Title", "Type", "Position", "Status", "Tracks", ""]}>
          {releases.map((r) => (
            <Row key={r.slug}>
              <Cell>
                <Link
                  href={`/music/${r.slug}`}
                  className="text-paper transition-colors hover:text-brass-bright"
                >
                  {r.title}
                </Link>
              </Cell>
              <Cell>{r.kind}</Cell>
              <Cell mono>{r.position}</Cell>
              <Cell>{r.status}</Cell>
              <Cell mono>
                {r.tracks.length
                  ? `${r.tracks.filter((t) => t.title).length} of ${r.tracks.length}`
                  : "—"}
              </Cell>
              <Cell>
                <DemoTag label={r.source === "documented" ? "Documented" : "Placeholder"} />
              </Cell>
            </Row>
          ))}
        </DataTable>
      </Panel>

      <Panel title="Chapter slots">
        <DataTable columns={["No", "Title", "Video", "State"]}>
          {releases[0].tracks.map((t) => (
            <Row key={t.no}>
              <Cell mono>{t.no}</Cell>
              <Cell>
                {t.title ?? <Pending value={null} />}
              </Cell>
              <Cell>
                {t.youtube ? (
                  <a
                    href={t.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-brass-bright"
                  >
                    Published ↗
                  </a>
                ) : (
                  <Pending value={null} />
                )}
              </Cell>
              <Cell>
                <DemoTag label={t.title ? "Released" : "Reserved"} />
              </Cell>
            </Row>
          ))}
        </DataTable>
      </Panel>
    </div>
  );
}
