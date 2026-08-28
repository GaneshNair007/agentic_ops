import React, { useState, useEffect } from 'react';
import { RefreshCw, Trash2, Code } from 'lucide-react';
import { api } from '../../services/api';
import { EventItem, AuditLogItem } from '../../types';

export const AuditTimeline: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [activeTab, setActiveTab] = useState<'events' | 'audit'>('events');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [showRawJson, setShowRawJson] = useState<Record<string, boolean>>({});

  const toggleJson = (id: string) => {
    setShowRawJson(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [evRes, auditRes] = await Promise.all([
        api.listEvents(),
        api.getAuditLogs(),
      ]);
      setEvents(evRes.events || []);
      setAuditLogs(auditRes.logs || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch timeline logs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearEvents = async () => {
    if (!window.confirm('Are you sure you want to clear session events?')) return;
    try {
      await api.clearEvents();
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to clear events');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section id="audit" className="w-full min-h-screen bg-[#050505] text-[#F1F1F1] py-24 border-t border-[#333]">
      <div className="w-full px-6 md:px-12 lg:px-24 space-y-16">
        
        {/* Header */}
        <div className="border-b border-[#333] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="label-caps text-[#8E8E8E] mb-3">// FORENSIC EVIDENCE TRAIL</div>
            <h2 className="font-display text-5xl md:text-7xl font-black text-[#FFFFFF] leading-[0.9]">
              IMMUTABLE AUDIT<br />RECORD
            </h2>
          </div>
          <div className="flex gap-4">
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="bg-[#111] hover:bg-[#333] border border-[#333] font-mono text-sm tracking-widest uppercase py-3 px-6 transition-colors flex items-center gap-3"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> REFRESH
            </button>
            <button
              onClick={handleClearEvents}
              className="bg-[#111] hover:bg-[#FF3333] hover:text-[#FFFFFF] hover:border-[#FF3333] border border-[#333] font-mono text-sm tracking-widest uppercase py-3 px-6 transition-colors flex items-center gap-3 text-[#FF3333]"
            >
              <Trash2 className="w-4 h-4" /> CLEAR STATE
            </button>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex border-b border-[#333] gap-12 font-mono text-base font-bold">
          <button
            onClick={() => setActiveTab('events')}
            className={`pb-4 uppercase tracking-widest transition-colors border-b-4 ${
              activeTab === 'events'
                ? 'border-[#E8913C] text-[#FFFFFF]'
                : 'border-transparent text-[#4A4A4A] hover:text-[#8E8E8E]'
            }`}
          >
            SESSION EVENT BUS ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-4 uppercase tracking-widest transition-colors border-b-4 ${
              activeTab === 'audit'
                ? 'border-[#E8913C] text-[#FFFFFF]'
                : 'border-transparent text-[#4A4A4A] hover:text-[#8E8E8E]'
            }`}
          >
            DISK-BACKED AUDIT LOGS ({auditLogs.length})
          </button>
        </div>

        {error && (
          <div className="p-4 border border-[#FF3333] bg-[#220000] text-[#FF3333] font-mono text-sm">
            [ERROR] {error}
          </div>
        )}

        {/* Vertical Axis Timeline */}
        <div className="relative pl-8 md:pl-16">
          {/* The Thick Vertical Axis */}
          <div className="absolute top-0 bottom-0 left-0 w-2 bg-[#333]" />

          {activeTab === 'events' && (
            <div className="space-y-16">
              {events.length === 0 ? (
                <div className="font-mono text-[#4A4A4A] py-12 animate-pulse">
                  SYSTEM RECORD EMPTY. RUN SIMULATION.
                </div>
              ) : (
                events.map((ev, idx) => {
                  const id = ev.event_id || `ev-${idx}`;
                  const tsRaw = ev.timestamp || new Date().toISOString();
                  const tsTime = tsRaw.slice(11, 23);
                  const tsDate = tsRaw.slice(0, 10);

                  return (
                    <div key={id} className="relative group">
                      {/* Node on axis */}
                      <div className="absolute -left-[45px] md:-left-[77px] top-4 w-6 h-6 bg-[#050505] border-4 border-[#E8913C] rounded-full z-10 transition-transform group-hover:scale-125" />
                      
                      <div className="flex flex-col xl:flex-row gap-6 xl:gap-16 items-start">
                        {/* Prominent Timestamp */}
                        <div className="flex-shrink-0 font-mono text-left xl:w-64">
                          <div className="text-4xl md:text-5xl font-black text-[#FFFFFF] tracking-tighter">
                            {tsTime}
                          </div>
                          <div className="text-[#8E8E8E] text-sm tracking-widest uppercase mt-1">
                            {tsDate} // EVENT ID: {String(idx + 1).padStart(3, '0')}
                          </div>
                        </div>

                        {/* Event Content */}
                        <div className="flex-1 bg-[#0A0A0A] border border-[#333] p-6 hover:border-[#8E8E8E] transition-colors w-full">
                          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#333]">
                            <h3 className="font-display text-2xl font-bold text-[#E8913C] uppercase">
                              {ev.type}
                            </h3>
                            <button 
                              onClick={() => toggleJson(id)}
                              className="text-[#8E8E8E] hover:text-[#FFFFFF] flex items-center gap-2 font-mono text-xs uppercase tracking-widest transition-colors"
                            >
                              <Code className="w-4 h-4" /> RAW DATA
                            </button>
                          </div>
                          
                          {showRawJson[id] ? (
                            <pre className="bg-[#111] p-4 text-[#00FF00] font-mono text-sm overflow-x-auto border border-[#333]">
                              {JSON.stringify(ev.payload, null, 2)}
                            </pre>
                          ) : (
                            <div className="font-mono text-[#F1F1F1] text-base leading-relaxed">
                              {ev.payload?.message || ev.payload?.title || ev.payload?.description || "Structured payload attached. Toggle raw data to inspect."}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-16">
              {auditLogs.length === 0 ? (
                <div className="font-mono text-[#4A4A4A] py-12 animate-pulse">
                  TOOLS/AUDIT.LOG IS EMPTY.
                </div>
              ) : (
                auditLogs.map((log) => {
                  const id = log.action_id;
                  const tsRaw = log.timestamp || new Date().toISOString();
                  const tsTime = tsRaw.slice(11, 23);
                  const tsDate = tsRaw.slice(0, 10);

                  return (
                    <div key={id} className="relative group">
                      {/* Node on axis */}
                      <div className="absolute -left-[45px] md:-left-[77px] top-4 w-6 h-6 bg-[#050505] border-4 border-[#00FF00] rounded-sm z-10 transition-transform group-hover:rotate-45" />
                      
                      <div className="flex flex-col xl:flex-row gap-6 xl:gap-16 items-start">
                        {/* Prominent Timestamp */}
                        <div className="flex-shrink-0 font-mono text-left xl:w-64">
                          <div className="text-4xl md:text-5xl font-black text-[#FFFFFF] tracking-tighter">
                            {tsTime}
                          </div>
                          <div className="text-[#8E8E8E] text-sm tracking-widest uppercase mt-1">
                            {tsDate} // HASH: {id.slice(0, 8)}
                          </div>
                        </div>

                        {/* Event Content */}
                        <div className="flex-1 bg-[#0A0A0A] border border-[#333] p-6 hover:border-[#8E8E8E] transition-colors w-full">
                          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#333]">
                            <h3 className="font-display text-2xl font-bold text-[#00FF00] uppercase">
                              PROTOCOL: {log.action}
                            </h3>
                            <button 
                              onClick={() => toggleJson(id)}
                              className="text-[#8E8E8E] hover:text-[#FFFFFF] flex items-center gap-2 font-mono text-xs uppercase tracking-widest transition-colors"
                            >
                              <Code className="w-4 h-4" /> RAW DATA
                            </button>
                          </div>
                          
                          {showRawJson[id] ? (
                            <pre className="bg-[#111] p-4 text-[#00FF00] font-mono text-sm overflow-x-auto border border-[#333]">
                              {JSON.stringify(log, null, 2)}
                            </pre>
                          ) : (
                            <div className="font-mono text-[#F1F1F1] text-base space-y-2">
                              <div><span className="text-[#8E8E8E]">MESSAGE:</span> {log.message}</div>
                              <div><span className="text-[#8E8E8E]">LATENCY:</span> {log.execution_time_ms}ms</div>
                              <div><span className="text-[#8E8E8E]">STATUS:</span> <span className="text-[#00FF00]">{log.status.toUpperCase()}</span></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
