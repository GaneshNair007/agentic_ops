import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, ShieldAlert, Terminal } from 'lucide-react';
import heroImg from '../../assets/images/1_corridor.jpg';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  
  const panelLeftRef = useRef<HTMLDivElement>(null);
  const panelRightRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const wordLeftRef = useRef<HTMLSpanElement>(null);
  const wordCenterRef = useRef<HTMLSpanElement>(null);
  const wordRightRef = useRef<HTMLSpanElement>(null);
  
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Refresh ScrollTrigger when hero image is completely loaded
    const img = imageRef.current;
    const handleImgLoad = () => ScrollTrigger.refresh();
    if (img && !img.complete) {
      img.addEventListener('load', handleImgLoad, { once: true });
    }

    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: '(min-width: 1024px)',
      isTablet: '(min-width: 768px) and (max-width: 1023px)',
      isMobile: '(max-width: 767px)',
    }, (context) => {
      if (!containerRef.current) return;
      const { isDesktop, isTablet } = context.conditions as { isDesktop: boolean; isTablet: boolean; isMobile: boolean };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // Smooth, reversible scrubbing
          invalidateOnRefresh: true,
        }
      });

      // 1. Portal Doors Opening smoothly with zero seams (with GPU acceleration)
      tl.to(panelLeftRef.current, { xPercent: -101, ease: 'power2.inOut', force3D: true }, 0);
      tl.to(panelRightRef.current, { xPercent: 101, ease: 'power2.inOut', force3D: true }, 0);

      // 2. Background image settling from cinematic zoom to standard framing
      tl.fromTo(imageRef.current, 
        { scale: 1.25, filter: 'contrast(1.1) brightness(0.7)', force3D: true },
        { scale: 1.0, filter: 'contrast(1.25) brightness(0.95)', ease: 'power2.out', force3D: true },
        0
      );

      // 3. Responsive Wordmark splitting & scaling
      const splitX = isDesktop ? '12vw' : isTablet ? '8vw' : '4.5vw';
      const wordScale = isDesktop ? 1.25 : isTablet ? 1.18 : 1.10;
      const tracking = isDesktop ? '-0.04em' : isTablet ? '-0.02em' : '-0.01em';

      tl.to(wordmarkRef.current, {
        scale: wordScale,
        letterSpacing: tracking,
        ease: 'power2.inOut',
        force3D: true
      }, 0);
      
      tl.to(wordLeftRef.current, { x: `-${splitX}`, ease: 'power2.inOut', force3D: true }, 0);
      tl.to(wordRightRef.current, { x: splitX, ease: 'power2.inOut', force3D: true }, 0);
      tl.to(wordCenterRef.current, { opacity: 0.35, scale: 0.9, ease: 'power2.inOut', force3D: true }, 0);

      // 4. Subtitle and Action CTAs fade out gracefully on deeper scroll
      tl.to(contentRef.current, { opacity: 0, y: -35, ease: 'power2.in', force3D: true }, 0.2);
    });

    return () => {
      if (img) img.removeEventListener('load', handleImgLoad);
      mm.revert();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[250vh] bg-[#000000] text-[#FFFFFF] border-b border-[#E5E5E5]"
    >
      {/* Sticky Stage */}
      <div 
        ref={stickyRef} 
        className="sticky top-0 w-full h-screen overflow-hidden isolate flex flex-col justify-center items-center select-none"
      >
        
        {/* Background Full-Bleed Infrastructure Photography */}
        <div className="absolute inset-0 w-full h-full -z-20 overflow-hidden">
          <img
            ref={imageRef}
            src={heroImg}
            alt="Critical Infrastructure"
            className="w-full h-full object-cover object-center grayscale contrast-125 brightness-90 will-change-transform"
          />
          {/* Subtle monochrome dark overlay for readability */}
          <div className="absolute inset-0 bg-[#000000]/50" />
        </div>

        {/* Portal Doors (Opening Horizontally with slight overlap to prevent seam gaps) */}
        <div 
          ref={panelLeftRef} 
          className="absolute top-0 left-0 w-[50.5%] h-full bg-[#050505] -z-10 border-r border-[#262626] will-change-transform" 
        />
        <div 
          ref={panelRightRef} 
          className="absolute top-0 right-0 w-[50.5%] h-full bg-[#050505] -z-10 border-l border-[#262626] will-change-transform" 
        />

        {/* Content Container */}
        <div className="relative z-10 container-full w-full flex flex-col items-center text-center mt-12 md:mt-16">
          
          {/* Eyebrow Pill */}
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <span className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-[#A3A3A3] bg-[#0A0A0A] border border-[#262626] px-4 py-1.5 inline-flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[#FFFFFF]" />
              // OPERATIONAL INCIDENT RESPONSE ENGINE
            </span>
          </div>

          {/* Massive Wordmark (Single Line with Responsive Clamping & Splitting) */}
          <h1 
            ref={wordmarkRef}
            className="font-display text-[clamp(0.75rem,3.4vw,5.5rem)] font-black text-[#FFFFFF] tracking-tight leading-none uppercase flex items-center justify-center whitespace-nowrap mb-8 md:mb-12 origin-center max-w-full overflow-visible will-change-transform"
          >
            <span ref={wordLeftRef} className="inline-block break-keep will-change-transform">INFRASTRUCTURE</span>
            <span ref={wordCenterRef} className="inline-block text-[#737373] mx-[1vw] sm:mx-[1.5vw] text-[clamp(0.55rem,1.6vw,2.2rem)] translate-y-[-8%] transition-opacity will-change-transform">INTO</span>
            <span ref={wordRightRef} className="inline-block break-keep will-change-transform">ACCOUNTABILITY.</span>
          </h1>

          {/* Editorial Subtitle & CTAs (Fades on Scroll) */}
          <div ref={contentRef} className="w-full flex flex-col items-center will-change-transform">
            <p className="font-sans text-xs sm:text-sm md:text-base lg:text-lg text-[#D4D4D4] font-normal leading-relaxed max-w-2xl mx-auto mb-8 md:mb-10 px-4">
              <strong className="text-[#FFFFFF] font-bold">INCIDENTS DON'T WAIT.</strong> AI-assisted autonomous triage grounded in dense vector runbooks, deterministic safety boundaries, and an immutable forensic audit log.
            </p>

            {/* High-Contrast Action CTAs */}
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <button
                onClick={() => scrollToSection('simulator')}
                className="btn-sre-mono py-3.5 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 text-xs sm:text-sm font-bold tracking-widest uppercase group bg-[#FFFFFF] text-[#050505] hover:bg-[#E5E5E5]"
              >
                <Play className="w-4 h-4 mr-2 fill-current transition-transform group-hover:scale-110" />
                SIMULATE INCIDENT
              </button>

              <button
                onClick={() => scrollToSection('audit')}
                className="btn-sre-outline-mono py-3.5 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 text-xs sm:text-sm font-bold tracking-widest uppercase border border-[#333333] hover:border-[#FFFFFF] bg-[#0A0A0A]"
              >
                <ShieldAlert className="w-4 h-4 mr-2" />
                INSPECT AUDIT TRAIL
              </button>
            </div>
          </div>
        </div>

        {/* Top/Bottom Edge Metadata */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between font-mono text-[10px] text-[#555555] uppercase tracking-widest pointer-events-none z-10">
          <span>SRE-ALPHA-01</span>
          <span>CHROMADB // DENSE</span>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-4 flex justify-between font-mono text-[10px] text-[#555555] uppercase tracking-widest pointer-events-none z-10">
          <span>P1 MTTR &lt; 1.8S</span>
          <span>ZERO DRIFT LOGS</span>
        </div>

      </div>
    </section>
  );
};

