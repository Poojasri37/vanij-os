import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Vanij" }, { name: "description", content: "Runtime, agent, and workspace settings." }]}),
  component: SettingsPage,
});

const SECTIONS = [
  { title: "Runtime", items: [
    { name: "Max parallel agents", value: "24", desc: "Upper bound across all waves." },
    { name: "Default lease TTL",  value: "60s", desc: "Symbols auto-release after this duration." },
    { name: "Auto-spawn on plan", toggle: true, desc: "Dispatch agents the moment the planner emits a wave." },
  ]},
  { title: "Models", items: [
    { name: "Cost cap / task",   value: "$0.40", desc: "Hard ceiling applied before routing." },
    { name: "Fallback to local", toggle: true,  desc: "Drop to Llama 3.3 when budget is exhausted." },
    { name: "Caching",           toggle: true,  desc: "Reuse prompt prefixes across agents." },
  ]},
  { title: "Workspace", items: [
    { name: "SSO · SAML",     value: "okta", desc: "vanij.okta.com" },
    { name: "Audit log",      toggle: true,  desc: "Stream every action to SIEM." },
    { name: "Region",         value: "us-east-1", desc: "Control plane region." },
  ]},
];

function SettingsPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Workspace" title="Settings" description="Tune the runtime, routing policies, and workspace controls." />

      <div className="space-y-6">
        {SECTIONS.map((s) => (
          <div key={s.title} className="glass rounded-2xl p-5">
            <div className="text-sm font-medium mb-3">{s.title}</div>
            <ul className="divide-y divide-border">
              {s.items.map((it) => (
                <li key={it.name} className="py-3 flex items-center gap-4">
                  <div className="min-w-0">
                    <div className="text-sm">{it.name}</div>
                    <div className="text-[11px] text-muted-foreground">{it.desc}</div>
                  </div>
                  <div className="ml-auto">
                    {it.toggle !== undefined
                      ? <Switch defaultChecked={it.toggle} />
                      : <div className="rounded-lg border border-border bg-surface-2 px-2.5 py-1 text-xs font-mono">{it.value}</div>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
