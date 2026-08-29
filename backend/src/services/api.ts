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
  private async handleError(res: Response, defaultMessage: string): Promise<never> {
    let errorMessage = defaultMessage;
    try {
      const err = await res.json();
      if (err.detail) {
        if (Array.isArray(err.detail)) {
          // Pydantic validation error format
          errorMessage = err.detail.map((e: any) => `${e.loc?.join('.')} ${e.msg}`).join(', ');
        } else if (typeof err.detail === 'string') {
          errorMessage = err.detail;
        } else {
          errorMessage = JSON.stringify(err.detail);
        }
      }
    } catch (e) {
      errorMessage = res.statusText || defaultMessage;
    }
    throw new Error(errorMessage);
  }

  /**
   * Health Check
   * GET /api/health
   */
  async getHealth(): Promise<HealthResponse> {
    const res = await fetch(`${API_BASE}/health`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      await this.handleError(res, `Health check failed with HTTP ${res.status}`);
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
      await this.handleError(res, 'RAG retrieval failed');
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
      await this.handleError(res, 'Action execution failed');
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
      await this.handleError(res, `Events list failed with HTTP ${res.status}`);
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
      await this.handleError(res, `Clear events failed with HTTP ${res.status}`);
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
      await this.handleError(res, `Audit logs failed with HTTP ${res.status}`);
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
      await this.handleError(res, 'Pipeline execution failed');
    }
    return res.json();
  }
}

export const api = new ApiClient();
