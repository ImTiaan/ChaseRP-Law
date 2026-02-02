
export const parsePenalCode = (content) => {
  const sections = content.split('---').map(s => s.trim()).filter(s => s);
  return sections.map(section => {
    // Extract title
    const titleMatch = section.match(/^##\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : '';

    if (!title && !section.includes('Code:')) return null; // Skip non-entry sections (like preamble if any)

    const codeMatch = section.match(/- \*\*Code:\*\*\s+(.+)$/m);
    const typeMatch = section.match(/- \*\*Type:\*\*\s+(.+)$/m);
    const descMatch = section.match(/- \*\*Description:\*\*\s+(.+)$/m);
    const fineMatch = section.match(/- \*\*Fine:\*\*\s+(.+)$/m);
    const sentenceMatch = section.match(/- \*\*Sentence:\*\*\s+(.+)$/m);
    const specialMatch = section.match(/- \*\*Special:\*\*\s+(.+)$/m);

    return {
      title,
      code: codeMatch ? codeMatch[1].trim() : '',
      type: typeMatch ? typeMatch[1].trim() : '',
      description: descMatch ? descMatch[1].trim() : '',
      fine: fineMatch ? fineMatch[1].trim() : '',
      sentence: sentenceMatch ? sentenceMatch[1].trim() : '',
      special: specialMatch ? specialMatch[1].trim() : '',
      raw: section
    };
  }).filter(item => item && item.title);
};

export const parseCaseLaws = (content) => {
  const sections = content.split('---').map(s => s.trim()).filter(s => s);
  return sections.map(section => {
    const titleMatch = section.match(/^##\s+(.+)$/m);
    if (!titleMatch) return null;

    const title = titleMatch[1].trim();
    
    // Extract Date defined
    const dateMatch = section.match(/\*Defined on (.+)\*/);
    const date = dateMatch ? dateMatch[1].trim() : '';

    // Extract body: remove title and date line
    // Also remove H1 header if present (for the first section)
    let body = section.replace(/^#\s+.+$/m, '') // Remove H1
                      .replace(/^##\s+(.+)$/m, '') // Remove H2 Title
                      .replace(/\*Defined on (.+)\*/, '') // Remove Date
                      .trim();

    return {
      title,
      date,
      body,
      raw: section
    };
  }).filter(item => item);
};

export const parseNotices = (content) => {
  const sections = content.split('---').map(s => s.trim()).filter(s => s);
  return sections.map(section => {
    const titleMatch = section.match(/^##\s+(.+)$/m);
    if (!titleMatch) return null;

    const title = titleMatch[1].trim();
    
    // Author usually at bottom
    const authorMatch = section.match(/\*\*Author:\*\*\s+(.+)$/m);
    const author = authorMatch ? authorMatch[1].trim() : '';

    // Body is everything else (we might want to keep markdown for body as it has lists etc)
    // We can just pass the whole section to a markdown renderer but excluding the title line would be nice.
    let body = section.replace(/^#\s+.+$/m, '') // Remove H1
                      .replace(/^##\s+(.+)$/m, '') // Remove H2
                      .trim();

    return {
      title,
      author,
      body, // Contains markdown
      raw: section
    };
  }).filter(item => item);
};

export const parseLegalDefinitions = (content) => {
  // Legal definitions didn't have --- separators in the snippet.
  // We'll split by newline followed by ## 
  const sections = content.split(/\n(?=## )/g).map(s => s.trim()).filter(s => s);
  
  return sections.map(section => {
    const titleMatch = section.match(/^##\s+(.+)$/m);
    if (!titleMatch) return null;

    const title = titleMatch[1].trim();
    let body = section.replace(/^#\s+.+$/m, '') // Remove H1
                      .replace(/^##\s+(.+)$/m, '') // Remove H2
                      .trim();

    return {
      title,
      body,
      raw: section
    };
  }).filter(item => item);
};
