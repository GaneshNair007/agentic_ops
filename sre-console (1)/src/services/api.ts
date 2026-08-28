/**
 * AI SRE System — Typed API Client
 * Maps frontend UI calls directly to real FastAPI endpoints on port 8000.
 */

import {
  HealthResponse,
  RagRetrieveResponse,
  ActionResponse,
  EventListResponse,
  AuditLogResponse,
  PipelineRunResponse,
} from '../types';

const API_BASE = '/api';

class ApiClient {
  /**
   * Health Check
   * GET /api/health
   */
  async getHealth(): Promise<HealthResponse> {
    const res = await fetch(`${API_BASE}/health`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Health check failed with HTTP ${res.status}`);
    }
    return res.json();
  }

  /**
   * Query RAG Vector Index
   * POST /api/rag/retrieve
   */
  async retrieve(query: string, k: number = 5): Promise<RagRetrieveResponse> {
    const res = await fetch(`${API_BASE}/rag/retrieve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, k }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || 'RAG retrieval failed');
    }
    return res.json();
  }

  /**
   * Execute Predefined Controlled Action
   * POST /api/tools/action
   */
  async executeAction(action_type: string, params: Record<string, any>): Promise<ActionResponse> {
    const res = await fetch(`${API_BASE}/tools/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action_type, params }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || 'Action execution failed');
    }
    return res.json();
  }

  /**
   * List Events Timeline
   * GET /api/events/list
   */
  async listEvents(): Promise<EventListResponse> {
    const res = await fetch(`${API_BASE}/events/list`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Events list failed with HTTP ${res.status}`);
    }
    return res.json();
  }

  /**
   * Clear Session Events
   * POST /api/events/clear
   */
  async clearEvents(): Promise<{ status: string; message: string }> {
    const res = await fetch(`${API_BASE}/events/clear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Clear events failed with HTTP ${res.status}`);
    }
    return res.json();
  }

  /**
   * Get Immutable Audit Logs
   * GET /api/logs/audit
   */
  async getAuditLogs(): Promise<AuditLogResponse> {
    const res = await fetch(`${API_BASE}/logs/audit`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Audit logs failed with HTTP ${res.status}`);
    }
    return res.json();
  }

  /**
   * Run Full Incident Pipeline
   * POST /api/pipeline/run
   */
  async runPipeline(service: string, severity: string, symptom: string): Promise<PipelineRunResponse> {
    const res = await fetch(`${API_BASE}/pipeline/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service, severity, symptom }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || 'Pipeline execution failed');
    }
    return res.json();
  }
}

export const api = new ApiClient();
