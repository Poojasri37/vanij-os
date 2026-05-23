import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [{ title: "Planner — Vanij" }, { name: "description", content: "Repository DAG, decomposition, and ownership allocation." }]}),
  component: PlannerPage,
});

const WAVES = [
  { w: 1, tasks: ["parse repo", "build symbol table", "infer deps"] },
  { w: 2, tasks: ["design AppShell", "design CmdPalette", "design Runtime view"] },
  { w: 3, tasks: ["impl AppShell", "impl CmdPalette", "impl Runtime", "impl Reconciler", "impl Validator"] },
  { w: 4, tasks: ["AST merge", "lint/typecheck", "edge deploy"] },
];

const MATRIX = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => Math.random()));

function PlannerPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Planner · wave 3 of 4"
        title="Task decomposition & ownership"
        description="The planner builds a directed acyclic graph from the repository symbol table and assigns disjoint scopes to parallel agents."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium flex items-center gap-2"><Layers className="h-3.5 w-3.5 text-electric"/>Execution waves</div>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">DAG · depth 6 · 19 tasks</span>
          </div>

          <div className="space-y-5">
            {WAVES.map((wave, wi) => (
              <div key={wave.w} className="relative">
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Wave {wave.w}</div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {wave.tasks.map((t, i) => (
                    <motion.div
                      key={t}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: wi * 0.05 + i * 0.03 }}
                      className={`relative rounded-xl border border-border px-3 py-2.5 text-xs ${wave.w === 3 ? "bg-surface-2 ai-border" : wave.w < 3 ? "bg-surface-2/50 text-muted-foreground" : "bg-surface-2/30 text-muted-foreground"}`}
                    >
                      {t}
                      {wave.w === 3 && <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />}
                    </motion.div>
                  ))}
                </div>
                {wi < WAVES.length - 1 && (
                  <div className="my-3 ml-2 h-4 w-px bg-gradient-to-b from-electric/60 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <div className="text-sm font-medium">Dependency heatmap</div>
            <div className="text-[11px] text-muted-foreground mb-3">symbol × symbol coupling</div>
            <div className="grid gap-[3px]" style={{ gridTemplateColumns: "repeat(10, 1fr)" }}>
              {MATRIX.flat().map((v, i) => (
                <div key={i} className="aspect-square rounded-[2px]" style={{
                  background: `color-mix(in oklab, var(--violet-glow) ${Math.round(v*80)}%, var(--surface-2))`,
                  opacity: 0.3 + v * 0.7,
                }} />
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="text-sm font-medium mb-2">Ownership tree</div>
            <pre className="font-mono text-[11px] text-foreground/85 leading-relaxed">
{`src/
├─ components/      ◇ Frontend-α
│  ├─ app/          ◇ Frontend-α
│  └─ command/      ◆ Frontend-β
├─ lib/
│  └─ ast/          ◆ Reconciler
├─ server/          ◆ Architect
└─ tests/           ◆ Validator
ops/                ◆ Pipeline
esll/               ◆ Memory`}
            </pre>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
