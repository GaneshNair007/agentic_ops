import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CommandOverview } from './components/CommandOverview';
import { IncidentSimulator } from './components/IncidentSimulator';
import { EvidenceRetrieval } from './components/EvidenceRetrieval';
import { ActionControl } from './components/ActionControl';
import { AuditTimeline } from './components/AuditTimeline';
import { api } from './services/api';
import { ActiveView } from './types';
import { AlertTriangle, Terminal } from 'lucide-react';

export function App() {
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(true);
  const [isPipelineRunning, setIsPipelineRunning] = useState<boolean>(false);

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
    <div className="min-h-screen bg-[#0A0C0E] text-[#EDE7DC] font-sans antialiased flex flex-col pt-[58px] pb-16 md:pb-8">
      {/* Navigation Header & Mobile Bar */}
      <Navbar
        activeView={activeView}
        onViewChange={setActiveView}
        isBackendOnline={isBackendOnline}
      />

      {/* Backend Offline Warning Banner */}
      {!isBackendOnline && (
        <div className="bg-[#E8913C]/10 border-b border-[#E8913C] px-6 py-3 flex items-center justify-between font-mono text-xs text-[#E8913C] z-40">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#E8913C]" />
            <span>BACKEND OFFLINE — START <code className="bg-[#0A0C0E] px-1.5 py-0.5 rounded border border-[#E8913C]/40">python api_server.py</code> TO RUN LIVE PIPELINE & RAG RETRIEVAL</span>
          </div>
          <div className="text-[10px] uppercase text-[#9EA5A8] hidden md:block">
            SIMULATION BACKEND PORT 8000
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {activeView === 'overview' && (
          <CommandOverview
            onNavigate={setActiveView}
            isPipelineRunning={isPipelineRunning}
          />
        )}

        {activeView === 'simulator' && (
          <div className="px-6 md:px-12 max-w-7xl mx-auto py-8">
            <IncidentSimulator
              onPipelineStarted={() => setIsPipelineRunning(true)}
              onPipelineCompleted={() => setIsPipelineRunning(false)}
            />
          </div>
        )}

        {activeView === 'evidence' && (
          <div className="px-6 md:px-12 max-w-7xl mx-auto py-8">
            <EvidenceRetrieval />
          </div>
        )}

        {activeView === 'actions' && (
          <div className="px-6 md:px-12 max-w-7xl mx-auto py-8">
            <ActionControl />
          </div>
        )}

        {activeView === 'audit' && (
          <div className="px-6 md:px-12 max-w-7xl mx-auto py-8">
            <AuditTimeline />
          </div>
        )}
      </main>
    </div>
  );
}
export default App;
