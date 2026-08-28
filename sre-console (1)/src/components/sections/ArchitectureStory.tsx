import React from 'react';
import { Database, Cpu, Search, Wrench, FileText, Server } from 'lucide-react';

export const ArchitectureStory: React.FC = () => {
  return (
    <section className="w-full min-h-[70vh] bg-[#F3F1EC] text-[#090909] py-24 px-6 md:px-12 border-b border-[#D8D6D0]">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="border-b border-[#D8D6D0] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="label-caps text-[#686868]">// TECHNICAL ARCHITECTURE</div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-[#090909] mt-2">
              SYSTEM DESIGN & DATA PIPELINE
            </h2>
          </div>
          <div className="text-xs font-mono text-[#686868]">
            FASTAPI // CHROMADB // SENTENCE-TRANSFORMERS
          </div>
        </div>

        {/* Original SVG/CSS Monochrome Architecture Graph */}
        <div className="bg-[#FFFFFF] border border-[#D8D6D0] p-8 md:p-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            {/* Step 1: Raw Data & Embeddings */}
            <div className="p-6 bg-[#F3F1EC] border border-[#D8D6D0] space-y-3">
              <div className="text-[10px] font-mono text-[#686868]">01 // KNOWLEDGE SOURCE</div>
              <div className="font-display text-sm font-bold">20 INCIDENTS & 15 RUNBOOKS</div>
              <p className="text-xs text-[#303030]">Dense vector representations generated via all-MiniLM-L6-v2 model.</p>
            </div>

            {/* Step 2: Vector Database */}
            <div className="p-6 bg-[#F3F1EC] border border-[#D8D6D0] space-y-3">
              <div className="text-[10px] font-mono text-[#686868]">02 // CHROMADB INDEX</div>
              <div className="font-display text-sm font-bold">sre_knowledge_base</div>
              <p className="text-xs text-[#303030]">Persistent vector store executing cosine similarity retrieval.</p>
            </div>

            {/* Step 3: Orchestrator Pipeline */}
            <div className="p-6 bg-[#090909] text-[#F3F1EC] border border-[#090909] space-y-3">
              <div className="text-[10px] font-mono text-[#686868]">03 // AGENT ORCHESTRATOR</div>
              <div className="font-display text-sm font-bold text-[#F3F1EC]">TRIAGE & DIAGNOSIS</div>
              <p className="text-xs text-[#D8D6D0]">Synthesizes evidence and selects optimal predefined action.</p>
            </div>

            {/* Step 4: Action & Audit Log */}
            <div className="p-6 bg-[#F3F1EC] border border-[#D8D6D0] space-y-3">
              <div className="text-[10px] font-mono text-[#686868]">04 // ACTION & AUDIT</div>
              <div className="font-display text-sm font-bold">tools/audit.log</div>
              <p className="text-xs text-[#303030]">Executes controlled action and appends immutable JSONL record.</p>
            </div>

          </div>

          <div className="pt-6 border-t border-[#D8D6D0] flex flex-col md:flex-row justify-between text-xs font-mono text-[#686868] gap-4">
            <div>• FRONTEND: REACT 19 + VITE + TYPESCRIPT</div>
            <div>• BACKEND: PYTHON FASTAPI ON PORT 8000</div>
            <div>• PERSISTENCE: CHROMADB + JSONL AUDIT TRAIL</div>
          </div>
        </div>
      </div>
    </section>
  );
};
