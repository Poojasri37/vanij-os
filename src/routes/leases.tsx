import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { LEASES } from "@/lib/mock";
import { motion } from "framer-motion";
import { KeyRound, Clock, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/leases")({
  head: () => ({ meta: [{ title: "Lease Registry — Vanij" }, { name: "description", content: "Redis-backed symbol leases preventing concurrent edits." }]}),
  component: LeasesPage,
});

const TONE = {
  active:   { ring: "border-success/40",  dot: "bg-success",  label: "ACTIVE",   text: "text-success" },
  expiring: { ring: "border-warning/40",  dot: "bg-warning",  label: "EXPIRING", text: "text-warning" },
  expired:  { ring: "border-danger/40",   dot: "bg-danger",   label: "EXPIRED",  text: "text-danger" },
} as const;

function LeasesPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Coordination · Redis-backed"
        title="Lease registry"
        description="Every symbol an agent edits is held under a TTL lease. When TTLs expire or are released, ownership transfers to the next agent in queue."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { l: "Active leases", v: "7", c: "text-electric", i: <KeyRound className="h-4 w-4"/> },
          { l: "Expiring < 30s", v: "1", c: "text-warning", i: <Clock className="h-4 w-4"/> },
          { l: "Conflicts (24h)", v: "3", c: "text-pink-glow", i: <AlertTriangle className="h-4 w-4"/> },
          { l: "Avg TTL", v: "54s", c: "text-violet-glow", i: <Clock className="h-4 w-4"/> },
        ].map((s) => (
          <div key={s.l} className="glass rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{s.l}</div>
              <div className="mt-2 text-2xl font-semibold font-display">{s.v}</div>
            </div>
            <div className={`h-9 w-9 rounded-lg bg-surface-2 grid place-items-center ${s.c}`}>{s.i}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {LEASES.map((l, i) => {
          const t = TONE[l.state as keyof typeof TONE];
          const pct = l.ttl > 0 ? Math.min(100, (l.ttl / 120) * 100) : 0;
          return (
            <motion.div
              key={l.symbol}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`glass rounded-2xl p-4 border ${t.ring}`}
            >
              <div className="flex items-center justify-between">
                <div className="font-mono text-sm truncate">{l.symbol}</div>
                <span className={`inline-flex items-center gap-1.5 text-[10px] tracking-[0.16em] ${t.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${t.dot} animate-pulse`} />
                  {t.label}
                </span>
              </div>
              <div className="mt-2 text-[11px] text-muted-foreground">owner · <span className="text-foreground">{l.owner}</span></div>
              <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                <span>TTL</span><span className="font-mono">{l.ttl}s</span>
              </div>
              <div className="h-1 rounded-full bg-surface-3 overflow-hidden">
                <motion.div
                  initial={{ width: `${pct}%` }}
                  animate={{ width: l.state === "expired" ? "0%" : "0%" }}
                  transition={{ duration: Math.max(2, l.ttl), ease: "linear" }}
                  className="h-full ai-gradient-bg"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </AppShell>
  );
}
