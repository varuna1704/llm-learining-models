import React, { useState } from 'react';
import { markLabCompleted } from '../../data/progress';

interface DocumentChunk {
  id: number;
  text: string;
  score: number;
}

const SAMPLE_CHUNKS: DocumentChunk[] = [
  { id: 1, text: 'ModelMap is an interactive visual-first platform for learning LLM internal architectures.', score: 0.92 },
  { id: 2, text: 'Transformers use multi-head self-attention to process tokens in parallel.', score: 0.88 },
  { id: 3, text: 'Vector databases store 384-dimensional embeddings for fast cosine similarity lookup.', score: 0.85 },
  { id: 4, text: 'The weather in Paris is sunny today with a high of 24 degrees Celsius.', score: 0.12 }
];

export const RagLab: React.FC = () => {
  const [query, setQuery] = useState('How does ModelMap teach LLM internals?');
  const [chunks] = useState<DocumentChunk[]>(SAMPLE_CHUNKS);
  const [step, setStep] = useState<number>(3); // Default at step 3 (retrieval)

  const steps = [
    { title: '1. Document Ingestion & Chunking', desc: 'Break large PDFs or markdown files into 500-token chunks with overlap.' },
    { title: '2. Vector Embedding Generation', desc: 'Pass chunks through Xenova/all-MiniLM-L6-v2 to generate 384-dim dense vectors.' },
    { title: '3. Similarity Search (Vector DB)', desc: 'Compute cosine distance between user query vector and stored chunk vectors.' },
    { title: '4. Prompt Augmentation & LLM Generation', desc: 'Inject retrieved top-k chunks into system prompt for grounded zero-shot generation.' }
  ];

  return (
    <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'var(--font-display)' }}>
          🔍 Retrieval-Augmented Generation (RAG) Lab
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          RAG grounds LLM answers in external private knowledge bases, eliminating hallucinations without fine-tuning.
        </p>
      </div>

      {/* RAG Pipeline Stage Progress */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {steps.map((s, idx) => {
          const isActive = idx === step;
          return (
            <div
              key={idx}
              onClick={() => {
                setStep(idx);
                markLabCompleted('rag');
              }}
              style={{
                padding: '0.8rem',
                borderRadius: '8px',
                backgroundColor: isActive ? 'rgba(6, 182, 212, 0.15)' : 'var(--bg-darker)',
                border: `1px solid ${isActive ? 'var(--color-accent)' : 'var(--border-color)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <strong style={{ color: isActive ? 'var(--color-accent)' : '#fff', fontSize: '0.85rem', display: 'block', marginBottom: '0.2rem' }}>
                {s.title}
              </strong>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.3, display: 'block' }}>
                {s.desc}
              </span>
            </div>
          );
        })}
      </div>

      {/* Query Input */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
          User Search Query:
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            markLabCompleted('rag');
          }}
          style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem' }}
        />
      </div>

      {/* Retrieved Chunks Preview */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <strong style={{ color: '#fff', fontSize: '0.85rem' }}>Top-K Retrieved Context Chunks (Vector DB Results):</strong>

        {chunks.map((chk) => {
          const isTopMatch = chk.score > 0.8;
          return (
            <div
              key={chk.id}
              style={{
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                backgroundColor: isTopMatch ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-darker)',
                border: `1px solid ${isTopMatch ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <span style={{ fontSize: '0.85rem', color: isTopMatch ? '#fff' : 'var(--text-muted)', flexGrow: 1 }}>
                "{chk.text}"
              </span>
              <span style={{
                fontSize: '0.75rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                backgroundColor: isTopMatch ? '#10b981' : 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontWeight: 700
              }}>
                {(chk.score * 100).toFixed(0)}% Match
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
