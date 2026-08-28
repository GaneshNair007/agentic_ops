import React, { useState, useEffect } from 'react';

const NODES = [
  { id: 'payload', title: 'INCIDENT PAYLOAD', desc: 'Service name, severity (P1-P3), symptom description' },
  { id: 'embeddings', title: 'SENTENCE-TRANSFORMERS', desc: 'all-MiniLM-L6-v2 dense vector representation' },
  { id: 'chromadb', title: 'CHROMADB VECTOR STORE', desc: '35 indexed documents in sre_knowledge_base' },
  { id: 'retrieval', title: 'SEMANTIC RETRIEVAL API', desc: 'Cosine similarity ranking & normalized scores' },
  { id: 'orchestrator', title: 'AGENT ORCHESTRATOR', desc: 'Triage, diagnosis & recovery plan synthesis' },
  { id: 'action', title: 'CONTROLLED ACTION ENGINE', desc: '8 predefined mock remediation tools' },
  { id: 'audit', title: 'JSONL AUDIT TRAIL', desc: 'Immutable log appended to tools/audit.log' },
];

export const ArchitectureStory: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % NODES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-[#F3F1EC] text-[#050505] py-24 px-6 md:px-12 border-b border-[#D8D6D0]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-[#D8D6D0] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="label-caps text-[#686868]">// TECHNICAL ARCHITECTURE & SIGNAL FLOW</div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-[#050505] mt-2">
              ANIMATED SYSTEM PIPELINE
            </h2>
          </div>
          <div className="text-xs font-mono text-[#686868]">
            STEP {activeStep + 1} OF {NODES.length} // ACTIVE SIGNAL: {NODES[activeStep].id.toUpperCase()}
          </div>
        </div>

        {/* Animated Signal Path Diagram */}
        <div className="bg-[#FFFFFF] border border-[#D8D6D0] p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {NODES.map((n, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={n.id}
                  onClick={() => setActiveStep(idx)}
                  className={`p-5 border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#050505] text-[#FFFFFF] border-[#050505] scale-105 shadow-xl'
                      : 'bg-[#F3F1EC] text-[#050505] border-[#D8D6D0] hover:border-[#050505]'
                  }`}
                >
                  <div className="flex justify-between items-center font-mono text-[10px] mb-2">
                    <span className={isActive ? 'text-[#FFFFFF]' : 'text-[#686868]'}>NODE 0{idx + 1}</span>
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#FFFFFF] animate-ping' : 'bg-[#D8D6D0]'}`} />
                  </div>
                  <h3 className="font-display text-sm font-bold mb-1">{n.title}</h3>
                  <p className={`font-mono text-[11px] leading-relaxed ${isActive ? 'text-[#C7C7C7]' : 'text-[#4A4A4A]'}`}>
                    {n.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Active Node Detail Strip */}
          <div className="p-6 bg-[#050505] text-[#FFFFFF] border border-[#050505] font-mono text-xs flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-[#8E8E8E] uppercase">// ACTIVE PIPELINE NODE:</span>{' '}
              <span className="font-bold text-[#FFFFFF]">{NODES[activeStep].title}</span>
            </div>
            <div className="text-[#C7C7C7]">{NODES[activeStep].desc}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
