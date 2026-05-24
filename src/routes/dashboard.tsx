import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { StatCard } from "@/components/app/StatCard";
import { AgentCard } from "@/components/app/AgentCard";
import { ActivityFeed } from "@/components/app/ActivityFeed";
import { AGENTS, spark } from "@/lib/mock";
import { Bot, Layers, GitMerge, Coins, Cpu, ShieldCheck, Sparkles, Play } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart, Line, LineChart } from "recharts";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [
    { title: "Dashboard — Vanij" },
    { name: "description", content: "Live overview of the autonomous AI engineering runtime." },
  ]}),
  component: Dashboard,
});

const waveData = spark(40, 60, 40, 7).map((d, i) => ({
  i, tokens: d.v * 1200, latency: 30 + Math.sin(i/3)*8 + (d.v%6),
}));

const heatmap = Array.from({ length: 7 * 16 }, (_, i) => ({ i, v: Math.random() }));

function Dashboard() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Runtime overview · wave 3 of 4"
        title={<>Welcome back — the mesh shipped <span className="ai-gradient-text">12 patches</span> while you were away.</>}
        description="8 agents collaborating in parallel across 4 execution waves. Reconciler is healthy, validation is green, edge deploy in 02:14."
        actions={
          <>
            <button className="h-9 px-3 rounded-xl border border-border bg-surface-2/60 hover:bg-surface-2 text-xs flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-electric" /> Summarize wave
            </button>
            <button className="h-9 px-3.5 rounded-xl ai-gradient-bg text-background text-xs font-medium flex items-center gap-2 glow-electric">
              <Play className="h-3.5 w-3.5" /> Dispatch wave 4
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
        <StatCard label="Active agents"      value="8"       sub="of 24 capacity" delta={+12} tone="electric" seed={3}  icon={<Bot className="h-4 w-4" />} />
        <StatCard label="Parallel waves"     value="4"       sub="depth 6"        delta={+8}  tone="violet"   seed={5}  icon={<Layers className="h-4 w-4" />} />
        <StatCard label="Tokens / hr"        value="2.41M"   sub="14.2k tok/s"    delta={+18} tone="pink"     seed={11} icon={<Cpu className="h-4 w-4" />} />
        <StatCard label="Spend / day"        value="$842"    sub="$13,540 / mo"   delta={-4}  tone="warning"  seed={13} icon={<Coins className="h-4 w-4" />} />
        <StatCard label="Build success"      value="98.2%"   sub="last 200 runs"  delta={+2}  tone="success"  seed={17} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="AST merge / min"    value="36"      sub="0 conflicts"    delta={+22} tone="electric" seed={23} icon={<GitMerge className="h-4 w-4" />} />
      </div>

      <div className="mt-4 md:mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.05}} className="glass rounded-2xl p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-medium">Throughput & latency · last 60m</div>
              <div className="text-[11px] text-muted-foreground">tokens streamed across the mesh</div>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-3 rounded-sm bg-electric" /> tokens</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-3 rounded-sm bg-violet-glow" /> latency</span>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer>
              <AreaChart data={waveData}>
                <defs>
                  <linearGradient id="gTok" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--electric)" stopOpacity={0.5}/>
                    <stop offset="100%" stopColor="var(--electric)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gLat" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--violet-glow)" stopOpacity={0.45}/>
                    <stop offset="100%" stopColor="var(--violet-glow)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--grid)" vertical={false} />
                <XAxis dataKey="i" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 11 }} />
                <Area type="monotone" dataKey="tokens"  stroke="var(--electric)"    strokeWidth={1.8} fill="url(#gTok)" />
                <Area type="monotone" dataKey="latency" stroke="var(--violet-glow)" strokeWidth={1.8} fill="url(#gLat)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-medium">Failure heatmap</div>
              <div className="text-[11px] text-muted-foreground">last 7 days · by hour band</div>
            </div>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">−18%</span>
          </div>
          <div className="grid grid-cols-16 gap-1" style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}>
            {heatmap.map((c) => (
              <div
                key={c.i}
                className="aspect-square rounded-[3px]"
                style={{
                  background: `color-mix(in oklab, var(--danger) ${Math.round(c.v*80)}%, var(--surface-2))`,
                  opacity: 0.35 + c.v * 0.65,
                }}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </motion.div>
      </div>

      <div className="mt-4 md:mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium">Active agents</h2>
            <a href="/agents" className="text-[11px] text-muted-foreground hover:text-foreground">View all →</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AGENTS.slice(0, 4).map((a) => <AgentCard key={a.id} a={a} />)}
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-5">
              <div className="text-sm font-medium mb-3">Cost by provider · 24h</div>
              <div className="h-44">
                <ResponsiveContainer>
                  <BarChart data={[
                    { name: "Claude",   v: 312 },
                    { name: "GPT",      v: 284 },
                    { name: "Gemini",   v: 142 },
                    { name: "DeepSeek", v: 68 },
                    { name: "Local",    v: 36 },
                  ]}>
                    <CartesianGrid stroke="var(--grid)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false}/>
                    <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 11 }} />
                    <Bar dataKey="v" radius={[6,6,0,0]} fill="url(#barG)" />
                    <defs>
                      <linearGradient id="barG" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="var(--electric)" />
                        <stop offset="100%" stopColor="var(--violet-glow)" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass rounded-2xl p-5">
              <div className="text-sm font-medium mb-3">Learning loop effectiveness</div>
              <div className="h-44">
                <ResponsiveContainer>
                  <LineChart data={spark(24, 50, 30, 41).map((d,i)=>({i, fix: 30 + d.v*0.7, repeat: 90 - d.v*0.8}))}>
                    <CartesianGrid stroke="var(--grid)" vertical={false} />
                    <XAxis dataKey="i" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false}/>
                    <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 11 }} />
                    <Line type="monotone" dataKey="fix"    stroke="var(--success)"    strokeWidth={1.8} dot={false}/>
                    <Line type="monotone" dataKey="repeat" stroke="var(--pink-glow)" strokeWidth={1.8} dot={false}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                <span><span className="inline-block h-1.5 w-3 rounded-sm bg-success mr-1.5"/>auto-fixes applied</span>
                <span><span className="inline-block h-1.5 w-3 rounded-sm bg-pink-glow mr-1.5"/>repeat failures</span>
              </div>
            </div>
          </div>
        </div>

        <ActivityFeed />
      </div>
    </AppShell>
  );
}
