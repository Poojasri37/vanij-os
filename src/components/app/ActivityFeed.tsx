import { ACTIVITY } from "@/lib/mock";
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";

const ICON = {
  ok:   <CheckCircle2 className="h-3.5 w-3.5 text-success" />,
  warn: <AlertTriangle className="h-3.5 w-3.5 text-warning" />,
  err:  <AlertCircle className="h-3.5 w-3.5 text-danger" />,
  info: <Info className="h-3.5 w-3.5 text-electric" />,
};

export function ActivityFeed() {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-medium">Live activity</div>
          <div className="text-[11px] text-muted-foreground">streaming · all agents</div>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">wave 3</span>
      </div>
      <ul className="space-y-2.5 max-h-[360px] overflow-y-auto scrollbar-thin pr-1">
        {ACTIVITY.map((a, i) => (
          <li key={i} className="flex gap-3 text-xs">
            <div className="mt-0.5">{ICON[a.kind as keyof typeof ICON]}</div>
            <div className="min-w-0 flex-1">
              <div className="truncate"><span className="text-electric font-mono">{a.agent}</span> <span className="text-foreground/85">{a.msg}</span></div>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono shrink-0">{a.t}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
