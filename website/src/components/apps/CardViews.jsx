
import React, { useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Banknote, Hourglass, Scale, Calendar, User, Book, Copy, Check } from 'lucide-react';

const TypeBadge = ({ type }) => {
  let colorClass = 'bg-gray-600';
  if (type === 'INF') colorClass = 'bg-emerald-600';
  if (type === 'MIS') colorClass = 'bg-emerald-600'; // Following screenshot where MIS looked green
  if (type === 'FEL') colorClass = 'bg-red-600';

  return (
    <span className={`${colorClass} text-white text-xs font-bold px-2 py-0.5 rounded`}>
      {type}
    </span>
  );
};

export const PenalCodeGrid = ({ items, activeSection }) => {
  useEffect(() => {
    if (activeSection) {
      const element = document.getElementById(activeSection);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [activeSection]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {items.map((item, idx) => {
        const cleanId = item.title.replace(/[*_`]/g, '');
        const isActive = cleanId === activeSection;
        return (
          <div 
            key={idx} 
            id={cleanId}
            className={`bg-zinc-900/80 border rounded-lg p-5 flex flex-col h-[500px] shadow-lg transition-all duration-300 ${
              isActive 
                ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)] scale-[1.02] z-10' 
                : 'border-orange-500/30 hover:border-orange-500/50'
            }`}
          >
            <div className="flex justify-between items-start mb-4 gap-3 flex-shrink-0">
              <h3 className="text-xl font-bold text-white leading-tight flex-1 min-w-0 break-words">{item.title}</h3>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                {item.code && (
                  <span className="border border-orange-500 text-orange-500 text-xs font-mono px-2 py-0.5 rounded whitespace-nowrap bg-orange-500/10">
                    {item.code}
                  </span>
                )}
                {item.type && <TypeBadge type={item.type} />}
              </div>
            </div>
            
            <div className="text-gray-400 text-sm mb-4 flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-2">
              <Markdown remarkPlugins={[remarkGfm, remarkBreaks]}>{item.description}</Markdown>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 flex-shrink-0 mt-auto">
              <div className="flex items-center gap-2 text-orange-400">
                <Banknote size={18} />
                <span className="font-mono font-bold text-sm">{item.fine || 'None'}</span>
              </div>
              <div className="flex items-center gap-2 text-orange-400 justify-end">
                <Hourglass size={18} />
                <span className="font-mono font-bold text-sm">{item.sentence || 'None'}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const CaseLawsGrid = ({ items, activeSection }) => {
  useEffect(() => {
    if (activeSection) {
      const element = document.getElementById(activeSection);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [activeSection]);

  return (
    <div className="flex flex-col gap-4 p-4 max-w-4xl mx-auto">
      {items.map((item, idx) => {
        const cleanId = item.title.replace(/[*_`]/g, '');
        const isActive = cleanId === activeSection;
        return (
          <div 
            key={idx} 
            id={cleanId}
            className={`bg-zinc-900/80 border rounded-lg p-6 shadow-lg transition-all duration-300 ${
              isActive 
                ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)] scale-[1.01]' 
                : 'border-orange-500/30 hover:border-orange-500/50'
            }`}
          >
            <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
            {item.date && (
              <div className="text-gray-500 text-sm mb-4">Defined on {item.date}</div>
            )}
            <div className="text-gray-300">
              <Markdown remarkPlugins={[remarkGfm, remarkBreaks]}>{item.body}</Markdown>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const NoticesGrid = ({ items }) => {
  return (
    <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
      {items.map((item, idx) => (
        <div key={idx} className="bg-zinc-900/80 border border-emerald-500/20 rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-4">
            <h3 className="text-2xl font-bold text-emerald-400">{item.title}</h3>
            {item.author && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <User size={14} />
                <span>{item.author}</span>
              </div>
            )}
          </div>
          <div className="prose prose-invert prose-emerald max-w-none text-gray-300">
             <Markdown remarkPlugins={[remarkGfm, remarkBreaks]}>{item.body}</Markdown>
          </div>
        </div>
      ))}
    </div>
  );
};

export const LegalDefinitionsGrid = ({ items, activeSection }) => {
  useEffect(() => {
    if (activeSection) {
      const element = document.getElementById(activeSection);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [activeSection]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {items.map((item, idx) => {
        const cleanId = item.title.replace(/[*_`]/g, '');
        const isActive = cleanId === activeSection;
        return (
          <div 
            key={idx} 
            id={cleanId}
            className={`bg-zinc-900/80 border rounded-lg p-6 shadow-lg transition-all duration-300 ${
              isActive 
                ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)] scale-[1.02]' 
                : 'border-white/10 hover:border-emerald-500/30'
            }`}
          >
            <h3 className="text-xl font-bold text-emerald-400 mb-2">{item.title}</h3>
            <div className="prose prose-invert prose-emerald max-w-none text-gray-300 text-sm">
              <Markdown remarkPlugins={[remarkGfm, remarkBreaks]}>{item.body}</Markdown>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const USConstitutionGrid = ({ items, mainText, activeSection }) => {
  useEffect(() => {
    if (activeSection) {
      const element = document.getElementById(activeSection);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [activeSection]);

  return (
    <div className="space-y-8">
      {mainText && (
        <div className="prose prose-invert prose-emerald max-w-none p-4 bg-zinc-900/50 rounded-lg border border-white/10">
          <Markdown remarkPlugins={[remarkGfm, remarkBreaks]}>{mainText}</Markdown>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {items.map((item, idx) => {
          const cleanId = item.title.replace(/[*_`]/g, '');
          const isActive = cleanId === activeSection;
          return (
            <div 
              key={idx} 
              id={cleanId}
              className={`bg-zinc-900/80 border rounded-lg p-6 shadow-lg transition-all duration-300 flex flex-col ${
                isActive 
                  ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)] scale-[1.02] z-10' 
                  : 'border-blue-500/30 hover:border-blue-500/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                <Book className="text-blue-400" size={20} />
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
              </div>
              
              <div className="space-y-4 flex-grow">
                <div>
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Original Text</h4>
                  <div className="text-gray-300 text-sm italic bg-black/20 p-2 rounded border border-white/5">
                    <Markdown remarkPlugins={[remarkGfm, remarkBreaks]}>{item.originalText}</Markdown>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Meaning</h4>
                  <div className="text-gray-300 text-sm">
                    <Markdown remarkPlugins={[remarkGfm, remarkBreaks]}>{item.meaning}</Markdown>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const TemplatesGrid = ({ items, activeSection }) => {
  const [copiedId, setCopiedId] = React.useState(null);

  useEffect(() => {
    if (activeSection) {
      const element = document.getElementById(activeSection);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [activeSection]);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 gap-6 p-4 max-w-4xl mx-auto">
      {items.map((item, idx) => {
        const cleanId = item.title.replace(/[*_`]/g, '');
        const isActive = cleanId === activeSection;
        return (
          <div 
            key={idx} 
            id={cleanId}
            className={`bg-zinc-900/80 border rounded-lg p-6 shadow-lg transition-all duration-300 ${
              isActive 
                ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)] scale-[1.02] z-10' 
                : 'border-blue-500/30 hover:border-blue-500/50'
            }`}
          >
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
              <h3 className="text-xl font-bold text-white">{item.title}</h3>
              <button 
                onClick={() => handleCopy(item.templateCode, idx)}
                className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-bold transition-colors ${
                  copiedId === idx 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/40'
                }`}
              >
                {copiedId === idx ? (
                  <>
                    <Check size={16} /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} /> Copy Template
                  </>
                )}
              </button>
            </div>
            
            {item.instructions && (
              <div className="mb-4 text-gray-400 text-sm bg-white/5 p-3 rounded border-l-2 border-blue-500">
                <h4 className="font-bold text-blue-400 mb-1 text-xs uppercase tracking-wider">Instructions</h4>
                <Markdown remarkPlugins={[remarkGfm, remarkBreaks]}>{item.instructions}</Markdown>
              </div>
            )}

            <div className="bg-black/50 p-4 rounded border border-white/10 font-mono text-sm text-gray-300 overflow-x-auto whitespace-pre">
              {item.templateCode}
            </div>
          </div>
        );
      })}
    </div>
  );
};
