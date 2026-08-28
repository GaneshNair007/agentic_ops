import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATEMENTS = [
  {
    step: '01',
    title: 'ALERT RECEIVED',
    subtitle: 'SILENCE, THEN FAILURE',
    copy: 'When an incident begins, the hardest problem is not receiving another alert. It is finding the right evidence and choosing a safe response under extreme time pressure.',
    fact: '20 INCIDENTS INDEXED // AUTOMATED LOG TRIAGE',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=85'
  },
  {
    step: '02',
    title: 'EVIDENCE RETRIEVED',
    subtitle: 'CHROMADB DENSE SEARCH',
    copy: 'ChromaDB searches 35 indexed documents using sentence-transformers all-MiniLM-L6-v2 embeddings to return relevant runbooks and normalized scores.',
    fact: '15 RUNBOOKS // DENSE VECTOR COSINE SIMILARITY',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85'
  },
  {
    step: '03',
    title: 'RESPONSE CONTROLLED',
    subtitle: 'AUDITABLE REMEDIATION',
    copy: 'Recommendations are mapped to 8 controlled, predefined simulation actions. Every execution generates a structured outcome and an audit record.',
    fact: '8 CONTROLLED ACTIONS // TOOLS/AUDIT.LOG APPENDED',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=85'
  }
];

export const ProblemSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedStageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current || !pinnedStageRef.current) return;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: pinnedStageRef.current,
        scrub: true,
        onUpdate: (self) => {
          const idx = Math.min(2, Math.floor(self.progress * 3));
          setActiveIndex(idx);
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[250vh] bg-[#F3F1EC] text-[#050505]">
      {/* Pinned Stage */}
      <div ref={pinnedStageRef} className="w-full h-screen border-b border-[#D8D6D0] flex flex-col justify-center px-6 md:px-12">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Statements List */}
          <div className="lg:col-span-6 space-y-8">
            <div className="label-caps text-[#686868]">
              // PROBLEM STATEMENT & OPERATIONAL REALITY
            </div>

            <div className="space-y-6">
              {STATEMENTS.map((st, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <div 
                    key={st.step} 
                    className={`p-6 border transition-all duration-300 ${
                      isActive 
                        ? 'bg-[#050505] text-[#FFFFFF] border-[#050505]' 
                        : 'bg-[#FFFFFF] text-[#050505] border-[#D8D6D0] opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-center font-mono text-xs mb-2">
                      <span className="font-bold">[{st.step}] {st.subtitle}</span>
                      <span className="text-[11px]">{st.fact}</span>
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl mb-3">{st.title}</h2>
                    <p className={`font-sans text-sm md:text-base leading-relaxed ${isActive ? 'text-[#C7C7C7]' : 'text-[#4A4A4A]'}`}>
                      {st.copy}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Vertical Progress Bar */}
            <div className="w-full h-1 bg-[#D8D6D0] overflow-hidden">
              <div 
                className="h-full bg-[#050505] transition-all duration-300"
                style={{ width: `${(activeIndex + 1) * 33.33}%` }}
              />
            </div>
          </div>

          {/* Right Changing Photograph Viewport */}
          <div className="lg:col-span-6">
            <div className="aspect-[4/3] bg-[#050505] border border-[#D8D6D0] overflow-hidden relative shadow-xl">
              <img
                src={STATEMENTS[activeIndex].image}
                alt={STATEMENTS[activeIndex].title}
                className="w-full h-full object-cover grayscale contrast-125 transition-all duration-500"
              />
              <div className="absolute bottom-4 left-4 bg-[#050505] text-[#FFFFFF] px-3 py-1 text-[11px] font-mono border border-white/20 uppercase">
                FIG {STATEMENTS[activeIndex].step} // {STATEMENTS[activeIndex].title}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
