import React from 'react';
import { Activity, ShieldCheck, Search, Wrench, History, Cpu } from 'lucide-react';
import { ActiveView } from '../types';

interface NavbarProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  isBackendOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onViewChange,
  isBackendOnline,
}) => {
  const views: { id: ActiveView; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Command Overview', icon: <Activity className="w-4 h-4" /> },
    { id: 'simulator', label: 'Incident Simulator', icon: <Cpu className="w-4 h-4" /> },
    { id: 'evidence', label: 'Evidence Retrieval', icon: <Search className="w-4 h-4" /> },
    { id: 'actions', label: 'Action Control', icon: <Wrench className="w-4 h-4" /> },
    { id: 'audit', label: 'Audit Timeline', icon: <History className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Top Fixed Header Bar */}
      <header className="fixed top-0 left-0 w-full h-[58px] bg-[#0A0C0E]/85 backdrop-blur-[14px] border-b border-[#EDE7DC]/13 z-50 flex items-center justify-between px-6">
        {/* Product Branding */}
        <div className="flex items-center gap-4">
          <div className="font-display text-sm font-extrabold tracking-tight text-[#EDE7DC] uppercase">
            AI SRE<span className="text-[#E8913C]">.</span>
          </div>
          <div className="hidden lg:block text-[11px] font-mono text-[#9EA5A8] border-l border-[#EDE7DC]/13 pl-4">
            AGENTIC INCIDENT RISK TRIAGE & RESPONSE SYSTEM
          </div>
        </div>

        {/* Desktop View Switcher Links */}
        <nav className="hidden md:flex items-center gap-6">
          {views.map((v) => (
            <button
              key={v.id}
              onClick={() => onViewChange(v.id)}
              className={`text-[11px] font-mono uppercase tracking-wider transition-colors flex items-center gap-2 py-1 ${
                activeView === v.id
                  ? 'text-[#E8913C] border-b border-[#E8913C] font-bold'
                  : 'text-[#9EA5A8] hover:text-[#EDE7DC]'
              }`}
            >
              {v.label}
            </button>
          ))}
        </nav>

        {/* Backend Status Badge */}
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider">
          <span
            className={`w-2 h-2 rounded-full ${
              isBackendOnline ? 'bg-[#2E6B72] animate-pulse' : 'bg-[#E8913C]'
            }`}
          />
          <span className={isBackendOnline ? 'text-[#2E6B72]' : 'text-[#E8913C]'}>
            {isBackendOnline ? 'API ONLINE' : 'BACKEND OFFLINE'}
          </span>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar with Icons & Text */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#101317] border-t border-[#EDE7DC]/13 z-50 flex items-center justify-around px-2">
        {views.map((v) => (
          <button
            key={v.id}
            onClick={() => onViewChange(v.id)}
            className={`flex flex-col items-center gap-1 text-[9px] font-mono uppercase tracking-wider py-1 px-2 ${
              activeView === v.id ? 'text-[#E8913C] font-bold' : 'text-[#9EA5A8]'
            }`}
          >
            {v.icon}
            <span>{v.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </>
  );
};
