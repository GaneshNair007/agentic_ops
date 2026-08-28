import React, { useState, useEffect } from 'react';
import { EntryLoader } from './components/sections/EntryLoader';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { IncidentMarquee } from './components/sections/IncidentMarquee';
import { ProblemSection } from './components/sections/ProblemSection';
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
  const [isLoaderComplete, setIsLoaderComplete] = useState<boolean>(false);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(true);

  // Poll backend health status
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
    <div className="min-h-screen bg-[#F3F1EC] text-[#050505] font-sans antialiased flex flex-col selection:bg-[#050505] selection:text-[#FFFFFF]">
      {/* Boot Loader Sequence */}
      {!isLoaderComplete && (
        <EntryLoader onComplete={() => setIsLoaderComplete(true)} />
      )}

      {/* Navigation Header */}
      <Navbar isBackendOnline={isBackendOnline} />

      {/* Backend Offline Warning Banner */}
      {!isBackendOnline && (
        <div className="fixed top-[58px] left-0 right-0 bg-[#050505] text-[#FFFFFF] px-6 py-2.5 flex items-center justify-between font-mono text-xs z-40 border-b border-white/20">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FFFFFF]" />
            <span>BACKEND OFFLINE — START <code className="bg-[#141414] px-1.5 py-0.5 border border-white/30">python api_server.py</code> TO RUN PIPELINE & RAG RETRIEVAL</span>
          </div>
          <div className="text-[10px] uppercase text-[#8E8E8E] hidden md:block">
            FASTAPI SERVER PORT 8000
          </div>
        </div>
      )}

      {/* Main Single-Page Narrative Experience */}
      <main className="w-full flex-1">
        {/* Section 1: Hero */}
        <HeroSection />

        {/* Section 2: Marquee */}
        <IncidentMarquee />

        {/* Section 3: Problem Section */}
        <ProblemSection />

        {/* Section 4: System Workflow */}
        <SystemWorkflow />

        {/* Section 5: Live Incident Simulator */}
        <IncidentSimulator />

        {/* Section 6: Evidence Retrieval */}
        <EvidenceRetrieval />

        {/* Section 7: Safety Control */}
        <SafetyControl />

        {/* Section 8: Audit Timeline */}
        <AuditTimeline />

        {/* Section 9: Architecture Story */}
        <ArchitectureStory />

        {/* Section 10: Closing Section & Footer */}
        <ClosingSection />
      </main>
    </div>
  );
}

export default App;
