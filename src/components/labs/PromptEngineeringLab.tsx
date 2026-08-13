import React, { useState } from 'react';
import { markLabCompleted } from '../../data/progress';

interface PromptPreset {
  tier: 'Bad' | 'Average' | 'Good' | 'Professional';
  score: number;
  prompt: string;
  response: string;
  analysis: string;
  color: string;
}

const PRESETS: PromptPreset[] = [
  {
    tier: 'Bad',
    score: 20,
    prompt: 'Write about RAG.',
    response: 'RAG stands for Retrieval Augmented Generation. It is used in artificial intelligence to retrieve documents and answer questions.',
    analysis: 'Lacks context, formatting requirements, persona, target audience, and output structural constraints.',
    color: '#ef4444'
  },
  {
    tier: 'Average',
    score: 55,
    prompt: 'Explain Retrieval-Augmented Generation (RAG) in AI for a software developer in a couple paragraphs.',
    response: 'Retrieval-Augmented Generation (RAG) is an architectural pattern that enhances Large Language Models by connecting them to external vector databases...',
    analysis: 'Defines target persona and length, but lacks step-by-step reasoning constraints, negative constraints, and code snippets.',
    color: '#f59e0b'
  },
  {
    tier: 'Good',
    score: 80,
    prompt: 'You are a Senior AI Architect. Explain RAG architecture to a junior developer. Include: 1) What it solves, 2) The 4 main steps (Chunk, Embed, Retrieve, Augment), and 3) A short Python pseudocode block.',
    response: '### RAG Architecture Overview\n\n#### 1) Problem Solved\nLLMs suffer from hallucinations and outdated training cutoff dates...',
    analysis: 'Clear role assignment, structured output requirements, numbered list items, and code requirement.',
    color: '#06b6d4'
  },
  {
    tier: 'Professional',
    score: 98,
    prompt: '<system_instruction>You are a Principal AI Infrastructure Engineer. Respond strictly in markdown.</system_instruction>\n\n<task>\nCompare RAG vs Fine-tuning for enterprise knowledge bases.\n</task>\n\n<constraints>\n- Format as a comparison table across: Cost, Latency, Data Freshness, and Hallucination Risk.\n- Provide a decision matrix on when to choose RAG vs Fine-tuning.\n- Do NOT use vague buzzwords.\n</constraints>',
    response: '### Enterprise Knowledge Architecture Matrix\n\n| Attribute | RAG | Fine-Tuning |\n|---|---|---|\n| Cost | Low | High |\n| Data Freshness | Real-time | Static |\n| Hallucination Risk | Minimal | Moderate |\n...',
    analysis: 'Industry-grade XML tagging, system-instruction isolation, explicit negative constraints, and structured table format.',
    color: '#10b981'
  }
];

export const PromptEngineeringLab: React.FC = () => {
  const [activeTier, setActiveTier] = useState<'Bad' | 'Average' | 'Good' | 'Professional'>('Professional');

  const current = PRESETS.find(p => p.tier === activeTier) || PRESETS[3];

  return (
    <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'var(--font-display)' }}>
          ✍️ Interactive Prompt Engineering Evaluator
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Compare prompt structures across 4 maturity tiers to see how role assignment, XML tagging, and negative constraints improve output precision.
        </p>
      </div>

      {/* Tier Selector Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {PRESETS.map((p) => {
          const isActive = p.tier === activeTier;
          return (
            <button
              key={p.tier}
              onClick={() => {
                setActiveTier(p.tier);
                markLabCompleted('prompting');
              }}
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                backgroundColor: isActive ? p.color : 'var(--bg-darker)',
                color: '#fff',
                border: `1px solid ${isActive ? '#fff' : 'var(--border-color)'}`,
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {p.tier} Prompt ({p.score}%)
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Prompt Input & Score */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--bg-darker)', border: `1px solid ${current.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong style={{ color: current.color, fontSize: '0.9rem' }}>Prompt Input ({current.tier}):</strong>
              <span style={{ fontSize: '0.8rem', color: current.color, fontWeight: 700 }}>Quality Score: {current.score}%</span>
            </div>
            <pre style={{
              padding: '0.8rem',
              borderRadius: '6px',
              backgroundColor: '#05070a',
              color: '#fff',
              fontFamily: 'monospace',
              fontSize: '0.82rem',
              whiteSpace: 'pre-wrap',
              margin: 0
            }}>
              {current.prompt}
            </pre>
          </div>

          <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}>
            <strong style={{ color: 'var(--color-accent)', fontSize: '0.8rem', display: 'block', marginBottom: '0.2rem' }}>
              💡 Architectural Analysis:
            </strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              {current.analysis}
            </p>
          </div>
        </div>

        {/* Model Output Simulation */}
        <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)' }}>
          <strong style={{ color: '#fff', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
            Model Generated Output:
          </strong>
          <div style={{
            padding: '1rem',
            borderRadius: '6px',
            backgroundColor: '#05070a',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap'
          }}>
            {current.response}
          </div>
        </div>
      </div>
    </div>
  );
};
