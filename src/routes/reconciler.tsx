import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { GitMerge, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/reconciler")({
  head: () => ({ meta: [{ title: "Reconciler — Vanij" }, { name: "description", content: "AST patch merging via tree-sitter and atomic commit pipeline." }]}),
  component: ReconcilerPage,
});

const DIFF = [
  { t: " ", l: "export function AgentCard({ a }: { a: Agent }) {" },
  { t: "-", l: "  const ctx = Math.round((a.tokens / 200000) * 100);" },
  { t: "+", l: "  const ctxPct = Math.min(100, Math.round((a.tokens / 200_000) * 100));" },
  { t: " ", l: "  return (" },
  { t: "-", l: "    <div className=\"card p-4\">" },
  { t: "+", l: "    <motion.div whileHover={{ y: -2 }} className=\"glass rounded-2xl p-4\">" },
  { t: " ", l: "      …" },
  { t: " ", l: "    </motion.div>" },
  { t: " ", l: "  );" },
  { t: " ", l: "}" },
];

function ReconcilerPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="AST · tree-sitter · 3-way merge"
        title="Reconciler"
        description="Patches from parallel agents are merged at the AST level. Conflicts are resolved by symbol ownership and validated before commit."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 glass rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 h-11 border-b border-border">
            <div className="flex items-center gap-2 text-sm">
              <GitMerge className="h-3.5 w-3.5 text-electric" />
              <span className="font-mono">src/components/app/AgentCard.tsx</span>
              <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-md bg-success/15 text-success">AUTO-MERGED</span>
            </div>
            <div className="text-[11px] text-muted-foreground">frontend-α ▶ reconciler</div>
          </div>
          <pre className="p-0 font-mono text-[12px] leading-relaxed">
            {DIFF.map((d, i) => (
              <div key={i} className={`px-4 py-0.5 flex gap-3 ${d.t === "+" ? "bg-success/10" : d.t === "-" ? "bg-danger/10" : ""}`}>
                <span className={`w-3 ${d.t === "+" ? "text-success" : d.t === "-" ? "text-danger" : "text-muted-foreground"}`}>{d.t}</span>
                <span className="text-muted-foreground/60 w-6 text-right">{i + 1}</span>
                <span className="text-foreground/90 whitespace-pre">{d.l}</span>
              </div>
            ))}
          </pre>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <div className="text-sm font-medium mb-2">AST tree (symbols)</div>
            <pre className="font-mono text-[11px] text-foreground/85 leading-relaxed">
{`Program
├─ ImportDeclaration × 4
├─ ExportDeclaration
│  └─ FunctionDeclaration  AgentCard
│     ├─ Parameter         { a: Agent }
│     ├─ VariableDecl      ctxPct         ◆ patched
│     └─ ReturnStatement
│        └─ JSXElement     motion.div     ◆ patched
└─ EOF`}
            </pre>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="text-sm font-medium mb-3">Atomic commit pipeline</div>
            <ul className="space-y-2 text-xs">
              {["Parse with tree-sitter","Resolve owners via lease registry","3-way merge per AST node","Run validator on shadow branch","Atomic write · single commit"].map((s, i) => (
                <li key={s} className="flex items-center gap-2">
                  <span className={`h-5 w-5 rounded-full grid place-items-center text-[10px] font-semibold ${i < 4 ? "ai-gradient-bg text-background" : "bg-surface-2 text-muted-foreground"}`}>{i+1}</span>
                  <span className="flex-1">{s}</span>
                  {i < 4 && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
