// Mock data for the IDE workspace experience.

export type FileNode = {
  name: string;
  path: string;
  kind: "dir" | "file";
  ext?: string;
  agent?: string;          // currently editing
  status?: "edit" | "new" | "merged" | "lease";
  children?: FileNode[];
};

export const FILE_TREE: FileNode[] = [
  { name: "vanij-runtime", path: "/", kind: "dir", children: [
    { name: "src", path: "/src", kind: "dir", children: [
      { name: "agents", path: "/src/agents", kind: "dir", children: [
        { name: "architect.ts",  path: "/src/agents/architect.ts",  kind: "file", ext: "ts", agent: "Architect",  status: "edit" },
        { name: "reconciler.ts", path: "/src/agents/reconciler.ts", kind: "file", ext: "ts", agent: "Reconciler", status: "lease" },
        { name: "validator.ts",  path: "/src/agents/validator.ts",  kind: "file", ext: "ts" },
        { name: "memory.ts",     path: "/src/agents/memory.ts",     kind: "file", ext: "ts" },
      ]},
      { name: "runtime", path: "/src/runtime", kind: "dir", children: [
        { name: "dispatcher.ts", path: "/src/runtime/dispatcher.ts", kind: "file", ext: "ts", agent: "Frontend-α", status: "edit" },
        { name: "wave.ts",       path: "/src/runtime/wave.ts",       kind: "file", ext: "ts", status: "merged" },
        { name: "leases.ts",     path: "/src/runtime/leases.ts",     kind: "file", ext: "ts" },
      ]},
      { name: "ast", path: "/src/ast", kind: "dir", children: [
        { name: "merger.ts",     path: "/src/ast/merger.ts",     kind: "file", ext: "ts", agent: "Reconciler", status: "edit" },
        { name: "diff.ts",       path: "/src/ast/diff.ts",       kind: "file", ext: "ts" },
      ]},
      { name: "esll", path: "/src/esll", kind: "dir", children: [
        { name: "embed.ts",      path: "/src/esll/embed.ts",     kind: "file", ext: "ts", agent: "Memory", status: "edit" },
        { name: "cluster.ts",    path: "/src/esll/cluster.ts",   kind: "file", ext: "ts" },
      ]},
      { name: "index.ts",        path: "/src/index.ts",          kind: "file", ext: "ts" },
    ]},
    { name: "tests", path: "/tests", kind: "dir", children: [
      { name: "wave.test.ts",  path: "/tests/wave.test.ts",  kind: "file", ext: "ts", status: "new" },
      { name: "merger.test.ts",path: "/tests/merger.test.ts",kind: "file", ext: "ts" },
    ]},
    { name: "package.json",  path: "/package.json",  kind: "file", ext: "json" },
    { name: "tsconfig.json", path: "/tsconfig.json", kind: "file", ext: "json" },
    { name: "README.md",     path: "/README.md",     kind: "file", ext: "md" },
  ]},
];

export const OPEN_TABS = [
  { path: "/src/runtime/dispatcher.ts", title: "dispatcher.ts", agent: "Frontend-α" },
  { path: "/src/ast/merger.ts",         title: "merger.ts",     agent: "Reconciler" },
  { path: "/src/agents/architect.ts",   title: "architect.ts",  agent: "Architect" },
];

// Pre-tokenized "code" for the active editor — each item is one line of tokens.
type Tok = { t: string; c?: string };
export const EDITOR_LINES: Tok[][] = [
  [{ t: "import", c: "kw" }, { t: " { " }, { t: "Agent", c: "ty" }, { t: ", " }, { t: "Wave", c: "ty" }, { t: ", " }, { t: "Lease", c: "ty" }, { t: " } " }, { t: "from", c: "kw" }, { t: " " }, { t: "\"@/runtime/types\"", c: "str" }, { t: ";" }],
  [{ t: "import", c: "kw" }, { t: " { " }, { t: "reconcile", c: "fn" }, { t: " } " }, { t: "from", c: "kw" }, { t: " " }, { t: "\"@/ast/merger\"", c: "str" }, { t: ";" }],
  [{ t: "import", c: "kw" }, { t: " { " }, { t: "embedFailure", c: "fn" }, { t: " } " }, { t: "from", c: "kw" }, { t: " " }, { t: "\"@/esll/embed\"", c: "str" }, { t: ";" }],
  [{ t: "" }],
  [{ t: "// dispatch wave-3 across 8 parallel agents", c: "cm" }],
  [{ t: "export async", c: "kw" }, { t: " " }, { t: "function", c: "kw" }, { t: " " }, { t: "dispatchWave", c: "fn" }, { t: "(" }, { t: "wave", c: "vr" }, { t: ": " }, { t: "Wave", c: "ty" }, { t: ") {" }],
  [{ t: "  const", c: "kw" }, { t: " " }, { t: "leases", c: "vr" }, { t: " = " }, { t: "await", c: "kw" }, { t: " " }, { t: "Lease", c: "ty" }, { t: "." }, { t: "acquireAll", c: "fn" }, { t: "(wave.symbols, { ttl: " }, { t: "60_000", c: "nm" }, { t: " });" }],
  [{ t: "  const", c: "kw" }, { t: " " }, { t: "results", c: "vr" }, { t: " = " }, { t: "await", c: "kw" }, { t: " " }, { t: "Promise", c: "ty" }, { t: "." }, { t: "all", c: "fn" }, { t: "(wave.agents.map(" }, { t: "async", c: "kw" }, { t: " (" }, { t: "a", c: "vr" }, { t: ": " }, { t: "Agent", c: "ty" }, { t: ") => {" }],
  [{ t: "    const", c: "kw" }, { t: " " }, { t: "patch", c: "vr" }, { t: " = " }, { t: "await", c: "kw" }, { t: " " }, { t: "a", c: "vr" }, { t: "." }, { t: "stream", c: "fn" }, { t: "({ tools: [" }, { t: "\"ast.edit\"", c: "str" }, { t: ", " }, { t: "\"fs.read\"", c: "str" }, { t: "] });" }],
  [{ t: "    if", c: "kw" }, { t: " (patch.kind === " }, { t: "\"conflict\"", c: "str" }, { t: ") " }, { t: "return", c: "kw" }, { t: " " }, { t: "reconcile", c: "fn" }, { t: "(patch);" }],
  [{ t: "    return", c: "kw" }, { t: " patch;" }],
  [{ t: "  }));" }],
  [{ t: "" }],
  [{ t: "  // ESLL: persist trace for future waves", c: "cm" }],
  [{ t: "  await", c: "kw" }, { t: " " }, { t: "embedFailure", c: "fn" }, { t: "({ wave, results });" }],
  [{ t: "  await", c: "kw" }, { t: " " }, { t: "Lease", c: "ty" }, { t: "." }, { t: "releaseAll", c: "fn" }, { t: "(leases);" }],
  [{ t: "  return", c: "kw" }, { t: " results;" }],
  [{ t: "}" }],
];

export const COPILOT_THREAD = [
  { who: "user",  text: "Spawn wave 4 once reconciler is green. Target dispatcher.ts and the new lease registry.", t: "2m" },
  { who: "vanij", text: "Planning… decomposed into 9 tasks, 4 parallel lanes. Architect will own the DAG, Frontend-α + β will split UI, Reconciler holds the AST mutex.", t: "2m" },
  { who: "vanij", text: "Acquired lease on `dispatchWave` (ttl 60s). Streaming patch from Claude Opus 4.5…", t: "1m", tool: "lease.acquire" },
  { who: "user",  text: "Make sure ESLL traces are embedded before release.", t: "1m" },
  { who: "vanij", text: "Added `embedFailure({ wave, results })` before `releaseAll`. Tests passing locally — 18/18 ✓", t: "20s", tool: "esll.embed" },
];

export const AGENT_PRESENCE = [
  { name: "Frontend-α", color: "var(--electric)",    line: 7,  col: 22, model: "Claude Opus 4.5" },
  { name: "Reconciler", color: "var(--violet-glow)", line: 10, col: 18, model: "DeepSeek V3.2"  },
  { name: "Architect",  color: "var(--pink-glow)",   line: 15, col: 12, model: "GPT-5.1"        },
];

export const TERMINAL_FEED = [
  { c: "text-electric",    p: "[wave-3]",   m: "dispatch → 8 agents, depth 6, mutex=lease-registry" },
  { c: "text-violet-glow", p: "[reconciler]", m: "merge src/ast/merger.ts ← 3-way · 0 conflicts" },
  { c: "text-success",     p: "[validator]",  m: "tsc → 0 errors  ·  eslint → 0  ·  vitest → 18/18" },
  { c: "text-pink-glow",   p: "[frontend-α]", m: "wrote 142 LOC → src/runtime/dispatcher.ts (+18 −4)" },
  { c: "text-warning",     p: "[reconciler]", m: "retry 1/3 lease contention on AppShell" },
  { c: "text-success",     p: "[pipeline]",   m: "edge worker uploaded → us-east-1 · 142KB" },
  { c: "text-electric",    p: "[memory]",     m: "embedded 38 failure traces → cluster #441" },
  { c: "text-muted-foreground", p: "[runtime]", m: "preview hot-reloaded · 28ms" },
  { c: "text-success",     p: "[build]",      m: "PASS · 18.2s · cache hit 64%" },
];
