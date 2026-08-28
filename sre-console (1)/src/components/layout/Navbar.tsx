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
      {/* Desktop & Mobile Prominent Fixed Navbar (Height: 120px) */}
      <nav className="fixed top-0 left-0 w-full h-[120px] bg-[#F5F3EE]/98 backdrop-blur-md border-b-2 border-[#050505] z-50 flex items-center justify-between px-6 md:px-12 lg:px-16 transition-all shadow-md">
        
        {/* Left Branding */}
        <div className="flex items-center gap-6">
          <span 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-display text-4xl md:text-5xl font-black tracking-tight text-[#050505] cursor-pointer hover:opacity-80 transition-opacity"
          >
            AI SRE<span className="text-[#050505]">.</span>
          </span>
          <span className="hidden xl:inline-block text-sm font-mono font-bold text-[#202020] border-l-2 border-[#050505] pl-4 uppercase tracking-widest">
            AGENTIC INCIDENT RISK TRIAGE SYSTEM
          </span>
        </div>

        {/* Middle Navigation Links (Bigger, Bold, High Readability) */}
        <div className="hidden lg:flex items-center gap-8 font-mono text-lg xl:text-xl font-extrabold tracking-wider text-[#050505]">
          <button onClick={() => scrollToSection('workflow')} className="hover:underline underline-offset-8 decoration-4 transition-all">
            WORKFLOW
          </button>
          <button onClick={() => scrollToSection('simulator')} className="hover:underline underline-offset-8 decoration-4 transition-all">
            SIMULATOR
          </button>
          <button onClick={() => scrollToSection('evidence')} className="hover:underline underline-offset-8 decoration-4 transition-all">
            EVIDENCE
          </button>
          <button onClick={() => scrollToSection('safety')} className="hover:underline underline-offset-8 decoration-4 transition-all">
            SAFETY
          </button>
          <button onClick={() => scrollToSection('audit')} className="hover:underline underline-offset-8 decoration-4 transition-all">
            AUDIT
          </button>
        </div>

        {/* Right Actions & Status */}
        <div className="flex items-center gap-4">
          <div className="hidden xl:flex items-center gap-2 text-sm font-mono font-extrabold uppercase px-4 py-2 border border-[#050505] bg-[#050505] text-[#F1F1F1]">
            <span className={`w-3 h-3 rounded-full ${isBackendOnline ? 'bg-[#FFFFFF] animate-pulse' : 'bg-[#686868]'}`} />
            <span>{isBackendOnline ? 'API ONLINE' : 'API OFFLINE'}</span>
          </div>

          <a 
            href="https://github.com/arjitujjawal-art/agentic_ops" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:inline-flex btn-sre-outline-mono text-base md:text-lg font-bold py-3.5 px-6 border-2 border-[#050505]"
          >
            VIEW SOURCE <ExternalLink className="w-5 h-5 ml-2" />
          </a>

          <button 
            onClick={() => scrollToSection('simulator')}
            className="btn-sre-mono text-base md:text-lg font-extrabold py-3.5 px-8 shadow-xl"
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
