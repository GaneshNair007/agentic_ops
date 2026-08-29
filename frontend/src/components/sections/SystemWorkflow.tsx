import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import imgStage1 from '../../assets/images/5_control_room.jpg';
import imgStage2 from '../../assets/images/3_cables.jpg';
import imgStage3 from '../../assets/images/7_switch.jpg';
import CircularGallery from '../ui/CircularGallery';

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  {
    step: '01',
    title: 'ALERT RECEIVED',
    subtitle: 'SILENCE, THEN FAILURE',
    copy: 'When an incident begins, the hardest problem is not receiving another alert. It is finding the right evidence and choosing a safe response under extreme time pressure.',
    fact: '20 INCIDENTS INDEXED // AUTOMATED LOG TRIAGE',
    spec: 'METRIC_ANOMALY // P99_LATENCY_RESTORED',
    image: imgStage1
  },
  {
    step: '02',
    title: 'EVIDENCE RETRIEVED',
    subtitle: 'CHROMADB DENSE SEARCH',
    copy: 'ChromaDB searches 35 indexed documents using sentence-transformers all-MiniLM-L6-v2 embeddings to return relevant runbooks and normalized scores in sub-20ms.',
    fact: '15 RUNBOOKS // DENSE VECTOR COSINE SIMILARITY',
    spec: 'EMBEDDINGS: ALL-MINILM-L6-V2 // 384-DIM',
    image: imgStage2
  },
  {
    step: '03',
    title: 'RESPONSE CONTROLLED',
    subtitle: 'AUDITABLE REMEDIATION',
    copy: 'Recommendations are mapped to 8 controlled, predefined simulation actions. Every execution generates a structured outcome and an immutable audit record.',
    fact: '8 CONTROLLED ACTIONS // TOOLS/AUDIT.LOG APPENDED',
    spec: 'ACTION_GUARD: PARAMS_VALIDATED // ZERO_DRIFT',
    image: imgStage3
  }
];

export const SystemWorkflow: React.FC = () => {
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
    <section id="workflow" ref={containerRef} className="relative w-full h-[250vh] bg-[#FFFFFF] text-[#050505]">
      {/* GSAP Pinned Stage (Full-Width 12-Column Grid) */}
      <div ref={pinnedStageRef} className="w-full h-screen border-b border-[#E5E5E5] flex flex-col justify-between">
        
        {/* Top Section Header Strip */}
        <div className="w-full border-b border-[#E5E5E5] px-6 md:px-12 py-3 bg-[#FAFAFA] flex items-center justify-between font-mono text-xs text-[#666666] uppercase tracking-widest">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-[#050505]" />
            <span>OPERATIONAL INCIDENT WORKFLOW PIPELINE</span>
          </div>
          <div className="flex items-center gap-6">
            <span>SCROLL PROGRESS: {String(activeStage + 1).padStart(2, '0')} / 03</span>
            <span className="hidden sm:inline">// GSAP PINNED NARRATIVE</span>
          </div>
        </div>

        {/* Main Stage Grid */}
        <div className="container-full w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-8">
          
          {/* Left Column (5 Cols): Typographic Storytelling on Solid White */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-center h-full min-h-[300px] lg:min-h-[460px]">
            <div className="space-y-6">
              <div className="label-caps text-[#737373] text-sm font-mono">// STAGE 0{activeStage + 1} OF 03</div>

              {/* Stage Titles & Copy */}
              <div className="relative h-[380px] sm:h-[340px] md:h-[300px]">
                {STAGES.map((st, idx) => {
                  const isActive = activeStage === idx;
                  return (
                    <div 
                      key={st.step}
                      className={`transition-all duration-500 absolute w-full top-0 left-0 flex flex-col justify-center ${
                        isActive ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 -translate-x-4 pointer-events-none z-0'
                      }`}
                    >
                      <div className="font-mono text-sm md:text-base text-[#737373] mb-4 uppercase tracking-widest font-bold">
                        [{st.step}] {st.subtitle}
                      </div>
                      <h2 className="font-display text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-[#050505] leading-[0.95] tracking-tight mb-8 break-words">
                        {st.title.split(' ').map((word, i) => (
                           <span key={i} className="inline-block mr-3">{word}</span>
                        ))}
                      </h2>
                      <p className="font-sans text-base md:text-lg text-[#525252] leading-relaxed mb-8 max-w-md">
                        {st.copy}
                      </p>
                      <div className="font-mono text-sm text-[#050505] bg-[#F5F5F5] border border-[#E5E5E5] px-4 py-3 uppercase tracking-wider inline-block self-start">
                        — {st.fact}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Progress Track and Navigation Indicators */}
            <div className="w-full max-w-md pt-8">
              <div className="w-full h-[2px] bg-[#E5E5E5] overflow-hidden">
                <div 
                  className="h-full bg-[#050505] transition-all duration-300 ease-out"
                  style={{ width: `${(activeStage + 1) * 33.33}%` }}
                />
              </div>
              <div className="flex justify-between mt-4 font-mono text-sm text-[#737373]">
                {STAGES.map((st, idx) => (
                  <button
                    key={st.step}
                    onClick={() => setActiveStage(idx)}
                    className={`transition-colors uppercase tracking-widest text-left font-bold ${
                      activeStage === idx ? 'text-[#050505]' : 'text-[#A3A3A3] hover:text-[#525252]'
                    }`}
                  >
                    [{st.step}] {st.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
            
          </div>

          {/* Right Column (6 Cols, shifted right): High-Contrast Infrastructure Photography (Now WebGL Circular Gallery) */}
          <div className="lg:col-span-7 xl:col-span-6 lg:col-start-6 xl:col-start-7 w-full h-[400px] lg:h-auto lg:aspect-square max-w-[600px] ml-auto">
            <div className="w-full h-full bg-[#050505] border border-[#262626] overflow-hidden relative cursor-grab active:cursor-grabbing">
              <CircularGallery 
                items={STAGES.map(st => ({ image: st.image, text: st.title }))}
                bend={3}
                textColor="#ffffff"
                borderRadius={0}
                font="bold 24px monospace"
                scrollEase={0.05}
                scrollSpeed={2}
              />
              
              {/* Overlay Metadata Placard */}
              <div className="absolute bottom-6 left-6 right-6 md:right-auto bg-[#050505]/90 backdrop-blur-md text-[#FFFFFF] px-6 py-4 border border-white/20 font-mono text-xs uppercase tracking-widest flex flex-col md:flex-row md:items-center gap-3 z-10 pointer-events-none">
                <span className="font-bold text-white">FIG {STAGES[activeStage].step}</span>
                <span className="text-[#A3A3A3] hidden md:inline">|</span>
                <span className="text-[#A3A3A3]">{STAGES[activeStage].spec}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Status Bar */}
        <div className="w-full border-t border-[#E5E5E5] px-6 md:px-12 py-2.5 bg-[#FFFFFF] flex items-center justify-between font-mono text-[11px] text-[#737373]">
          <div>PHASE EXECUTION: SYNCHRONIZED</div>
          <div className="flex gap-4">
            <span>SRE-ORCHESTRATION</span>
            <span>// DETERMINISTIC</span>
          </div>
        </div>

      </div>
    </section>
  );
};
