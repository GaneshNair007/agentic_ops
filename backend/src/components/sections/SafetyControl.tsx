import React, { useState } from 'react';
import { api } from '../../services/api';
import { ActionDefinition, ActionResponse } from '../../types';
import { Shield, ShieldAlert, CheckCircle2, Terminal, AlertCircle, Play, Check, Cpu, Clock, BookOpen, Layers } from 'lucide-react';

const CONTROLLED_ACTIONS: (ActionDefinition & { boundaries: string[] })[] = [
  {
    type: 'restart_service',
    name: 'restart_service',
    description: 'Restarts worker instances for degraded microservice',
    category: 'review_required',
    defaultParams: { service: 'payment-api' },
    boundaries: ['target IN allowed_services', 'rate_limit <= 1/hr']
  },
  {
    type: 'rollback_deployment',
    name: 'rollback_deployment',
    description: 'Reverts service deployment revision',
    category: 'high_impact',
    defaultParams: { deployment: 'payment-api', revision: 'v2.3.9' },
    boundaries: ['target IN safe_rollbacks', 'require_quorum == true']
  },
  {
    type: 'restart_pod',
    name: 'restart_pod',
    description: 'Restarts specific worker pod instance',
    category: 'review_required',
    defaultParams: { pod_name: 'payment-api-7b89d49-x9z' },
    boundaries: ['pod.namespace == "production"', 'active_replicas > 1']
  },
  {
    type: 'restart_database',
    name: 'restart_database',
    description: 'Recycles connection handles',
    category: 'high_impact',
    defaultParams: { database: 'user-profile-pg-cluster' },
    boundaries: ['db.type == "replica"', 'maint_window == active']
  },
  {
    type: 'scale_deployment',
    name: 'scale_deployment',
    description: 'Scales target deployment replicas',
    category: 'review_required',
    defaultParams: { deployment: 'coredns', replicas: 8 },
    boundaries: ['replicas <= 10', 'replicas > current_scale']
  },
  {
    type: 'create_ticket',
    name: 'create_ticket',
    description: 'Drafts operational ticket for tracking',
    category: 'neutral',
    defaultParams: { title: 'P1 Incident - payment-api 504 Timeout', severity: 'P1' },
    boundaries: ['severity IN ["P1","P2","P3"]']
  },
  {
    type: 'notify_team',
    name: 'notify_team',
    description: 'Dispatches notification to on-call channel',
    category: 'neutral',
    defaultParams: { channel: '#sre-alerts', message: 'Remediation action initiated' },
    boundaries: ['channel.is_verified == true']
  },
  {
    type: 'generate_postmortem',
    name: 'generate_postmortem',
    description: 'Generates structured incident postmortem',
    category: 'neutral',
    defaultParams: { incident_id: 'INC-2026-005', title: 'Payment API Gateway Outage' },
    boundaries: ['incident.status == "resolved"']
  }
];

const KEY_FIGURES = [
  {
    value: '08',
    label: 'CONTROLLED ACTIONS',
    detail: 'Deterministic protocol boundaries for microservices & clusters.',
    icon: Layers
  },
  {
    value: '99.99%',
    label: 'TARGET SLA',
    detail: 'Strict execution guards preventing unverified mutations.',
    icon: Shield
  },
  {
    value: '< 1.8s',
    label: 'MEAN REMEDIATION',
    detail: 'Automated diagnostic triage and remediation dispatch.',
    icon: Clock
  },
  {
    value: '35',
    label: 'VERIFIED RUNBOOKS',
    detail: 'Dense ChromaDB vector index with cosine similarity match.',
    icon: BookOpen
  }
];

const safeFormat = (val: any): string => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') {
    try {
      return JSON.stringify(val, null, 2);
    } catch {
      return '[Unserializable Object]';
    }
  }
  return String(val);
};

export const SafetyControl: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<(typeof CONTROLLED_ACTIONS)[0]>(CONTROLLED_ACTIONS[0]);
  const [paramsJson, setParamsJson] = useState(JSON.stringify(CONTROLLED_ACTIONS[0].defaultParams, null, 2));
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<ActionResponse | null>(null);

  const handleSelectAction = (act: typeof CONTROLLED_ACTIONS[0]) => {
    setSelectedAction(act);
    setParamsJson(JSON.stringify(act.defaultParams, null, 2));
    setError(null);
    setHasConfirmed(false);
    if (act.category === 'high_impact') {
      setIsModalOpen(true);
    }
  };

  const executeActionNow = async () => {
    let parsedParams = {};
    try {
      parsedParams = JSON.parse(paramsJson);
    } catch (e) {
      setError('Invalid JSON in parameters field');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await api.executeAction(selectedAction.type, parsedParams);
      setLastResponse(res);
      setIsModalOpen(false);
      setHasConfirmed(false);
    } catch (err: any) {
      setError(err.message || 'Action execution failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section 
      id="safety" 
      className="w-full bg-[#000000] text-[#FFFFFF] py-24 md:py-32 border-b border-[#E5E5E5]"
    >
      <div className="container-full space-y-20">
        
        {/* Section Header */}
        <div className="border-b border-[#262626] pb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-[#A3A3A3] bg-[#0A0A0A] border border-[#262626] px-3 py-1 inline-flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#FFFFFF]" />
                // PALOMINO SECTION 03: KEY FIGURES & SAFETY MATRIX
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[80px] xl:text-[100px] font-black text-[#FFFFFF] tracking-tighter leading-[0.88] uppercase break-normal">
              KEY FIGURES <span className="text-[#A3A3A3]">&amp;</span> <br className="hidden md:block" /> SAFETY CONTROL.
            </h2>
          </div>

          <div className="font-mono text-xs text-[#A3A3A3] bg-[#0A0A0A] border border-[#262626] p-4 flex flex-col gap-1.5 max-w-sm shrink-0">
            <div className="text-[#FFFFFF] font-bold">ACTION_ENGINE // STRICT_MODE = TRUE</div>
            <div className="text-[11px] text-[#737373]">GUARANTEE: ZERO ARBITRARY SHELL INVOCATION</div>
            <div className="text-[11px] text-[#737373]">AUDIT_LOGGER: IMMUTABLE DISK-BACKED STREAM</div>
          </div>
        </div>

        {/* Palomino Key Figures Metric Grid (1px Structural Borders) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 border-t border-l border-[#262626]">
          {KEY_FIGURES.map((fig, idx) => {
            const Icon = fig.icon;
            return (
              <div 
                key={idx} 
                className="p-6 md:p-8 xl:p-10 border-r border-b border-[#262626] bg-[#050505] hover:bg-[#0A0A0A] transition-colors flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-[11px] text-[#555555] tracking-widest uppercase">
                    [METRIC 0{idx + 1}]
                  </span>
                  <Icon className="w-5 h-5 text-[#737373] group-hover:text-[#FFFFFF] transition-colors" />
                </div>

                <div className="space-y-3">
                  <div className="font-display text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tighter text-[#FFFFFF] whitespace-nowrap">
                    {fig.value}
                  </div>
                  <div className="font-mono text-xs font-bold text-[#FFFFFF] tracking-widest uppercase">
                    {fig.label}
                  </div>
                  <p className="font-sans text-xs text-[#888888] leading-relaxed">
                    {fig.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Matrix Ruleset (1px Structural Table) */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#A3A3A3]">
              // 8-ACTION DETERMINISTIC PROTOCOL MATRIX
            </h3>
            <span className="font-mono text-[11px] text-[#737373] uppercase tracking-wider">
              CLICK ANY ROW TO LOAD PARAMETERS &amp; TEST EXECUTION
            </span>
          </div>

          <div className="w-full overflow-x-auto border border-[#262626] bg-[#050505]">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-[#0A0A0A] text-[#888888] border-b border-[#262626]">
                  <th className="p-4 font-bold tracking-widest uppercase w-56">Action Protocol</th>
                  <th className="p-4 font-bold tracking-widest uppercase w-40 hidden md:table-cell">Category</th>
                  <th className="p-4 font-bold tracking-widest uppercase hidden lg:table-cell">Description</th>
                  <th className="p-4 font-bold tracking-widest uppercase">Parameter Boundaries</th>
                </tr>
              </thead>
              <tbody>
                {CONTROLLED_ACTIONS.map((act) => {
                  const isSelected = selectedAction.type === act.type;
                  return (
                    <tr 
                      key={act.type} 
                      onClick={() => handleSelectAction(act)}
                      className={`border-b border-[#262626] transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#141414]' : 'hover:bg-[#0D0D0D]'
                      }`}
                    >
                      <td className="p-4 border-r border-[#262626]">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 ${isSelected ? 'bg-[#FFFFFF]' : 'bg-transparent'}`} />
                          <span className={`font-bold tracking-wider ${isSelected ? 'text-[#FFFFFF]' : 'text-[#D4D4D4]'}`}>
                            {act.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 border-r border-[#262626] hidden md:table-cell">
                        <span className={`px-2.5 py-1 uppercase text-[10px] font-bold tracking-widest inline-block border ${
                          act.category === 'high_impact' 
                            ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]' 
                            : act.category === 'review_required' 
                            ? 'bg-[#000000] text-[#FFFFFF] border-[#737373]' 
                            : 'bg-[#000000] text-[#888888] border-[#333333]'
                        }`}>
                          {act.category === 'high_impact' ? '[HIGH IMPACT]' : act.category === 'review_required' ? '[REVIEW REQUIRED]' : '[AUTOMATED]'}
                        </span>
                      </td>
                      <td className="p-4 border-r border-[#262626] text-[#A3A3A3] hidden lg:table-cell max-w-sm">
                        {act.description}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5">
                          {act.boundaries.map((bound, i) => (
                            <code 
                              key={i} 
                              className="text-[#FFFFFF] bg-[#0A0A0A] px-2 py-1 border border-[#262626] text-[11px] font-mono tracking-tight"
                            >
                              {bound}
                            </code>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Parameter Injection & Audit Stream Console */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          
          {/* Left Column: Parameter Editor */}
          <div className="bg-[#050505] border border-[#262626] p-6 md:p-8 flex flex-col space-y-6">
            <div className="flex justify-between items-center border-b border-[#262626] pb-4 font-mono text-xs">
              <span className="text-[#888888] uppercase tracking-widest">
                TARGET PROTOCOL: <strong className="text-[#FFFFFF]">{selectedAction.name}</strong>
              </span>
              <span className="text-[#555555] uppercase">
                [{selectedAction.category}]
              </span>
            </div>
            
            <div>
              <label 
                htmlFor="action-params-textarea" 
                className="block font-mono text-xs text-[#A3A3A3] mb-2 uppercase tracking-widest font-bold"
              >
                Inject Action Parameters (JSON)
              </label>
              <textarea
                id="action-params-textarea"
                value={paramsJson}
                onChange={(e) => setParamsJson(e.target.value)}
                rows={6}
                className="w-full bg-[#000000] border border-[#262626] p-4 font-mono text-xs text-[#FFFFFF] focus:border-[#FFFFFF] outline-none resize-none tracking-wider"
              />
            </div>
            
            <button 
              onClick={executeActionNow} 
              disabled={isLoading} 
              className="btn-sre-mono py-4 px-8 w-full mt-auto font-mono text-xs font-bold tracking-[0.2em]"
            >
              {isLoading ? 'EXECUTING PROTOCOL...' : 'EXECUTE REQUEST'}
            </button>

            {error && (
              <div className="p-4 border border-[#FFFFFF] bg-[#0A0A0A] text-[#FFFFFF] font-mono text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#FFFFFF]" />
                <span>[EXECUTION DENIED] {error}</span>
              </div>
            )}
          </div>

          {/* Right Column: Real-time Audit Stream Output */}
          <div className="bg-[#050505] border border-[#262626] p-6 md:p-8 flex flex-col space-y-6">
            <div className="flex justify-between items-center border-b border-[#262626] pb-4 font-mono text-xs text-[#888888] uppercase tracking-widest font-bold">
              <span>Audit Stream Output</span>
              <span className="text-[#555555]">DISK_SINK // TOOLS/AUDIT.LOG</span>
            </div>
            
            {lastResponse ? (
              <div className="space-y-4 font-mono text-xs bg-[#000000] border border-[#262626] p-6">
                <div className="flex items-center gap-2 text-[#FFFFFF] font-bold pb-2 border-b border-[#262626]">
                  <CheckCircle2 className="w-4 h-4 text-[#FFFFFF]" />
                  <span>ACTION EXECUTED &amp; COMMITTED TO IMMUTABLE AUDIT LOG</span>
                </div>
                
                <table className="w-full text-left">
                  <tbody className="divide-y divide-[#1A1A1A]">
                    <tr>
                      <td className="text-[#737373] py-2.5 w-32 uppercase tracking-wider">ACTION_ID:</td>
                      <td className="text-[#FFFFFF] font-bold py-2.5">{safeFormat(lastResponse.action_id)}</td>
                    </tr>
                    <tr>
                      <td className="text-[#737373] py-2.5 uppercase tracking-wider">MESSAGE:</td>
                      <td className="text-[#D4D4D4] py-2.5">{safeFormat(lastResponse.message)}</td>
                    </tr>
                    <tr>
                      <td className="text-[#737373] py-2.5 uppercase tracking-wider">LATENCY:</td>
                      <td className="text-[#FFFFFF] font-bold py-2.5">{safeFormat(lastResponse.execution_time_ms)}ms</td>
                    </tr>
                    <tr>
                      <td className="text-[#737373] py-2.5 uppercase tracking-wider">TIMESTAMP:</td>
                      <td className="text-[#A3A3A3] py-2.5">{safeFormat(lastResponse.timestamp)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-[#555555] font-mono text-xs space-y-2 py-12">
                <Terminal className="w-6 h-6 text-[#333333]" />
                <span className="tracking-widest">WAITING FOR ACTION EXECUTION...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Strict Monochrome High-Impact Action Guard Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#050505] text-[#FFFFFF] border-2 border-[#FFFFFF] max-w-2xl w-full p-8 md:p-10 space-y-8 font-mono shadow-[0_0_50px_rgba(255,255,255,0.1)]">
            <div className="border-b border-[#262626] pb-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#FFFFFF] font-bold text-xs uppercase tracking-widest mb-1">
                  <ShieldAlert className="w-4 h-4 text-[#FFFFFF]" />
                  <span>SAFETY GUARD // LEVEL 3 CLEARANCE</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-[#FFFFFF] uppercase tracking-tight font-display">
                  High-Impact Action Guard
                </h3>
              </div>
              <span className="border border-[#FFFFFF] px-2 py-0.5 text-xs text-[#FFFFFF]">
                [CRITICAL]
              </span>
            </div>

            <p className="text-[#A3A3A3] text-xs leading-relaxed">
              Protocol <strong className="text-[#FFFFFF]">{selectedAction.name}</strong> will execute state mutation across cluster boundaries. Verify injected parameters:
            </p>
            
            <pre className="bg-[#000000] p-4 border border-[#262626] text-xs text-[#FFFFFF] overflow-auto max-h-48">
              {paramsJson}
            </pre>
            
            <label className="flex items-start gap-4 p-4 border border-[#262626] bg-[#0A0A0A] cursor-pointer hover:border-[#FFFFFF] transition-colors">
              <input
                type="checkbox"
                checked={hasConfirmed}
                onChange={(e) => setHasConfirmed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#FFFFFF] bg-[#000000] border-[#555555]"
              />
              <span className="text-[#D4D4D4] text-xs leading-relaxed font-sans">
                I confirm that this action conforms to the strict boundary rules defined in the matrix. I understand this action will be appended to the immutable audit log.
              </span>
            </label>
            
            <div className="flex gap-4 pt-2">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="flex-1 border border-[#333333] hover:border-[#FFFFFF] hover:bg-[#141414] py-4 uppercase tracking-widest text-xs font-bold transition-colors"
              >
                ABORT
              </button>
              <button
                onClick={executeActionNow}
                disabled={!hasConfirmed || isLoading}
                className="flex-1 btn-sre-mono py-4 text-xs font-bold uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isLoading ? 'AUTHORIZING...' : 'AUTHORIZE PROTOCOL'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

