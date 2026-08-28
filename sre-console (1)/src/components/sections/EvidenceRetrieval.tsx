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
          scrub: 0.8,
          invalidateOnRefresh: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [results]);

  return (
    <section id="evidence" ref={containerRef} className="relative w-full bg-[#F5F3EE] text-[#202020] py-20 border-b border-[#D8D6D0]">
      <div className="w-full px-6 md:px-16 lg:px-24 space-y-8 mb-8">
        {/* Header */}
        <div className="border-b border-[#D8D6D0] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="label-caps text-[#686868]">// CHROMADB SEMANTIC VECTOR SEARCH</div>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold text-[#202020] mt-2">
              EVIDENCE ARCHIVE GALLERY
            </h2>
          </div>
          <div className="text-xs font-mono text-[#686868]">
            35 DOCUMENTS INDEXED // ALL-MINILM-L6-V2
          </div>
        </div>

        {/* Search Field */}
        <form onSubmit={handleSearch} className="bg-[#FFFFFF] border border-[#D8D6D0] p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <label htmlFor="rag-search-input" className="sr-only">Describe an incident symptom</label>
              <Search className="w-5 h-5 text-[#686868] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="rag-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe an incident symptom..."
                className="w-full bg-[#F5F3EE] border border-[#D8D6D0] pl-12 pr-4 py-4 font-mono text-sm text-[#202020] focus:border-[#050505] outline-none"
              />
            </div>
            <div className="w-full md:w-48 flex items-center gap-3">
              <span className="text-xs font-mono text-[#686868]">TOP K: {topK}</span>
              <input
                type="range"
                min="1"
                max="10"
                value={topK}
                onChange={(e) => setTopK(parseInt(e.target.value, 10))}
                className="w-full accent-[#050505]"
              />
            </div>
            <button type="submit" disabled={isLoading} className="btn-sre-mono py-4 px-8 text-sm">
              {isLoading ? <Cpu className="w-4 h-4 animate-spin" /> : 'RETRIEVE EVIDENCE'}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 border border-[#050505] bg-[#050505] text-[#F1F1F1] font-mono text-xs">
            [RETRIEVAL ERROR] {error}
          </div>
        )}
      </div>

      {/* Horizontal Pinned Cards Rail */}
      <div className="overflow-hidden w-full">
        <div ref={galleryRef} className="flex gap-8 px-6 md:px-16 lg:px-24 w-max">
          {results.map((doc, idx) => {
            const docType = doc.document_type || doc.kind || (doc.id.startsWith('RB') ? 'runbook' : 'incident');
            const isTop = idx === 0;

            return (
              <div
                key={doc.id}
                className={`w-[85vw] md:w-[60vw] lg:w-[50vw] flex-shrink-0 border p-8 space-y-6 transition-all ${
                  isTop
                    ? 'bg-[#050505] text-[#F1F1F1] border-[#050505] shadow-2xl'
                    : 'bg-[#FFFFFF] text-[#202020] border-[#D8D6D0]'
                }`}
              >
                <div className={`flex justify-between items-center border-b pb-4 font-mono text-xs ${
                  isTop ? 'border-white/20' : 'border-[#D8D6D0]'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 font-bold uppercase ${
                      isTop ? 'bg-[#FFFFFF] text-[#050505]' : 'bg-[#050505] text-[#F1F1F1]'
                    }`}>
                      [{docType}]
                    </span>
                    <span>{doc.id}</span>
                  </div>
                  <span className="font-bold">SCORE: {doc.score.toFixed(4)}</span>
                </div>

                <h3 className="font-display text-3xl font-extrabold">{doc.title}</h3>
                <p className={`font-mono text-xs leading-relaxed p-5 border ${
                  isTop ? 'bg-[#141414] text-[#C8C8C8] border-white/10' : 'bg-[#F5F3EE] text-[#4A4A4A] border-[#D8D6D0]'
                }`}>
                  {doc.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
