import React, { useState } from 'react';
import { MODELS } from '../data/models';
import type { AIModel } from '../data/models';

export const ModelLibrary: React.FC = () => {
  const [search, setSearch] = useState('');
  const [providerFilter, setProviderFilter] = useState('All');
  const [weightFilter, setWeightFilter] = useState('All');
  const [modalityFilter, setModalityFilter] = useState('All');
  const [selectedModels, setSelectedModels] = useState<AIModel[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Extract unique providers for filters
  const providers = ['All', ...Array.from(new Set(MODELS.map(m => m.provider)))];

  // Filtering logic
  const filteredModels = MODELS.filter(model => {
    const matchesSearch =
      model.name.toLowerCase().includes(search.toLowerCase()) ||
      model.provider.toLowerCase().includes(search.toLowerCase()) ||
      model.strengths.some(s => s.toLowerCase().includes(search.toLowerCase()));

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

  const handleSelectModel = (model: AIModel) => {
    if (selectedModels.find(m => m.id === model.id)) {
      setSelectedModels(prev => prev.filter(m => m.id !== model.id));
    } else {
      if (selectedModels.length >= 4) {
        alert('You can compare a maximum of 4 models at one time.');
        return;
      }
      setSelectedModels(prev => [...prev, model]);
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

  return (
    <div className="library-container">
      {/* Search and Filters */}
      <div className="library-filters">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="library-search"
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
      <div className="models-grid">
        {filteredModels.map(model => {
          const isCompared = !!selectedModels.find(m => m.id === model.id);
          const borderStyle = {
            '--provider-color': getProviderColor(model.provider)
          } as React.CSSProperties;

          return (
            <div
              key={model.id}
              className="model-card"
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
    </div>
  );
};
