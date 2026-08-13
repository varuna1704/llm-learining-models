import React, { useState, useCallback } from 'react';
import { MODELS, MODELS_LAST_UPDATED } from '../data/models';
import type { AIModel } from '../data/models';
import { useDebounce } from '../hooks/useDebounce';
import { ToastContainer, type ToastMessage } from './ToastContainer';

interface ModelOutputComparison {
  prompt: string;
  gpt4o: string;
  claude: string;
  gemini: string;
  llama: string;
  deepseek: string;
}

const COMPARISON_PROMPTS: ModelOutputComparison[] = [
  {
    prompt: 'Explain quantum computing in 2 concise sentences.',
    gpt4o: 'Quantum computing leverages subatomic principles like superposition and entanglement to process complex data exponentially faster than classical computers. Rather than using binary bits, it processes quantum bits (qubits) that can exist simultaneously in multiple states.',
    claude: 'Unlike classical computers that process information in binary bits (0s and 1s), quantum computers use qubits capable of existing in multiple states at once through superposition. This allows them to perform complex calculations in parallel, revolutionizing fields like cryptography, material science, and optimization.',
    gemini: 'Quantum computing is a non-classical computing paradigm where qubits can represent both 0 and 1 simultaneously thanks to superposition and entanglement. This enables unprecedented parallel processing power for scientific simulations and mathematical factorization.',
    llama: 'Quantum computers use quantum bits (qubits) that leverage superposition and entanglement to calculate multiple possibilities at once. This allows them to solve specific complex algorithms far beyond the capacity of traditional supercomputers.',
    deepseek: 'Thought process: User requested 2 sentences explaining quantum computing.\nSentence 1: Focus on qubits and superposition.\nSentence 2: Focus on entanglement and speed.\n\nQuantum computing is an advanced computing technology that uses quantum bits (qubits) capable of superposition to process complex mathematical calculations simultaneously. Through quantum entanglement, qubits instantly correlate state information, enabling massive parallel speedups for cryptography and molecular simulation.'
  },
  {
    prompt: 'Write a Python function to check if a string is a palindrome.',
    gpt4o: '```python\ndef is_palindrome(s: str) -> bool:\n    cleaned = "".join(c.lower() for c in s if c.isalnum())\n    return cleaned == cleaned[::-1]\n```',
    claude: '```python\ndef is_palindrome(text: str) -> bool:\n    """Check if a string is a palindrome, ignoring non-alphanumeric chars."""\n    clean_text = [char.lower() for char in text if char.isalnum()]\n    return clean_text == clean_text[::-1]\n```',
    gemini: '```python\ndef is_palindrome(s: str) -> bool:\n    s = "".join(filter(str.isalnum, s)).lower()\n    return s == s[::-1]\n```',
    llama: '```python\ndef is_palindrome(text):\n    filtered = \'\'.join(c.lower() for c in text if c.isalnum())\n    return filtered == filtered[::-1]\n```',
    deepseek: '```python\n# DeepSeek Reasoning: Strip non-alphanumeric, lowercase, compare reverse\ndef is_palindrome(s: str) -> bool:\n    left, right = 0, len(s) - 1\n    while left < right:\n        while left < right and not s[left].isalnum(): left += 1\n        while left < right and not s[right].isalnum(): right -= 1\n        if s[left].lower() != s[right].lower(): return False\n        left += 1\n        right -= 1\n    return True\n```'
  }
];

export const ModelLibrary: React.FC = () => {
  const [viewMode, setViewMode] = useState<'specs' | 'output_comparison'>('specs');
  const [selectedPromptIdx, setSelectedPromptIdx] = useState(0);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);

  const [providerFilter, setProviderFilter] = useState('All');
  const [weightFilter, setWeightFilter] = useState('All');
  const [modalityFilter, setModalityFilter] = useState('All');
  const [selectedModels, setSelectedModels] = useState<AIModel[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [visibleLimit, setVisibleLimit] = useState(12);

  const addToast = useCallback((message: string, type: 'info' | 'error' | 'success' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const handleDismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const providers = ['All', ...Array.from(new Set(MODELS.map(m => m.provider)))];

  const filteredModels = MODELS.filter(model => {
    const query = debouncedSearch.toLowerCase().trim();
    const matchesSearch =
      !query ||
      model.name.toLowerCase().includes(query) ||
      model.provider.toLowerCase().includes(query) ||
      model.strengths.some(s => s.toLowerCase().includes(query));

    const matchesProvider = providerFilter === 'All' || model.provider === providerFilter;
    const matchesWeight =
      weightFilter === 'All' ||
      (weightFilter === 'Open Weights' && model.isOpenWeight) ||
      (weightFilter === 'Closed API' && !model.isOpenWeight);
    const matchesModality =
      modalityFilter === 'All' ||
      (modalityFilter === 'Omnimodal' && model.modality.includes('Omni')) ||
      (modalityFilter === 'Multimodal' && model.modality.includes('Multi')) ||
      (modalityFilter === 'Text Only' && model.modality === 'Text Only');

    return matchesSearch && matchesProvider && matchesWeight && matchesModality;
  });

  const visibleModels = filteredModels.slice(0, visibleLimit);

  const handleSelectModel = (model: AIModel) => {
    if (selectedModels.find(m => m.id === model.id)) {
      setSelectedModels(prev => prev.filter(m => m.id !== model.id));
    } else {
      if (selectedModels.length >= 4) {
        addToast('You can compare a maximum of 4 models at one time.', 'error');
        return;
      }
      setSelectedModels(prev => [...prev, model]);
      addToast(`Added ${model.name} to comparison pool.`, 'success');
    }
  };

  const handleRemoveCompare = (modelId: string) => {
    setSelectedModels(prev => prev.filter(m => m.id !== modelId));
  };

  const getProviderColor = (provider: string): string => {
    switch (provider.toLowerCase()) {
      case 'openai': return '#10a37f';
      case 'anthropic': return '#d97706';
      case 'google': return '#4285f4';
      case 'meta': return '#06b6d4';
      case 'deepseek': return '#3b82f6';
      case 'mistral': return '#f43f5e';
      case 'alibaba': return '#f59e0b';
      case 'microsoft': return '#10b981';
      case 'stability ai': return '#ec4899';
      case 'black forest labs': return '#8b5cf6';
      case 'xai': return '#6366f1';
      default: return 'var(--color-primary)';
    }
  };

  const currentComp = COMPARISON_PROMPTS[selectedPromptIdx];

  return (
    <div className="library-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', width: '100%', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ color: '#fff', fontSize: '1.3rem', fontFamily: 'var(--font-display)', margin: 0 }}>
            ⚡ AI Model Directory & Prompt Comparison
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Compare specifications or test same-prompt output generation across frontier models. (Last Verified: <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{MODELS_LAST_UPDATED}</span>)
          </span>
        </div>

        {/* View Mode Switcher */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn ${viewMode === 'specs' ? 'btn-primary' : ''}`}
            onClick={() => setViewMode('specs')}
            style={{ fontSize: '0.8rem', fontWeight: 600 }}
          >
            📊 Specifications Directory
          </button>
          <button
            className={`btn ${viewMode === 'output_comparison' ? 'btn-primary' : ''}`}
            onClick={() => setViewMode('output_comparison')}
            style={{ fontSize: '0.8rem', fontWeight: 600 }}
          >
            💬 Prompt Response Playground
          </button>
        </div>
      </div>

      {viewMode === 'output_comparison' ? (
        /* Prompt Output Comparison Playground */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
              Select Prompt Scenario to Compare:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {COMPARISON_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  className={`btn ${selectedPromptIdx === idx ? 'btn-primary' : ''}`}
                  onClick={() => setSelectedPromptIdx(idx)}
                  style={{ fontSize: '0.8rem' }}
                >
                  "{p.prompt.slice(0, 35)}..."
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--bg-darker)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.95rem' }}>
            <strong style={{ color: 'var(--color-accent)', fontSize: '0.8rem', display: 'block', marginBottom: '0.2rem' }}>Input Prompt:</strong>
            "{currentComp.prompt}"
          </div>

          {/* Model Response Matrix Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem' }}>
            {/* GPT-4o */}
            <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid #10a37f' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: '#10a37f', fontSize: '0.95rem' }}>GPT-4o</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>OpenAI</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, whiteSpace: 'pre-wrap' }}>
                {currentComp.gpt4o}
              </p>
            </div>

            {/* Claude 3.5 Sonnet */}
            <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid #d97706' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: '#d97706', fontSize: '0.95rem' }}>Claude 3.5 Sonnet</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Anthropic</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, whiteSpace: 'pre-wrap' }}>
                {currentComp.claude}
              </p>
            </div>

            {/* Gemini 2.0 Flash */}
            <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid #4285f4' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: '#4285f4', fontSize: '0.95rem' }}>Gemini 2.0 Flash</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Google</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, whiteSpace: 'pre-wrap' }}>
                {currentComp.gemini}
              </p>
            </div>

            {/* Llama 3.1 70B */}
            <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid #06b6d4' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: '#06b6d4', fontSize: '0.95rem' }}>Llama 3.1 70B</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Meta (Open Weight)</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, whiteSpace: 'pre-wrap' }}>
                {currentComp.llama}
              </p>
            </div>

            {/* DeepSeek-R1 */}
            <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid #3b82f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: '#3b82f6', fontSize: '0.95rem' }}>DeepSeek-R1</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>DeepSeek (Reasoning)</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, whiteSpace: 'pre-wrap' }}>
                {currentComp.deepseek}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Specifications Directory View */
        <>
          {/* Search and Filters */}
          <div className="library-filters">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="library-search"
                role="combobox"
                aria-expanded={false}
                aria-autocomplete="list"
                aria-label="Search model directory"
                placeholder="Search by model name, provider, or strengths (e.g. coding, reasoning)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <span className="filter-label">Provider</span>
              <select
                className="select-input"
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
              >
                {providers.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <span className="filter-label">Access</span>
              <select
                className="select-input"
                value={weightFilter}
                onChange={(e) => setWeightFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Open Weights">Open Weights</option>
                <option value="Closed API">Closed API</option>
              </select>
            </div>

            <div className="filter-group">
              <span className="filter-label">Modality</span>
              <select
                className="select-input"
                value={modalityFilter}
                onChange={(e) => setModalityFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Text Only">Text Only</option>
                <option value="Multimodal">Multimodal</option>
                <option value="Omnimodal">Omnimodal</option>
              </select>
            </div>
          </div>

          {/* Model Cards Grid */}
          <div className="models-grid" role="grid" aria-label="AI Model Directory">
            {visibleModels.map(model => {
              const isCompared = !!selectedModels.find(m => m.id === model.id);
              const borderStyle = {
                '--provider-color': getProviderColor(model.provider)
              } as React.CSSProperties;

              return (
                <div
                  key={model.id}
                  className="model-card"
                  role="row"
                  style={borderStyle}
                >
                  <div className="model-card-header">
                    <div className="model-title-block">
                      <span className="model-provider">{model.provider}</span>
                      <h4 className="model-name">{model.name}</h4>
                    </div>
                    <span className={`weight-badge ${model.isOpenWeight ? 'open' : 'closed'}`}>
                      {model.isOpenWeight ? 'Open Weight' : 'Closed API'}
                    </span>
                  </div>

                  <div className="model-why-matters">
                    {model.whyItMatters}
                  </div>

                  <div className="model-strengths">
                    {model.strengths.slice(0, 3).map((st, i) => (
                      <span key={i} className="strength-tag">{st}</span>
                    ))}
                    {model.strengths.length > 3 && (
                      <span className="strength-tag" style={{ color: 'var(--text-muted)', backgroundColor: 'transparent' }}>
                        +{model.strengths.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="model-specs">
                    <span className="spec-pill">
                      Context: {model.contextWindow === 0 ? 'N/A' : `${model.contextWindow}k`}
                    </span>
                    <span className="spec-pill">
                      {model.modality}
                    </span>
                    {model.pricePerMillionInput > 0 ? (
                      <span className="spec-pill">
                        ${model.pricePerMillionInput.toFixed(2)} / M input
                      </span>
                    ) : (
                      <span className="spec-pill">Free/Local</span>
                    )}
                  </div>

                  <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Released: {model.releaseDate}
                    </span>
                    <label className="compare-checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={isCompared}
                        onChange={() => handleSelectModel(model)}
                      />
                      <span>Compare</span>
                    </label>
                  </div>
                </div>
              );
            })}

            {filteredModels.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No models found matching your search and filter criteria.
              </div>
            )}
          </div>

          {/* Floating Compare Action Bar */}
          {selectedModels.length > 0 && (
            <div className="compare-bar">
              <div className="compare-bar-text">
                Comparing <span style={{ color: 'var(--color-primary)', fontWeight: '700' }}>{selectedModels.length}</span> of 4 models
              </div>

              {visibleLimit < filteredModels.length && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => setVisibleLimit(prev => prev + 12)}
                    style={{ padding: '0.6rem 1.5rem', fontWeight: 600 }}
                  >
                    Load More Models ({filteredModels.length - visibleLimit} remaining)
                  </button>
                </div>
              )}
              <div className="compare-chips">
                {selectedModels.map(model => (
                  <div key={model.id} className="compare-chip">
                    {model.name}
                    <button
                      className="compare-chip-remove"
                      onClick={() => handleRemoveCompare(model.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setIsCompareOpen(true)}
              >
                Compare Side-by-Side
              </button>
            </div>
          )}

          {/* Comparison Modal */}
          {isCompareOpen && (
            <div className="compare-modal-backdrop" onClick={() => setIsCompareOpen(false)}>
              <div className="compare-modal" onClick={(e) => e.stopPropagation()}>
                <div className="compare-modal-header">
                  <h3 className="compare-modal-title">Model Specification Comparison Matrix</h3>
                  <button className="panel-close-btn" style={{ fontSize: '1.5rem' }} onClick={() => setIsCompareOpen(false)}>×</button>
                </div>

                <div className="compare-modal-body">
                  <table className="compare-table">
                    <thead>
                      <tr>
                        <th>Specification</th>
                        {selectedModels.map(model => (
                          <th key={model.id}>
                            <div className="compare-table-model-name">{model.name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{model.provider}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Release Date</td>
                        {selectedModels.map(model => (
                          <td key={model.id}>{model.releaseDate}</td>
                        ))}
                      </tr>
                      <tr>
                        <td>Context Size</td>
                        {selectedModels.map(model => (
                          <td key={model.id} style={{ fontWeight: '600' }}>
                            {model.contextWindow === 0 ? 'Not Applicable' : `${model.contextWindow.toLocaleString()}k tokens`}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td>Access Type</td>
                        {selectedModels.map(model => (
                          <td key={model.id}>
                            <span className={`weight-badge ${model.isOpenWeight ? 'open' : 'closed'}`} style={{ display: 'inline-block' }}>
                              {model.isOpenWeight ? 'Open weights' : 'Closed API'}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td>Modality</td>
                        {selectedModels.map(model => (
                          <td key={model.id}>{model.modality}</td>
                        ))}
                      </tr>
                      <tr>
                        <td>Pricing (Per 1M Tokens)</td>
                        {selectedModels.map(model => (
                          <td key={model.id}>
                            {model.pricePerMillionInput > 0 ? (
                              <div style={{ fontSize: '0.8rem' }}>
                                <div>Input: <strong>${model.pricePerMillionInput.toFixed(2)}</strong></div>
                                <div>Output: <strong>${model.pricePerMillionOutput.toFixed(2)}</strong></div>
                              </div>
                            ) : (
                              <strong style={{ color: '#34d399' }}>Free / Local</strong>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td>Primary Strengths</td>
                        {selectedModels.map(model => (
                          <td key={model.id}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                              {model.strengths.map((s, idx) => (
                                <span key={idx} className="strength-tag" style={{ fontSize: '0.65rem' }}>{s}</span>
                              ))}
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td>Why it matters</td>
                        {selectedModels.map(model => (
                          <td key={model.id} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                            {model.whyItMatters}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Non-blocking Toast Queue */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
};
