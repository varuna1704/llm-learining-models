import React from 'react';
import { LlmPipelinePreview } from './LlmPipelinePreview';
import { CURRICULUM } from '../../data/curriculum';
import { loadUserProgress } from '../../data/progress';

interface HomepageProps {
  onNavigateTab: (tab: 'diagrams' | 'labs' | 'models', subItem?: string) => void;
  onOpenProgress: () => void;
}

const ROADMAP_STEPS = [
  { id: 'intro', label: '1. Introduction', desc: 'Core Concepts & Terminology' },
  { id: 'ai', label: '2. Artificial Intelligence', desc: 'Symbolic AI to Modern ML' },
  { id: 'ml', label: '3. Machine Learning', desc: 'Supervised & Unsupervised Learning' },
  { id: 'dl', label: '4. Deep Learning', desc: 'Neural Network Backpropagation' },
  { id: 'nn', label: '5. Neural Networks', desc: 'Perceptrons & Activation Functions' },
  { id: 'transformers', label: '6. Transformers', desc: 'Self-Attention & Positional Encoding' },
  { id: 'llms', label: '7. Large Language Models', desc: 'BPE Tokens & Autoregressive Decoding' },
  { id: 'chatgpt', label: '8. How ChatGPT Works', desc: 'RLHF, SFT & System Prompts' },
  { id: 'advanced', label: '9. Advanced AI Systems', desc: 'MoE, FlashAttention & Inference' },
  { id: 'agents', label: '10. AI Agents', desc: 'ReAct Loops & Tool Dispatching' },
  { id: 'rag', label: '11. RAG Systems', desc: 'Vector DBs & Chunk Retrieval' },
  { id: 'prompting', label: '12. Prompt Engineering', desc: 'Few-shot & Chain-of-Thought' },
  { id: 'security', label: '13. Security & Safety', desc: 'Prompt Injections & Mitigations' },
  { id: 'evaluation', label: '14. Evaluation & Evals', desc: 'LLM-as-a-Judge & Benchmark Metrics' },
  { id: 'projects', label: '15. Real Projects', desc: 'Production Deployment & Monitoring' }
];

const FEATURED_LABS = [
  { id: 'tokenizer', title: 'Tokenizer Lab', icon: '🪙', desc: 'Splits raw sentences into BPE tokens and numerical IDs.' },
  { id: 'embedding', title: 'Embedding Playground', icon: '📐', desc: 'Map words into 2D/3D high-dimensional semantic spaces.' },
  { id: 'attention', title: 'Self-Attention Simulator', icon: '👁️', desc: 'Visualize query-key dot-product weight arcs between words.' },
  { id: 'sampling', title: 'Sampling & Temperature', icon: '🎲', desc: 'Tweak Temperature, Top-K, and Top-P probability distributions.' },
  { id: 'rag', title: 'RAG Pipeline Simulator', icon: '🔍', desc: 'Chunk documents, generate vector embeddings, and inject context.' },
  { id: 'agent', title: 'ReAct AI Agent Loop', icon: '🤖', desc: 'Watch autonomous agent planning, tool execution, and observations.' }
];

export const Homepage: React.FC<HomepageProps> = ({ onNavigateTab, onOpenProgress }) => {
  const progress = loadUserProgress();

  return (
    <div style={{ padding: '2rem', overflowY: 'auto', flexGrow: 1, backgroundColor: 'var(--bg-darker)' }}>
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        padding: '3rem 1.5rem',
        borderRadius: '16px',
        background: 'radial-gradient(circle at top, rgba(139, 92, 246, 0.15) 0%, rgba(15, 17, 26, 0.95) 70%)',
        border: '1px solid var(--border-color)',
        marginBottom: '2.5rem',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.35rem 0.8rem',
          borderRadius: '20px',
          backgroundColor: 'rgba(6, 182, 212, 0.12)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          color: 'var(--color-accent)',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '1rem'
        }}>
          🎓 Interactive Textbook + Laboratory + Visual Simulator
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.8rem',
          fontWeight: 800,
          lineHeight: 1.2,
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #c084fc 50%, #38bdf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Learn How Large Language Models<br />Actually Work Internally
        </h1>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1.1rem',
          maxWidth: '750px',
          margin: '0 auto 2rem auto',
          lineHeight: 1.6
        }}>
          Go beyond black-box chatbot APIs. Visually dissect tokenizers, high-dimensional vector embeddings, multi-head self-attention matrices, softmax logits, RAG pipelines, and autonomous AI agent loops through hands-on interactive laboratories.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={() => onNavigateTab('labs')}
            style={{ padding: '0.8rem 1.8rem', fontSize: '1rem', fontWeight: 700, borderRadius: '8px' }}
          >
            🧪 Enter Interactive Labs
          </button>
          <button
            className="btn"
            onClick={() => onNavigateTab('diagrams')}
            style={{ padding: '0.8rem 1.8rem', fontSize: '1rem', fontWeight: 600, borderRadius: '8px' }}
          >
            📊 Explore Flowcharts
          </button>
          <button
            className="btn"
            onClick={onOpenProgress}
            style={{ padding: '0.8rem 1.2rem', fontSize: '0.9rem', borderRadius: '8px', borderColor: '#f59e0b', color: '#f59e0b' }}
          >
            🏆 Progress (Streak: {progress.streakDays}🔥)
          </button>
        </div>
      </div>

      {/* Interactive LLM Pipeline Simulator */}
      <LlmPipelinePreview />

      {/* Structured Learning Roadmap */}
      <div style={{ margin: '3rem 0' }}>
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#fff', marginBottom: '0.5rem' }}>
            🗺️ University-Grade Learning Path
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            A step-by-step structured curriculum starting from fundamental AI math to advanced autonomous multi-agent orchestration.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1rem'
        }}>
          {ROADMAP_STEPS.map((step, idx) => (
            <div
              key={step.id}
              onClick={() => onNavigateTab('diagrams')}
              style={{
                padding: '1rem',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '0.65rem', color: 'var(--color-accent)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Step {idx + 1}
              </div>
              <h5 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                {step.label.replace(/^\d+\.\s*/, '')}
              </h5>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Simulators & Labs */}
      <div style={{ margin: '3rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#fff' }}>
              🔬 Featured Interactive Laboratories
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Hands-on visual playgrounds designed to build intuition through real-time experimentation.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => onNavigateTab('labs')}
            style={{ fontSize: '0.85rem' }}
          >
            View All 14 Labs →
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.2rem'
        }}>
          {FEATURED_LABS.map((lab) => (
            <div
              key={lab.id}
              onClick={() => onNavigateTab('labs', lab.id)}
              style={{
                padding: '1.25rem',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.8rem' }}>{lab.icon}</span>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                  {lab.title}
                </h4>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.4, margin: 0 }}>
                {lab.desc}
              </p>
              <span style={{ color: 'var(--color-accent)', fontSize: '0.78rem', fontWeight: 600, marginTop: 'auto', paddingTop: '0.5rem' }}>
                Launch Simulator ➜
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Curriculum Chapters */}
      <div style={{ margin: '3rem 0' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#fff' }}>
            📚 13 Core Flowchart Chapters
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Hand-crafted SVG diagram flowcharts with clickable nodes, ELI5 explanation depth, and quizzes.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem'
        }}>
          {CURRICULUM.map((topic, index) => (
            <div
              key={topic.id}
              onClick={() => onNavigateTab('diagrams', topic.slug)}
              style={{
                padding: '1.2rem',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <div style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.2rem' }}>
                Chapter {index + 1}
              </div>
              <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                📊 {topic.title}
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>
                {topic.summary}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Learn LLM Internals Section */}
      <div style={{
        padding: '2.5rem',
        borderRadius: '16px',
        backgroundColor: 'var(--bg-dark)',
        border: '1px solid var(--border-color)',
        margin: '3rem 0'
      }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#fff', marginBottom: '1.5rem', textAlign: 'center' }}>
          💡 Why Learn LLM Internals First?
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}>
          <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>🎯</div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Debug Hallucinations</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Understanding next-token probability distributions reveals exactly why models invent facts and how temperature affects predictability.
            </p>
          </div>

          <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>⚡</div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Architect Production RAG</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Mastering chunking, cosine distance, and vector DB indices helps you build retrieval systems with high precision and low latency.
            </p>
          </div>

          <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>🤖</div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Build Autonomous Agents</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Seeing function-calling schemas and ReAct planning loops in motion gives you the mental model needed to build real multi-agent software.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
