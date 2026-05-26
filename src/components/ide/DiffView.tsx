import { motion } from "framer-motion";
import { GitMerge, Plus, Minus, Sparkles } from "lucide-react";

type Side = { kind: "ctx" | "add" | "del" | "hl"; line: string; n?: number; agent?: string };

const BEFORE: Side[] = [
  { kind: "ctx", n: 24, line: "export async function dispatchWave(wave: Wave) {" },
  { kind: "ctx", n: 25, line: "  const leases = await Lease.acquireAll(wave.symbols);" },
  { kind: "del", n: 26, line: "  const results = await Promise.all(" },
  { kind: "del", n: 27, line: "    wave.agents.map((a) => a.stream())" },
  { kind: "del", n: 28, line: "  );" },
  { kind: "ctx", n: 29, line: "  await Lease.releaseAll(leases);" },
  { kind: "ctx", n: 30, line: "  return results;" },
  { kind: "ctx", n: 31, line: "}" },
];

const AFTER: Side[] = [
  { kind: "ctx", n: 24, line: "export async function dispatchWave(wave: Wave) {" },
  { kind: "ctx", n: 25, line: "  const leases = await Lease.acquireAll(wave.symbols, { ttl: 60_000 });", agent: "Reconciler" },
  { kind: "add", n: 26, line: "  try {", agent: "Frontend-α" },
  { kind: "add", n: 27, line: "    const results = await Promise.all(wave.agents.map(async (a) => {", agent: "Frontend-α" },
  { kind: "add", n: 28, line: "      const patch = await a.stream({ tools: [\"ast.edit\"] });", agent: "Frontend-α" },
  { kind: "add", n: 29, line: "      if (patch.kind === \"conflict\") return reconcile(patch);", agent: "Reconciler" },
  { kind: "add", n: 30, line: "      return patch;", agent: "Frontend-α" },
  { kind: "add", n: 31, line: "    }));", agent: "Frontend-α" },
  { kind: "add", n: 32, line: "    await embedFailure({ wave, results });", agent: "Memory" },
  { kind: "add", n: 33, line: "    return results;", agent: "Frontend-α" },
  { kind: "add", n: 34, line: "  } finally {", agent: "Vanij" },
  { kind: "add", n: 35, line: "    await Lease.releaseAll(leases);", agent: "Vanij" },
  { kind: "add", n: 36, line: "  }", agent: "Vanij" },
  { kind: "ctx", n: 37, line: "}" },
];

const AGENT_COLOR: Record<string, string> = {
  "Frontend-α": "var(--electric)",
  "Reconciler": "var(--violet-glow)",
  "Memory":     "var(--pink-glow)",
  "Vanij":      "var(--success)",
};

function Column({ title, label, lines, side }: {
  title: string; label: string; lines: Side[]; side: "before" | "after";
}) {
  return (
    <div className="flex-1 min-w-0 flex flex-col border-r border-border last:border-r-0">
      <div className="h-8 px-3 flex items-center gap-2 border-b border-border bg-surface-1/40">
        <span className={`h-1.5 w-1.5 rounded-full ${side === "before" ? "bg-danger" : "bg-success"}`} />
        <span className="text-[11px] font-medium">{title}</span>
        <span className="text-[10px] text-muted-foreground font-mono">{label}</span>
      </div>
      <div className="flex-1 overflow-auto scrollbar-thin font-mono text-[12px] leading-[20px] py-2">
        {lines.map((l, i) => {
          const bg =
            l.kind === "add" ? "bg-success/8" :
            l.kind === "del" ? "bg-danger/10" : "";
          const marker =
            l.kind === "add" ? <Plus className="h-2.5 w-2.5 text-success" /> :
            l.kind === "del" ? <Minus className="h-2.5 w-2.5 text-danger" /> : null;
          return (
            <motion.div
              key={i}
              initial={l.kind === "add" || l.kind === "del" ? { opacity: 0, x: side === "after" ? 8 : -8 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className={`group flex items-start gap-1 px-2 ${bg}`}
            >
              <span className="select-none w-7 text-right pr-1 text-muted-foreground/50 tabular-nums">{l.n}</span>
              <span className="w-3 pt-1 shrink-0">{marker}</span>
              <span className={`flex-1 whitespace-pre ${
                l.kind === "del" ? "text-danger/90" : l.kind === "add" ? "text-foreground" : "text-foreground/70"
              }`}>{l.line}</span>
              {l.agent && (
                <span
                  className="opacity-0 group-hover:opacity-100 transition px-1.5 py-px rounded-md text-[9px] font-medium text-background whitespace-nowrap"
                  style={{ background: AGENT_COLOR[l.agent] ?? "var(--electric)" }}
                >
                  {l.agent}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function DiffView({ path }: { path: string }) {
  return (
    <div className="h-full flex flex-col bg-background/40">
      <div className="h-9 px-3 flex items-center gap-2 border-b border-border bg-surface-1/40">
        <div className="h-5 w-5 rounded-md bg-violet-glow/15 grid place-items-center">
          <GitMerge className="h-3 w-3 text-violet-glow" />
        </div>
        <span className="text-[12px] font-medium">3-way reconciler merge</span>
        <span className="font-mono text-[10.5px] text-muted-foreground truncate">{path}</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded-md bg-success/15 text-success text-[9.5px] font-medium">+11</span>
          <span className="px-1.5 py-0.5 rounded-md bg-danger/15 text-danger text-[9.5px] font-medium">−3</span>
          <span className="px-1.5 py-0.5 rounded-md bg-surface-2 text-muted-foreground text-[9.5px] font-mono">0 conflicts</span>
          <button className="ml-2 h-6 px-2 rounded-md ai-gradient-bg text-background text-[10.5px] font-medium flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Accept merge
          </button>
        </span>
      </div>
      <div className="flex-1 min-h-0 flex">
        <Column title="Before" label="main · 32 LOC"   lines={BEFORE} side="before" />
        <Column title="After"  label="wave-3 · merged" lines={AFTER}  side="after" />
      </div>
    </div>
  );
}
