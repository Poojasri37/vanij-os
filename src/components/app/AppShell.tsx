import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { StreamingTerminal } from "./StreamingTerminal";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar />
        <main className="flex-1 min-w-0 px-4 md:px-8 py-6 md:py-8">
          {children}
        </main>
        <StreamingTerminal />
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow, title, description, actions,
}: { eyebrow?: string; title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 md:mb-8 flex flex-wrap items-end gap-4">
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">{eyebrow}</div>
        )}
        <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </div>
  );
}
