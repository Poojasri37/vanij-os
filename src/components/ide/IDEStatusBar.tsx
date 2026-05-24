import { GitBranch, Check, AlertTriangle, Bot, Activity, Wifi, Cpu } from "lucide-react";

export function IDEStatusBar() {
  return (
    <footer className="h-6 shrink-0 flex items-center gap-3 px-2.5 text-[10.5px] border-t border-border bg-surface-1/60 backdrop-blur-xl">
      <span className="flex items-center gap-1 text-success"><GitBranch className="h-3 w-3" /> wave-3/frontend-a</span>
      <span className="flex items-center gap-1 text-foreground/75"><Check className="h-3 w-3 text-success" /> 0 errors</span>
      <span className="flex items-center gap-1 text-muted-foreground"><AlertTriangle className="h-3 w-3 text-warning" /> 0 warnings</span>
      <span className="flex items-center gap-1 text-muted-foreground"><Bot className="h-3 w-3 text-electric" /> 8 agents online</span>
      <span className="flex items-center gap-1 text-muted-foreground"><Activity className="h-3 w-3 text-violet-glow" /> wave 3 / 4</span>

      <span className="ml-auto flex items-center gap-3 text-muted-foreground">
        <span className="flex items-center gap-1"><Cpu className="h-3 w-3 text-electric" /> 14.2k tok/s</span>
        <span className="flex items-center gap-1"><Wifi className="h-3 w-3 text-success" /> 42ms · us-east-1</span>
        <span className="font-mono">UTF-8</span>
        <span className="font-mono">TypeScript</span>
        <span className="font-mono">Ln 7, Col 22</span>
        <span className="text-electric">Vanij · v3.7</span>
      </span>
    </footer>
  );
}
