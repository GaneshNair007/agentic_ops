import React from 'react';
import { ExternalLink, Terminal, Search, Shield, Cpu, Activity } from 'lucide-react';

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
      {/* Desktop & Mobile Fixed Navbar */}
      <nav className="fixed top-0 left-0 w-full h-[58px] bg-[#F5F3EE]/95 backdrop-blur-md border-b border-[#D8D6D0] z-50 flex items-center justify-between px-6 md:px-12 transition-colors">
        {/* Left Branding */}
        <div className="flex items-center gap-4">
          <span 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-display text-base font-extrabold tracking-tight text-[#050505] cursor-pointer"
          >
            AI SRE<span className="text-[#686868]">.</span>
          </span>
          <span className="hidden md:inline-block text-xs font-mono text-[#686868] border-l border-[#D8D6D0] pl-4 uppercase">
            AGENTIC INCIDENT RISK TRIAGE SYSTEM
          </span>
        </div>

        {/* Middle Navigation Links (Min 14px) */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <button onClick={() => scrollToSection('workflow')} className="label-caps text-[#202020] hover:text-[#050505] transition-colors">
            WORKFLOW
          </button>
          <button onClick={() => scrollToSection('simulator')} className="label-caps text-[#202020] hover:text-[#050505] transition-colors">
            SIMULATOR
          </button>
          <button onClick={() => scrollToSection('evidence')} className="label-caps text-[#202020] hover:text-[#050505] transition-colors">
            EVIDENCE
          </button>
          <button onClick={() => scrollToSection('safety')} className="label-caps text-[#202020] hover:text-[#050505] transition-colors">
            SAFETY
          </button>
          <button onClick={() => scrollToSection('audit')} className="label-caps text-[#202020] hover:text-[#050505] transition-colors">
            AUDIT
          </button>
        </div>

        {/* Right Actions & Status */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono uppercase">
            <span className={`w-2.5 h-2.5 rounded-full ${isBackendOnline ? 'bg-[#050505]' : 'border border-[#050505]'}`} />
            <span className="text-[#202020] font-bold">{isBackendOnline ? 'API ONLINE' : 'API OFFLINE'}</span>
          </div>

          <a 
            href="https://github.com/arjitujjawal-art/agentic_ops" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:inline-flex btn-sre-outline-mono text-xs py-2 px-4"
          >
            VIEW SOURCE <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button 
            onClick={() => scrollToSection('simulator')}
            className="btn-sre-mono text-xs py-2 px-5"
          >
            LAUNCH CONSOLE
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar with Labels & Icons */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#050505] border-t border-white/20 z-50 flex items-center justify-around px-2 text-[#F1F1F1]">
        <button onClick={() => scrollToSection('workflow')} className="flex flex-col items-center gap-1 text-[11px] font-mono uppercase">
          <Cpu className="w-4 h-4" />
          <span>Workflow</span>
        </button>
        <button onClick={() => scrollToSection('simulator')} className="flex flex-col items-center gap-1 text-[11px] font-mono uppercase">
          <Terminal className="w-4 h-4" />
          <span>Console</span>
        </button>
        <button onClick={() => scrollToSection('evidence')} className="flex flex-col items-center gap-1 text-[11px] font-mono uppercase">
          <Search className="w-4 h-4" />
          <span>Evidence</span>
        </button>
        <button onClick={() => scrollToSection('safety')} className="flex flex-col items-center gap-1 text-[11px] font-mono uppercase">
          <Shield className="w-4 h-4" />
          <span>Safety</span>
        </button>
      </div>
    </>
  );
};
