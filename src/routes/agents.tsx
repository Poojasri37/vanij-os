import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { AgentCard } from "@/components/app/AgentCard";
import { AGENTS } from "@/lib/mock";
import { Plus, Filter, Cpu } from "lucide-react";

export const Route = createFileRoute("/agents")({
  head: () => ({ meta: [
    { title: "Agents — Vanij" },
    { name: "description", content: "Manage autonomous coding agents, models, and routing." },
  ]}),
  component: AgentsPage,
});

const PROVIDERS = [
  { name: "Anthropic", model: "Claude Opus 4.5", load: 78, cost: "$3.10/M", color: "violet" },
  { name: "OpenAI",    model: "GPT-5.1",         load: 64, cost: "$2.40/M", color: "electric" },
  { name: "Google",    model: "Gemini 2.5 Pro",  load: 42, cost: "$1.85/M", color: "pink" },
  { name: "DeepSeek",  model: "DeepSeek V3.2",   load: 28, cost: "$0.42/M", color: "electric" },
  { name: "Local",     model: "Llama 3.3 70B",   load: 18, cost: "free",    color: "success" },
];

function AgentsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Agents · 8 active"
        title="Autonomous engineering fleet"
        description="Each agent owns a scope, leases symbols, and routes through the optimal model. Costs, retries, and context windows are continuously rebalanced."
        actions={
          <>
            <button className="h-9 px-3 rounded-xl border border-border bg-surface-2/60 text-xs flex items-center gap-2">
              <Filter className="h-3.5 w-3.5" /> Filters
            </button>
            <button className="h-9 px-3.5 rounded-xl ai-gradient-bg text-background text-xs font-medium flex items-center gap-2 glow-electric">
              <Plus className="h-3.5 w-3.5" /> New agent
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
        {AGENTS.map((a) => <AgentCard key={a.id} a={a} />)}
      </div>

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-medium">Provider routing</div>
              <div className="text-[11px] text-muted-foreground">live load balance · cost-aware</div>
            </div>
            <Cpu className="h-4 w-4 text-electric" />
          </div>
          <ul className="space-y-2.5">
            {PROVIDERS.map((p) => (
              <li key={p.name} className="rounded-xl bg-surface-2 px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground">{p.model}</div>
                  </div>
                  <div className="text-right text-[11px]">
                    <div className="font-mono">{p.cost}</div>
                    <div className="text-muted-foreground">{p.load}% load</div>
                  </div>
                </div>
                <div className="mt-2 h-1 rounded-full bg-surface-3 overflow-hidden">
                  <div className="h-full ai-gradient-bg" style={{ width: `${p.load}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="text-sm font-medium">Routing policy</div>
          <div className="text-[11px] text-muted-foreground mb-3">declarative · evaluated per task</div>
          <pre className="rounded-xl bg-surface-2 border border-border p-3 text-[11px] font-mono leading-relaxed overflow-x-auto">
{`route "ui.*"        → claude.opus  | gpt.5    weight=0.6/0.4
route "ast.merge.*" → claude.opus  budget=$0.40/task
route "tests.*"     → gemini.pro   | deepseek weight=0.7/0.3
route "ops.*"       → gpt.5.mini   max_retries=2
fallback            → local.llama  reason="cost-cap-hit"
`}
          </pre>
          <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
            <div className="rounded-lg bg-surface-2 px-2 py-1.5"><div className="text-muted-foreground">avg cost / task</div><div className="font-mono mt-0.5">$0.18</div></div>
            <div className="rounded-lg bg-surface-2 px-2 py-1.5"><div className="text-muted-foreground">p95 latency</div><div className="font-mono mt-0.5">1.42s</div></div>
            <div className="rounded-lg bg-surface-2 px-2 py-1.5"><div className="text-muted-foreground">cache hit</div><div className="font-mono mt-0.5">71%</div></div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
