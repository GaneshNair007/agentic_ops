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
    <section id="simulator" className="w-full min-h-screen bg-[#F3F1EC] text-[#090909] py-24 px-6 md:px-12 border-b border-[#D8D6D0]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-[#D8D6D0] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="label-caps text-[#686868]">// INTERACTIVE CONSOLE</div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-[#090909] mt-2">
              LIVE INCIDENT SIMULATOR
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#090909] text-[11px] font-mono uppercase tracking-wider text-[#090909]">
            <ShieldAlert className="w-4 h-4 text-[#090909]" />
            SIMULATION MODE — NO LIVE INFRASTRUCTURE IS MODIFIED
          </div>
        </div>

        {/* Input Composer Form */}
        <form onSubmit={handleRunPipeline} className="bg-[#FFFFFF] border border-[#D8D6D0] p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Target Service */}
            <div>
              <label className="block label-caps text-[#686868] mb-2">
                TARGET SERVICE
              </label>
              <input
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full bg-[#F3F1EC] border border-[#D8D6D0] p-3 font-mono text-sm text-[#090909] focus:border-[#090909] outline-none"
                placeholder="e.g. payment-api"
                required
              />
            </div>

            {/* Severity Level */}
            <div>
              <label className="block label-caps text-[#686868] mb-2">
                SEVERITY LEVEL
              </label>
              <div className="flex gap-2">
                {(['P1', 'P2', 'P3'] as SeverityLevel[]).map((level) => (
                  <button
                    type="button"
                    key={level}
                    onClick={() => setSeverity(level)}
                    className={`flex-1 py-3 font-mono text-xs uppercase border transition-all ${
                      severity === level
                        ? 'bg-[#090909] text-[#F3F1EC] border-[#090909] font-bold'
                        : 'bg-[#F3F1EC] text-[#303030] border-[#D8D6D0] hover:border-[#090909]'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Run Button */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-sre-mono py-3 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin text-[#F3F1EC]" />
                    RUNNING PIPELINE...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    RUN CONTROLLED TRIAGE
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Symptom Input */}
          <div>
            <label className="block label-caps text-[#686868] mb-2">
              INCIDENT SYMPTOM DESCRIPTION
            </label>
            <input
              type="text"
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              className="w-full bg-[#F3F1EC] border border-[#D8D6D0] p-3 font-mono text-sm text-[#090909] focus:border-[#090909] outline-none"
              placeholder="e.g. HTTP 504 Gateway Timeout spike on /v1/checkout"
              required
            />
          </div>
        </form>

        {/* Error Banner */}
        {error && (
          <div className="p-4 border border-[#090909] bg-[#090909] text-[#F3F1EC] text-xs font-mono">
            [PIPELINE ERROR] {error}
          </div>
        )}

        {/* Operational Black Stage Execution Trace */}
        {pipelineOutput && (
          <div className="bg-[#090909] text-[#F3F1EC] border border-[#090909] p-8 space-y-8">
            <div className="flex items-center justify-between border-b border-[#F3F1EC]/20 pb-4 font-mono text-xs">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#F3F1EC]" />
                <span className="font-bold uppercase tracking-wider">PIPELINE TRACE COMPLETE</span>
              </div>
              <div>DURATION: {pipelineOutput.total_duration_sec} SECONDS</div>
            </div>

            {/* Event Timeline Sequence */}
            <div className="space-y-4 font-mono text-xs">
              {pipelineOutput.events.map((ev, idx) => (
                <div key={ev.event_id || idx} className="border border-[#F3F1EC]/15 p-4 space-y-2 bg-[#141414]">
                  <div className="flex justify-between items-center border-b border-[#F3F1EC]/10 pb-2">
                    <span className="font-bold text-[#F3F1EC]">[{idx + 1}] STAGE: {ev.type.toUpperCase().replace('_', ' ')}</span>
                    <span className="text-[#686868]">{ev.timestamp ? ev.timestamp.slice(11, 19) : ''}</span>
                  </div>
                  <pre className="text-[#D8D6D0] text-[11px] overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(ev.payload, null, 2)}
                  </pre>
                </div>
              ))}
            </div>

            {/* Action Execution Result */}
            {pipelineOutput.action_result && (
              <div className="border border-[#F3F1EC]/30 p-6 space-y-2 bg-[#141414]">
                <div className="text-xs font-mono font-bold uppercase text-[#F3F1EC] flex items-center gap-2">
                  <Wrench className="w-4 h-4" /> CONTROLLED ACTION RESULT
                </div>
                <div className="font-mono text-xs text-[#D8D6D0] space-y-1">
                  <div>ACTION: {pipelineOutput.action_result.action}</div>
                  <div>STATUS: {pipelineOutput.action_result.status.toUpperCase()}</div>
                  <div>MESSAGE: {pipelineOutput.action_result.message}</div>
                  <div>ACTION ID: {pipelineOutput.action_result.action_id}</div>
                  <div>LATENCY: {pipelineOutput.action_result.execution_time_ms} ms</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
