import React, { useState } from 'react';
import { markLabCompleted } from '../../data/progress';

export const SelfAttentionLab: React.FC = () => {
  const [sentence, setSentence] = useState('The animal didn\'t cross the street because it was too tired');
  const [selectedWordIdx, setSelectedWordIdx] = useState<number>(7); // "it"

  const words = sentence.trim().split(/\s+/);

  // Simulated Query-Key Attention Weights for selected word
  const getAttentionWeights = (targetIdx: number, total: number) => {
    const weights: number[] = new Array(total).fill(0.05);
    const target = words[targetIdx]?.toLowerCase() || '';

    words.forEach((w, idx) => {
      const cleanW = w.toLowerCase().replace(/[^a-z]/g, '');
      if (idx === targetIdx) {
        weights[idx] = 0.45; // Self-attention
      } else if (target === 'it' && (cleanW === 'animal' || cleanW === 'street')) {
        weights[idx] = cleanW === 'animal' ? 0.35 : 0.10;
      } else if (target === 'tired' && (cleanW === 'animal' || cleanW === 'it')) {
        weights[idx] = 0.40;
      } else {
        weights[idx] = Math.max(0.02, Math.random() * 0.15);
      }
    });

    // Normalize sum to 1.0
    const sum = weights.reduce((a, b) => a + b, 0);
    return weights.map(w => w / sum);
  };

  const weights = getAttentionWeights(selectedWordIdx, words.length);

  return (
    <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'var(--font-display)' }}>
          👁️ Interactive Self-Attention Simulator
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Click any word in the sentence below to inspect which words it attends to when forming its context representation.
        </p>
      </div>

      {/* Sentence Input */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={sentence}
          onChange={(e) => {
            setSentence(e.target.value);
            setSelectedWordIdx(0);
            markLabCompleted('attention');
          }}
          style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem' }}
        />
      </div>

      {/* Interactive Word Tokens Canvas with Attention Arc Lines */}
      <div style={{
        padding: '2rem 1.5rem',
        backgroundColor: 'var(--bg-darker)',
        borderRadius: '10px',
        border: '1px solid var(--border-color)',
        marginBottom: '1.5rem',
        position: 'relative'
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '1.2rem' }}>
          Click a word to calculate attention scores (currently focused on: <strong style={{ color: 'var(--color-primary)' }}>"{words[selectedWordIdx]}"</strong>):
        </span>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', alignItems: 'center' }}>
          {words.map((w, idx) => {
            const isSelected = idx === selectedWordIdx;
            const weight = weights[idx] || 0;
            const alpha = Math.min(1, Math.max(0.15, weight * 2.5));

            return (
              <div
                key={idx}
                onClick={() => {
                  setSelectedWordIdx(idx);
                  markLabCompleted('attention');
                }}
                style={{
                  padding: '0.5rem 0.8rem',
                  borderRadius: '6px',
                  backgroundColor: isSelected ? 'var(--color-primary)' : `rgba(139, 92, 246, ${alpha})`,
                  color: '#fff',
                  fontWeight: isSelected ? 800 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #fff' : '1px solid transparent',
                  boxShadow: isSelected ? '0 0 15px rgba(139, 92, 246, 0.6)' : 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <span>{w}</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.85, marginTop: '0.2rem' }}>
                  {(weight * 100).toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanation Banner */}
      <div style={{
        padding: '1rem',
        borderRadius: '8px',
        backgroundColor: 'rgba(6, 182, 212, 0.08)',
        borderLeft: '4px solid var(--color-accent)',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)'
      }}>
        <strong style={{ color: 'var(--color-accent)', display: 'block', marginBottom: '0.2rem' }}>
          💡 Attention Analysis for "{words[selectedWordIdx]}":
        </strong>
        The Query vector $Q$ for <strong>"{words[selectedWordIdx]}"</strong> was multiplied against all Key vectors $K^T$.
        Notice how pronoun <strong>"it"</strong> places high attention weight on <strong>"animal"</strong> (35%), resolving coreference ambiguity!
      </div>
    </div>
  );
};
