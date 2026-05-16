export type TechLevel =
  | "Non-technical"
  | "Some technical"
  | "Developer"
  | "Advanced / expert";

export type Workshop =
  | "Agentic UI (AG-UI)"
  | "MCP Apps / Tooling"
  | "RAG & Data Chat"
  | "Evaluations & Guardrails"
  | "Deploying Agents (prod)"
  | "Not sure yet";

export type Source =
  | "Website"
  | "Referral"
  | "LinkedIn"
  | "X/Twitter"
  | "Event"
  | "Other";

export type LeadStatus = "Not started" | "In progress" | "Done";

export const STATUSES: readonly LeadStatus[] = [
  "Not started",
  "In progress",
  "Done",
] as const;

export const WORKSHOPS: readonly Workshop[] = [
  "Agentic UI (AG-UI)",
  "MCP Apps / Tooling",
  "RAG & Data Chat",
  "Evaluations & Guardrails",
  "Deploying Agents (prod)",
  "Not sure yet",
] as const;

export const TECH_LEVELS: readonly TechLevel[] = [
  "Non-technical",
  "Some technical",
  "Developer",
  "Advanced / expert",
] as const;

export interface Lead {
  id: string;
  url?: string;
  name: string;
  company: string;
  email: string;
  role: string;
  phone?: string;
  source?: string;
  technical_level: string;
  interested_in: string[];
  tools: string[];
  workshop: string;
  status: string;
  opt_in: boolean;
  message: string;
  submitted_at: string;
}

export interface LeadFilter {
  workshops: string[];
  technical_levels: string[];
  tools: string[];
  opt_in: "any" | "yes" | "no";
  search: string;
}

export interface SyncMeta {
  databaseId: string;
  databaseTitle: string;
  syncedAt: string | null;
}

export interface AgentState {
  leads: Lead[];
  filter: LeadFilter;
  highlightedLeadIds: string[];
  selectedLeadId: string | null;
  header: { title: string; subtitle: string };
  sync: SyncMeta;
  benefits?: Benefit[];
  activeView?: "leads" | "benefits";
  selectedBenefitId?: number | null;
  benefitSelections: Record<string, Record<string, any>>;
}

// Mirrors the Python `NotionHealth` TypedDict in
// agent/src/notion_integration.py. Returned by the agent's
// `notion_health_check` tool when the user pings the Notion DB.
export interface NotionHealth {
  user_id: string;
  db_title: string;
  row_count: number;
  expected_props: string[];
  actual_props: string[];
  missing_props: string[];
  error: string | null;
}

export interface Benefit {
  id: number;
  name: string;
  benefit_type: string;
  visibility: string;
  draft: boolean;
  billable: boolean;
  boss_approval: boolean;
  rrhh_approval: boolean;
  double_approval: boolean;
  approval_type: string;
  description: string;
  additional_info: string | null;
  url: string | null;
  banner: { url: string };
  favorite: boolean;
  favorite_banner: { url: string };
  buk_benefit: boolean;
  preapproved_benefit: boolean;
  recurrent: boolean;
  recurrent_period: string;
  requests_limit: number | null;
  hawaii_id: number;
  created_at?: string;
  updated_at?: string;
  points?: number;
  config?: {
    type: "size_selector" | "quantity_selector" | "dropdown" | "text_area" | "multi_input";
    options?: string[];
    max?: number;
    min?: number;
    label?: string;
    placeholder?: string;
    fields?: Array<{
      id: string;
      type: "text_area" | "dropdown" | "quantity_selector" | "size_selector";
      label: string;
      placeholder?: string;
      options?: string[];
    }>;
  };
}

