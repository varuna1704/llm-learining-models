import React, { useState, useEffect } from 'react';
import { GLOSSARY } from '../data/curriculum';
import type { DiagramNode, QuizQuestion } from '../data/curriculum';
import { TextWithGlossary } from './GlossaryTooltip';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface ExplanationPanelProps {
  node: DiagramNode | null;
  isOpen: boolean;
  onClose: () => void;
  onHoverTerm: (termId: string, event: React.MouseEvent) => void;
  onLeaveTerm: () => void;
  onClickExploreSubDiagram?: (subDiagramId: string) => void;
  onAskTutor: (question: string) => void;
  isSimple: boolean;
  onToggleDepth: (isSimple: boolean) => void;
  quiz?: QuizQuestion[];
  activeTopicTitle?: string;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  node,
  isOpen,
  onClose,
  onHoverTerm,
  onLeaveTerm,
  onClickExploreSubDiagram,
  onAskTutor,
  isSimple,
  onToggleDepth,
  quiz = [],
  activeTopicTitle = '',
  triggerRef,
}) => {
  const [selectedGlossaryId, setSelectedGlossaryId] = useState<string | null>(null);

  // Quiz States
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Focus trap for accessibility
  const panelRef = useFocusTrap<HTMLDivElement>({ isOpen, onClose, triggerRef });

  // Body scroll locking when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Reset toggles and quiz state when node or topic title changes
  useEffect(() => {
    onToggleDepth(false);
    setSelectedGlossaryId(null);
    setQuizMode(false);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setSubmitted(false);
    setScore(0);
  }, [node, activeTopicTitle]);

  if (!node) {
    const handleOptionSelect = (index: number, correctIdx: number) => {
      if (submitted) return;
      setSelectedOptionIndex(index);
      setSubmitted(true);
      if (index === correctIdx) {
        setScore(prev => prev + 1);
      }
    };

    const handleNextQuestion = () => {
      setSubmitted(false);
      setSelectedOptionIndex(null);
      setCurrentQuestionIndex(prev => prev + 1);
    };

    const resetQuiz = () => {
      setSubmitted(false);
      setSelectedOptionIndex(null);
      setCurrentQuestionIndex(0);
      setScore(0);
    };

    return (
      <div
        ref={panelRef}
        className={`explanation-panel ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={quizMode ? `Quiz: ${activeTopicTitle}` : activeTopicTitle || 'Topic Overview Panel'}
        tabIndex={-1}
      >
        <div className="panel-header">
          <h3 className="panel-title">
            {quizMode ? `📝 Quiz: ${activeTopicTitle}` : activeTopicTitle || 'Select a Node'}
          </h3>
          <button className="panel-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="panel-body">
          {!quizMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5', fontSize: '0.8rem' }}>
                Select any node in the flowchart diagram to explore its specifications, simple analogies, and code integration.
              </p>
              <div style={{
                marginTop: '1rem',
                padding: '1.2rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
              }}>
                <h4 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  🎓 Chapter Overview Quiz
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Test your understanding of the concepts in this section with a short interactive quiz.
                </p>
                {quiz && quiz.length > 0 ? (
                  <button 
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      marginTop: '1rem',
                      padding: '0.6rem',
                      background: 'linear-gradient(135deg, var(--color-accent) 0%, #a855f7 100%)',
                      border: 'none',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
                      cursor: 'pointer'
                    }}
                    onClick={() => setQuizMode(true)}
                  >
                    Take Quiz ({quiz.length} Questions)
                  </button>
                ) : (
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-accent)', marginTop: '0.5rem' }}>
                    Loading quiz...
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {currentQuestionIndex < quiz.length ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Question {currentQuestionIndex + 1} of {quiz.length}</span>
                    <span>Score: {score}/{currentQuestionIndex}</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div style={{ height: '4px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${((currentQuestionIndex + 1) / quiz.length) * 100}%`,
                      backgroundColor: 'var(--color-accent)',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>

                  <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, margin: '0.5rem 0 1rem 0', lineHeight: '1.4' }}>
                    {quiz[currentQuestionIndex].question}
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {quiz[currentQuestionIndex].options.map((option: string, idx: number) => {
                      const correctIdx = quiz[currentQuestionIndex].correctAnswerIndex;
                      let btnBg = 'rgba(255, 255, 255, 0.03)';
                      let btnBorder = '1px solid var(--border-color)';
                      let textColor = 'var(--text-primary)';

                      if (submitted) {
                        if (idx === correctIdx) {
                          btnBg = 'rgba(34, 197, 94, 0.15)';
                          btnBorder = '1px solid rgba(34, 197, 94, 0.5)';
                          textColor = '#4ade80';
                        } else if (idx === selectedOptionIndex) {
                          btnBg = 'rgba(239, 68, 68, 0.15)';
                          btnBorder = '1px solid rgba(239, 68, 68, 0.5)';
                          textColor = '#f87171';
                        } else {
                          textColor = 'var(--text-muted)';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          className="quiz-option-btn"
                          data-option-index={idx}
                          disabled={submitted}
                          onClick={() => handleOptionSelect(idx, correctIdx)}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            backgroundColor: btnBg,
                            border: btnBorder,
                            color: textColor,
                            fontSize: '0.8rem',
                            textAlign: 'left',
                            cursor: submitted ? 'default' : 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <span style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            border: '1px solid currentColor',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.6rem',
                            fontWeight: 700
                          }}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {submitted && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      borderLeft: '4px solid var(--color-accent)',
                      fontSize: '0.75rem',
                      lineHeight: '1.4',
                      color: 'var(--text-secondary)'
                    }}>
                      <strong>💡 Explanation:</strong> {quiz[currentQuestionIndex].explanation}
                    </div>
                  )}

                  {submitted && (
                    <button
                      className="btn btn-primary"
                      onClick={handleNextQuestion}
                      style={{
                        alignSelf: 'flex-end',
                        marginTop: '0.5rem',
                        padding: '0.5rem 1.2rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {currentQuestionIndex + 1 === quiz.length ? 'Finish Quiz' : 'Next Question →'}
                    </button>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '3rem' }}>🏆</div>
                  <h4 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700 }}>Quiz Complete!</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    You scored <strong>{score}</strong> out of <strong>{quiz.length}</strong> questions correctly.
                  </p>
                  <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    border: '4px solid var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--color-accent)',
                    margin: '0.5rem 0'
                  }}>
                    {Math.round((score / quiz.length) * 100)}%
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: '1rem' }}>
                    <button className="btn" onClick={resetQuiz} style={{ flex: 1, padding: '0.5rem', cursor: 'pointer' }}>Retry</button>
                    <button className="btn btn-primary" onClick={() => setQuizMode(false)} style={{ flex: 1, padding: '0.5rem', cursor: 'pointer' }}>Close</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

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
      <div
        ref={panelRef}
        className={`explanation-panel ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={`Glossary: ${term?.term}`}
        tabIndex={-1}
      >
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
    <div
      ref={panelRef}
      className={`explanation-panel ${isOpen ? 'open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Node details: ${node.label}`}
      tabIndex={-1}
    >
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
            onClick={() => onToggleDepth(false)}
          >
            Detailed
          </button>
          <button
            className={`toggle-switch-btn ${isSimple ? 'active' : ''}`}
            onClick={() => onToggleDepth(true)}
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
