import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { BookOpen, FileCode, Search } from "lucide-react";

export const Route = createFileRoute("/knowledge")({
  head: () => ({ meta: [{ title: "Knowledge Base — Vanij" }, { name: "description", content: "Indexed source-of-truth for agents." }]}),
  component: KBPage,
});

const DOCS = [
  { t: "Runtime architecture",  c: "How agents are dispatched into parallel waves and coordinated via Redis leases.", tags: ["runtime","redis","DAG"] },
  { t: "AST reconciliation",    c: "Tree-sitter based 3-way merge with symbol ownership.", tags: ["ast","reconciler"] },
  { t: "ESLL learning loop",    c: "Embedding failure traces, clustering, and propagating fixes across agents.", tags: ["memory","learning"] },
  { t: "Cost-aware routing",    c: "Declarative routing policies across Claude, GPT, Gemini, DeepSeek, local.", tags: ["agents","routing"] },
  { t: "Validation pipeline",   c: "Deterministic CI with auto-repair handoffs.", tags: ["ci","tests"] },
  { t: "Edge deploy lifecycle", c: "Atomic edge deploys with regional health gates.", tags: ["deploy","edge"] },
];

function KBPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Indexed · 12,408 docs · 218k chunks"
        title="Knowledge base"
        description="Every doc, ADR, and code comment indexed and retrievable by agents in real time."
      />

      <div className="glass rounded-2xl p-3 flex items-center gap-2 mb-4">
        <Search className="h-4 w-4 text-muted-foreground ml-1" />
        <input
          placeholder="Search architecture, runbooks, ADRs, code comments…"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground py-2"
        />
        <kbd className="text-[10px] text-muted-foreground border border-border rounded-md px-1.5 py-0.5">⌘ K</kbd>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {DOCS.map((d) => (
          <div key={d.t} className="glass rounded-2xl p-4 hover:bg-surface-2 transition cursor-pointer">
            <div className="flex items-center gap-2 text-electric">
              <BookOpen className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-[0.18em]">Doc</span>
            </div>
            <div className="mt-2 text-sm font-medium">{d.t}</div>
            <div className="mt-1 text-xs text-muted-foreground line-clamp-2">{d.c}</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {d.tags.map((t) => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-md bg-surface-2 text-muted-foreground font-mono">#{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 glass rounded-2xl p-5">
        <div className="flex items-center gap-2 text-sm font-medium"><FileCode className="h-4 w-4 text-violet-glow"/>Indexed sources</div>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            { l: "Markdown",  v: "4,218" },
            { l: "TypeScript",v: "6,902" },
            { l: "ADRs",      v: "318" },
            { l: "Runbooks",  v: "172" },
          ].map((x) => (
            <div key={x.l} className="rounded-xl bg-surface-2 p-3">
              <div className="text-muted-foreground">{x.l}</div>
              <div className="mt-1 text-lg font-semibold font-display">{x.v}</div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
