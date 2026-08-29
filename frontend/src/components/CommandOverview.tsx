import React, { useEffect, useState } from 'react';
import { PortalHero } from './PortalHero';
import { ShieldCheck, Cpu, Search, Wrench, History, ArrowRight, Activity } from 'lucide-react';
import { api } from '../services/api';
import { ActiveView, HealthResponse } from '../types';

interface CommandOverviewProps {
  onNavigate: (view: ActiveView) => void;
  isPipelineRunning?: boolean;
}

export const CommandOverview: React.FC<CommandOverviewProps> = ({ onNavigate, isPipelineRunning = false }) => {
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);

  useEffect(() => {
    api.getHealth()
      .then(setHealthData)
      .catch(() => setHealthData(null));
  }, []);

  return (
    <div className="w-full space-y-12 pb-16">
      {/* Signature Portal Hero Stage */}
      <PortalHero isPipelineRunning={isPipelineRunning} />

      {/* Backend Operational Instrument Cards */}
      <div className="px-6 md:px-12 w-full max-w-[1760px] mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-[#EDE7DC]/13 pb-4">
          <div className="text-[12px] font-mono text-[#9EA5A8] uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#2E6B72]" />
            SYSTEM READINESS & BACKEND TELEMETRY
          </div>
          <div className="text-sm font-mono text-[#2E6B72]">
            {healthData ? `SYSTEM: ${healthData.system.toUpperCase()} | OK` : 'BACKEND DISCONNECTED'}
          </div>
        </div>

        {/* Feature Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Incident Simulator */}
          <div 
            onClick={() => onNavigate('simulator')}
            className="sre-card hover:border-[#E8913C] cursor-pointer transition-all space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <Cpu className="w-6 h-6 text-[#E8913C]" />
              <ArrowRight className="w-4 h-4 text-[#9EA5A8] group-hover:text-[#E8913C] transition-colors" />
            </div>
            <div className="font-display text-lg text-[#EDE7DC]">INCIDENT SIMULATOR</div>
            <p className="text-sm font-mono text-[#9EA5A8] leading-relaxed">
              Compose failure symptoms, select severity (P1-P3), and run the multi-agent triage pipeline.
            </p>
            <div className="text-[12px] font-mono text-[#E8913C] uppercase">POST /api/pipeline/run →</div>
          </div>

          {/* Card 2: Evidence Retrieval */}
          <div 
            onClick={() => onNavigate('evidence')}
            className="sre-card hover:border-[#2E6B72] cursor-pointer transition-all space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <Search className="w-6 h-6 text-[#2E6B72]" />
              <ArrowRight className="w-4 h-4 text-[#9EA5A8] group-hover:text-[#2E6B72] transition-colors" />
            </div>
            <div className="font-display text-lg text-[#EDE7DC]">EVIDENCE RETRIEVAL</div>
            <p className="text-sm font-mono text-[#9EA5A8] leading-relaxed">
              Query 35 operational runbooks and historical incidents indexed in ChromaDB vector store.
            </p>
            <div className="text-[12px] font-mono text-[#2E6B72] uppercase">POST /api/rag/retrieve →</div>
          </div>

          {/* Card 3: Action Control */}
          <div 
            onClick={() => onNavigate('actions')}
            className="sre-card hover:border-[#E8913C] cursor-pointer transition-all space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <Wrench className="w-6 h-6 text-[#E8913C]" />
              <ArrowRight className="w-4 h-4 text-[#9EA5A8] group-hover:text-[#E8913C] transition-colors" />
            </div>
            <div className="font-display text-lg text-[#EDE7DC]">ACTION CONTROL</div>
            <p className="text-sm font-mono text-[#9EA5A8] leading-relaxed">
              Execute controlled remediation actions (restart, scale, rollback) with safety confirmation modals.
            </p>
            <div className="text-[12px] font-mono text-[#E8913C] uppercase">POST /api/tools/action →</div>
          </div>

          {/* Card 4: Audit Timeline */}
          <div 
            onClick={() => onNavigate('audit')}
            className="sre-card hover:border-[#2E6B72] cursor-pointer transition-all space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <History className="w-6 h-6 text-[#2E6B72]" />
              <ArrowRight className="w-4 h-4 text-[#9EA5A8] group-hover:text-[#2E6B72] transition-colors" />
            </div>
            <div className="font-display text-lg text-[#EDE7DC]">AUDIT TIMELINE</div>
            <p className="text-sm font-mono text-[#9EA5A8] leading-relaxed">
              Inspect session event timeline and immutable disk logs stored in tools/audit.log.
            </p>
            <div className="text-[12px] font-mono text-[#2E6B72] uppercase">GET /api/logs/audit →</div>
          </div>
        </div>
      </div>
    </div>
  );
};
