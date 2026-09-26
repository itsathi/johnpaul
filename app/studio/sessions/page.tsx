import type { Metadata } from "next";
import { Cell, DataTable, DemoTag, Panel, Row, StatTile, StatusPill, StudioHeading } from "@/components/studio-kit";
import { sessionRequests } from "@/content/studio";
import { services } from "@/content/site";
import { locationOptions } from "@/content/booking";

export const metadata: Metadata = { title: "Sessions" };

export default function StudioSessions() {
  return (
    <div className="space-y-8">
      <StudioHeading
        eyebrow="Sessions"
        title="Requests and the services they arrive for."
        intro="The four documented services and the request queue. Rows are illustrative; no real booking exists."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Requests" value={String(sessionRequests.length)} note="Placeholder rows" />
        <StatTile label="New" value={String(sessionRequests.filter((r) => r.status === "New").length)} note="Awaiting a reply" />
        <StatTile label="Confirmed" value={String(sessionRequests.filter((r) => r.status === "Confirmed").length)} note="Placeholder" />
        <StatTile label="Services" value={String(services.length)} note="Documented service types" />
      </div>

      <Panel title="Request queue">
        <DataTable columns={["Ref", "Who", "Service", "When", "Where", "Status", ""]}>
          {sessionRequests.map((r) => (
            <Row key={r.id}>
              <Cell mono>{r.id}</Cell>
              <Cell>{r.who}</Cell>
              <Cell>{r.service}</Cell>
              <Cell>{r.when}</Cell>
              <Cell>{r.where}</Cell>
              <Cell>
                <StatusPill value={r.status} />
              </Cell>
              <Cell>
                <DemoTag label="Demo" />
              </Cell>
            </Row>
          ))}
        </DataTable>
      </Panel>

      <Panel title="Services as published">
        <ul>
          {services.map((s) => (
            <li key={s.no} className="flex flex-wrap items-baseline gap-4 border-b border-line/60 px-5 py-4 last:border-b-0">
              <span className="font-mono text-[0.55rem] tracking-[0.24em] text-brass">{s.no}</span>
              <span className="font-display text-xl leading-none tracking-tight text-paper">{s.name}</span>
              <span className="min-w-[16rem] flex-1 text-sm text-bone/80">{s.body}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Where the work happens">
        <ul>
          {locationOptions.map((l) => (
            <li key={l.key} className="flex flex-wrap items-baseline gap-4 border-b border-line/60 px-5 py-4 last:border-b-0">
              <span className="font-display text-xl leading-none tracking-tight text-paper">{l.label}</span>
              <span className="min-w-[16rem] flex-1 text-sm text-bone/80">{l.note}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
