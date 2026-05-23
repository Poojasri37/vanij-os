import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { spark } from "@/lib/mock";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Vanij" }, { name: "description", content: "Runtime, agent and cost analytics across the mesh." }]}),
  component: AnalyticsPage,
});

const flow = spark(40, 50, 30, 51).map((d,i)=>({i, v: d.v*1500}));
const pie = [
  { n: "Coding",    v: 48, c: "var(--electric)" },
  { n: "Reconcile", v: 22, c: "var(--violet-glow)" },
  { n: "Validate",  v: 18, c: "var(--success)" },
  { n: "Deploy",    v: 7,  c: "var(--warning)" },
  { n: "Memory",    v: 5,  c: "var(--pink-glow)" },
];
const bars = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => ({ d, builds: 80 + (i*13)%70, fails: (i*7)%10 }));

function AnalyticsPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Last 30 days" title="Analytics" description="Throughput, cost, and reliability across the entire engineering mesh." />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-medium">Token flow</div>
              <div className="text-[11px] text-muted-foreground">tokens / hour across all providers</div>
            </div>
            <div className="text-[11px] font-mono text-electric">+18% WoW</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={flow}>
                <defs>
                  <linearGradient id="ag" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--electric)" stopOpacity={0.6}/>
                    <stop offset="100%" stopColor="var(--violet-glow)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--grid)" vertical={false}/>
                <XAxis dataKey="i" tick={{ fontSize: 10, fill: "var(--muted-foreground)"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)"}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 11 }}/>
                <Area type="monotone" dataKey="v" stroke="var(--electric)" strokeWidth={1.8} fill="url(#ag)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="text-sm font-medium mb-3">Agent time mix</div>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pie} dataKey="v" nameKey="n" innerRadius={50} outerRadius={80} strokeWidth={0}>
                  {pie.map((p,i) => <Cell key={i} fill={p.c} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 11 }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-1.5 text-[11px]">
            {pie.map((p) => (
              <li key={p.n} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{background:p.c}}/><span className="text-muted-foreground">{p.n}</span><span className="ml-auto font-mono">{p.v}%</span></li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-2xl p-5 xl:col-span-3">
          <div className="text-sm font-medium mb-3">Builds vs failures · 7d</div>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={bars}>
                <CartesianGrid stroke="var(--grid)" vertical={false}/>
                <XAxis dataKey="d" tick={{ fontSize: 10, fill: "var(--muted-foreground)"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)"}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 11 }}/>
                <Bar dataKey="builds" radius={[6,6,0,0]} fill="var(--electric)" />
                <Bar dataKey="fails"  radius={[6,6,0,0]} fill="var(--danger)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
