import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  {
    step: '01',
    title: 'INCIDENT RECEIVED',
    tech: 'POST /api/pipeline/run',
    copy: 'Alertmanager or operator submits target service name, severity tier (P1–P3), and incident symptom payload to initiate automated agent triage.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=90'
  },
  {
    step: '02',
    title: 'EVIDENCE RETRIEVED',
    tech: 'retrieve(query, k=5)',
    copy: 'ChromaDB queries 35 indexed operational documents using sentence-transformers all-MiniLM-L6-v2 embeddings for relevant past incidents and runbooks.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1600&q=90'
  },
  {
    step: '03',
    title: 'RECOMMENDATION CREATED',
    tech: 'orchestrator.agent',
    copy: 'Diagnostic agent compares evidence relevance scores and synthesizes a structured recovery plan grounded in operational runbooks.',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1600&q=90'
  },
  {
    step: '04',
    title: 'CONTROLLED ACTION SELECTED',
    tech: 'execute_action(action, params)',
    copy: 'Selects from 8 predefined mock actions (restart_service, scale_deployment, rollback_deployment) with strict parameter validation and safety bounds.',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1600&q=90'
  },
  {
    step: '05',
    title: 'AUDIT EVENT RECORDED',
    tech: 'emit_event() & audit.log',
    copy: 'Every event timeline payload and action execution is appended to tools/events.jsonl and tools/audit.log for forensic accountability.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=90'
  }
];

export const SystemWorkflow: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current || !stageRef.current) return;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: stageRef.current,
        scrub: 0.5,
        onUpdate: (self) => {
          const idx = Math.min(STAGES.length - 1, Math.floor(self.progress * STAGES.length));
          setActiveIdx(idx);
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="workflow" ref={containerRef} className="relative w-full h-[300vh] bg-[#F5F3EE] text-[#202020]">
      {/* GSAP Pinned Stage (Full-Width Unboxed 12-Column Layout) */}
      <div ref={stageRef} className="w-full h-screen border-b border-[#D8D6D0] flex items-center px-6 md:px-16 lg:px-24">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side (5 Cols): Typographic Stage Timeline (NO BOXED CARDS) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="label-caps text-[#686868]">// PIPELINE EXECUTION STAGES</div>

            <div className="space-y-6">
              {STAGES.map((st, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <div
                    key={st.step}
                    onClick={() => setActiveIdx(idx)}
                    className={`cursor-pointer transition-all duration-300 ${
                      isActive ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-2'
                    }`}
                  >
                    <div className="flex justify-between items-center font-mono text-xs text-[#686868] mb-1 font-bold">
                      <span>[{st.step}] {st.tech}</span>
                      {isActive && <span className="text-[#050505] font-extrabold uppercase">ACTIVE STAGE</span>}
                    </div>
                    <h3 className="font-display text-3xl md:text-5xl font-extrabold text-[#202020] leading-none mb-2">
                      {st.title}
                    </h3>
                    {isActive && (
                      <p className="prose-editorial text-base md:text-lg text-[#4A4A4A] font-sans font-normal mt-2">
                        {st.copy}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Stage Progress Line */}
            <div className="w-full h-1 bg-[#D8D6D0] overflow-hidden">
              <div 
                className="h-full bg-[#050505] transition-all duration-300"
                style={{ width: `${(activeIdx + 1) * 20}%` }}
              />
            </div>
          </div>

          {/* Right Side (7 Cols): Full-Colour High-Res Infrastructure Photography */}
          <div className="lg:col-span-7">
            <div className="w-full h-[75vh] bg-[#050505] overflow-hidden relative shadow-2xl">
              <img
                src={STAGES[activeIdx].image}
                alt={STAGES[activeIdx].title}
                className="w-full h-full object-cover grayscale-0 scale-105 transition-all duration-700"
              />
              <div className="absolute bottom-6 left-6 bg-[#050505] text-[#F1F1F1] px-4 py-2 text-xs font-mono uppercase tracking-widest border border-white/20">
                STAGE {STAGES[activeIdx].step} // {STAGES[activeIdx].title}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
