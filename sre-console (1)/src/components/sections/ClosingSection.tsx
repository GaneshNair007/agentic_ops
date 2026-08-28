import React from 'react';
import { ExternalLink, Play } from 'lucide-react';

export const ClosingSection: React.FC = () => {
  const scrollToSimulator = () => {
    const el = document.getElementById('simulator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full min-h-[90vh] bg-[#050505] text-[#FFFFFF] flex flex-col justify-between p-8 md:p-16 overflow-hidden">
      {/* Background Monochrome Image Tunnel */}
      <div className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2000&q=90"
          alt="Computing Infrastructure"
          className="w-full h-full object-cover grayscale contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
      </div>

      {/* Main Closing Title */}
      <div className="relative z-10 max-w-5xl space-y-8 my-auto">
        <div className="label-caps text-[#8E8E8E]">// OPERATIONAL MISSION</div>
        <h2 className="font-display text-4xl md:text-7xl lg:text-8xl font-extrabold leading-none tracking-tight text-[#FFFFFF]">
          EVIDENCE. <br />
          CONTROL. <br />
          ACCOUNTABILITY.
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            onClick={scrollToSimulator}
            className="btn-sre-dark-outline bg-[#FFFFFF] text-[#050505] hover:bg-transparent hover:text-[#FFFFFF] py-4 px-8"
          >
            <Play className="w-4 h-4 fill-current" /> LAUNCH THE SIMULATOR
          </button>
          <a
            href="https://github.com/arjitujjawal-art/agentic_ops"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-sre-dark-outline py-4 px-8"
          >
            VIEW GITHUB REPOSITORY <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Footer Details */}
      <div className="relative z-10 pt-12 border-t border-white/15 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-[#8E8E8E] gap-4">
        <div>AI SRE // AGENTIC INCIDENT RISK TRIAGE SYSTEM</div>
        <div>DEVELOPED BY GANESH NAIR</div>
        <div>FASTAPI · REACT · TYPESCRIPT · CHROMADB</div>
        <a 
          href="https://github.com/arjitujjawal-art/agentic_ops" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-[#FFFFFF] transition-colors"
        >
          GITHUB REPOSITORY ↗
        </a>
      </div>
    </section>
  );
};
