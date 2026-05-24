import { useEffect, useState } from "react";
import { Command, Search, GitBranch, Cpu, Zap, Play, Bell, ChevronDown, Sparkles } from "lucide-react";
import { CommandPalette } from "@/components/app/CommandPalette";

export function IDETopBar() {
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
      <header className="h-10 shrink-0 flex items-center gap-2 px-2 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="flex items-center gap-2 pl-1.5 pr-3 border-r border-border h-full">
          <div className="text-[12px] font-semibold tracking-tight">Vanij</div>
          <span className="text-[10px] text-muted-foreground font-mono">workspace · vanij-runtime</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <GitBranch className="h-3 w-3" />
          <span className="font-mono">main</span>
          <span className="opacity-40">▸</span>
          <span className="font-mono text-foreground/85">wave-3</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-md bg-success/15 text-success text-[9.5px] font-medium">SYNCED</span>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="ml-auto group flex items-center gap-2 rounded-lg border border-border bg-surface-2/50 hover:bg-surface-2 transition px-2.5 h-7 w-full max-w-lg"
        >
          <Search className="h-3 w-3 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground truncate">Spawn agent, search code, jump to file, deploy…</span>
          <kbd className="ml-auto inline-flex items-center gap-0.5 rounded-md border border-border bg-surface-3 px-1.5 py-0.5 text-[10px] text-muted-foreground">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>

        <div className="hidden lg:flex items-center gap-1.5 rounded-lg border border-border bg-surface-2/50 h-7 px-2">
          <Cpu className="h-3 w-3 text-electric" />
          <span className="text-[10px] text-muted-foreground">latency</span>
          <span className="text-[11px] font-mono">42ms</span>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 rounded-lg border border-border bg-surface-2/50 h-7 px-2">
          <Zap className="h-3 w-3 text-warning" />
          <span className="text-[10px] text-muted-foreground">tok/s</span>
          <span className="text-[11px] font-mono">14.2k</span>
        </div>

        <button className="hidden md:flex items-center gap-1.5 h-7 px-2 rounded-lg border border-border bg-surface-2/50 hover:bg-surface-2 text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full bg-electric" />
          <span className="text-foreground/85">Claude Opus 4.5</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>

        <button className="h-7 px-2.5 rounded-lg ai-gradient-bg text-background text-[11px] font-medium flex items-center gap-1.5 glow-electric">
          <Play className="h-3 w-3 fill-background" /> Run
        </button>
        <button className="h-7 px-2.5 rounded-lg border border-border bg-surface-2/50 text-[11px] font-medium flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-electric" /> Dispatch wave
        </button>

        <button className="relative h-7 w-7 grid place-items-center rounded-lg border border-border bg-surface-2/50">
          <Bell className="h-3 w-3" />
          <span className="absolute top-1 right-1 h-1 w-1 rounded-full bg-pink-glow" />
        </button>
        <div className="h-7 w-7 rounded-lg ai-gradient-bg grid place-items-center text-background font-semibold text-[10px]">VN</div>
      </header>

      <CommandPalette open={open} onOpenChange={setOpen} />
    </>
  );
}
