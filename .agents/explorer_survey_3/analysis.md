# Palomino Aesthetic & Component Architecture Survey

**Explorer**: Explorer 3 (Palomino Aesthetic & Component Architecture Surveyor)  
**Target Codebase**: `sre-console (1)`  
**Backend Reference**: FastAPI `api_server.py` (Port 8000) & Express Proxy `server.ts` (Port 3000)  
**Reference Design System**: `palominoprod.com`  
**Timestamp**: 2026-08-29T12:19:00+05:30  

---

## 1. Executive Summary

This survey establishes the complete visual specification, interaction design model, component architecture, asset allocation, and technical implementation plan required to transform the AI SRE Operation Console into the high-end, brutalist, minimal, cinematic aesthetic of **palominoprod.com**.

### Core Tenets of the Palomino Aesthetic
1. **Strict Monochrome Foundation**: Absolute pure whites (`#FFFFFF`), deep obsidian blacks (`#000000` / `#050505`), and calibrated neutral grays (`#111111`, `#222222`, `#333333`, `#666666`, `#888888`, `#CCCCCC`, `#E5E5E5`, `#F9F9F9`). Zero colored text, buttons, badges, status pills, or borders.
2. **1px Structural Grid Architecture**: Razor-sharp 1px boundary lines (`border-[#E5E5E5]` or `border-neutral-800`), 0px border-radii (`rounded-none` everywhere), and complete elimination of soft drop shadows (`shadow-*`).
3. **Dual Typographic Contrast**: Massive aggressive uppercase sans-serif headings (`Syne` / `Instrument Sans`, `text-6xl` to `text-9xl`, `tracking-tighter`, `leading-[0.85]`, `font-black`) juxtaposed with tight, structured monospace data displays (`IBM Plex Mono` / `JetBrains Mono`).
4. **Cinematic High-Contrast Photography**: High-contrast, authentic infrastructure imagery is the sole source of visual color/depth in the experience, featured as full-bleed backdrops and interactive hover-reveal previews.
5. **Palomino 4-Section Flow**: Hero → Selected Features (Hover-Reveal) → Key Figures (Large Metrics) → Audit Log (Forensic Grid Timeline).

---

## 2. Palomino Aesthetic & Visual Design Specification

### 2.1 Color Palette & Token System

| Token Name | Hex Code | Usage | Forbidden Alternatives |
|---|---|---|---|
| `bg-primary` | `#FFFFFF` | Main canvas, card containers | Colored backgrounds |
| `bg-secondary` | `#F9F9F9` | Table headers, secondary panels, inputs | Pastel tinted panels |
| `bg-dark` | `#050505` | Dark mode components, active buttons, terminal stages | Blue/indigo/purple dark tones |
| `text-primary` | `#050505` | Primary headings, active values, high-contrast labels | Colored text |
| `text-secondary` | `#333333` | Body copy, secondary metadata | Slate/blue-gray text |
| `text-meta` | `#666666` | Section index tags, timestamps, breadcrumbs | Colored tags |
| `text-muted` | `#999999` | Disabled text, passive grid coordinates | Muted colored text |
| `border-grid` | `#E5E5E5` | 1px structural grid lines, table cell boundaries | Drop shadows, thick colored borders |
| `border-dark` | `#050505` | Active focus borders, inverted buttons, key outlines | Cyan/blue glow outlines |

#### Strict Monochrome Status Cues Matrix
Instead of red/green/amber lights, use high-contrast architectural glyphs and typography:
- **Optimal / Online / Success**: `[ ONLINE ]` or `[ OPTIMAL ]` in solid black inverted pill (`bg-[#050505] text-[#FFFFFF] font-mono text-xs px-2.5 py-1 font-bold`) or solid black dot `●`.
- **Degraded / Warning**: `[ DEGRADED ]` in outline box (`border border-[#050505] bg-transparent text-[#050505] font-mono text-xs px-2.5 py-1 font-bold`).
- **Critical / Offline / Error**: `[ OFFLINE ]` in striped hatch / inverted alert block (`bg-[#111111] text-[#FFFFFF] border-2 border-[#050505] font-mono font-bold`) or hollow circle `○`.
- **Severity Tiers**:
  * `P1`: Solid Black Pill (`bg-[#050505] text-[#FFFFFF] font-bold`)
  * `P2`: 1px Border Pill (`border border-[#050505] bg-[#FFFFFF] text-[#050505]`)
  * `P3`: Muted Gray Pill (`bg-[#E5E5E5] text-[#333333]`)

### 2.2 1px Structural Grid & Box Model
- **No Soft Shadows**: Remove all Tailwind shadow utilities (`shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`).
- **No Border Radii**: Replace all `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full` (except strict 1:1 circle nodes on axes) with `rounded-none`.
- **Structural Lines**: Use crisp 1px borders for all layouts (`border-t`, `border-b`, `border-l`, `border-r border-[#E5E5E5]`).
- **Grid Crosshairs**: Use `+` and `//` markers in corners of section headers to accentuate the technical Swiss grid aesthetic.

### 2.3 Typography Architecture
- **Display Headings (`font-display`)**:
  * Font Family: `Syne`, sans-serif (weights: 700, 800, 900)
  * Styles: `uppercase`, `tracking-tighter` (`letter-spacing: -0.04em`), `leading-[0.85] - leading-[0.95]`, `font-black`
  * Sizes: `text-5xl` (mobile), `text-7xl` (tablet), `text-8xl` to `text-9xl` (desktop display)
- **Technical & Forensic Font (`font-mono`)**:
  * Font Family: `IBM Plex Mono`, `JetBrains Mono`, monospace (weights: 400, 500, 700)
  * Styles: `uppercase`, `tracking-widest` (`0.08em - 0.15em`), `tabular-nums`, crisp text rendering
  * Usages: Timestamps (`14:32:01.890 UTC`), Section indices (`// SECTION 01 // HERO`), Metrics (`99.99%`), Status tags (`[P1 // PAYMENT-API]`), JSON parameters.
- **Editorial Body Font (`font-sans`)**:
  * Font Family: `Inter`, `Instrument Sans`, sans-serif (weights: 400, 500, 600)
  * Line Height: `1.62`, Max Width: `65ch` for editorial readability.

---

## 3. Palomino 4-Section Architecture Map

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ NAVIGATION BAR: 1px Grid Border // Strict Monochrome System Status [OPTIMAL]   │
├────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 1: HERO                                                                │
│ - Full-bleed cinematic datacenter photography (1_corridor.jpg)                 │
│ - Massive overlapping display typography: "INFRASTRUCTURE INTO ACCOUNTABILITY" │
│ - Operational status badge, system coordinates (:8000, 35 vectors, 8 actions) │
│ - Primary [RUN SIMULATION] & Secondary [EXPLORE SYSTEM ↓] 1px Mono Buttons     │
├────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 2: SELECTED FEATURES & WORKFLOW (HOVER-REVEAL INTERACTION)             │
│ - Palomino signature cursor/row hover-reveal image preview gallery             │
│ - 01 Marquee // 02 Vector Search // 03 Action Engine // 04 Forensic Audit      │
│ - Interactive Live Incident Simulator & Automated Triage Pipeline              │
│ - Evidence Retrieval Gallery (ChromaDB semantic search cards)                  │
├────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 3: KEY FIGURES (LARGE TYPOGRAPHY METRICS & SAFETY CONTROLS)            │
│ - Giant display figures: [ 08 ] Actions, [ 99.99% ] SLA, [ < 1.8s ] MTTR       │
│ - [ 35 ] Vector Runbooks, [ 100% ] Forensic Audit, [ 0 ] Unmonitored Execs    │
│ - Strict Safety Boundary Matrix: 1px grid ruleset table & JSON executor        │
├────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 4: FORENSIC AUDIT LOG & TIMELINE                                       │
│ - 1px grid vertical axis timeline for Session Events & Disk-Backed Audit Logs  │
│ - Clean JSON object sanitization (zero [object Object] crashes)                │
│ - Collapsible monochrome Raw Data / Structured forensic inspectors             │
├────────────────────────────────────────────────────────────────────────────────┤
│ CLOSING SECTION & FOOTER: High-contrast cable array & 1px architectural grid   │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Detailed Section Breakdown

#### Section 1: Hero
- **Component File**: `src/components/sections/HeroSection.tsx`
- **Visuals**:
  * Full-bleed background container housing `1_corridor.jpg` with high-contrast architectural framing.
  * Massive overlapping headline in pure black/white typography:
    ```
    INFRASTRUCTURE
    INTO ACCOUNTABILITY
    ```
  * System coordinates bar:
    `FASTAPI // PORT 8000` | `CHROMADB // ALL-MINILM-L6-V2` | `ACTIONS // 8 STRICT PROTOCOLS` | `AUDIT // TOOLS/AUDIT.LOG`
  * Status indicator: `SYSTEM STATUS: [OPTIMAL // ONLINE]`
  * Smooth scroll CTA buttons navigating directly to `#simulator` and `#workflow`.

#### Section 2: Selected Features (Palomino Hover-Reveal Interaction)
- **Component Files**: 
  * `src/components/sections/IncidentMarquee.tsx`
  * `src/components/sections/SystemWorkflow.tsx`
  * `src/components/sections/IncidentSimulator.tsx`
  * `src/components/sections/EvidenceRetrieval.tsx`
- **Interaction Mechanism**:
  * Hovering over list items or marquee tags spawns a floating image preview card that smoothly follows the user's cursor (`x`, `y` tracking via `requestAnimationFrame` or CSS transform), instantly transitioning between relevant infrastructure photography assets.
  * System Workflow stage transitions (01 Alert Received -> 02 Evidence Retrieved -> 03 Response Controlled) with GSAP scroll pin and synchronized image crossfades.
  * Live Incident Simulator: 40/60 1px grid layout allowing on-demand triage simulations (P1/P2/P3, target service, incident payload) connected to `/api/pipeline/run`.
  * Evidence Gallery: ChromaDB semantic vector search input and horizontal card rail showing match scores, runbook tags, and source excerpts.

#### Section 3: Key Figures & Safety Controls
- **Component File**: `src/components/sections/SafetyControl.tsx` (and dedicated Key Figures grid)
- **Visuals**:
  * Large metric display cards with 1px borders:
    * `08` — Predefined Controlled Action Protocols
    * `99.99%` — Error Budget & SLA Target
    * `< 1.8s` — Autonomous Mean Time to Remediate (MTTR)
    * `35` — Indexed Runbooks in Cosine Vector Space
    * `100%` — Immutable Audit Trail Retention
    * `0` — Unmonitored Actions Permitted
  * Safety Boundary Ruleset Table: 1px grid layout listing each protocol (`restart_service`, `rollback_deployment`, `restart_pod`, `restart_database`, `scale_deployment`, `create_ticket`, `notify_team`, `generate_postmortem`), execution boundaries, and clearance requirements.
  * High-Impact Action Guard Modal: Redesigned into strict monochrome high-contrast dialog.

#### Section 4: Forensic Audit Log
- **Component File**: `src/components/sections/AuditTimeline.tsx`
- **Visuals**:
  * 1px structural grid timeline with prominent monospace timestamps (`HH:MM:SS.mmm UTC`).
  * Tab switcher for Session Event Bus vs. Disk-Backed Audit Logs (`/api/logs/audit`).
  * **Nested Object Sanitization**:
    * Clean recursive formatter rendering objects, arrays, and primitive values as structured key-value tables instead of unhandled object expressions.
    * Eliminates `[object Object]` rendering bugs.
    * Expandable monochrome JSON inspector.
  * Action controls: `[ REFRESH ]` and `[ CLEAR STATE ]` monochrome 1px border buttons.

---

## 4. Cinematic Infrastructure Photography Plan

| File Path | Description | Visual Theme | Assigned Section / Trigger |
|---|---|---|---|
| `src/assets/images/1_corridor.jpg` | Bright datacenter corridor with server aisles | Scale, Perspective, Infrastructure | **Section 1: Hero** (Full-bleed backdrop & main hero anchor) |
| `src/assets/images/2_rack_leds.jpg` | Close-up server rack activity LEDs and patch bays | Telemetry, Activity, Signal | **Section 2: Selected Features** (Hover trigger for "Incident Detection") |
| `src/assets/images/3_cables.jpg` | High-density ethernet and optical cabling array | Connectivity, Vector Memory | **Section 2 & Closing Section** (Hover trigger for "ChromaDB Dense Search") |
| `src/assets/images/4_engineer.jpg` | SRE operator at terminal in server room | Human Oversight, Clearance | **Section 2: Selected Features** (Hover trigger for "Safety Quorum") |
| `src/assets/images/5_control_room.jpg` | Command & control operations wall with monitors | Situational Awareness, Triage | **Section 2: System Workflow** (Stage 01: Alert Received) |
| `src/assets/images/6_hardware.jpg` | Silicon motherboard, heatsinks, circuit traces | Compute, Determinism, Audit | **Section 2: Marquee & Section 4: Audit** (Hover trigger for "Forensic Log") |
| `src/assets/images/7_switch.jpg` | Enterprise network switch with illuminated ports | Routing, Controlled Execution | **Section 2: System Workflow** (Stage 03: Response Controlled) |
| `src/assets/images/8_team.jpg` | SRE response team in tactical war room | Accountability, Governance | **Section 3: Key Figures** (Background / contextual imagery) |

---

## 5. Technical Codebase Audit & Required Fixes

### 5.1 TypeScript Compilation & Type Definitions
During our survey, running `tsc --noEmit` revealed two categories of TypeScript errors:
1. **Missing Vite Client Declaration**:
   `Cannot find module '../../assets/images/*.jpg' or its corresponding type declarations.`
   * **Fix Required**: Create `src/vite-env.d.ts` with `/// <reference types="vite/client" />` and explicit image module declarations (`declare module '*.jpg';`).
2. **Missing Interface Exports in `src/types.ts`**:
   Older components and `src/data/mockData.ts` import interfaces that were omitted from `types.ts` (`ActiveView`, `ServiceHealthItem`, `AutonomousAction`, `Incident`, `SimulationScenario`, `KnowledgeDoc`, `SystemLog`, `KpiMetrics`).
   * **Fix Required**: Ensure all models in `src/types.ts` are fully typed and exported.

### 5.2 Express Server API Proxy Completeness (`server.ts`)
The Python backend (`api_server.py`) exposes 8 endpoints on port 8000. `server.ts` proxies most of them to port 3000, but lacks explicit routes for:
- `GET /api/logs/audit` -> Proxies to `http://127.0.0.1:8000/api/logs/audit`
- `POST /api/events/clear` -> Proxies to `http://127.0.0.1:8000/api/events/clear`
- **Fix Required**: Add these proxy handlers in `server.ts` to guarantee 100% backend compatibility.

### 5.3 Web Fonts Loading (`index.html`)
`index.html` currently imports `Cinzel` and `Playfair Display`, while `index.css` defines `--font-display: 'Syne'`.
- **Fix Required**: Update `index.html` Google Fonts `<link>` to load:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Syne:wght@700;800;900&display=swap" rel="stylesheet" />
  ```

### 5.4 Object Sanitization in Audit Log Timeline
To prevent `[object Object]` rendering bugs when complex event payloads or Python dictionaries are rendered:
- **Fix Required**: Implement a robust `renderPayload(payload: any)` helper in `AuditTimeline.tsx` and `IncidentSimulator.tsx` that inspects primitive vs. nested object types, rendering keys and values cleanly in structured monospace tables.

---

## 6. Implementation Roadmap for Implementation Agents

1. **Step 1: Type System & Build Configuration**
   - Create `src/vite-env.d.ts`.
   - Update `src/types.ts` with complete type definitions.
   - Update `index.html` font imports.
   - Add missing proxy routes in `server.ts`.
   - Run `npm run lint` / `tsc --noEmit` to verify clean build.

2. **Step 2: Core Style System & Design Tokens (`index.css`)**
   - Configure Tailwind v4 `@theme` tokens for strict monochrome colors.
   - Define custom utility classes: `.border-grid`, `.font-display`, `.btn-sre-mono`, `.btn-sre-outline-mono`.

3. **Step 3: Section Component Transformation**
   - Transform `Navbar.tsx` into monochrome 1px grid bar with text-based status indicator.
   - Refactor `HeroSection.tsx` into full-bleed cinematic hero with massive overlapping typography.
   - Refactor `IncidentMarquee.tsx` with smooth cursor-following hover-reveal image previews.
   - Refactor `SystemWorkflow.tsx` with GSAP pinned timeline and photography sync.
   - Refactor `IncidentSimulator.tsx` with 40/60 1px grid and monochrome form controls.
   - Refactor `EvidenceRetrieval.tsx` with horizontal card gallery and monochrome badges.
   - Refactor `SafetyControl.tsx` with Key Figures metrics cards, 1px ruleset matrix, and monochrome modal.
   - Refactor `AuditTimeline.tsx` with vertical 1px axis, robust object sanitization, and dual session/disk tabs.
   - Refactor `ClosingSection.tsx` with high-contrast photography and minimal footer.

4. **Step 4: Verification & Acceptance Testing**
   - Verify zero colored text/buttons/badges across all views.
   - Verify hover-reveal interaction works seamlessly.
   - Verify incident simulation and live FastAPI pipeline execution.
   - Verify `npm run dev` and `npm run lint` pass with 0 errors.
