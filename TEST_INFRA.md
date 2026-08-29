# AI SRE Console (Palomino Redesign) — E2E Test Infrastructure Specification

## 1. Test Philosophy & Principles

The AI SRE Console Palomino Redesign combines mission-critical site reliability engineering tooling with a high-end, minimal, cinematic aesthetic inspired by `palominoprod.com`. The end-to-end testing infrastructure is designed around the following foundational principles:

1. **Opaque-Box Contract Verification**: Test suites treat the frontend application and its backend interface layers as a cohesive system, verifying observable behavior, state transitions, API payloads, and UI output rather than relying on brittle internal component state.
2. **Strict Aesthetic & Styling Compliance**: The Palomino design language mandates strict monochrome tokens (`#000000`, `#FFFFFF`, neutral grays), 1px structural hairline grid lines, zero border radii (`0px`), massive aggressive display typography (`Syne` / `Sora`), structured monospace metrics (`IBM Plex Mono`), and un-filtered infrastructure photography. The test harness programmatically audits CSS tokens, classes, DOM structures, and asset bindings to guarantee visual integrity.
3. **Defensive Data Handling & Zero Crash Guarantee**: SRE telemetry and audit logs frequently contain complex, arbitrarily nested JSON payloads, null/undefined telemetry metrics, and irregular tag formats. The test suite stresses object sanitization pipelines to prevent `[object Object]` rendering bugs and React runtime crashes.
4. **Deterministic Multi-Tier Execution**: Tests are partitioned into 4 distinct tiers, executable seamlessly via standard Node/TypeScript tooling (`npx tsx tests/run_tests.ts` or `npm test`) with clear ANSI diagnostic output and explicit pass/fail assertions.

---

## 2. Feature Inventory & Test Coverage Matrix

| Feature ID | Feature Name | Target Components / Modules | Mapped Test Suite | Verification Type |
|---|---|---|---|---|
| **FEAT-01** | Strict Monochrome Tokens & Colors | `index.css`, `index.html`, `App.tsx` | Tier 1 (T1.1) | Static CSS & Token Audit |
| **FEAT-02** | 1px Structural Grid & 0px Radius | `index.css`, `Navbar.tsx`, `HeroSection.tsx` | Tier 1 (T1.2) | Layout & Boundary Rule Verification |
| **FEAT-03** | Typography Classes & Google Fonts | `index.html`, `index.css`, Section headers | Tier 1 (T1.3) | Font Family & Size Validation |
| **FEAT-04** | Cinematic Hero & Full-Bleed Imagery | `HeroSection.tsx`, `1_corridor.jpg` | Tier 1 (T1.4) | Asset Resolution & DOM Presence |
| **FEAT-05** | Hover-Reveal Image Interactions | `IncidentMarquee.tsx`, `SystemWorkflow.tsx` | Tier 1 (T1.5) | Cursor-Follow State & Asset Binding |
| **FEAT-06** | Express Proxy Routing & Endpoints | `server.ts`, `services/api.ts` | Tier 1 (T1.6) | HTTP Endpoint & Proxy Contract Test |
| **FEAT-07** | Complex Nested JSON Audit Logs | `AuditTimeline.tsx`, `services/api.ts` | Tier 2 (T2.1) | Serialization & Crash Prevention |
| **FEAT-08** | Null / Undefined Telemetry Resilience | `App.tsx`, `Navbar.tsx`, `AuditTimeline.tsx` | Tier 2 (T2.2) | Edge Case Fuzzing & Graceful Degradation |
| **FEAT-09** | Empty Event Timeline & Log Queues | `AuditTimeline.tsx`, `tools/event_bus.py` | Tier 2 (T2.3) | Zero-State Empty Array Handling |
| **FEAT-10** | RAG Tag Normalization & Metadata | `EvidenceRetrieval.tsx`, `rag/retrieve.py` | Tier 2 (T2.4) | Tag String/Array Transformation |
| **FEAT-11** | End-to-End Triage & Audit Lifecycle | `IncidentSimulator.tsx` -> `AuditTimeline.tsx` | Tier 3 (T3.1) | Cross-Feature Pipeline Execution |
| **FEAT-12** | Safety Control & Matrix Authorization | `SafetyControl.tsx`, `tools/actions.py` | Tier 3 (T3.2) | Action Matrix & Guardrail Authorization |
| **FEAT-13** | Real-World Incident: Payment 504 | `payment-api`, HTTP 504 Timeout Runbook | Tier 4 (T4.1) | Full SRE Incident Triage Scenario |
| **FEAT-14** | Real-World Incident: Memory Leak Remediation | Worker Pod OOMKilled & Replica Scaling | Tier 4 (T4.2) | Auto-Remediation & Service Recycling |
| **FEAT-15** | Real-World Incident: ChromaDB Vector Query | Vector Similarity & Runbook Matching | Tier 4 (T4.3) | Dense Embedding Retrieval Inspection |

---

## 3. Test Architecture (4 Tiers)

```
sre-console (1)/tests/
├── run_tests.ts                   # Master Test Runner & Suite Orchestrator
├── test_helpers.ts                # Shared Assertions, Mock Data, and Analyzers
├── tier1_feature_coverage.test.ts # Tier 1: Visual, Styling, Typography & Asset Tests
├── tier2_boundary_corner.test.ts  # Tier 2: Fuzzing, Boundary Conditions & Object Sanitization
├── tier3_cross_feature.test.ts    # Tier 3: State Flow & Cross-Feature Integration Tests
└── tier4_real_world_sre.test.ts   # Tier 4: Real-World SRE Scenario Simulations
```

### Tier 1: Feature & Aesthetic Conformance
- **T1.1 Monochrome Color Discipline**: Verifies that all styles, classes, and tokens prohibit colored text, buttons, backgrounds, or badges (only `#000000`, `#FFFFFF`, `#F9F9F9`, and neutral grays are permitted; color is reserved solely for photographic assets).
- **T1.2 1px Hairline Structural Layout**: Validates that sections use sharp 1px borders (`border-[#E5E5E5]`, `border-[#050505]`) with `0px` border radius enforcement across buttons and panels.
- **T1.3 Typography Hierarchy**: Asserts presence of `Syne`, `Sora`, and `IBM Plex Mono` fonts with explicit editorial prose and uppercase label styling.
- **T1.4 Full-Bleed Hero & Asset Pipeline**: Checks that all 8 high-resolution infrastructure JPGs exist in `src/assets/images/` and are correctly referenced.
- **T1.5 Hover-Reveal Dynamic Binding**: Verifies mouse-tracking preview cards and full-color photograph reveal bindings in `IncidentMarquee` and `SystemWorkflow`.
- **T1.6 Express Backend Proxy**: Validates proxy endpoints (`/api/health`, `/api/rag/retrieve`, `/api/tools/action`, `/api/events/list`, `/api/pipeline/run`, `/api/logs/audit`).

### Tier 2: Boundary & Corner Cases
- **T2.1 Deeply Nested Object Serialization**: Tests rendering of deeply nested objects, arrays, cyclical structures, and malformed JSON payloads to verify defensive stringification (`typeof val === 'object' ? JSON.stringify(val) : String(val)`).
- **T2.2 Null/Undefined/Sparse Telemetry**: Fuzzes API responses with missing properties, null payloads, undefined timestamps, and NaN latencies.
- **T2.3 Zero-State Empty Timeline**: Validates that empty event timelines, 0 search results, and blank audit logs render clean fallback states without errors.
- **T2.4 RAG Metadata Variations**: Tests varying tag structures (comma-separated strings, string arrays, null tags, numeric tags) for safe normalization.

### Tier 3: Cross-Feature Combinations
- **T3.1 Incident Simulation to Audit Pipeline Flow**: Simulates a complete user journey: Trigger incident -> Emit triage events -> Execute controlled remediation action -> Append to audit log -> Render on vertical timeline axis.
- **T3.2 Safety Guardrail Execution**: Tests authorization lifecycle: Select high-impact action (e.g. `rollback_deployment`) -> Trigger safety confirmation modal -> Validate JSON parameters -> Dispatch action -> Verify status feedback.

### Tier 4: Real-World SRE Scenarios
- **T4.1 Scenario 1: Payment API Gateway 504 Outage**: Replays production incident `INC-2026-005`, matches runbook `RB-004_API_GATEWAY_504_TIMEOUTS`, triggers `restart_service`, and validates latency recovery.
- **T4.2 Scenario 2: Memory Leak & Connection Pool Saturation**: Simulates database connection pool exhaustion on PostgreSQL, runs vector query, triggers `restart_database`, and logs postmortem.
- **T4.3 Scenario 3: ChromaDB Vector Retrieval Inspection**: Evaluates semantic search cosine similarity calculations, top-k retrieval bounds, and runbook score ranking.

---

## 4. Execution & Verification Guide

### Quick Start
To run all test tiers from the `sre-console (1)` directory:
```bash
cd "sre-console (1)"
npm test
```
Or directly via `tsx`:
```bash
npx tsx tests/run_tests.ts
```

### Individual Tier Execution
```bash
npx tsx tests/tier1_feature_coverage.test.ts
npx tsx tests/tier2_boundary_corner.test.ts
npx tsx tests/tier3_cross_feature.test.ts
npx tsx tests/tier4_real_world_sre.test.ts
```

---

## 5. Coverage & Quality Thresholds

| Metric | Target Threshold | Actual Status |
|---|---|---|
| **TypeScript Compilation (`tsc --noEmit`)** | 0 errors | Enforced |
| **Monochrome Color Conformance** | 100% compliant | Enforced |
| **Defensive Object Crash Prevention** | 100% passing | Enforced |
| **API Contract Conformance** | 100% matching | Enforced |
| **Tier 1 Feature Tests** | 100% passing | Enforced |
| **Tier 2 Boundary Tests** | 100% passing | Enforced |
| **Tier 3 Cross-Feature Tests** | 100% passing | Enforced |
| **Tier 4 Real-World SRE Tests** | 100% passing | Enforced |
