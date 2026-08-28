import React, { useState } from 'react';

const WORKFLOW_STAGES = [
  {
    step: '01',
    title: 'INCIDENT RECEIVED',
    description: 'Alertmanager or operator submits target service name, severity (P1-P3), and symptom payload.',
    tech: 'POST /api/pipeline/run',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=85'
  },
  {
    step: '02',
    title: 'SEMANTIC EVIDENCE RETRIEVED',
    description: 'ChromaDB queries 35 indexed documents via all-MiniLM-L6-v2 embeddings for relevant incidents & runbooks.',
    tech: 'retrieve(query, k=5)',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=85'
  },
  {
    step: '03',
    title: 'RECOMMENDATION CREATED',
    description: 'Diagnostic agent compares evidence relevance scores and synthesizes a structured recovery plan.',
    tech: 'orchestrator.agent',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1000&q=85'
  },
  {
    step: '04',
    title: 'CONTROLLED ACTION SELECTED',
    description: 'Selects from 8 predefined mock actions (restart_service, scale_deployment, rollback_deployment) with parameter validation.',
    tech: 'execute_action(action, params)',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=85'
  },
  {
    step: '05',
    title: 'AUDIT EVENT RECORDED',
    description: 'Every event timeline payload and action execution is appended to tools/events.jsonl and tools/audit.log.',
    tech: 'emit_event() & audit.log',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=85'
  }
];

export const SystemWorkflow: React.FC = () => {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section id="workflow" className="w-full min-h-screen bg-[#F3F1EC] text-[#090909] py-24 px-6 md:px-12 border-b border-[#D8D6D0]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="border-b border-[#D8D6D0] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="label-caps text-[#686868]">// ORCHESTRATION PIPELINE</div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-[#090909] mt-2">
              SYSTEM WORKFLOW & STAGES
            </h2>
          </div>
          <div className="text-xs font-mono text-[#686868]">
            STAGE {activeStage + 1} OF {WORKFLOW_STAGES.length}
          </div>
        </div>

        {/* Workflow Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Stage List */}
          <div className="lg:col-span-6 space-y-4">
            {WORKFLOW_STAGES.map((st, idx) => {
              const isActive = activeStage === idx;
              return (
                <div
                  key={st.step}
                  onClick={() => setActiveStage(idx)}
                  className={`p-6 border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#090909] text-[#F3F1EC] border-[#090909]'
                      : 'bg-[#FFFFFF] text-[#090909] border-[#D8D6D0] hover:border-[#090909]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`font-mono text-sm font-bold ${isActive ? 'text-[#F3F1EC]' : 'text-[#686868]'}`}>
                      [{st.step}]
                    </span>
                    <span className={`text-[10px] font-mono border px-2 py-0.5 uppercase ${
                      isActive ? 'border-[#F3F1EC]/30 text-[#F3F1EC]' : 'border-[#D8D6D0] text-[#686868]'
                    }`}>
                      {st.tech}
                    </span>
                  </div>
                  <h3 className="font-display text-lg mb-2">{st.title}</h3>
                  <p className={`text-xs font-sans leading-relaxed ${isActive ? 'text-[#D8D6D0]' : 'text-[#303030]'}`}>
                    {st.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Monochrome Stage Image & Technical Specification */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-[4/3] bg-[#090909] border border-[#D8D6D0] overflow-hidden relative">
              <img
                src={WORKFLOW_STAGES[activeStage].image}
                alt={WORKFLOW_STAGES[activeStage].title}
                className="w-full h-full object-cover grayscale contrast-125 transition-all duration-500"
              />
              <div className="absolute top-4 right-4 bg-[#090909] text-[#F3F1EC] px-3 py-1 text-[10px] font-mono uppercase border border-[#D8D6D0]/30">
                ACTIVE STAGE {WORKFLOW_STAGES[activeStage].step}
              </div>
            </div>

            <div className="p-6 bg-[#FFFFFF] border border-[#D8D6D0] font-mono text-xs space-y-2">
              <div className="text-[#686868] uppercase">// BACKEND EXECUTION SPECIFICATION</div>
              <div className="text-[#090909] font-bold">{WORKFLOW_STAGES[activeStage].title}</div>
              <div className="text-[#303030] text-[11px]">{WORKFLOW_STAGES[activeStage].description}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
