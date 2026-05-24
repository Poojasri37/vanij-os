import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Circle, FileCode2, Sparkles, GitBranch, Split, MoreHorizontal } from "lucide-react";
import { OPEN_TABS, EDITOR_LINES, AGENT_PRESENCE } from "@/lib/ide-mock";

const TOK_COLOR: Record<string, string> = {
  kw: "text-pink-glow",
  ty: "text-electric",
  fn: "text-violet-glow",
  str: "text-success",
  nm: "text-warning",
  cm: "text-muted-foreground italic",
  vr: "text-foreground/90",
};

export function EditorPane({ activePath, onTogglePreview, previewOpen }: {
  activePath: string; onTogglePreview: () => void; previewOpen: boolean;
}) {
  const [typed, setTyped] = useState(0);
  // simulate live streaming patch on last few lines
  useEffect(() => {
    const id = setInterval(() => setTyped((t) => (t + 1) % 80), 90);
    return () => clearInterval(id);
  }, [activePath]);

  const activeTab = OPEN_TABS.find((t) => t.path === activePath) ?? OPEN_TABS[0];

  return (
    <div className="h-full flex flex-col bg-background/40">
      {/* Tabs */}
      <div className="h-9 flex items-center border-b border-border bg-surface-1/40 backdrop-blur-xl">
        <div className="flex h-full">
          {OPEN_TABS.map((t) => {
            const active = t.path === activePath;
            return (
              <div
                key={t.path}
                className={`group relative h-full flex items-center gap-2 pl-3 pr-2 border-r border-border text-[12px] ${
                  active ? "bg-background/60 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-surface-2/40"
                }`}
              >
                <FileCode2 className="h-3.5 w-3.5 text-electric" />
                <span>{t.title}</span>
                {t.agent && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-md bg-surface-2 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                    <span className="inline-block h-1 w-1 rounded-full bg-electric mr-1 animate-pulse" />
                    {t.agent}
                  </span>
                )}
                <button className="opacity-0 group-hover:opacity-100 ml-1 text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
                {active && <span className="absolute left-0 right-0 top-0 h-[2px] ai-gradient-bg" />}
              </div>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-1 pr-2">
          <button
            onClick={onTogglePreview}
            className={`h-7 px-2.5 rounded-md text-[11px] flex items-center gap-1.5 border border-border ${
              previewOpen ? "bg-surface-2 text-foreground" : "bg-surface-2/40 text-muted-foreground hover:text-foreground"
            }`}
            title="Toggle live preview"
          >
            <Split className="h-3 w-3" /> Preview
          </button>
          <button className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-4 h-7 flex items-center gap-2 text-[11px] text-muted-foreground border-b border-border bg-background/30">
        <span>vanij-runtime</span><span className="opacity-40">/</span>
        <span>src</span><span className="opacity-40">/</span>
        <span>runtime</span><span className="opacity-40">/</span>
        <span className="text-foreground/90">{activeTab.title}</span>
        <span className="ml-auto flex items-center gap-3">
          <span className="flex items-center gap-1"><GitBranch className="h-3 w-3" /> wave-3/frontend-a</span>
          <span className="flex items-center gap-1"><Circle className="h-1.5 w-1.5 fill-success text-success" /> saved 2s ago</span>
        </span>
      </div>

      {/* Editor body */}
      <div className="relative flex-1 overflow-auto scrollbar-thin grid-bg">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(700px 280px at 70% -10%, color-mix(in oklab, var(--electric) 10%, transparent), transparent 60%)",
        }} />

        <pre className="relative font-mono text-[12.5px] leading-[22px] pt-4 pb-32 pl-4 pr-8 min-w-max">
          {EDITOR_LINES.map((line, i) => {
            const lineNo = i + 1;
            const presence = AGENT_PRESENCE.find((p) => p.line === lineNo);
            const isStreaming = lineNo === EDITOR_LINES.length; // last line "writing"
            return (
              <div key={i} className="relative flex">
                <span className="select-none w-10 shrink-0 text-right pr-3 text-muted-foreground/50">{lineNo}</span>
                <span className="relative">
                  {line.map((tok, j) => (
                    <span key={j} className={TOK_COLOR[tok.c ?? ""] ?? "text-foreground/85"}>{tok.t}</span>
                  ))}
                  {isStreaming && (
                    <>
                      <span className="text-foreground/85">{" "}// streaming patch from claude-opus-4.5…</span>
                      <span className="inline-block w-[7px] h-[14px] bg-electric align-middle ml-1 animate-pulse" />
                    </>
                  )}

                  {presence && (
                    <motion.span
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute -top-[2px] flex items-center"
                      style={{ left: `${presence.col * 7.6}px` }}
                    >
                      <span className="block w-[2px] h-[18px]" style={{ background: presence.color, boxShadow: `0 0 8px ${presence.color}` }} />
                      <span className="ml-1 mt-[-14px] px-1.5 py-0.5 rounded-md text-[9px] font-medium text-background whitespace-nowrap" style={{ background: presence.color }}>
                        {presence.name}
                      </span>
                    </motion.span>
                  )}
                </span>
              </div>
            );
          })}
        </pre>

        {/* Floating "ghost" suggestion (Copilot-style) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute bottom-5 right-5 max-w-sm glass-strong rounded-xl p-3 text-[11px]"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="h-3 w-3 text-electric" />
            <span className="text-foreground/90 font-medium">Vanij suggestion</span>
            <span className="ml-auto text-muted-foreground">⇥ accept</span>
          </div>
          <div className="text-muted-foreground">
            Wrap <span className="font-mono text-electric">dispatchWave</span> in a <span className="font-mono text-pink-glow">try/finally</span> to guarantee
            <span className="font-mono text-violet-glow"> releaseAll(leases)</span> on partial failure. Confidence <span className="text-success">94%</span>.
          </div>
        </motion.div>

        {/* Typing meter */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="font-mono">{typed.toString().padStart(2, "0")} tokens/s</span>
          <div className="flex-1 h-[2px] bg-surface-2 rounded-full overflow-hidden">
            <div className="h-full ai-gradient-bg" style={{ width: `${(typed / 80) * 100}%` }} />
          </div>
          <span className="font-mono">claude-opus-4.5</span>
        </div>
      </div>
    </div>
  );
}
