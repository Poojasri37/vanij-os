import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, Terminal, Circle } from "lucide-react";

const LINES = [
  { c: "text-electric",   t: "[architect]",  m: "plan: 12 tasks → 4 waves resolved (graph depth 6)" },
  { c: "text-violet-glow",t: "[frontend-α]", m: "lease(AppShell) acquired ttl=60s" },
  { c: "text-pink-glow",  t: "[frontend-β]", m: "patching src/components/command/CommandPalette.tsx" },
  { c: "text-success",    t: "[validator]",  m: "tsc → 0 errors  eslint → 0 warnings" },
  { c: "text-warning",    t: "[reconciler]", m: "AST 3-way merge: 2 conflicts auto-resolved" },
  { c: "text-electric",   t: "[memory]",     m: "embedded 38 failure traces → cluster #441" },
  { c: "text-muted-foreground", t: "[pipeline]", m: "edge worker uploaded · us-east-1 · 142KB" },
  { c: "text-success",    t: "[validator]",  m: "build: PASS in 18.2s" },
  { c: "text-violet-glow",t: "[architect]",  m: "wave 4 dispatched · 4 agents spawned" },
];

export function StreamingTerminal() {
  const [open, setOpen] = useState(true);
  const [lines, setLines] = useState<typeof LINES>(LINES);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => {
      setLines((prev) => {
        const next = [...prev, LINES[Math.floor(Math.random() * LINES.length)]];
        return next.slice(-60);
      });
    }, 1400);
    return () => clearInterval(id);
  }, [open]);

  useEffect(() => { ref.current?.scrollTo({ top: 1e9 }); }, [lines]);

  return (
    <div className="sticky bottom-0 z-20">
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 220 }}
            exit={{ height: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
            className="overflow-hidden border-t border-border bg-background/80 backdrop-blur-xl"
          >
            <div className="px-4 h-9 flex items-center gap-3 border-b border-border">
              <Terminal className="h-3.5 w-3.5 text-electric" />
              <span className="text-xs font-medium">runtime · stream</span>
              <div className="flex items-center gap-1.5 ml-2">
                <Circle className="h-1.5 w-1.5 fill-success text-success" />
                <span className="text-[10px] text-muted-foreground">live</span>
              </div>
              <button onClick={() => setOpen(false)} className="ml-auto text-[11px] text-muted-foreground hover:text-foreground">collapse</button>
            </div>
            <div ref={ref} className="h-[180px] overflow-y-auto scrollbar-thin px-4 py-2 font-mono text-[11px] leading-relaxed">
              {lines.map((l, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-muted-foreground/60 w-14">{String(i).padStart(4,"0")}</span>
                  <span className={l.c}>{l.t}</span>
                  <span className="text-foreground/80">{l.m}</span>
                </div>
              ))}
              <div className="flex gap-3"><span className="text-muted-foreground/60 w-14">{String(lines.length).padStart(4,"0")}</span><span className="text-electric">[runtime]</span><span className="text-foreground/80">awaiting next event<span className="ml-1 inline-block w-2 h-3 bg-electric align-middle animate-pulse" /></span></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <button onClick={() => setOpen(true)} className="w-full h-8 border-t border-border bg-background/80 backdrop-blur-xl flex items-center justify-center gap-2 text-[11px] text-muted-foreground hover:text-foreground">
          <ChevronUp className="h-3 w-3" /> open streaming terminal
        </button>
      )}
    </div>
  );
}
