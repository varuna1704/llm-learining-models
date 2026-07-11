import React from 'react';
import { GLOSSARY } from '../data/curriculum';

interface GlossaryTooltipProps {
  termId: string | null;
  position: { x: number; y: number } | null;
}

export const GlossaryTooltip: React.FC<GlossaryTooltipProps> = ({ termId, position }) => {
  if (!termId || !position) return null;

  const term = GLOSSARY[termId];
  if (!term) return null;

  return (
    <div
      className="glossary-tooltip-card"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -105%)', // center horizontally, float above word
      }}
    >
      <div className="tooltip-term">{term.term}</div>
      <div className="tooltip-def">{term.definition}</div>
      <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '6px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4px' }}>
        Click to read more details.
      </div>
    </div>
  );
};

interface TextWithGlossaryProps {
  text: string;
  onHoverTerm: (termId: string, event: React.MouseEvent) => void;
  onLeaveTerm: () => void;
  onClickTerm: (termId: string) => void;
}

export const TextWithGlossary: React.FC<TextWithGlossaryProps> = ({
  text,
  onHoverTerm,
  onLeaveTerm,
  onClickTerm,
}) => {
  // Sort glossary keys by length descending to match multi-word phrases first (e.g. "context window" before "window")
  const glossaryKeys = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
  
  if (glossaryKeys.length === 0) return <>{text}</>;

  // Build regex: matching any of the keys, case insensitive, word boundaries, optional "s" for plurals
  // We match e.g. "token", "tokens", "context window", "context windows"
  // Note: we escape spaces to allow matches on spaces
  const keysPattern = glossaryKeys.map(key => key.replace(/_/g, '\\s+')).join('|');
  const regex = new RegExp(`\\b(${keysPattern})s?\\b`, 'gi');

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const matchIndex = match.index;
    const matchedText = match[0];
    
    // Add text before match
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }

    // Find the matching glossary key ID
    const matchedNorm = matchedText.toLowerCase().trim().replace(/\s+/g, '_');
    // If plural, remove trailing 's'
    let termId = matchedNorm;
    if (!GLOSSARY[termId] && termId.endsWith('s')) {
      const singular = termId.slice(0, -1);
      if (GLOSSARY[singular]) termId = singular;
    }
    // Deep fallback checking keys
    if (!GLOSSARY[termId]) {
      const foundKey = glossaryKeys.find(key => 
        matchedNorm.includes(key) || key.includes(matchedNorm)
      );
      if (foundKey) termId = foundKey;
    }

    if (GLOSSARY[termId]) {
      parts.push(
        <span
          key={matchIndex}
          className="glossary-link"
          onMouseEnter={(e) => onHoverTerm(termId, e)}
          onMouseLeave={onLeaveTerm}
          onClick={() => onClickTerm(termId)}
        >
          {matchedText}
        </span>
      );
    } else {
      parts.push(matchedText);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  // Simple Markdown inline rendering for bold ** and lists
  // Since details might contain bolding, let's do a basic render of bold text
  return (
    <>
      {parts.map((part, i) => {
        if (typeof part !== 'string') return part;
        
        // Simple regex replace for markdown bolding: **text**
        const boldRegex = /\*\*([^*]+)\*\*/g;
        const subParts = [];
        let subLastIndex = 0;
        let subMatch;
        
        while ((subMatch = boldRegex.exec(part)) !== null) {
          if (subMatch.index > subLastIndex) {
            subParts.push(part.substring(subLastIndex, subMatch.index));
          }
          subParts.push(<strong key={subMatch.index} style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{subMatch[1]}</strong>);
          subLastIndex = boldRegex.lastIndex;
        }
        
        if (subLastIndex < part.length) {
          subParts.push(part.substring(subLastIndex));
        }
        
        return <React.Fragment key={i}>{subParts}</React.Fragment>;
      })}
    </>
  );
};
