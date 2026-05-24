import { useState } from "react";
import { ChevronRight, ChevronDown, FileCode2, FileJson, FileText, Folder, FolderOpen, Circle } from "lucide-react";
import { FILE_TREE, type FileNode } from "@/lib/ide-mock";

const STATUS_COLOR: Record<string, string> = {
  edit:   "bg-electric",
  new:    "bg-success",
  merged: "bg-violet-glow",
  lease:  "bg-warning",
};

function fileIcon(ext?: string) {
  if (ext === "json") return <FileJson className="h-3.5 w-3.5 text-warning" />;
  if (ext === "md")   return <FileText className="h-3.5 w-3.5 text-muted-foreground" />;
  return <FileCode2 className="h-3.5 w-3.5 text-electric" />;
}

function Node({ node, depth, active, onOpen }: {
  node: FileNode; depth: number; active: string; onOpen: (p: string) => void;
}) {
  const [open, setOpen] = useState(depth < 2);
  if (node.kind === "dir") {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-1 px-2 py-[3px] rounded-md text-[12px] text-foreground/85 hover:bg-surface-2/60"
          style={{ paddingLeft: 8 + depth * 12 }}
        >
          {open ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
          {open ? <FolderOpen className="h-3.5 w-3.5 text-electric" /> : <Folder className="h-3.5 w-3.5 text-electric/80" />}
          <span className="font-medium tracking-tight">{node.name}</span>
        </button>
        {open && node.children?.map((c) => (
          <Node key={c.path} node={c} depth={depth + 1} active={active} onOpen={onOpen} />
        ))}
      </div>
    );
  }
  const isActive = active === node.path;
  return (
    <button
      onClick={() => onOpen(node.path)}
      className={`group w-full flex items-center gap-1.5 px-2 py-[3px] rounded-md text-[12px] transition ${
        isActive ? "bg-surface-2 text-foreground" : "text-foreground/75 hover:bg-surface-2/60 hover:text-foreground"
      }`}
      style={{ paddingLeft: 8 + depth * 12 + 14 }}
    >
      {fileIcon(node.ext)}
      <span className="truncate">{node.name}</span>
      {node.agent && (
        <span className="ml-auto flex items-center gap-1">
          <span className={`h-1.5 w-1.5 rounded-full ${STATUS_COLOR[node.status ?? "edit"]} ${node.status === "edit" ? "animate-pulse" : ""}`} />
          <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{node.agent.split("-")[0]}</span>
        </span>
      )}
    </button>
  );
}

export function Explorer({ active, onOpen }: { active: string; onOpen: (p: string) => void }) {
  return (
    <div className="h-full flex flex-col bg-surface-1/40 backdrop-blur-xl">
      <div className="px-3 h-9 flex items-center justify-between border-b border-border">
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Explorer</div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Circle className="h-1.5 w-1.5 fill-success text-success" /> wave-3
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin py-1.5">
        {FILE_TREE.map((n) => <Node key={n.path} node={n} depth={0} active={active} onOpen={onOpen} />)}
      </div>
      <div className="border-t border-border px-3 py-2 text-[10px] text-muted-foreground flex items-center justify-between">
        <span>4 agents editing</span>
        <span className="font-mono text-foreground/70">+182 −24</span>
      </div>
    </div>
  );
}
