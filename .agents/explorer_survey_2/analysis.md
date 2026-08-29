# Backend Integration & Data Contract Survey

## Executive Summary
This survey provides a comprehensive architectural and data contract map of the AI SRE Operation Console backend and its integration with the React/Vite frontend. The investigation confirms that all required operational capabilities (health monitoring, semantic vector retrieval via ChromaDB, mock infrastructure remediation with parameter validation, session event streaming, and immutable disk-backed audit logging) are fully implemented across Python FastAPI (`api_server.py`), Python frozen contracts (`interfaces.py`), and TypeScript client services (`sre-console (1)/src/services/api.ts`).

Strict preservation boundaries are established: no changes to FastAPI endpoints, ChromaDB structures, or Python backend interfaces are required or permitted. Frontend redesign teams must adhere strictly to the defensive rendering guidelines detailed herein to prevent `[object Object]` and React child rendering crashes.

---

## 1. Backend Architecture & Service Topology

```
+-------------------------------------------------------------------------+
|                  React / Vite Frontend (sre-console (1))                |
|  - HeroSection, IncidentMarquee, SystemWorkflow, IncidentSimulator     |
|  - EvidenceRetrieval, SafetyControl, AuditTimeline, ClosingSection      |
+-------------------------------------------------------------------------+
                                    |
                                    | Fetch API (/api/*)
                                    v
+-------------------------------------------------------------------------+
|                Express + Vite Proxy Server (server.ts :3000)            |
|  - Proxies /api/* to http://127.0.0.1:8000                              |
|  - Static / SPA fallback handler                                        |
+-------------------------------------------------------------------------+
                                    |
                                    | HTTP / JSON (Port 8000)
                                    v
+-------------------------------------------------------------------------+
|                    FastAPI Backend (api_server.py :8000)                |
+-------------------------------------------------------------------------+
         |                        |                          |
         v                        v                          v
+------------------+    +--------------------+    +----------------------+
|  rag/retrieve.py |    |  tools/actions.py  |    |  tools/event_bus.py  |
|  ChromaDB Dense  |    |  8 Mock Execution  |    |  Thread-Safe Memory  |
|  Vector Search   |    |  Engines & Limits  |    |  & Event Queue       |
+------------------+    +--------------------+    +----------------------+
         |                        |                          |
         v                        v                          v
 rag/chroma_db/             tools/audit.log           tools/events.jsonl
 (35 Docs: 20 Inc, 15 RB)  (Immutable JSONL)         (Session / Live JSONL)
```

### Core Backend Modules & Roles
1. **`api_server.py`** (`FastAPI`): Primary HTTP REST API server on port 8000 exposing 8 endpoints.
2. **`interfaces.py`**: Frozen facade contract module declaring stable signatures: `retrieve`, `remember`, `execute_action`, `emit_event`.
3. **`rag/retrieve.py` & `rag/store.py`**: ChromaDB persistent vector retrieval (`all-MiniLM-L6-v2` embeddings, cosine similarity) indexing 20 incident postmortems and 15 SRE runbooks (35 documents total), with keyword-overlap fallback.
4. **`tools/actions.py`**: Action execution engine supporting 8 remediation protocols with strict parameter validation and disk logging to `tools/audit.log`.
5. **`tools/event_bus.py`**: Thread-safe in-memory event publisher persisting to `tools/events.jsonl`.
6. **`orchestrator/agent.py`**: Multi-step AI SRE agent loop (retrieve -> hypothesize -> self-critique -> confidence-gated action -> remember).
7. **`sre-console (1)/server.ts`**: Express proxy (port 3000) relaying `/api/*` to Python backend on port 8000 and mounting Vite SPA middleware.
8. **`sre-console (1)/src/services/api.ts`**: Singleton `ApiClient` translating UI user actions into HTTP requests.

---

## 2. Full API Endpoint & Contract Inventory

| HTTP Method | Route | Request Payload Schema | Success Response Schema | Error Response & Status | Calling Frontend Component(s) |
|---|---|---|---|---|---|
| `GET` | `/api/health` | None | `{ status: "ok", system: "AI SRE Backend", timestamp: string }` | 500 / Network Error | `App.tsx` (10s polling interval), `server.ts` |
| `POST` | `/api/rag/retrieve` | `{ query: string, k?: number }` (default `k=5`) | `{ query: string, count: number, results: RagResultItem[] }` | 500 `{ detail: string }` | `EvidenceRetrieval.tsx`, `api.ts` |
| `POST` | `/api/tools/action` | `{ action_type: string, params: Record<string, any> }` | `{ action_id: string, action: string, status: "success" \| "failed", message: string, timestamp: string, execution_time_ms: number, params: Record<string, any> }` | 500 `{ detail: string }` (or 200 with `status: "failed"`) | `SafetyControl.tsx`, `api.ts` |
| `POST` | `/api/events/emit` | `{ type: string, payload: Record<string, any> }` | `{ status: "success", message: "Event emitted" }` | 500 `{ detail: string }` | `api_server.py`, `interfaces.py`, `api.ts` |
| `GET` | `/api/events/list` | None | `{ count: number, events: EventItem[] }` | 200 `{ count: 0, events: [] }` | `AuditTimeline.tsx`, `api.ts`, `server.ts` |
| `POST` | `/api/events/clear` | None | `{ status: "success", message: "Events timeline cleared" }` | 500 `{ detail: string }` | `AuditTimeline.tsx`, `api.ts` |
| `GET` | `/api/logs/audit` | None | `{ count: number, logs: AuditLogItem[] }` | 200 `{ count: 0, logs: [] }` if file empty | `AuditTimeline.tsx`, `api.ts` |
| `POST` | `/api/pipeline/run` | `{ service?: string, severity?: string, symptom?: string }` | `{ status: "success", service: string, total_duration_sec: number, retrieved_docs: RagResultItem[], action_result: ActionResponse, events: EventItem[] }` | 500 `{ detail: string }` | `IncidentSimulator.tsx`, `api.ts`, `server.ts` |

---

## 3. Core Data Contracts & Schemas

### 3.1 Incident Simulation & Pipeline Data Model

#### Pipeline Request Contract (`api_server.py:65-69`):
```json
{
  "service": "payment-api",
  "severity": "P1",
  "symptom": "HTTP 504 Gateway Timeout spike on /v1/checkout"
}
```

#### Pipeline Response Contract (`api_server.py:179-186`, `types.ts:71-78`):
```json
{
  "status": "success",
  "service": "payment-api",
  "total_duration_sec": 0.245,
  "retrieved_docs": [
    {
      "id": "RB-004_api_gateway_504_timeouts",
      "document_type": "runbook",
      "title": "API Gateway HTTP 504 Timeout Remediation",
      "text": "Full procedure content...",
      "tags": ["payment-api", "504-timeout", "gateway"],
      "score": 0.9412,
      "filename": "RB-004_api_gateway_504_timeouts.md"
    }
  ],
  "action_result": {
    "action_id": "8fa3c448-9b88-46d4-8d4e-0c01a2f643e2",
    "action": "restart_service",
    "status": "success",
    "message": "Service 'payment-api' restarted successfully across all active worker instances.",
    "timestamp": "2026-08-29T06:48:00.000000+00:00",
    "execution_time_ms": 142,
    "params": {
      "service": "payment-api",
      "replicas": null
    }
  },
  "events": [
    {
      "event_id": "f28b12de-3329-4d22-bc55-e48f7a81014e",
      "timestamp": "2026-08-29T06:48:00.000000+00:00",
      "type": "incident_detected",
      "payload": {
        "service": "payment-api",
        "severity": "P1",
        "symptom": "HTTP 504 Gateway Timeout spike on /v1/checkout"
      }
    }
  ]
}
```

---

### 3.2 Safety Control Protocols, Parameters, and Risk Matrix

The action execution engine (`tools/actions.py:43-52`) enforces strict parameters across 8 controlled protocols:

| Action Protocol (`action_type`) | UI Risk Tier | Mandatory / Accepted Parameters | Validation Criteria | Default Simulation Params |
|---|---|---|---|---|
| `restart_service` | `review_required` | `service` (str) or `service_name` (str) | Target service string required | `{"service": "payment-api"}` |
| `rollback_deployment` | `high_impact` (Guarded) | `deployment` (str) or `service` (str), `revision` (optional str) | Deployment target string required | `{"deployment": "payment-api", "revision": "v2.3.9"}` |
| `restart_pod` | `review_required` | `pod_name` (str) or `pod` (str) or `service` (str), `namespace` (str) | Pod/service string required | `{"pod_name": "payment-api-7b89d49-x9z", "namespace": "production"}` |
| `restart_database` | `high_impact` (Guarded) | `database` (str) or `cluster` (str) or `service` (str) | Database target string required | `{"database": "user-profile-pg-cluster"}` |
| `scale_deployment` | `review_required` | `deployment` (str) or `service` (str), `replicas` (int) | Both deployment and integer replicas required | `{"deployment": "coredns", "replicas": 8}` |
| `create_ticket` | `neutral` | `title` (str) or `summary` (str), `severity` (str) | Title/summary string required | `{"title": "P1 Incident - payment-api 504 Timeout", "severity": "P1"}` |
| `notify_team` | `neutral` | `channel` (str) or `recipient` (str) or `target` (str), `message` (str) | Channel string required | `{"channel": "#sre-alerts", "message": "Remediation action initiated"}` |
| `generate_postmortem` | `neutral` | `incident_id` (str) or `title` (str) | Incident ID or title required | `{"incident_id": "INC-2026-005", "title": "Payment API Gateway Outage"}` |

---

### 3.3 Forensic Audit Logs & Event Timeline Structure

#### Audit Log Record (`tools/audit.log` & `GET /api/logs/audit`):
```json
{
  "action_id": "c71a3994-6d9b-449e-b78f-a912dc1b942a",
  "action": "scale_deployment",
  "status": "success",
  "message": "Deployment 'coredns' scaled successfully to 8 replicas.",
  "timestamp": "2026-08-29T06:48:12.345678+00:00",
  "execution_time_ms": 184,
  "params": {
    "deployment": "coredns",
    "replicas": 8
  }
}
```

#### Event Timeline Record (`tools/events.jsonl` & `GET /api/events/list`):
```json
{
  "event_id": "d1e2f3a4-5678-90ab-cdef-1234567890ab",
  "timestamp": "2026-08-29T06:48:10.123456+00:00",
  "type": "memory_retrieved",
  "payload": {
    "matched_id": "RB-004_api_gateway_504_timeouts",
    "matched_title": "API Gateway HTTP 504 Timeout Remediation",
    "retrieval_latency_ms": 11.45,
    "docs_count": 3
  }
}
```

---

### 3.4 ChromaDB / Vector Store Schema & RAG Retrieval

- **Vector Store Directory**: `rag/chroma_db/`
- **ChromaDB Collection Name**: `sre_knowledge_base`
- **Embedding Model**: `SentenceTransformerEmbeddingFunction("all-MiniLM-L6-v2")` (384 dimensions)
- **Indexed Document Count**: 35 total (20 incidents in `rag/data/incidents/`, 15 runbooks in `rag/data/runbooks/`)
- **Score Normalization Formulation**:
  Cosine distance $d \in [0, 2]$. Normalized similarity score = $\text{round}(\max(0.0, \min(1.0, 1.0 - d)), 4)$.

#### RAG Document Schema (`RagResultItem`):
```typescript
export interface RagResultItem {
  id: string;                      // e.g. "INC-2026-005" or "RB-004_api_gateway_504_timeouts"
  document_type?: 'incident' | 'runbook' | string;
  kind?: string;                   // Normalized alias for document_type
  title: string;                   // Human readable title
  text: string;                    // Full markdown text content
  tags?: string[] | string;        // Array of string tags or comma-separated string
  score: number;                   // 0.0 to 1.0 relevance score
  filename?: string;               // Source file (e.g. "INC-2026-005.md")
  metadata?: Record<string, any>;
}
```

---

## 4. Root Cause Analysis of `[object Object]` & React Render Crashes

A primary functional acceptance criterion is preventing `[object Object]` crashes. The survey identified five distinct crash hazard zones:

### Hazard 1: Direct JSX Rendering of Nested Objects in `EventItem.payload`
- **Mechanism**: Event payloads contain arbitrary dictionary structures (e.g., `payload: { service: "payment-api", severity: "P1" }` or `payload: { matched_id: "RB-004", ... }` or `payload: { action_id: "...", params: { ... } }`).
- **Failure Point**: In `AuditTimeline.tsx:164`, if a developer writes `{ev.payload}` directly in JSX, React throws:
  `Uncaught Error: Objects are not valid as a React child (found: object with keys {service, severity, symptom}). If you meant to render a collection of children, use an array instead.`
  Alternatively, string concatenation `"" + ev.payload` evaluates to `"[object Object]"`.
- **Defensive Solution**:
  ```tsx
  // Always inspect and extract scalar values or JSON stringify
  const formatPayloadSummary = (payload: Record<string, any>): string => {
    if (!payload || typeof payload !== 'object') return String(payload || '');
    if (typeof payload.message === 'string') return payload.message;
    if (typeof payload.symptom === 'string') return `${payload.service ? `[${payload.service}] ` : ''}${payload.symptom}`;
    if (typeof payload.matched_title === 'string') return `Matched: ${payload.matched_id} — ${payload.matched_title}`;
    if (typeof payload.status === 'string') return `Status: ${payload.status}`;
    // Fallback: safe compact string summary
    return Object.entries(payload)
      .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
      .join(' | ');
  };
  ```

### Hazard 2: Rendering `AuditLogItem.params`
- **Mechanism**: `log.params` is an arbitrary `Record<string, any>` (e.g., `{ deployment: "coredns", replicas: 8 }`).
- **Defensive Solution**:
  ```tsx
  // Render key-value pairs cleanly or stringify
  {Object.entries(log.params || {}).map(([key, val]) => (
    <span key={key} className="mr-2 font-mono">
      <strong>{key}:</strong> {typeof val === 'object' ? JSON.stringify(val) : String(val)}
    </span>
  ))}
  ```

### Hazard 3: Payload Topology Mismatch between `api_server.py` and `orchestrator/agent.py`
- **Mechanism**: For `action_executed` events:
  - `api_server.py` sets `payload: act_res` (where `action`, `status`, `message` are at the top level of payload).
  - `orchestrator/agent.py` sets `payload: { incident_id, action, risk, result: act_res }` (where `result` is a nested sub-object).
- **Defensive Solution**:
  Extract action details defensively checking both top-level and nested `result` keys:
  ```tsx
  const actionName = ev.payload?.action || ev.payload?.result?.action || 'Unknown Action';
  const actionStatus = ev.payload?.status || ev.payload?.result?.status || 'Executed';
  ```

### Hazard 4: Tags Type Inconsistency (`string[]` vs CSV `string`)
- **Mechanism**: ChromaDB metadata stores tags as CSV strings (`"tag1, tag2"`), while mock and normalized schemas expose `string[]`. Calling `.map()` on a string causes a TypeError runtime crash; rendering an object tag causes `[object Object]`.
- **Defensive Solution**:
  ```tsx
  const safeTags: string[] = Array.isArray(doc.tags)
    ? doc.tags
    : typeof doc.tags === 'string'
    ? doc.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];
  ```

### Hazard 5: FastAPI Pydantic 422 `detail` Error Format
- **Mechanism**: On schema validation failure, FastAPI returns `detail` as an array of error objects (`[{ loc: [...], msg: "...", type: "..." }]`). Direct display of `err.detail` renders `[object Object]`.
- **Defensive Solution**:
  `services/api.ts:25-29` already handles this correctly by joining loc and msg strings. All custom fetch calls must route through `api.ts`.

---

## 5. Backend Preservation Boundaries & Invariants

The following files and contracts are strictly immutable:

| Invariant Component / File | Specific Preservation Boundary | Rationale |
|---|---|---|
| `interfaces.py` | Signatures: `retrieve(query: str, k: int)`, `remember(record: dict)`, `execute_action(action_type: str, params: dict)`, `emit_event(event: dict)` | Frozen multi-agent facade contract across llm and tools submodules |
| `api_server.py` | All 8 routes, endpoint paths (`/api/*`), Pydantic models (`RetrieveRequest`, `ActionRequest`, `EventRequest`, `PipelineRequest`), port 8000 | Frontend is a client only; breaking routes breaks CI and backend tests |
| `tools/actions.py` | Action types list (`SUPPORTED_ACTIONS`), parameter keys, return dict structure, `tools/audit.log` | Action engine and audit trail compliance |
| `tools/event_bus.py` | `_event_queue` format (`event_id`, `timestamp`, `type`, `payload`), `tools/events.jsonl` | Session timeline persistence |
| `rag/retrieve.py` | Collection name `sre_knowledge_base`, embedding model `all-MiniLM-L6-v2`, score normalization logic | ChromaDB dense vector indexing |
| `rag/chroma_db/` | SQLite & parquet vector index files | Pre-built embeddings for 35 operational documents |

---

## 6. Recommendations for Frontend Implementation

1. **Keep `src/services/api.ts` as Single Source of Truth**: All components must use `api.getHealth()`, `api.runPipeline()`, `api.retrieve()`, `api.executeAction()`, `api.listEvents()`, `api.clearEvents()`, and `api.getAuditLogs()`. Avoid ad-hoc `fetch()` calls in individual UI views.
2. **Implement Universal Defensive Renderers**: Use standard helper functions for formatting event payloads, timestamps, metric numbers, and tags.
3. **Preserve Proxy Configuration in `server.ts` & `vite.config.ts`**: Ensure proxy to `http://127.0.0.1:8000` remains intact so development works seamlessly whether testing against the live FastAPI server or mocked responses.
4. **Clean Monochrome & Typography Alignment**: The Palomino design requirement (pure blacks, whites, grays, 1px structural grid lines, large typography) is purely a styling and layout change in React TSX/CSS and does not necessitate any changes to data structures.
