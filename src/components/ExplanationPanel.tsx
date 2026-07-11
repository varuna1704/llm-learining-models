import React, { useState, useEffect } from 'react';
import { GLOSSARY } from '../data/curriculum';
import type { DiagramNode } from '../data/curriculum';
import { TextWithGlossary } from './GlossaryTooltip';

interface ExplanationPanelProps {
  node: DiagramNode | null;
  isOpen: boolean;
  onClose: () => void;
  onHoverTerm: (termId: string, event: React.MouseEvent) => void;
  onLeaveTerm: () => void;
  onClickExploreSubDiagram?: (subDiagramId: string) => void;
  onAskTutor: (question: string) => void;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  node,
  isOpen,
  onClose,
  onHoverTerm,
  onLeaveTerm,
  onClickExploreSubDiagram,
  onAskTutor,
}) => {
  const [isSimple, setIsSimple] = useState(false);
  const [selectedGlossaryId, setSelectedGlossaryId] = useState<string | null>(null);

  // Reset toggles when node changes
  useEffect(() => {
    setIsSimple(false);
    setSelectedGlossaryId(null);
  }, [node]);

  if (!node) return (
    <div className={`explanation-panel ${isOpen ? 'open' : ''}`}>
      <div className="panel-header">
        <h3 className="panel-title">Select a Node</h3>
        <button className="panel-close-btn" onClick={onClose}>×</button>
      </div>
      <div className="panel-body" style={{ color: 'var(--text-muted)', textAlign: 'center', paddingTop: '4rem' }}>
        Click any node in the flowchart to explore how it works.
      </div>
    </div>
  );

  const nodeColorStyle = {
    backgroundColor: `var(--color-node-${node.type})`,
  };

  const handleTermClick = (termId: string) => {
    setSelectedGlossaryId(termId);
  };

  const handleBackToNode = () => {
    setSelectedGlossaryId(null);
  };

  // If a glossary detail is active, show the glossary page instead of the node explanation
  if (selectedGlossaryId) {
    const term = GLOSSARY[selectedGlossaryId];
    return (
      <div className={`explanation-panel ${isOpen ? 'open' : ''}`}>
        <div className="panel-header">
          <div className="panel-title-container">
            <span className="panel-type-badge" style={{ backgroundColor: 'var(--color-accent)' }}>
              Glossary Definition
            </span>
            <h3 className="panel-title">{term?.term}</h3>
          </div>
          <button className="panel-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="panel-body">
          <button className="btn" onClick={handleBackToNode} style={{ alignSelf: 'flex-start', marginBottom: '0.5rem' }}>
            ← Back to {node.label}
          </button>
          <div className="panel-short-desc">
            {term?.definition}
          </div>
          <div className="panel-long-desc">
            {term?.details}
          </div>
        </div>
        <div className="panel-footer">
          <button
            className="btn btn-primary"
            onClick={() => onAskTutor(`Explain ${term?.term} in detail`)}
          >
            Ask Tutor about {term?.term}
          </button>
        </div>
      </div>
    );
  }

  // Format HTML-like details (split paragraphs)
  const paragraphs = node.detailedExplanation.split('\n\n');

  return (
    <div className={`explanation-panel ${isOpen ? 'open' : ''}`}>
      <div className="panel-header">
        <div className="panel-title-container">
          <span className="panel-type-badge" style={nodeColorStyle}>
            {node.type}
          </span>
          <h3 className="panel-title">{node.label}</h3>
        </div>
        <button className="panel-close-btn" onClick={onClose}>×</button>
      </div>

      <div className="panel-toggle-container">
        <span className="toggle-label">Explanation Depth</span>
        <div className="toggle-switch-wrapper">
          <button
            className={`toggle-switch-btn ${!isSimple ? 'active' : ''}`}
            onClick={() => setIsSimple(false)}
          >
            Detailed
          </button>
          <button
            className={`toggle-switch-btn ${isSimple ? 'active' : ''}`}
            onClick={() => setIsSimple(true)}
          >
            ELI5 (Simple)
          </button>
        </div>
      </div>

      <div className="panel-body">
        {isSimple ? (
          <div className="panel-short-desc">
            <TextWithGlossary
              text={node.simpleExplanation}
              onHoverTerm={onHoverTerm}
              onLeaveTerm={onLeaveTerm}
              onClickTerm={handleTermClick}
            />
          </div>
        ) : (
          <>
            <div className="panel-short-desc">
              <TextWithGlossary
                text={node.shortExplanation}
                onHoverTerm={onHoverTerm}
                onLeaveTerm={onLeaveTerm}
                onClickTerm={handleTermClick}
              />
            </div>
            <div className="panel-long-desc">
              {paragraphs.map((p, index) => (
                <p key={index}>
                  <TextWithGlossary
                    text={p}
                    onHoverTerm={onHoverTerm}
                    onLeaveTerm={onLeaveTerm}
                    onClickTerm={handleTermClick}
                  />
                </p>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="panel-footer">
        {node.childDiagramId && onClickExploreSubDiagram && (
          <button
            className="btn btn-primary"
            onClick={() => onClickExploreSubDiagram(node.childDiagramId!)}
            style={{ backgroundColor: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}
          >
            🔍 Zoom Into Sub-Diagram
          </button>
        )}
        <button
          className="btn"
          onClick={() => onAskTutor(`How does the ${node.label} node work?`)}
        >
          💬 Ask Tutor about {node.label}
        </button>
      </div>
    </div>
  );
};
