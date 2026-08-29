import React, { useState } from 'react';
import { Play, ShieldAlert, Cpu, CheckCircle2, Clock, FileText, Wrench } from 'lucide-react';
import { api } from '../services/api';
import { PipelineRunResponse, SeverityLevel } from '../types';

interface IncidentSimulatorProps {
  onPipelineStarted?: () => void;
  onPipelineCompleted?: (data: PipelineRunResponse) => void;
}

export const IncidentSimulator: React.FC<IncidentSimulatorProps> = ({
  onPipelineStarted,
  onPipelineCompleted,
}) => {
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
    if (onPipelineStarted) onPipelineStarted();

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
    <div className="w-full space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EDE7DC]/13 pb-6">
        <div>
          <div className="text-[12px] font-mono text-[#9EA5A8] uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E8913C]" />
            INCIDENT RISK TRIAGE & RESPONSE PIPELINE
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-[#EDE7DC] mt-1">
            INCIDENT COMPOSER & SIMULATION TRACE
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#E8913C] rounded text-[12px] font-mono text-[#E8913C] uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-[#E8913C]" />
          SIMULATION MODE
        </div>
      </div>

      {/* Incident Input Composer */}
      <form onSubmit={handleRunPipeline} className="bg-[#101317] border border-[#EDE7DC]/13 rounded p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Target Service */}
          <div>
            <label className="block text-[12px] font-mono text-[#9EA5A8] uppercase tracking-widest mb-2">
              TARGET SERVICE
            </label>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full bg-[#0A0C0E] border border-[#EDE7DC]/13 rounded px-4 py-2.5 text-sm text-[#EDE7DC] font-mono focus:border-[#E8913C] outline-none"
              placeholder="e.g. payment-api"
              required
            />
          </div>

          {/* Severity Level */}
          <div>
            <label className="block text-[12px] font-mono text-[#9EA5A8] uppercase tracking-widest mb-2">
              SEVERITY LEVEL
            </label>
            <div className="flex gap-2">
              {(['P1', 'P2', 'P3'] as SeverityLevel[]).map((level) => (
                <button
                  type="button"
                  key={level}
                  onClick={() => setSeverity(level)}
                  className={`flex-1 py-2 rounded font-mono text-sm uppercase border transition-colors ${
                    severity === level
                      ? level === 'P1'
                        ? 'bg-[#E63946]/10 border-[#E63946] text-[#E63946] font-bold'
                        : 'bg-[#E8913C]/10 border-[#E8913C] text-[#E8913C] font-bold'
                      : 'border-[#EDE7DC]/13 text-[#9EA5A8] hover:border-[#EDE7DC]/30'
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
              className="w-full btn-sre-outline btn-sre-amber py-2.5 text-sm flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin text-[#E8913C]" />
                  RUNNING PIPELINE...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-[#E8913C]" />
                  RUN CONTROLLED TRIAGE
                </>
              )}
            </button>
          </div>
        </div>

        {/* Symptom Input */}
        <div>
          <label className="block text-[12px] font-mono text-[#9EA5A8] uppercase tracking-widest mb-2">
            INCIDENT SYMPTOM DESCRIPTION
          </label>
          <input
            type="text"
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            className="w-full bg-[#0A0C0E] border border-[#EDE7DC]/13 rounded px-4 py-2.5 text-sm text-[#EDE7DC] font-mono focus:border-[#E8913C] outline-none"
            placeholder="e.g. HTTP 504 Gateway Timeout spike on /v1/checkout"
            required
          />
        </div>
      </form>

      {/* Error Banner */}
      {error && (
        <div className="p-4 border border-[#E63946] bg-[#E63946]/10 text-[#E63946] rounded text-sm font-mono">
          [ERROR] {error}
        </div>
      )}

      {/* Real Pipeline Execution Trace */}
      {pipelineOutput && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#EDE7DC]/13 pb-3">
            <div className="text-sm font-mono text-[#E8913C] uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2E6B72]" />
              COMMAND TRACE — PIPELINE COMPLETED IN {pipelineOutput.total_duration_sec}s
            </div>
            <div className="text-sm font-mono text-[#9EA5A8]">
              STATUS: {pipelineOutput.status.toUpperCase()}
            </div>
          </div>

          {/* Event Timeline Trace */}
          <div className="space-y-4 font-mono text-sm">
            {pipelineOutput.events.map((ev, idx) => (
              <div
                key={ev.event_id || idx}
                className="bg-[#101317] border border-[#EDE7DC]/13 rounded p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[#E8913C] font-bold">[{idx + 1}]</span>
                    <span className="text-[#EDE7DC] uppercase tracking-wider font-bold">
                      {ev.type.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-[#6C7378] text-[12px]">
                    {ev.timestamp ? ev.timestamp.slice(11, 19) : ''}
                  </span>
                </div>
                <div className="text-[#9EA5A8] bg-[#0A0C0E] p-3 rounded border border-[#EDE7DC]/10 text-[12px] overflow-x-auto">
                  {JSON.stringify(ev.payload, null, 2)}
                </div>
              </div>
            ))}
          </div>

          {/* Retrieved Evidence Summary */}
          {pipelineOutput.retrieved_docs.length > 0 && (
            <div className="bg-[#101317] border border-[#EDE7DC]/13 rounded p-6 space-y-4">
              <div className="text-sm font-mono text-[#2E6B72] uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2E6B72]" />
                RAG EVIDENCE RETRIEVED ({pipelineOutput.retrieved_docs.length} DOCUMENTS)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pipelineOutput.retrieved_docs.map((doc) => (
                  <div key={doc.id} className="bg-[#0A0C0E] border border-[#EDE7DC]/10 p-4 rounded space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[12px] font-mono text-[#2E6B72] uppercase">{doc.id}</span>
                      <span className="text-[12px] font-mono text-[#E8913C]">SCORE: {doc.score.toFixed(3)}</span>
                    </div>
                    <div className="font-display text-sm text-[#EDE7DC] line-clamp-1">{doc.title}</div>
                    <div className="text-[12px] text-[#9EA5A8] line-clamp-2">{doc.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Controlled Action Output */}
          {pipelineOutput.action_result && (
            <div className="bg-[#101317] border border-[#E8913C]/40 rounded p-6 space-y-3">
              <div className="text-sm font-mono text-[#E8913C] uppercase tracking-widest flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#E8913C]" />
                CONTROLLED ACTION EXECUTION RESULT
              </div>
              <div className="bg-[#0A0C0E] p-4 rounded border border-[#EDE7DC]/10 font-mono text-sm space-y-2">
                <div className="text-[#EDE7DC]">ACTION: <span className="text-[#E8913C]">{pipelineOutput.action_result.action}</span></div>
                <div className="text-[#9EA5A8]">MESSAGE: {pipelineOutput.action_result.message}</div>
                <div className="text-[#6C7378]">ACTION ID: {pipelineOutput.action_result.action_id} | EXECUTION LATENCY: {pipelineOutput.action_result.execution_time_ms}ms</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
