import React, { useState } from 'react';
import { markLabCompleted } from '../../data/progress';

export const HallucinationLab: React.FC = () => {
  const [query, setQuery] = useState('Who won the 2029 World Chess Championship?');
  const [temperature, setTemperature] = useState(0.8);

  const isFutureFact = query.toLowerCase().includes('2029') || query.toLowerCase().includes('future');

  return (
    <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'var(--font-display)' }}>
          ⚠️ Hallucination Mechanism & Mitigation Lab
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          LLMs are probabilistic next-token predictors. When asked about missing or future facts, high temperature forces the model to complete sentences plausibly, resulting in confident hallucinations.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
            Ask Question (Try asking about unknown/future events):
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              markLabCompleted('security');
            }}
            style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem', marginBottom: '1rem' }}
          />

          <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label style={{ color: '#fff', fontSize: '0.85rem' }}>Temperature ($T$):</label>
              <strong style={{ color: 'var(--color-accent)' }}>{temperature.toFixed(1)}</strong>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.5"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Model Output Simulation */}
        <div style={{
          padding: '1.25rem',
          borderRadius: '10px',
          backgroundColor: isFutureFact && temperature > 0.3 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          border: `1px solid ${isFutureFact && temperature > 0.3 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <strong style={{ color: isFutureFact && temperature > 0.3 ? '#f87171' : '#34d399', fontSize: '0.9rem' }}>
            {isFutureFact && temperature > 0.3 ? '🚨 Hallucination Detected (Model Hallucinated Fact)' : '✓ Grounded Response / Refusal'}
          </strong>

          <div style={{
            padding: '1rem',
            borderRadius: '6px',
            backgroundColor: '#05070a',
            color: '#fff',
            fontSize: '0.85rem',
            lineHeight: 1.5
          }}>
            {isFutureFact && temperature > 0.3
              ? `The 2029 World Chess Championship was won by Grandmaster Alexander Petrov in a thrilling 12-game match against Alireza Firouzja in Oslo... (Confident invention!)`
              : `I cannot answer this question as the 2029 World Chess Championship has not occurred yet. (Accurate refusal / low temperature grounded response)`}
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <strong>Mitigation Strategies:</strong> 1) Use RAG with verified vector DBs, 2) Lower Temperature to 0.0, 3) Inject strict refusal rules into system instructions.
          </div>
        </div>
      </div>
    </div>
  );
};
