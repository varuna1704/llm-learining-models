import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CURRICULUM, GLOSSARY, loadTopicDetails } from './data/curriculum';
import type { TopicMetadata, Topic, SubDiagram, DiagramNode } from './data/curriculum';
import { DiagramCanvas } from './components/DiagramCanvas';
import { ExplanationPanel } from './components/ExplanationPanel';
import { ChatTutor } from './components/ChatTutor';
import { ModelLibrary } from './components/ModelLibrary';
import { GlossaryTooltip } from './components/GlossaryTooltip';
import { LightboxModal } from './components/LightboxModal';
import { MODELS_LAST_UPDATED } from './data/models';

// URL Parsing Utility
const parseInitialState = () => {
  const path = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  
  const topicMatch = path.match(/^\/topic\/([^/]+)/);
  const nodeMatch = path.match(/^\/topic\/([^/]+)\/node\/([^/]+)/);
  
  let initTopicSlug = CURRICULUM[0].slug;
  let initNodeId = '';
  let urlHasZoomOrPan = false;
  
  if (nodeMatch) {
    initTopicSlug = nodeMatch[1];
    initNodeId = nodeMatch[2];
  } else if (topicMatch) {
    initTopicSlug = topicMatch[1];
  }
  
  let initTopic = CURRICULUM.find(t => t.slug === initTopicSlug) || CURRICULUM[0];
  let initSubDiagramId = searchParams.get('subDiagram') || initTopic.rootDiagramId;
  let initIsSimple = searchParams.get('depth') === 'simple';
  let initZoom = 1;
  let initPan = { x: 50, y: 50 };
  
  if (searchParams.has('zoom')) {
    initZoom = parseFloat(searchParams.get('zoom') || '1');
    urlHasZoomOrPan = true;
  }
  if (searchParams.has('panX') && searchParams.has('panY')) {
    initPan = {
      x: parseFloat(searchParams.get('panX') || '50'),
      y: parseFloat(searchParams.get('panY') || '50')
    };
    urlHasZoomOrPan = true;
  }

  // Fallback to localStorage if at root path with no parameters
  const isRootPath = path === '/' || path === '';
  if (isRootPath && !urlHasZoomOrPan) {
    const saved = localStorage.getItem('modelmap_last_state');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        const savedTopic = CURRICULUM.find(t => t.slug === state.topicSlug);
        if (savedTopic) {
          return {
            topic: savedTopic,
            subDiagramId: state.subDiagramId || savedTopic.rootDiagramId,
            nodeId: state.nodeId || '',
            isSimple: !!state.isSimple,
            zoom: parseFloat(state.zoom) || 1,
            pan: state.pan || { x: 50, y: 50 },
            hasParams: true
          };
        }
      } catch (e) {
        console.error('Failed to parse localStorage state:', e);
      }
    }
  }

  return {
    topic: initTopic,
    subDiagramId: initSubDiagramId,
    nodeId: initNodeId,
    isSimple: initIsSimple,
    zoom: initZoom,
    pan: initPan,
    hasParams: urlHasZoomOrPan
  };
};

export default function App() {
  const parsed = useRef(parseInitialState());
  
  const [activeTab, setActiveTab] = useState<'diagrams' | 'models'>('diagrams');
  const [activeTopic, setActiveTopic] = useState<TopicMetadata>(parsed.current.topic);
  const [activeTopicDetails, setActiveTopicDetails] = useState<Topic | null>(null);
  const [activeSubDiagramId, setActiveSubDiagramId] = useState<string>(parsed.current.subDiagramId);
  const [selectedNode, setSelectedNode] = useState<DiagramNode | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);
  
  // Canvas Zoom/Pan lifted state
  const [zoom, setZoom] = useState<number>(parsed.current.zoom);
  const [pan, setPan] = useState<{ x: number; y: number }>(parsed.current.pan);
  
  // Explanation depth state
  const [isSimple, setIsSimple] = useState<boolean>(parsed.current.isSimple);

  // Ref to bypass centering on initial URL load
  const preventInitialCenterRef = useRef<boolean>(parsed.current.hasParams);

  // Ref to queue node selection once topic details resolve
  const initialLoadNodeIdRef = useRef<string>(parsed.current.nodeId);
  
  // Glossary tooltip state
  const [hoveredTermId, setHoveredTermId] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  // Floating Chat Tutor triggered question
  const [tutorQuestionTrigger, setTutorQuestionTrigger] = useState<string>('');

  // Lightbox Modal state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Scroll Position Memory per topic
  const scrollTopMapRef = useRef<{ [key: string]: number }>({});
  const mainContentRef = useRef<HTMLElement>(null);

  const handleSelectTopic = useCallback((topic: TopicMetadata) => {
    if (mainContentRef.current) {
      scrollTopMapRef.current[activeTopic.slug] = mainContentRef.current.scrollTop;
    }
    setActiveTopic(topic);
    setActiveSubDiagramId(topic.rootDiagramId);
    setSelectedNode(null);
    setActiveTab('diagrams');
    setIsPanelOpen(true);
  }, [activeTopic.slug]);

  // Restore scroll position when topic resolves
  useEffect(() => {
    const savedScroll = scrollTopMapRef.current[activeTopic.slug];
    if (savedScroll !== undefined && mainContentRef.current) {
      setTimeout(() => {
        if (mainContentRef.current) {
          mainContentRef.current.scrollTop = savedScroll;
        }
      }, 50);
    }
  }, [activeTopic.slug]);

  // Dynamically load active topic chapter details (code-splitting)
  useEffect(() => {
    let isCurrent = true;
    setActiveTopicDetails(null);
    
    loadTopicDetails(activeTopic.slug)
      .then(details => {
        if (!isCurrent) return;
        setActiveTopicDetails(details);
        
        // If a nodeId was parsed from URL on boot, locate and focus it
        if (initialLoadNodeIdRef.current) {
          const sub = details.subDiagrams[activeSubDiagramId] || details.subDiagrams[details.rootDiagramId];
          const node = sub?.nodes.find(n => n.id === initialLoadNodeIdRef.current);
          if (node) {
            setSelectedNode(node);
          }
          initialLoadNodeIdRef.current = ''; // Clear queue
        }
      })
      .catch(err => {
        console.error('Failed to load topic details dynamically:', err);
      });
      
    return () => {
      isCurrent = false;
    };
  }, [activeTopic, activeSubDiagramId]);

  // Synchronize history URL search params and localStorage on changes
  const writeUrlState = useCallback((
    topicSlug: string,
    subDiagramId: string,
    nodeId: string | null,
    isSimpleDepth: boolean,
    z: number,
    p: { x: number; y: number }
  ) => {
    let path = `/topic/${topicSlug}`;
    if (nodeId) {
      path += `/node/${nodeId}`;
    }
    
    const params = new URLSearchParams();
    if (subDiagramId && subDiagramId !== topicSlug && subDiagramId !== topicSlug.replace(/-/g, '_')) {
      params.set('subDiagram', subDiagramId);
    }
    params.set('depth', isSimpleDepth ? 'simple' : 'detailed');
    if (z !== 1) {
      params.set('zoom', z.toFixed(2));
    }
    if (p.x !== 50 || p.y !== 50) {
      params.set('panX', Math.round(p.x).toString());
      params.set('panY', Math.round(p.y).toString());
    }

    const searchStr = params.toString();
    const newURL = path + (searchStr ? `?${searchStr}` : '');
    
    // Smooth URL replacement (avoiding history queue clogging during drags)
    window.history.replaceState(null, '', newURL);

    // Save to localStorage as a fallback
    localStorage.setItem('modelmap_last_state', JSON.stringify({
      topicSlug,
      subDiagramId,
      nodeId: nodeId || '',
      isSimple: isSimpleDepth,
      zoom: z,
      pan: p
    }));
  }, []);

  // Debounced URL updates for performance during drag interactions
  const debouncedUrlRef = useRef<any>(null);
  useEffect(() => {
    let timeoutId: any = null;
    
    debouncedUrlRef.current = (
      topicSlug: string,
      subDiagramId: string,
      nodeId: string | null,
      isSimpleDepth: boolean,
      z: number,
      p: { x: number; y: number }
    ) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        writeUrlState(topicSlug, subDiagramId, nodeId, isSimpleDepth, z, p);
      }, 250);
    };

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [writeUrlState]);

  // Sync state changes to URL
  useEffect(() => {
    if (debouncedUrlRef.current) {
      debouncedUrlRef.current(
        activeTopic.slug,
        activeSubDiagramId,
        selectedNode?.id || null,
        isSimple,
        zoom,
        pan
      );
    }
  }, [activeTopic, activeSubDiagramId, selectedNode, isSimple, zoom, pan]);

  // Dynamic zoom/pan handlers
  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const handlePanChange = useCallback((newPan: { x: number; y: number }) => {
    setPan(newPan);
  }, []);

  const handleToggleDepth = useCallback((simpleMode: boolean) => {
    setIsSimple(simpleMode);
  }, []);

  const activeSubDiagram: SubDiagram | null = activeTopicDetails
    ? (activeTopicDetails.subDiagrams[activeSubDiagramId] || activeTopicDetails.subDiagrams[activeTopicDetails.rootDiagramId])
    : null;

  // Open the detail panel automatically when a node is selected or if overview/quiz is open
  const isExplanationOpen = isPanelOpen || !!selectedNode;

  // Breadcrumbs calculation
  const getBreadcrumbs = (): string[] => {
    const list = [activeTopic.title];
    if (activeTopicDetails && activeSubDiagramId !== activeTopicDetails.rootDiagramId) {
      let parentLabel = 'Details';
      Object.values(activeTopicDetails.subDiagrams).forEach(sub => {
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
    if (index === 0 && activeTopicDetails) {
      preventInitialCenterRef.current = false;
      setActiveSubDiagramId(activeTopicDetails.rootDiagramId);
      setSelectedNode(null);
    }
  };

  const handleSelectNode = useCallback((node: DiagramNode | null) => {
    setSelectedNode(node);
    if (node) {
      setIsPanelOpen(true);
    }
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedNode(null);
    setIsPanelOpen(false);
  }, []);

  const handleExploreSubDiagram = useCallback((subDiagramId: string) => {
    setActiveSubDiagramId(subDiagramId);
    setSelectedNode(null);
  }, []);

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
    const topic = CURRICULUM.find(t => t.slug === topicSlug);
    if (!topic) return;

    preventInitialCenterRef.current = false;
    setActiveTab('diagrams');
    setActiveTopic(topic);
    setActiveSubDiagramId(subDiagramId);
    
    // Select the target node
    if (nodeId) {
      initialLoadNodeIdRef.current = nodeId;
    } else {
      setSelectedNode(null);
    }
  };

  const handleNavigateToGlossary = (glossaryId: string) => {
    const term = GLOSSARY[glossaryId];
    if (!term) return;
    
    setTutorQuestionTrigger(term.term);
    setTimeout(() => setTutorQuestionTrigger(''), 100);
  };

  const handleAskTutor = (question: string) => {
    setTutorQuestionTrigger(question);
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
          <ul
            className="nav-menu"
            role="tree"
            aria-label="Flowchart Explorer Topics"
          >
            {CURRICULUM.map((topic) => {
              const isActive = activeTab === 'diagrams' && activeTopic.id === topic.id;
              return (
                <li
                  key={topic.id}
                  role="treeitem"
                  aria-level={1}
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectTopic(topic)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectTopic(topic);
                    } else if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      const next = e.currentTarget.nextElementSibling as HTMLElement;
                      if (next) next.focus();
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      const prev = e.currentTarget.previousElementSibling as HTMLElement;
                      if (prev) prev.focus();
                    }
                  }}
                >
                  📊 {topic.title}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Directory Search */}
        <div className="nav-section">
          <h4 className="nav-label">Models & Specifications</h4>
          <ul className="nav-menu" role="tree" aria-label="Directory Section">
            <li
              role="treeitem"
              aria-level={1}
              aria-selected={activeTab === 'models'}
              tabIndex={activeTab === 'models' ? 0 : -1}
              className={`nav-item ${activeTab === 'models' ? 'active' : ''}`}
              onClick={() => setActiveTab('models')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveTab('models');
                }
              }}
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
            Model Directory (updated: {MODELS_LAST_UPDATED})
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="main-content" ref={mainContentRef}>
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
              <>
                <button
                  className="btn"
                  onClick={() => {
                    setSelectedNode(null);
                    setIsPanelOpen(true);
                  }}
                  aria-label="Open Chapter Quiz"
                  style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', borderColor: 'var(--color-primary)', color: '#fff' }}
                >
                  🧪 Take Quiz
                </button>
                <button
                  className="btn"
                  onClick={() => setIsLightboxOpen(true)}
                  aria-label="Open Fullscreen Concept Lightbox Preview"
                >
                  🔍 Preview
                </button>
                <button 
                  className="btn" 
                  onClick={() => handleAskTutor(`Explain the overall flow of ${activeTopic.title}`)}
                >
                  🎓 Semantic Tutor
                </button>
              </>
            )}
            <button className="btn btn-primary" onClick={() => setActiveTab(activeTab === 'diagrams' ? 'models' : 'diagrams')}>
              {activeTab === 'diagrams' ? 'View Model Specs' : 'Back to Diagrams'}
            </button>
          </div>
        </header>

        {/* Body Workspace */}
        {activeTab === 'diagrams' ? (
          <>
            {activeTopicDetails === null ? (
              <div className="diagram-canvas-loading" style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#0f172a',
                color: 'var(--color-accent)',
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                gap: '1rem'
              }}>
                <span className="spin-loader" style={{ fontSize: '2rem' }}>🔄</span>
                <span>Loading Diagram Flowcharts...</span>
              </div>
            ) : (
              <>
                {/* Visual Canvas Board */}
                <DiagramCanvas
                  subDiagram={activeSubDiagram!}
                  selectedNode={selectedNode}
                  onSelectNode={handleSelectNode}
                  breadcrumbs={getBreadcrumbs()}
                  onNavigateBreadcrumb={handleNavigateBreadcrumb}
                  zoom={zoom}
                  onZoomChange={handleZoomChange}
                  pan={pan}
                  onPanChange={handlePanChange}
                  preventInitialCenter={preventInitialCenterRef.current}
                />

                {/* Slide-out detail drawer */}
                <ExplanationPanel
                  node={selectedNode}
                  isOpen={isExplanationOpen}
                  onClose={handleClosePanel}
                  onHoverTerm={handleHoverTerm}
                  onLeaveTerm={handleLeaveTerm}
                  onClickExploreSubDiagram={handleExploreSubDiagram}
                  onAskTutor={handleAskTutor}
                  isSimple={isSimple}
                  onToggleDepth={handleToggleDepth}
                  quiz={activeTopicDetails?.quiz}
                  activeTopicTitle={activeTopic.title}
                />
              </>
            )}
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

        {/* Full-Screen Lightbox Preview Modal */}
        <LightboxModal
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          title={selectedNode ? selectedNode.label : activeTopic.title}
          type={selectedNode ? selectedNode.type : 'Chapter Overview'}
          description={selectedNode ? selectedNode.shortExplanation : activeTopic.summary}
          details={selectedNode ? selectedNode.detailedExplanation : undefined}
        />
      </main>
    </div>
  );
}
