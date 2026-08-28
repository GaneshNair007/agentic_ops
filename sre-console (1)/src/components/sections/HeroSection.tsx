import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Play } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroStageRef = useRef<HTMLDivElement>(null);
  const imageStripRef = useRef<HTMLDivElement>(null);
  const titleLeftRef = useRef<HTMLSpanElement>(null);
  const titleRightRef = useRef<HTMLSpanElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current || !imageStripRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          pin: heroStageRef.current,
          anticipatePin: 1,
        },
      });

      // GSAP scrubbed timeline for hero scroll sequence
      tl.to(imageStripRef.current, {
        width: '100vw',
        ease: 'none',
      }, 0)
      .to(titleLeftRef.current, {
        x: '-28vw',
        ease: 'none',
      }, 0)
      .to(titleRightRef.current, {
        x: '28vw',
        ease: 'none',
      }, 0)
      .to(scanLineRef.current, {
        top: '100%',
        ease: 'none',
      }, 0);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={containerRef} className="relative w-full h-[220vh] bg-[#050505] text-[#FFFFFF]">
      {/* Pinned Stage */}
      <div ref={heroStageRef} className="w-full h-screen relative overflow-hidden flex flex-col justify-between p-6 md:p-12">
        
        {/* Expanding Central Infrastructure Image Strip */}
        <div 
          ref={imageStripRef} 
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[22vw] overflow-hidden z-0 shadow-2xl"
        >
          <img
            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2000&q=90"
            alt="Data Center Server Infrastructure"
            className="w-full h-full object-cover grayscale contrast-125 scale-110"
          />
          <div className="absolute inset-0 bg-[#050505]/40" />
          
          {/* Vertical Scanning Line */}
          <div ref={scanLineRef} className="absolute top-0 left-0 w-full h-[2px] bg-[#FFFFFF] shadow-[0_0_15px_#FFFFFF]" />
        </div>

        {/* Top Edge Metadata Pins */}
        <div className="relative z-10 flex justify-between items-center text-xs font-mono text-[#C7C7C7] uppercase tracking-widest border-b border-white/10 pb-4">
          <div>// OPERATIONAL INCIDENT RESPONSE ENGINE</div>
          <div className="hidden md:block">20 INCIDENTS // 15 RUNBOOKS // CHROMADB</div>
        </div>

        {/* Split Typography Center Stage */}
        <div className="relative z-10 text-center select-none my-auto">
          <h1 className="font-display text-7xl md:text-9xl font-extrabold text-[#FFFFFF] tracking-tighter flex items-center justify-center gap-8 leading-none">
            <span ref={titleLeftRef} className="inline-block">AI</span>
            <span ref={titleRightRef} className="inline-block text-[#FFFFFF]">SRE</span>
          </h1>
        </div>

        {/* Bottom Hero Narrative & CTAs */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-end border-t border-white/10 pt-6">
          <div className="md:col-span-8 space-y-2">
            <div className="label-caps text-[#C7C7C7]">// INCIDENT TRIAGE & RESPONSE SYSTEM</div>
            <p className="prose-editorial text-base md:text-xl text-[#C7C7C7] max-w-2xl font-sans">
              AI-assisted incident triage grounded in operational runbooks, controlled actions and a complete audit trail.
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col sm:flex-row md:justify-end gap-3">
            <button
              onClick={() => scrollToSection('simulator')}
              className="btn-sre-dark-outline bg-[#FFFFFF] text-[#050505] hover:bg-transparent hover:text-[#FFFFFF] py-3.5 px-6 text-xs"
            >
              <Play className="w-4 h-4 fill-current" /> RUN SIMULATION
            </button>
            <button
              onClick={() => scrollToSection('workflow')}
              className="btn-sre-dark-outline py-3.5 px-6 text-xs"
            >
              EXPLORE <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
