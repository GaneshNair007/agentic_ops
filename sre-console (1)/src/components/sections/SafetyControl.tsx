import React, { useState } from 'react';
import { Shield, Wrench, CheckCircle2, ShieldAlert } from 'lucide-react';
import { api } from '../../services/api';
import { ActionDefinition, ActionResponse } from '../../types';

const CONTROLLED_ACTIONS: ActionDefinition[] = [
  {
    type: 'restart_service',
    name: 'restart_service',
    description: 'Restarts worker instances for degraded microservice',
    category: 'review_required',
    defaultParams: { service: 'payment-api' }
  },
  {
    type: 'rollback_deployment',
    name: 'rollback_deployment',
    description: 'Reverts service deployment revision to previous known good state',
    category: 'high_impact',
    defaultParams: { deployment: 'payment-api', revision: 'v2.3.9' }
  },
  {
    type: 'restart_pod',
    name: 'restart_pod',
    description: 'Restarts specific worker pod instance',
    category: 'review_required',
    defaultParams: { pod_name: 'payment-api-7b89d49-x9z' }
  },
  {
    type: 'restart_database',
    name: 'restart_database',
    description: 'Recycles connection handles and restarts PgBouncer / PG pool',
    category: 'high_impact',
    defaultParams: { database: 'user-profile-pg-cluster' }
  },
  {
    type: 'scale_deployment',
    name: 'scale_deployment',
    description: 'Scales target deployment replicas',
    category: 'review_required',
    defaultParams: { deployment: 'coredns', replicas: 8 }
  },
  {
    type: 'create_ticket',
    name: 'create_ticket',
    description: 'Drafts operational ticket for tracking',
    category: 'neutral',
    defaultParams: { title: 'P1 Incident - payment-api 504 Timeout', severity: 'P1' }
  },
  {
    type: 'notify_team',
    name: 'notify_team',
    description: 'Dispatches notification to on-call channel',
    category: 'neutral',
    defaultParams: { channel: '#sre-alerts', message: 'Remediation action initiated' }
  },
  {
    type: 'generate_postmortem',
    name: 'generate_postmortem',
    description: 'Generates structured incident postmortem summary',
    category: 'neutral',
    defaultParams: { incident_id: 'INC-2026-005', title: 'Payment API Gateway Outage' }
  }
];

export const SafetyControl: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<ActionDefinition>(CONTROLLED_ACTIONS[0]);
  const [paramsJson, setParamsJson] = useState(JSON.stringify(CONTROLLED_ACTIONS[0].defaultParams, null, 2));
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<ActionResponse | null>(null);

  const handleSelectAction = (act: ActionDefinition) => {
    setSelectedAction(act);
    setParamsJson(JSON.stringify(act.defaultParams, null, 2));
    setError(null);
    setHasConfirmed(false);
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

  const handleTriggerAction = () => {
    if (selectedAction.category === 'high_impact') {
      setIsModalOpen(true);
    } else {
      executeActionNow();
    }
  };

  return (
    <section id="safety" className="w-full min-h-screen bg-[#F3F1EC] text-[#090909] py-24 px-6 md:px-12 border-b border-[#D8D6D0]">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Full-Width Monochrome Control Room Hero Photograph */}
        <div className="relative aspect-[21/9] bg-[#090909] border border-[#D8D6D0] overflow-hidden flex items-center p-8 md:p-16">
          <img
            src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=2000&q=90"
            alt="Monochrome Engineer Terminal Control Room"
            className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-30"
          />
          <div className="relative z-10 max-w-3xl space-y-4 text-[#F3F1EC]">
            <div className="label-caps text-[#686868]">// SAFETY BOUNDS & GOVERNANCE</div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold leading-tight">
              THE MODEL DOES NOT GET UNRESTRICTED CONTROL.
            </h2>
            <p className="font-sans text-sm md:text-base text-[#D8D6D0] prose-editorial">
              Recommendations are mapped to a predefined set of simulated actions. Every action produces a structured result and an audit record.
            </p>
          </div>
        </div>

        {/* Ruled Typographic Actions List & Parameter Executor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Action List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="label-caps text-[#686868] mb-2">// PREDEFINED ACTION CATALOGUE</div>
            {CONTROLLED_ACTIONS.map((act) => {
              const isSelected = selectedAction.type === act.type;
              return (
                <div
                  key={act.type}
                  onClick={() => handleSelectAction(act)}
                  className={`p-4 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#090909] text-[#F3F1EC] border-[#090909]'
                      : 'bg-[#FFFFFF] text-[#090909] border-[#D8D6D0] hover:border-[#090909]'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs mb-1">
                    <span className="font-bold">{act.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 border uppercase ${
                      isSelected ? 'border-[#F3F1EC]/30 text-[#F3F1EC]' : 'border-[#D8D6D0] text-[#686868]'
                    }`}>
                      {act.category.replace('_', ' ')}
                    </span>
                  </div>
                  <div className={`text-[11px] font-sans line-clamp-1 ${isSelected ? 'text-[#D8D6D0]' : 'text-[#686868]'}`}>
                    {act.description}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Parameter Editor & Result */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#FFFFFF] border border-[#D8D6D0] p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#D8D6D0] pb-4">
                <div>
                  <div className="label-caps text-[#686868]">SELECTED ACTION</div>
                  <div className="font-display text-xl text-[#090909]">{selectedAction.name}</div>
                </div>
                <div className="font-mono text-xs border border-[#090909] px-3 py-1 uppercase">
                  {selectedAction.category}
                </div>
              </div>

              <div>
                <label className="block label-caps text-[#686868] mb-2">ACTION PARAMETERS (JSON)</label>
                <textarea
                  value={paramsJson}
                  onChange={(e) => setParamsJson(e.target.value)}
                  rows={5}
                  className="w-full bg-[#F3F1EC] border border-[#D8D6D0] p-4 font-mono text-xs text-[#090909] focus:border-[#090909] outline-none"
                />
              </div>

              {error && (
                <div className="p-3 border border-[#090909] bg-[#090909] text-[#F3F1EC] font-mono text-xs">
                  [ERROR] {error}
                </div>
              )}

              <button
                onClick={handleTriggerAction}
                disabled={isLoading}
                className="w-full btn-sre-mono py-4"
              >
                EXECUTE CONTROLLED ACTION
              </button>
            </div>

            {/* Execution Result Panel */}
            {lastResponse && (
              <div className="bg-[#090909] text-[#F3F1EC] border border-[#090909] p-6 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-[#F3F1EC]/20 pb-3">
                  <span className="font-bold uppercase text-[#F3F1EC]">// AUDITED ACTION RESPONSE</span>
                  <span>STATUS: {lastResponse.status.toUpperCase()}</span>
                </div>
                <div className="space-y-1 text-[#D8D6D0]">
                  <div>ACTION ID: {lastResponse.action_id}</div>
                  <div>MESSAGE: {lastResponse.message}</div>
                  <div>EXECUTION LATENCY: {lastResponse.execution_time_ms} ms</div>
                  <div>TIMESTAMP: {lastResponse.timestamp}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* High-Impact Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#090909]/90 z-50 flex items-center justify-center p-4">
          <div className="bg-[#090909] text-[#F3F1EC] border border-[#F3F1EC] max-w-lg w-full p-8 space-y-6">
            <div className="space-y-2 border-b border-[#F3F1EC]/20 pb-4">
              <div className="label-caps text-[#686868]">// HIGH-IMPACT SAFETY CONFIRMATION</div>
              <h3 className="font-display text-2xl text-[#F3F1EC]">{selectedAction.name}</h3>
            </div>

            <div className="font-mono text-xs space-y-2 text-[#D8D6D0]">
              <div>Targeting high-impact remediation endpoint. Please review action parameters:</div>
              <pre className="bg-[#141414] p-4 border border-[#F3F1EC]/20 text-[11px]">{paramsJson}</pre>
            </div>

            <label className="flex items-center gap-3 bg-[#141414] p-4 border border-[#F3F1EC]/20 cursor-pointer">
              <input
                type="checkbox"
                checked={hasConfirmed}
                onChange={(e) => setHasConfirmed(e.target.checked)}
                className="accent-[#F3F1EC] w-4 h-4"
              />
              <span className="font-mono text-xs text-[#F3F1EC]">
                I understand this is a simulated, predefined remediation action.
              </span>
            </label>

            <div className="flex gap-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 btn-sre-dark-outline">
                CANCEL
              </button>
              <button
                onClick={executeActionNow}
                disabled={!hasConfirmed || isLoading}
                className="flex-1 btn-sre-dark-outline bg-[#F3F1EC] text-[#090909] hover:bg-transparent hover:text-[#F3F1EC]"
              >
                CONFIRM ACTION
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
