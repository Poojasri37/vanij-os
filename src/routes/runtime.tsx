import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import ReactFlow, { Background, Controls, Handle, Position, MarkerType, type Edge, type Node, type NodeProps } from "reactflow";
import "reactflow/dist/style.css";
import { motion } from "framer-motion";
import { Sparkles, Plus, Pause } from "lucide-react";

export const Route = createFileRoute("/runtime")({
  head: () => ({ meta: [
    { title: "Runtime — Vanij" },
    { name: "description", content: "Distributed agent execution, task DAG and AST patch flow." },
  ]}),
  component: RuntimePage,
});

function AgentNode({ data }: NodeProps<{ label: string; status: string; tone: string; task: string }>) {
  const ring = {
    electric: "shadow-[0_0_24px_-4px_var(--electric)]",
    violet:   "shadow-[0_0_24px_-4px_var(--violet-glow)]",
    pink:     "shadow-[0_0_24px_-4px_var(--pink-glow)]",
    success:  "shadow-[0_0_24px_-4px_var(--success)]",
    warning:  "shadow-[0_0_24px_-4px_var(--warning)]",
  }[data.tone] ?? "";
  return (
    <div className={`glass-strong rounded-xl px-3 py-2.5 w-[200px] ${ring}`}>
      <Handle type="target" position={Position.Left} className="!bg-electric !w-1.5 !h-1.5 !border-0" />
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-md ai-gradient-bg grid place-items-center text-background text-[11px] font-semibold">{data.label[0]}</div>
        <div className="min-w-0">
          <div className="text-[12px] font-medium leading-none truncate">{data.label}</div>
          <div className="text-[10px] text-muted-foreground mt-1 truncate">{data.status}</div>
        </div>
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
      </div>
      <div className="mt-2 text-[10px] text-muted-foreground font-mono truncate">{data.task}</div>
      <div className="mt-2 h-1 rounded-full bg-surface-3 overflow-hidden">
        <div className="h-full ai-gradient-bg shimmer" style={{ width: "62%" }} />
      </div>
      <Handle type="source" position={Position.Right} className="!bg-electric !w-1.5 !h-1.5 !border-0" />
    </div>
  );
}

function PlanNode({ data }: NodeProps<{ label: string; sub: string }>) {
  return (
    <div className="glass-strong rounded-xl px-3 py-2.5 w-[180px] ai-border">
      <Handle type="target" position={Position.Left} className="!bg-violet-glow !w-1.5 !h-1.5 !border-0" />
      <div className="text-[10px] uppercase tracking-[0.18em] text-violet-glow">{data.sub}</div>
      <div className="text-sm font-medium mt-0.5">{data.label}</div>
      <Handle type="source" position={Position.Right} className="!bg-violet-glow !w-1.5 !h-1.5 !border-0" />
    </div>
  );
}

const nodeTypes = { agent: AgentNode, plan: PlanNode };

const nodes: Node[] = [
  { id: "plan", type: "plan", position: { x: 0, y: 200 }, data: { label: "Architect plan", sub: "Wave 3 · 12 tasks" } },
  { id: "dec",  type: "plan", position: { x: 240, y: 200 }, data: { label: "Task graph", sub: "DAG · depth 6" } },

  { id: "a1", type: "agent", position: { x: 520, y: 40 },  data: { label: "Frontend-α", status: "Coding · AppShell", tone: "electric", task: "src/components/app/**" }},
  { id: "a2", type: "agent", position: { x: 520, y: 140 }, data: { label: "Frontend-β", status: "Coding · CmdPalette", tone: "pink", task: "src/components/command/**" }},
  { id: "a3", type: "agent", position: { x: 520, y: 240 }, data: { label: "Reconciler", status: "AST merging", tone: "violet", task: "src/lib/ast/**" }},
  { id: "a4", type: "agent", position: { x: 520, y: 340 }, data: { label: "Validator", status: "tsc + eslint", tone: "success", task: "tests/**" }},
  { id: "a5", type: "agent", position: { x: 520, y: 440 }, data: { label: "Pipeline", status: "edge deploy", tone: "warning", task: "ops/**" }},

  { id: "merge", type: "plan", position: { x: 840, y: 200 }, data: { label: "AST reconcile", sub: "3-way merge" } },
  { id: "ci",    type: "plan", position: { x: 1080, y: 200 }, data: { label: "Validation", sub: "build · test" } },
  { id: "ship",  type: "plan", position: { x: 1300, y: 200 }, data: { label: "Edge deploy", sub: "ship" } },
];

const baseEdge = { animated: true, type: "smoothstep" as const, style: { stroke: "var(--electric)", strokeWidth: 1.4 }, markerEnd: { type: MarkerType.ArrowClosed, color: "var(--electric)" } };

const edges: Edge[] = [
  { id: "e1", source: "plan", target: "dec", ...baseEdge },
  { id: "e2", source: "dec", target: "a1", ...baseEdge },
  { id: "e3", source: "dec", target: "a2", ...baseEdge },
  { id: "e4", source: "dec", target: "a3", ...baseEdge, style: { stroke: "var(--violet-glow)", strokeWidth: 1.4 }},
  { id: "e5", source: "dec", target: "a4", ...baseEdge, style: { stroke: "var(--success)", strokeWidth: 1.4 }},
  { id: "e6", source: "dec", target: "a5", ...baseEdge, style: { stroke: "var(--warning)", strokeWidth: 1.4 }},
  { id: "e7", source: "a1", target: "merge", ...baseEdge },
  { id: "e8", source: "a2", target: "merge", ...baseEdge, style: { stroke: "var(--pink-glow)", strokeWidth: 1.4 }},
  { id: "e9", source: "a3", target: "merge", ...baseEdge, style: { stroke: "var(--violet-glow)", strokeWidth: 1.4 }},
  { id: "e10", source: "a4", target: "ci", ...baseEdge, style: { stroke: "var(--success)", strokeWidth: 1.4 }},
  { id: "e11", source: "a5", target: "ci", ...baseEdge, style: { stroke: "var(--warning)", strokeWidth: 1.4 }},
  { id: "e12", source: "merge", target: "ci", ...baseEdge },
  { id: "e13", source: "ci", target: "ship", ...baseEdge },
];

function RuntimePage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Runtime · live graph"
        title="Distributed execution mesh"
        description="Every node is a live agent or coordination primitive. Edges stream AST patches in real time."
        actions={
          <>
            <button className="h-9 px-3 rounded-xl border border-border bg-surface-2/60 hover:bg-surface-2 text-xs flex items-center gap-2">
              <Pause className="h-3.5 w-3.5" /> Freeze mesh
            </button>
            <button className="h-9 px-3.5 rounded-xl ai-gradient-bg text-background text-xs font-medium flex items-center gap-2 glow-electric">
              <Plus className="h-3.5 w-3.5" /> Spawn agent
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="xl:col-span-3 glass rounded-2xl overflow-hidden h-[640px] grid-bg">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
            panOnScroll
            zoomOnPinch
            nodesDraggable
            className="bg-transparent"
            defaultEdgeOptions={{ animated: true }}
          >
            <Background gap={28} size={1} color="var(--grid)" />
            <Controls className="!bg-surface-2 !border-border !rounded-lg !shadow-none" showInteractive={false} />
          </ReactFlow>
        </motion.div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-4">
            <div className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-electric" /> Wave 3 status
            </div>
            <div className="mt-3 space-y-2 text-xs">
              {[
                { l: "Plan",        v: 100, c: "var(--success)" },
                { l: "Decompose",   v: 100, c: "var(--success)" },
                { l: "Parallel",    v: 72,  c: "var(--electric)" },
                { l: "Reconcile",   v: 48,  c: "var(--violet-glow)" },
                { l: "Validate",    v: 18,  c: "var(--warning)" },
                { l: "Deploy",      v: 0,   c: "var(--muted-foreground)" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="flex justify-between text-[11px] text-muted-foreground"><span>{s.l}</span><span className="font-mono">{s.v}%</span></div>
                  <div className="h-1 rounded-full bg-surface-3 overflow-hidden mt-1">
                    <div className="h-full" style={{ width: `${s.v}%`, background: s.c }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-4">
            <div className="text-sm font-medium">Concurrency groups</div>
            <ul className="mt-3 space-y-2 text-xs">
              {[
                { g: "UI surfaces",  n: 3, conflicts: 0 },
                { g: "Server fns",   n: 2, conflicts: 1 },
                { g: "Memory/index", n: 1, conflicts: 0 },
                { g: "Ops/deploy",   n: 1, conflicts: 0 },
              ].map((c) => (
                <li key={c.g} className="flex items-center justify-between rounded-lg bg-surface-2 px-2.5 py-2">
                  <span>{c.g}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-muted-foreground">{c.n} ag</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${c.conflicts? "bg-warning/15 text-warning":"bg-success/15 text-success"}`}>{c.conflicts? `${c.conflicts} conflict`: "clean"}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-2xl p-4">
            <div className="text-sm font-medium">Streaming patches</div>
            <div className="mt-2 space-y-1.5 font-mono text-[11px]">
              {[
                ["+ src/runtime/graph.ts", "frontend-α"],
                ["~ src/lib/ast/merge.ts", "reconciler"],
                ["+ tests/agents.test.ts", "validator"],
                ["+ ops/edge.toml",        "pipeline"],
              ].map(([f,a]) => (
                <div key={f} className="flex justify-between gap-2">
                  <span className="truncate text-foreground/80">{f}</span>
                  <span className="text-electric">{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
