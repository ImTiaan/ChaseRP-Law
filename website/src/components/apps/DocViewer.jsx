import React, { useMemo } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { 
  parsePenalCode, 
  parseCaseLaws, 
  parseNotices, 
  parseLegalDefinitions,
  parseUSConstitution,
  parseTemplates
} from '../../lib/parsers';
import { 
  PenalCodeGrid, 
  CaseLawsGrid, 
  NoticesGrid, 
  LegalDefinitionsGrid,
  USConstitutionGrid,
  TemplatesGrid
} from './CardViews';

export default function DocViewer({ content, activeSection, matchingTitles }) {
  // console.log('DocViewer content:', content); // Debug log
  if (!content) return <div className="p-8 text-white/50">No content available.</div>;

  const cardView = useMemo(() => {
    // console.log('Checking ID:', content.id); // Debug log
    let items = [];
    switch (content.id) {
      case 'Penal_code':
        items = parsePenalCode(content.content);
        break;
      case 'Case_Laws':
        items = parseCaseLaws(content.content);
        break;
      case 'Notices':
        items = parseNotices(content.content);
        break;
      case 'Legal_Definitions':
        items = parseLegalDefinitions(content.content);
        break;
      case 'Court_Procedures':
        items = parseLegalDefinitions(content.content);
        break;
      case 'US_Constitution':
        items = parseUSConstitution(content.content);
        break;
      case 'templates':
        items = parseTemplates(content.content);
        break;
      default:
        return null;
    }

    // Filter items if matchingTitles is provided (search is active)
    if (matchingTitles !== null && Array.isArray(matchingTitles)) {
      items = items.filter(item => {
        // Clean title to match the format in matchingTitles (which comes from App.jsx's search logic)
        const cleanTitle = item.title.replace(/[*_`]/g, '');
        return matchingTitles.includes(cleanTitle);
      });
    }

    switch (content.id) {
      case 'Penal_code':
        return <PenalCodeGrid items={items} activeSection={activeSection} />;
      case 'Case_Laws':
        return <CaseLawsGrid items={items} activeSection={activeSection} />;
      case 'Notices':
        return <NoticesGrid items={items} activeSection={activeSection} />;
      case 'Legal_Definitions':
        return <LegalDefinitionsGrid items={items} activeSection={activeSection} />;
      case 'Court_Procedures':
        return <LegalDefinitionsGrid items={items} activeSection={activeSection} />;
      case 'US_Constitution':
        return <USConstitutionGrid items={items.amendments} mainText={items.mainText} activeSection={activeSection} />;
      case 'templates':
        return <TemplatesGrid items={items} activeSection={activeSection} />;
      default:
        return null;
    }
  }, [content, activeSection, matchingTitles]);

  if (cardView) {
    return (
      <div className="p-4 md:p-8">
        <div className="mb-8 border-b border-white/10 pb-4">
          <h1 className="text-3xl font-bold text-white mb-2">{content.title}</h1>
          <div className="text-sm text-emerald-400 font-mono">
            Last Updated: {new Date().toLocaleDateString()}
          </div>
        </div>
        {cardView}
      </div>
    );
  }

  return (
    <div className="p-8 text-gray-200 prose prose-invert prose-emerald max-w-none">
      <div className="mb-8 border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold text-white mb-2">{content.title}</h1>
        <div className="text-sm text-emerald-400 font-mono">
          Last Updated: {new Date().toLocaleDateString()}
        </div>
      </div>
      <Markdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mt-8 mb-4 border-l-4 border-emerald-500 pl-4" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-xl font-bold text-white mt-6 mb-3 flex items-center gap-2" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-emerald-400 mt-4 mb-2" {...props} />,
          code: ({node, ...props}) => <code className="bg-black/30 px-1.5 py-0.5 rounded text-emerald-300 font-mono text-sm border border-white/5" {...props} />,
          pre: ({node, ...props}) => <pre className="bg-black/50 p-4 rounded-xl border border-white/10 overflow-x-auto my-4" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 my-4 text-gray-300" {...props} />,
          li: ({node, ...props}) => <li className="marker:text-emerald-500" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-emerald-500/30 pl-4 italic text-gray-400 my-4" {...props} />,
          table: ({node, ...props}) => <div className="overflow-x-auto my-6 rounded-lg border border-white/10"><table className="w-full text-left border-collapse" {...props} /></div>,
          th: ({node, ...props}) => <th className="bg-white/5 p-3 text-sm font-semibold text-white border-b border-white/10" {...props} />,
          td: ({node, ...props}) => <td className="p-3 text-sm border-b border-white/5" {...props} />,
        }}
      >
        {content.content}
      </Markdown>
    </div>
  );
}
