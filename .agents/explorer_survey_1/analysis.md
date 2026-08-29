# AI SRE Operation Console — Frontend Codebase Survey & Technical Architecture Report

**Survey Date:** 2026-08-29  
**Target Codebase:** `sre-console (1)`  
**Target Aesthetic:** `palominoprod.com` Minimal Cinematic Monochrome  
**Explorer:** Explorer 1 (Frontend Codebase Surveyor)

---

## 1. Executive Summary

The `sre-console (1)` frontend is a high-performance React 19 + TypeScript single-page narrative application built with Vite 6, Tailwind CSS v4, GSAP 3, Lenis smooth scrolling, and Lucide React icons. It is designed to interface with a local FastAPI backend running on port 8000 (proxied via an Express server in `server.ts`).

While the application currently features modern single-page section scrolling in `src/components/sections/`, several critical architectural discrepancies, color-palette contaminations (accent greens/reds/golds), legacy file compilation breaks, and layout mismatches exist when measured against the strict Palomino production aesthetic specified in `ORIGINAL_REQUEST.md`.

---

## 2. Environment, Tooling & Dependency Architecture

### 2.1 Framework & Core Dependencies (`package.json`)
- **React Runtime:** React `^19.0.1` & `react-dom` `^19.0.1`
- **Build System:** Vite `^6.4.3` with `@vitejs/plugin-react` `^5.0.4`
- **Styling System:** Tailwind CSS `^4.1.14` with `@tailwindcss/vite` `^4.1.14` (Tailwind v4 `@import "tailwindcss";`)
- **Animation & Motion:** 
  - `gsap` `^3.15.0` + `@gsap/react` `^2.1.2` (ScrollTrigger pinning & smooth tweens)
  - `lenis` `^1.3.26` (smooth wheel scrolling)
  - `motion` `^12.23.24` (modern Motion/Framer Motion)
- **Icons:** `lucide-react` `^0.546.0`
- **Backend / Server / AI Client:**
  - `express` `^4.22.2` (BFF proxy & static server in `server.ts`)
  - `@google/genai` `^2.4.0`
  - `dotenv` `^17.4.2`
  - `tsx` `^4.23.9`, `esbuild` `^0.25.0`, `typescript` `~5.8.2`

### 2.2 Server & Dev Runtime (`server.ts` & `vite.config.ts`)
- `npm run dev` executes `npx tsx server.ts`.
- `server.ts` initializes Express on `PORT = 3000` with Vite middleware in development.
- Proxies all `/api/*` routes to `http://127.0.0.1:8000` (the Python FastAPI server):
  - `GET  /api/health` -> FastAPI `/api/health`
  - `POST /api/rag/retrieve` -> FastAPI `/api/rag/retrieve` (ChromaDB vector query)
  - `POST /api/tools/action` -> FastAPI `/api/tools/action` (Controlled action execution)
  - `GET  /api/events/list` -> FastAPI `/api/events/list` (Event bus stream)
  - `POST /api/pipeline/run` -> FastAPI `/api/pipeline/run` (Automated triage pipeline)
  - `POST /api/ai/diagnose` -> Fallback / AI diagnosis endpoint

---

## 3. Codebase Structure & Component Inventory

### 3.1 Directory Layout
```
sre-console (1)/
├── assets/
├── dist/
├── index.html
├── package.json
├── server.ts
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── App.tsx                     # Main narrative controller (Lenis + Section flow)
    ├── index.css                   # Tailwind v4 import & custom CSS variables / typography
    ├── main.tsx                    # React DOM root render
    ├── types.ts                    # Core API models (Pipeline, Action, RAG, Events, Audit)
    ├── assets/
    │   └── images/                 # 8 high-resolution infrastructure JPGs
    │       ├── 1_corridor.jpg      # Data center corridor with glowing server lights
    │       ├── 2_rack_leds.jpg     # Server rack green/amber LEDs & hardware blades
    │       ├── 3_cables.jpg        # Vibrant blue/yellow patch cabling
    │       ├── 4_engineer.jpg      # SRE engineer inspecting rack hardware
    │       ├── 5_control_room.jpg  # NOC command center monitors
    │       ├── 6_hardware.jpg      # High-density server motherboard components
    │       ├── 7_switch.jpg        # Fiber optic switches and transceivers
    │       └── 8_team.jpg          # DevOps / SRE operations team
    ├── services/
    │   └── api.ts                  # Typed HTTP client communicating with backend
    ├── data/
    │   └── mockData.ts             # Legacy mock fixtures (contains TS errors)
    └── components/
        ├── layout/
        │   └── Navbar.tsx          # Top navigation bar with status indicator
        ├── sections/               # Active Single-Page Narrative Components (Rendered in App.tsx)
        │   ├── EntryLoader.tsx     # Monochromatic bootloader screen sequence
        │   ├── HeroSection.tsx     # Hero banner with primary CTA
        │   ├── IncidentMarquee.tsx # Horizontal animated ticker with hover-reveal thumbnail
        │   ├── SystemWorkflow.tsx  # GSAP ScrollTrigger 3-stage pinned workflow story
        │   ├── IncidentSimulator.tsx # Interactive incident trigger & pipeline output
        │   ├── EvidenceRetrieval.tsx # Horizontal pinned ChromaDB vector evidence gallery
        │   ├── SafetyControl.tsx   # Controlled actions matrix & execution guard modal
        │   ├── AuditTimeline.tsx   # Dual-view forensic event bus & audit log timeline
        │   ├── ClosingSection.tsx  # Closing manifesto CTA & minimal footer
        │   ├── ArchitectureStory.tsx # Unused legacy section
        │   ├── ProblemSection.tsx    # Unused legacy section
        │   └── ProblemStatement.tsx  # Unused legacy section
        └── (Legacy / Deprecated Multi-View Components in src/components/):
            ├── OverviewView.tsx, TelemetryView.tsx, SimulatorView.tsx,
            ├── KnowledgeBaseView.tsx, LogsView.tsx, IncidentHistoryView.tsx,
            ├── CommandOverview.tsx, PortalHero.tsx, SideNavBar.tsx, TopNavBar.tsx,
            └── DeployPatchModal.tsx, GlobalSearchModal.tsx, IncidentDetailModal.tsx,
                RunbookExecutionModal.tsx, SettingsModal.tsx, SupportModal.tsx, TopologyModal.tsx
```

---

## 4. Requirement Gap Analysis (Current State vs. Palomino Specification)

| Feature / Requirement | Current Implementation in `sre-console (1)` | Required Palomino Aesthetic (`ORIGINAL_REQUEST.md`) | Gap / Redesign Plan |
|---|---|---|---|
| **R1. Strict Monochrome Foundation** | Contains colored elements: `text-green-600`, `bg-green-500`, `bg-red-500`, `text-red-700`, `bg-orange-100`, `selection:bg-[#d4af37]` | Strict B&W (#000000, #FFFFFF, grays #141414, #333333, #666666, #E5E5E5, #F9F9F9). The **only** color source must be bright, unfiltered photography. | Remove all colored badges, text, error backgrounds, and buttons. Replace with high-contrast monochrome badges and 1px border states. |
| **R2. Hero Section** | 2-column split (text left, image right) in `HeroSection.tsx` | Full-bleed infrastructure image background with massive overlapping bold sans-serif text (e.g. `INFRASTRUCTURE INTO ACCOUNTABILITY`). | Overhaul `HeroSection.tsx` into a cinematic full-bleed hero with bold typography overlapping high-contrast infrastructure photography. |
| **R2. Hover-Reveal Image Interactions** | Small floating cursor thumbnail on `IncidentMarquee.tsx`; pinned image crossfade on `SystemWorkflow.tsx` | Palomino-style hover-reveal image interactions where hovering marquee items or workflow stages reveals/swaps cinematic photography dynamically. | Upgrade `IncidentMarquee.tsx` and `SystemWorkflow.tsx` with smooth GSAP / cursor-anchored full-bleed preview interactions. |
| **R2. Key Figures & Metrics** | Standard HTML table in `SafetyControl.tsx` | Large typography metrics and key figures (e.g. `8 CONTROLLED ACTIONS`, `100% AUDITABLE`, `0 UNBOUNDED WRITES`, `35 RUNBOOKS`). | Incorporate a prominent Palomino-style Key Figures metric grid with massive numerical typography and 1px grid borders. |
| **R2. Audit Log Timeline** | Vertical line with circular dots and tab switcher in `AuditTimeline.tsx` | Structured, grid-based minimal timeline with 1px borders and strict typographic discipline. | Redesign `AuditTimeline.tsx` into a clean, 1px grid-based timeline view with zero `[object Object]` crashes and raw data toggle. |
| **R3. Backend Preservation** | `api.ts` maps to `/api/health`, `/api/rag/retrieve`, `/api/tools/action`, `/api/events/list`, `/api/pipeline/run` | FastAPI backend (`http://127.0.0.1:8000`), ChromaDB embeddings (`all-MiniLM-L6-v2`), and action engine must remain 100% intact. | Retain all existing API signatures and data structures in `api.ts` and `types.ts`. |
| **R4. TypeScript / Build Cleanliness** | `tsc --noEmit` fails with 32 errors in unused legacy components and missing image module definitions | `npm run dev` and `npm run lint` must pass with 0 errors. | Add `src/vite-env.d.ts` with image declarations; clean up or fix type references in legacy files and `mockData.ts`. |

---

## 5. Asset & Icon Catalog

### 5.1 Photography Assets (`src/assets/images/`)
All images are high-resolution, uncompressed, high-contrast DevOps/infrastructure photographs:
1. `1_corridor.jpg` (455 KB) — Long datacenter aisle with illuminated blue/white server racks. Ideal for Hero.
2. `2_rack_leds.jpg` (471 KB) — Close-up server LEDs and blades. Ideal for Evidence Gallery / Triage.
3. `3_cables.jpg` (278 KB) — Dense patch cables and switchboard. Ideal for Workflow / Closing.
4. `4_engineer.jpg` (279 KB) — SRE Engineer in server environment. Ideal for Incident Simulation.
5. `5_control_room.jpg` (670 KB) — NOC control room with multi-screen monitoring. Ideal for Workflow Stage 1.
6. `6_hardware.jpg` (430 KB) — Silicon micro-architecture & motherboard hardware. Ideal for Marquee reveal.
7. `7_switch.jpg` (461 KB) — High-throughput fiber optical networking switches. Ideal for Safety Controls.
8. `8_team.jpg` (358 KB) — SRE incident response team in collaborative triage. Ideal for Evidence Gallery.

### 5.2 Icons & Typography
- **Icon Library:** `lucide-react` (AlertTriangle, ArrowDown, Play, Search, Cpu, ShieldAlert, CheckCircle2, Wrench, RefreshCw, Trash2, Code, Power, ExternalLink, Menu, etc.).
- **Typography Stack:**
  - Display Headings: `font-display` (Syne / Inter Black / Archivo Black, uppercase, heavy tracking).
  - Body Copy: `font-sans` (Inter / Sora, clean neutral grotesque).
  - Technical / Forensics / Metrics: `font-mono` (JetBrains Mono / IBM Plex Mono).
- **Structural Lines:** Strict `1px` solid rules (`#E5E5E5`, `#333333`, `#141414`), no drop shadows or rounded border radii (`radius: 0px`).

---

## 6. Recommendations for Implementation Team

1. **Fix TypeScript Declarations First:**
   - Create `src/vite-env.d.ts` with `/// <reference types="vite/client" />` and explicit image declarations (`*.jpg`, `*.png`, `*.svg`).
   - Clean up or reconcile legacy multi-view components and `mockData.ts` so `tsc --noEmit` runs clean.
2. **Execute Palomino Layout Redesign:**
   - **Hero:** Convert `HeroSection.tsx` to full-bleed photography with massive overlapping typography ("INFRASTRUCTURE INTO ACCOUNTABILITY") and stark monochrome CTA buttons.
   - **Marquee & Selected Features:** Enhance `IncidentMarquee.tsx` and `SystemWorkflow.tsx` with smooth hover-reveal photography interactions.
   - **Key Figures:** Embed high-impact typographic metric figures in `SafetyControl.tsx`.
   - **Audit Timeline:** Transform `AuditTimeline.tsx` into a structured, minimal 1px grid layout.
3. **Enforce Absolute Monochrome:**
   - Purge all colored text, badges, status dots, and button backgrounds across all components.
   - Use contrast, opacity, typographic weight, and 1px borders for state hierarchy.
