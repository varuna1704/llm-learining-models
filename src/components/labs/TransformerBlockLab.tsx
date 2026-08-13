import React, { useState } from 'react';
import { markLabCompleted } from '../../data/progress';

interface BlockComponent {
  id: string;
  name: string;
  type: string;
  desc: string;
  formula: string;
}

const COMPONENTS: BlockComponent[] = [
  {
    id: 'mha',
    name: 'Multi-Head Attention (MHA)',
    type: 'Context Processing',
    desc: 'Allows tokens to exchange contextual information across different representation sub-spaces.',
    formula: 'MHA(Q,K,V) = Concat(head_1, ..., head_h) W^O'
  },
  {
    id: 'add_norm1',
    name: 'Residual Add & LayerNorm #1',
    type: 'Normalization',
    desc: 'Adds raw input vector back to attention output (skip connection) and normalizes mean/variance.',
    formula: 'x = LayerNorm(x + MHA(x))'
  },
  {
    id: 'ffn',
    name: 'Feed-Forward Network (FFN)',
    type: 'Knowledge Retrieval',
    desc: 'Two-layer MLP with SwiGLU activation that expands hidden dimension 4x to store factual knowledge.',
    formula: 'FFN(x) = max(0, x W_1 + b_1) W_2 + b_2'
  },
  {
    id: 'add_norm2',
    name: 'Residual Add & LayerNorm #2',
    type: 'Normalization',
    desc: 'Stabilizes gradients for the next transformer layer in the 80+ layer stack.',
    formula: 'x_{out} = LayerNorm(x + FFN(x))'
  }
];

export const TransformerBlockLab: React.FC = () => {
  const [selectedComp, setSelectedComp] = useState<BlockComponent>(COMPONENTS[0]);

  return (
    <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'var(--font-display)' }}>
          🧱 Exploded Transformer Block Architecture
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          A modern LLM consists of dozens of stacked Transformer blocks. Click any block component to inspect its internal linear layers and residual normalization.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {/* Visual Stack Track */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ textAlign: 'center', padding: '0.4rem', backgroundColor: 'var(--bg-darker)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ⬇️ Input Vectors from previous layer
          </div>

          {COMPONENTS.map((comp) => {
            const isSelected = selectedComp.id === comp.id;
            return (
              <div
                key={comp.id}
                onClick={() => {
                  setSelectedComp(comp);
                  markLabCompleted('transformer');
                }}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  backgroundColor: isSelected ? 'rgba(139, 92, 246, 0.2)' : 'var(--bg-darker)',
                  border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-color)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block' }}>{comp.name}</strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-accent)' }}>{comp.type}</span>
                </div>
                <span style={{ fontSize: '1.2rem' }}>➔</span>
              </div>
            );
          })}

          <div style={{ textAlign: 'center', padding: '0.4rem', backgroundColor: 'var(--bg-darker)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ⬇️ Output Vectors to next layer
          </div>
        </div>

        {/* Selected Component Inspector */}
        <div style={{
          padding: '1.25rem',
          borderRadius: '10px',
          backgroundColor: 'var(--bg-darker)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <h4 style={{ color: '#fff', fontSize: '1.1rem', fontFamily: 'var(--font-display)', margin: 0 }}>
            {selectedComp.name}
          </h4>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
            {selectedComp.desc}
          </p>

          <div style={{
            padding: '0.8rem 1rem',
            borderRadius: '6px',
            backgroundColor: '#05070a',
            border: '1px dashed rgba(139, 92, 246, 0.4)',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            color: '#c084fc'
          }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Mathematical Formula:</span>
            {selectedComp.formula}
          </div>
        </div>
      </div>
    </div>
  );
};
