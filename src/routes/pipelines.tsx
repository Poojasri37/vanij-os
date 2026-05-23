import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { GitBranch, Play, CheckCircle2, Loader2, Clock } from "lucide-react";

export const Route = createFileRoute("/pipelines")({
  head: () => ({ meta: [{ title: "Pipelines — Vanij" }, { name: "description", content: "Build and delivery pipelines across environments." }]}),
  component: PipelinesPage,
});

const PIPES = [
  { name: "main → edge",     branch: "main",    state: "running",  stages: 6, done: 4, eta: "02:14", who: "Pipeline" },
  { name: "wave-3 → staging",branch: "wave-3",  state: "passed",   stages: 6, done: 6, eta: "—",     who: "Validator" },
  { name: "esll → memory",   branch: "esll",    state: "running",  stages: 4, done: 2, eta: "00:48", who: "Memory" },
  { name: "release-7.2.1",   branch: "release", state: "queued",   stages: 8, done: 0, eta: "—",     who: "—" },
];

const ICO = {
  running: <Loader2 className="h-3.5 w-3.5 animate-spin text-electric" />,
  passed:  <CheckCircle2 className="h-3.5 w-3.5 text-success" />,
  queued:  <Clock className="h-3.5 w-3.5 text-muted-foreground" />,
};

function PipelinesPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Delivery · 4 active"
        title="Pipelines"
        description="Each agent wave funnels into a delivery pipeline. Stages run in parallel when independent and serialize at deploy gates."
        actions={
          <button className="h-9 px-3.5 rounded-xl ai-gradient-bg text-background text-xs font-medium flex items-center gap-2 glow-electric">
            <Play className="h-3.5 w-3.5" /> Trigger pipeline
          </button>
        }
      />

      <div className="space-y-3">
        {PIPES.map((p) => (
          <div key={p.name} className="glass rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-xl bg-surface-2 grid place-items-center">{ICO[p.state as keyof typeof ICO]}</span>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{p.name}</div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-2"><GitBranch className="h-3 w-3" />{p.branch} · driven by <span className="text-electric">{p.who}</span></div>
              </div>
              <div className="ml-auto text-[11px] text-muted-foreground">ETA <span className="font-mono text-foreground">{p.eta}</span></div>
            </div>
            <div className="mt-3 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${p.stages}, 1fr)` }}>
              {Array.from({ length: p.stages }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full ${i < p.done ? "ai-gradient-bg" : i === p.done && p.state === "running" ? "bg-electric/30 shimmer" : "bg-surface-3"}`}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-mono text-muted-foreground">
              {["install","plan","build","test","scan","deploy","verify","release"].slice(0, p.stages).map((s) => <span key={s}>{s}</span>)}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
