
import React, { useEffect } from 'react';
import Markdown from 'react-markdown';
import { Banknote, Hourglass, Scale, Calendar, User } from 'lucide-react';

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {items.map((item, idx) => {
        const cleanId = item.title.replace(/[*_`]/g, '');
        const isActive = cleanId === activeSection;
        return (
          <div 
            key={idx} 
            id={cleanId}
            className={`bg-zinc-900/80 border rounded-lg p-4 flex flex-col h-full shadow-lg transition-all duration-300 ${
              isActive 
                ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)] scale-[1.02]' 
                : 'border-orange-500/30 hover:border-orange-500/50'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-white leading-tight pr-2">{item.title}</h3>
              <div className="flex flex-col items-end gap-1">
                {item.code && (
                  <span className="border border-orange-500 text-orange-500 text-xs font-mono px-1.5 py-0.5 rounded">
                    {item.code}
                  </span>
                )}
                {item.type && <TypeBadge type={item.type} />}
              </div>
            </div>
            
            <div className="text-gray-400 text-sm mb-4 flex-grow">
              {item.description}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto pt-3 border-t border-white/5">
              <div className="flex items-center gap-2 text-orange-400">
                <Banknote size={16} />
                <span className="font-mono font-bold text-sm">{item.fine || 'None'}</span>
              </div>
              <div className="flex items-center gap-2 text-orange-400 justify-end">
                <Hourglass size={16} />
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
              <Markdown>{item.body}</Markdown>
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
             <Markdown>{item.body}</Markdown>
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
              <Markdown>{item.body}</Markdown>
            </div>
          </div>
        );
      })}
    </div>
  );
};
