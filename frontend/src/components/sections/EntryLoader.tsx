import React, { useEffect, useState } from 'react';

export const EntryLoader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  const STAGE_MESSAGES = [
    'INITIALIZING_KERNEL // FASTAPI_PORT_8000',
    'MOUNTING_CHROMADB // ALL-MINILM-L6-V2_EMBEDDINGS',
    'CALIBRATING_SAFETY_MATRIX // 8_CONTROLLED_PROTOCOLS',
    'SYSTEM_ONLINE // PALOMINO_OPERATIONS_READY'
  ];

  useEffect(() => {
    if (sessionStorage.getItem('sre_entry_shown')) {
      onComplete();
      return;
    }

    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 650);
    const t3 = setTimeout(() => setStage(3), 950);
    const t4 = setTimeout(() => {
      sessionStorage.setItem('sre_entry_shown', 'true');
      onComplete();
    }, 1300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#000000] text-[#FFFFFF] z-[100] flex flex-col justify-between p-6 md:p-12 font-mono select-none border border-[#262626]">
      {/* 4 Corner Crosshairs */}
      <span className="absolute top-3 left-3 text-[#555555] text-xs font-mono">+</span>
      <span className="absolute top-3 right-3 text-[#555555] text-xs font-mono">+</span>
      <span className="absolute bottom-3 left-3 text-[#555555] text-xs font-mono">+</span>
      <span className="absolute bottom-3 right-3 text-[#555555] text-xs font-mono">+</span>

      {/* Top Header Bar */}
      <div className="flex justify-between items-center text-xs tracking-[0.25em] text-[#737373] uppercase border-b border-[#262626] pb-4">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-[#FFFFFF] animate-pulse" />
          <span>AI SRE // AUTONOMOUS INCIDENT RESPONSE</span>
        </div>
        <div className="text-[#A3A3A3]">
          [STAGE 0{stage + 1}/04]
        </div>
      </div>

      {/* Center Stage */}
      <div className="space-y-8 max-w-2xl mx-auto w-full text-center py-12">
        <div className="space-y-2">
          <div className="font-mono text-xs tracking-[0.4em] text-[#737373] uppercase">
            // CRITICAL INFRASTRUCTURE DEFENSE ENGINE
          </div>
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-[#FFFFFF] leading-[0.85]">
            AI SRE
          </h1>
        </div>

        {/* 1px Structural Progress Bar */}
        <div className="w-full h-[1px] bg-[#262626] overflow-hidden relative">
          <div 
            className="h-full bg-[#FFFFFF] transition-all duration-300 ease-out"
            style={{ width: `${(stage + 1) * 25}%` }}
          />
        </div>

        {/* Telemetry Stage Message */}
        <div className="font-mono text-xs text-[#A3A3A3] tracking-widest uppercase h-6">
          &gt; {STAGE_MESSAGES[stage]}
        </div>

        {/* Subsystem Readiness Indicators */}
        <div className="grid grid-cols-3 gap-2 pt-2 text-xs tracking-wider uppercase border-t border-[#262626] pt-6">
          <div className={`p-2 border transition-colors ${stage >= 1 ? 'border-[#FFFFFF] bg-[#0A0A0A] text-[#FFFFFF] font-bold' : 'border-[#262626] text-[#555555]'}`}>
            [01. MEMORY]
          </div>
          <div className={`p-2 border transition-colors ${stage >= 2 ? 'border-[#FFFFFF] bg-[#0A0A0A] text-[#FFFFFF] font-bold' : 'border-[#262626] text-[#555555]'}`}>
            [02. RETRIEVAL]
          </div>
          <div className={`p-2 border transition-colors ${stage >= 3 ? 'border-[#FFFFFF] bg-[#0A0A0A] text-[#FFFFFF] font-bold' : 'border-[#262626] text-[#555555]'}`}>
            [03. CONTROL]
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] text-[#737373] tracking-widest uppercase border-t border-[#262626] pt-4 gap-2">
        <div>FASTAPI · CHROMADB · ALL-MINILM-L6-V2</div>
        <div>STRICT_MODE: ACTIVE // AUDIT_BUS: ONLINE</div>
      </div>
    </div>
  );
};

