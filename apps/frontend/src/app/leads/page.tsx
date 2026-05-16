"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { Toaster, toast } from "sonner";
import {
  CopilotChatConfigurationProvider,
  CopilotSidebar,
  useAgent,
  useConfigureSuggestions,
  useCopilotKit,
  useDefaultRenderTool,
  useFrontendTool,
} from "@copilotkit/react-core/v2";
import { useCopilotChat } from "@copilotkit/react-core";
import { motion } from "motion/react";
import { ThreadsDrawer } from "@/components/threads-drawer";
import drawerStyles from "@/components/threads-drawer/threads-drawer.module.css";

import type { AgentState, Lead, LeadFilter } from "@/lib/leads/types";
import { initialState, emptyFilter } from "@/lib/leads/state";
import { applyFilter } from "@/lib/leads/derive";
import { applyPatch, revertPatch } from "@/lib/leads/optimistic";

import { Header } from "@/components/leads/Header";
import { PipelineBoard } from "@/components/leads/PipelineBoard";
import { QuickStats } from "@/components/leads/QuickStats";
import { StatusDonut } from "@/components/leads/StatusDonut";
import { WorkshopDemand } from "@/components/leads/WorkshopDemand";
import { LeadMiniCard } from "@/components/leads/inline/LeadMiniCard";
import { EmailDraftCard } from "@/components/leads/inline/EmailDraftCard";
import { ToolFallbackCard } from "@/components/copilot/ToolFallbackCard";
import { BenefitList } from "@/components/benefits/BenefitList";
import { BenefitsPortal } from "@/components/benefits/BenefitsPortal";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}

const leadShape = z.object({
  id: z.string(),
  url: z.string().optional(),
  name: z.string(),
  company: z.string().default(""),
  email: z.string().default(""),
  role: z.string().default(""),
  phone: z.string().optional(),
  source: z.string().optional(),
  technical_level: z.string().default(""),
  interested_in: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  workshop: z.string().default("Not sure yet"),
  status: z.string().default("Not started"),
  opt_in: z.boolean().default(false),
  message: z.string().default(""),
  submitted_at: z.string().default(""),
});

function mergeAgentState(raw: unknown): AgentState {
  const partial =
    raw && typeof raw === "object" ? (raw as Partial<AgentState>) : {};
  return {
    ...initialState,
    ...partial,
    filter: { ...initialState.filter, ...(partial.filter ?? {}) },
    header: { ...initialState.header, ...(partial.header ?? {}) },
    sync: { ...initialState.sync, ...(partial.sync ?? {}) },
    leads: partial.leads ?? initialState.leads,
    highlightedLeadIds:
      partial.highlightedLeadIds ?? initialState.highlightedLeadIds,
    benefits: partial.benefits ?? initialState.benefits,
    activeView: partial.activeView ?? initialState.activeView,
    selectedBenefitId: partial.selectedBenefitId ?? initialState.selectedBenefitId,
    benefitSelections: partial.benefitSelections ?? initialState.benefitSelections,
  };
}

function useLiveAgentState() {
  const { agent } = useAgent();
  const state = mergeAgentState(agent?.state);
  const setState = (updater: (prev: AgentState) => AgentState) => {
    agent?.setState(updater(mergeAgentState(agent?.state)));
  };
  return { agent, state, setState };
}

function LiveWorkshopDemand() {
  const { state, setState } = useLiveAgentState();
  return (
    <div className="my-2">
      <WorkshopDemand
        leads={state.leads}
        selectedWorkshops={state.filter.workshops}
        compact
        onPickWorkshop={(w) =>
          setState((prev) => {
            const has = prev.filter.workshops.includes(w);
            return {
              ...prev,
              filter: {
                ...prev.filter,
                workshops: has
                  ? prev.filter.workshops.filter((x) => x !== w)
                  : [...prev.filter.workshops, w],
              },
            };
          })
        }
      />
    </div>
  );
}

function AgentStatus() {
  const { status } = useCopilotChat();
  
  if (status === "idle") return null;

  const statusMap: Record<string, string> = {
    "inProgress": "🧠 Gemma está pensando...",
    "executing": "🛠️ Ejecutando herramienta...",
    "streaming": "✍️ Redactando respuesta...",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-24 right-8 z-[60] bg-white/90 backdrop-blur-md border border-primary/20 px-4 py-2 rounded-full shadow-xl flex items-center gap-2 pointer-events-none"
    >
      <div className="size-2 bg-primary rounded-full animate-pulse" />
      <span className="text-[10px] font-black uppercase tracking-widest text-primary">
        {statusMap[status] || "Procesando..."}
      </span>
    </motion.div>
  );
}

export function CanvasInner() {
  const { agent } = useAgent();
  const { copilotkit } = useCopilotKit();

  useConfigureSuggestions({
    available: "before-first-message",
    suggestions: [
      { title: "Import from Notion", message: "Import the leads from Notion." },
      { title: "What's hot?", message: "What workshops are most in demand right now?" },
    ],
  });

  const injectPrompt = useCallback(
    (prompt: string) => {
      if (!agent) return;
      const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `msg-${Date.now()}`;
      agent.addMessage({ id, role: "user", content: prompt });
      void copilotkit.runAgent({ agent }).catch(console.error);
    },
    [agent, copilotkit],
  );

  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());
  const [justSyncedIds, setJustSyncedIds] = useState<Set<string>>(new Set());
  const snapshotsRef = useRef<Map<string, Lead>>(new Map());

  const state = mergeAgentState(agent?.state);

  const updateState = useCallback(
    (updater: (prev: AgentState) => AgentState) => {
      agent?.setState(updater(mergeAgentState(agent?.state)));
    },
    [agent],
  );

  useEffect(() => {
    fetch("/api/benefits")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          updateState((prev) => ({ ...prev, benefits: data }));
        }
      })
      .catch((err) => console.error("Error fetching benefits:", err));
  }, [updateState]);

  useFrontendTool({
    name: "setHeader",
    description: "Set the workspace header.",
    parameters: z.object({ title: z.string().optional(), subtitle: z.string().optional() }),
    handler: async ({ title, subtitle }) => {
      updateState((prev) => ({
        ...prev,
        header: { title: title ?? prev.header.title, subtitle: subtitle ?? prev.header.subtitle },
      }));
      return "header updated";
    },
  });

  useFrontendTool({
    name: "setLeads",
    description: "Replace the entire lead list.",
    parameters: z.object({ leads: z.array(leadShape) }),
    handler: async ({ leads }) => {
      updateState((prev) => ({ ...prev, leads: leads as Lead[] }));
      return `loaded ${leads.length} leads`;
    },
  });

  useFrontendTool({
    name: "setView",
    description: "Switch between 'leads' and 'benefits'.",
    parameters: z.object({ view: z.enum(["leads", "benefits"]) }),
    handler: async ({ view }) => {
      updateState((prev) => ({ ...prev, activeView: view as "leads" | "benefits" }));
      return `view switched to ${view}`;
    },
  });

  useFrontendTool({
    name: "renderBukBenefits",
    description: "Render a list of Buk benefits.",
    parameters: z.object({ category: z.string().optional() }),
    render: ({ args }) => {
      const benefits = (agent?.state as any)?.benefits || [];
      return <BenefitList benefits={benefits} title={args.category || "Beneficios Buk"} />;
    },
  });

  useDefaultRenderTool({
    render: ({ name, status, result, parameters }) => (
      <ToolFallbackCard name={name} status={status} result={result} parameters={parameters} />
    ),
  });

  const visibleLeads = useMemo(() => applyFilter(state.leads, state.filter), [state.leads, state.filter]);

  return (
    <>
      <main className={cn("flex h-screen flex-col overflow-hidden bg-background", state.activeView === "leads" ? "gap-5 px-6 py-6" : "")}>
        {state.activeView === "benefits" ? (
          <div className="flex-1 overflow-hidden bg-background shadow-xl">
             <BenefitsPortal benefits={state.benefits || []} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col p-8 overflow-hidden">
            <Header title={state.header.title} subtitle={state.header.subtitle} totalLeads={state.leads.length} visibleLeads={visibleLeads.length} sync={state.sync} />
            <QuickStats leads={state.leads} />
            <div className="flex-1 overflow-auto mt-6">
              <PipelineBoard
                leads={visibleLeads}
                selectedLeadId={state.selectedLeadId}
                highlightedLeadIds={state.highlightedLeadIds}
                onSelect={(id) => updateState(prev => ({ ...prev, selectedLeadId: id }))}
                onMoveLead={(id, _, status) => updateState(prev => ({ 
                  ...prev, 
                  leads: prev.leads.map(l => l.id === id ? { ...l, status } : l) 
                }))}
                syncingIds={syncingIds}
                justSyncedIds={justSyncedIds}
              />
            </div>
          </div>
        )}
      </main>

      <CopilotSidebar defaultOpen width={420} input={{ disclaimer: () => null, className: "pb-6" }} />
      <AgentStatus />
      <Toaster position="bottom-right" />
    </>
  );
}

import { CopilotKit } from "@copilotkit/react-core";

function HomePage() {
  const [threadId, setThreadId] = useState<string | undefined>(undefined);
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <div className="flex h-screen w-full overflow-hidden bg-[#f8fafc]">
        <Sidebar />
        <div className="flex-1 relative overflow-hidden flex flex-col">
          <CopilotChatConfigurationProvider agentId="default" threadId={threadId}>
            <CanvasInner />
          </CopilotChatConfigurationProvider>
        </div>
      </div>
    </CopilotKit>
  );
}

export default function Page() {
  return (
    <ClientOnly>
      <HomePage />
    </ClientOnly>
  );
}
