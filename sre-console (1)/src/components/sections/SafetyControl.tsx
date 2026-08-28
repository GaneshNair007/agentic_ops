import React, { useState } from 'react';
import { api } from '../../services/api';
import { ActionDefinition, ActionResponse } from '../../types';

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
    <section id="safety" className="w-full bg-[#050505] text-[#F1F1F1] py-24 border-t border-[#333]">
      <div className="w-full px-6 md:px-12 lg:px-24 space-y-16">
        
        {/* Header */}
        <div className="border-b border-[#333] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="label-caps text-[#E8913C] mb-3">// SAFETY BOUNDS & CONTROLLED ACTIONS</div>
            <h2 className="font-display text-5xl md:text-7xl font-black text-[#FFFFFF] leading-[0.9]">
              STRICT SYSTEM<br />BOUNDARIES
            </h2>
          </div>
          <div className="font-mono text-sm text-[#8E8E8E] bg-[#111] border border-[#333] px-4 py-3">
            ACTION_ENGINE // STRICT_MODE = TRUE
          </div>
        </div>

        {/* Matrix Ruleset */}
        <div className="w-full overflow-x-auto border border-[#333]">
          <table className="w-full text-left font-mono text-sm border-collapse">
            <thead>
              <tr className="bg-[#111] text-[#8E8E8E] border-b border-[#333]">
                <th className="p-4 font-normal tracking-widest uppercase">Action Protocol</th>
                <th className="p-4 font-normal tracking-widest uppercase hidden md:table-cell">Category</th>
                <th className="p-4 font-normal tracking-widest uppercase hidden lg:table-cell">Description</th>
                <th className="p-4 font-normal tracking-widest uppercase">Parameter Boundaries</th>
              </tr>
            </thead>
            <tbody>
              {CONTROLLED_ACTIONS.map((act) => (
                <tr 
                  key={act.type} 
                  onClick={() => handleSelectAction(act)}
                  className={`border-b border-[#333] transition-colors cursor-pointer ${selectedAction.type === act.type ? 'bg-[#1A110A]' : 'hover:bg-[#111]'}`}
                >
                  <td className="p-4 border-r border-[#333]">
                    <span className={`font-bold ${selectedAction.type === act.type ? 'text-[#E8913C]' : 'text-[#FFFFFF]'}`}>
                      {act.name}
                    </span>
                  </td>
                  <td className="p-4 border-r border-[#333] hidden md:table-cell">
                    <span className={`px-2 py-1 uppercase text-[10px] ${
                      act.category === 'high_impact' ? 'bg-[#FF3333]/20 text-[#FF3333] border border-[#FF3333]/50' : 
                      act.category === 'review_required' ? 'bg-[#E8913C]/20 text-[#E8913C] border border-[#E8913C]/50' : 
                      'bg-[#333] text-[#8E8E8E]'
                    }`}>
                      {act.category}
                    </span>
                  </td>
                  <td className="p-4 border-r border-[#333] text-[#8E8E8E] hidden lg:table-cell max-w-xs truncate">
                    {act.description}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {act.boundaries.map((bound, i) => (
                        <code key={i} className="text-[#00FF00] bg-[#001100] px-2 py-1 border border-[#003300] whitespace-nowrap text-xs">
                          {bound}
                        </code>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Execution Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#0A0A0A] border border-[#333] p-8 flex flex-col">
            <div className="flex justify-between items-center border-b border-[#333] pb-4 font-mono text-sm text-[#8E8E8E] mb-6">
              <div>TARGET PROTOCOL: <span className="text-[#FFFFFF]">{selectedAction.name}</span></div>
            </div>
            
            <label htmlFor="action-params-textarea" className="block font-mono text-xs text-[#E8913C] mb-2 uppercase tracking-widest">
              Inject Action Parameters (JSON)
            </label>
            <textarea
              id="action-params-textarea"
              value={paramsJson}
              onChange={(e) => setParamsJson(e.target.value)}
              rows={5}
              className="w-full bg-[#111] border border-[#333] p-4 font-mono text-base text-[#F1F1F1] focus:border-[#E8913C] outline-none mb-6 resize-none"
            />
            
            <button onClick={executeActionNow} disabled={isLoading} className="mt-auto bg-[#E8913C] hover:bg-[#F1F1F1] text-[#050505] font-mono font-bold uppercase tracking-widest py-4 px-8 transition-colors">
              EXECUTE REQUEST
            </button>
            {error && (
              <div className="mt-4 p-4 border border-[#FF3333] bg-[#220000] text-[#FF3333] font-mono text-sm">
                [EXECUTION DENIED] {error}
              </div>
            )}
          </div>

          <div className="bg-[#0A0A0A] border border-[#333] p-8 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8913C] opacity-5 blur-[100px]" />
            <div className="font-mono text-sm text-[#8E8E8E] border-b border-[#333] pb-4 mb-6 uppercase tracking-widest">
              Audit Stream Output
            </div>
            
            {lastResponse ? (
              <div className="space-y-4 font-mono text-sm z-10">
                <div className="text-[#00FF00]">✓ Action successfully executed and logged.</div>
                <table className="w-full text-left">
                  <tbody>
                    <tr><td className="text-[#8E8E8E] py-1">ACTION_ID:</td><td className="text-[#F1F1F1]">{lastResponse.action_id}</td></tr>
                    <tr><td className="text-[#8E8E8E] py-1">MESSAGE:</td><td className="text-[#F1F1F1]">{lastResponse.message}</td></tr>
                    <tr><td className="text-[#8E8E8E] py-1">LATENCY:</td><td className="text-[#E8913C]">{lastResponse.execution_time_ms}ms</td></tr>
                    <tr><td className="text-[#8E8E8E] py-1">TIMESTAMP:</td><td className="text-[#F1F1F1]">{lastResponse.timestamp}</td></tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[#4A4A4A] font-mono text-sm animate-pulse z-10">
                WAITING FOR EXECUTION...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Safety Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#050505]/95 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] text-[#F1F1F1] border-2 border-[#FF3333] max-w-2xl w-full p-10 space-y-8 font-mono shadow-[0_0_50px_rgba(255,51,51,0.2)]">
            <div className="border-b border-[#FF3333]/30 pb-4">
              <h3 className="text-2xl font-bold text-[#FF3333] mb-2 uppercase tracking-widest">High-Impact Action Guard</h3>
              <p className="text-[#8E8E8E] text-sm">Protocol <span className="text-[#F1F1F1]">{selectedAction.name}</span> requires explicit clearance.</p>
            </div>
            
            <pre className="bg-[#111] p-6 border border-[#333] text-sm text-[#00FF00] overflow-auto">
              {paramsJson}
            </pre>
            
            <label className="flex items-start gap-4 p-4 border border-[#333] bg-[#111] cursor-pointer hover:border-[#8E8E8E] transition-colors">
              <input
                type="checkbox"
                checked={hasConfirmed}
                onChange={(e) => setHasConfirmed(e.target.checked)}
                className="mt-1 accent-[#FF3333] w-5 h-5"
              />
              <span className="text-[#C8C8C8] text-sm leading-relaxed">
                I confirm that this action conforms to the strict boundary rules defined in the matrix. I understand this action will be appended to the immutable audit log.
              </span>
            </label>
            
            <div className="flex gap-4 pt-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 border border-[#333] hover:bg-[#333] py-4 uppercase tracking-widest font-bold transition-colors">
                ABORT
              </button>
              <button
                onClick={executeActionNow}
                disabled={!hasConfirmed || isLoading}
                className="flex-1 bg-[#FF3333] text-white hover:bg-[#CC0000] disabled:opacity-50 disabled:cursor-not-allowed py-4 uppercase tracking-widest font-bold transition-colors"
              >
                AUTHORIZE PROTOCOL
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
