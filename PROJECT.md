# Project: AI SRE Operation Console (Palomino Redesign)

## Architecture
The AI SRE Operation Console is a high-performance incident response and operations console redesigned into a high-end, minimal, cinematic aesthetic matching `palominoprod.com`.

- **Frontend Core**: React 19, TypeScript 5.8, Tailwind CSS v4, GSAP 3 + ScrollTrigger, Lenis smooth scroll, Lucide icons. Located at `sre-console (1)`.
- **Proxy Server**: Express proxy server in `server.ts` (port 3000) proxying `/api/*` to the Python backend.
- **Backend (Untouched/Frozen)**: FastAPI server in `api_server.py` (port 8000), ChromaDB vector store in `rag/chroma_db/`, action execution in `tools/actions.py`, event bus in `tools/event_bus.py`, frozen facade in `interfaces.py`.
- **Visual Design System**: Strict monochrome foundation (#000000, #FFFFFF, neutral grays) with high-contrast cinematic infrastructure photography as the sole source of color. Razor-sharp 1px structural grid lines, massive bold typography (`Syne` / `Sora` + `IBM Plex Mono` / `JetBrains Mono`), 0px border radius, and interactive cursor-following hover-reveal image interactions.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Strict Monochrome Design Tokens & Fonts | Pure black/white/gray color tokens in `index.css`, Google Fonts (`Syne`, `IBM Plex Mono`, `Sora`) in `index.html`, elimination of all colored badges/buttons/shadows/radii | M1 | Survey |
| 2 | TypeScript Definitions & Module Declarations | `src/vite-env.d.ts` for image assets, full `src/types.ts` exports, legacy component type resolution, clean `tsc --noEmit` and `npm run dev` | M1 | Survey |
| 3 | Section 1: Cinematic Full-Bleed Hero & Telemetry | `HeroSection.tsx` with full-bleed `1_corridor.jpg` background, massive overlapping headline ("INFRASTRUCTURE INTO ACCOUNTABILITY"), live telemetry strip, monochrome actions | M2 | Survey |
| 4 | Section 3: Key Figures & Safety Control Matrix | `SafetyControl.tsx` with large typography metric KPI figures (`08` protocols, `99.99%` SLA, `<1.8s` MTTR), 1px safety boundary ruleset grid, action executor | M2 | Survey |
| 5 | Section 2: Selected Features & Hover-Reveal Interactions | `IncidentMarquee.tsx`, `SystemWorkflow.tsx`, `EvidenceRetrieval.tsx`, `IncidentSimulator.tsx` with smooth cursor-following hover-reveal infrastructure image interactions | M3 | Survey |
| 6 | Section 4: Forensic Audit Log Timeline & Object Sanitization | `AuditTimeline.tsx` with minimal 1px vertical grid, defensive serialization preventing `[object Object]` and React child rendering crashes | M3 | Survey |
| 7 | Navigation Bar, Status Pill & Closing Footer | `Navbar.tsx`, `ClosingSection.tsx`, monochrome operational status indicators (`[OPTIMAL]`, `[OFFLINE]`, `[P1]`), clean minimal header/footer | M2 | Survey |
| 8 | E2E Testing Suite & Multi-Tier Verification | Comprehensive opaque-box test harness validating TypeScript compilation, monochrome styling constraints, hover-reveal interactions, simulation pipelines, and audit rendering | M4 / E2E Track | Survey |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Foundation, Tokens & Type Safety | `index.html`, `index.css`, `src/vite-env.d.ts`, `src/types.ts`, `server.ts`, resolve legacy TS errors so `tsc --noEmit` compiles cleanly | none | DONE |
| 2 | Hero Section & Key Figures Metrics | `HeroSection.tsx`, `SafetyControl.tsx`, `Navbar.tsx`, `ClosingSection.tsx`, `EntryLoader.tsx` with full-bleed imagery, massive typography, 1px grid KPI displays | M1 | DONE |
| 3 | Selected Features (Hover-Reveal) & Audit Timeline | `IncidentMarquee.tsx`, `SystemWorkflow.tsx`, `IncidentSimulator.tsx`, `EvidenceRetrieval.tsx`, `AuditTimeline.tsx` with hover-reveal image previews & `[object Object]` crash prevention | M1 | DONE |
| 4 | Integration & E2E Acceptance Verification | Pass 100% of E2E tests, zero TS errors, verified incident simulation and audit log rendering with backend | M2, M3, E2E Track | DONE |

## Interface Contracts
### Frontend `services/api.ts` ↔ Express `server.ts` ↔ FastAPI `api_server.py`
- `GET /api/health` -> `{ status: "ok", backend: "online" | "offline", ... }`
- `POST /api/pipeline/run` -> Body: `{ service?: string, severity?: string, symptom?: string }` -> `{ status: "success", incident_id: string, diagnosis: object, plan: string, action_executed: string, verification: string }`
- `POST /api/rag/retrieve` -> Body: `{ query: string, k?: number }` -> `Array<{ id: string, content: string, metadata: object, distance: number }>`
- `POST /api/tools/action` -> Body: `{ action_type: string, params: object }` -> `{ success: boolean, action_type: string, result: string, timestamp: string }`
- `GET /api/events/list` -> `{ count: number, events: Array<{ id: string, type: string, payload: object, timestamp: string }> }`
- `GET /api/logs/audit` -> `Array<{ timestamp: string, action_type: string, params: object, status: string, details?: string }>`
- `POST /api/events/clear` -> `{ status: "cleared" }`

### Defensive Rendering Contract for Objects
- Any arbitrary payload in audit events or tool execution logs MUST be sanitized with safe serialization:
  `typeof val === 'object' && val !== null ? JSON.stringify(val, null, 2) : String(val ?? '')`
- Array tags from ChromaDB metadata MUST be safely normalized:
  `Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map(s => s.trim()) : []`

## Code Layout
- `sre-console (1)/`
  - `index.html` — Entry HTML, Google font imports (`Syne`, `Sora`, `IBM Plex Mono`, `JetBrains Mono`).
  - `server.ts` — Express proxy server and development entry point.
  - `package.json`, `tsconfig.json`, `vite.config.ts` — Build & dependency configurations.
  - `src/`
    - `vite-env.d.ts` — Vite client and image asset module declarations (`*.jpg`, `*.png`, `*.svg`).
    - `index.css` — Tailwind v4 configuration, font variables, monochrome color rules, 0px radius enforcement.
    - `App.tsx` — Main page component orchestrating the 4 Palomino sections.
    - `types.ts` — Unified TypeScript interfaces for SRE telemetry, incidents, actions, audit logs, and events.
    - `assets/images/` — 8 cinematic infrastructure photography JPG assets (`1_corridor.jpg` through `8_team.jpg`).
    - `services/api.ts` — API client interfacing with Express/FastAPI backend.
    - `data/mockData.ts` — Fallback mock data and telemetry presets.
    - `components/`
      - `layout/Navbar.tsx` — Minimal monochrome header and operational status pill.
      - `sections/EntryLoader.tsx` — Minimal monochromatic loading screen.
      - `sections/HeroSection.tsx` — Full-bleed infrastructure image with massive overlapping typography.
      - `sections/IncidentMarquee.tsx` — High-contrast alert ticker with cursor hover-reveal image previews.
      - `sections/SystemWorkflow.tsx` — SRE triage pipeline with hover-reveal infrastructure stages.
      - `sections/IncidentSimulator.tsx` — Incident trigger controls and diagnosis execution panel.
      - `sections/EvidenceRetrieval.tsx` — ChromaDB vector search interface and evidence gallery.
      - `sections/SafetyControl.tsx` — Key Figures metrics and 1px safety boundary ruleset matrix.
      - `sections/AuditTimeline.tsx` — Minimal 1px vertical axis audit log and event bus timeline.
      - `sections/ClosingSection.tsx` — Monochromatic closing statement and system telemetry status.
