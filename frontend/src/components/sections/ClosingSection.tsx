import React from 'react';
import { Power, Terminal, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ganeshImg from '../../assets/images/ganesh.png';
import arjitImg from '../../assets/images/arjit.png';

const TEAM = [
  {
    name: 'Ganesh Nair',
    role: 'Lead System Architect',
    image: ganeshImg,
    description: 'Specializes in high-availability distributed systems and deterministic AI guardrails.',
  },
  {
    name: 'Arjit Ujjawal',
    role: 'Core AI Engineer',
    image: arjitImg,
    description: 'Expert in vector memory architectures, autonomous remediation, and LLM safety.',
  }
];

export const ClosingSection: React.FC = () => {
  const scrollToSimulator = () => {
    const el = document.getElementById('simulator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full bg-[#000000] text-[#FFFFFF] flex flex-col pt-24 md:pt-32 overflow-hidden border-b border-[#262626]">
      {/* Top Typography & Mission Showcase */}
      <div className="relative z-10 container-full flex flex-col items-center text-center space-y-10 max-w-6xl mx-auto mb-24">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold tracking-[0.35em] uppercase text-[#A3A3A3] bg-[#0A0A0A] border border-[#262626] px-4 py-1.5 inline-flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#FFFFFF]" />
            // PALOMINO OPERATIONS READY
          </span>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[108px] font-black leading-[0.88] tracking-tighter text-[#FFFFFF] uppercase">
            EVIDENCE. CONTROL.<br />
            <span className="text-[#FFFFFF]">ACCOUNTABILITY.</span>
          </h2>
          <p className="font-sans text-base md:text-xl text-[#A3A3A3] max-w-2xl mx-auto font-normal leading-relaxed pt-2">
            Grounded in vector memory, bounded by deterministic safety policies, and committed to immutable audit logs.
          </p>
        </div>

        {/* Massive High-Contrast CTA */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={scrollToSimulator}
            className="btn-sre-mono py-5 px-10 md:px-14 text-sm md:text-base font-bold font-mono uppercase tracking-[0.2em] group flex items-center justify-center gap-3"
          >
            <Power className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span>RUN A SIMULATION</span>
          </button>
        </div>
      </div>

      {/* Cinematic Framer Motion Leadership Section */}
      <div className="w-full relative bg-[#050505] border-t border-[#262626]">
        <div className="container-full py-24 md:py-32 flex flex-col items-center">
          
          <div className="mb-16 md:mb-24 flex flex-col items-start border-b border-[#262626] pb-8">
            <span className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-[#A3A3A3] mb-4">
              // ENGINEERING LEADERSHIP
            </span>
          </div>

          {/* THE ARCHITECTS Section */}
          <div className="w-full max-w-5xl mb-24">
            <div className="flex items-center justify-between border-b border-[#262626] pb-4 mb-12">
              <span className="font-mono text-[#737373] text-xs uppercase tracking-widest font-bold">// THE ARCHITECTS</span>
              <span className="font-mono text-[#555555] text-xs uppercase tracking-widest">CORE ENGINEERING TEAM</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
              {TEAM.map((member, idx) => (
                <motion.div 
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: idx * 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex flex-col border border-[#262626] bg-[#000000] p-6 md:p-8 hover:border-[#FFFFFF] transition-colors"
                >
                  {/* Strict Monochrome 0px-Radius Image Container */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#0A0A0A] border border-[#262626] mb-6">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover object-center grayscale contrast-125 brightness-90 transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Monochrome tech overlay corner */}
                    <div className="absolute bottom-3 right-3 bg-[#000000]/90 text-[#FFFFFF] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest border border-[#333333]">
                      ID: {member.name.substring(0, 3).toUpperCase()}_0{idx + 1}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <h4 className="font-display text-3xl md:text-4xl font-black text-[#FFFFFF] tracking-tight uppercase">{member.name}</h4>
                    <p className="font-mono text-[#A3A3A3] text-xs uppercase tracking-widest">{member.role}</p>
                    <p className="font-sans text-[#737373] text-sm leading-relaxed pt-2">
                      {member.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Mission Conclusion Banner */}
          <div className="w-full max-w-4xl text-center space-y-6 pt-8 border-t border-[#262626]">
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-[#FFFFFF] tracking-tighter leading-[0.92] uppercase">
              THE FUTURE IS <span className="text-[#A3A3A3]">DETERMINISTIC.</span>
            </h2>
            <p className="font-sans text-[#888888] max-w-xl text-center mx-auto text-base md:text-lg leading-relaxed">
              No more hunting through fragmented logs at 3 AM. Complete incident accountability powered by dense vectors and immutable audit trails.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={scrollToSimulator}
                className="btn-sre-mono py-4 px-8 text-xs font-bold tracking-widest uppercase group w-full sm:w-auto text-center justify-center"
              >
                DEPLOY ENGINE
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Massive Edge-to-Edge Footer Wordmark */}
      <div className="w-full bg-[#000000] pt-12 pb-4 overflow-hidden relative select-none">
        <h2 className="font-display text-[15vw] leading-[0.75] font-black tracking-tighter text-[#1A1A1A] whitespace-nowrap text-center translate-y-4">
          AI SRE // ENGINE
        </h2>
      </div>

      {/* 1px Structural Footer Grid */}
      <footer className="w-full bg-[#000000] border-t border-[#262626] z-10">
        <div className="container-full py-12 grid grid-cols-1 md:grid-cols-4 gap-8 font-mono text-xs text-[#888888]">
          <div className="space-y-3 border-b md:border-b-0 md:border-r border-[#262626] pb-8 md:pb-0 md:pr-8">
            <div className="font-bold text-[#FFFFFF] tracking-widest uppercase text-sm">
              AI SRE // ENGINE
            </div>
            <div className="text-[11px] text-[#555555]">
              V2.0.0 MONOCHROME ARCHITECTURE
            </div>
            <p className="text-[11px] text-[#737373] pt-2 leading-relaxed">
              Autonomous incident triage and remediation engine for cloud infrastructure.
            </p>
          </div>

          <div className="space-y-3 border-b md:border-b-0 md:border-r border-[#262626] pb-8 md:pb-0 md:pr-8">
            <div className="font-bold text-[#FFFFFF] tracking-wider uppercase text-[11px]">
              CORE SUBSYSTEMS
            </div>
            <div className="text-[11px] space-y-2 text-[#A3A3A3]">
              <div>· FASTAPI ASYNC ENGINE</div>
              <div>· CHROMADB VECTOR RETRIEVER</div>
              <div>· DETERMINISTIC ACTION GUARD</div>
              <div>· DISK-BACKED AUDIT SINK</div>
            </div>
          </div>

          <div className="space-y-3 border-b md:border-b-0 md:border-r border-[#262626] pb-8 md:pb-0 md:pr-8">
            <div className="font-bold text-[#FFFFFF] tracking-wider uppercase text-[11px]">
              TELEMETRY GATES
            </div>
            <div className="text-[11px] space-y-2 text-[#A3A3A3]">
              <div>· P1 MTTR GOAL: &lt; 1.8 SECONDS</div>
              <div>· REPLAYABILITY: 100% IMMUTABLE</div>
              <div>· SAFETY MATRIX: 8 PROTOCOLS</div>
              <div>· SLA TARGET: 99.99%</div>
            </div>
          </div>

          <div className="space-y-4 flex flex-col justify-between pt-2 md:pt-0">
            <div>
              <div className="font-bold text-[#FFFFFF] tracking-wider uppercase text-[11px] mb-3">
                SOURCE &amp; REPO
              </div>
              <a 
                href="https://github.com/GaneshNair007/agentic_ops" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#FFFFFF] hover:text-[#A3A3A3] font-bold text-xs uppercase tracking-wider transition-colors border border-[#262626] hover:border-[#FFFFFF] p-3 bg-[#0A0A0A] w-full justify-between"
              >
                <span>GITHUB REPOSITORY</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
            <div className="text-[10px] text-[#555555] tracking-widest uppercase">
              © 2026 AI SRE DEFENSE ENGINE
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};

