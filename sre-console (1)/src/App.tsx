import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { ProblemStatement } from './components/sections/ProblemStatement';
import { SystemWorkflow } from './components/sections/SystemWorkflow';
import { IncidentSimulator } from './components/sections/IncidentSimulator';
import { EvidenceRetrieval } from './components/sections/EvidenceRetrieval';
import { SafetyControl } from './components/sections/SafetyControl';
import { AuditTimeline } from './components/sections/AuditTimeline';
import { ArchitectureStory } from './components/sections/ArchitectureStory';
import { ClosingSection } from './components/sections/ClosingSection';
import { api } from './services/api';
import { AlertTriangle } from 'lucide-react';

export function App() {
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(true);

  // Poll FastAPI backend health
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await api.getHealth();
        setIsBackendOnline(true);
      } catch (e) {
        setIsBackendOnline(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F3F1EC] text-[#090909] font-sans antialiased flex flex-col selection:bg-[#090909] selection:text-[#F3F1EC]">
      {/* Navigation Header */}
      <Navbar isBackendOnline={isBackendOnline} />

      {/* Backend Offline Warning Banner */}
      {!isBackendOnline && (
        <div className="fixed top-[58px] left-0 right-0 bg-[#090909] text-[#F3F1EC] px-6 py-2.5 flex items-center justify-between font-mono text-xs z-40 border-b border-[#F3F1EC]/20">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#F3F1EC]" />
            <span>BACKEND OFFLINE — START <code className="bg-[#141414] px-1.5 py-0.5 border border-[#F3F1EC]/30">python api_server.py</code> TO RUN PIPELINE & RAG RETRIEVAL</span>
          </div>
          <div className="text-[10px] uppercase text-[#686868] hidden md:block">
            FASTAPI SERVER PORT 8000
          </div>
        </div>
      )}

      {/* Main Single-Page Narrative Experience */}
      <main className="w-full flex-1">
        {/* Section 1: Hero */}
        <HeroSection />

        {/* Section 2: Problem Statement */}
        <ProblemStatement />

        {/* Section 3: System Workflow */}
        <SystemWorkflow />

        {/* Section 4: Live Incident Simulator */}
        <IncidentSimulator />

        {/* Section 5: Evidence Retrieval */}
        <EvidenceRetrieval />

        {/* Section 6: Safety Control */}
        <SafetyControl />

        {/* Section 7: Audit Timeline */}
        <AuditTimeline />

        {/* Section 8: Architecture Story */}
        <ArchitectureStory />

        {/* Section 9: Closing Section & Footer */}
        <ClosingSection />
      </main>
    </div>
  );
}

export default App;
