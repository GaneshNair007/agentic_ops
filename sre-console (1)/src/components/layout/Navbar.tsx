import React from 'react';
import { ShieldCheck, Terminal, Search, Shield, Cpu, ExternalLink } from 'lucide-react';

interface NavbarProps {
  isBackendOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isBackendOnline }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Desktop & Mobile Fixed Navbar */}
      <nav className="fixed top-0 left-0 w-full h-[58px] bg-[#F3F1EC]/90 backdrop-blur-md border-b border-[#D8D6D0] z-50 flex items-center justify-between px-6 md:px-12 transition-colors">
        {/* Left Branding */}
        <div className="flex items-center gap-4">
          <span 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-display text-sm font-extrabold tracking-tight text-[#090909] cursor-pointer"
          >
            AI SRE<span className="text-[#686868]">.</span>
          </span>
          <span className="hidden md:inline-block text-[11px] font-mono text-[#686868] border-l border-[#D8D6D0] pl-4 uppercase">
            AGENTIC INCIDENT RISK TRIAGE SYSTEM
          </span>
        </div>

        {/* Middle Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection('workflow')} className="label-caps text-[#303030] hover:text-[#090909] transition-colors">
            WORKFLOW
          </button>
          <button onClick={() => scrollToSection('simulator')} className="label-caps text-[#303030] hover:text-[#090909] transition-colors">
            SIMULATOR
          </button>
          <button onClick={() => scrollToSection('evidence')} className="label-caps text-[#303030] hover:text-[#090909] transition-colors">
            EVIDENCE
          </button>
          <button onClick={() => scrollToSection('safety')} className="label-caps text-[#303030] hover:text-[#090909] transition-colors">
            SAFETY
          </button>
          <button onClick={() => scrollToSection('audit')} className="label-caps text-[#303030] hover:text-[#090909] transition-colors">
            AUDIT
          </button>
        </div>

        {/* Right CTA Actions & Backend Status */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono uppercase">
            <span className={`w-2 h-2 rounded-full ${isBackendOnline ? 'bg-[#090909]' : 'border border-[#090909]'}`} />
            <span className="text-[#303030]">{isBackendOnline ? 'API ONLINE' : 'API OFFLINE'}</span>
          </div>

          <a 
            href="https://github.com/arjitujjawal-art/agentic_ops" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:inline-flex btn-sre-outline-mono text-[11px] py-2 px-3"
          >
            VIEW SOURCE <ExternalLink className="w-3 h-3" />
          </a>

          <button 
            onClick={() => scrollToSection('simulator')}
            className="btn-sre-mono text-[11px] py-2 px-4"
          >
            LAUNCH CONSOLE
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar with Labels & Icons */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#090909] border-t border-[#D8D6D0]/20 z-50 flex items-center justify-around px-2 text-[#F3F1EC]">
        <button onClick={() => scrollToSection('workflow')} className="flex flex-col items-center gap-1 text-[10px] font-mono uppercase">
          <Cpu className="w-4 h-4" />
          <span>Workflow</span>
        </button>
        <button onClick={() => scrollToSection('simulator')} className="flex flex-col items-center gap-1 text-[10px] font-mono uppercase">
          <Terminal className="w-4 h-4" />
          <span>Console</span>
        </button>
        <button onClick={() => scrollToSection('evidence')} className="flex flex-col items-center gap-1 text-[10px] font-mono uppercase">
          <Search className="w-4 h-4" />
          <span>Evidence</span>
        </button>
        <button onClick={() => scrollToSection('safety')} className="flex flex-col items-center gap-1 text-[10px] font-mono uppercase">
          <Shield className="w-4 h-4" />
          <span>Safety</span>
        </button>
      </div>
    </>
  );
};
