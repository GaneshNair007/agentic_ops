import React from 'react';
import { ExternalLink, Power } from 'lucide-react';

export const ClosingSection: React.FC = () => {
  const scrollToSimulator = () => {
    const el = document.getElementById('simulator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full h-screen bg-[#050505] text-[#F1F1F1] flex flex-col items-center justify-center overflow-hidden border-t border-[#333]">
      {/* Background Full-Colour Infrastructure Photography Darkened */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2560&q=90"
          alt="Full Color Server Infrastructure"
          className="w-full h-full object-cover opacity-30 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-[#000000] opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
      </div>

      {/* Cinematic Main Content */}
      <div className="relative z-10 w-full px-6 flex flex-col items-center text-center space-y-16">
        <div>
          <div className="label-caps text-[#E8913C] mb-6 tracking-[0.5em]">// AI SRE OPERATION COMPLETE</div>
          <h2 className="font-display text-6xl md:text-8xl lg:text-[140px] font-black leading-[0.85] tracking-tighter text-[#FFFFFF] drop-shadow-2xl">
            THE END OF<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] to-[#8E8E8E]">ALERT FATIGUE</span>
          </h2>
        </div>

        {/* Substantial CTA */}
        <button
          onClick={scrollToSimulator}
          className="group relative inline-flex items-center justify-center bg-[#E8913C] hover:bg-[#FFFFFF] text-[#050505] font-mono font-bold text-xl md:text-2xl uppercase tracking-widest py-6 px-16 transition-all duration-300 shadow-[0_0_50px_rgba(232,145,60,0.3)] hover:shadow-[0_0_80px_rgba(255,255,255,0.5)]"
        >
          <Power className="w-8 h-8 mr-4" />
          DEPLOY ENGINE
          <div className="absolute inset-0 border-2 border-[#E8913C] scale-110 opacity-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500" />
        </button>
      </div>

      {/* Minimal Footer Footer */}
      <div className="absolute bottom-0 w-full z-10 px-6 py-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-[#8E8E8E] gap-4 tracking-widest">
        <div>AI SRE // V2.0.0</div>
        <div>FASTAPI · REACT · CHROMADB</div>
        <a 
          href="https://github.com/GaneshNair007/agentic_ops" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-[#FFFFFF] transition-colors flex items-center gap-2"
        >
          GITHUB REPOSITORY <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </section>
  );
};
