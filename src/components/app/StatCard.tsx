import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { spark } from "@/lib/mock";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type Tone = "electric" | "violet" | "pink" | "success" | "warning" | "danger";

const TONE: Record<Tone, { text: string; stop: string }> = {
  electric: { text: "text-electric", stop: "var(--electric)" },
  violet:   { text: "text-violet-glow", stop: "var(--violet-glow)" },
  pink:     { text: "text-pink-glow", stop: "var(--pink-glow)" },
  success:  { text: "text-success", stop: "var(--success)" },
  warning:  { text: "text-warning", stop: "var(--warning)" },
  danger:   { text: "text-danger", stop: "var(--danger)" },
};

export function StatCard({
  label, value, sub, delta, tone = "electric", seed = 1, icon,
}: {
  label: string; value: string; sub?: string; delta?: number;
  tone?: Tone; seed?: number; icon?: React.ReactNode;
}) {
  const data = spark(28, 50, 30, seed);
  const t = TONE[tone];
  const up = (delta ?? 0) >= 0;
  const id = `g-${tone}-${seed}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative glass rounded-2xl p-4 overflow-hidden group"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
          <div className="mt-2 text-2xl md:text-[26px] font-semibold tracking-tight font-display">{value}</div>
          {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
        </div>
        <div className={`h-8 w-8 rounded-lg bg-surface-2 grid place-items-center ${t.text}`}>{icon}</div>
      </div>

      {delta !== undefined && (
        <div className={`mt-2 inline-flex items-center gap-1 text-xs ${up ? "text-success" : "text-danger"}`}>
          {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          <span className="font-medium">{up ? "+" : ""}{delta}%</span>
          <span className="text-muted-foreground">vs prior wave</span>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-14 opacity-90 pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={t.stop} stopOpacity={0.45} />
                <stop offset="100%" stopColor={t.stop} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={t.stop} strokeWidth={1.5} fill={`url(#${id})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
