import React, { useState } from 'react';
import { markLabCompleted } from '../../data/progress';

interface AgentStep {
  step: number;
  phase: 'Thought' | 'Action' | 'Observation' | 'Final Answer';
  content: string;
  icon: string;
  color: string;
}

const SAMPLE_AGENT_TRACE: AgentStep[] = [
  {
    step: 1,
    phase: 'Thought',
    content: 'The user wants to know the current weather in Tokyo and convert 100 USD to JPY. I need to call the weather API and currency API.',
    icon: '🧠',
    color: '#8b5cf6'
  },
  {
    step: 2,
    phase: 'Action',
    content: 'Call tool `get_weather(city="Tokyo")` and `get_exchange_rate(from="USD", to="JPY")`.',
    icon: '🛠️',
    color: '#06b6d4'
  },
  {
    step: 3,
    phase: 'Observation',
    content: 'Weather API: 22°C, Partly Cloudy. Currency API: 1 USD = 154.5 JPY.',
    icon: '👁️',
    color: '#f59e0b'
  },
  {
    step: 4,
    phase: 'Thought',
    content: 'I now have all necessary observations to form the final answer. 100 USD equals 15,450 JPY.',
    icon: '🧠',
    color: '#8b5cf6'
  },
  {
    step: 5,
    phase: 'Final Answer',
    content: 'The current weather in Tokyo is 22°C and partly cloudy. 100 USD is currently equal to 15,450 JPY.',
    icon: '✨',
    color: '#10b981'
  }
];

export const AgentLab: React.FC = () => {
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);

  const currentStep = SAMPLE_AGENT_TRACE[activeStepIdx];

  return (
    <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'var(--font-display)' }}>
          🤖 ReAct Autonomous AI Agent Simulator
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          AI Agents use the ReAct framework (Reason + Act + Observe) to execute multi-step plans using external tools and APIs.
        </p>
      </div>

      {/* Execution Controls */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {SAMPLE_AGENT_TRACE.map((s, idx) => (
          <button
            key={idx}
            className={`btn ${activeStepIdx === idx ? 'btn-primary' : ''}`}
            onClick={() => {
              setActiveStepIdx(idx);
              markLabCompleted('agent');
            }}
            style={{ fontSize: '0.78rem' }}
          >
            Step {s.step}: {s.phase}
          </button>
        ))}
      </div>

      {/* Step Inspector Card */}
      <div style={{
        padding: '1.25rem',
        borderRadius: '10px',
        backgroundColor: 'var(--bg-darker)',
        border: `1.5px solid ${currentStep.color}`,
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '1.8rem' }}>{currentStep.icon}</span>
          <div>
            <span style={{ fontSize: '0.7rem', color: currentStep.color, fontWeight: 800, textTransform: 'uppercase' }}>
              Phase {currentStep.step} of 5
            </span>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', fontFamily: 'var(--font-display)', margin: 0 }}>
              {currentStep.phase}
            </h4>
          </div>
        </div>

        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          backgroundColor: '#05070a',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
          fontSize: '0.9rem',
          lineHeight: 1.5
        }}>
          {currentStep.content}
        </div>
      </div>

      {/* Next/Prev Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          className="btn"
          disabled={activeStepIdx === 0}
          onClick={() => setActiveStepIdx(prev => Math.max(0, prev - 1))}
          style={{ opacity: activeStepIdx === 0 ? 0.5 : 1 }}
        >
          ← Previous Step
        </button>

        <button
          className="btn btn-primary"
          disabled={activeStepIdx === SAMPLE_AGENT_TRACE.length - 1}
          onClick={() => {
            setActiveStepIdx(prev => Math.min(SAMPLE_AGENT_TRACE.length - 1, prev + 1));
            markLabCompleted('agent');
          }}
          style={{ opacity: activeStepIdx === SAMPLE_AGENT_TRACE.length - 1 ? 0.5 : 1 }}
        >
          Next Step ➔
        </button>
      </div>
    </div>
  );
};
