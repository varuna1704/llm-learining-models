import React, { useState } from 'react';
import { markLabCompleted } from '../../data/progress';

export const ContextWindowLab: React.FC = () => {
  const [maxContext, setMaxContext] = useState<number>(32); // Small window for visual demonstration
  const [prompt, setPrompt] = useState('Chapter 1: The journey began in a distant land. Chapter 2: The hero found a mysterious key inside the ancient cave. Chapter 3: Opening the door revealed a golden chest. Chapter 4: What was inside the chest?');

  const tokens = prompt.trim().split(/\s+/);
  const totalTokens = tokens.length;
  const isOverflowing = totalTokens > maxContext;
  const activeTokens = tokens.slice(Math.max(0, totalTokens - maxContext));
  const evictedTokens = isOverflowing ? tokens.slice(0, totalTokens - maxContext) : [];

  return (
    <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'var(--font-display)' }}>
          🧠 Context Window & KV-Cache Simulator
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          An LLM has a finite context window limit. When text exceeds this budget, the earliest tokens are evicted from memory, causing context loss.
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flexGrow: 1 }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
            Simulated Context Window Capacity:
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[16, 32, 64, 128].map((size) => (
              <button
                key={size}
                className={`btn ${maxContext === size ? 'btn-primary' : ''}`}
                onClick={() => {
                  setMaxContext(size);
                  markLabCompleted('transformer');
                }}
                style={{ fontSize: '0.75rem', fontWeight: 700 }}
              >
                {size} Tokens
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Active Memory: </span>
            <strong style={{ color: isOverflowing ? '#ef4444' : '#10b981' }}>{activeTokens.length} / {maxContext}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Evicted: </span>
            <strong style={{ color: '#ef4444' }}>{evictedTokens.length} tokens</strong>
          </div>
        </div>
      </div>

      {/* Input Text Area */}
      <div style={{ marginBottom: '1.5rem' }}>
        <textarea
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            markLabCompleted('transformer');
          }}
          rows={3}
          style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
        />
      </div>

      {/* Visual Memory Track */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Active Tokens Box */}
        <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <strong style={{ color: '#34d399', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
            🟢 Active Context Window (In Model Memory):
          </strong>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {activeTokens.map((tok, i) => (
              <span key={i} style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: '#10b981', color: '#fff', fontSize: '0.78rem', fontWeight: 600 }}>
                {tok}
              </span>
            ))}
          </div>
        </div>

        {/* Evicted Tokens Box */}
        {evictedTokens.length > 0 && (
          <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <strong style={{ color: '#f87171', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
              🔴 Evicted Tokens (Forgotten by Model):
            </strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', opacity: 0.7 }}>
              {evictedTokens.map((tok, i) => (
                <span key={i} style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: '#ef4444', color: '#fff', fontSize: '0.78rem', textDecoration: 'line-through' }}>
                  {tok}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
