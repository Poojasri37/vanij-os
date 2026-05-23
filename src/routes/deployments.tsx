import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { Rocket, Globe, CheckCircle2, Activity } from "lucide-react";

export const Route = createFileRoute("/deployments")({
  head: () => ({ meta: [{ title: "Deployments — Vanij" }, { name: "description", content: "Edge deployments across regions." }]}),
  component: DeploymentsPage,
});

const ENVS = [
  { env: "Production · edge",  region: "global · 26 PoPs", status: "healthy",  ver: "7.2.0", rps: "12.4k", lat: "38ms" },
  { env: "Staging",             region: "us-east-1",        status: "healthy",  ver: "7.2.1-rc", rps: "428",   lat: "42ms" },
  { env: "Preview · wave-3",    region: "us-west-2",        status: "deploying",ver: "wave-3",   rps: "—",     lat: "—"   },
];

const REGIONS = [
  { r: "us-east", load: 82 }, { r: "us-west", load: 64 }, { r: "eu-west", load: 71 },
  { r: "eu-central", load: 54 }, { r: "ap-south", load: 38 }, { r: "ap-east", load: 47 },
  { r: "sa-east", load: 22 }, { r: "af-south", load: 18 },
];

function DeploymentsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Edge · 26 PoPs"
        title="Deployments"
        description="Every reconciled commit ships to the edge in seconds. Health, latency, and cost are tracked per region."
        actions={
          <button className="h-9 px-3.5 rounded-xl ai-gradient-bg text-background text-xs font-medium flex items-center gap-2 glow-electric">
            <Rocket className="h-3.5 w-3.5" /> Promote to production
          </button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-3">
          {ENVS.map((e) => (
            <div key={e.env} className="glass rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <span className={`h-9 w-9 rounded-xl grid place-items-center ${e.status === "healthy" ? "bg-success/15 text-success" : "bg-electric/15 text-electric"}`}>
                  {e.status === "healthy" ? <CheckCircle2 className="h-4 w-4" /> : <Activity className="h-4 w-4 animate-pulse" />}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{e.env}</div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2"><Globe className="h-3 w-3"/>{e.region}</div>
                </div>
                <div className="ml-auto grid grid-cols-3 gap-3 text-[11px]">
                  <div><div className="text-muted-foreground">ver</div><div className="font-mono">{e.ver}</div></div>
                  <div><div className="text-muted-foreground">rps</div><div className="font-mono">{e.rps}</div></div>
                  <div><div className="text-muted-foreground">p50</div><div className="font-mono">{e.lat}</div></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="text-sm font-medium mb-3">Region load</div>
          <ul className="space-y-2.5">
            {REGIONS.map((r) => (
              <li key={r.r}>
                <div className="flex justify-between text-[11px]"><span>{r.r}</span><span className="font-mono text-muted-foreground">{r.load}%</span></div>
                <div className="mt-1 h-1 rounded-full bg-surface-3 overflow-hidden">
                  <div className="h-full ai-gradient-bg" style={{ width: `${r.load}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
