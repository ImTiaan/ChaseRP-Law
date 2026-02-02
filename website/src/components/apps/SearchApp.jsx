import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, FileText, ArrowRight } from 'lucide-react';
import Fuse from 'fuse.js';
import contentData from '../../data/content.json';

export default function SearchApp({ onOpenDoc }) {
  const [query, setQuery] = useState('');

  const fuse = useMemo(() => new Fuse(contentData, {
    keys: ['title', 'content'],
    threshold: 0.3,
    includeScore: true,
    ignoreLocation: true,
  }), []);

  const results = useMemo(() => {
    if (!query) return [];
    return fuse.search(query).map(result => result.item);
  }, [query, fuse]);

  return (
    <div className="flex flex-col h-full bg-black/20">
      {/* Search Header */}
      <div className="p-8 pb-4">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-lg"
            placeholder="Search statutes, codes, definitions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-y-auto p-8 pt-0 custom-scrollbar">
        <div className="max-w-2xl mx-auto space-y-4">
          {!query && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                <SearchIcon className="h-8 w-8 text-white/20" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Search the Database</h3>
              <p className="text-gray-500">Find specific laws, codes, and legal definitions instantly.</p>
            </div>
          )}

          {query && results.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500">No results found for "{query}"</p>
            </div>
          )}

          {results.map((item) => (
            <button
              key={item.id}
              onClick={() => onOpenDoc(item.id)}
              className="w-full text-left p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>
                <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-emerald-400 transform group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-sm text-gray-400 line-clamp-2">
                {item.content.substring(0, 200)}...
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="px-2 py-1 rounded text-xs font-medium bg-black/30 text-gray-400 border border-white/5">
                  Document
                </span>
                <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Match found
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
