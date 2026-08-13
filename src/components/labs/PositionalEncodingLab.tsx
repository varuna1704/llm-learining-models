import React, { useState } from 'react';
import { markLabCompleted } from '../../data/progress';

export const PositionalEncodingLab: React.FC = () => {
  const [sentence, setSentence] = useState('Dog bites man');
  const [showEncoding, setShowEncoding] = useState(true);

  const words = sentence.trim().split(/\s+/);

  // Generate sine/cosine positional encoding values
  const getPositionalVector = (pos: number, dims: number = 6) => {
    const vec: number[] = [];
    for (let i = 0; i < dims; i++) {
      if (i % 2 === 0) {
        vec.push(Math.sin(pos / Math.pow(10000, (2 * i) / dims)));
      } else {
        vec.push(Math.cos(pos / Math.pow(10000, (2 * i) / dims)));
      }
    }
    return vec;
  };

  return (
    <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'var(--font-display)' }}>
          📍 Positional Encoding Visualizer
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Transformers process all words in parallel. Positional encoding injects sine/cosine waves into embeddings to preserve word order.
        </p>
      </div>

      {/* Input Sentence */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={sentence}
          onChange={(e) => {
            setSentence(e.target.value);
            markLabCompleted('attention');
          }}
          style={{ flexGrow: 1, minWidth: '220px', padding: '0.6rem 0.8rem', borderRadius: '6px', backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem' }}
        />

        <button
          className={`btn ${showEncoding ? 'btn-primary' : ''}`}
          onClick={() => setShowEncoding(!showEncoding)}
          style={{ fontSize: '0.8rem' }}
        >
          {showEncoding ? 'Disable Encoding (Bag-of-Words)' : 'Inject Positional Waves'}
        </button>
      </div>

      {/* Comparison Box */}
      <div style={{
        padding: '1rem',
        borderRadius: '8px',
        backgroundColor: showEncoding ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        border: `1px solid ${showEncoding ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
        marginBottom: '1.5rem'
      }}>
        <strong style={{ color: showEncoding ? '#34d399' : '#f87171', fontSize: '0.85rem' }}>
          {showEncoding ? '✓ Position-Aware Representation' : '⚠️ Order Lost (Permutation Invariant)'}
        </strong>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.3rem 0 0 0' }}>
          {showEncoding
            ? '"Dog bites man" and "Man bites dog" have distinct positional vectors, allowing the model to know who performed the action.'
            : 'Without positional encodings, "Dog bites man" and "Man bites dog" produce identical attention scores!'}
        </p>
      </div>

      {/* Word Positional Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {words.map((word, pos) => {
          const vec = getPositionalVector(pos);
          return (
            <div
              key={pos}
              style={{
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-darker)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{word}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 700 }}>
                  Pos #{pos}
                </span>
              </div>

              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                Sine/Cosine Vector:
              </span>

              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {vec.map((val, idx) => {
                  const heightPct = Math.abs(val) * 100;
                  return (
                    <div
                      key={idx}
                      title={`Dim ${idx}: ${val.toFixed(3)}`}
                      style={{
                        flex: 1,
                        height: '40px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderRadius: '3px',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          width: '100%',
                          height: `${heightPct}%`,
                          backgroundColor: val >= 0 ? '#38bdf8' : '#ec4899',
                          transition: 'height 0.3s ease'
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
