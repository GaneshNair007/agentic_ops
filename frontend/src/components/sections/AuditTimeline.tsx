import React, { useState, useEffect } from 'react';
import { RefreshCw, Trash2, Code, ShieldCheck, Terminal, AlertCircle, FileText } from 'lucide-react';
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
    setShowRawJson((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Robust defensive serializer preventing [object Object] crashes or circular ref errors
  const safeSerialize = (val: any): string => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'object') {
      try {
        return JSON.stringify(val, null, 2);
      } catch {
        return '[Circular or Unserializable Structure]';
      }
    }
    return String(val);
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [evRes, auditRes] = await Promise.all([
        api.listEvents(),
        api.getAuditLogs(),
      ]);
      setEvents(evRes?.events || []);
      setAuditLogs(auditRes?.logs || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch timeline logs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearEvents = async () => {
    if (!window.confirm('Are you sure you want to clear session events?')) return;
    setIsLoading(true);
    try {
      await api.clearEvents();
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to clear events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section id="audit" className="w-full min-h-[80vh] bg-[#000000] text-[#FFFFFF] py-24 border-b border-[#E5E5E5]">
      <div className="w-full px-6 md:px-12 lg:px-24 space-y-16">
        
        {/* Section Header */}
        <div className="border-b border-[#262626] pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="label-caps text-[#A3A3A3] mb-4 font-mono text-xs">// FORENSIC EVIDENCE TRAIL</div>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-[#FFFFFF] leading-[0.95] tracking-tight">
              IMMUTABLE AUDIT<br />RECORD
            </h2>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="bg-[#0A0A0A] hover:bg-[#1A1A1A] border border-[#333333] hover:border-[#FFFFFF] text-[#FFFFFF] font-mono text-xs tracking-widest uppercase py-4 px-6 transition-colors flex items-center gap-3 font-bold"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> REFRESH
            </button>
            <button
              onClick={handleClearEvents}
              disabled={isLoading}
              className="bg-[#FFFFFF] hover:bg-[#E5E5E5] border border-[#FFFFFF] text-[#000000] font-mono text-xs tracking-widest uppercase py-4 px-6 transition-colors flex items-center gap-3 font-bold"
            >
              <Trash2 className="w-4 h-4" /> CLEAR STATE
            </button>
          </div>
        </div>

        {/* View Switcher (Tab Bar) */}
        <div className="flex border-b border-[#262626] gap-8 md:gap-16 font-mono text-xs md:text-sm font-bold">
          <button
            onClick={() => setActiveTab('events')}
            className={`pb-4 uppercase tracking-widest transition-colors border-b-2 flex items-center gap-3 ${
              activeTab === 'events'
                ? 'border-[#FFFFFF] text-[#FFFFFF]'
                : 'border-transparent text-[#737373] hover:text-[#A3A3A3]'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>SESSION EVENT BUS ({events.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-4 uppercase tracking-widest transition-colors border-b-2 flex items-center gap-3 ${
              activeTab === 'audit'
                ? 'border-[#FFFFFF] text-[#FFFFFF]'
                : 'border-transparent text-[#737373] hover:text-[#A3A3A3]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>DISK-BACKED AUDIT LOGS ({auditLogs.length})</span>
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-5 border border-[#FFFFFF] bg-[#0A0A0A] text-[#FFFFFF] font-mono text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#FFFFFF]" />
            <span>[ERROR] {error}</span>
          </div>
        )}

        {/* 1px Vertical Axis Timeline */}
        <div className="relative pl-6 md:pl-16 pt-4">
          {/* The 1px Strict Vertical Axis Line */}
          <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-[#333333]" />

          {/* Tab 1: Live Event Bus Items */}
          {activeTab === 'events' && (
            <div className="space-y-12">
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 px-6 border border-[#262626] bg-[#050505]">
                  <Terminal className="w-12 h-12 text-[#333333] mb-6" />
                  <div className="font-mono text-lg font-bold text-[#888888] mb-2 uppercase tracking-widest">
                    SYSTEM RECORD EMPTY. RUN SIMULATION.
                  </div>
                  <div className="font-mono text-xs text-[#555555] uppercase tracking-wider text-center max-w-md leading-relaxed">
                    No runtime telemetry detected in current session. Run an incident simulation to generate live event stream data.
                  </div>
                </div>
              ) : (
                events.map((ev, idx) => {
                  const id = ev.event_id || ev.id || `ev-${idx}`;
                  const tsRaw = ev.timestamp || new Date().toISOString();
                  const tsTime = tsRaw.length >= 19 ? tsRaw.slice(11, 23) : tsRaw;
                  const tsDate = tsRaw.length >= 10 ? tsRaw.slice(0, 10) : '';

                  return (
                    <div key={id} className="relative group">
                      {/* Geometric Node on Axis */}
                      <div className="absolute -left-[31px] md:-left-[71px] top-4 w-3.5 h-3.5 bg-[#FFFFFF] border-2 border-[#000000] z-10 transition-transform group-hover:scale-125" />
                      
                      <div className="flex flex-col xl:flex-row gap-6 xl:gap-12 items-start">
                        {/* Prominent Monospaced Timestamp */}
                        <div className="flex-shrink-0 font-mono text-left xl:w-56">
                          <div className="text-2xl md:text-4xl font-black text-[#FFFFFF] tracking-tight">
                            {tsTime}
                          </div>
                          <div className="text-[#888888] text-xs tracking-wider uppercase mt-2">
                            {tsDate} // EVENT #{String(idx + 1).padStart(3, '0')}
                          </div>
                        </div>

                        {/* Event Card Content */}
                        <div className="flex-1 bg-[#050505] border border-[#262626] p-6 md:p-8 hover:border-[#FFFFFF] transition-colors w-full">
                          <div className="flex justify-between items-center mb-5 pb-4 border-b border-[#262626]">
                            <h3 className="font-display text-xl md:text-2xl font-bold text-[#FFFFFF] uppercase tracking-tight">
                              {ev.type.replace(/_/g, ' ')}
                            </h3>
                            <button 
                              onClick={() => toggleJson(id)}
                              className="text-[#888888] hover:text-[#FFFFFF] flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider transition-colors font-bold px-3 py-1.5 border border-[#333333] hover:border-[#FFFFFF] bg-[#000000]"
                            >
                              <Code className="w-3.5 h-3.5" /> RAW DATA
                            </button>
                          </div>
                          
                          {showRawJson[id] ? (
                            <pre className="bg-[#0A0A0A] p-5 text-[#A3A3A3] font-mono text-xs overflow-x-auto border border-[#333333] whitespace-pre-wrap">
                              {safeSerialize(ev.payload)}
                            </pre>
                          ) : (
                            <div className="font-mono text-[#D4D4D4] text-xs md:text-sm leading-relaxed">
                              {typeof ev.payload === 'object' && ev.payload !== null
                                ? ev.payload?.message || ev.payload?.title || ev.payload?.description || (
                                    <pre className="bg-[#0A0A0A] p-4 border border-[#333333] text-[11px] text-[#A3A3A3] overflow-x-auto whitespace-pre-wrap">
                                      {safeSerialize(ev.payload)}
                                    </pre>
                                  )
                                : safeSerialize(ev.payload)}
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

          {/* Tab 2: Disk-Backed Audit Logs */}
          {activeTab === 'audit' && (
            <div className="space-y-12">
              {auditLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 px-6 border border-[#262626] bg-[#050505]">
                  <ShieldCheck className="w-12 h-12 text-[#333333] mb-6" />
                  <div className="font-mono text-lg font-bold text-[#888888] mb-2 uppercase tracking-widest">
                    TOOLS/AUDIT.LOG IS EMPTY.
                  </div>
                  <div className="font-mono text-xs text-[#555555] uppercase tracking-wider text-center max-w-md leading-relaxed">
                    No immutable records have been committed to disk in the current session.
                  </div>
                </div>
              ) : (
                auditLogs.map((log, idx) => {
                  const id = log.action_id || `audit-${idx}`;
                  const tsRaw = log.timestamp || new Date().toISOString();
                  const tsTime = tsRaw.length >= 19 ? tsRaw.slice(11, 23) : tsRaw;
                  const tsDate = tsRaw.length >= 10 ? tsRaw.slice(0, 10) : '';
                  const actionName = log.action_type || log.action || 'UNKNOWN_ACTION';

                  return (
                    <div key={id} className="relative group">
                      {/* Geometric Node on Axis */}
                      <div className="absolute -left-[31px] md:-left-[71px] top-4 w-3.5 h-3.5 bg-[#000000] border-2 border-[#FFFFFF] z-10 transition-transform group-hover:scale-125" />
                      
                      <div className="flex flex-col xl:flex-row gap-6 xl:gap-12 items-start">
                        {/* Prominent Monospaced Timestamp */}
                        <div className="flex-shrink-0 font-mono text-left xl:w-56">
                          <div className="text-2xl md:text-4xl font-black text-[#FFFFFF] tracking-tight">
                            {tsTime}
                          </div>
                          <div className="text-[#888888] text-xs tracking-wider uppercase mt-2">
                            {tsDate} // ID: {id.slice(0, 8)}
                          </div>
                        </div>

                        {/* Audit Card Content */}
                        <div className="flex-1 bg-[#050505] border border-[#262626] p-6 md:p-8 hover:border-[#FFFFFF] transition-colors w-full">
                          <div className="flex justify-between items-center mb-5 pb-4 border-b border-[#262626]">
                            <h3 className="font-display text-xl md:text-2xl font-bold text-[#FFFFFF] uppercase tracking-tight">
                              PROTOCOL: {actionName}
                            </h3>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-[10px] bg-[#FFFFFF] text-[#000000] px-3 py-1 uppercase tracking-widest font-black border border-[#FFFFFF]">
                                {log.status}
                              </span>
                              <button 
                                onClick={() => toggleJson(id)}
                                className="text-[#888888] hover:text-[#FFFFFF] flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider transition-colors font-bold px-3 py-1.5 border border-[#333333] hover:border-[#FFFFFF] bg-[#000000]"
                              >
                                <Code className="w-3.5 h-3.5" /> RAW DATA
                              </button>
                            </div>
                          </div>
                          
                          {showRawJson[id] ? (
                            <pre className="bg-[#0A0A0A] p-5 text-[#A3A3A3] font-mono text-xs overflow-x-auto border border-[#333333] whitespace-pre-wrap">
                              {safeSerialize(log)}
                            </pre>
                          ) : (
                            <div className="font-mono text-xs md:text-sm space-y-3 text-[#D4D4D4]">
                              {log.message && (
                                <div className="flex"><span className="font-bold text-[#FFFFFF] w-24">MESSAGE:</span> <span>{log.message}</span></div>
                              )}
                              {log.details && (
                                <div className="flex"><span className="font-bold text-[#FFFFFF] w-24">DETAILS:</span> <span>{log.details}</span></div>
                              )}
                              {log.execution_time_ms !== undefined && (
                                <div className="flex"><span className="font-bold text-[#FFFFFF] w-24">LATENCY:</span> <span>{log.execution_time_ms}ms</span></div>
                              )}
                              {log.params && (
                                <div className="flex">
                                  <span className="font-bold text-[#FFFFFF] w-24">PARAMS:</span>
                                  <span className="text-[#A3A3A3]">{safeSerialize(log.params)}</span>
                                </div>
                              )}
                              <div className="flex pt-2">
                                <span className="font-bold text-[#FFFFFF] w-24">STATUS:</span>
                                <span className="font-bold text-[#FFFFFF] uppercase">{log.status}</span>
                              </div>
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
