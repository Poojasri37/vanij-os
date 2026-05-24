// Mock data for the Vanij runtime UI
export const AGENTS = [
  { id: "agt-01", name: "Architect", model: "Claude Opus 4.5", color: "violet", status: "thinking", task: "Decomposing repo graph", tokens: 142_300, retries: 0, scope: "src/server/**", branch: "wave-3/architect" },
  { id: "agt-02", name: "Frontend-α", model: "GPT-5.1", color: "electric", status: "coding", task: "Implementing AgentCard", tokens: 88_120, retries: 1, scope: "src/components/agents/**", branch: "wave-3/frontend-a" },
  { id: "agt-03", name: "Frontend-β", model: "Claude Sonnet 4.5", color: "pink", status: "coding", task: "Wiring command palette", tokens: 64_902, retries: 0, scope: "src/components/command/**", branch: "wave-3/frontend-b" },
  { id: "agt-04", name: "Reconciler", model: "DeepSeek V3.2", color: "electric", status: "merging", task: "AST 3-way merge", tokens: 39_440, retries: 2, scope: "src/lib/ast/**", branch: "wave-3/reconciler" },
  { id: "agt-05", name: "Validator", model: "Gemini 2.5 Pro", color: "success", status: "validating", task: "Lint + typecheck wave 3", tokens: 22_104, retries: 0, scope: "tests/**", branch: "wave-3/validator" },
  { id: "agt-06", name: "Memory", model: "Local Llama 3.3 70B", color: "violet", status: "indexing", task: "Embedding failure traces", tokens: 12_088, retries: 0, scope: "esll://*", branch: "—" },
  { id: "agt-07", name: "Pipeline", model: "GPT-5.1 mini", color: "warning", status: "deploying", task: "Edge worker rollout", tokens: 9_212, retries: 0, scope: "ops/**", branch: "wave-3/pipeline" },
  { id: "agt-08", name: "Doc-Smith", model: "Claude Haiku 4", color: "pink", status: "idle", task: "Awaiting handoff", tokens: 4_002, retries: 0, scope: "docs/**", branch: "—" },
];

export const LEASES = [
  { symbol: "AppShell", owner: "Frontend-α", ttl: 42, state: "active" },
  { symbol: "RuntimeGraph", owner: "Architect", ttl: 88, state: "active" },
  { symbol: "ASTMerger", owner: "Reconciler", ttl: 12, state: "active" },
  { symbol: "billingService.charge", owner: "Pipeline", ttl: 5, state: "expiring" },
  { symbol: "memory.embed", owner: "Memory", ttl: 120, state: "active" },
  { symbol: "validation.lint", owner: "Validator", ttl: 31, state: "active" },
  { symbol: "command.dispatch", owner: "Frontend-β", ttl: 76, state: "active" },
  { symbol: "deploy.edge", owner: "—", ttl: 0, state: "expired" },
];

export const NAV = [
  { group: "Workspace", items: [
    { to: "/", label: "IDE Workspace", icon: "Sparkles" },
    { to: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  ]},
  { group: "Runtime", items: [
    { to: "/runtime", label: "Runtime", icon: "Workflow" },
    { to: "/agents", label: "Agents", icon: "Bot" },
    { to: "/planner", label: "Planner", icon: "Network" },
  ]},
  { group: "Coordination", items: [
    { to: "/leases", label: "Lease Registry", icon: "KeyRound" },
    { to: "/reconciler", label: "Reconciler", icon: "GitMerge" },
    { to: "/validation", label: "Validation", icon: "ShieldCheck" },
    { to: "/memory", label: "ESLL Memory", icon: "BrainCircuit" },
  ]},
  { group: "Delivery", items: [
    { to: "/pipelines", label: "Pipelines", icon: "GitBranch" },
    { to: "/deployments", label: "Deployments", icon: "Rocket" },
    { to: "/knowledge", label: "Knowledge Base", icon: "BookOpen" },
  ]},
  { group: "Operations", items: [
    { to: "/analytics", label: "Analytics", icon: "LineChart" },
    { to: "/billing", label: "Billing", icon: "Wallet" },
    { to: "/settings", label: "Settings", icon: "Settings" },
  ]},
] as const;

export function spark(n = 24, base = 50, variance = 30, seed = 1) {
  let s = seed;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  return Array.from({ length: n }, (_, i) => ({ i, v: Math.max(2, base + (rand() - 0.5) * variance * 2) }));
}

export const ACTIVITY = [
  { t: "2s", agent: "Frontend-α", msg: "Patched <AgentCard/> — 14 LOC", kind: "ok" },
  { t: "5s", agent: "Reconciler", msg: "Resolved AST conflict in runtime.ts", kind: "ok" },
  { t: "11s", agent: "Validator", msg: "tsc — 0 errors, 0 warnings", kind: "ok" },
  { t: "18s", agent: "Pipeline", msg: "Edge worker deploy → us-east-1", kind: "info" },
  { t: "26s", agent: "Memory", msg: "Indexed 38 failure traces", kind: "info" },
  { t: "32s", agent: "Frontend-β", msg: "Retry 1/3 — lease contention", kind: "warn" },
  { t: "44s", agent: "Architect", msg: "Wave 4 plan generated (12 tasks)", kind: "ok" },
  { t: "1m", agent: "Validator", msg: "ESLint failed: 2 unused imports", kind: "err" },
  { t: "1m", agent: "Doc-Smith", msg: "Generated API reference for /agents", kind: "ok" },
];
