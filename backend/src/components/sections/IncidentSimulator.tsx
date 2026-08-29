import React, { useState } from 'react';
import { Play, Cpu, CheckCircle2, AlertCircle, Wrench, Shield, Terminal, Zap } from 'lucide-react';
import { api } from '../../services/api';
import { PipelineRunResponse, SeverityLevel } from '../../types';

interface IncidentSimulatorProps {
  onPipelineCompleted?: (data: PipelineRunResponse) => void;
}

interface ScenarioPreset {
  id: string;
  label: string;
  service: string;
  severity: SeverityLevel;
  symptom: string;
  description: string;
}

const PRESET_SCENARIOS: ScenarioPreset[] = [
  {
    id: 'SCN-01',
    label: 'PAYMENT API 504 GATEWAY TIMEOUT',
    service: 'payment-api',
    severity: 'P1',
    symptom: 'HTTP 504 Gateway Timeout spike on /v1/checkout',
    description: 'Worker process saturation under checkout burst traffic.',
  },
  {
    id: 'SCN-02',
    label: 'POSTGRES CONNECTION POOL EXHAUSTION',
    service: 'user-profile-pg-cluster',
    severity: 'P1',
    symptom: 'FATAL: remaining connection slots are reserved for non-replication superuser connections',
    description: '100/100 connection pool handles locked in idle transaction state.',
  },
  {
    id: 'SCN-03',
    label: 'COREDNS NXDOMAIN RESOLUTION SPIKE',
    service: 'coredns',
    severity: 'P2',
    symptom: 'CoreDNS pod latency spike > 450ms during NXDOMAIN flood',
    description: 'Internal DNS saturation requiring horizontal pod auto-scale.',
  },
];

export const IncidentSimulator: React.FC<IncidentSimulatorProps> = ({ onPipelineCompleted }) => {
  const [service, setService] = useState('payment-api');
  const [severity, setSeverity] = useState<SeverityLevel>('P1');
  const [symptom, setSymptom] = useState('HTTP 504 Gateway Timeout spike on /v1/checkout');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pipelineOutput, setPipelineOutput] = useState<PipelineRunResponse | null>(null);

  const handleApplyPreset = (preset: ScenarioPreset) => {
    setService(preset.service);
    setSeverity(preset.severity);
    setSymptom(preset.symptom);
  };

  const handleRunPipeline = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.runPipeline(service, severity, symptom);
      setPipelineOutput(data);
      if (onPipelineCompleted) onPipelineCompleted(data);
    } catch (err: any) {
      setError(err.message || 'Pipeline execution failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Safe JSON serialization helper to prevent any [object Object] rendering
  const renderPayload = (payload: any) => {
    if (payload === null || payload === undefined) return '';
    if (typeof payload === 'object') {
      try {
        return JSON.stringify(payload, null, 2);
      } catch {
        return '[Circular or Unserializable Structure]';
      }
    }
    return String(payload);
  };

  return (
    <section id="simulator" className="w-full bg-[#050505] text-[#FFFFFF] py-24 border-b border-[#262626]">
      <div className="container-full space-y-16">
        
        {/* Section Header */}
        <div className="border-b border-[#262626] pb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="label-caps text-[#A3A3A3] mb-4">// LIVE INCIDENT SIMULATOR</div>
            <h2 className="font-display text-5xl md:text-6xl lg:text-[80px] font-black text-[#FFFFFF] tracking-tighter leading-none">
              AUTOMATED TRIAGE<br className="hidden md:block" /> CONSOLE
            </h2>
          </div>
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-[#333333] bg-[#0A0A0A] text-[#FFFFFF] text-xs font-mono uppercase tracking-widest font-bold">
            <Shield className="w-4 h-4 text-[#A3A3A3]" />
            SIMULATION MODE — NO LIVE INFRASTRUCTURE MODIFIED
          </div>
        </div>

        {/* Preset Scenarios Fast Selector */}
        <div className="space-y-4">
          <div className="font-mono text-xs text-[#888888] uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#FFFFFF]" /> SELECT PRESET PRODUCTION FAILURE SCENARIO:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRESET_SCENARIOS.map((preset) => {
              const isSelected = service === preset.service && symptom === preset.symptom;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`text-left p-6 border transition-all duration-300 ${
                    isSelected
                      ? 'border-[#FFFFFF] bg-[#111111] text-[#FFFFFF] shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                      : 'border-[#333333] bg-[#0A0A0A] text-[#A3A3A3] hover:border-[#888888] hover:text-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold tracking-widest opacity-80">
                      [{preset.id}]
                    </span>
                    <span className={`font-mono text-[10px] px-2 py-0.5 border ${
                      isSelected ? 'border-white text-white' : 'border-[#333333] text-[#888888]'
                    }`}>
                      {preset.severity}
                    </span>
                  </div>
                  <div className={`font-mono text-sm font-bold uppercase mb-2 ${isSelected ? 'text-[#FFFFFF]' : 'text-[#D4D4D4]'}`}>
                    {preset.label}
                  </div>
                  <div className="text-xs font-sans leading-relaxed">
                    {preset.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 40/60 Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-4">
          
          {/* 40% Left Controls Panel */}
          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handleRunPipeline} className="bg-[#0A0A0A] border border-[#262626] p-8 space-y-8">
              <div className="border-b border-[#262626] pb-4 flex items-center justify-between font-mono text-xs text-[#888888] uppercase tracking-wider">
                <span>INCIDENT INGESTION PARAMETERS</span>
                <span>[INPUT]</span>
              </div>

              {/* Target Service */}
              <div>
                <label htmlFor="service-input" className="block text-[#D4D4D4] mb-3 font-mono text-xs uppercase tracking-widest font-bold">
                  TARGET SERVICE NAME
                </label>
                <input
                  id="service-input"
                  type="text"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-[#000000] border border-[#333333] p-4 font-mono text-sm text-[#FFFFFF] focus:border-[#FFFFFF] outline-none transition-colors"
                  placeholder="e.g. payment-api"
                  required
                />
              </div>

              {/* Severity Level */}
              <div>
                <label className="block text-[#D4D4D4] mb-3 font-mono text-xs uppercase tracking-widest font-bold">
                  SEVERITY TIER
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['P1', 'P2', 'P3'] as SeverityLevel[]).map((level) => (
                    <button
                      type="button"
                      key={level}
                      onClick={() => setSeverity(level)}
                      className={`py-3 font-mono text-sm uppercase border transition-all ${
                        severity === level
                          ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] font-bold'
                          : 'bg-[#000000] text-[#888888] border-[#333333] hover:border-[#888888] hover:text-[#FFFFFF]'
                      }`}
                    >
                      [{level}]
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptom Description */}
              <div>
                <label htmlFor="symptom-input" className="block text-[#D4D4D4] mb-3 font-mono text-xs uppercase tracking-widest font-bold">
                  INCIDENT SYMPTOM PAYLOAD
                </label>
                <textarea
                  id="symptom-input"
                  rows={4}
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  className="w-full bg-[#000000] border border-[#333333] p-4 font-mono text-sm text-[#FFFFFF] focus:border-[#FFFFFF] outline-none transition-colors resize-none leading-relaxed"
                  placeholder="Describe failure symptom..."
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-sre-mono py-5 text-sm font-mono tracking-widest flex items-center justify-center gap-3 transition-colors uppercase font-bold"
              >
                {isLoading ? (
                  <>
                    <Cpu className="w-5 h-5 animate-spin text-[#000000]" />
                    <span>RUNNING CONTROLLED TRIAGE...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 text-[#000000] fill-current" />
                    <span>RUN CONTROLLED TRIAGE</span>
                  </>
                )}
              </button>
            </form>

            {/* Error Display */}
            {error && (
              <div className="p-4 border border-[#FFFFFF] bg-[#0A0A0A] text-[#FFFFFF] text-xs font-mono space-y-2">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4" /> [PIPELINE ERROR]
                </div>
                <div className="text-[#D4D4D4]">{error}</div>
              </div>
            )}
          </div>

          {/* 60% Right Animated Pipeline Output Stage */}
          <div className="lg:col-span-7">
            <div className="bg-[#0A0A0A] text-[#FFFFFF] border border-[#262626] p-8 min-h-[640px] flex flex-col">
              
              {/* Output Header */}
              <div className="flex items-center justify-between border-b border-[#262626] pb-5 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <Terminal className="w-4 h-4 text-[#FFFFFF]" />
                  <span className="font-bold uppercase tracking-wider text-[#FFFFFF]">
                    {pipelineOutput ? `PIPELINE COMPLETED IN ${pipelineOutput.total_duration_sec}s` : 'SYSTEM STANDBY'}
                  </span>
                </div>
                <div className="text-[#888888] font-bold tracking-widest uppercase">
                  STATUS: <span className={pipelineOutput ? 'text-[#FFFFFF]' : ''}>{pipelineOutput ? pipelineOutput.status : 'AWAITING TRIGGER'}</span>
                </div>
              </div>

              {/* Standby / Initial State */}
              {!pipelineOutput ? (
                <div className="flex-1 flex flex-col justify-between py-8 text-[#A3A3A3] font-mono text-xs">
                  <div className="space-y-2 bg-[#000000] border border-[#333333] p-8">
                    <div className="text-[#FFFFFF] font-bold mb-4 flex items-center gap-2 tracking-widest text-sm">
                      <Zap className="w-4 h-4" /> SYSTEM TELEMETRY READY
                    </div>
                    <div className="opacity-75">2026-08-29 08:00:01 [INFO] agent_core_loop initialized</div>
                    <div className="opacity-75">2026-08-29 08:00:03 [INFO] chromadb_vector_store connected (35 docs indexed)</div>
                    <div className="opacity-75">2026-08-29 08:00:03 [INFO] action_engine ready (8 controlled protocols mapped)</div>
                    <div className="opacity-75">2026-08-29 08:00:05 [INFO] event_bus timeline stream active</div>
                    <div className="pt-6 text-[#FFFFFF] font-bold animate-pulse">
                      _ listening for incident payload...
                    </div>
                  </div>
                  <div className="text-[11px] text-[#555555] text-right uppercase tracking-widest pt-8">
                    INPUT INCIDENT PARAMS ON LEFT TO TRIGGER AUTOMATED RECOVERY
                  </div>
                </div>
              ) : (
                <div className="space-y-8 font-mono text-xs pt-6">
                  
                  {/* Pipeline Summary Strip */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#000000] border border-[#333333] p-4 text-center">
                    <div className="border-r border-[#262626]">
                      <div className="text-[#737373] text-[10px] uppercase tracking-widest mb-1">SERVICE</div>
                      <div className="font-bold text-[#FFFFFF] truncate px-2">{pipelineOutput.service}</div>
                    </div>
                    <div className="border-r border-[#262626]">
                      <div className="text-[#737373] text-[10px] uppercase tracking-widest mb-1">DURATION</div>
                      <div className="font-bold text-[#FFFFFF]">{pipelineOutput.total_duration_sec}s</div>
                    </div>
                    <div className="border-r border-[#262626]">
                      <div className="text-[#737373] text-[10px] uppercase tracking-widest mb-1">DOCS RETRIEVED</div>
                      <div className="font-bold text-[#FFFFFF]">{pipelineOutput.retrieved_docs?.length || 0}</div>
                    </div>
                    <div>
                      <div className="text-[#737373] text-[10px] uppercase tracking-widest mb-1">STATUS</div>
                      <div className="font-bold text-[#FFFFFF] uppercase">{pipelineOutput.status}</div>
                    </div>
                  </div>

                  {/* Event Timeline Sequence */}
                  <div className="space-y-4">
                    <div className="text-[#888888] font-mono text-[11px] uppercase tracking-[0.2em] mb-4">
                      // STAGE EXECUTION LOG
                    </div>
                    {pipelineOutput.events.map((ev, idx) => (
                      <div key={ev.event_id || idx} className="border border-[#333333] p-5 space-y-3 bg-[#000000]">
                        <div className="flex justify-between items-center border-b border-[#262626] pb-3">
                          <span className="font-bold text-[#FFFFFF] uppercase tracking-wider">
                            [{idx + 1}] STAGE: {ev.type.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[#737373]">
                            {ev.timestamp ? ev.timestamp.slice(11, 19) : ''}
                          </span>
                        </div>
                        <pre className="text-[#A3A3A3] text-xs overflow-x-auto whitespace-pre-wrap font-mono p-1">
                          {renderPayload(ev.payload)}
                        </pre>
                      </div>
                    ))}
                  </div>

                  {/* Controlled Action Output */}
                  {pipelineOutput.action_result && (
                    <div className="border border-[#FFFFFF] p-6 space-y-4 bg-[#FFFFFF] text-[#000000]">
                      <div className="text-xs font-mono font-bold uppercase text-[#000000] flex items-center justify-between border-b border-[#000000] pb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-[#000000]" /> CONTROLLED ACTION EXECUTED
                        </div>
                        <span className="border border-[#000000] px-3 py-1 text-[10px] font-black tracking-widest">
                          {pipelineOutput.action_result.status}
                        </span>
                      </div>
                      <div className="font-mono text-xs space-y-2 pt-2">
                        <div className="flex"><span className="w-24 font-bold">ACTION:</span> <span>{pipelineOutput.action_result.action}</span></div>
                        <div className="flex"><span className="w-24 font-bold">STATUS:</span> <span>{pipelineOutput.action_result.status.toUpperCase()}</span></div>
                        <div className="flex"><span className="w-24 font-bold">MESSAGE:</span> <span>{pipelineOutput.action_result.message}</span></div>
                        <div className="flex"><span className="w-24 font-bold">ACTION ID:</span> <span>{pipelineOutput.action_result.action_id}</span></div>
                        <div className="flex"><span className="w-24 font-bold">LATENCY:</span> <span>{pipelineOutput.action_result.execution_time_ms} ms</span></div>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
