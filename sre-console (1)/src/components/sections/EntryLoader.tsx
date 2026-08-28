import React, { useEffect, useState } from 'react';

export const EntryLoader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem('sre_entry_shown')) {
      onComplete();
      return;
    }

    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 600);
    const t3 = setTimeout(() => setStage(3), 900);
    const t4 = setTimeout(() => {
      sessionStorage.setItem('sre_entry_shown', 'true');
      onComplete();
    }, 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#050505] text-[#FFFFFF] z-[100] flex flex-col justify-between p-8 md:p-16 font-mono select-none">
      <div className="flex justify-between items-center text-sm tracking-widest text-[#8E8E8E] uppercase">
        <div>AI SRE // SYSTEM INITIALISING</div>
        <div>[01/03]</div>
      </div>

      <div className="space-y-6 max-w-xl mx-auto w-full text-center">
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tighter text-[#FFFFFF]">
          AI SRE
        </h1>

        {/* Progress Line */}
        <div className="w-full h-[2px] bg-[#141414] overflow-hidden relative">
          <div 
            className="h-full bg-[#FFFFFF] transition-all duration-300 ease-out"
            style={{ width: `${(stage + 1) * 25}%` }}
          />
        </div>

        <div className="flex justify-around text-sm tracking-widest text-[#C7C7C7] uppercase pt-2">
          <span className={stage >= 1 ? 'text-[#FFFFFF] font-bold' : 'text-[#686868]'}>MEMORY</span>
          <span className={stage >= 2 ? 'text-[#FFFFFF] font-bold' : 'text-[#686868]'}>RETRIEVAL</span>
          <span className={stage >= 3 ? 'text-[#FFFFFF] font-bold' : 'text-[#686868]'}>CONTROL</span>
        </div>
      </div>

      <div className="text-[12px] text-[#8E8E8E] text-center tracking-widest uppercase">
        FASTAPI · CHROMADB · ALL-MINILM-L6-V2
      </div>
    </div>
  );
};
