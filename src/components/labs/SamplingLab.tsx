import React, { useState } from 'react';
import { markLabCompleted } from '../../data/progress';

export const SamplingLab: React.FC = () => {
  const [temperature, setTemperature] = useState(0.7);
  const [topK, setTopK] = useState(50);
  const [topP, setTopP] = useState(0.9);
  const [freqPenalty, setFreqPenalty] = useState(0.0);

  // Simulated output text based on parameters
  const getSimulatedText = () => {
    if (temperature < 0.2) {
      return "The capital of France is Paris. Paris is the largest city in France and serves as the political, economic, and cultural center of the nation.";
    } else if (temperature < 0.9) {
      return "The capital of France is Paris, a global center for art, fashion, gastronomy, and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine.";
    } else {
      return "The capital of France is Paris! Ah, cobblestone streets, glowing lights of the Eiffel Tower, bohemian cafés, and poetic whispers along the Seine riverbanks under midnight stars...";
    }
  };

  return (
    <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'var(--font-display)' }}>
          🎲 Decoding & Sampling Parameters Playground
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Adjust Temperature, Top-K, and Top-P to control the balance between deterministic analytical answers and creative randomness.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {/* Controls Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Temperature Slider */}
          <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>Temperature ($T$)</label>
              <strong style={{ color: 'var(--color-accent)' }}>{temperature.toFixed(2)}</strong>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.05"
              value={temperature}
              onChange={(e) => {
                setTemperature(parseFloat(e.target.value));
                markLabCompleted('sampling');
              }}
              style={{ width: '100%' }}
            />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
              Low (0.0): Deterministic/Greedy • High (1.5+): Creative/Random
            </span>
          </div>

          {/* Top-P Nucleus Slider */}
          <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>Top-P (Nucleus Sampling)</label>
              <strong style={{ color: 'var(--color-primary)' }}>{topP.toFixed(2)}</strong>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={topP}
              onChange={(e) => {
                setTopP(parseFloat(e.target.value));
                markLabCompleted('sampling');
              }}
              style={{ width: '100%' }}
            />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
              Considers top candidate tokens whose cumulative probability exceeds Top-P.
            </span>
          </div>

          {/* Top-K Slider */}
          <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>Top-K Truncation</label>
              <strong style={{ color: '#f59e0b' }}>{topK} tokens</strong>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={topK}
              onChange={(e) => {
                setTopK(parseInt(e.target.value));
                markLabCompleted('sampling');
              }}
              style={{ width: '100%' }}
            />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
              Restricts sampling to the top K highest-probability tokens.
            </span>
          </div>

          {/* Frequency Penalty Slider */}
          <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>Frequency Penalty</label>
              <strong style={{ color: '#ec4899' }}>{freqPenalty.toFixed(1)}</strong>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.1"
              value={freqPenalty}
              onChange={(e) => {
                setFreqPenalty(parseFloat(e.target.value));
                markLabCompleted('sampling');
              }}
              style={{ width: '100%' }}
            />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
              Penalizes tokens based on their existing frequency in text to reduce verbatim repetition.
            </span>
          </div>
        </div>

        {/* Live Output Simulation Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            padding: '1.25rem',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-darker)',
            border: '1px solid var(--border-color)',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: '#fff', fontSize: '0.9rem' }}>Generated Output Simulation:</strong>
              <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>● Live Preview</span>
            </div>

            <div style={{
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: '#05070a',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              flexGrow: 1
            }}>
              {getSimulatedText()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
