import React, { useState } from 'react';
import { Shield, Wrench, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
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
  
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

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
    <section id="safety" className="w-full bg-[#F3F1EC] text-[#050505] py-24 px-6 md:px-12 border-b border-[#D8D6D0]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-[#D8D6D0] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="label-caps text-[#686868]">// SAFETY BOUNDS & CONTROLLED ACTIONS</div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-[#050505] mt-2">
              THE MODEL DOES NOT GET UNRESTRICTED CONTROL.
            </h2>
          </div>
          <div className="text-xs font-mono text-[#686868]">
            8 PREDEFINED REMEDIATION TOOLS // AUDIT LOGGED
          </div>
        </div>

        {/* Full-Width Ruled Action Rows with Hover Reveal */}
        <div 
          className="border-t border-[#D8D6D0] divide-y divide-[#D8D6D0]"
          onMouseMove={(e) => setCursorPos({ x: e.clientX, y: e.clientY })}
          onMouseLeave={() => setHoveredAction(null)}
        >
          {CONTROLLED_ACTIONS.map((act, idx) => {
            const isSelected = selectedAction.type === act.type;
            return (
              <div
                key={act.type}
                onMouseEnter={() => setHoveredAction(act.type)}
                onClick={() => handleSelectAction(act)}
                className="py-6 px-4 flex justify-between items-center cursor-pointer group hover:bg-[#050505] hover:text-[#FFFFFF] transition-colors duration-200"
              >
                <div className="flex items-center gap-6">
                  <span className="font-mono text-xs text-[#686868] group-hover:text-[#C7C7C7] transition-transform duration-200 group-hover:-translate-x-2">
                    0{idx + 1}
                  </span>
                  <span className="font-display text-xl md:text-2xl font-bold group-hover:translate-x-4 transition-transform duration-200">
                    {act.name}
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <span className="font-mono text-xs text-[#686868] group-hover:text-[#C7C7C7] uppercase hidden md:inline-block">
                    {act.description}
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-200" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Cursor Image Reveal */}
        {hoveredAction && (
          <div
            className="fixed pointer-events-none z-50 w-56 h-36 border border-[#050505] bg-[#050505] overflow-hidden shadow-2xl transition-transform duration-75"
            style={{
              left: `${cursorPos.x + 20}px`,
              top: `${cursorPos.y - 70}px`,
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80"
              alt="Action Control Reveal"
              className="w-full h-full object-cover grayscale contrast-125"
            />
          </div>
        )}

        {/* Parameter Configuration & Output */}
        <div className="bg-[#FFFFFF] border border-[#D8D6D0] p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-[#D8D6D0] pb-4 font-mono text-xs">
            <div>SELECTED TOOL: <span className="font-bold">{selectedAction.name}</span></div>
            <div>CATEGORY: <span className="font-bold uppercase">{selectedAction.category}</span></div>
          </div>

          <div>
            <label className="block label-caps text-[#686868] mb-2">ACTION PARAMETERS (JSON)</label>
            <textarea
              value={paramsJson}
              onChange={(e) => setParamsJson(e.target.value)}
              rows={4}
              className="w-full bg-[#F3F1EC] border border-[#D8D6D0] p-4 font-mono text-xs text-[#050505] focus:border-[#050505] outline-none"
            />
          </div>

          <button onClick={executeActionNow} disabled={isLoading} className="btn-sre-mono py-4 w-full">
            EXECUTE {selectedAction.name.toUpperCase()} NOW
          </button>
        </div>

        {/* Response Panel */}
        {lastResponse && (
          <div className="bg-[#050505] text-[#FFFFFF] border border-[#050505] p-6 space-y-2 font-mono text-xs">
            <div className="font-bold border-b border-white/20 pb-2">// AUDIT RECORDED RESPONSE</div>
            <div>ACTION ID: {lastResponse.action_id}</div>
            <div>MESSAGE: {lastResponse.message}</div>
            <div>LATENCY: {lastResponse.execution_time_ms} ms</div>
            <div>TIMESTAMP: {lastResponse.timestamp}</div>
          </div>
        )}
      </div>

      {/* Safety Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#050505]/90 z-50 flex items-center justify-center p-4">
          <div className="bg-[#050505] text-[#FFFFFF] border border-[#FFFFFF] max-w-lg w-full p-8 space-y-6 font-mono text-xs">
            <div className="border-b border-white/20 pb-4 font-bold text-base">
              HIGH-IMPACT ACTION CONFIRMATION: {selectedAction.name}
            </div>
            <pre className="bg-[#141414] p-4 border border-white/10 text-[11px]">{paramsJson}</pre>
            <label className="flex items-center gap-3 bg-[#141414] p-4 border border-white/10 cursor-pointer">
              <input
                type="checkbox"
                checked={hasConfirmed}
                onChange={(e) => setHasConfirmed(e.target.checked)}
                className="accent-white w-4 h-4"
              />
              <span>I understand this is a simulated, predefined remediation action.</span>
            </label>
            <div className="flex gap-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 btn-sre-dark-outline">
                CANCEL
              </button>
              <button
                onClick={executeActionNow}
                disabled={!hasConfirmed || isLoading}
                className="flex-1 btn-sre-dark-outline bg-[#FFFFFF] text-[#050505] hover:bg-transparent hover:text-[#FFFFFF]"
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
