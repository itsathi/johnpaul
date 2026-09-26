import type { Metadata } from "next";
import { Cell, DataTable, DemoTag, Meter, Panel, Row, StatTile, StatusPill, StudioHeading } from "@/components/studio-kit";
import { activity, healthChecks, metrics, pipeline, sessionRequests } from "@/content/studio";

export const metadata: Metadata = { title: "Dashboard" };

export default function StudioDashboard() {
  return (
    <div className="space-y-8">
      <StudioHeading
        eyebrow="Dashboard"
        title="Everything at a glance."
        intro="The shape an operations console would have. Every figure below is illustrative placeholder data — no real students, bookings, orders or revenue are represented."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => (
          <StatTile
            key={m.key}
            label={m.label}
            value={m.value}
            note={m.note}
            ok={m.source === "documented" ? true : undefined}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Recent activity">
          <ul>
            {activity.map((a) => (
              <li key={a.id} className="flex items-start gap-4 border-b border-line/60 px-5 py-4 last:border-b-0">
                <span className="mt-0.5 w-16 shrink-0 font-mono text-[0.55rem] uppercase tracking-[0.18em] text-mute">
                  {a.at}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-paper">{a.title}</span>
                  <span className="mt-1 block text-xs text-mute">{a.detail}</span>
                </span>
                <DemoTag label={a.kind} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Content readiness">
          <ul>
            {healthChecks.map((h) => (
              <li key={h.label} className="flex items-start gap-4 border-b border-line/60 px-5 py-4 last:border-b-0">
                <span
                  aria-hidden
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${h.ok ? "bg-brass" : "bg-mute/50"}`}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-sm text-paper">{h.label}</span>
                    <span className="font-mono text-[0.62rem] text-bone">{h.value}</span>
                  </span>
                  <span className="mt-1 block text-xs text-mute">{h.note}</span>
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Session requests">
        <DataTable columns={["Ref", "Who", "Service", "When", "Where", "Status"]}>
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
            </Row>
          ))}
        </DataTable>
      </Panel>

      <Panel title="Content pipeline">
        <div className="grid gap-5 p-5 sm:grid-cols-2">
          {pipeline.map((p) => (
            <div key={p.key}>
              <p className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-paper">{p.label}</span>
                <span className="font-mono text-[0.62rem] text-bone">
                  {p.done} / {p.value}
                </span>
              </p>
              <p className="mt-2">
                <Meter value={Math.round((p.done / p.value) * 100)} />
              </p>
              <p className="mt-2">
                <DemoTag label={p.source === "documented" ? "Documented" : "Placeholder"} />
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
