import React, { useState } from 'react';
import { Play, ShieldAlert, Cpu, CheckCircle2, FileText, Wrench } from 'lucide-react';
import { api } from '../../services/api';
import { PipelineRunResponse, SeverityLevel } from '../../types';

interface IncidentSimulatorProps {
  onPipelineCompleted?: (data: PipelineRunResponse) => void;
}

export const IncidentSimulator: React.FC<IncidentSimulatorProps> = ({ onPipelineCompleted }) => {
  const [service, setService] = useState('payment-api');
  const [severity, setSeverity] = useState<SeverityLevel>('P1');
  const [symptom, setSymptom] = useState('HTTP 504 Gateway Timeout spike on /v1/checkout');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pipelineOutput, setPipelineOutput] = useState<PipelineRunResponse | null>(null);

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

  return (
    <section id="simulator" className="w-full min-h-screen bg-[#F5F3EE] text-[#202020] py-24 border-b border-[#D8D6D0]">
      <div className="container-full space-y-12">
        {/* Header */}
        <div className="border-b border-[#D8D6D0] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="label-caps text-[#686868]">// LIVE INCIDENT SIMULATOR</div>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold text-[#202020] mt-2">
              AUTOMATED TRIAGE CONSOLE
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#050505] text-xs font-mono uppercase tracking-wider text-[#050505] font-bold">
            <ShieldAlert className="w-4 h-4 text-[#050505]" />
            SIMULATION MODE — NO LIVE INFRASTRUCTURE IS MODIFIED
          </div>
        </div>

        {/* 40/60 Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 40% Left Controls Panel */}
          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handleRunPipeline} className="bg-[#FFFFFF] border border-[#D8D6D0] p-8 space-y-6">
              {/* Target Service */}
              <div>
                <label htmlFor="service-input" className="block label-caps text-[#686868] mb-2">
                  TARGET SERVICE NAME
                </label>
                <input
                  id="service-input"
                  type="text"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-[#F5F3EE] border border-[#D8D6D0] p-4 font-mono text-sm text-[#202020] focus:border-[#050505] outline-none"
                  placeholder="e.g. payment-api"
                  required
                />
              </div>

              {/* Severity Level */}
              <div>
                <label className="block label-caps text-[#686868] mb-2">
                  SEVERITY TIER
                </label>
                <div className="flex gap-2">
                  {(['P1', 'P2', 'P3'] as SeverityLevel[]).map((level) => (
                    <button
                      type="button"
                      key={level}
                      onClick={() => setSeverity(level)}
                      className={`flex-1 py-3 font-mono text-xs uppercase border transition-all ${
                        severity === level
                          ? 'bg-[#050505] text-[#F1F1F1] border-[#050505] font-bold'
                          : 'bg-[#F5F3EE] text-[#4A4A4A] border-[#D8D6D0] hover:border-[#050505]'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptom Description */}
              <div>
                <label htmlFor="symptom-input" className="block label-caps text-[#686868] mb-2">
                  INCIDENT SYMPTOM PAYLOAD
                </label>
                <input
                  id="symptom-input"
                  type="text"
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  className="w-full bg-[#F5F3EE] border border-[#D8D6D0] p-4 font-mono text-sm text-[#202020] focus:border-[#050505] outline-none"
                  placeholder="e.g. HTTP 504 Gateway Timeout spike on /v1/checkout"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-sre-mono py-4 text-sm flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin text-[#F1F1F1]" />
                    RUNNING CONTROLLED TRIAGE...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    RUN CONTROLLED TRIAGE
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="p-4 border border-[#050505] bg-[#050505] text-[#F1F1F1] text-xs font-mono">
                [PIPELINE ERROR] {error}
              </div>
            )}
          </div>

          {/* 60% Right Animated Pipeline Output Stage */}
          <div className="lg:col-span-7">
            <div className="bg-[#050505] text-[#F1F1F1] border border-[#050505] p-8 space-y-6 min-h-[500px]">
              <div className="flex items-center justify-between border-b border-white/20 pb-4 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#FFFFFF]" />
                  <span className="font-bold uppercase tracking-wider">
                    {pipelineOutput ? `PIPELINE COMPLETED IN ${pipelineOutput.total_duration_sec}s` : 'IDLE — AWAITING SIMULATION TRIGGER'}
                  </span>
                </div>
                <div>STATUS: {pipelineOutput ? pipelineOutput.status.toUpperCase() : 'STANDBY'}</div>
              </div>

              {!pipelineOutput ? (
                <div className="h-80 flex flex-col items-center justify-center text-center text-[#8E8E8E] font-mono text-xs space-y-3">
                  <Cpu className="w-8 h-8 text-[#8E8E8E]" />
                  <div>Select target service and click RUN CONTROLLED TRIAGE to execute.</div>
                </div>
              ) : (
                <div className="space-y-4 font-mono text-xs">
                  {/* Event Timeline Sequence */}
                  {pipelineOutput.events.map((ev, idx) => (
                    <div key={ev.event_id || idx} className="border border-white/15 p-4 space-y-2 bg-[#141414]">
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="font-bold text-[#FFFFFF]">[{idx + 1}] STAGE: {ev.type.toUpperCase().replace('_', ' ')}</span>
                        <span className="text-[#8E8E8E]">{ev.timestamp ? ev.timestamp.slice(11, 19) : ''}</span>
                      </div>
                      <pre className="text-[#C8C8C8] text-[11px] overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(ev.payload, null, 2)}
                      </pre>
                    </div>
                  ))}

                  {/* Controlled Action Output */}
                  {pipelineOutput.action_result && (
                    <div className="border border-white/30 p-5 space-y-2 bg-[#141414]">
                      <div className="text-xs font-mono font-bold uppercase text-[#FFFFFF] flex items-center gap-2">
                        <Wrench className="w-4 h-4" /> CONTROLLED ACTION EXECUTION RESULT
                      </div>
                      <div className="font-mono text-xs text-[#C8C8C8] space-y-1">
                        <div>ACTION: {pipelineOutput.action_result.action}</div>
                        <div>STATUS: {pipelineOutput.action_result.status.toUpperCase()}</div>
                        <div>MESSAGE: {pipelineOutput.action_result.message}</div>
                        <div>ACTION ID: {pipelineOutput.action_result.action_id}</div>
                        <div>EXECUTION LATENCY: {pipelineOutput.action_result.execution_time_ms} ms</div>
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
