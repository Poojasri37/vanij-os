import { Link, useRouterState } from "@tanstack/react-router";
import { NAV } from "@/lib/mock";
import {
  LayoutDashboard, Workflow, Bot, Network, KeyRound, GitMerge, ShieldCheck,
  BrainCircuit, GitBranch, Rocket, BookOpen, LineChart, Wallet, Settings,
  Sparkles,
} from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Workflow, Bot, Network, KeyRound, GitMerge, ShieldCheck,
  BrainCircuit, GitBranch, Rocket, BookOpen, LineChart, Wallet, Settings,
};

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden md:flex flex-col w-[248px] shrink-0 h-screen sticky top-0 border-r border-border bg-surface-1/40 backdrop-blur-xl">
      <div className="px-5 py-5 flex items-center gap-2.5">
        <div className="relative h-8 w-8 rounded-xl ai-gradient-bg grid place-items-center glow-electric">
          <Sparkles className="h-4 w-4 text-background" />
        </div>
        <div>
          <div className="text-[15px] font-semibold tracking-tight leading-none">Vanij</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">Runtime · v3.7</div>
        </div>
      </div>

      <div className="px-3 mt-1 mb-2">
        <div className="glass rounded-xl px-3 py-2.5 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <div className="text-xs">
            <div className="font-medium leading-none">Mesh online</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">8 agents · wave 3</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-2 space-y-5">
        {NAV.map((group) => (
          <div key={group.group}>
            <div className="px-3 mb-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{group.group}</div>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = ICONS[item.icon];
                const active = pathname === item.to;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all ${
                        active
                          ? "bg-surface-2 text-foreground shadow-[inset_0_0_0_1px_var(--border)]"
                          : "text-muted-foreground hover:text-foreground hover:bg-surface-2/60"
                      }`}
                    >
                      <span className={`relative flex h-6 w-6 items-center justify-center rounded-md ${active ? "ai-gradient-bg text-background" : "bg-surface-2 text-muted-foreground group-hover:text-foreground"}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="truncate">{item.label}</span>
                      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-electric glow-electric" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-3">
        <div className="glass rounded-xl p-3">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Monthly burn</span>
            <span className="text-foreground font-medium">$8,412</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-surface-3 overflow-hidden">
            <div className="h-full ai-gradient-bg" style={{ width: "62%" }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>62% of $13,500</span>
            <span className="text-success">on-pace</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
