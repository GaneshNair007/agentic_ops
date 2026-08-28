import React, { useState } from 'react';
import { Wrench, ShieldAlert, CheckCircle2, AlertTriangle, Cpu, Terminal } from 'lucide-react';
import { api } from '../services/api';
import { ActionDefinition, ActionResponse } from '../types';

const CONTROLLED_ACTIONS: ActionDefinition[] = [
  {
    type: 'restart_service',
    name: 'Restart Service',
    description: 'Restarts worker instances for degraded microservice',
    category: 'review_required',
    defaultParams: { service: 'payment-api' }
  },
  {
    type: 'rollback_deployment',
    name: 'Rollback Deployment',
    description: 'Reverts service deployment revision to previous known good state',
    category: 'high_impact',
    defaultParams: { deployment: 'payment-api', revision: 'v2.3.9' }
  },
  {
    type: 'restart_pod',
    name: 'Restart Pod',
    description: 'Restarts specific worker pod instance',
    category: 'review_required',
    defaultParams: { pod_name: 'payment-api-7b89d49-x9z' }
  },
  {
    type: 'restart_database',
    name: 'Restart Database Connection Pool',
    description: 'Recycles connection handles and restarts PgBouncer / PG pool',
    category: 'high_impact',
    defaultParams: { database: 'user-profile-pg-cluster' }
  },
  {
    type: 'scale_deployment',
    name: 'Scale Deployment',
    description: 'Scales target deployment replicas',
    category: 'review_required',
    defaultParams: { deployment: 'coredns', replicas: 8 }
  },
  {
    type: 'create_ticket',
    name: 'Create Incident Ticket',
    description: 'Drafts operational ticket for tracking',
    category: 'neutral',
    defaultParams: { title: 'P1 Incident - payment-api 504 Timeout', severity: 'P1' }
  },
  {
    type: 'notify_team',
    name: 'Notify On-Call SRE',
    description: 'Dispatches notification to on-call channel',
    category: 'neutral',
    defaultParams: { channel: '#sre-alerts', message: 'Remediation action initiated' }
  },
  {
    type: 'generate_postmortem',
    name: 'Draft Postmortem Report',
    description: 'Generates structured incident postmortem summary',
    category: 'neutral',
    defaultParams: { incident_id: 'INC-2026-005', title: 'Payment API Gateway Outage' }
  }
];

export const ActionControl: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<ActionDefinition>(CONTROLLED_ACTIONS[0]);
  const [paramsJson, setParamsJson] = useState(JSON.stringify(CONTROLLED_ACTIONS[0].defaultParams, null, 2));
  
  // High-Impact Modal State
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
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="border-b border-[#EDE7DC]/13 pb-6">
        <div className="text-[12px] font-mono text-[#E8913C] uppercase tracking-widest flex items-center gap-2">
          <Wrench className="w-4 h-4 text-[#E8913C]" />
          CONTROLLED INFRASTRUCTURE ACTIONS & SAFETY AUDIT
        </div>
        <h2 className="font-display text-2xl md:text-3xl text-[#EDE7DC] mt-1">
          ACTION CONTROL ENGINE
        </h2>
        <p className="text-sm text-[#9EA5A8] mt-2">
          Controlled simulation action — writes immutable record to audit log.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Action Selection List */}
        <div className="space-y-3">
          <div className="text-sm font-mono text-[#9EA5A8] uppercase tracking-widest">
            PREDEFINED ACTION CATALOGUE
          </div>
          {CONTROLLED_ACTIONS.map((act) => {
            const isSelected = selectedAction.type === act.type;
            let catBadge = 'text-[#2E6B72] border-[#2E6B72]/40';
            if (act.category === 'review_required') catBadge = 'text-[#E8913C] border-[#E8913C]/40';
            if (act.category === 'high_impact') catBadge = 'text-[#E63946] border-[#E63946]/40';

            return (
              <button
                key={act.type}
                onClick={() => handleSelectAction(act)}
                className={`w-full text-left p-4 rounded border transition-all ${
                  isSelected
                    ? 'bg-[#101317] border-[#E8913C]'
                    : 'bg-[#0A0C0E] border-[#EDE7DC]/13 hover:border-[#EDE7DC]/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display text-sm text-[#EDE7DC]">{act.name}</span>
                  <span className={`text-[9px] font-mono border px-1.5 py-0.5 rounded uppercase ${catBadge}`}>
                    {act.category.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-[12px] font-mono text-[#9EA5A8] line-clamp-1">{act.description}</div>
              </button>
            );
          })}
        </div>

        {/* Action Parameter Composer & Trigger */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#101317] border border-[#EDE7DC]/13 rounded p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#EDE7DC]/10 pb-4">
              <div>
                <div className="text-[12px] font-mono text-[#9EA5A8] uppercase">ACTION TYPE</div>
                <div className="font-display text-lg text-[#EDE7DC]">{selectedAction.name}</div>
              </div>
              <div className="text-sm font-mono text-[#E8913C] bg-[#0A0C0E] border border-[#EDE7DC]/10 px-3 py-1.5 rounded">
                {selectedAction.type}
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-mono text-[#9EA5A8] uppercase tracking-widest mb-2">
                ACTION PARAMETERS (JSON)
              </label>
              <textarea
                value={paramsJson}
                onChange={(e) => setParamsJson(e.target.value)}
                rows={6}
                className="w-full bg-[#0A0C0E] border border-[#EDE7DC]/13 rounded p-4 text-sm font-mono text-[#EDE7DC] focus:border-[#E8913C] outline-none"
              />
            </div>

            {error && (
              <div className="p-3 border border-[#E63946] bg-[#E63946]/10 text-[#E63946] rounded text-sm font-mono">
                [ERROR] {error}
              </div>
            )}

            <button
              onClick={handleTriggerAction}
              disabled={isLoading}
              className={`w-full btn-sre-outline py-3 text-sm flex items-center justify-center gap-2 ${
                selectedAction.category === 'high_impact'
                  ? 'btn-sre-danger'
                  : selectedAction.category === 'review_required'
                  ? 'btn-sre-amber'
                  : 'btn-sre-teal'
              }`}
            >
              {isLoading ? <Cpu className="w-4 h-4 animate-spin" /> : <Wrench className="w-4 h-4" />}
              EXECUTE CONTROLLED ACTION
            </button>
          </div>

          {/* Execution Output Result */}
          {lastResponse && (
            <div className="bg-[#101317] border border-[#2E6B72] rounded p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#EDE7DC]/10 pb-3">
                <div className="text-sm font-mono text-[#2E6B72] uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E6B72]" />
                  ACTION EXECUTION AUDITED
                </div>
                <div className="text-sm font-mono text-[#9EA5A8]">
                  STATUS: {lastResponse.status.toUpperCase()}
                </div>
              </div>

              <div className="bg-[#0A0C0E] p-4 rounded border border-[#EDE7DC]/10 font-mono text-sm space-y-2">
                <div><span className="text-[#6C7378]">ACTION ID:</span> <span className="text-[#EDE7DC]">{lastResponse.action_id}</span></div>
                <div><span className="text-[#6C7378]">MESSAGE:</span> <span className="text-[#E8913C]">{lastResponse.message}</span></div>
                <div><span className="text-[#6C7378]">LATENCY:</span> <span className="text-[#EDE7DC]">{lastResponse.execution_time_ms} ms</span></div>
                <div><span className="text-[#6C7378]">TIMESTAMP:</span> <span className="text-[#9EA5A8]">{lastResponse.timestamp}</span></div>
                <div><span className="text-[#6C7378]">PARAMETERS:</span> <span className="text-[#9EA5A8]">{JSON.stringify(lastResponse.params)}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* High Impact Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#101317] border border-[#E63946] rounded max-w-lg w-full p-6 space-y-6">
            <div className="flex items-center gap-3 text-[#E63946] border-b border-[#EDE7DC]/13 pb-4">
              <ShieldAlert className="w-6 h-6 text-[#E63946]" />
              <div>
                <div className="text-[12px] font-mono uppercase tracking-widest">HIGH-IMPACT ACTION CONFIRMATION</div>
                <div className="font-display text-lg text-[#EDE7DC]">{selectedAction.name}</div>
              </div>
            </div>

            <div className="space-y-3 font-mono text-sm">
              <div className="text-[#9EA5A8]">
                Targeting high-impact remediation endpoint. Please review action parameters before proceeding:
              </div>
              <pre className="bg-[#0A0C0E] p-3 rounded border border-[#EDE7DC]/10 text-[#E8913C]">
                {paramsJson}
              </pre>
            </div>

            <label className="flex items-center gap-3 bg-[#0A0C0E] p-4 rounded border border-[#EDE7DC]/13 cursor-pointer">
              <input
                type="checkbox"
                checked={hasConfirmed}
                onChange={(e) => setHasConfirmed(e.target.checked)}
                className="accent-[#E63946] w-4 h-4"
              />
              <span className="text-sm font-mono text-[#EDE7DC]">
                I understand this is a simulated, predefined remediation action.
              </span>
            </label>

            <div className="flex gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 btn-sre-outline"
              >
                CANCEL
              </button>
              <button
                onClick={executeActionNow}
                disabled={!hasConfirmed || isLoading}
                className="flex-1 btn-sre-outline btn-sre-danger"
              >
                CONFIRM & EXECUTE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
