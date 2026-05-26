import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from "react-resizable-panels";
import { FileCode2, Eye, GitMerge, Bot } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { IDETopBar } from "@/components/ide/IDETopBar";
import { IDEStatusBar } from "@/components/ide/IDEStatusBar";
import { IDEActivityBar } from "@/components/ide/IDEActivityBar";
import { LeftSidebar } from "@/components/ide/LeftSidebar";
import { EditorPane } from "@/components/ide/EditorPane";
import { PreviewPane } from "@/components/ide/PreviewPane";
import { CopilotPanel } from "@/components/ide/CopilotPanel";
import { BottomPanel } from "@/components/ide/BottomPanel";
import { DiffView } from "@/components/ide/DiffView";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Vanij — Autonomous AI Engineering Workspace" },
    { name: "description", content: "An AI-native IDE where parallel autonomous coding agents collaborate to build production software in real time." },
  ]}),
  component: Workspace,
});

const PG_H = "flex h-full w-full";
const PG_V = "flex flex-col h-full w-full";
const HANDLE = "w-px bg-border data-[resize-handle-state=hover]:bg-electric/40 data-[resize-handle-state=drag]:bg-electric transition-colors shrink-0";
const VHANDLE = "h-px bg-border data-[resize-handle-state=hover]:bg-electric/40 data-[resize-handle-state=drag]:bg-electric transition-colors shrink-0";

type Mode = "editor" | "preview" | "diff";

const MODES: { id: Mode; label: string; icon: any }[] = [
  { id: "editor",  label: "Editor",  icon: FileCode2 },
  { id: "preview", label: "Preview", icon: Eye },
  { id: "diff",    label: "Diff",    icon: GitMerge },
];

function Workspace() {
  const [active, setActive] = useState("explorer");
  const [openFile, setOpenFile] = useState("/src/runtime/dispatcher.ts");
  const [mode, setMode] = useState<Mode>("editor");
  const [previewOpen, setPreviewOpen] = useState(true);
  const [bottomOpen, setBottomOpen] = useState(true);

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      <IDETopBar />

      <div className="flex-1 min-h-0 flex">
        <IDEActivityBar active={active} onSelect={setActive} />

        <PanelGroup orientation="horizontal" className={`${PG_H} flex-1 min-w-0`}>
          {/* Sidebar */}
          <Panel defaultSize={18} minSize={12} maxSize={32}>
            <LeftSidebar active={openFile} onOpen={setOpenFile} />
          </Panel>
          <PanelResizeHandle className={HANDLE} />

          {/* Center column */}
          <Panel defaultSize={56} minSize={30}>
            <div className="h-full flex flex-col">
              {/* Mode switcher */}
              <div className="h-9 shrink-0 flex items-center gap-1 px-2 border-b border-border bg-surface-1/30 backdrop-blur-xl">
                <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-surface-2/50 border border-border">
                  {MODES.map((m) => {
                    const Icon = m.icon;
                    const isActive = mode === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setMode(m.id)}
                        className={`h-6 px-2.5 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition ${
                          isActive ? "ai-gradient-bg text-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-3 w-3" />
                        {m.label}
                      </button>
                    );
                  })}
                </div>

                <Link
                  to="/agents"
                  className="h-6 px-2.5 rounded-md text-[11px] font-medium flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-surface-2/60 border border-transparent hover:border-border transition"
                >
                  <Bot className="h-3 w-3" /> Agents
                </Link>

                <span className="ml-auto text-[10px] text-muted-foreground font-mono truncate">
                  {openFile}
                </span>
              </div>

              <PanelGroup orientation="vertical" className={`${PG_V} flex-1 min-h-0`}>
                <Panel defaultSize={bottomOpen ? 65 : 100} minSize={20}>
                  {mode === "diff" ? (
                    <DiffView path={openFile} />
                  ) : mode === "preview" ? (
                    <PreviewPane />
                  ) : (
                    <PanelGroup orientation="horizontal" className={PG_H}>
                      <Panel defaultSize={previewOpen ? 55 : 100} minSize={25}>
                        <EditorPane
                          activePath={openFile}
                          previewOpen={previewOpen}
                          onTogglePreview={() => setPreviewOpen((v) => !v)}
                        />
                      </Panel>
                      {previewOpen && (
                        <>
                          <PanelResizeHandle className={HANDLE} />
                          <Panel defaultSize={45} minSize={25}>
                            <PreviewPane onClose={() => setPreviewOpen(false)} />
                          </Panel>
                        </>
                      )}
                    </PanelGroup>
                  )}
                </Panel>

                {bottomOpen && (
                  <>
                    <PanelResizeHandle className={VHANDLE} />
                    <Panel defaultSize={35} minSize={12} maxSize={70}>
                      <BottomPanel onCollapse={() => setBottomOpen(false)} />
                    </Panel>
                  </>
                )}
              </PanelGroup>
            </div>
          </Panel>
          <PanelResizeHandle className={HANDLE} />

          {/* Copilot */}
          <Panel defaultSize={22} minSize={16} maxSize={36}>
            <CopilotPanel />
          </Panel>
        </PanelGroup>
      </div>

      <IDEStatusBar />

      {!bottomOpen && (
        <button
          onClick={() => setBottomOpen(true)}
          className="fixed bottom-7 left-1/2 -translate-x-1/2 z-30 h-6 px-3 rounded-full glass-strong text-[10px] text-muted-foreground hover:text-foreground"
        >
          ↑ open terminal
        </button>
      )}
    </div>
  );
}
