import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from "react-resizable-panels";
import { IDETopBar } from "@/components/ide/IDETopBar";
import { IDEStatusBar } from "@/components/ide/IDEStatusBar";
import { IDEActivityBar } from "@/components/ide/IDEActivityBar";
import { Explorer } from "@/components/ide/Explorer";
import { EditorPane } from "@/components/ide/EditorPane";
import { PreviewPane } from "@/components/ide/PreviewPane";
import { CopilotPanel } from "@/components/ide/CopilotPanel";
import { BottomPanel } from "@/components/ide/BottomPanel";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Vanij — Autonomous AI Engineering Workspace" },
    { name: "description", content: "An AI-native IDE where parallel autonomous coding agents collaborate to build production software in real time." },
  ]}),
  component: Workspace,
});

const HANDLE = "w-px bg-border data-[resize-handle-state=hover]:bg-electric/40 data-[resize-handle-state=drag]:bg-electric transition-colors";
const VHANDLE = "h-px bg-border data-[resize-handle-state=hover]:bg-electric/40 data-[resize-handle-state=drag]:bg-electric transition-colors";

function Workspace() {
  const [active, setActive] = useState("explorer");
  const [openFile, setOpenFile] = useState("/src/runtime/dispatcher.ts");
  const [previewOpen, setPreviewOpen] = useState(true);
  const [bottomOpen, setBottomOpen] = useState(true);

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      <IDETopBar />

      <div className="flex-1 min-h-0 flex">
        <IDEActivityBar active={active} onSelect={setActive} />

        <PanelGroup direction="horizontal" className="flex-1">
          {/* Explorer */}
          <Panel defaultSize={16} minSize={10} maxSize={28}>
            <Explorer active={openFile} onOpen={setOpenFile} />
          </Panel>
          <PanelResizeHandle className={HANDLE} />

          {/* Center column: editor + preview / bottom */}
          <Panel defaultSize={58} minSize={30}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={bottomOpen ? 65 : 100} minSize={20}>
                <PanelGroup direction="horizontal">
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
