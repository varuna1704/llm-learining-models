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

    // Check for direct match of terms (exact keywords like "RAG", "Attention", "Token")
    for (const item of index) {
      if (cleanQuery === item.title.toLowerCase()) {
        return item;
      }
    }

    // Scored matching
    let bestItem: SearchItem | null = null;
    let maxScore = 0;

    const queryWords = cleanQuery.split(/[^a-z0-9]/).filter(w => w.length > 2);
    if (queryWords.length === 0) return null;

    index.forEach(item => {
      let score = 0;
      
      // Exact title contains bonus
      if (item.title.toLowerCase().includes(cleanQuery)) {
        score += 15;
      }

      // Word matching
      queryWords.forEach(word => {
        // Match word in title
        if (item.title.toLowerCase().includes(word)) score += 5;
        // Match word in description
        if (item.content.includes(word)) score += 1;
      });

      if (score > maxScore) {
        maxScore = score;
        bestItem = item;
      }
    });

    // Threshold score of 3 to prevent random unrelated matches
    return maxScore >= 3 ? bestItem : null;
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
          replyText = `**${term.term}** is defined in our glossary as: ${term.definition}\n\n${term.details}`;
          deepLink = {
            topicSlug: '',
            subDiagramId: '',
            glossaryId: term.id,
            label: `View Glossary: ${term.term}`
          };
        } else if (match.type === 'node') {
          const topic = CURRICULUM.find(t => t.slug === match.topicSlug);
          replyText = `The node **${match.nodeLabel}** in the **${topic?.title}** flow represents: ${match.content.split('.')[0]}. It coordinates actions inside this architecture by processing key states.\n\nWould you like me to open the diagram at this specific node so you can read the simple/detailed explanation toggles?`;
          deepLink = {
            topicSlug: match.topicSlug!,
            subDiagramId: match.subDiagramId!,
            nodeId: match.targetId,
            label: `Focus Node: ${match.nodeLabel}`
          };
        } else if (match.type === 'topic') {
          const topic = CURRICULUM.find(t => t.id === match.targetId);
          replyText = `Here is information on **${topic?.title}**: ${topic?.summary}\n\nI can open this topic's interactive diagram board for you immediately. Click the button below to view the canvas.`;
          deepLink = {
            topicSlug: topic!.slug,
            subDiagramId: topic!.rootDiagramId,
            label: `Open Topic Canvas: ${topic?.title}`
          };
        }
      } else {
        replyText = "I'm sorry, I couldn't find a direct match in our curriculum for that. Currently, I am programmed to answer questions about:\n• **LLM Basics** (Tokenizers, Autoregression, Temperature)\n• **Transformers** (Embeddings, Positional Encoding, Self-Attention)\n• **Prompting** (System prompt limits, Few-shot templates)\n• **RAG** (Chunking, Vector Databases, Indexing, Augmentation)\n• **AI Agents** (ReAct planning, Memory buffers, Tool use/Function calling)\n\nTry asking: *'What is a token?'* or *'How does self-attention work?'*";
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
                  {msg.text.split('\n\n').map((para, i) => (
                    <p key={i} style={{ marginBottom: i < msg.text.split('\n\n').length - 1 ? '0.5rem' : 0 }}>
                      {para.startsWith('•') ? para : para.replace(/\*\*([^*]+)\*\*/g, '$1')}
                    </p>
                  ))}
                  
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
