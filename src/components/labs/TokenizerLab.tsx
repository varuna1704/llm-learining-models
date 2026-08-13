import React, { useState } from 'react';
import { markLabCompleted } from '../../data/progress';

export const TokenizerLab: React.FC = () => {
  const [text, setText] = useState('Learning LLMs with ModelMap is amazing and unbreakable!');
  const [algorithm, setAlgorithm] = useState<'bpe' | 'wordpiece' | 'sentencepiece'>('bpe');

  // Simple tokenization simulator for BPE, WordPiece, SentencePiece
  const tokenizeText = (input: string, mode: string) => {
    const rawWords = input.split(/(\s+)/);
    const tokens: { text: string; id: number; color: string }[] = [];
    let idCounter = 1000;

    const colors = ['#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#6366f1', '#ef4444', '#3b82f6'];

    rawWords.forEach((word) => {
      if (!word.trim()) {
        tokens.push({ text: '␣', id: 220, color: 'rgba(255,255,255,0.1)' });
        return;
      }

      if (mode === 'bpe') {
        // BPE splits subwords
        if (word.length > 5 && Math.random() > 0.3) {
          const mid = Math.floor(word.length / 2);
          const part1 = word.slice(0, mid);
          const part2 = word.slice(mid);
          tokens.push({ text: part1, id: idCounter++, color: colors[idCounter % colors.length] });
          tokens.push({ text: '@@' + part2, id: idCounter++, color: colors[idCounter % colors.length] });
        } else {
          tokens.push({ text: word, id: idCounter++, color: colors[idCounter % colors.length] });
        }
      } else if (mode === 'wordpiece') {
        // WordPiece uses ## prefix for subwords
        if (word.length > 6) {
          const part1 = word.slice(0, 4);
          const part2 = word.slice(4);
          tokens.push({ text: part1, id: idCounter++, color: colors[idCounter % colors.length] });
          tokens.push({ text: '##' + part2, id: idCounter++, color: colors[idCounter % colors.length] });
        } else {
          tokens.push({ text: word, id: idCounter++, color: colors[idCounter % colors.length] });
        }
      } else {
        // SentencePiece uses   prefix for whitespace
        tokens.push({ text: ' ' + word, id: idCounter++, color: colors[idCounter % colors.length] });
      }
    });

    return tokens;
  };

  const tokens = tokenizeText(text, algorithm);

  const handleComplete = () => {
    markLabCompleted('tokenizer');
  };

  return (
    <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'var(--font-display)' }}>
            🪙 Interactive Tokenizer Simulator
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            See how text is sliced into sub-word tokens and mapped to numerical IDs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['bpe', 'wordpiece', 'sentencepiece'] as const).map((mode) => (
            <button
              key={mode}
              className={`btn ${algorithm === mode ? 'btn-primary' : ''}`}
              onClick={() => setAlgorithm(mode)}
              style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
          Enter Input Sentence:
        </label>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleComplete();
          }}
          rows={3}
          style={{
            width: '100%',
            padding: '0.8rem',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-darker)',
            border: '1px solid var(--border-color)',
            color: '#fff',
            fontFamily: 'var(--font-primary)',
            fontSize: '0.95rem',
            outline: 'none'
          }}
        />
      </div>

      {/* Generated Token Chips */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <strong style={{ fontSize: '0.85rem', color: '#fff' }}>Generated Tokens ({tokens.length} tokens):</strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)' }}>
            Avg ~0.75 words per token
          </span>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          padding: '1rem',
          backgroundColor: 'var(--bg-darker)',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          minHeight: '80px'
        }}>
          {tokens.map((tok, idx) => (
            <div
              key={idx}
              style={{
                padding: '0.4rem 0.6rem',
                borderRadius: '6px',
                backgroundColor: tok.color,
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
              }}
            >
              <span>{tok.text}</span>
              <span style={{ fontSize: '0.65rem', opacity: 0.8, backgroundColor: 'rgba(0,0,0,0.3)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>
                #{tok.id}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Token IDs Representation */}
      <div style={{
        padding: '1rem',
        borderRadius: '8px',
        backgroundColor: '#05070a',
        border: '1px solid var(--border-color)',
        fontFamily: 'monospace',
        fontSize: '0.85rem',
        color: '#34d399',
        overflowX: 'auto'
      }}>
        <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem', fontSize: '0.75rem' }}>Numerical ID Array (Sent to Model):</span>
        [{tokens.map(t => t.id).join(', ')}]
      </div>
    </div>
  );
};
