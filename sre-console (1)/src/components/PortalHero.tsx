import React, { useEffect, useState } from 'react';
import { ShieldCheck, Activity, Cpu, Database, Server, GitPullRequest } from 'lucide-react';

interface PortalHeroProps {
  isPipelineRunning?: boolean;
}

export const PortalHero: React.FC<PortalHeroProps> = ({ isPipelineRunning = false }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById('portalContainer');
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight - window.innerHeight;
      
      if (containerHeight <= 0) return;
      
      // Calculate progress [0.0 to 1.0] through hero container
      const currentScroll = -rect.top;
      let progress = currentScroll / containerHeight;
      progress = Math.max(0, Math.min(1, progress));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Motion calculations driven strictly by scroll position (reversible)
  const panelShift = scrollProgress * 110; // >100px / 110% travel
  const topologyScale = 1.05 - (scrollProgress * 0.05); // 1.05 -> 1.0
  const titleScale = 1.0 + (scrollProgress * 0.3); // 1.0 -> 1.3
  const titleTracking = 0.05 - (scrollProgress * 0.08); // 0.05em -> -0.03em
  const spanShift = scrollProgress * 28; // 0vw -> 28vw
  const dotX = scrollProgress * 42; // 0vw -> 42vw
  const dotY = scrollProgress * 35; // 0vh -> 35vh

  return (
    <div id="portalContainer" className="relative w-full h-[220vh] bg-[#0A0C0E]">
      {/* Sticky Stage */}
      <div className="sticky top-0 w-full h-screen overflow-hidden isolation-isolate flex items-center justify-center border-b border-[#EDE7DC]/13">
        
        {/* Layer 1: Original SVG/CSS Infrastructure Topology Graph */}
        <div 
          className="absolute inset-0 w-full h-full flex items-center justify-center transition-transform duration-75"
          style={{ transform: `scale(${topologyScale})` }}
        >
          <svg className="w-full h-full max-w-5xl max-h-[600px] p-6 text-[#9EA5A8]/30" viewBox="0 0 800 500" fill="none">
            {/* Connection Lines */}
            <path d="M 400 100 L 250 250" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M 400 100 L 550 250" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M 250 250 L 180 400" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M 250 250 L 330 400" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M 550 250 L 480 400" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M 550 250 L 620 400" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            
            {/* Signal Pulse Line when pipeline runs */}
            {isPipelineRunning && (
              <circle cx="400" cy="100" r="4" fill="#E8913C">
                <animate attributeName="cx" values="400;250;180" dur="2s" repeatCount="indefinite" />
                <animate attributeName="cy" values="100;250;400" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
          </svg>

          {/* Node Cards */}
          <div className="absolute inset-0 max-w-5xl max-h-[600px] m-auto pointer-events-none">
            {/* Gateway */}
            <div className="absolute top-[80px] left-[50%] -translate-x-[50%] bg-[#101317] border border-[#EDE7DC]/13 px-4 py-2 rounded flex items-center gap-2">
              <Server className="w-4 h-4 text-[#2E6B72]" />
              <div>
                <div className="text-[10px] font-mono text-[#9EA5A8]">INGRESS</div>
                <div className="font-display text-xs text-[#EDE7DC]">api-gateway</div>
              </div>
            </div>

            {/* Microservice */}
            <div className="absolute top-[230px] left-[28%] -translate-x-[50%] bg-[#101317] border border-[#E8913C] px-4 py-2 rounded flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#E8913C]" />
              <div>
                <div className="text-[10px] font-mono text-[#E8913C]">TARGET SERVICE</div>
                <div className="font-display text-xs text-[#EDE7DC]">payment-api (P1)</div>
              </div>
            </div>

            {/* Auth Worker */}
            <div className="absolute top-[230px] left-[72%] -translate-x-[50%] bg-[#101317] border border-[#EDE7DC]/13 px-4 py-2 rounded flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#2E6B72]" />
              <div>
                <div className="text-[10px] font-mono text-[#9EA5A8]">AUTH / WORKER</div>
                <div className="font-display text-xs text-[#EDE7DC]">identity-provider</div>
              </div>
            </div>

            {/* Postgres */}
            <div className="absolute top-[380px] left-[20%] -translate-x-[50%] bg-[#101317] border border-[#EDE7DC]/13 px-4 py-2 rounded flex items-center gap-2">
              <Database className="w-4 h-4 text-[#2E6B72]" />
              <div>
                <div className="text-[10px] font-mono text-[#9EA5A8]">DATABASE</div>
                <div className="font-display text-xs text-[#EDE7DC]">postgres-cluster</div>
              </div>
            </div>

            {/* Redis Cache */}
            <div className="absolute top-[380px] left-[40%] -translate-x-[50%] bg-[#101317] border border-[#EDE7DC]/13 px-4 py-2 rounded flex items-center gap-2">
              <Server className="w-4 h-4 text-[#2E6B72]" />
              <div>
                <div className="text-[10px] font-mono text-[#9EA5A8]">CACHE</div>
                <div className="font-display text-xs text-[#EDE7DC]">redis-cache</div>
              </div>
            </div>
          </div>
        </div>

        {/* Layer 2: Radial Veil */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(10,12,14,0.9)_90%)] pointer-events-none z-10" />

        {/* Layer 3: Solid Left & Right Panels (Meeting at Center initially) */}
        <div 
          className="absolute top-0 left-0 w-[50.5%] h-full bg-[#0A0C0E] z-20 transition-transform duration-75"
          style={{ transform: `translateX(-${panelShift}%)` }}
        />
        <div 
          className="absolute top-0 right-0 w-[50.5%] h-full bg-[#0A0C0E] z-20 transition-transform duration-75"
          style={{ transform: `translateX(${panelShift}%)` }}
        />

        {/* Layer 4: Accent Dots Travelling Outward */}
        <div 
          className="absolute w-2 h-2 rounded-full bg-[#E8913C] z-30 pointer-events-none"
          style={{ 
            top: '50%', left: '50%',
            transform: `translate(-${dotX}vw, -${dotY}vh)` 
          }}
        />
        <div 
          className="absolute w-2 h-2 rounded-full bg-[#2E6B72] z-30 pointer-events-none"
          style={{ 
            top: '50%', left: '50%',
            transform: `translate(${dotX}vw, ${dotY}vh)` 
          }}
        />

        {/* Layer 5: Split Title Wordmark */}
        <div 
          className="relative z-40 text-center select-none pointer-events-none transition-transform duration-75"
          style={{ 
            transform: `scale(${titleScale})`,
            letterSpacing: `${titleTracking}em`
          }}
        >
          <h1 className="font-display text-6xl md:text-9xl font-extrabold text-[#EDE7DC] tracking-tighter flex items-center justify-center gap-6">
            <span 
              className="inline-block transition-transform duration-75"
              style={{ transform: `translateX(-${spanShift}vw)` }}
            >
              AI
            </span>
            <span 
              className="inline-block transition-transform duration-75 text-[#E8913C]"
              style={{ transform: `translateX(${spanShift}vw)` }}
            >
              SRE
            </span>
          </h1>
        </div>

        {/* Layer 6: Corner Pins */}
        <div className="absolute top-20 left-8 z-50 text-[11px] font-mono text-[#9EA5A8] uppercase tracking-widest">
          RAG INCIDENT TRIAGE // CONTROLLED REMEDIATION
        </div>
        <div className="absolute top-20 right-8 z-50 text-[11px] font-mono text-[#9EA5A8] uppercase tracking-widest text-right">
          AUDITABLE WORKFLOW
        </div>
        <div className="absolute bottom-8 left-8 z-50 text-[11px] font-mono text-[#6C7378] uppercase tracking-widest">
          EMBEDDINGS: ALL-MINILM-L6-V2 // CHROMADB
        </div>
        <div className="absolute bottom-8 right-8 z-50 text-[11px] font-mono text-[#E8913C] uppercase tracking-widest">
          SCROLL TO UNCOVER TOPOLOGY ↓
        </div>
      </div>

      {/* Statement Fold Below Hero */}
      <div className="w-full min-h-[60vh] bg-[#0A0C0E] border-b border-[#EDE7DC]/13 flex flex-col justify-center px-8 md:px-24 py-16">
        <div className="text-[11px] font-mono text-[#9EA5A8] uppercase tracking-widest mb-4">
          // OPERATIONAL PRINCIPLE
        </div>
        <h2 className="font-display text-3xl md:text-6xl text-[#EDE7DC] max-w-4xl leading-tight">
          Diagnose with evidence. <br />
          Respond <span className="text-[#E8913C]">with control</span>. <br />
          Leave an audit trail.
        </h2>
      </div>
    </div>
  );
};
