import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { spark } from "@/lib/mock";
import { Coins, TrendingUp, Sparkles } from "lucide-react";

export const Route = createFileRoute("/billing")({
  head: () => ({ meta: [{ title: "Billing — Vanij" }, { name: "description", content: "Token economics and cost observability for the mesh." }]}),
  component: BillingPage,
});

const burn = spark(30, 280, 120, 71).map((d,i)=>({d:`d${i+1}`, v: d.v}));

const PROVIDERS = [
  { name: "Anthropic · Claude Opus 4.5", spend: 3_142, tokens: "1.01M", color: "var(--violet-glow)", w: 38 },
  { name: "OpenAI · GPT-5.1",            spend: 2_408, tokens: "1.20M", color: "var(--electric)",    w: 29 },
  { name: "Google · Gemini 2.5 Pro",     spend: 1_422, tokens: "780k",  color: "var(--pink-glow)",   w: 17 },
  { name: "DeepSeek V3.2",               spend:   682, tokens: "1.62M", color: "var(--success)",     w: 9 },
  { name: "Local · Llama 3.3 70B",       spend:     0, tokens: "412k",  color: "var(--muted-foreground)", w: 7 },
];

function BillingPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Token economics · enterprise"
        title="Billing & cost observability"
        description="Every cent flowing through the mesh — by agent, by model, by region. Forecasts update with each wave."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-medium">Burn rate · last 30 days</div>
              <div className="text-[11px] text-muted-foreground">forecasted MTD <span className="text-foreground font-mono">$13,540</span> · budget <span className="text-foreground font-mono">$18,000</span></div>
            </div>
            <div className="text-[11px] font-mono text-success inline-flex items-center gap-1.5"><TrendingUp className="h-3 w-3"/>under budget</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={burn}>
                <defs>
                  <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--electric)" stopOpacity={0.55}/>
                    <stop offset="100%" stopColor="var(--electric)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--grid)" vertical={false}/>
                <XAxis dataKey="d" tick={{ fontSize: 10, fill: "var(--muted-foreground)"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)"}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 11 }}/>
                <Area type="monotone" dataKey="v" stroke="var(--electric)" strokeWidth={1.8} fill="url(#bg)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="text-sm font-medium mb-3">Live spend</div>
          <div className="rounded-2xl p-5 ai-border bg-surface-2 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl opacity-40 ai-gradient-bg"/>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Today</div>
            <div className="mt-1 text-4xl font-semibold font-display ai-gradient-text">$842.14</div>
            <div className="mt-1 text-[11px] text-muted-foreground inline-flex items-center gap-1"><Coins className="h-3 w-3"/>across 8 agents</div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-lg bg-surface-3 px-2 py-1.5"><div className="text-muted-foreground">cost / build</div><div className="font-mono mt-0.5">$1.74</div></div>
              <div className="rounded-lg bg-surface-3 px-2 py-1.5"><div className="text-muted-foreground">cost / wave</div><div className="font-mono mt-0.5">$12.40</div></div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-electric/30 bg-electric/5 p-3 text-[11px]">
            <div className="inline-flex items-center gap-1.5 text-electric font-medium"><Sparkles className="h-3 w-3"/>Optimization</div>
            <div className="mt-1 text-foreground/85">Route 32% of <span className="font-mono">tests.*</span> from Claude → DeepSeek to save <span className="font-mono text-success">~$184/mo</span> with no quality regression.</div>
            <button className="mt-2 h-7 px-2.5 rounded-md ai-gradient-bg text-background text-[11px] font-medium">Apply policy</button>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 xl:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">Spend by provider · this cycle</div>
            <div className="text-[11px] text-muted-foreground">total <span className="font-mono text-foreground">$7,654</span></div>
          </div>
          <ul className="space-y-3">
            {PROVIDERS.map((p) => (
              <li key={p.name}>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{background: p.color}}/>{p.name}</span>
                  <span className="font-mono text-muted-foreground"><span className="text-foreground">${p.spend.toLocaleString()}</span> · {p.tokens} tok</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-surface-3 overflow-hidden">
                  <div className="h-full" style={{ width: `${p.w*2.6}%`, background: p.color }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
