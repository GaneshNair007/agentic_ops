import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import imgStage1 from '../../assets/images/5_control_room.jpg';
import imgStage2 from '../../assets/images/3_cables.jpg';
import imgStage3 from '../../assets/images/7_switch.jpg';

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  {
    step: '01',
    tech: 'SILENCE, THEN FAILURE – 38 INCIDENTS INDEXED',
    title: 'ALERT\nRECEIVED',
    copy: 'When an incident begins, the hardest problem is not receiving another alert. It is finding the right evidence and choosing a safe response under extreme time pressure.',
    fact: 'AUTOMATED LOG TRIAGE',
    image: imgStage1,
    maskId: 'blindMask'
  },
  {
    step: '02',
    tech: 'CHROMADB DENSE SEARCH – 16 RUNBOOKS',
    title: 'EVIDENCE\nRETRIEVED',
    copy: 'Instead of searching wikis, the agent queries ChromaDB for relevant past incidents and runbooks using sentence-transformers all-MiniLM-L6-v2 embeddings.',
    fact: 'DENSE VECTOR COSINE SIMILARITY (98.4%)',
    image: imgStage2,
    maskId: 'gridMask'
  },
  {
    step: '03',
    tech: 'AUDITABLE REMEDIATION – 8 CONTROLLED ACTIONS',
    title: 'RESPONSE\nCONTROLLED',
    copy: 'The agent selects a controlled action from predefined boundaries, safely executing remediation while logging every step to an immutable audit trail.',
    fact: 'TOOLS/AUDIT.LOG APPENDED (ID: evt_8f92)',
    image: imgStage3,
    maskId: 'diagMask'
  }
];

export const SystemWorkflow: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const imagesRef = useRef<(SVGImageElement | null)[]>([]);
  const masksRef = useRef<(SVGElement | null)[]>([]);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: stageRef.current,
          scrub: 1,
        }
      });

      // Initial Setup
      gsap.set(itemsRef.current[0], { opacity: 1, x: 0 });
      gsap.set(itemsRef.current.slice(1), { opacity: 0.25, x: -10 });
      
      // Setup masks
      // Blind mask starts closed except for first image which doesn't use a mask initially (or we just fade it)
      // Actually image 1 is base, image 2 uses blind mask, image 3 uses grid mask
      
      // Animate Vertical Progress Line
      tl.to(progressLineRef.current, {
        height: '100%',
        ease: 'none'
      }, 0);

      // Section divisions
      const step = 1 / (STAGES.length - 1);

      // Transition to Stage 2
      tl.to(itemsRef.current[0], { opacity: 0.25, x: -10, duration: 0.2 }, step * 0.5)
        .to(itemsRef.current[1], { opacity: 1, x: 0, duration: 0.2 }, step * 0.5)
        .to('.blind-rect', { scaleY: 1, duration: 0.5, stagger: 0.1, ease: 'power2.inOut' }, step * 0.4);

      // Transition to Stage 3
      tl.to(itemsRef.current[1], { opacity: 0.25, x: -10, duration: 0.2 }, step * 1.5)
        .to(itemsRef.current[2], { opacity: 1, x: 0, duration: 0.2 }, step * 1.5)
        .to('.grid-rect', { opacity: 1, scale: 1, duration: 0.5, stagger: { amount: 0.5, from: "random" }, ease: 'power2.inOut' }, step * 1.4);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="workflow" ref={containerRef} className="relative w-full h-[300vh] bg-[#F5F3EE] text-[#202020]">
      <div ref={stageRef} className="w-full h-screen border-b border-[#D8D6D0] flex items-center px-6 md:px-12 lg:px-16 overflow-hidden">
        <div className="w-full max-w-[1760px] mx-auto h-full max-h-[900px] grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left: 5 Columns with Vertical Progress Line */}
          <div className="lg:col-span-5 h-full flex items-center relative pl-8">
            {/* Vertical Progress Track */}
            <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-[#D8D6D0]">
              <div ref={progressLineRef} className="w-full h-0 bg-[#050505]" />
            </div>

            <div className="flex flex-col gap-12 lg:gap-16 w-full">
              {STAGES.map((st, i) => (
                <div
                  key={st.step}
                  ref={el => itemsRef.current[i] = el}
                  className="flex flex-col gap-3 relative transition-all"
                >
                  <div className="font-mono text-xs md:text-sm text-[#686868] font-bold uppercase tracking-widest leading-relaxed flex flex-col gap-1">
                    <span>[{st.step}] {st.tech}</span>
                    <span className="text-[#E8913C]">// {st.fact}</span>
                  </div>
                  <h3 className="font-display text-5xl md:text-[4rem] lg:text-[5.5rem] leading-[0.85] font-black text-[#050505] tracking-tighter whitespace-pre-line">
                    {st.title}
                  </h3>
                  <p className="font-sans text-lg md:text-xl text-[#4A4A4A] leading-relaxed max-w-[48ch] mt-4">
                    {st.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 7 Columns Photography with SVG Masks */}
          <div className="lg:col-span-7 h-full flex items-center py-12 lg:py-24">
            <div className="w-full h-[70vh] lg:h-[80vh] relative bg-[#050505] shadow-2xl">
              
              <svg width="100%" height="100%" preserveAspectRatio="none" className="absolute inset-0 z-0">
                <defs>
                  {/* Mask 1: Blinds (Vertical stripes growing downwards) */}
                  <mask id="blindMask">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <rect key={i} className="blind-rect" x={`${i * 10}%`} y="0" width="10%" height="100%" fill="white" style={{ transformOrigin: 'top', transform: 'scaleY(0)' }} />
                    ))}
                  </mask>

                  {/* Mask 2: Grid blocks revealing randomly */}
                  <mask id="gridMask">
                    {Array.from({ length: 25 }).map((_, i) => {
                      const row = Math.floor(i / 5);
                      const col = i % 5;
                      return (
                        <rect 
                          key={i} 
                          className="grid-rect" 
                          x={`${col * 20}%`} 
                          y={`${row * 20}%`} 
                          width="20%" 
                          height="20%" 
                          fill="white" 
                          style={{ opacity: 0, transformOrigin: 'center', transform: 'scale(0)' }} 
                        />
                      );
                    })}
                  </mask>
                </defs>

                {/* Base Image (Stage 1) */}
                <image href={imgStage1} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
                
                {/* Layer 2 (Stage 2) using Blind Mask */}
                <image href={imgStage2} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" mask="url(#blindMask)" />
                
                {/* Layer 3 (Stage 3) using Grid Mask */}
                <image href={imgStage3} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" mask="url(#gridMask)" />
              </svg>

              <div className="absolute bottom-6 left-6 bg-[#050505] text-[#F1F1F1] px-4 py-3 text-xs md:text-sm font-mono uppercase tracking-widest border border-white/20 z-10 shadow-lg">
                // REAL-TIME INCIDENT STATE
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
