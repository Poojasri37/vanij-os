import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useNavigate } from "@tanstack/react-router";
import { Bot, Rocket, Workflow, KeyRound, ShieldCheck, BrainCircuit, LineChart, Wallet, Settings, Sparkles, Terminal, GitMerge } from "lucide-react";

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const nav = useNavigate();
  const go = (to: string) => { onOpenChange(false); nav({ to }); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden glass-strong rounded-2xl sm:max-w-xl border-border">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <Command className="bg-transparent">
          <div className="px-3 pt-3">
            <CommandInput
              placeholder="Ask Vanij anything — spawn agent, deploy, search…"
              className="h-11 text-sm"
            />
          </div>
          <CommandList className="max-h-[420px] px-1.5 pb-2">
            <CommandEmpty>No results — try "spawn agent" or "deploy"</CommandEmpty>

            <CommandGroup heading="AI Actions">
              <CommandItem onSelect={() => go("/runtime")}>
                <Sparkles className="h-3.5 w-3.5 text-electric" />
                <span>Spawn parallel agent wave</span>
                <span className="ml-auto text-[10px] text-muted-foreground">⌘ ⇧ N</span>
              </CommandItem>
              <CommandItem onSelect={() => go("/reconciler")}>
                <GitMerge className="h-3.5 w-3.5 text-violet-glow" />
                <span>Reconcile open AST patches</span>
              </CommandItem>
              <CommandItem onSelect={() => go("/validation")}>
                <ShieldCheck className="h-3.5 w-3.5 text-success" />
                <span>Run validation pipeline</span>
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="Navigate">
              <CommandItem onSelect={() => go("/runtime")}><Workflow className="h-3.5 w-3.5" /><span>Runtime graph</span></CommandItem>
              <CommandItem onSelect={() => go("/agents")}><Bot className="h-3.5 w-3.5" /><span>Agents</span></CommandItem>
              <CommandItem onSelect={() => go("/leases")}><KeyRound className="h-3.5 w-3.5" /><span>Lease registry</span></CommandItem>
              <CommandItem onSelect={() => go("/memory")}><BrainCircuit className="h-3.5 w-3.5" /><span>ESLL memory</span></CommandItem>
              <CommandItem onSelect={() => go("/deployments")}><Rocket className="h-3.5 w-3.5" /><span>Deployments</span></CommandItem>
              <CommandItem onSelect={() => go("/analytics")}><LineChart className="h-3.5 w-3.5" /><span>Analytics</span></CommandItem>
              <CommandItem onSelect={() => go("/billing")}><Wallet className="h-3.5 w-3.5" /><span>Billing</span></CommandItem>
              <CommandItem onSelect={() => go("/settings")}><Settings className="h-3.5 w-3.5" /><span>Settings</span></CommandItem>
            </CommandGroup>

            <CommandGroup heading="System">
              <CommandItem><Terminal className="h-3.5 w-3.5" /><span>Toggle streaming terminal</span><span className="ml-auto text-[10px] text-muted-foreground">⌘ J</span></CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
