import { motion } from "framer-motion";
import { Cpu, GitBranch, Coins } from "lucide-react";
import type { AGENTS } from "@/lib/mock";

type Agent = (typeof AGENTS)[number];

const STATUS: Record<string, { dot: string; label: string }> = {
  thinking:   { dot: "bg-violet-glow", label: "Thinking" },
  coding:     { dot: "bg-electric",    label: "Coding" },
  merging:    { dot: "bg-pink-glow",   label: "Merging" },
  validating: { dot: "bg-success",     label: "Validating" },
  indexing:   { dot: "bg-violet-glow", label: "Indexing" },
  deploying:  { dot: "bg-warning",     label: "Deploying" },
  idle:       { dot: "bg-muted-foreground", label: "Idle" },
};

export function AgentCard({ a, dense = false }: { a: Agent; dense?: boolean }) {
  const s = STATUS[a.status] ?? STATUS.idle;
  const ctxPct = Math.min(100, Math.round((a.tokens / 200_000) * 100));

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="relative glass rounded-2xl p-4 overflow-hidden"
    >
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-30 blur-3xl ai-gradient-bg pointer-events-none" />

      <div className="flex items-start gap-3">
        <div className="relative h-10 w-10 shrink-0 rounded-xl ai-gradient-bg grid place-items-center text-background font-semibold text-sm ai-border">
          {a.name[0]}
          {a.status !== "idle" && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success ring-2 ring-background pulse-ring" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="font-medium truncate">{a.name}</div>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-surface-3 text-muted-foreground font-mono">{a.id}</span>
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{a.model}</div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px]">
          <span className={`h-1.5 w-1.5 rounded-full ${s.dot} ${a.status !== "idle" ? "animate-pulse" : ""}`} />
          <span className="text-muted-foreground">{s.label}</span>
        </div>
      </div>

      <div className="mt-3 text-xs text-foreground/85 line-clamp-1">
        <span className="text-muted-foreground">task · </span>{a.task}
      </div>

      {!dense && (
        <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
          <div className="rounded-lg bg-surface-2 px-2 py-1.5">
            <div className="flex items-center gap-1 text-muted-foreground"><Coins className="h-3 w-3" />tokens</div>
            <div className="mt-0.5 font-mono">{(a.tokens/1000).toFixed(1)}k</div>
          </div>
          <div className="rounded-lg bg-surface-2 px-2 py-1.5">
            <div className="flex items-center gap-1 text-muted-foreground"><Cpu className="h-3 w-3" />retries</div>
            <div className="mt-0.5 font-mono">{a.retries}</div>
          </div>
          <div className="rounded-lg bg-surface-2 px-2 py-1.5">
            <div className="flex items-center gap-1 text-muted-foreground"><GitBranch className="h-3 w-3" />branch</div>
            <div className="mt-0.5 font-mono truncate">{a.branch.split("/").pop() ?? "—"}</div>
          </div>
        </div>
      )}

      <div className="mt-3">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
          <span>context window</span><span className="font-mono">{ctxPct}% · 200k</span>
        </div>
        <div className="h-1 rounded-full bg-surface-3 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${ctxPct}%` }} transition={{ duration: 0.8 }} className="h-full ai-gradient-bg" />
        </div>
      </div>

      <div className="mt-3 text-[10px] font-mono text-muted-foreground truncate">scope: {a.scope}</div>
    </motion.div>
  );
}
