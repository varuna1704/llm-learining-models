import React, { useState } from 'react';
import { markLabCompleted } from '../../data/progress';

interface AttentionHead {
  id: number;
  name: string;
  focus: string;
  color: string;
}

const HEADS: AttentionHead[] = [
  { id: 1, name: 'Head #1 (Syntactic Ties)', focus: 'Subject-Verb & Adjective-Noun dependencies', color: '#8b5cf6' },
  { id: 2, name: 'Head #2 (Coreference)', focus: 'Pronouns to antecedent nouns ("it" → "cat")', color: '#06b6d4' },
  { id: 3, name: 'Head #3 (Positional Proximity)', focus: 'Adjacent preceding and following tokens', color: '#f59e0b' },
  { id: 4, name: 'Head #4 (Semantic Categories)', focus: 'Entity types and topic clusters', color: '#10b981' }
];

export const MultiHeadAttentionLab: React.FC = () => {
  const [activeHeadId, setActiveHeadId] = useState(1);
  const activeHead = HEADS.find(h => h.id === activeHeadId) || HEADS[0];

  const sentence = 'The small cat sat on the mat because it was tired.';
  const tokens = sentence.split(' ');

  return (
    <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'var(--font-display)' }}>
          🎭 Multi-Head Attention Specialist Lab
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          A single attention head can only focus on one relation at a time. Multi-Head Attention runs 8 to 128 parallel heads, allowing the model to analyze syntax, semantics, and position simultaneously.
        </p>
      </div>

      {/* Head Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {HEADS.map((head) => {
          const isActive = head.id === activeHeadId;
          return (
            <button
              key={head.id}
              onClick={() => {
                setActiveHeadId(head.id);
                markLabCompleted('attention');
              }}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                backgroundColor: isActive ? head.color : 'var(--bg-darker)',
                color: '#fff',
                border: `1px solid ${isActive ? '#fff' : 'var(--border-color)'}`,
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {head.name}
            </button>
          );
        })}
      </div>

      {/* Active Head Detail Card */}
      <div style={{
        padding: '1.25rem',
        borderRadius: '10px',
        backgroundColor: 'var(--bg-darker)',
        border: `1px solid ${activeHead.color}`,
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <strong style={{ color: activeHead.color, fontSize: '1rem' }}>
            Active Head: {activeHead.name}
          </strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Head Size $d_k = 128$</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
          <strong>Specialization Focus:</strong> {activeHead.focus}
        </p>
      </div>

      {/* Token Attention Matrix Preview */}
      <div style={{
        padding: '1.2rem',
        borderRadius: '8px',
        backgroundColor: '#05070a',
        border: '1px solid var(--border-color)'
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.8rem' }}>
          Token Stream Visualization (Head Projection Color: <span style={{ color: activeHead.color, fontWeight: 700 }}>{activeHead.color}</span>):
        </span>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {tokens.map((tok, idx) => (
            <div
              key={idx}
              style={{
                padding: '0.4rem 0.7rem',
                borderRadius: '6px',
                backgroundColor: activeHead.color,
                opacity: 0.3 + (idx % 3) * 0.3,
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              {tok}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
