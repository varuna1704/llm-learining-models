import React, { useState } from 'react';
import { TokenizerLab } from './TokenizerLab';
import { EmbeddingLab } from './EmbeddingLab';
import { PositionalEncodingLab } from './PositionalEncodingLab';
import { SelfAttentionLab } from './SelfAttentionLab';
import { MultiHeadAttentionLab } from './MultiHeadAttentionLab';
import { TransformerBlockLab } from './TransformerBlockLab';
import { NextTokenPredictionLab } from './NextTokenPredictionLab';
import { SamplingLab } from './SamplingLab';
import { ContextWindowLab } from './ContextWindowLab';
import { RagLab } from './RagLab';
import { AgentLab } from './AgentLab';
import { PromptEngineeringLab } from './PromptEngineeringLab';
import { HallucinationLab } from './HallucinationLab';
import { PromptInjectionLab } from './PromptInjectionLab';
import { loadUserProgress } from '../../data/progress';

interface LabMeta {
  id: string;
  title: string;
  category: string;
  icon: string;
  desc: string;
  component: React.ReactNode;
}

const LABS: LabMeta[] = [
  { id: 'tokenizer', title: 'Tokenizer Lab', category: 'Fundamentals', icon: '🪙', desc: 'BPE, WordPiece, and SentencePiece token splitters with token IDs.', component: <TokenizerLab /> },
  { id: 'embedding', title: 'Embedding Playground', category: 'Fundamentals', icon: '📐', desc: '2D/3D vector coordinate visualizer & cosine similarity math.', component: <EmbeddingLab /> },
  { id: 'positional', title: 'Positional Encoding', category: 'Architecture', icon: '📍', desc: 'Sine & cosine positional frequency waves added to embeddings.', component: <PositionalEncodingLab /> },
  { id: 'attention', title: 'Self-Attention Simulator', category: 'Architecture', icon: '👁️', desc: 'Interactive Query-Key dot-product attention weight arcs.', component: <SelfAttentionLab /> },
  { id: 'multihead', title: 'Multi-Head Attention', category: 'Architecture', icon: '🎭', desc: 'Color-coded head specialization matrices and head selectors.', component: <MultiHeadAttentionLab /> },
  { id: 'transformer', title: 'Transformer Block', category: 'Architecture', icon: '🧱', desc: 'Exploded architecture block showing Residual Add & LayerNorm.', component: <TransformerBlockLab /> },
  { id: 'nexttoken', title: 'Next-Token Prediction', category: 'Inference', icon: '📈', desc: 'Logit generation and Softmax probability distributions.', component: <NextTokenPredictionLab /> },
  { id: 'sampling', title: 'Decoding & Sampling', category: 'Inference', icon: '🎲', desc: 'Live sliders for Temperature, Top-K, Top-P, and Penalties.', component: <SamplingLab /> },
  { id: 'context', title: 'Context Window & Memory', category: 'Inference', icon: '🧠', desc: 'Sliding KV-cache memory limits and token eviction.', component: <ContextWindowLab /> },
  { id: 'rag', title: 'RAG Pipeline Simulator', category: 'Advanced Systems', icon: '🔍', desc: 'Document chunking, vector DB search, and prompt augmentation.', component: <RagLab /> },
  { id: 'agent', title: 'ReAct AI Agent Loop', category: 'Advanced Systems', icon: '🤖', desc: 'Autonomous Plan → Act → Observe → Memory reasoning loops.', component: <AgentLab /> },
  { id: 'prompting', title: 'Prompt Engineering', category: 'Applied Techniques', icon: '✍️', desc: 'Side-by-side Bad vs Good vs Expert prompt evaluator.', component: <PromptEngineeringLab /> },
  { id: 'hallucination', title: 'Hallucination Simulator', category: 'Safety & Security', icon: '⚠️', desc: 'Plausible generation vs missing knowledge demonstration.', component: <HallucinationLab /> },
  { id: 'security', title: 'Prompt Injection Security', category: 'Safety & Security', icon: '🛡️', desc: 'Direct/indirect injection attacks and guardrail isolation.', component: <PromptInjectionLab /> }
];

interface LabIndexProps {
  initialLabId?: string;
}

export const LabIndex: React.FC<LabIndexProps> = ({ initialLabId = 'tokenizer' }) => {
  const [activeLabId, setActiveLabId] = useState<string>(initialLabId);
  const progress = loadUserProgress();

  const activeLab = LABS.find(l => l.id === activeLabId) || LABS[0];

  return (
    <div style={{ padding: '2rem', overflowY: 'auto', flexGrow: 1, backgroundColor: 'var(--bg-darker)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#fff' }}>
            🧪 Interactive LLM Engineering Laboratories
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            14 hands-on visual simulators designed to build intuitive understanding of model internals.
          </p>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--color-accent)', backgroundColor: 'var(--bg-dark)', padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontWeight: 600 }}>
          Completed: {progress.completedLabs.length} / {LABS.length} Labs
        </div>
      </div>

      {/* Lab Category Pills Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.8rem',
        marginBottom: '1.5rem'
      }}>
        {LABS.map((lab) => {
          const isActive = lab.id === activeLabId;
          const isCompleted = progress.completedLabs.includes(lab.id);

          return (
            <button
              key={lab.id}
              onClick={() => setActiveLabId(lab.id)}
              style={{
                padding: '0.5rem 0.8rem',
                borderRadius: '8px',
                backgroundColor: isActive ? 'var(--color-primary)' : 'var(--bg-card)',
                color: '#fff',
                border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--border-color)'}`,
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{lab.icon}</span>
              <span>{lab.title}</span>
              {isCompleted && <span style={{ fontSize: '0.65rem', color: '#34d399' }}>✓</span>}
            </button>
          );
        })}
      </div>

      {/* Active Lab Component Workspace */}
      <div style={{ width: '100%' }}>
        {activeLab.component}
      </div>
    </div>
  );
};
