import React, { useState } from 'react';
import { markLabCompleted } from '../../data/progress';

interface TokenPrediction {
  token: string;
  logit: number;
  prob: number;
}

const PREDICTIONS_MAP: { [prompt: string]: TokenPrediction[] } = {
  'The capital of France is': [
    { token: ' Paris', logit: 14.2, prob: 94.8 },
    { token: ' London', logit: 8.1, prob: 2.1 },
    { token: ' Berlin', logit: 7.5, prob: 1.2 },
    { token: ' a', logit: 6.8, prob: 0.8 },
    { token: ' located', logit: 6.2, prob: 0.5 }
  ],
  'Water consists of hydrogen and': [
    { token: ' oxygen', logit: 15.1, prob: 97.2 },
    { token: ' carbon', logit: 7.8, prob: 1.4 },
    { token: ' nitrogen', logit: 6.9, prob: 0.7 },
    { token: ' helium', logit: 5.4, prob: 0.3 }
  ],
  'To be or not to': [
    { token: ' be', logit: 16.5, prob: 98.9 },
    { token: ' live', logit: 6.2, prob: 0.6 },
    { token: ' exist', logit: 5.1, prob: 0.2 }
  ]
};

export const NextTokenPredictionLab: React.FC = () => {
  const [prompt, setPrompt] = useState('The capital of France is');
  const candidates = PREDICTIONS_MAP[prompt] || PREDICTIONS_MAP['The capital of France is'];

  return (
    <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'var(--font-display)' }}>
          📈 Next-Token Prediction & Softmax Probabilities
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          LLMs generate text one token at a time by predicting a probability distribution over the entire 100,000+ token vocabulary.
        </p>
      </div>

      {/* Preset Prompt Selectors */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {Object.keys(PREDICTIONS_MAP).map((p) => (
          <button
            key={p}
            className={`btn ${prompt === p ? 'btn-primary' : ''}`}
            onClick={() => {
              setPrompt(p);
              markLabCompleted('sampling');
            }}
            style={{ fontSize: '0.8rem' }}
          >
            "{p}..."
          </button>
        ))}
      </div>

      {/* Prompt Preview */}
      <div style={{
        padding: '1rem',
        borderRadius: '8px',
        backgroundColor: 'var(--bg-darker)',
        border: '1px solid var(--border-color)',
        marginBottom: '1.5rem',
        fontSize: '1rem',
        color: '#fff'
      }}>
        <span>{prompt}</span>
        <span style={{
          display: 'inline-block',
          marginLeft: '4px',
          padding: '0.2rem 0.5rem',
          borderRadius: '4px',
          backgroundColor: 'var(--color-primary)',
          animation: 'pulse 1.5s infinite',
          fontWeight: 700
        }}>
          [{candidates[0].token}]
        </span>
      </div>

      {/* Candidate Probabilities Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <strong style={{ fontSize: '0.85rem', color: '#fff' }}>Vocabulary Logit Scores & Softmax Probabilities:</strong>

        {candidates.map((cand, idx) => (
          <div
            key={idx}
            style={{
              padding: '0.8rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-darker)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <strong style={{ color: '#fff', fontSize: '0.9rem' }}>"{cand.token}"</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Raw Logit: {cand.logit}</span>
              </div>
              <strong style={{ color: 'var(--color-accent)', fontSize: '0.9rem' }}>{cand.prob}%</strong>
            </div>

            <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${cand.prob}%`,
                  backgroundColor: idx === 0 ? 'var(--color-accent)' : 'var(--color-primary)',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
