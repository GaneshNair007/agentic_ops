import React, { useState } from 'react';
import imgHardware from '../../assets/images/6_hardware.jpg';
import imgRack from '../../assets/images/2_rack_leds.jpg';
import imgCables from '../../assets/images/3_cables.jpg';
import imgEngineer from '../../assets/images/4_engineer.jpg';
import imgControl from '../../assets/images/5_control_room.jpg';
import imgSwitch from '../../assets/images/7_switch.jpg';
import imgTeam from '../../assets/images/8_team.jpg';

interface MarqueeItem {
  code: string;
  service: string;
  symptom: string;
  action: string;
  image: string;
  meta: string;
}

const MARQUEE_SIGNALS: MarqueeItem[] = [
  {
    code: 'P1 // CRITICAL',
    service: 'PAYMENT-API',
    symptom: 'HTTP 504 GATEWAY TIMEOUT ON /V1/CHECKOUT',
    action: 'RESTART_SERVICE',
    image: imgHardware,
    meta: 'NODE_RACK_04 // HOST_ID: SRE-US-E1-09',
  },
  {
    code: 'VECTOR // DENSE',
    service: 'CHROMADB',
    symptom: 'ALL-MINILM-L6-V2 384-DIM COSINE SEARCH',
    action: 'RETRIEVE_RUNBOOK',
    image: imgRack,
    meta: '35 DOCS INDEXED // LATENCY 14MS',
  },
  {
    code: 'REMEDIATION // RUN',
    service: 'USER-PROFILE-PG',
    symptom: 'DB CONNECTION POOL EXHAUSTION (100/100 SLOTS)',
    action: 'RESTART_DATABASE',
    image: imgCables,
    meta: 'PG_MAX_CONN // TRANSACTION_QUEUE',
  },
  {
    code: 'DISPATCH // CORE',
    service: 'COREDNS-CLUSTER',
    symptom: 'NXDOMAIN FLOODING RESOLUTION LATENCY > 450MS',
    action: 'SCALE_DEPLOYMENT',
    image: imgSwitch,
    meta: 'REPLICAS: 4 -> 8 // P99 LATENCY 4MS',
  },
  {
    code: 'FORENSICS // AUDIT',
    service: 'EVENT-BUS',
    symptom: 'APPEND-ONLY IMMUTABLE EVENT TIMELINE',
    action: 'LOG_EXECUTION',
    image: imgTeam,
    meta: 'TOOLS/AUDIT.LOG // ZERO DRIFT',
  },
  {
    code: 'TELEMETRY // LIVE',
    service: 'INGRESS-EDGE',
    symptom: 'ANOMALY DETECTED P99 SPIKE 1850MS',
    action: 'TRIAGE_PIPELINE',
    image: imgControl,
    meta: 'SYNTHETIC PROBES // HEALTH RESTORED',
  },
  {
    code: 'SAFETY // MATRIX',
    service: 'SRE-GUARD',
    symptom: '8 CONTROLLED PROTOCOLS ENFORCED',
    action: 'AUTHORIZE_ACTION',
    image: imgEngineer,
    meta: '0PX RADIUS // 1PX STRUCTURAL GRID',
  },
];

const SELECTED_FEATURES = [
  {
    id: '01',
    category: 'VECTOR INTELLIGENCE',
    title: 'CHROMADB DENSE SEARCH',
    description: '35 production incidents and runbooks embedded into high-dimensional vector space for sub-millisecond retrieval during live outages.',
    tag: 'ALL-MINILM-L6-V2 // 384-DIM',
    image: imgRack,
  },
  {
    id: '02',
    category: 'AGENTIC TRIAGE',
    title: 'AUTOMATED INCIDENT PIPELINE',
    description: 'Autonomous orchestration correlating telemetry symptoms, executing semantic runbook matching, and dispatching controlled remediations.',
    tag: 'FASTAPI ENGINE // E2E REST',
    image: imgEngineer,
  },
  {
    id: '03',
    category: 'SAFETY GOVERNANCE',
    title: 'CONTROLLED ACTION MATRIX',
    description: 'Eight predefined, auditable operations with parameter validation and explicit confirmation guardrails for high-impact protocols.',
    tag: '8 MAPPED PROTOCOLS // BOUNDED',
    image: imgHardware,
  },
  {
    id: '04',
    category: 'FORENSIC AUDITABILITY',
    title: 'IMMUTABLE TIMELINE LOGS',
    description: 'Real-time session event stream combined with disk-persisted audit logs featuring defensive JSON serialization and zero telemetry crashes.',
    tag: 'APPEND-ONLY // ZERO DRIFT',
    image: imgTeam,
  },
];

export const IncidentMarquee: React.FC = () => {
  const [hoverImage, setHoverImage] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <section 
      id="features-marquee" 
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverImage(null)}
      className="relative w-full bg-[#050505] text-[#FFFFFF] border-b border-[#262626] overflow-hidden select-none"
    >
      {/* Floating Cursor-Follow Hover Preview Image */}
      {hoverImage && (
        <div 
          className="fixed pointer-events-none z-50 transition-transform duration-100 ease-out hidden md:block"
          style={{
            left: `${cursorPos.x + 24}px`,
            top: `${cursorPos.y - 120}px`,
            width: '280px',
            height: '180px',
          }}
        >
          <div className="w-full h-full border border-[#FFFFFF] bg-[#000000] p-1 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            <img 
              src={hoverImage} 
              alt="Telemetry Preview" 
              className="w-full h-full object-cover grayscale contrast-125"
            />
            <div className="absolute bottom-2 right-2 bg-[#000000]/90 text-[#FFFFFF] px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest border border-white/20">
              REVEAL // LIVE
            </div>
          </div>
        </div>
      )}

      {/* Top Header Label Strip */}
      <div className="w-full border-b border-[#262626] px-6 md:px-12 py-3 bg-[#0A0A0A] flex items-center justify-between font-mono text-xs text-[#888888] uppercase tracking-widest">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 bg-[#FFFFFF]" />
          <span>REAL-TIME INCIDENT TELEMETRY STREAM</span>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <span>// PALOMINO SECTION 02</span>
        </div>
      </div>

      {/* Continuous Marquee Rail */}
      <div className="relative w-full h-20 border-b border-[#262626] overflow-hidden flex items-center bg-[#050505]">
        <div className="flex whitespace-nowrap animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused] font-mono text-sm tracking-widest uppercase">
          {[...MARQUEE_SIGNALS, ...MARQUEE_SIGNALS, ...MARQUEE_SIGNALS].map((item, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoverImage(item.image)}
              className="inline-flex items-center gap-4 mx-6 px-4 py-2 hover:bg-[#FFFFFF] hover:text-[#050505] transition-colors cursor-pointer border border-transparent hover:border-[#FFFFFF] group"
            >
              <span className="font-bold text-[#FFFFFF] group-hover:text-[#050505]">{item.code}</span>
              <span className="text-[#555555] group-hover:text-[#888888]">//</span>
              <span className="font-bold">{item.service}</span>
              <span className="text-[#555555] group-hover:text-[#888888]">//</span>
              <span>{item.symptom}</span>
              <span className="text-[#737373] text-xs">[{item.action}]</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Features Grid List */}
      <div className="w-full divide-y divide-[#262626]">
        {SELECTED_FEATURES.map((feat) => (
          <div
            key={feat.id}
            onMouseEnter={() => setHoverImage(feat.image)}
            className="group relative px-6 md:px-12 lg:px-24 py-16 md:py-24 flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:bg-[#111111] transition-colors cursor-crosshair"
          >
            {/* Left: Step & Title */}
            <div className="flex items-start md:items-center gap-6 md:gap-12 flex-1">
              <span className="font-mono text-2xl md:text-3xl font-bold text-[#555555] group-hover:text-[#FFFFFF] transition-colors">
                [{feat.id}]
              </span>
              <div>
                <div className="label-caps text-[#888888] text-sm mb-2 group-hover:text-[#D4D4D4] transition-colors">
                  {feat.category}
                </div>
                <h3 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#FFFFFF] tracking-tight break-normal leading-none uppercase">
                  {feat.title}
                </h3>
              </div>
            </div>

            {/* Middle: Editorial Description */}
            <div className="lg:max-w-md xl:max-w-lg text-[#A3A3A3] font-sans text-base md:text-lg leading-relaxed group-hover:text-[#FFFFFF] transition-colors lg:ml-12 xl:ml-24 break-normal">
              {feat.description}
            </div>

            {/* Right: Metadata Tag */}
            <div className="font-mono text-xs md:text-sm text-[#555555] group-hover:text-[#FFFFFF] whitespace-nowrap uppercase tracking-widest flex items-center gap-3 transition-colors mt-4 lg:mt-0">
              <span>{feat.tag}</span>
              <span className="text-xl transition-transform group-hover:translate-x-2">→</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
