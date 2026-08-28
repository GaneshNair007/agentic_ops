import React, { useState, useEffect } from 'react';
import { Search, FileText, BookOpen, AlertTriangle, Cpu } from 'lucide-react';
import { api } from '../services/api';
import { RagResultItem } from '../types';

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
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="border-b border-[#EDE7DC]/13 pb-6">
        <div className="text-[12px] font-mono text-[#2E6B72] uppercase tracking-widest flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#2E6B72]" />
          SEMANTIC KNOWLEDGE RETRIEVAL (CHROMADB & ALL-MINILM-L6-V2)
        </div>
        <h2 className="font-display text-2xl md:text-3xl text-[#EDE7DC] mt-1">
          EVIDENCE RETRIEVAL ARCHIVE
        </h2>
        <p className="text-sm text-[#9EA5A8] mt-2">
          Recommendations are grounded in retrieved incident history and operational runbooks.
        </p>
      </div>

      {/* Query Bar */}
      <form onSubmit={handleSearch} className="bg-[#101317] border border-[#EDE7DC]/13 rounded p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-[#9EA5A8] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search historical incidents & operational runbooks..."
              className="w-full bg-[#0A0C0E] border border-[#EDE7DC]/13 rounded pl-11 pr-4 py-3 text-sm text-[#EDE7DC] font-mono focus:border-[#2E6B72] outline-none"
            />
          </div>
          <div className="w-full md:w-48 flex items-center gap-3">
            <span className="text-sm font-mono text-[#9EA5A8]">TOP K: {topK}</span>
            <input
              type="range"
              min="1"
              max="10"
              value={topK}
              onChange={(e) => setTopK(parseInt(e.target.value, 10))}
              className="w-full accent-[#2E6B72]"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-sre-outline btn-sre-teal px-6 py-3 text-sm flex items-center gap-2"
          >
            {isLoading ? <Cpu className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            RETRIEVE EVIDENCE
          </button>
        </div>
      </form>

      {/* Error Banner */}
      {error && (
        <div className="p-4 border border-[#E63946] bg-[#E63946]/10 text-[#E63946] rounded text-sm font-mono">
          [ERROR] {error}
        </div>
      )}

      {/* Stacked Physical Sleeve Cards */}
      <div className="space-y-4">
        {results.map((doc, idx) => {
          const docType = doc.document_type || doc.kind || (doc.id.startsWith('RB') ? 'runbook' : 'incident');
          const isTopResult = idx === 0;

          return (
            <div
              key={doc.id}
              className={`bg-[#101317] border rounded p-6 transition-all ${
                isTopResult
                  ? 'border-[#2E6B72] shadow-lg -translate-y-1'
                  : 'border-[#EDE7DC]/13 hover:border-[#EDE7DC]/30'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EDE7DC]/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono px-2 py-1 bg-[#0A0C0E] border border-[#EDE7DC]/10 rounded text-[#2E6B72] uppercase font-bold">
                    {docType}
                  </span>
                  <span className="text-sm font-mono text-[#9EA5A8]">{doc.id}</span>
                  {isTopResult && (
                    <span className="text-[12px] font-mono text-[#E8913C] border border-[#E8913C]/40 px-2 py-0.5 rounded uppercase">
                      TOP MATCH
                    </span>
                  )}
                </div>
                <div className="text-sm font-mono text-[#2E6B72] font-bold">
                  RELEVANCE SCORE: {doc.score.toFixed(4)}
                </div>
              </div>

              <h3 className="font-display text-lg text-[#EDE7DC] mt-4 mb-2">{doc.title}</h3>
              <p className="text-sm text-[#9EA5A8] font-mono leading-relaxed bg-[#0A0C0E] p-4 rounded border border-[#EDE7DC]/10">
                {doc.text}
              </p>

              {doc.tags && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {(Array.isArray(doc.tags) ? doc.tags : String(doc.tags).split(',')).map((tag) => (
                    <span key={tag} className="text-[12px] font-mono text-[#6C7378] bg-[#0A0C0E] px-2 py-1 rounded border border-[#EDE7DC]/10">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
