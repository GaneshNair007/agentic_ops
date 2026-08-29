import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  {
    step: '01',
    title: 'ALERT RECEIVED',
    subtitle: 'SILENCE, THEN FAILURE',
    copy: 'When an incident begins, the hardest problem is not receiving another alert. It is finding the right evidence and choosing a safe response under extreme time pressure.',
    fact: '20 INCIDENTS INDEXED // AUTOMATED LOG TRIAGE',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1600&q=90'
  },
  {
    step: '02',
    title: 'EVIDENCE RETRIEVED',
    subtitle: 'CHROMADB DENSE SEARCH',
    copy: 'ChromaDB searches 35 indexed documents using sentence-transformers all-MiniLM-L6-v2 embeddings to return relevant runbooks and normalized scores.',
    fact: '15 RUNBOOKS // DENSE VECTOR COSINE SIMILARITY',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=90'
  },
  {
    step: '03',
    title: 'RESPONSE CONTROLLED',
    subtitle: 'AUDITABLE REMEDIATION',
    copy: 'Recommendations are mapped to 8 controlled, predefined simulation actions. Every execution generates a structured outcome and an audit record.',
    fact: '8 CONTROLLED ACTIONS // TOOLS/AUDIT.LOG APPENDED',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1600&q=90'
  }
];

export const ProblemSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedStageRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current || !pinnedStageRef.current) return;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: pinnedStageRef.current,
        scrub: 0.5,
        onUpdate: (self) => {
          const idx = Math.min(2, Math.floor(self.progress * 3));
          setActiveStage(idx);
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[250vh] bg-[#F5F3EE] text-[#202020]">
      {/* GSAP Pinned Stage (Full-Width 12-Column Grid) */}
      <div ref={pinnedStageRef} className="w-full h-screen border-b border-[#D8D6D0] flex items-center">
        <div className="container-full w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (5 Cols): Typographic Storytelling (NO BOXES) */}
          <div className="lg:col-span-5 space-y-10">
            <div className="label-caps text-[#686868]">// OPERATIONAL INCIDENT TRIAGE</div>

            {/* Stage Titles & Copy */}
            <div className="space-y-8">
              {STAGES.map((st, idx) => {
                const isActive = activeStage === idx;
                return (
                  <div 
                    key={st.step}
                    className={`transition-all duration-300 ${
                      isActive ? 'opacity-100 translate-x-0' : 'opacity-25 -translate-x-2'
                    }`}
                  >
                    <div className="font-mono text-sm text-[#686868] mb-2 uppercase tracking-widest font-bold">
                      [{st.step}] {st.subtitle} — {st.fact}
                    </div>
                    <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#202020] leading-none mb-3">
                      {st.title}
                    </h2>
                    {isActive && (
                      <p className="prose-editorial text-lg text-[#4A4A4A] font-sans font-normal transition-opacity duration-300">
                        {st.copy}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress Line */}
            <div className="w-full h-1 bg-[#D8D6D0] overflow-hidden">
              <div 
                className="h-full bg-[#050505] transition-all duration-300"
                style={{ width: `${(activeStage + 1) * 33.33}%` }}
              />
            </div>
          </div>

          {/* Right Column (7 Cols): Full-Colour Infrastructure Photography (55-60% Viewport Width, 75vh Height) */}
          <div className="lg:col-span-7">
            <div className="w-full h-[75vh] bg-[#050505] overflow-hidden relative shadow-2xl">
              <img
                src={STAGES[activeStage].image}
                alt={STAGES[activeStage].title}
                className="w-full h-full object-cover  scale-105 transition-all duration-700"
              />
              <div className="absolute bottom-6 left-6 bg-[#050505] text-[#F1F1F1] px-4 py-2 text-sm font-mono uppercase tracking-widest border border-white/20">
                FIG {STAGES[activeStage].step} // {STAGES[activeStage].title}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
