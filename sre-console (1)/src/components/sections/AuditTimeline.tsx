import React, { useState, useEffect } from 'react';
import { RefreshCw, Trash2, ShieldCheck, History, FileCheck } from 'lucide-react';
import { api } from '../../services/api';
import { EventItem, AuditLogItem } from '../../types';

export const AuditTimeline: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [activeTab, setActiveTab] = useState<'events' | 'audit'>('events');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    } flex: {
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
    <section id="audit" className="w-full min-h-screen bg-[#050505] text-[#F1F1F1] py-24 border-b border-white/20">
      <div className="container-full space-y-12">
        {/* Header */}
        <div className="border-b border-white/20 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="label-caps text-[#8E8E8E]">// FORENSIC EVIDENCE TRAIL</div>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold text-[#FFFFFF] mt-2">
              AUDIT TIMELINE & EVENT BUS
            </h2>
          </div>
          <div className="flex gap-4">
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="btn-sre-dark-outline py-2.5 px-5 text-xs"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> REFRESH
            </button>
            <button
              onClick={handleClearEvents}
              className="btn-sre-dark-outline py-2.5 px-5 text-xs hover:bg-[#FFFFFF] hover:text-[#050505]"
            >
              <Trash2 className="w-4 h-4" /> CLEAR SESSION EVENTS
            </button>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex border-b border-white/20 gap-8 font-mono text-xs">
          <button
            onClick={() => setActiveTab('events')}
            className={`pb-4 uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'events'
                ? 'border-[#FFFFFF] text-[#FFFFFF] font-bold'
                : 'border-transparent text-[#8E8E8E] hover:text-[#FFFFFF]'
            }`}
          >
            SESSION EVENT BUS TIMELINE ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-4 uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'audit'
                ? 'border-[#FFFFFF] text-[#FFFFFF] font-bold'
                : 'border-transparent text-[#8E8E8E] hover:text-[#FFFFFF]'
            }`}
          >
            IMMUTABLE DISK AUDIT LOGS ({auditLogs.length})
          </button>
        </div>

        {error && (
          <div className="p-4 border border-white bg-[#141414] text-[#FFFFFF] font-mono text-xs">
            [ERROR] {error}
          </div>
        )}

        {/* Events Timeline List */}
        {activeTab === 'events' && (
          <div className="space-y-4 font-mono text-xs">
            {events.length === 0 ? (
              <div className="p-16 text-center border border-white/20 bg-[#141414] text-[#8E8E8E]">
                NO SESSION EVENTS RECORDED. RUN AN INCIDENT SIMULATION TO GENERATE TIMELINE DATA.
              </div>
            ) : (
              <div className="border border-white/20 divide-y divide-white/15 bg-[#141414]">
                {events.map((ev, idx) => (
                  <div key={ev.event_id || idx} className="p-6 space-y-2">
                    <div className="flex justify-between items-center text-[#8E8E8E]">
                      <span className="font-bold text-[#FFFFFF]">[{String(idx + 1).padStart(2, '0')}] {ev.type.toUpperCase()}</span>
                      <span>{ev.timestamp ? ev.timestamp.slice(11, 19) : ''} UTC</span>
                    </div>
                    <pre className="text-[#C8C8C8] text-[12px] overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(ev.payload, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Immutable Disk Audit Logs */}
        {activeTab === 'audit' && (
          <div className="space-y-4 font-mono text-xs">
            {auditLogs.length === 0 ? (
              <div className="p-16 text-center border border-white/20 bg-[#141414] text-[#8E8E8E]">
                NO AUDIT ENTRIES RECORDED IN TOOLS/AUDIT.LOG.
              </div>
            ) : (
              <div className="border border-white/20 divide-y divide-white/15 bg-[#141414]">
                {auditLogs.map((log) => (
                  <div key={log.action_id} className="p-6 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#FFFFFF]">ACTION: {log.action.toUpperCase()}</span>
                      <span className="text-[#8E8E8E]">ID: {log.action_id.slice(0, 8)}</span>
                    </div>
                    <div className="text-[#C8C8C8] text-[12px] space-y-1">
                      <div>MESSAGE: {log.message}</div>
                      <div>LATENCY: {log.execution_time_ms} ms | STATUS: {log.status.toUpperCase()}</div>
                      <div>TIMESTAMP: {log.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
