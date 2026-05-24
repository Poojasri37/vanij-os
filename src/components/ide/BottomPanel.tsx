import { useEffect, useRef, useState } from "react";
import { Terminal, AlertCircle, ListChecks, Activity, ChevronDown, X, Plus, Circle } from "lucide-react";
import { TERMINAL_FEED } from "@/lib/ide-mock";

const TABS = [
  { id: "terminal", label: "Terminal",   icon: Terminal, badge: "live" },
  { id: "build",    label: "Build",      icon: ListChecks, badge: "pass" },
  { id: "problems", label: "Problems",   icon: AlertCircle, badge: "0" },
  { id: "runtime",  label: "Runtime",    icon: Activity, badge: "8" },
];

export function BottomPanel({ onCollapse }: { onCollapse?: () => void }) {
  const [tab, setTab] = useState("terminal");
  const [lines, setLines] = useState(TERMINAL_FEED);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setLines((prev) => [...prev, TERMINAL_FEED[Math.floor(Math.random() * TERMINAL_FEED.length)]].slice(-80));
    }, 1500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { ref.current?.scrollTo({ top: 1e9 }); }, [lines]);

  return (
    <div className="h-full flex flex-col bg-background/60 backdrop-blur-xl">
      <div className="h-8 flex items-center border-b border-border">
        <div className="flex h-full">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative h-full px-3 flex items-center gap-1.5 text-[11px] border-r border-border ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{t.label}</span>
                <span className="ml-1 px-1 py-px rounded-sm bg-surface-2 text-[9px] font-mono text-foreground/70">{t.badge}</span>
                {active && <span className="absolute left-0 right-0 top-0 h-[2px] ai-gradient-bg" />}
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-1 pr-2">
          <button className="h-6 w-6 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2"><Plus className="h-3 w-3" /></button>
          <button onClick={onCollapse} className="h-6 w-6 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2"><ChevronDown className="h-3 w-3" /></button>
          <button className="h-6 w-6 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2"><X className="h-3 w-3" /></button>
        </div>
      </div>

      {tab === "terminal" && (
        <div ref={ref} className="flex-1 overflow-y-auto scrollbar-thin px-4 py-2 font-mono text-[11px] leading-[18px]">
          <div className="text-muted-foreground/70 mb-1">vanij ▸ runtime stream — wave 3 of 4 — 8 agents online</div>
          {lines.map((l, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-muted-foreground/50 w-12 shrink-0">{String(i).padStart(4, "0")}</span>
              <span className={`${l.c} shrink-0`}>{l.p}</span>
              <span className="text-foreground/80">{l.m}</span>
            </div>
          ))}
          <div className="flex gap-3">
            <span className="text-muted-foreground/50 w-12 shrink-0">{String(lines.length).padStart(4, "0")}</span>
            <span className="text-electric shrink-0">[vanij]</span>
            <span className="text-foreground/80">awaiting next event<span className="ml-1 inline-block w-[7px] h-3 bg-electric align-middle animate-pulse" /></span>
          </div>
        </div>
      )}

      {tab === "build" && (
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 font-mono text-[11px] space-y-1">
          <div className="text-success">✓ tsc — 0 errors, 0 warnings (2.1s)</div>
          <div className="text-success">✓ eslint — 142 files, 0 problems (0.9s)</div>
          <div className="text-success">✓ vitest — 18 passed, 0 failed (3.4s)</div>
          <div className="text-success">✓ vite build — 1.42 MB → 312 KB gz (8.8s)</div>
          <div className="text-electric">→ edge deploy — uploading worker (142 KB) to us-east-1, eu-west-1, ap-south-1</div>
          <div className="text-success">✓ deploy — 3 regions, 28ms cold start, healthy</div>
          <div className="text-muted-foreground">total · 18.2s · cache hit 64%</div>
        </div>
      )}

      {tab === "problems" && (
        <div className="flex-1 grid place-items-center text-[12px] text-muted-foreground">
          <div className="flex items-center gap-2"><Circle className="h-1.5 w-1.5 fill-success text-success" /> No problems — validator green across 142 files.</div>
        </div>
      )}

      {tab === "runtime" && (
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 grid grid-cols-2 gap-2 text-[11px]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass rounded-lg p-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">agt-0{i + 1}</span>
                <span className="text-[9px] uppercase tracking-[0.14em] text-success">healthy</span>
              </div>
              <div className="text-muted-foreground text-[10px]">cpu 12% · mem 84MB · tok/s {Math.floor(800 + Math.random() * 400)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
