import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { CheckCircle2, XCircle, Loader2, RotateCw } from "lucide-react";

export const Route = createFileRoute("/validation")({
  head: () => ({ meta: [{ title: "Validation — Vanij" }, { name: "description", content: "Build, lint, test and auto-repair orchestration." }]}),
  component: ValidationPage,
});

const STEPS = [
  { name: "Install",      state: "ok",    dur: "1.4s", out: "0 vulnerabilities" },
  { name: "Typecheck",    state: "ok",    dur: "3.2s", out: "tsc — 0 errors" },
  { name: "Lint",         state: "ok",    dur: "0.9s", out: "eslint — 0 warnings" },
  { name: "Unit tests",   state: "run",   dur: "—",    out: "82/124 passed · running" },
  { name: "E2E",          state: "wait",  dur: "—",    out: "queued" },
  { name: "Bundle",       state: "wait",  dur: "—",    out: "queued" },
];

const TONE = {
  ok:   { bg: "bg-success/10",  text: "text-success",  icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  run:  { bg: "bg-electric/10", text: "text-electric", icon: <Loader2 className="h-3.5 w-3.5 animate-spin" /> },
  wait: { bg: "bg-surface-2",   text: "text-muted-foreground", icon: <Loader2 className="h-3.5 w-3.5 opacity-40" /> },
  err:  { bg: "bg-danger/10",   text: "text-danger",   icon: <XCircle className="h-3.5 w-3.5" /> },
} as const;

function ValidationPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="CI/CD · auto-repair"
        title="Validation pipeline"
        description="Every reconciled commit runs through a deterministic validation pipeline. Failures are routed back to the responsible agent with full context."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 glass rounded-2xl p-5">
          <div className="text-sm font-medium mb-4">Pipeline · wave 3</div>
          <ol className="relative">
            {STEPS.map((s, i) => {
              const t = TONE[s.state as keyof typeof TONE];
              return (
                <li key={s.name} className="relative pl-10 pb-5 last:pb-0">
                  {i < STEPS.length - 1 && <span className="absolute left-[15px] top-7 bottom-0 w-px bg-gradient-to-b from-border to-transparent" />}
                  <span className={`absolute left-0 top-0 h-8 w-8 rounded-xl grid place-items-center ${t.bg} ${t.text}`}>{t.icon}</span>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{s.dur}</div>
                  </div>
                  <div className={`text-[11px] mt-0.5 ${t.text}`}>{s.out}</div>
                  {s.state === "run" && (
                    <div className="mt-2 h-1 rounded-full bg-surface-3 overflow-hidden">
                      <div className="h-full w-2/3 ai-gradient-bg shimmer" />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium">Auto-repair</div>
              <RotateCw className="h-3.5 w-3.5 text-violet-glow" />
            </div>
            <ul className="space-y-2 text-xs">
              {[
                { agent: "Frontend-β", reason: "lease contention", retry: 1, ok: true },
                { agent: "Reconciler",  reason: "AST conflict",     retry: 2, ok: true },
                { agent: "Validator",   reason: "flaky e2e",         retry: 1, ok: false },
              ].map((r, i) => (
                <li key={i} className="flex items-center gap-2 rounded-lg bg-surface-2 px-2.5 py-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${r.ok ? "bg-success" : "bg-warning animate-pulse"}`} />
                  <span className="font-mono text-electric">{r.agent}</span>
                  <span className="text-muted-foreground truncate">{r.reason}</span>
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground">retry {r.retry}/3</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="text-sm font-medium mb-3">Diagnostics</div>
            <pre className="font-mono text-[11px] text-foreground/85 leading-relaxed bg-surface-2 rounded-xl p-3 max-h-56 overflow-auto scrollbar-thin">
{`FAIL  tests/agents.test.ts
  ● <AgentCard/> renders retry badge

  expected "retries: 1" to be in the document

    14 |   render(<AgentCard a={agent} />);
  > 15 |   expect(screen.getByText(/retries: 1/i))
       |          ^
    16 |     .toBeInTheDocument();

  → routed to Frontend-α with full context`}
            </pre>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
