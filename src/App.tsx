import React, { useState } from 'react';
import { CURRICULUM, GLOSSARY } from './data/curriculum';
import type { Topic, SubDiagram, DiagramNode } from './data/curriculum';
import { DiagramCanvas } from './components/DiagramCanvas';
import { ExplanationPanel } from './components/ExplanationPanel';
import { ChatTutor } from './components/ChatTutor';
import { ModelLibrary } from './components/ModelLibrary';
import { GlossaryTooltip } from './components/GlossaryTooltip';

export default function App() {
  const [activeTab, setActiveTab] = useState<'diagrams' | 'models'>('diagrams');
  const [activeTopic, setActiveTopic] = useState<Topic>(CURRICULUM[0]);
  const [activeSubDiagramId, setActiveSubDiagramId] = useState<string>(CURRICULUM[0].rootDiagramId);
  const [selectedNode, setSelectedNode] = useState<DiagramNode | null>(null);
  
  // Glossary tooltip state
  const [hoveredTermId, setHoveredTermId] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  // Floating Chat Tutor triggered question
  const [tutorQuestionTrigger, setTutorQuestionTrigger] = useState<string>('');

  const activeSubDiagram: SubDiagram = 
    activeTopic.subDiagrams[activeSubDiagramId] || activeTopic.subDiagrams[activeTopic.rootDiagramId];

  // Open the detail panel automatically when a node is selected
  const isExplanationOpen = !!selectedNode;

  // Breadcrumbs calculation
  const getBreadcrumbs = (): string[] => {
    const list = [activeTopic.title];
    if (activeSubDiagramId !== activeTopic.rootDiagramId) {
      // Find parent node in any of the sub-diagrams
      let parentLabel = 'Details';
      Object.values(activeTopic.subDiagrams).forEach(sub => {
        const found = sub.nodes.find(n => n.childDiagramId === activeSubDiagramId);
        if (found) {
          parentLabel = found.label;
        }
      });
      list.push(parentLabel);
    }
    return list;
  };

  const handleNavigateBreadcrumb = (index: number) => {
    if (index === 0) {
      setActiveSubDiagramId(activeTopic.rootDiagramId);
      setSelectedNode(null);
    }
  };

  const handleSelectTopic = (topic: Topic) => {
    setActiveTopic(topic);
    setActiveSubDiagramId(topic.rootDiagramId);
    setSelectedNode(null);
    setActiveTab('diagrams');
  };

  const handleSelectNode = (node: DiagramNode | null) => {
    setSelectedNode(node);
  };

  const handleExploreSubDiagram = (subDiagramId: string) => {
    if (activeTopic.subDiagrams[subDiagramId]) {
      setActiveSubDiagramId(subDiagramId);
      setSelectedNode(null);
    }
  };

  // Glossary Hover handlers
  const handleHoverTerm = (termId: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2 + window.scrollX,
      y: rect.top + window.scrollY
    });
    setHoveredTermId(termId);
  };

  const handleLeaveTerm = () => {
    setHoveredTermId(null);
    setTooltipPosition(null);
  };

  // Navigating from Chat Tutor deep-links
  const handleNavigateToNode = (topicSlug: string, subDiagramId: string, nodeId: string) => {
    // If slug is empty, it means we clicked a glossary link
    const topic = CURRICULUM.find(t => t.slug === topicSlug);
    if (!topic) return;

    setActiveTab('diagrams');
    setActiveTopic(topic);
    setActiveSubDiagramId(subDiagramId);
    
    // Select the target node
    if (nodeId) {
      const node = topic.subDiagrams[subDiagramId]?.nodes.find(n => n.id === nodeId);
      if (node) {
        setSelectedNode(node);
      }
    } else {
      setSelectedNode(null);
    }
  };

  const handleNavigateToGlossary = (glossaryId: string) => {
    const term = GLOSSARY[glossaryId];
    if (!term) return;
    
    // We can simulate clicking the node to display glossary, but we want the ExplanationPanel
    // to render the glossary page. To make it simple, we can focus the tutor on it, or display it in a fake node.
    // In our design, we can trigger the tutor to answer with detailed glossary rules.
    setTutorQuestionTrigger(term.term);
    
    // Clean trigger state
    setTimeout(() => setTutorQuestionTrigger(''), 100);
  };

  const handleAskTutor = (question: string) => {
    setTutorQuestionTrigger(question);
    // Clean trigger state
    setTimeout(() => setTutorQuestionTrigger(''), 100);
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand-header">
          <div className="brand-logo">🎛️</div>
          <h2 className="brand-title">ModelMap</h2>
        </div>

        {/* Learning Paths */}
        <div className="nav-section scrollable">
          <h4 className="nav-label">Flowchart Explorer</h4>
          <ul className="nav-menu">
            {CURRICULUM.map((topic) => (
              <li
                key={topic.id}
                className={`nav-item ${activeTab === 'diagrams' && activeTopic.id === topic.id ? 'active' : ''}`}
                onClick={() => handleSelectTopic(topic)}
              >
                📊 {topic.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Directory Search */}
        <div className="nav-section">
          <h4 className="nav-label">Models & Specifications</h4>
          <ul className="nav-menu">
            <li
              className={`nav-item ${activeTab === 'models' ? 'active' : ''}`}
              onClick={() => setActiveTab('models')}
            >
              ⚡ AI Model Library
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="nav-footer">
          <div>Visual AI Learning App v1.0</div>
          <div>React + TypeScript + CSS</div>
          <div style={{ marginTop: '0.5rem', color: 'var(--color-accent)', fontWeight: 600 }}>
            Daily Model Feed Active
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="main-content">
        {/* Header bar */}
        <header className="main-header">
          <div className="header-title-container">
            <span className="header-title">
              {activeTab === 'diagrams' ? activeTopic.title : 'AI Model Specifications Directory'}
            </span>
            {activeTab === 'diagrams' && (
              <>
                <span className="breadcrumb-separator">/</span>
                <span className="header-subtitle">Click-to-Explore canvas</span>
              </>
            )}
          </div>
          
          <div className="header-actions">
            {activeTab === 'diagrams' && (
              <button 
                className="btn" 
                onClick={() => handleAskTutor(`Explain the overall flow of ${activeTopic.title}`)}
              >
                🎓 Tutor Overview
              </button>
            )}
            <button className="btn btn-primary" onClick={() => setActiveTab(activeTab === 'diagrams' ? 'models' : 'diagrams')}>
              {activeTab === 'diagrams' ? 'View Model Specs' : 'Back to Diagrams'}
            </button>
          </div>
        </header>

        {/* Body Workspace */}
        {activeTab === 'diagrams' ? (
          <>
            {/* Visual Canvas Board */}
            <DiagramCanvas
              subDiagram={activeSubDiagram}
              selectedNode={selectedNode}
              onSelectNode={handleSelectNode}
              breadcrumbs={getBreadcrumbs()}
              onNavigateBreadcrumb={handleNavigateBreadcrumb}
            />

            {/* Slide-out detail drawer */}
            <ExplanationPanel
              node={selectedNode}
              isOpen={isExplanationOpen}
              onClose={() => setSelectedNode(null)}
              onHoverTerm={handleHoverTerm}
              onLeaveTerm={handleLeaveTerm}
              onClickExploreSubDiagram={handleExploreSubDiagram}
              onAskTutor={handleAskTutor}
            />
          </>
        ) : (
          <ModelLibrary />
        )}

        {/* Floatable grounded Chat Tutor chatbot */}
        <ChatTutor
          onNavigateToNode={handleNavigateToNode}
          onNavigateToGlossary={handleNavigateToGlossary}
          triggerQuestion={tutorQuestionTrigger}
        />

        {/* Floating Tooltip Hover Portal */}
        <GlossaryTooltip
          termId={hoveredTermId}
          position={tooltipPosition}
        />
      </main>
    </div>
  );
}
