import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Bot, ChevronRight, Send, Wrench, Paperclip, AtSign, Zap, Activity } from "lucide-react";
import { COPILOT_THREAD, AGENT_PRESENCE } from "@/lib/ide-mock";
import { AGENTS } from "@/lib/mock";

const MODES = ["Agent", "Ask", "Plan", "Build"];
const MODELS = ["Claude Opus 4.5", "GPT-5.1", "Gemini 2.5 Pro", "DeepSeek V3.2", "Local Llama 3.3"];

export function CopilotPanel() {
  const [mode, setMode] = useState("Agent");
  const [model, setModel] = useState(MODELS[0]);

  return (
    <div className="h-full flex flex-col bg-surface-1/40 backdrop-blur-xl">
      {/* Header */}
      <div className="px-3 h-9 flex items-center gap-2 border-b border-border">
        <div className="h-5 w-5 rounded-md ai-gradient-bg grid place-items-center">
          <Sparkles className="h-3 w-3 text-background" />
        </div>
        <div className="text-[12px] font-medium">Vanij Copilot</div>
        <span className="ml-auto text-[10px] text-muted-foreground">8 agents · wave 3</span>
      </div>

      {/* Mode pills */}
      <div className="px-3 py-2 flex items-center gap-1 border-b border-border">
        {MODES.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`h-6 px-2 rounded-md text-[10.5px] font-medium tracking-tight transition ${
              mode === m ? "ai-gradient-bg text-background" : "text-muted-foreground hover:text-foreground hover:bg-surface-2/60"
            }`}
          >
            {m}
          </button>
        ))}
        <select
          value={model} onChange={(e) => setModel(e.target.value)}
          className="ml-auto h-6 max-w-[140px] truncate rounded-md bg-surface-2 border border-border text-[10.5px] px-1.5 text-foreground/85 focus:outline-none focus:ring-1 focus:ring-electric"
        >
          {MODELS.map((m) => <option key={m}>{m}</option>)}
        </select>
      </div>

      {/* Active agents strip */}
      <div className="px-3 py-2 border-b border-border">
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Live agents</div>
          <span className="text-[10px] text-success flex items-center gap-1"><span className="h-1 w-1 rounded-full bg-success animate-pulse" /> streaming</span>
        </div>
        <div className="space-y-1">
          {AGENT_PRESENCE.map((a) => (
            <div key={a.name} className="flex items-center gap-2 text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: a.color }} />
              <span className="font-medium">{a.name}</span>
              <span className="text-muted-foreground truncate">· editing line {a.line}</span>
              <span className="ml-auto font-mono text-[10px] text-muted-foreground">{a.model.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Thread */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-3">
        {COPILOT_THREAD.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex gap-2 ${msg.who === "user" ? "" : ""}`}
          >
            <div className={`h-6 w-6 shrink-0 rounded-md grid place-items-center ${
              msg.who === "vanij" ? "ai-gradient-bg" : "bg-surface-2 border border-border"
            }`}>
              {msg.who === "vanij" ? <Sparkles className="h-3 w-3 text-background" /> : <span className="text-[10px] font-semibold">VN</span>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-0.5">
                <span className="font-medium text-foreground/90">{msg.who === "vanij" ? "Vanij" : "You"}</span>
                <span>·</span><span>{msg.t}</span>
                {msg.tool && (
                  <span className="ml-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-surface-2 border border-border font-mono text-[9px] text-electric">
                    <Wrench className="h-2.5 w-2.5" /> {msg.tool}
                  </span>
                )}
              </div>
              <div className="text-[12px] leading-relaxed text-foreground/90">{msg.text}</div>
            </div>
          </motion.div>
        ))}

        {/* Streaming bubble */}
        <div className="flex gap-2">
          <div className="h-6 w-6 shrink-0 rounded-md ai-gradient-bg grid place-items-center">
            <Sparkles className="h-3 w-3 text-background" />
          </div>
          <div className="glass rounded-xl px-3 py-2">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Activity className="h-3 w-3 text-electric animate-pulse" />
              <span>Architect is generating wave-4 plan</span>
              <span className="ml-1 flex gap-0.5">
                <span className="h-1 w-1 rounded-full bg-electric animate-bounce [animation-delay:-0.2s]" />
                <span className="h-1 w-1 rounded-full bg-electric animate-bounce [animation-delay:-0.1s]" />
                <span className="h-1 w-1 rounded-full bg-electric animate-bounce" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Composer */}
      <div className="p-2.5 border-t border-border">
        <div className="rounded-xl border border-border bg-background/60 focus-within:ring-1 focus-within:ring-electric">
          <textarea
            rows={2}
            placeholder="Ask Vanij to refactor, plan wave 4, or @mention an agent…"
            className="w-full bg-transparent text-[12px] px-3 py-2 resize-none focus:outline-none placeholder:text-muted-foreground"
          />
          <div className="flex items-center gap-1 px-2 pb-2">
            <button className="h-6 w-6 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2"><AtSign className="h-3 w-3" /></button>
            <button className="h-6 w-6 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2"><Paperclip className="h-3 w-3" /></button>
            <button className="h-6 px-2 rounded-md text-[10px] text-muted-foreground hover:text-foreground hover:bg-surface-2 flex items-center gap-1">
              <Bot className="h-3 w-3" /> {AGENTS.length} agents
            </button>
            <button className="ml-auto h-7 px-3 rounded-md ai-gradient-bg text-background text-[11px] font-medium flex items-center gap-1.5 glow-electric">
              <Zap className="h-3 w-3" /> Dispatch
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[9.5px] text-muted-foreground px-1">
          <span>⏎ send · ⌘⇧⏎ background wave</span>
          <span className="flex items-center gap-1"><Send className="h-2.5 w-2.5" /> autonomous</span>
        </div>
      </div>
    </div>
  );
}
