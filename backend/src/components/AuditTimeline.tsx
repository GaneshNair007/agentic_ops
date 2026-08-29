import React, { useState, useEffect } from 'react';
import { RefreshCw, Trash2, ShieldCheck, History, Terminal, FileCheck } from 'lucide-react';
import { api } from '../services/api';
import { EventItem, AuditLogItem } from '../types';

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
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EDE7DC]/13 pb-6">
        <div>
          <div className="text-[12px] font-mono text-[#2E6B72] uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2E6B72]" />
            IMMUTABLE AUDIT TRAIL & EVENT LOGGING
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-[#EDE7DC] mt-1">
            FORENSIC AUDIT TIMELINE
          </h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="btn-sre-outline btn-sre-teal text-sm py-2 px-4 flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            REFRESH TIMELINE
          </button>
          <button
            onClick={handleClearEvents}
            className="btn-sre-outline text-sm py-2 px-4 flex items-center gap-2 text-[#9EA5A8] hover:text-[#E63946] hover:border-[#E63946]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            CLEAR SESSION EVENTS
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex border-b border-[#EDE7DC]/13 gap-6 font-mono text-sm">
        <button
          onClick={() => setActiveTab('events')}
          className={`pb-3 uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'events'
              ? 'border-[#2E6B72] text-[#2E6B72] font-bold'
              : 'border-transparent text-[#9EA5A8] hover:text-[#EDE7DC]'
          }`}
        >
          <History className="w-4 h-4" />
          SESSION EVENT BUS TIMELINE ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'audit'
              ? 'border-[#E8913C] text-[#E8913C] font-bold'
              : 'border-transparent text-[#9EA5A8] hover:text-[#EDE7DC]'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          IMMUTABLE DISK AUDIT LOGS ({auditLogs.length})
        </button>
      </div>

      {error && (
        <div className="p-4 border border-[#E63946] bg-[#E63946]/10 text-[#E63946] rounded text-sm font-mono">
          [ERROR] {error}
        </div>
      )}

      {/* Events Timeline List */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="p-8 text-center bg-[#101317] border border-[#EDE7DC]/13 rounded text-sm font-mono text-[#9EA5A8]">
              No events recorded in current session timeline. Run a pipeline simulation to record events.
            </div>
          ) : (
            <div className="bg-[#101317] border border-[#EDE7DC]/13 rounded overflow-hidden">
              <table className="w-full text-left font-mono text-sm">
                <thead className="bg-[#0A0C0E] border-b border-[#EDE7DC]/13 text-[#9EA5A8] uppercase text-[12px]">
                  <tr>
                    <th className="p-4">EVENT ID</th>
                    <th className="p-4">TYPE</th>
                    <th className="p-4">TIMESTAMP</th>
                    <th className="p-4">PAYLOAD DETAILS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE7DC]/10 text-[#EDE7DC]">
                  {events.map((ev, idx) => (
                    <tr key={ev.event_id || idx} className="hover:bg-[#0A0C0E]/50">
                      <td className="p-4 text-[#2E6B72]">{ev.event_id ? ev.event_id.slice(0, 8) : `EV-${idx + 1}`}</td>
                      <td className="p-4 font-bold uppercase text-[#E8913C]">{ev.type}</td>
                      <td className="p-4 text-[#9EA5A8]">{ev.timestamp ? ev.timestamp.slice(11, 19) : 'N/A'}</td>
                      <td className="p-4 font-mono text-[12px] text-[#9EA5A8] max-w-md truncate">
                        {JSON.stringify(ev.payload)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Immutable Disk Audit Logs */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          {auditLogs.length === 0 ? (
            <div className="p-8 text-center bg-[#101317] border border-[#EDE7DC]/13 rounded text-sm font-mono text-[#9EA5A8]">
              No audit log entries recorded in tools/audit.log.
            </div>
          ) : (
            <div className="bg-[#101317] border border-[#EDE7DC]/13 rounded overflow-hidden">
              <table className="w-full text-left font-mono text-sm">
                <thead className="bg-[#0A0C0E] border-b border-[#EDE7DC]/13 text-[#9EA5A8] uppercase text-[12px]">
                  <tr>
                    <th className="p-4">ACTION ID</th>
                    <th className="p-4">ACTION TYPE</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4">LATENCY</th>
                    <th className="p-4">TIMESTAMP</th>
                    <th className="p-4">MESSAGE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE7DC]/10 text-[#EDE7DC]">
                  {auditLogs.map((log) => (
                    <tr key={log.action_id} className="hover:bg-[#0A0C0E]/50">
                      <td className="p-4 text-[#2E6B72]">{log.action_id.slice(0, 8)}</td>
                      <td className="p-4 font-bold uppercase text-[#EDE7DC]">{log.action}</td>
                      <td className="p-4 font-bold text-[#2E6B72] uppercase">{log.status}</td>
                      <td className="p-4 text-[#E8913C]">{log.execution_time_ms} ms</td>
                      <td className="p-4 text-[#9EA5A8]">{log.timestamp ? log.timestamp.slice(11, 19) : ''}</td>
                      <td className="p-4 text-[#9EA5A8] max-w-xs truncate">{log.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
