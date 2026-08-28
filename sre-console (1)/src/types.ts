/**
 * AI SRE System — Agentic Incident Risk Triage & Response System
 * Core Data Models & API Interfaces
 */

export type ActiveView = 'overview' | 'simulator' | 'evidence' | 'actions' | 'audit';

export type SeverityLevel = 'P1' | 'P2' | 'P3';

export type ActionCategory = 'neutral' | 'review_required' | 'high_impact';

export interface HealthResponse {
  status: string;
  system: string;
  timestamp: string;
}

export interface RagResultItem {
  id: string;
  title: string;
  score: number;
  text: string;
  document_type?: 'incident' | 'runbook' | string;
  kind?: string;
  filename?: string;
  tags?: string[] | string;
  metadata?: Record<string, any>;
}

export interface RagRetrieveResponse {
  query: string;
  count: number;
  results: RagResultItem[];
}

export interface ActionResponse {
  action_id: string;
  action: string;
  status: 'success' | 'failed' | string;
  message: string;
  timestamp: string;
  execution_time_ms: number;
  params: Record<string, any>;
}

export interface EventItem {
  event_id?: string;
  type: string;
  payload: Record<string, any>;
  timestamp?: string;
}

export interface EventListResponse {
  count: number;
  events: EventItem[];
}

export interface AuditLogItem {
  action_id: string;
  action: string;
  status: string;
  message: string;
  timestamp: string;
  execution_time_ms: number;
  params: Record<string, any>;
}

export interface AuditLogResponse {
  count: number;
  logs: AuditLogItem[];
}

export interface PipelineRunResponse {
  status: 'success' | 'failed' | string;
  service: string;
  total_duration_sec: number;
  retrieved_docs: RagResultItem[];
  action_result: ActionResponse;
  events: EventItem[];
}

export interface ActionDefinition {
  type: string;
  name: string;
  description: string;
  category: ActionCategory;
  defaultParams: Record<string, any>;
}
