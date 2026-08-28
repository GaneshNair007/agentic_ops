import React from 'react';
import { ExternalLink, Terminal, Search, Shield, Cpu } from 'lucide-react';

interface NavbarProps {
  isBackendOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isBackendOnline }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Desktop & Mobile Prominent Fixed Navbar (Height: 76px) */}
      <nav className="fixed top-0 left-0 w-full h-[76px] bg-[#F5F3EE]/98 backdrop-blur-md border-b-2 border-[#050505] z-50 flex items-center justify-between px-6 md:px-12 lg:px-16 transition-all shadow-md">
        
        {/* Left Branding */}
        <div className="flex items-center gap-6">
          <span 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-display text-2xl md:text-3xl font-black tracking-tight text-[#050505] cursor-pointer hover:opacity-80 transition-opacity"
          >
            AI SRE<span className="text-[#050505]">.</span>
          </span>
          <span className="hidden lg:inline-block text-xs font-mono font-bold text-[#202020] border-l-2 border-[#050505] pl-4 uppercase tracking-widest">
            AGENTIC INCIDENT RISK TRIAGE SYSTEM
          </span>
        </div>

        {/* Middle Navigation Links (Bigger, Bold, High Readability) */}
        <div className="hidden md:flex items-center gap-8 font-mono text-sm md:text-base font-extrabold tracking-wider text-[#050505]">
          <button onClick={() => scrollToSection('workflow')} className="hover:underline underline-offset-8 decoration-2 transition-all">
            WORKFLOW
          </button>
          <button onClick={() => scrollToSection('simulator')} className="hover:underline underline-offset-8 decoration-2 transition-all">
            SIMULATOR
          </button>
          <button onClick={() => scrollToSection('evidence')} className="hover:underline underline-offset-8 decoration-2 transition-all">
            EVIDENCE
          </button>
          <button onClick={() => scrollToSection('safety')} className="hover:underline underline-offset-8 decoration-2 transition-all">
            SAFETY
          </button>
          <button onClick={() => scrollToSection('audit')} className="hover:underline underline-offset-8 decoration-2 transition-all">
            AUDIT
          </button>
        </div>

        {/* Right Actions & Status */}
        <div className="flex items-center gap-4">
          <div className="hidden xl:flex items-center gap-2 text-xs font-mono font-extrabold uppercase px-3 py-1.5 border border-[#050505] bg-[#050505] text-[#F1F1F1]">
            <span className={`w-2.5 h-2.5 rounded-full ${isBackendOnline ? 'bg-[#FFFFFF] animate-pulse' : 'bg-[#686868]'}`} />
            <span>{isBackendOnline ? 'API ONLINE' : 'API OFFLINE'}</span>
          </div>

          <a 
            href="https://github.com/arjitujjawal-art/agentic_ops" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:inline-flex btn-sre-outline-mono text-xs md:text-sm font-bold py-2.5 px-4 border-2 border-[#050505]"
          >
            VIEW SOURCE <ExternalLink className="w-4 h-4" />
          </a>

          <button 
            onClick={() => scrollToSection('simulator')}
            className="btn-sre-mono text-xs md:text-sm font-extrabold py-2.5 px-6 shadow-lg"
          >
            LAUNCH CONSOLE
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar with Labels & Icons */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#050505] border-t-2 border-white z-50 flex items-center justify-around px-2 text-[#F1F1F1]">
        <button onClick={() => scrollToSection('workflow')} className="flex flex-col items-center gap-1 text-xs font-mono uppercase font-bold">
          <Cpu className="w-5 h-5" />
          <span>Workflow</span>
        </button>
        <button onClick={() => scrollToSection('simulator')} className="flex flex-col items-center gap-1 text-xs font-mono uppercase font-bold">
          <Terminal className="w-5 h-5" />
          <span>Console</span>
        </button>
        <button onClick={() => scrollToSection('evidence')} className="flex flex-col items-center gap-1 text-xs font-mono uppercase font-bold">
          <Search className="w-5 h-5" />
          <span>Evidence</span>
        </button>
        <button onClick={() => scrollToSection('safety')} className="flex flex-col items-center gap-1 text-xs font-mono uppercase font-bold">
          <Shield className="w-5 h-5" />
          <span>Safety</span>
        </button>
      </div>
    </>
  );
};
