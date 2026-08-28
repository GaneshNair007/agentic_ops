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
    <section id="audit" className="w-full min-h-screen bg-[#090909] text-[#F3F1EC] py-24 px-6 md:px-12 border-b border-[#F3F1EC]/20">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-[#F3F1EC]/20 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="label-caps text-[#686868]">// FORENSIC EVIDENCE TRAIL</div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-[#F3F1EC] mt-2">
              AUDIT TIMELINE & EVENT BUS
            </h2>
          </div>
          <div className="flex gap-4">
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="btn-sre-dark-outline py-2 px-4 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> REFRESH
            </button>
            <button
              onClick={handleClearEvents}
              className="btn-sre-dark-outline py-2 px-4 text-xs hover:bg-[#F3F1EC] hover:text-[#090909]"
            >
              <Trash2 className="w-3.5 h-3.5" /> CLEAR SESSION EVENTS
            </button>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex border-b border-[#F3F1EC]/20 gap-8 font-mono text-xs">
          <button
            onClick={() => setActiveTab('events')}
            className={`pb-4 uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'events'
                ? 'border-[#F3F1EC] text-[#F3F1EC] font-bold'
                : 'border-transparent text-[#686868] hover:text-[#F3F1EC]'
            }`}
          >
            SESSION EVENT BUS TIMELINE ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-4 uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'audit'
                ? 'border-[#F3F1EC] text-[#F3F1EC] font-bold'
                : 'border-transparent text-[#686868] hover:text-[#F3F1EC]'
            }`}
          >
            IMMUTABLE AUDIT LOGS ({auditLogs.length})
          </button>
        </div>

        {error && (
          <div className="p-4 border border-[#F3F1EC] bg-[#141414] text-[#F3F1EC] font-mono text-xs">
            [ERROR] {error}
          </div>
        )}

        {/* Events View */}
        {activeTab === 'events' && (
          <div className="space-y-4 font-mono text-xs">
            {events.length === 0 ? (
              <div className="p-12 text-center border border-[#F3F1EC]/20 bg-[#141414] text-[#686868]">
                NO SESSION EVENTS RECORDED. RUN AN INCIDENT SIMULATION TO GENERATE TIMELINE DATA.
              </div>
            ) : (
              <div className="border border-[#F3F1EC]/20 divide-y divide-[#F3F1EC]/15 bg-[#141414]">
                {events.map((ev, idx) => (
                  <div key={ev.event_id || idx} className="p-6 space-y-2">
                    <div className="flex justify-between items-center text-[#686868]">
                      <span className="font-bold text-[#F3F1EC]">[{String(idx + 1).padStart(2, '0')}] {ev.type.toUpperCase()}</span>
                      <span>{ev.timestamp ? ev.timestamp.slice(11, 19) : ''} UTC</span>
                    </div>
                    <pre className="text-[#D8D6D0] text-[11px] overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(ev.payload, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Audit Logs View */}
        {activeTab === 'audit' && (
          <div className="space-y-4 font-mono text-xs">
            {auditLogs.length === 0 ? (
              <div className="p-12 text-center border border-[#F3F1EC]/20 bg-[#141414] text-[#686868]">
                NO AUDIT ENTRIES RECORDED IN TOOLS/AUDIT.LOG.
              </div>
            ) : (
              <div className="border border-[#F3F1EC]/20 divide-y divide-[#F3F1EC]/15 bg-[#141414]">
                {auditLogs.map((log) => (
                  <div key={log.action_id} className="p-6 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#F3F1EC]">ACTION: {log.action.toUpperCase()}</span>
                      <span className="text-[#686868]">ID: {log.action_id.slice(0, 8)}</span>
                    </div>
                    <div className="text-[#D8D6D0] text-[11px] space-y-1">
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
