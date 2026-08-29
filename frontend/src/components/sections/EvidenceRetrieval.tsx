import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Cpu, AlertCircle, Sparkles, Database, Tag } from 'lucide-react';
import { api } from '../../services/api';
import { RagResultItem } from '../../types';

import imgRack from '../../assets/images/2_rack_leds.jpg';
import imgEngineer from '../../assets/images/4_engineer.jpg';
import imgHardware from '../../assets/images/6_hardware.jpg';
import imgTeam from '../../assets/images/8_team.jpg';
import imgCables from '../../assets/images/3_cables.jpg';
import imgSwitch from '../../assets/images/7_switch.jpg';

gsap.registerPlugin(ScrollTrigger);

const PRESET_QUERIES = [
  'payment api timeout',
  'database pool exhaustion',
  'coredns latency spike',
  'redis cache memory eviction',
  'gateway 504 bad gateway',
];

const GALLERY_IMAGES = [imgRack, imgEngineer, imgHardware, imgTeam, imgCables, imgSwitch];

export const EvidenceRetrieval: React.FC = () => {
  const [query, setQuery] = useState('payment api timeout');
  const [topK, setTopK] = useState(5);
  const [results, setResults] = useState<RagResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Safe tag parser supporting arrays, comma-delimited strings, and null/undefined
  const parseTags = (tags: any): string[] => {
    if (Array.isArray(tags)) {
      return tags.map((t) => String(t).trim()).filter(Boolean);
    }
    if (typeof tags === 'string') {
      return tags.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return [];
  };

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const searchQuery = customQuery !== undefined ? customQuery : query;
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await api.retrieve(searchQuery, topK);
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
    <section id="evidence" ref={containerRef} className="relative w-full bg-[#FFFFFF] text-[#050505] py-20 border-b border-[#E5E5E5] overflow-hidden">
      <div className="w-full px-6 md:px-12 lg:px-24 space-y-8 mb-12 relative z-10">
        
        {/* Section Header */}
        <div className="border-b border-[#E5E5E5] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="label-caps text-[#737373] mb-2 font-mono text-xs">// CHROMADB SEMANTIC VECTOR SEARCH</div>
            <h2 className="font-display text-4xl md:text-6xl font-black text-[#050505] tracking-tight">
              EVIDENCE GALLERY
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-[#050505] bg-[#FAFAFA] px-4 py-2.5 border border-[#E5E5E5] uppercase tracking-wider font-bold">
            <Database className="w-4 h-4" />
            <span>35 DOCUMENTS INDEXED // ALL-MINILM-L6-V2</span>
          </div>
        </div>

        {/* Preset Query Tags */}
        <div className="flex items-center flex-wrap gap-2 pt-2">
          <span className="font-mono text-xs text-[#737373] uppercase mr-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> PRESETS:
          </span>
          {PRESET_QUERIES.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setQuery(preset);
                handleSearch(undefined, preset);
              }}
              className={`font-mono text-xs px-3 py-1.5 border transition-colors ${
                query === preset
                  ? 'bg-[#050505] text-[#FFFFFF] border-[#050505] font-bold'
                  : 'bg-[#FAFAFA] text-[#525252] border-[#E5E5E5] hover:border-[#050505] hover:text-[#050505]'
              }`}
            >
              "{preset}"
            </button>
          ))}
        </div>

        {/* Search Field */}
        <form onSubmit={handleSearch} className="bg-[#FAFAFA] border border-[#E5E5E5] p-6 relative">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#050505]" />
          <div className="flex flex-col md:flex-row gap-4 pl-4">
            <div className="flex-1 relative">
              <label htmlFor="rag-search-input" className="sr-only">Describe an incident symptom</label>
              <Search className="w-5 h-5 text-[#737373] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="rag-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe an incident symptom..."
                className="w-full bg-[#FFFFFF] border border-[#E5E5E5] pl-12 pr-4 py-4 font-mono text-sm text-[#050505] focus:border-[#050505] outline-none transition-colors"
              />
            </div>
            
            {/* Top-K Range Slider */}
            <div className="w-full md:w-60 flex items-center gap-4 bg-[#FFFFFF] px-4 py-2 border border-[#E5E5E5]">
              <span className="text-xs font-mono text-[#737373] whitespace-nowrap font-bold">TOP K: {topK}</span>
              <input
                type="range"
                min="1"
                max="10"
                value={topK}
                onChange={(e) => setTopK(parseInt(e.target.value, 10))}
                className="w-full accent-[#050505] cursor-pointer"
              />
            </div>

            {/* Search Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading} 
              className="btn-sre-mono py-4 px-8 font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2.5"
            >
              {isLoading ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin text-[#000000]" />
                  <span>SEARCHING...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-[#000000]" />
                  <span>RETRIEVE EVIDENCE</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Display (Strict Monochrome) */}
        {error && (
          <div className="p-4 border border-[#050505] bg-[#050505] text-[#FFFFFF] font-mono text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#FFFFFF]" />
            <span>[RETRIEVAL ERROR] {error}</span>
          </div>
        )}
      </div>

      {/* Horizontal Pinned Cards Rail */}
      <div className="overflow-hidden w-full relative z-10 pb-8">
        <div ref={galleryRef} className="flex gap-8 px-6 md:px-12 lg:px-24 w-max">
          {results.length === 0 && !isLoading && (
            <div className="w-[80vw] max-w-2xl bg-[#FAFAFA] border border-[#E5E5E5] p-12 text-center font-mono text-sm text-[#737373]">
              NO RUNBOOKS OR INCIDENTS MATCHED FOR THE GIVEN QUERY.
            </div>
          )}

          {results.map((doc, idx) => {
            const docType = doc.document_type || doc.kind || (doc.id.startsWith('RB') ? 'runbook' : 'incident');
            const isTop = idx === 0;
            const imgSrc = GALLERY_IMAGES[idx % GALLERY_IMAGES.length];
            const tags = parseTags(doc.tags);

            return (
              <div
                key={doc.id}
                className={`w-[85vw] md:w-[60vw] lg:w-[50vw] min-w-[280px] sm:min-w-[360px] md:min-w-[440px] lg:min-w-[480px] max-w-[90vw] flex-shrink-0 flex flex-col md:flex-row relative overflow-hidden transition-all bg-[#FFFFFF] ${
                  isTop ? 'border-2 border-[#050505] shadow-xl' : 'border border-[#E5E5E5]'
                }`}
              >
                {/* Image Half */}
                <div className="w-full md:w-2/5 h-48 md:h-auto bg-[#050505] overflow-hidden border-b md:border-b-0 md:border-r border-[#E5E5E5] relative">
                  <img 
                    src={imgSrc} 
                    alt="Infrastructure" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-3 left-3 bg-[#050505]/90 text-[#FFFFFF] px-2 py-1 font-mono text-[10px] uppercase tracking-widest border border-white/20">
                    MATCH #{idx + 1}
                  </div>
                </div>

                {/* Content Half */}
                <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    
                    {/* Card Header: Type Badge & Match Score */}
                    <div className="flex justify-between items-center border-b border-[#E5E5E5] pb-3 font-mono text-xs">
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 font-bold uppercase tracking-wider ${
                          isTop ? 'bg-[#050505] text-[#FFFFFF]' : 'bg-[#FAFAFA] text-[#050505] border border-[#E5E5E5]'
                        }`}>
                          [{docType}]
                        </span>
                        <span className="text-[#737373] font-bold">{doc.id}</span>
                      </div>
                      <span className={`font-bold font-mono text-sm ${isTop ? 'text-[#050505]' : 'text-[#737373]'}`}>
                        {((Number(doc.score) || 0) * 100).toFixed(1)}% MATCH
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-xl lg:text-2xl font-black text-[#050505] leading-tight tracking-tight">
                      {doc.title}
                    </h3>
                    
                    {/* Snippet */}
                    <p className="font-mono text-xs leading-relaxed text-[#525252] line-clamp-4 bg-[#FAFAFA] p-3 border border-[#E5E5E5]">
                      {doc.text}
                    </p>

                    {/* Tags List */}
                    {tags.length > 0 && (
                      <div className="flex items-center flex-wrap gap-1.5 pt-1">
                        <Tag className="w-3 h-3 text-[#A3A3A3] mr-1" />
                        {tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="font-mono text-[10px] px-2 py-0.5 bg-[#FFFFFF] border border-[#E5E5E5] text-[#525252] uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Tech Overlay Footer */}
                  <div className="mt-6 pt-3 border-t border-[#E5E5E5] font-mono text-[11px] text-[#A3A3A3] uppercase flex justify-between items-center">
                    <span>VEC_ID: {doc.id.substring(0, 8)} // SIM_IDX: {((Number(doc.score) || 0) * 100).toFixed(2)}%</span>
                    <span className="text-[#050505] font-bold">RAG_RETRIEVED</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
