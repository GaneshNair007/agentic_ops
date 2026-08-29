import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EntryLoader } from './components/sections/EntryLoader';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { IncidentMarquee } from './components/sections/IncidentMarquee';
import { SystemWorkflow } from './components/sections/SystemWorkflow';
import { IncidentSimulator } from './components/sections/IncidentSimulator';
import { EvidenceRetrieval } from './components/sections/EvidenceRetrieval';
import { SafetyControl } from './components/sections/SafetyControl';
import { AuditTimeline } from './components/sections/AuditTimeline';
import { ClosingSection } from './components/sections/ClosingSection';
import { api } from './services/api';
import { AlertTriangle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const [isLoaderComplete, setIsLoaderComplete] = useState<boolean>(false);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(true);

  // Initialize Lenis smooth scroll and synchronize with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
    };
  }, []);

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
    <div className="min-h-screen bg-[#FFFFFF] text-[#050505] font-sans antialiased flex flex-col selection:bg-[#050505] selection:text-[#FFFFFF]">
      {/* Boot Loader Sequence */}
      {!isLoaderComplete && (
        <EntryLoader onComplete={() => {
          setIsLoaderComplete(true);
          setTimeout(() => ScrollTrigger.refresh(), 50);
        }} />
      )}

      {/* Navigation Header */}
      <Navbar isBackendOnline={isBackendOnline} />

      {/* Backend Offline Warning Banner */}
      {!isBackendOnline && (
        <div className="fixed top-[96px] left-0 right-0 bg-[#050505] text-[#FFFFFF] px-6 py-2.5 flex items-center justify-between font-mono text-sm z-40 border-b border-[#333333]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FFFFFF]" />
            <span>BACKEND OFFLINE — START <code className="bg-[#141414] px-1.5 py-0.5 border border-white/30">python api_server.py</code> TO RUN PIPELINE & RAG RETRIEVAL</span>
          </div>
          <div className="text-[12px] uppercase text-[#999999] hidden md:block">
            FASTAPI SERVER PORT 8000
          </div>
        </div>
      )}

      {/* Main Single-Page Narrative Experience */}
      <main className="w-full flex-1">
        {/* Scene 1: Hero */}
        <HeroSection />

        {/* Scene 2: Marquee */}
        <IncidentMarquee />

        {/* Scene 3/4 Merged: System Workflow */}
        <SystemWorkflow />

        {/* Scene 5: Live Incident Simulator */}
        <IncidentSimulator />

        {/* Scene 6: Evidence Retrieval */}
        <EvidenceRetrieval />

        {/* Scene 7: Safety Control */}
        <SafetyControl />

        {/* Scene 8: Audit Timeline */}
        <AuditTimeline />

        {/* Scene 9: Closing Section & Footer */}
        <ClosingSection />
      </main>
    </div>
  );
}

export default App;
