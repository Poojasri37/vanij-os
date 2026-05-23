import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { BrainCircuit, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/memory")({
  head: () => ({ meta: [{ title: "ESLL Memory — Vanij" }, { name: "description", content: "Embedded semantic learning loop across agents." }]}),
  component: MemoryPage,
});

// Generate deterministic-ish points for the vector graph
const POINTS = Array.from({ length: 90 }, (_, i) => {
  const a = (i * 137.508) * (Math.PI / 180);
  const r = 30 + ((i * 7) % 70);
  return { i, x: 50 + Math.cos(a) * r * 0.5, y: 50 + Math.sin(a) * r * 0.5, c: i % 4 };
});

const COLORS = ["var(--electric)", "var(--violet-glow)", "var(--pink-glow)", "var(--success)"];

const CLUSTERS = [
  { id: 441, name: "Async race in lease release", n: 38, fix: "await release() before reassign", agents: 5 },
  { id: 318, name: "Hydration mismatch on Sidebar", n: 22, fix: "wrap with useId() + suspense", agents: 3 },
  { id: 207, name: "Tailwind class shadowing",     n: 17, fix: "promote token to design system", agents: 4 },
  { id: 102, name: "RLS bypass on profiles",       n: 11, fix: "scope query with auth.uid()", agents: 2 },
];

function MemoryPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="ESLL · Embedded Semantic Learning Loop"
        title="The mesh remembers."
        description="Every failure embedded, clustered, and retrieved. Fixes propagate across agents in milliseconds — the runtime gets smarter with every build."
        actions={
          <button className="h-9 px-3 rounded-xl border border-border bg-surface-2/60 text-xs flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-violet-glow" /> Inspect embeddings
          </button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 glass rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
          <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full blur-3xl opacity-40 ai-gradient-bg" />
          <div className="relative flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-medium"><BrainCircuit className="h-4 w-4 text-violet-glow"/>Failure embedding space</div>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">2,418 vectors · 4 clusters</span>
          </div>
          <div className="relative aspect-[16/9] w-full">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
              {POINTS.map((p, i) =>
                POINTS.slice(i + 1).map((q) => {
                  const d = Math.hypot(p.x - q.x, p.y - q.y);
                  if (d > 14 || p.c !== q.c) return null;
                  return <line key={`${p.i}-${q.i}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={COLORS[p.c]} strokeOpacity={0.18} strokeWidth={0.2} />;
                })
              )}
              {POINTS.map((p) => (
                <motion.circle
                  key={p.i}
                  cx={p.x} cy={p.y} r={0.9}
                  fill={COLORS[p.c]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.5, 1, 0.6] }}
                  transition={{ duration: 2 + (p.i % 5) * 0.4, repeat: Infinity, delay: p.i * 0.02 }}
                />
              ))}
            </svg>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-[11px]">
            {["lease-races","hydration","style-conflicts","security"].map((n, i) => (
              <span key={n} className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-muted-foreground">{n}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="text-sm font-medium mb-3">Top clusters</div>
          <ul className="space-y-2.5">
            {CLUSTERS.map((c) => (
              <li key={c.id} className="rounded-xl bg-surface-2 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{c.name}</div>
                  <span className="text-[10px] font-mono text-muted-foreground">#{c.id}</span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-1 truncate">fix · <span className="text-success">{c.fix}</span></div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{c.n} traces</span>
                  <span>shared by {c.agents} agents</span>
                </div>
                <div className="mt-1.5 h-1 rounded-full bg-surface-3 overflow-hidden">
                  <div className="h-full ai-gradient-bg" style={{ width: `${Math.min(100, c.n*2)}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
