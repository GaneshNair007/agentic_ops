import React from 'react';
import { ExternalLink, Play } from 'lucide-react';

export const ClosingSection: React.FC = () => {
  const scrollToSimulator = () => {
    const el = document.getElementById('simulator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full min-h-[90vh] bg-[#090909] text-[#F3F1EC] flex flex-col justify-between p-8 md:p-16 overflow-hidden">
      {/* Background High-Res Monochrome Infrastructure Photograph */}
      <div className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2000&q=90"
          alt="Monochrome Computing Infrastructure"
          className="w-full h-full object-cover grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/80 to-transparent" />
      </div>

      {/* Main Closing Title */}
      <div className="relative z-10 max-w-5xl space-y-8 my-auto">
        <div className="label-caps text-[#686868]">// OPERATIONAL MISSION</div>
        <h2 className="font-display text-4xl md:text-7xl lg:text-8xl font-extrabold leading-none tracking-tight text-[#F3F1EC]">
          DIAGNOSE WITH EVIDENCE. <br />
          RESPOND WITH CONTROL. <br />
          LEAVE AN AUDIT TRAIL.
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            onClick={scrollToSimulator}
            className="btn-sre-dark-outline bg-[#F3F1EC] text-[#090909] hover:bg-transparent hover:text-[#F3F1EC] border-[#F3F1EC] py-4 px-8"
          >
            <Play className="w-4 h-4" /> LAUNCH INCIDENT SIMULATOR
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
      <div className="relative z-10 pt-12 border-t border-[#F3F1EC]/15 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-[#686868] gap-4">
        <div>AI SRE // AGENTIC INCIDENT RISK TRIAGE SYSTEM</div>
        <div>DEVELOPED BY GANESH NAIR</div>
        <div>FASTAPI · REACT · TYPESCRIPT · CHROMADB</div>
        <a 
          href="https://github.com/arjitujjawal-art/agentic_ops" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-[#F3F1EC] transition-colors"
        >
          GITHUB REPOSITORY ↗
        </a>
      </div>
    </section>
  );
};
