import React, { useState } from 'react';

const MARQUEE_ITEMS = [
  "P1 // PAYMENT-API // HTTP 504 GATEWAY TIMEOUT",
  "EVIDENCE RETRIEVED // RB-004_API_GATEWAY_504_TIMEOUTS",
  "CONTROLLED ACTION // RESTART_SERVICE (PAYMENT-API)",
  "AUDIT LOGGED // TOOLS/AUDIT.LOG APPENDED",
  "CHROMADB VECTOR STORE // 35 DOCUMENTS INDEXED",
  "EMBEDDINGS // SENTENCE-TRANSFORMERS ALL-MINILM-L6-V2"
];

export const IncidentMarquee: React.FC = () => {
  const [hoverImage, setHoverImage] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      className="relative w-full h-24 bg-[#050505] text-[#FFFFFF] border-y border-white/20 overflow-hidden flex items-center select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverImage(null)}
    >
      {/* Continuous Marquee Rail */}
      <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] font-mono text-xs md:text-sm tracking-widest uppercase">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
          <span
            key={idx}
            onMouseEnter={() => setHoverImage("https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80")}
            className="mx-8 hover:text-[#C7C7C7] transition-colors cursor-pointer border-b border-transparent hover:border-white"
          >
            {item}
          </span>
        ))}
      </div>

      {/* Cursor-Following Hover Monochrome Image Reveal */}
      {hoverImage && (
        <div
          className="fixed pointer-events-none z-50 w-48 h-32 border border-white bg-[#050505] overflow-hidden shadow-2xl transition-transform duration-100 ease-out"
          style={{
            left: `${cursorPos.x + 20}px`,
            top: `${cursorPos.y - 60}px`,
          }}
        >
          <img
            src={hoverImage}
            alt="Infrastructure Reveal"
            className="w-full h-full object-cover grayscale contrast-125"
          />
        </div>
      )}
    </div>
  );
};
