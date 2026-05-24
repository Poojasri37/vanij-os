import { Link, useRouterState } from "@tanstack/react-router";
import { Files, Bot, Search, GitBranch, Play, Boxes, BrainCircuit, KeyRound, LineChart, Wallet, Settings, Sparkles, LayoutDashboard, Rocket, ShieldCheck } from "lucide-react";

const TOP = [
  { id: "explorer", label: "Explorer",  icon: Files },
  { id: "agents",   label: "Agents",    icon: Bot,           to: "/agents" },
  { id: "search",   label: "Search",    icon: Search },
  { id: "git",      label: "Branches",  icon: GitBranch },
  { id: "run",      label: "Run · Build", icon: Play },
  { id: "ext",      label: "Extensions",icon: Boxes },
];

const APPS = [
  { id: "dashboard",  label: "Dashboard",     icon: LayoutDashboard, to: "/dashboard" },
  { id: "runtime",    label: "Runtime graph", icon: Sparkles,        to: "/runtime" },
  { id: "memory",     label: "ESLL Memory",   icon: BrainCircuit,    to: "/memory" },
  { id: "leases",     label: "Leases",        icon: KeyRound,        to: "/leases" },
  { id: "validation", label: "Validation",    icon: ShieldCheck,     to: "/validation" },
  { id: "deploys",    label: "Deployments",   icon: Rocket,          to: "/deployments" },
  { id: "analytics",  label: "Analytics",     icon: LineChart,       to: "/analytics" },
  { id: "billing",    label: "Billing",       icon: Wallet,          to: "/billing" },
];

export function IDEActivityBar({
  active, onSelect,
}: { active: string; onSelect: (id: string) => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="w-12 shrink-0 h-full flex flex-col items-center border-r border-border bg-surface-1/60 backdrop-blur-xl">
      <Link to="/" className="mt-2.5 mb-2 h-8 w-8 rounded-xl ai-gradient-bg grid place-items-center glow-electric">
        <Sparkles className="h-3.5 w-3.5 text-background" />
      </Link>
      <div className="h-px w-6 bg-border my-1" />

      <div className="flex-1 flex flex-col items-center gap-0.5 py-2">
        {TOP.map((it) => {
          const Icon = it.icon;
          const isActive = it.to ? pathname === it.to : active === it.id;
          const inner = (
            <span className={`relative h-9 w-9 grid place-items-center rounded-lg transition ${
              isActive ? "text-foreground bg-surface-2 shadow-[inset_0_0_0_1px_var(--border)]" : "text-muted-foreground hover:text-foreground hover:bg-surface-2/60"
            }`}>
              <Icon className="h-4 w-4" />
              {isActive && <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r-full ai-gradient-bg" />}
            </span>
          );
          return it.to ? (
            <Link key={it.id} to={it.to} title={it.label}>{inner}</Link>
          ) : (
            <button key={it.id} title={it.label} onClick={() => onSelect(it.id)}>{inner}</button>
          );
        })}

        <div className="h-px w-6 bg-border my-2" />
        <div className="text-[8px] uppercase tracking-[0.18em] text-muted-foreground mb-1">apps</div>
        {APPS.map((it) => {
          const Icon = it.icon;
          const isActive = pathname === it.to;
          return (
            <Link key={it.id} to={it.to} title={it.label}>
              <span className={`relative h-9 w-9 grid place-items-center rounded-lg transition ${
                isActive ? "text-foreground bg-surface-2 shadow-[inset_0_0_0_1px_var(--border)]" : "text-muted-foreground hover:text-foreground hover:bg-surface-2/60"
              }`}>
                <Icon className="h-3.5 w-3.5" />
              </span>
            </Link>
          );
        })}
      </div>

      <button title="Settings" className="mb-2 h-9 w-9 grid place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2/60">
        <Settings className="h-4 w-4" />
      </button>
    </div>
  );
}
