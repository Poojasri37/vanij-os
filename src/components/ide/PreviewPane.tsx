import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Maximize2, Minimize2, ExternalLink, Smartphone, Tablet, Monitor, Wifi, Lock, X } from "lucide-react";

const DEVICES = [
  { id: "desktop", label: "Desktop", icon: Monitor, w: "100%" },
  { id: "tablet",  label: "Tablet",  icon: Tablet,  w: "820px" },
  { id: "phone",   label: "Phone",   icon: Smartphone, w: "390px" },
];

export function PreviewPane({ onClose }: { onClose?: () => void }) {
  const [device, setDevice] = useState("desktop");
  const [path, setPath] = useState("/dashboard");
  const [key, setKey] = useState(0);
  const [full, setFull] = useState(false);

  const width = DEVICES.find((d) => d.id === device)?.w ?? "100%";

  return (
    <div className={`h-full flex flex-col bg-background/40 ${full ? "fixed inset-0 z-50 bg-background" : ""}`}>
      {/* Browser chrome */}
      <div className="h-9 flex items-center gap-2 px-2 border-b border-border bg-surface-1/40 backdrop-blur-xl">
        <div className="flex gap-1.5 pl-1">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        </div>
        <div className="flex items-center gap-0.5 ml-1">
          <button className="h-6 w-6 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2"><ArrowLeft className="h-3 w-3" /></button>
          <button className="h-6 w-6 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2"><ArrowRight className="h-3 w-3" /></button>
          <button onClick={() => setKey((k) => k + 1)} className="h-6 w-6 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2"><RotateCw className="h-3 w-3" /></button>
        </div>
        <div className="flex-1 mx-1 h-7 rounded-md bg-surface-2/60 border border-border flex items-center gap-2 px-2 text-[11px] text-muted-foreground">
          <Lock className="h-3 w-3 text-success" />
          <span className="font-mono text-foreground/80 truncate">vanij.app{path}</span>
          <span className="ml-auto flex items-center gap-1 text-[10px]"><Wifi className="h-3 w-3 text-success" /> 28ms · hot</span>
        </div>
        <div className="flex items-center gap-0.5">
          {DEVICES.map((d) => {
            const Icon = d.icon;
            const active = d.id === device;
            return (
              <button
                key={d.id}
                onClick={() => setDevice(d.id)}
                title={d.label}
                className={`h-6 w-6 grid place-items-center rounded-md ${active ? "bg-surface-2 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-surface-2"}`}
              >
                <Icon className="h-3 w-3" />
              </button>
            );
          })}
        </div>
        <button onClick={() => setFull(!full)} className="h-6 w-6 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2">
          {full ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
        </button>
        <a href={path} target="_blank" rel="noreferrer" className="h-6 w-6 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2">
          <ExternalLink className="h-3 w-3" />
        </a>
        {onClose && (
          <button onClick={onClose} className="h-6 w-6 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2">
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Route pills */}
      <div className="px-3 h-8 flex items-center gap-1 border-b border-border bg-background/30 overflow-x-auto scrollbar-thin">
        {["/dashboard", "/runtime", "/agents", "/memory", "/leases", "/analytics", "/deployments"].map((p) => (
          <button
            key={p}
            onClick={() => { setPath(p); setKey((k) => k + 1); }}
            className={`h-6 px-2 rounded-md text-[10.5px] font-mono whitespace-nowrap transition ${
              path === p ? "bg-surface-2 text-foreground border border-border" : "text-muted-foreground hover:text-foreground hover:bg-surface-2/60"
            }`}
          >
            {p}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-success flex items-center gap-1 pr-1">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> live · hot-reload
        </span>
      </div>

      {/* Iframe */}
      <div className="flex-1 overflow-auto grid-bg p-4 flex items-start justify-center">
        <div
          className="h-full bg-background rounded-xl shadow-elevated border border-border overflow-hidden transition-all"
          style={{ width, minHeight: "100%", maxWidth: "100%" }}
        >
          <iframe
            key={key + path}
            src={path}
            title="Vanij live preview"
            className="w-full h-full block"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      </div>
    </div>
  );
}
