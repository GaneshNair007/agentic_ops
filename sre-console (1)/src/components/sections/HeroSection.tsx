import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Play } from 'lucide-react';
import heroImg from '../../assets/images/1_corridor.jpg';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroStageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const titleLeftRef = useRef<HTMLSpanElement>(null);
  const titleRightRef = useRef<HTMLSpanElement>(null);
  const signalRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          pin: heroStageRef.current,
          anticipatePin: 1,
        },
      });

      // Initial states for animation
      gsap.set(imageWrapperRef.current, { clipPath: 'inset(15% 15% 15% 15%)' });
      gsap.set(imageRef.current, { scale: 1.08 });
      gsap.set(signalRef.current, { xPercent: -100, opacity: 0 });

      // Build the scroll timeline
      tl.to(imageWrapperRef.current, {
        clipPath: 'inset(0% 0% 0% 0%)',
        ease: 'power2.inOut',
      }, 0)
      .to(imageRef.current, {
        scale: 1,
        ease: 'none',
      }, 0)
      .to(titleLeftRef.current, {
        x: '-20vw',
        ease: 'none',
      }, 0)
      .to(titleRightRef.current, {
        x: '20vw',
        ease: 'none',
      }, 0)
      .to(metaRef.current, {
        y: 40,
        opacity: 0.5,
        ease: 'none',
      }, 0)
      .to(signalRef.current, {
        xPercent: 100,
        opacity: 1,
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
    <section ref={containerRef} className="relative w-full h-[220vh] bg-[#050505] text-[#F1F1F1]">
      {/* Pinned Fullscreen Stage */}
      <div ref={heroStageRef} className="w-full h-screen relative overflow-hidden flex flex-col p-6 md:p-12 z-0">
        
        {/* Full-Colour Image occupies 70%+ of viewport, revealed by clip-path */}
        <div 
          ref={imageWrapperRef} 
          className="absolute inset-0 w-full h-full z-0 overflow-hidden"
        >
          <img
            ref={imageRef}
            src={heroImg}
            alt="Data-centre corridor"
            className="w-full h-full object-cover"
          />
          {/* Subtle contrast veil protecting text */}
          <div className="absolute inset-0 bg-[#050505]/40" />
          
          {/* Thin incident signal that travels across */}
          <div 
            ref={signalRef}
            className="absolute top-1/2 left-0 w-full h-[1px] bg-[#E8913C] shadow-[0_0_15px_rgba(232,145,60,0.8)] z-10"
          />
        </div>

        {/* Top Edge Metadata Pins */}
        <div ref={metaRef} className="relative z-20 flex justify-between items-center text-sm font-mono text-[#C8C8C8] uppercase tracking-widest border-b border-white/20 pb-4">
          <div>// OPERATIONAL INCIDENT RESPONSE ENGINE</div>
          <div className="hidden md:block">AI SRE SYSTEM // ACTIVE</div>
        </div>

        {/* Split Typography Center Stage */}
        <div className="relative z-20 flex-1 flex flex-col justify-center items-center pointer-events-none">
          <h1 className="font-display text-5xl md:text-8xl lg:text-9xl font-black text-[#FFFFFF] tracking-tighter leading-[0.9] flex flex-col items-center">
            <span ref={titleLeftRef} className="inline-block whitespace-nowrap">INCIDENTS</span>
            <span ref={titleRightRef} className="inline-block whitespace-nowrap text-[#E8913C]">DON'T WAIT.</span>
          </h1>
        </div>

        {/* Bottom Hero Narrative & CTAs */}
        <div className="relative z-20 grid grid-cols-1 md:grid-cols-12 gap-8 items-end border-t border-white/20 pt-8 mt-auto bg-[#050505]/60 backdrop-blur-md p-6 rounded-md">
          <div className="md:col-span-7 space-y-3">
            <div className="label-caps text-[#C8C8C8]">// TRIAGE & RESPONSE</div>
            <p className="prose-editorial text-lg md:text-xl text-[#F1F1F1] font-sans font-normal leading-relaxed">
              AI-assisted incident triage grounded in operational runbooks, controlled actions and a complete audit trail.
            </p>
          </div>

          <div className="md:col-span-5 flex flex-col sm:flex-row md:justify-end gap-4">
            <button
              onClick={() => scrollToSection('simulator')}
              className="btn-sre-dark-outline bg-[#FFFFFF] text-[#050505] hover:bg-transparent hover:text-[#FFFFFF] py-4 px-8 text-sm md:text-base whitespace-nowrap"
            >
              <Play className="w-5 h-5 fill-current mr-2" /> RUN A SIMULATION
            </button>
            <button
              onClick={() => scrollToSection('workflow')}
              className="btn-sre-dark-outline py-4 px-8 text-sm md:text-base whitespace-nowrap"
            >
              EXPLORE SYSTEM <ArrowDown className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
