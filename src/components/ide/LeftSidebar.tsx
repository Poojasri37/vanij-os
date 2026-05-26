import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, ChevronRight, Circle, Activity, Cpu, KeyRound, Zap,
  Gauge, Workflow, Bot, FolderTree, CheckCircle2, Loader2, AlertTriangle,
} from "lucide-react";
import { Explorer } from "./Explorer";
import { AGENTS, LEASES } from "@/lib/mock";

const STATUS_DOT: Record<string, string> = {
  thinking:   "bg-violet-glow",
  coding:     "bg-electric",
  merging:    "bg-pink-glow",
  validating: "bg-success",
  indexing:   "bg-violet-glow",
  deploying:  "bg-warning",
  idle:       "bg-muted-foreground/60",
};

function Section({
  id, title, icon: Icon, badge, defaultOpen = true, children, accent,
}: {
  id: string; title: string; icon: any; badge?: string; defaultOpen?: boolean;
  children: React.ReactNode; accent?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full h-8 px-3 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition"
      >
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        <Icon className="h-3 w-3" style={accent ? { color: accent } : undefined} />
        <span>{title}</span>
        {badge && (
          <span className="ml-auto font-mono text-[9px] tracking-normal px-1.5 py-px rounded-md bg-surface-2 text-foreground/70 normal-case">
            {badge}
          </span>
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AgentsPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="px-2 pb-2 space-y-1">
      {AGENTS.slice(0, 8).map((a, i) => {
        const dot = STATUS_DOT[a.status] ?? "bg-muted-foreground/60";
        const pulse = a.status === "coding" || a.status === "thinking" || a.status === "merging";
        const runtime = (i * 7 + tick) % 180;
        return (
          <div
            key={a.id}
            className="group relative rounded-lg px-2 py-1.5 hover:bg-surface-2/50 cursor-pointer transition"
          >
            <div className="flex items-center gap-2">
              <span className="relative h-5 w-5 rounded-md ai-gradient-bg grid place-items-center text-[9px] font-bold text-background shrink-0">
                {a.name.slice(0, 2).toUpperCase()}
                {pulse && <span className="absolute inset-0 rounded-md pulse-ring" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium truncate">{a.name}</span>
                  <span className={`h-1.5 w-1.5 rounded-full ${dot} ${pulse ? "animate-pulse" : ""}`} />
                </div>
                <div className="text-[10px] text-muted-foreground truncate">{a.task}</div>
              </div>
              <span className="font-mono text-[9px] text-muted-foreground tabular-nums shrink-0">{runtime}s</span>
            </div>
            <div className="mt-1 flex items-center gap-2 pl-7 text-[9px] text-muted-foreground">
              <span className="font-mono truncate">{a.branch}</span>
              <span className="ml-auto font-mono">{(a.tokens / 1000).toFixed(1)}k tok</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const PIPELINE = [
  { id: "plan",   label: "Planner",     status: "done",    icon: CheckCircle2 },
  { id: "w1",     label: "Wave 1",      status: "done",    icon: CheckCircle2 },
  { id: "rec",    label: "Reconciler",  status: "done",    icon: CheckCircle2 },
  { id: "w2",     label: "Wave 2",      status: "done",    icon: CheckCircle2 },
  { id: "w3",     label: "Wave 3",      status: "running", icon: Loader2 },
  { id: "val",    label: "Validator",   status: "queued",  icon: Circle },
  { id: "build",  label: "Final Build", status: "queued",  icon: Circle },
  { id: "dep",    label: "Deploy",      status: "queued",  icon: Circle },
];

function PipelinePanel() {
  return (
    <div className="px-3 pb-3 space-y-0.5">
      {PIPELINE.map((p, i) => {
        const Icon = p.icon;
        const isRun = p.status === "running";
        const isDone = p.status === "done";
        const isLast = i === PIPELINE.length - 1;
        return (
          <div key={p.id} className="relative flex items-center gap-2 py-1">
            {/* connector */}
            {!isLast && (
              <span
                className="absolute left-[7px] top-5 bottom-[-4px] w-px"
                style={{
                  background: isDone
                    ? "linear-gradient(180deg, var(--success), color-mix(in oklab, var(--success) 30%, transparent))"
                    : "color-mix(in oklab, var(--border) 80%, transparent)",
                }}
              />
            )}
            <span
              className={`relative z-10 h-3.5 w-3.5 grid place-items-center rounded-full shrink-0 ${
                isDone ? "bg-success/15 text-success"
                : isRun ? "bg-electric/20 text-electric"
                : "bg-surface-2 text-muted-foreground"
              }`}
            >
              <Icon className={`h-2.5 w-2.5 ${isRun ? "animate-spin" : ""}`} />
            </span>
            <span className={`text-[11px] ${isRun ? "text-foreground font-medium" : isDone ? "text-foreground/80" : "text-muted-foreground"}`}>
              {p.label}
            </span>
            {isRun && (
              <span className="ml-auto flex items-center gap-1 text-[9px] uppercase tracking-[0.16em] text-electric">
                <span className="h-1 w-1 rounded-full bg-electric animate-pulse" /> live
              </span>
            )}
            {isDone && <span className="ml-auto text-[9px] font-mono text-muted-foreground">✓</span>}
          </div>
        );
      })}
    </div>
  );
}

function Metric({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className="rounded-lg bg-surface-2/40 border border-border px-2 py-1.5">
      <div className="flex items-center gap-1 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
        <Icon className="h-2.5 w-2.5" style={color ? { color } : undefined} />
        <span>{label}</span>
      </div>
      <div className="mt-0.5 font-mono text-[13px] font-semibold tabular-nums">{value}</div>
      {sub && <div className="text-[9px] text-muted-foreground font-mono">{sub}</div>}
    </div>
  );
}

function MetricsPanel() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), 1500);
    return () => clearInterval(id);
  }, []);
  const tok = (14.2 + Math.sin(t / 3) * 1.4).toFixed(1);
  const activeLeases = LEASES.filter((l) => l.state === "active").length;
  return (
    <div className="px-3 pb-3 grid grid-cols-2 gap-1.5">
      <Metric icon={Bot}      label="agents"    value="8 / 8"        sub="all healthy" color="var(--electric)" />
      <Metric icon={Cpu}      label="tok/s"     value={`${tok}k`}    sub="claude opus" color="var(--violet-glow)" />
      <Metric icon={Activity} label="build"     value="18.2s"        sub="wave 3 / 4"  color="var(--pink-glow)" />
      <Metric icon={Gauge}    label="cache"     value="64%"          sub="hit rate"    color="var(--success)" />
      <Metric icon={KeyRound} label="leases"    value={`${activeLeases}`} sub="active"  color="var(--warning)" />
      <Metric icon={Zap}      label="speedup"   value="6.4×"         sub="vs serial"   color="var(--electric)" />
    </div>
  );
}

export function LeftSidebar({ active, onOpen }: { active: string; onOpen: (p: string) => void }) {
  return (
    <div className="h-full flex flex-col bg-surface-1/40 backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="px-3 h-9 flex items-center justify-between border-b border-border shrink-0">
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Workspace</div>
        <div className="flex items-center gap-1 text-[10px] text-success">
          <Circle className="h-1.5 w-1.5 fill-success text-success animate-pulse" /> wave-3 live
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin">
        <Section id="files" title="Files" icon={FolderTree} badge="142" accent="var(--electric)">
          <div className="max-h-[40vh] overflow-y-auto scrollbar-thin">
            <Explorer active={active} onOpen={onOpen} />
          </div>
        </Section>

        <Section id="agents" title="Agents" icon={Bot} badge="8 live" accent="var(--violet-glow)">
          <AgentsPanel />
        </Section>

        <Section id="pipeline" title="Build Pipeline" icon={Workflow} badge="3 / 8" accent="var(--pink-glow)">
          <PipelinePanel />
        </Section>

        <Section id="metrics" title="Live Metrics" icon={Activity} badge="rt" accent="var(--success)">
          <MetricsPanel />
        </Section>
      </div>

      <div className="border-t border-border px-3 h-7 flex items-center justify-between text-[10px] text-muted-foreground shrink-0">
        <span className="flex items-center gap-1.5">
          <AlertTriangle className="h-2.5 w-2.5 text-warning" /> 0 conflicts
        </span>
        <span className="font-mono text-foreground/70">+182 −24</span>
      </div>
    </div>
  );
}
