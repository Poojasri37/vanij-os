import { useEffect, useState } from "react";
import { Bell, Command, Search, GitBranch, Cpu, Zap } from "lucide-react";
import { CommandPalette } from "./CommandPalette";

export function TopBar() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 h-14 border-b border-border bg-background/60 backdrop-blur-xl">
        <div className="h-full px-4 md:px-6 flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <GitBranch className="h-3.5 w-3.5" />
            <span className="font-mono">main</span>
            <span className="opacity-40">/</span>
            <span className="font-mono">wave-3</span>
            <span className="ml-2 px-1.5 py-0.5 rounded-md bg-success/15 text-success text-[10px] font-medium">SYNCED</span>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="ml-auto group flex items-center gap-2 rounded-xl border border-border bg-surface-2/60 hover:bg-surface-2 transition px-3 h-9 w-full max-w-md"
          >
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Run command, spawn agent, search logs…</span>
            <kbd className="ml-auto inline-flex items-center gap-0.5 rounded-md border border-border bg-surface-3 px-1.5 py-0.5 text-[10px] text-muted-foreground">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </button>

          <div className="hidden md:flex items-center gap-1.5 rounded-xl border border-border bg-surface-2/60 h-9 px-2.5">
            <Cpu className="h-3.5 w-3.5 text-electric" />
            <span className="text-[11px] text-muted-foreground">latency</span>
            <span className="text-xs font-mono">42ms</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 rounded-xl border border-border bg-surface-2/60 h-9 px-2.5">
            <Zap className="h-3.5 w-3.5 text-warning" />
            <span className="text-[11px] text-muted-foreground">tok/s</span>
            <span className="text-xs font-mono">14.2k</span>
          </div>

          <button className="relative h-9 w-9 grid place-items-center rounded-xl border border-border bg-surface-2/60 hover:bg-surface-2">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-pink-glow glow-violet" />
          </button>

          <div className="h-9 w-9 rounded-xl ai-gradient-bg grid place-items-center text-background font-semibold text-xs ai-border">VN</div>
        </div>
      </header>

      <CommandPalette open={open} onOpenChange={setOpen} />
    </>
  );
}
