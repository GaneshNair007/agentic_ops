import React, { useState, useEffect } from 'react';
import { Search, FileText, BookOpen, Cpu } from 'lucide-react';
import { api } from '../../services/api';
import { RagResultItem } from '../../types';

export const EvidenceRetrieval: React.FC = () => {
  const [query, setQuery] = useState('payment api timeout');
  const [topK, setTopK] = useState(5);
  const [results, setResults] = useState<RagResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <section id="evidence" className="w-full min-h-screen bg-[#F3F1EC] text-[#090909] py-24 px-6 md:px-12 border-b border-[#D8D6D0]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-[#D8D6D0] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="label-caps text-[#686868]">// SEMANTIC KNOWLEDGE BASE</div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-[#090909] mt-2">
              EVIDENCE RETRIEVAL ARCHIVE
            </h2>
          </div>
          <div className="text-xs font-mono text-[#686868]">
            35 INDEXED DOCUMENTS // CHROMADB & ALL-MINILM-L6-V2
          </div>
        </div>

        {/* Large Search Field */}
        <form onSubmit={handleSearch} className="bg-[#FFFFFF] border border-[#D8D6D0] p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-[#686868] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe an incident symptom (e.g. payment api timeout)..."
                className="w-full bg-[#F3F1EC] border border-[#D8D6D0] pl-12 pr-4 py-4 font-mono text-sm text-[#090909] focus:border-[#090909] outline-none"
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
                className="w-full accent-[#090909]"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-sre-mono py-4 px-8"
            >
              {isLoading ? <Cpu className="w-4 h-4 animate-spin" /> : 'RETRIEVE EVIDENCE'}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 border border-[#090909] bg-[#090909] text-[#F3F1EC] text-xs font-mono">
            [RETRIEVAL ERROR] {error}
          </div>
        )}

        {/* Vertical Editorial Results Archive */}
        <div className="space-y-6">
          {results.map((doc, idx) => {
            const isTopResult = idx === 0;
            const docType = doc.document_type || doc.kind || (doc.id.startsWith('RB') ? 'runbook' : 'incident');

            if (isTopResult) {
              // Top Result Expands into Full-Width Black Feature Panel
              return (
                <div key={doc.id} className="bg-[#090909] text-[#F3F1EC] border border-[#090909] p-8 md:p-12 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F3F1EC]/20 pb-4 font-mono text-xs">
                    <div className="flex items-center gap-3">
                      <span className="bg-[#F3F1EC] text-[#090909] font-bold px-2 py-0.5 uppercase">
                        TOP EVIDENCE MATCH
                      </span>
                      <span className="text-[#D8D6D0] uppercase">[{docType}]</span>
                      <span className="text-[#686868]">{doc.id}</span>
                    </div>
                    <div className="font-bold">RELEVANCE SCORE: {doc.score.toFixed(4)}</div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-8 space-y-4">
                      <h3 className="font-display text-2xl md:text-4xl text-[#F3F1EC]">{doc.title}</h3>
                      <p className="font-mono text-xs leading-relaxed text-[#D8D6D0] bg-[#141414] p-6 border border-[#F3F1EC]/15">
                        {doc.text}
                      </p>
                    </div>
                    <div className="lg:col-span-4 aspect-[4/3] bg-[#141414] border border-[#F3F1EC]/20 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=85"
                        alt="Infrastructure Evidence"
                        className="w-full h-full object-cover grayscale contrast-125"
                      />
                    </div>
                  </div>
                </div>
              );
            }

            // Standard Editorial Result Card
            return (
              <div key={doc.id} className="bg-[#FFFFFF] border border-[#D8D6D0] p-6 space-y-3 hover:border-[#090909] transition-all">
                <div className="flex justify-between items-center border-b border-[#D8D6D0] pb-3 font-mono text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold uppercase text-[#090909]">[{docType}]</span>
                    <span className="text-[#686868]">{doc.id}</span>
                  </div>
                  <div className="font-bold text-[#090909]">SCORE: {doc.score.toFixed(4)}</div>
                </div>
                <h4 className="font-display text-lg text-[#090909]">{doc.title}</h4>
                <p className="font-mono text-xs text-[#303030] leading-relaxed bg-[#F3F1EC] p-4 border border-[#D8D6D0]">
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
