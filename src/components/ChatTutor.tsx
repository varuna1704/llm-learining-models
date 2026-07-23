import React, { useState, useRef, useEffect } from 'react';
import { CURRICULUM, GLOSSARY } from '../data/curriculum';

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

function getWordScore(qWord: string, targetWord: string, isTitle: boolean): number {
  if (qWord === targetWord) {
    return isTitle ? 30 : 8;
  }
  if (isFuzzyMatch(qWord, targetWord)) {
    const dist = getLevenshteinDistance(qWord, targetWord);
    const penalty = dist * (isTitle ? 3 : 1);
    const baseScore = isTitle ? 25 : 6;
    return Math.max(isTitle ? 10 : 2, baseScore - penalty);
  }
  return 0;
}

export const ChatTutor: React.FC<ChatTutorProps> = ({
  onNavigateToNode,
  onNavigateToGlossary,
  triggerQuestion
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am your AI Chat Tutor. Ask me any questions about the curriculum (Tokens, Attention, RAG, AI Agents, or Prompting), and I'll explain them using our grounded database. I can also point you to the correct place in the diagrams!",
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
  }, [triggerQuestion]);

  // Build the local knowledge search index
  const getSearchIndex = (): SearchItem[] => {
    const items: SearchItem[] = [];

    // 1. Index Glossary
    Object.values(GLOSSARY).forEach(term => {
      items.push({
        type: 'glossary',
        title: term.term,
        content: `${term.term} ${term.definition} ${term.details}`.toLowerCase(),
        targetId: term.id
      });
    });

    // 2. Index Topics & Nodes
    CURRICULUM.forEach(topic => {
      items.push({
        type: 'topic',
        title: topic.title,
        content: `${topic.title} ${topic.summary}`.toLowerCase(),
        targetId: topic.id,
        topicSlug: topic.slug
      });

      Object.entries(topic.subDiagrams).forEach(([subId, sub]) => {
        sub.nodes.forEach(node => {
          items.push({
            type: 'node',
            title: node.label,
            content: `${node.label} ${node.shortExplanation} ${node.simpleExplanation} ${node.detailedExplanation}`.toLowerCase(),
            targetId: node.id,
            topicSlug: topic.slug,
            subDiagramId: subId,
            nodeLabel: node.label
          });
        });
      });
    });

    return items;
  };

  const searchKnowledge = (query: string): SearchItem | null => {
    const index = getSearchIndex();
    const cleanQuery = query.toLowerCase().trim();

    // 1. Direct exact title match
    for (const item of index) {
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

    let bestItem: SearchItem | null = null;
    let maxScore = 0;

    index.forEach(item => {
      let score = 0;
      const itemTitle = item.title.toLowerCase();
      const itemTitleWords = itemTitle.split(/[^a-z0-9]/).filter(w => w.length > 0);
      const itemContentWords = item.content.split(/[^a-z0-9]/).filter(w => w.length > 0);

      // Exact title contains bonus
      if (itemTitle.includes(cleanQuery)) {
        score += 50;
      }

      // Match each active word from query against item title and content words
      activeWords.forEach(qWord => {
        // Title matches
        let bestTitleScoreForWord = 0;
        itemTitleWords.forEach(tWord => {
          const s = getWordScore(qWord, tWord, true);
          if (s > bestTitleScoreForWord) {
            bestTitleScoreForWord = s;
          }
        });
        score += bestTitleScoreForWord;

        // Content matches
        let contentScoreForWord = 0;
        itemContentWords.forEach(cWord => {
          contentScoreForWord += getWordScore(qWord, cWord, false);
        });
        score += Math.min(24, contentScoreForWord);
      });

      if (score > maxScore) {
        maxScore = score;
        bestItem = item;
      }
    });

    return maxScore >= 10 ? bestItem : null;
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI response delay
    setTimeout(() => {
      const match = searchKnowledge(textToSend);
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
          const topic = CURRICULUM.find(t => t.slug === match.topicSlug);
          const subDiagram = topic?.subDiagrams[match.subDiagramId!];
          const node = subDiagram?.nodes.find(n => n.id === match.targetId);
          
          if (node) {
            replyText = `### ${node.label} (${topic?.title})\n\n**What it is:**\n${node.shortExplanation}\n\n**Simple Analogy:**\n${node.simpleExplanation}\n\n**How it works in detail:**\n${node.detailedExplanation}\n\n---\nWould you like me to highlight the **${node.label}** node in the diagram for you?`;
          } else {
            replyText = `The node **${match.nodeLabel}** in the **${topic?.title}** flow represents: ${match.content.split('.')[0]}. It coordinates actions inside this architecture by processing key states.\n\nWould you like me to open the diagram at this specific node so you can read the explanation?`;
          }
          deepLink = {
            topicSlug: match.topicSlug!,
            subDiagramId: match.subDiagramId!,
            nodeId: match.targetId,
            label: `Focus Node: ${match.nodeLabel}`
          };
        } else if (match.type === 'topic') {
          const topic = CURRICULUM.find(t => t.id === match.targetId);
          const rootSub = topic?.subDiagrams[topic.rootDiagramId];
          let stepsText = '';
          if (rootSub) {
            stepsText = `\n\n**Key steps in this flow:**\n` + rootSub.nodes.map((n) => `• **${n.label}**: ${n.shortExplanation}`).join('\n');
          }
          
          replyText = `### ${topic?.title}\n\n${topic?.summary}${stepsText}\n\n---\nI can open the interactive diagram board for **${topic?.title}** for you now.`;
          deepLink = {
            topicSlug: topic!.slug,
            subDiagramId: topic!.rootDiagramId,
            label: `Open Topic Canvas: ${topic?.title}`
          };
        }
      } else {
        replyText = "I'm sorry, I couldn't find a direct match in our curriculum for that. Currently, I am programmed to answer questions about:\n• **LLM Basics** (Tokenizers, Autoregression, Temperature)\n• **Transformers** (Embeddings, Positional Encoding, Self-Attention)\n• **Prompting** (System prompt limits, Few-shot templates)\n• **RAG** (Chunking, Vector Databases, Indexing, Augmentation)\n• **AI Agents** (ReAct planning, Memory buffers, Tool use/Function calling)\n• **AI Models Library** (Specs, providers, costs, comparisons)\n\nTry asking: *'What is a token?'* or *'How does self-attention work?'*";
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: replyText,
        deepLink
      };

      setMessages(prev => [...prev, botMsg]);
    }, 400);
  };

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
    <div className={`chat-tutor-container ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="chat-header" onClick={() => setIsCollapsed(!isCollapsed)}>
        <div className="chat-title-group">
          <div className="chat-dot"></div>
          <span className="chat-title">AI Tutor {isCollapsed ? '(Offline)' : ''}</span>
        </div>
        <div className="chat-header-actions">
          {isCollapsed ? '▲' : '▼'}
        </div>
      </div>

      {/* Messages */}
      {!isCollapsed && (
        <>
          <div className="chat-messages">
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
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="chat-submit-btn">
              ➜
            </button>
          </form>
        </>
      )}
    </div>
  );
};
