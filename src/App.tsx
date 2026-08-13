import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { CURRICULUM, GLOSSARY, loadTopicDetails } from './data/curriculum';
import type { TopicMetadata, Topic, SubDiagram, DiagramNode } from './data/curriculum';
import { Homepage } from './components/homepage/Homepage';
import { LabIndex } from './components/labs/LabIndex';
import { DiagramCanvas } from './components/DiagramCanvas';
import { ExplanationPanel } from './components/ExplanationPanel';
import { ChatTutor } from './components/ChatTutor';
import { ModelLibrary } from './components/ModelLibrary';
import { GlossaryTooltip } from './components/GlossaryTooltip';
import { LightboxModal } from './components/LightboxModal';
import { ProgressModal } from './components/progress/ProgressModal';
import { loadUserProgress } from './data/progress';
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
  let initTab: 'home' | 'diagrams' | 'labs' | 'models' = 'home';
  
  if (nodeMatch) {
    initTopicSlug = nodeMatch[1];
    initNodeId = nodeMatch[2];
    initTab = 'diagrams';
  } else if (topicMatch) {
    initTopicSlug = topicMatch[1];
    initTab = 'diagrams';
  } else if (path.includes('/labs')) {
    initTab = 'labs';
  } else if (path.includes('/models')) {
    initTab = 'models';
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

  return {
    tab: initTab,
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
  
  const [activeTab, setActiveTab] = useState<'home' | 'diagrams' | 'labs' | 'models'>(parsed.current.tab);
  const [activeTopic, setActiveTopic] = useState<TopicMetadata>(parsed.current.topic);
  const [activeTopicDetails, setActiveTopicDetails] = useState<Topic | null>(null);
  const [activeSubDiagramId, setActiveSubDiagramId] = useState<string>(parsed.current.subDiagramId);
  const [selectedNode, setSelectedNode] = useState<DiagramNode | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);
  const [targetLabId, setTargetLabId] = useState<string>('tokenizer');
  
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

  // Progress Modal state
  const [isProgressOpen, setIsProgressOpen] = useState(false);

  // Scroll Position Memory per topic
  const scrollTopMapRef = useRef<{ [key: string]: number }>({});
  const mainContentRef = useRef<HTMLElement>(null);

  const userProgress = loadUserProgress();

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

  const handleNavigateTab = (tab: 'home' | 'diagrams' | 'labs' | 'models', subItem?: string) => {
    setActiveTab(tab);
    if (tab === 'labs' && subItem) {
      setTargetLabId(subItem);
    } else if (tab === 'diagrams' && subItem) {
      const topic = CURRICULUM.find(t => t.slug === subItem);
      if (topic) handleSelectTopic(topic);
    }
  };

  // Dynamically load active topic chapter details (code-splitting)
  useEffect(() => {
    let isCurrent = true;
    setActiveTopicDetails(null);
    
    loadTopicDetails(activeTopic.slug)
      .then(details => {
        if (!isCurrent) return;
        setActiveTopicDetails(details);
        
        if (initialLoadNodeIdRef.current) {
          const sub = details.subDiagrams[activeSubDiagramId] || details.subDiagrams[details.rootDiagramId];
          const node = sub?.nodes.find(n => n.id === initialLoadNodeIdRef.current);
          if (node) {
            setSelectedNode(node);
          }
          initialLoadNodeIdRef.current = '';
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
    tab: string,
    topicSlug: string,
    subDiagramId: string,
    nodeId: string | null,
    isSimpleDepth: boolean,
    z: number,
    _p: { x: number; y: number }
  ) => {
    let path = `/${tab}`;
    if (tab === 'diagrams') {
      path = `/topic/${topicSlug}`;
      if (nodeId) {
        path += `/node/${nodeId}`;
      }
    }
    
    const params = new URLSearchParams();
    if (subDiagramId && subDiagramId !== topicSlug) {
      params.set('subDiagram', subDiagramId);
    }
    params.set('depth', isSimpleDepth ? 'simple' : 'detailed');
    if (z !== 1) {
      params.set('zoom', z.toFixed(2));
    }

    const searchStr = params.toString();
    const newURL = path + (searchStr ? `?${searchStr}` : '');
    window.history.replaceState(null, '', newURL);
  }, []);

  const debouncedUrlRef = useRef<any>(null);
  useEffect(() => {
    let timeoutId: any = null;
    debouncedUrlRef.current = (
      tab: string,
      topicSlug: string,
      subDiagramId: string,
      nodeId: string | null,
      isSimpleDepth: boolean,
      z: number,
      p: { x: number; y: number }
    ) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        writeUrlState(tab, topicSlug, subDiagramId, nodeId, isSimpleDepth, z, p);
      }, 250);
    };

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [writeUrlState]);

  useEffect(() => {
    if (debouncedUrlRef.current) {
      debouncedUrlRef.current(
        activeTab,
        activeTopic.slug,
        activeSubDiagramId,
        selectedNode?.id || null,
        isSimple,
        zoom,
        pan
      );
    }
  }, [activeTab, activeTopic, activeSubDiagramId, selectedNode, isSimple, zoom, pan]);

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

  const isExplanationOpen = isPanelOpen || !!selectedNode;

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

  const handleNavigateToNode = (topicSlug: string, subDiagramId: string, nodeId: string) => {
    const topic = CURRICULUM.find(t => t.slug === topicSlug);
    if (!topic) return;

    preventInitialCenterRef.current = false;
    setActiveTab('diagrams');
    setActiveTopic(topic);
    setActiveSubDiagramId(subDiagramId);
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
      {activeTab === 'diagrams' && activeTopicDetails ? (
        <Helmet>
          <title>{activeTopicDetails.title} | ModelMap</title>
          <meta name="description" content={activeTopicDetails.summary || `Explore the visual interactive model explorer for ${activeTopicDetails.title}.`} />
          <link rel="canonical" href={`https://llm-learining-models.vercel.app/topic/${activeTopic.slug}`} />
        </Helmet>
      ) : (
        <Helmet>
          <title>ModelMap | Visual AI & LLM Learning Board</title>
          <meta name="description" content="Explore Large Language Models, Transformers, Prompting, RAG, and AI Agents through interactive click-to-explore flowcharts, a spec directory, and an AI tutor." />
          <link rel="canonical" href="https://llm-learining-models.vercel.app/" />
        </Helmet>
      )}
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand-header" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
          <div className="brand-logo">🎛️</div>
          <h2 className="brand-title">ModelMap</h2>
        </div>

        {/* Primary Main Menu */}
        <div className="nav-section">
          <h4 className="nav-label">Main Navigation</h4>
          <ul className="nav-menu">
            <li
              className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              🏠 Overview & Roadmap
            </li>
            <li
              className={`nav-item ${activeTab === 'labs' ? 'active' : ''}`}
              onClick={() => setActiveTab('labs')}
            >
              🧪 Interactive Labs (14)
            </li>
            <li
              className={`nav-item ${activeTab === 'models' ? 'active' : ''}`}
              onClick={() => setActiveTab('models')}
            >
              ⚡ Model Specs & Compare
            </li>
            <li
              className="nav-item"
              onClick={() => setIsProgressOpen(true)}
              style={{ color: '#f59e0b', fontWeight: 600 }}
            >
              🏆 Achievements ({userProgress.unlockedBadgeIds.length}/9)
            </li>
          </ul>
        </div>

        {/* Flowchart Chapters Tree */}
        <div className="nav-section scrollable">
          <h4 className="nav-label">Flowchart Explorer</h4>
          <ul className="nav-menu" role="tree" aria-label="Curriculum Topics">
            {CURRICULUM.map((topic) => {
              const isActive = activeTab === 'diagrams' && activeTopic.id === topic.id;
              return (
                <li
                  key={topic.id}
                  role="treeitem"
                  aria-selected={isActive}
                  style={{ listStyleType: 'none' }}
                >
                  <a
                    href={`/topic/${topic.slug}`}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelectTopic(topic);
                    }}
                    style={{ textDecoration: 'none', display: 'flex' }}
                  >
                    📊 {topic.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer */}
        <div className="nav-footer">
          <div>Visual LLM Learning Platform v2.0</div>
          <div>Interactive Labs + Flowchart Simulators</div>
          <div style={{ marginTop: '0.2rem', color: 'var(--color-accent)', fontWeight: 600 }}>
            Model Data: {MODELS_LAST_UPDATED}
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="main-content" ref={mainContentRef}>
        {/* Header bar */}
        <header className="main-header">
          <div className="header-title-container">
            <span className="header-title">
              {activeTab === 'home' && '🏠 ModelMap — Interactive LLM Architecture Playground'}
              {activeTab === 'diagrams' && activeTopic.title}
              {activeTab === 'labs' && '🧪 Interactive LLM Engineering Laboratories'}
              {activeTab === 'models' && '⚡ AI Model Directory & Response Comparison'}
            </span>
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
                  style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', borderColor: 'var(--color-primary)', color: '#fff' }}
                >
                  🧪 Take Quiz
                </button>
                <button className="btn" onClick={() => setIsLightboxOpen(true)}>
                  🔍 Preview
                </button>
              </>
            )}

            <button
              className="btn"
              onClick={() => setIsProgressOpen(true)}
              style={{ borderColor: '#f59e0b', color: '#f59e0b', fontWeight: 600 }}
            >
              🏆 Streak: {userProgress.streakDays}🔥
            </button>

            <button 
              className="btn btn-primary" 
              onClick={() => handleAskTutor('Explain how an LLM works from first principles')}
            >
              🎓 Ask Tutor
            </button>
          </div>
        </header>

        {/* Body Workspace Routing */}
        {activeTab === 'home' && (
          <Homepage
            onNavigateTab={handleNavigateTab}
            onOpenProgress={() => setIsProgressOpen(true)}
          />
        )}

        {activeTab === 'labs' && (
          <LabIndex initialLabId={targetLabId} />
        )}

        {activeTab === 'models' && (
          <ModelLibrary />
        )}

        {activeTab === 'diagrams' && (
          <>
            {activeTopicDetails === null ? (
              <div className="diagram-canvas-loading" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: 'var(--color-accent)' }}>
                <span className="spin-loader" style={{ fontSize: '2rem' }}>🔄</span>
                <span>Loading Diagram Flowcharts...</span>
              </div>
            ) : (
              <>
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

        {/* Achievements & Progress Modal */}
        <ProgressModal
          isOpen={isProgressOpen}
          onClose={() => setIsProgressOpen(false)}
        />
      </main>
    </div>
  );
}
