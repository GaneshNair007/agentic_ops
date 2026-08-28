import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  {
    step: '01',
    tech: 'SILENCE, THEN FAILURE – 38 INCIDENTS INDEXED // AUTOMATED LOG TRIAGE',
    title: 'ALERT\nRECEIVED',
    copy: 'When an incident begins, the hardest problem is not receiving another alert. It is finding the right evidence and choosing a safe response under extreme time pressure.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=90'
  },
  {
    step: '02',
    tech: 'CHROMADB DENSE SEARCH – 16 RUNBOOKS // DENSE VECTOR COSINE SIMILARITY',
    title: 'EVIDENCE\nRETRIEVED',
    copy: 'Instead of searching wikis, the agent queries ChromaDB for relevant past incidents and runbooks using sentence-transformers all-MiniLM-L6-v2 embeddings.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1600&q=90'
  },
  {
    step: '03',
    tech: 'AUDITABLE REMEDIATION – 8 CONTROLLED ACTIONS // TOOLS/AUDIT.LOG APPENDED',
    title: 'RESPONSE\nCONTROLLED',
    copy: 'The agent selects a controlled action from predefined boundaries, safely executing remediation while logging every step to an immutable audit trail.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=90'
  }
];

export const SystemWorkflow: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const labelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current || !stageRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: stageRef.current,
          scrub: 1,
        }
      });

      // Initially set the first item to active state, others to inactive
      gsap.set(itemsRef.current[0], { opacity: 1, y: 0 });
      gsap.set(itemsRef.current.slice(1), { opacity: 0.25, y: 20 });
      gsap.set(imagesRef.current.slice(1), { opacity: 0 });
      gsap.set(labelsRef.current.slice(1), { opacity: 0 });

      // Animate progress line
      tl.to(progressLineRef.current, {
        width: '100%',
        ease: 'none'
      }, 0);

      // We have 3 stages. We divide the scroll into sections.
      STAGES.forEach((_, i) => {
        if (i === 0) return; // First is already visible

        const startRatio = i / STAGES.length;

        // Reveal text item i
        tl.to(itemsRef.current[i - 1], { opacity: 0.25, y: 0, duration: 0.5 }, startRatio);
        tl.to(itemsRef.current[i], { opacity: 1, y: 0, duration: 0.5 }, startRatio);
        
        // Reveal image i
        tl.to(imagesRef.current[i - 1], { opacity: 0, duration: 0.5 }, startRatio);
        tl.to(imagesRef.current[i], { opacity: 1, duration: 0.5 }, startRatio);

        // Reveal label i
        tl.to(labelsRef.current[i - 1], { opacity: 0, duration: 0.5 }, startRatio);
        tl.to(labelsRef.current[i], { opacity: 1, duration: 0.5 }, startRatio);
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="workflow" ref={containerRef} className="relative w-full h-[300vh] bg-[#F5F3EE] text-[#202020]">
      {/* GSAP Pinned Stage (Full-Width Layout) */}
      <div ref={stageRef} className="w-full h-screen border-b border-[#D8D6D0] flex items-center px-6 md:px-12 lg:px-24">
        <div className="w-full h-full max-h-[900px] grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Side (5 Cols): Typographic Stage Timeline */}
          <div className="lg:col-span-5 h-full flex flex-col justify-center gap-12">
            <div className="text-xs uppercase tracking-[0.15em] font-mono text-[#686868] font-bold">
              // OPERATIONAL INCIDENT TRIAGE
            </div>

            <div className="flex flex-col gap-8 lg:gap-12 relative">
              {STAGES.map((st, i) => (
                <div
                  key={st.step}
                  ref={el => itemsRef.current[i] = el}
                  className="flex flex-col gap-2 relative"
                >
                  <div className="font-mono text-[10px] md:text-xs text-[#686868] font-bold uppercase tracking-widest leading-relaxed">
                    [{st.step}] {st.tech}
                  </div>
                  <h3 className="font-display text-5xl md:text-6xl lg:text-[5rem] leading-[0.9] font-black text-[#050505] tracking-tight whitespace-pre-line">
                    {st.title}
                  </h3>
                  <p className="font-sans text-lg md:text-xl text-[#4A4A4A] leading-relaxed max-w-[50ch] mt-4">
                    {st.copy}
                  </p>
                </div>
              ))}
            </div>

            {/* Progress Line */}
            <div className="w-full h-0.5 bg-[#D8D6D0] mt-8">
              <div 
                ref={progressLineRef}
                className="h-full bg-[#050505] w-0"
              />
            </div>
          </div>

          {/* Right Side (7 Cols): Overlapping Image Sequence */}
          <div className="lg:col-span-7 h-full flex items-center py-12 md:py-24">
            <div className="w-full h-full relative bg-[#050505] overflow-hidden shadow-2xl">
              {STAGES.map((st, i) => (
                <React.Fragment key={st.step}>
                  <img
                    ref={el => imagesRef.current[i] = el}
                    src={st.image}
                    alt={st.title.replace('\n', ' ')}
                    className="absolute inset-0 w-full h-full object-cover scale-105"
                  />
                  <div 
                    ref={el => labelsRef.current[i] = el}
                    className="absolute bottom-6 left-6 bg-[#050505] text-[#F1F1F1] px-4 py-2 text-[10px] md:text-xs font-mono uppercase tracking-widest border border-white/20"
                  >
                    PIN {st.step} // {st.title.replace('\n', ' ')}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
