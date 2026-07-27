import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GLOSSARY } from '../data/curriculum';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  deepLink?: {
    topicSlug: string;
    subDiagramId: string;
    nodeId?: string;
    glossaryId?: string;
    label: string;
  };
}

interface ChatTutorProps {
  onNavigateToNode: (topicSlug: string, subDiagramId: string, nodeId: string) => void;
  onNavigateToGlossary: (glossaryId: string) => void;
  triggerQuestion?: string; // Prop to receive clicks from elsewhere to automatically send
}

interface SearchItem {
  type: 'topic' | 'node' | 'glossary';
  title: string;
  content: string;
  targetId: string;
  topicSlug?: string;
  subDiagramId?: string;
  nodeLabel?: string;
  shortExplanation?: string;
  simpleExplanation?: string;
  detailedExplanation?: string;
  topicTitle?: string;
}

const STOP_WORDS = new Set([
  'how', 'work', 'what', 'is', 'a', 'an', 'the', 'does', 'do', 'of', 
  'in', 'on', 'to', 'for', 'with', 'and', 'or', 'about', 'some', 'any', 
  'at', 'by', 'from', 'here', 'there', 'who', 'why', 'where', 'which', 
  'you', 'me', 'my', 'your', 'we', 'our', 'they', 'them', 'he', 'she', 
  'it', 'its', 'can', 'could', 'should', 'would', 'will', 'shall', 
  'may', 'might', 'must', 'been', 'being', 'have', 'has', 'had', 
  'having', 'works', 'explain', 'tell', 'info', 'information', 'about'
]);

interface DocumentVector {
  doc: SearchItem;
  tfMap: { [word: string]: number };
}

let cachedSearchIndex: SearchItem[] = [];
let cachedDocumentVectors: DocumentVector[] = [];
let cachedIdfs: { [word: string]: number } = {};

function getLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1  // deletion
          )
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function isFuzzyMatch(word1: string, word2: string): boolean {
  const w1 = word1.toLowerCase().trim();
  const w2 = word2.toLowerCase().trim();
  if (w1 === w2) return true;
  if (w1.includes(w2) || w2.includes(w1)) return true;
  
  if (w1.length >= 4 && w2.length >= 4) {
    if (w1.slice(0, 4) === w2.slice(0, 4)) return true;
    
    const distance = getLevenshteinDistance(w1, w2);
    const maxAllowedDistance = Math.min(2, Math.floor(Math.max(w1.length, w2.length) / 3));
    if (distance <= maxAllowedDistance) return true;
  }
  return false;
}

export const ChatTutor: React.FC<ChatTutorProps> = ({
  onNavigateToNode,
  onNavigateToGlossary,
  triggerQuestion
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.chat-header-actions')) {
      return;
    }
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialPosRef.current = { ...position };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = moveEvent.clientX - dragStartRef.current.x;
      const dy = moveEvent.clientY - dragStartRef.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasDraggedRef.current = true;
      }
      setPosition({
        x: initialPosRef.current.x + dx,
        y: initialPosRef.current.y + dy,
      });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleHeaderClick = (e: React.MouseEvent) => {
    if (hasDraggedRef.current) {
      e.stopPropagation();
      return;
    }
    setIsCollapsed(!isCollapsed);
  };
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am your Semantic AI Tutor. I use a local client-side embedding model (all-MiniLM-L6-v2) to perform semantic search over our curriculum. Ask me anything (e.g. 'how does the model pick what to say next'), and I'll retrieve the most relevant concepts for you!",
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Semantic RAG states
  const [modelLoading, setModelLoading] = useState(false);
  const [modelProgress, setModelProgress] = useState('');
  const [modelReady, setModelReady] = useState(false);
  const embedderRef = useRef<any>(null);
  const embeddingsDbRef = useRef<{ [id: string]: number[] } | null>(null);

  // Initialize embedding model and fetch search index on mount
  useEffect(() => {
    // 1. Fetch precomputed vectors and TF-IDF database
    fetch('/search_index.json')
      .then(res => res.json())
      .then(data => {
        embeddingsDbRef.current = data.embeddings;
        cachedSearchIndex = data.searchIndex;
        cachedIdfs = data.idfs;
        
        // Map document vectors to include reference to searchIndex items
        cachedDocumentVectors = data.documentVectors.map((v: any) => {
          const doc = data.searchIndex.find((item: any) => item.targetId === v.targetId);
          return {
            doc: doc!,
            tfMap: v.tfMap
          };
        }).filter((v: any) => v.doc !== undefined);
      })
      .catch(err => {
        console.error('Failed to load precomputed search index database:', err);
      });

    // 2. Load the transformers.js pipeline dynamically inside browser
    const loadEmbedder = async () => {
      setModelLoading(true);
      setModelProgress('Initializing Semantic Tutor RAG engine...');
      try {
        const { env, pipeline } = await import('@xenova/transformers');
        env.allowLocalModels = false;

        embedderRef.current = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
          progress_callback: (data: any) => {
            if (data.status === 'downloading') {
              const pct = data.progress ? ` (${Math.round(data.progress)}%)` : '';
              setModelProgress(`Downloading semantic model weights${pct}...`);
            } else if (data.status === 'done') {
              setModelProgress('Model loaded! Preparing vector search index...');
            }
          }
        });

        setModelReady(true);
        setModelLoading(false);
      } catch (err) {
        console.error('Error loading embedding model:', err);
        setModelProgress('Error loading model. Falling back to keyword search.');
        setModelLoading(false);
      }
    };

    loadEmbedder();
  }, []);

  // Helper to embed query text at runtime
  const getQueryEmbedding = async (text: string): Promise<number[] | null> => {
    if (!embedderRef.current) return null;
    try {
      const cleanText = text.replace(/\s+/g, ' ').trim().toLowerCase();
      const output = await embedderRef.current(cleanText, { pooling: 'mean', normalize: true });
      return Array.from(output.data);
    } catch (err) {
      console.error('Failed to embed search query:', err);
      return null;
    }
  };

  // Helper for computing dot product (cosine similarity since vectors are unit-normalized)
  const dotProduct = (a: number[], b: number[]): number => {
    let sum = 0;
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
      sum += a[i] * b[i];
    }
    return sum;
  };

  const searchKnowledge = useCallback(async (query: string): Promise<SearchItem | null> => {
    const cleanQuery = query.toLowerCase().trim();

    // 1. Direct exact title match (Fast path)
    for (const item of cachedSearchIndex) {
      if (cleanQuery === item.title.toLowerCase()) {
        return item;
      }
    }

    // 2. Tokenize query and filter stop words
    const queryWords = cleanQuery.split(/[^a-z0-9]/).filter(w => w.length > 0);
    const queryKeywords = queryWords.filter(w => !STOP_WORDS.has(w));
    
    // Fall back to all words if query consists entirely of stop words
    const activeWords = queryKeywords.length > 0 ? queryKeywords : queryWords;
    if (activeWords.length === 0) return null;

    // 3. Compute semantic search vector in parallel
    let queryVector: number[] | null = null;
    if (modelReady && embedderRef.current) {
      queryVector = await getQueryEmbedding(cleanQuery);
    }

    let bestItem: SearchItem | null = null;
    let maxScore = 0;

    cachedDocumentVectors.forEach(vector => {
      let keywordScore = 0;
      const cleanTitle = vector.doc.title.toLowerCase();

      // Exact title contains bonus
      if (cleanTitle.includes(cleanQuery)) {
        keywordScore += 25;
      }

      activeWords.forEach(qWord => {
        let bestWordMatch = '';
        let bestWordSim = 0; // 0 to 1

        Object.keys(vector.tfMap).forEach(docWord => {
          if (qWord === docWord) {
            bestWordMatch = docWord;
            bestWordSim = 1;
          } else if (isFuzzyMatch(qWord, docWord)) {
            const dist = getLevenshteinDistance(qWord, docWord);
            const sim = Math.max(0.1, 1 - dist / Math.max(qWord.length, docWord.length));
            if (sim > bestWordSim) {
              bestWordMatch = docWord;
              bestWordSim = sim;
            }
          }
        });

        if (bestWordSim > 0) {
          const tf = vector.tfMap[bestWordMatch];
          const idf = cachedIdfs[bestWordMatch] || 0.1;
          keywordScore += bestWordSim * tf * idf;
        }
      });

      // 4. Calculate semantic similarity if vectors are loaded
      let semanticScore = 0;
      if (queryVector && embeddingsDbRef.current && embeddingsDbRef.current[vector.doc.targetId]) {
        semanticScore = dotProduct(queryVector, embeddingsDbRef.current[vector.doc.targetId]);
      }

      // Combine scores: semantic score is the base (0 to 1), keyword score is a booster (+0.15 max)
      // If the embedder is not ready/fails, fall back entirely to keyword scoring normalized roughly to [0,1]
      const combinedScore = queryVector
        ? (semanticScore + Math.min(0.15, keywordScore / 80))
        : (keywordScore / 25);

      if (combinedScore > maxScore) {
        maxScore = combinedScore;
        bestItem = vector.doc;
      }
    });

    // 5. Apply similarity-based confidence thresholds
    const threshold = queryVector ? 0.38 : 0.2;
    return maxScore >= threshold ? bestItem : null;
  }, [modelReady]);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSendMessage = useCallback((textToSend: string) => {
    if (!textToSend.trim()) return;

    // Cancel any previous in-flight query
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const currentSignal = abortControllerRef.current.signal;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI response delay with cancellation check
    setTimeout(async () => {
      if (currentSignal.aborted) return;
      const match = await searchKnowledge(textToSend);
      if (currentSignal.aborted) return;
      let replyText = '';
      let deepLink: ChatMessage['deepLink'] = undefined;

      if (match) {
        if (match.type === 'glossary') {
          const term = GLOSSARY[match.targetId];
          replyText = `### ${term.term}\n\n**Definition:**\n${term.definition}\n\n**Detailed Explanation:**\n${term.details}`;
          deepLink = {
            topicSlug: '',
            subDiagramId: '',
            glossaryId: term.id,
            label: `View Glossary: ${term.term}`
          };
        } else if (match.type === 'node') {
          replyText = `### ${match.title} (${match.topicTitle || 'Curriculum'})\n\n**What it is:**\n${match.shortExplanation || ''}\n\n**Simple Analogy:**\n${match.simpleExplanation || ''}\n\n**How it works in detail:**\n${match.detailedExplanation || ''}\n\n---\nWould you like me to highlight the **${match.title}** node in the diagram for you?`;
          deepLink = {
            topicSlug: match.topicSlug!,
            subDiagramId: match.subDiagramId!,
            nodeId: match.targetId,
            label: `Focus Node: ${match.title}`
          };
        } else if (match.type === 'topic') {
          replyText = `### ${match.title}\n\nI can open the interactive diagram board for **${match.title}** for you now.`;
          deepLink = {
            topicSlug: match.topicSlug!,
            subDiagramId: match.subDiagramId!,
            label: `Open Topic Canvas: ${match.title}`
          };
        }
      } else {
        replyText = "I'm sorry, I couldn't find a semantic match in our curriculum for that. Currently, I am programmed to answer questions about:\n• **LLM Basics** (Tokenizers, Autoregression, Temperature)\n• **Transformers** (Embeddings, Positional Encoding, Self-Attention)\n• **Prompting** (System prompt limits, Few-shot templates)\n• **RAG** (Chunking, Vector Databases, Indexing, Augmentation)\n• **AI Agents** (ReAct planning, Memory buffers, Tool use/Function calling)\n• **AI Models Library** (Specs, providers, costs, comparisons)\n\nTry asking: *'What is a token?'* or *'How does self-attention work?'* or *'How does the model pick what to say next?'*";
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: replyText,
        deepLink
      };

      setMessages(prev => [...prev, botMsg]);
    }, 400);
  }, [searchKnowledge]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isCollapsed]);

  // Handle triggered questions from nodes or glossary buttons
  useEffect(() => {
    if (triggerQuestion) {
      setIsCollapsed(false);
      handleSendMessage(triggerQuestion);
    }
  }, [triggerQuestion, handleSendMessage]);

  const handleDeepLinkClick = (link: NonNullable<ChatMessage['deepLink']>) => {
    if (link.glossaryId) {
      onNavigateToGlossary(link.glossaryId);
    } else if (link.topicSlug && link.subDiagramId) {
      onNavigateToNode(link.topicSlug, link.subDiagramId, link.nodeId || '');
    }
  };

  const renderBoldText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} style={{ color: '#fff', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const renderMessageText = (text: string) => {
    return text.split('\n\n').map((para, i) => {
      const trimmed = para.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={i} style={{ margin: '10px 0 6px 0', color: '#c084fc', fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            {trimmed.replace('### ', '')}
          </h4>
        );
      }

      if (trimmed === '---') {
        return <hr key={i} style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.1)', margin: '10px 0' }} />;
      }

      if (trimmed.startsWith('•') || trimmed.includes('\n•')) {
        const lines = trimmed.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        return (
          <ul key={i} style={{ paddingLeft: '1.2rem', margin: '6px 0', listStyleType: 'disc' }}>
            {lines.map((line, idx) => {
              const cleanedLine = line.replace(/^•\s*/, '');
              return (
                <li key={idx} style={{ margin: '4px 0', color: 'var(--text-secondary)' }}>
                  {renderBoldText(cleanedLine)}
                </li>
              );
            })}
          </ul>
        );
      }

      return (
        <p key={i} style={{ margin: '6px 0', lineHeight: '1.45' }}>
          {renderBoldText(para)}
        </p>
      );
    });
  };

  return (
    <div
      className={`chat-tutor-container ${isCollapsed ? 'collapsed' : ''}`}
      role="region"
      aria-label="Semantic AI Tutor Chat Widget"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {/* Header */}
      <div
        className="chat-header"
        onMouseDown={handleHeaderMouseDown}
        onClick={handleHeaderClick}
        title="Click to toggle, drag to move"
      >
        <div className="chat-title-group">
          <span style={{ cursor: 'grab', fontSize: '0.9rem', color: 'var(--text-muted)', marginRight: '2px' }} title="Drag to move">
            ⠿
          </span>
          <div className="chat-dot"></div>
          <span className="chat-title">Semantic AI Tutor (RAG) {isCollapsed ? '(Offline)' : ''}</span>
        </div>
        <div className="chat-header-actions">
          {isCollapsed ? '▲' : '▼'}
        </div>
      </div>

      {/* Messages */}
      {!isCollapsed && (
        <>
          <div className="chat-messages" role="log" aria-live="polite">
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <div className={`chat-bubble ${msg.sender}`}>
                  {renderMessageText(msg.text)}
                  
                  {msg.deepLink && (
                    <button
                      className="chat-deep-link"
                      onClick={() => handleDeepLinkClick(msg.deepLink!)}
                    >
                      🔗 {msg.deepLink.label}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {(modelLoading || (!modelReady && modelProgress)) && (
              <div style={{
                padding: '0.6rem 0.8rem',
                margin: '0.4rem 0.8rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                fontSize: '0.75rem',
                color: '#38bdf8',
                fontFamily: 'monospace',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span className="spin-loader">🔄</span>
                <span>{modelProgress}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form */}
          <form
            className="chat-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
          >
            <input
              type="text"
              className="chat-input"
              role="combobox"
              aria-expanded={!isCollapsed}
              aria-autocomplete="list"
              aria-label="Ask Semantic AI Tutor"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="chat-submit-btn" aria-label="Send message">
              ➜
            </button>
          </form>
        </>
      )}
    </div>
  );
};
