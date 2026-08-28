import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Cpu } from 'lucide-react';
import { api } from '../../services/api';
import { RagResultItem } from '../../types';

gsap.registerPlugin(ScrollTrigger);

export const EvidenceRetrieval: React.FC = () => {
  const [query, setQuery] = useState('payment api timeout');
  const [topK, setTopK] = useState(5);
  const [results, setResults] = useState<RagResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await api.retrieve(query, topK);
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message || 'Retrieval failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  // GSAP Horizontal Scroll Pin for Evidence Gallery on Desktop
  useEffect(() => {
    if (!results.length) return;
    const ctx = gsap.context(() => {
      if (!containerRef.current || !galleryRef.current) return;

      const totalWidth = galleryRef.current.scrollWidth - window.innerWidth + 100;
      if (totalWidth <= 0) return;

      gsap.to(galleryRef.current, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [results]);

  return (
    <section id="evidence" ref={containerRef} className="relative w-full bg-[#050505] text-[#F1F1F1] py-24 border-t border-[#333] overflow-hidden">
      {/* Background Subtle Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      
      <div className="w-full px-6 md:px-12 lg:px-24 space-y-12 mb-16 relative z-10">
        {/* Header */}
        <div className="border-b border-[#333] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="label-caps text-[#8E8E8E] mb-2">// CHROMADB SEMANTIC VECTOR SEARCH</div>
            <h2 className="font-display text-5xl md:text-7xl font-extrabold text-[#FFFFFF]">
              EVIDENCE GALLERY
            </h2>
          </div>
          <div className="text-sm font-mono text-[#8E8E8E] bg-[#111] px-4 py-2 border border-[#333]">
            35 DOCUMENTS INDEXED // ALL-MINILM-L6-V2
          </div>
        </div>

        {/* Search Field */}
        <form onSubmit={handleSearch} className="bg-[#0A0A0A] border-2 border-[#333] p-6 relative">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#E8913C]" />
          <div className="flex flex-col md:flex-row gap-6 pl-4">
            <div className="flex-1 relative">
              <label htmlFor="rag-search-input" className="sr-only">Describe an incident symptom</label>
              <Search className="w-6 h-6 text-[#E8913C] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="rag-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe an incident symptom..."
                className="w-full bg-[#111] border border-[#333] pl-14 pr-4 py-5 font-mono text-base text-[#FFFFFF] focus:border-[#E8913C] outline-none transition-colors"
              />
            </div>
            <div className="w-full md:w-64 flex items-center gap-4 bg-[#111] px-4 border border-[#333]">
              <span className="text-sm font-mono text-[#8E8E8E] whitespace-nowrap">TOP K: {topK}</span>
              <input
                type="range"
                min="1"
                max="10"
                value={topK}
                onChange={(e) => setTopK(parseInt(e.target.value, 10))}
                className="w-full accent-[#E8913C]"
              />
            </div>
            <button type="submit" disabled={isLoading} className="bg-[#E8913C] hover:bg-[#F1F1F1] text-[#050505] font-mono font-bold uppercase tracking-widest py-5 px-10 transition-colors flex items-center justify-center gap-3">
              {isLoading ? <Cpu className="w-5 h-5 animate-spin" /> : 'RETRIEVE EVIDENCE'}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 border border-[#FF3333] bg-[#220000] text-[#FF3333] font-mono text-sm">
            [RETRIEVAL ERROR] {error}
          </div>
        )}
      </div>

      {/* Horizontal Pinned Cards Rail */}
      <div className="overflow-hidden w-full relative z-10 pb-12">
        <div ref={galleryRef} className="flex gap-12 px-6 md:px-12 lg:px-24 w-max">
          {results.map((doc, idx) => {
            const docType = doc.document_type || doc.kind || (doc.id.startsWith('RB') ? 'runbook' : 'incident');
            const isTop = idx === 0;

            return (
              <div
                key={doc.id}
                className={`w-[85vw] md:w-[60vw] lg:w-[45vw] min-w-[500px] flex-shrink-0 p-10 space-y-8 relative overflow-hidden transition-all ${
                  isTop
                    ? 'bg-[#111] border-2 border-[#E8913C] shadow-[0_0_30px_rgba(232,145,60,0.1)]'
                    : 'bg-[#0A0A0A] border-2 border-[#333] hover:border-[#8E8E8E]'
                }`}
              >
                {/* Tech overlay details */}
                <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-[#4A4A4A] select-none text-right">
                  <div className="border-b border-[#333] pb-1">VEC_ID: {doc.id.substring(0, 8)}</div>
                  <div className="pt-1">SIM_IDX: {(doc.score * 100).toFixed(2)}%</div>
                </div>

                <div className="flex justify-between items-center border-b border-[#333] pb-6 font-mono text-sm">
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 font-bold uppercase tracking-widest ${
                      isTop ? 'bg-[#E8913C] text-[#050505]' : 'bg-[#333] text-[#F1F1F1]'
                    }`}>
                      [{docType}]
                    </span>
                    <span className="text-[#8E8E8E] font-bold">{doc.id}</span>
                  </div>
                  <span className={`font-bold text-lg ${isTop ? 'text-[#E8913C]' : 'text-[#8E8E8E]'}`}>
                    {(doc.score * 100).toFixed(1)}% MATCH
                  </span>
                </div>

                <h3 className="font-display text-4xl lg:text-5xl font-extrabold text-[#FFFFFF] leading-tight">
                  {doc.title}
                </h3>
                
                <div className="relative">
                  {/* Decorative corner brackets for the abstract box */}
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#666]" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#666]" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#666]" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#666]" />
                  
                  <p className={`font-mono text-base leading-relaxed p-6 ${
                    isTop ? 'bg-[#1A110A] text-[#F1F1F1]' : 'bg-[#111] text-[#C8C8C8]'
                  }`}>
                    {doc.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
