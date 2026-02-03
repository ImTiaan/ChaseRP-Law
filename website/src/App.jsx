import React, { useState, useEffect, useMemo } from 'react';
import { Analytics } from "@vercel/analytics/react";
import { Search, Menu, X, BookOpen, Scale, Shield, Radio, Gavel, FileText, Home, Briefcase } from 'lucide-react';
import Markdown from 'react-markdown';
import Fuse from 'fuse.js';
import DocViewer from './components/apps/DocViewer';
import contentData from './data/content.json';

// Icon mapping
const icons = {
  'home': Home,
  'Case_Laws': Scale,
  'Constitution': BookOpen,
  'Legal_Definitions': Gavel,
  'Notices': FileText,
  'Penal_code': Shield,
  'Radio_Codes': Radio,
  'Use_of_Force': Shield,
  'Court_Procedures': Briefcase,
};

// Explicit order for Home Page Buttons
const homeButtonsOrder = ['Constitution', 'Penal_code', 'Case_Laws', 'Legal_Definitions'];

// Explicit order for Sidebar
const sidebarOrder = [
  'Constitution',
  'Penal_code',
  'Case_Laws',
  'Legal_Definitions',
  'Court_Procedures',
  'Notices',
  'Radio_Codes',
  'Use_of_Force'
];

// IDs of documents that should be split into individual sections for search
const SPLITTABLE_IDS = ['Penal_code', 'Case_Laws', 'Legal_Definitions', 'Notices', 'Court_Procedures'];

// Helper to split content into sections
const processSearchScope = (data) => {
  return data.flatMap(item => {
    // If not in the splittable list, return as is (but ensure parentId/displaySection structure matches)
    if (!SPLITTABLE_IDS.includes(item.id)) {
      return [{
        ...item,
        parentId: item.id,
        displaySection: null // Will be calculated dynamically if needed
      }];
    }

    const sections = [];
    const lines = item.content.split('\n');
    let currentSection = {
      ...item,
      id: item.id, // Base ID for preamble
      parentId: item.id,
      // title: item.title, // Keep original title for preamble
      content: '',
      displaySection: null
    };
    
    // Flag to skip the main title if it's repeated in content (optional, but good for cleanliness)
    
    lines.forEach(line => {
      // Check for H2 headers (## Title)
      if (line.trim().startsWith('## ')) {
        // Push previous section if it has content
        if (currentSection.content.trim()) {
          sections.push(currentSection);
        }
        
        // Start new section
        const title = line.replace(/^##\s+/, '').trim();
        // Remove markdown formatting from title for display
        const cleanTitle = title.replace(/[*_`]/g, '');
        
        currentSection = {
          ...item, // Keep other metadata like filename
          id: `${item.id}#${cleanTitle}`, // Unique ID
          parentId: item.id,
          title: cleanTitle, // Set specific section title
          content: line + '\n',
          displaySection: cleanTitle
        };
      } else {
        currentSection.content += line + '\n';
      }
    });

    // Push the last section
    if (currentSection.content.trim()) {
      sections.push(currentSection);
    }

    return sections;
  });
};

// IDs that should use the full width layout
const WIDE_VIEW_IDS = ['Penal_code', 'Case_Laws', 'Notices', 'Legal_Definitions', 'Court_Procedures'];

function App() {
  const [activeId, setActiveId] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile toggle

  // Determine the scope of search based on active tab
  const searchScope = useMemo(() => {
    let baseData;
    if (activeId === 'home') {
      baseData = contentData;
    } else {
      baseData = contentData.filter(item => item.id === activeId);
    }
    
    return processSearchScope(baseData);
  }, [activeId]);

  // Fuse configuration for search
  const fuse = useMemo(() => new Fuse(searchScope, {
    keys: [
      { name: 'title', weight: 2 },
      { name: 'content', weight: 1 }
    ],
    threshold: 0.3,
    includeScore: true,
    includeMatches: true, // Enable matches for highlighting
    ignoreLocation: true,
  }), [searchScope]);

  // Process search results with snippets
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    
    return fuse.search(searchQuery).map(result => {
      const item = result.item;
      let snippet = item.content.slice(0, 200);
      let section = null;
      let start = 0;
      let end = 0;
      let snippetMatches = [];

      // 1. Try to find the exact query string (case-insensitive) first
      // This ensures we show the part the user actually typed
      const lowerContent = item.content.toLowerCase();
      const lowerQuery = searchQuery.toLowerCase().trim();
      const exactMatchIndex = lowerContent.indexOf(lowerQuery);

      if (exactMatchIndex !== -1) {
        start = exactMatchIndex;
        end = exactMatchIndex + lowerQuery.length;
      } else {
        // 2. Fallback to Fuse.js matches if exact match not found
        const contentMatch = result.matches?.find(m => m.key === 'content');
        if (contentMatch) {
          const bestIndex = contentMatch.indices[0];
          start = bestIndex[0];
          end = bestIndex[1];
        }
      }

      // If we found a relevant position (either exact or fuzzy)
      if (start > 0 || (exactMatchIndex !== -1)) {
         // Calculate snippet window (e.g., 60 chars before, 140 after)
         const snippetStart = Math.max(0, start - 60);
         const snippetEnd = Math.min(item.content.length, end + 140);
         
         let rawSnippet = item.content.slice(snippetStart, snippetEnd);
         
         // Clean up markdown syntax for display
         // 1. Remove headers (#), bold/italic (*, _), code (`), blockquotes (>) 
         rawSnippet = rawSnippet.replace(/[*#`_>]/g, '');
         // 2. Remove link URLs [text](url) -> text (simplified)
         // Note: partial links might remain, but this covers complete ones
         rawSnippet = rawSnippet.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
         // 3. Replace newlines and multiple spaces with single space
         rawSnippet = rawSnippet.replace(/\s+/g, ' ');

         snippet = (snippetStart > 0 ? '...' : '') + 
                   rawSnippet.trim() + 
                   (snippetEnd < item.content.length ? '...' : '');
 
         // Find nearest section header before the match
         const textBeforeMatch = item.content.slice(0, start);
         // Look for lines starting with #, ##, etc.
         const headerMatch = textBeforeMatch.match(/(?:^|\n)(#{1,6})\s+(.+)(?:\n|$)/g);
         if (headerMatch) {
           // Get the last header found
           const lastHeader = headerMatch[headerMatch.length - 1];
           // Clean it up (remove # and newlines)
           section = lastHeader.replace(/[\n#]/g, '').trim();
         }
      }

      // Get title matches from Fuse
      // Filter out single-character matches if the query is longer than 1 char to reduce noise
      let titleMatches = result.matches?.find(m => m.key === 'title')?.indices || [];
      if (searchQuery.length > 1) {
        titleMatches = titleMatches.filter(range => (range[1] - range[0] + 1) >= 1);
      }

      return {
        ...item,
        displaySnippet: snippet,
        // Use dynamically found section (e.g. ### subsection) or the item's inherent section (from splitting)
        displaySection: section || item.displaySection,
        titleMatches // Pass indices for title highlighting
      };
    });
  }, [searchQuery, fuse]);

  // Extract matching titles for card view filtering
  const matchingTitles = useMemo(() => {
    if (!searchQuery) return null;
    return searchResults.map(result => result.title);
  }, [searchQuery, searchResults]);

  const activeContent = useMemo(() => {
    // Handle split IDs from search results (e.g. "Penal_code#Section Title")
    const baseId = activeId.includes('#') ? activeId.split('#')[0] : activeId;
    return contentData.find(c => c.id === baseId);
  }, [activeId]);

  // Extract section from activeId if present
  const activeSection = activeId.includes('#') ? activeId.split('#')[1] : null;

  // Handle navigating to a document from search
  const handleResultClick = (id) => {
    setActiveId(id);
    setSearchQuery('');
  };

  // Helper to get display title (handling overrides like "Notices" -> "Statutes and Notices")
  const getDisplayTitle = (item) => {
    if (item.id === 'Notices') return 'Statutes and Notices';
    return item.title;
  };

  // Sort contentData for Sidebar
  const sortedSidebarItems = useMemo(() => {
    return [...contentData].sort((a, b) => {
      const indexA = sidebarOrder.indexOf(a.id);
      const indexB = sidebarOrder.indexOf(b.id);
      // If both are in the list, sort by index
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      // If only A is in list, A comes first
      if (indexA !== -1) return -1;
      // If only B is in list, B comes first
      if (indexB !== -1) return 1;
      // Otherwise keep original order (or alphabetical if preferred)
      return 0;
    });
  }, []);

  // Filter contentData for Home Page Buttons
  const homeButtons = useMemo(() => {
    // Filter items that are in the homeButtonsOrder list
    const items = contentData.filter(item => homeButtonsOrder.includes(item.id));
    // Sort them according to the order in homeButtonsOrder
    return items.sort((a, b) => {
      return homeButtonsOrder.indexOf(a.id) - homeButtonsOrder.indexOf(b.id);
    });
  }, []);

  // Highlight helper component
  const HighlightText = ({ text, highlight }) => {
    if (!text) return null;
    if (!highlight || !highlight.trim()) return <span>{text}</span>;
    
    // Escape special regex characters to prevent crashes
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    try {
      const parts = text.split(new RegExp(`(${escapedHighlight})`, 'gi'));
      return (
        <span>
          {parts.map((part, i) => 
            part.toLowerCase() === highlight.toLowerCase() ? (
              <span key={i} className="bg-emerald-500/30 text-emerald-200 font-semibold rounded px-0.5">{part}</span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </span>
      );
    } catch (e) {
      console.error("Regex error:", e);
      return <span>{text}</span>;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#050a08] text-white overflow-hidden font-sans">
      <Analytics />
      
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed lg:relative z-30 h-full w-72 flex flex-col border-r border-white/10 bg-[#050a08]/90 backdrop-blur-xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo Header */}
        <div className="flex items-center gap-4 p-6 border-b border-white/5 cursor-pointer" onClick={() => setActiveId('home')}>
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-widest text-emerald-500 uppercase">State of</span>
            <span className="text-lg font-bold tracking-wide">San Andreas</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {/* Home Button */}
          <button
            onClick={() => {
              setActiveId('home');
              setSearchQuery('');
              if (window.innerWidth < 1024) setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
              activeId === 'home'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Home className={`h-5 w-5 ${activeId === 'home' ? 'text-emerald-400' : 'text-gray-500 group-hover:text-white'}`} />
            Home
          </button>

          <div className="mt-6 mb-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Legal Documents
          </div>
          
          {sortedSidebarItems.map((item) => {
            const Icon = icons[item.id] || FileText;
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveId(item.id);
                  setSearchQuery(''); // Clear search on nav
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-400' : 'text-gray-500 group-hover:text-white'}`} />
                {getDisplayTitle(item)}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            System Online
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0f1715] relative">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-96 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>

        {/* Header - Conditionally render search bar based on activeId */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-black/20 backdrop-blur-md z-10">
          <div className="flex items-center gap-4 text-gray-400">
            <button 
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2 text-sm">
              <span className="opacity-50">Database</span>
              <span>/</span>
              <span className="text-white font-medium">
                {activeId === 'home' ? 'Home' : getDisplayTitle(activeContent)}
              </span>
            </div>
          </div>

          {activeId !== 'home' && (
            <div className="relative w-64 md:w-96 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-1.5 bg-black/20 border border-white/10 rounded-lg leading-5 text-gray-300 placeholder-gray-600 focus:outline-none focus:bg-black/40 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 sm:text-sm transition-all select-text"
                placeholder={`Search in ${getDisplayTitle(activeContent)}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 scroll-smooth">
          <div className={`${WIDE_VIEW_IDS.includes(activeId) ? 'max-w-[95%] xl:max-w-7xl' : 'max-w-4xl'} mx-auto min-h-full`}>
            
            {/* Home View */}
            {activeId === 'home' ? (
              <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <div className="w-full max-w-2xl flex flex-col items-center text-center animate-fade-in relative z-10">
                  <img src="/logo.png" alt="Logo" className="h-24 w-auto mb-8 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]" />
                  <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">San Andreas</h1>
                  <p className="text-emerald-500 font-medium tracking-[0.2em] uppercase mb-12 text-sm">Legal Database System</p>
                  
                  <div className="w-full relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <Search className="h-6 w-6 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-16 pr-12 py-5 bg-white/5 border border-white/10 rounded-2xl text-lg text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-2xl backdrop-blur-sm select-text"
                      placeholder="Search the entire database..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}

                    {/* Dropdown Search Results */}
                    {searchQuery && (
                      <div className="absolute top-full left-0 right-0 mt-4 bg-[#0f1715]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {searchResults.length > 0 ? (
                          <div className="py-2">
                            <div className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-white/5">
                              Search Results ({searchResults.length})
                            </div>
                            {searchResults.map((result) => (
                              <div 
                                key={result.id}
                                onClick={() => handleResultClick(result.parentId || result.id)}
                                className="px-6 py-4 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0 group text-left"
                              >
                                <div className="flex flex-col gap-1 mb-1">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-emerald-500/70 group-hover:text-emerald-400" />
                                    <h3 className="text-base font-bold text-gray-200 group-hover:text-white">
                                      <HighlightText text={result.title} highlight={searchQuery} />
                                    </h3>
                                  </div>
                                  {result.displaySection && (
                                    <span className="text-xs text-emerald-500/80 font-medium uppercase tracking-wider pl-6">
                                      Section: {result.displaySection}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2 pl-6 mt-1">
                                  <HighlightText text={result.displaySnippet} highlight={searchQuery} />
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-8 text-center text-gray-500">
                            No results found for "{searchQuery}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                      {homeButtons.map((item) => {
                        const Icon = icons[item.id] || FileText;
                        return (
                          <button 
                            key={item.id}
                            onClick={() => setActiveId(item.id)}
                            className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-emerald-500/30 transition-all group"
                          >
                            <Icon className="h-6 w-6 text-emerald-500/70 group-hover:text-emerald-400" />
                            <span className="text-sm text-gray-400 group-hover:text-white">{getDisplayTitle(item)}</span>
                          </button>
                        )
                      })}
                  </div>
                </div>
              </div>
            ) : (
              // Document View (with local search)
              <>
                {searchQuery && !SPLITTABLE_IDS.includes(activeId) ? (
                  // Local Search Results (List View for non-card documents)
                  <div className="space-y-4">
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-400">
                        Results in {getDisplayTitle(activeContent)} for "{searchQuery}"
                      </h2>
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <X className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                    
                    {searchResults.map((result) => (
                      <div 
                        key={result.id}
                        // Clicking result in local search just clears search to show doc
                        onClick={() => setSearchQuery('')}
                        className="p-6 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-white/10 cursor-pointer transition-all group"
                      >
                        <div className="flex flex-col gap-1 mb-2">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-emerald-500/70 group-hover:text-emerald-400" />
                            <h3 className="text-lg font-bold text-gray-200 group-hover:text-white">
                              <HighlightText text={result.title} highlight={searchQuery} />
                            </h3>
                          </div>
                          {result.displaySection && result.displaySection !== result.title && (
                            <span className="text-xs text-emerald-500/80 font-medium uppercase tracking-wider pl-8">
                              Section: {result.displaySection}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2 pl-8">
                          <HighlightText text={result.displaySnippet} highlight={searchQuery} />
                        </p>
                        <div className="mt-4 text-xs text-emerald-400 font-medium uppercase tracking-wider pl-8">
                          Click to view document
                        </div>
                      </div>
                    ))}
                    {searchResults.length === 0 && (
                      <div className="text-center py-20 text-gray-500">
                        No results found in this document.
                      </div>
                    )}
                  </div>
                ) : (
                  // Document Content (Card View or Standard Doc)
                  <div className="animate-fade-in">
                    <DocViewer 
                      content={activeContent} 
                      activeSection={activeSection} 
                      searchQuery={searchQuery}
                      matchingTitles={matchingTitles}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
