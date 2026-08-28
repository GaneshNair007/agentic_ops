import React from 'react';

export const ProblemStatement: React.FC = () => {
  return (
    <section className="w-full min-h-[80vh] bg-[#F3F1EC] text-[#090909] py-24 px-6 md:px-12 border-b border-[#D8D6D0] flex flex-col justify-center">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Editorial Statement */}
        <div className="lg:col-span-7 space-y-8">
          <div className="label-caps text-[#686868]">// SILENCE, THEN FAILURE</div>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#090909] leading-tight">
            WHEN AN INCIDENT BEGINS, THE HARDEST PROBLEM IS NOT RECEIVING ANOTHER ALERT.
          </h2>
          <p className="prose-editorial text-lg md:text-xl text-[#303030] font-sans">
            It is finding the right evidence and choosing a safe response under extreme time pressure.
          </p>
          <div className="pt-4 border-t border-[#D8D6D0] flex gap-8 text-xs font-mono text-[#686868] uppercase">
            <div>• CHROMADB DENSE SEARCH</div>
            <div>• PREDEFINED SAFETY BOUNDS</div>
            <div>• JSONL AUDIT TRAIL</div>
          </div>
        </div>

        {/* Right High-Contrast Monochrome Image */}
        <div className="lg:col-span-5 relative">
          <div className="aspect-[4/5] bg-[#090909] border border-[#D8D6D0] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=85"
              alt="Monochrome Network Cabling & Server Infrastructure"
              className="w-full h-full object-cover grayscale contrast-125 hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 bg-[#090909] text-[#F3F1EC] p-4 text-[11px] font-mono uppercase tracking-widest border border-[#D8D6D0]">
            FIG 01.1 // RACK WIRING & HARDWARE NODES
          </div>
        </div>
      </div>
    </section>
  );
};
