import React, { useEffect, useState } from 'react';
import { ArrowDown, Play, FileText, Database, Shield } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY || window.pageYOffset);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Parallax and scale calculations bound to scroll position
  const imageScale = Math.max(1.0, 1.08 - scrollY * 0.0003);
  const textTranslate = scrollY * 0.15;

  return (
    <section className="relative w-full min-h-screen bg-[#090909] text-[#F3F1EC] flex flex-col justify-between overflow-hidden pt-[58px]">
      {/* Background High-Res Monochrome Data Center Photograph */}
      <div className="absolute inset-0 w-full h-full overflow-hidden opacity-40">
        <img
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2000&q=90"
          alt="Monochrome Data Center Server Infrastructure"
          className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-75"
          style={{ transform: `scale(${imageScale})` }}
        />
        {/* Dark Monochrome Veil */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/60 to-transparent" />
      </div>

      {/* Thin Scanning Line Animation */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-[#F3F1EC]/30 animate-pulse pointer-events-none" />

      {/* Top Metadata Strip */}
      <div className="relative z-10 px-6 md:px-12 pt-8 flex justify-between items-center text-[11px] font-mono text-[#686868] uppercase tracking-widest border-b border-[#F3F1EC]/10 pb-4">
        <div>// OPERATIONAL INCIDENT RESPONSE ENGINE</div>
        <div className="hidden md:block">VERIFIED REPOSITORY DATA CONTRACT</div>
      </div>

      {/* Main Hero Content */}
      <div 
        className="relative z-10 px-6 md:px-12 py-16 max-w-6xl transition-transform duration-75"
        style={{ transform: `translateY(${textTranslate}px)` }}
      >
        <div className="label-caps text-[#686868] mb-4">// AGENTIC RELIABILITY CONSOLE</div>
        
        <h1 className="font-display text-5xl md:text-8xl lg:text-9xl font-extrabold text-[#F3F1EC] tracking-tighter leading-none mb-8">
          INCIDENTS <br />
          DON’T WAIT.
        </h1>

        <p className="prose-editorial text-lg md:text-xl text-[#D8D6D0] mb-12 font-sans">
          AI-assisted incident triage grounded in operational runbooks, controlled actions and a complete audit trail.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => scrollToSection('simulator')}
            className="btn-sre-dark-outline bg-[#F3F1EC] text-[#090909] hover:bg-transparent hover:text-[#F3F1EC] border-[#F3F1EC] py-4 px-8"
          >
            <Play className="w-4 h-4" /> RUN A SIMULATION
          </button>
          <button
            onClick={() => scrollToSection('workflow')}
            className="btn-sre-dark-outline py-4 px-8"
          >
            EXPLORE THE SYSTEM <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Metadata Strip (Confirmed by Repository) */}
      <div className="relative z-10 border-t border-[#F3F1EC]/10 bg-[#090909]/80 backdrop-blur-md px-6 md:px-12 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-xs">
          <div className="space-y-1">
            <div className="text-[10px] text-[#686868] uppercase">VECTOR DATASET</div>
            <div className="font-bold text-[#F3F1EC]">20 INCIDENT RECORDS</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-[#686868] uppercase">OPERATIONAL GUIDE</div>
            <div className="font-bold text-[#F3F1EC]">15 RUNBOOKS INDEXED</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-[#686868] uppercase">EMBEDDINGS MODEL</div>
            <div className="font-bold text-[#F3F1EC]">CHROMADB / ALL-MINILM</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-[#686868] uppercase">REMEDIATION ENGINE</div>
            <div className="font-bold text-[#F3F1EC]">CONTROLLED AUDIT LOG</div>
          </div>
        </div>
      </div>
    </section>
  );
};
