export interface AchievementBadge {
  id: string;
  title: string;
  category: 'Tokenizer' | 'Embedding' | 'Attention' | 'Transformer' | 'Prompting' | 'RAG' | 'Agent' | 'Security' | 'General';
  description: string;
  icon: string;
  unlockedAt?: string;
}

export const BADGES: AchievementBadge[] = [
  {
    id: 'tokenizer_expert',
    title: 'Tokenizer Expert',
    category: 'Tokenizer',
    description: 'Explored BPE, WordPiece, and SentencePiece tokenization algorithms in the Tokenizer Lab.',
    icon: '🪙'
  },
  {
    id: 'embedding_explorer',
    title: 'Embedding Explorer',
    category: 'Embedding',
    description: 'Calculated cosine similarity and mapped high-dimensional vectors in the Embedding Lab.',
    icon: '📐'
  },
  {
    id: 'attention_master',
    title: 'Attention Master',
    category: 'Attention',
    description: 'Inspected word query-key weights and multi-head attention projections.',
    icon: '👁️'
  },
  {
    id: 'transformer_architect',
    title: 'Transformer Architect',
    category: 'Transformer',
    description: 'Dissected the internal residual connections and layer normalization of a Transformer Block.',
    icon: '🧱'
  },
  {
    id: 'prompt_engineer',
    title: 'Prompt Engineer',
    category: 'Prompting',
    description: 'Compared bad, good, and expert prompt structures in the Prompt Engineering Lab.',
    icon: '✍️'
  },
  {
    id: 'rag_specialist',
    title: 'RAG Specialist',
    category: 'RAG',
    description: 'Simulated document chunking, vector DB indexing, and prompt augmentation.',
    icon: '🔍'
  },
  {
    id: 'agent_builder',
    title: 'AI Agent Builder',
    category: 'Agent',
    description: 'Executed a complete ReAct (Plan-Act-Observe-Memory) autonomous agent loop.',
    icon: '🤖'
  },
  {
    id: 'security_explorer',
    title: 'Security Explorer',
    category: 'Security',
    description: 'Investigated prompt injection attacks and hallucination mitigation strategies.',
    icon: '🛡️'
  },
  {
    id: 'llm_expert',
    title: 'LLM Expert',
    category: 'General',
    description: 'Mastered all interactive laboratories and completed the LLM engineering roadmap.',
    icon: '🎓'
  }
];

export interface UserProgressState {
  completedLabs: string[];
  completedTopics: string[];
  unlockedBadgeIds: string[];
  streakDays: number;
  lastActiveDate: string;
  bookmarkedNodes: string[];
}

const STORAGE_KEY = 'modelmap_user_progress_v2';

export function loadUserProgress(): UserProgressState {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse user progress:', e);
  }

  return {
    completedLabs: [],
    completedTopics: [],
    unlockedBadgeIds: [],
    streakDays: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    bookmarkedNodes: []
  };
}

export function saveUserProgress(state: UserProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save user progress:', e);
  }
}

export function markLabCompleted(labId: string): UserProgressState {
  const current = loadUserProgress();
  if (!current.completedLabs.includes(labId)) {
    current.completedLabs.push(labId);
    
    // Check automatic badge unlocks based on lab ID
    const badgeMap: { [key: string]: string } = {
      'tokenizer': 'tokenizer_expert',
      'embedding': 'embedding_explorer',
      'attention': 'attention_master',
      'transformer': 'transformer_architect',
      'prompting': 'prompt_engineer',
      'rag': 'rag_specialist',
      'agent': 'agent_builder',
      'security': 'security_explorer'
    };

    const targetBadge = badgeMap[labId];
    if (targetBadge && !current.unlockedBadgeIds.includes(targetBadge)) {
      current.unlockedBadgeIds.push(targetBadge);
    }

    if (current.completedLabs.length >= 8 && !current.unlockedBadgeIds.includes('llm_expert')) {
      current.unlockedBadgeIds.push('llm_expert');
    }

    saveUserProgress(current);
  }
  return current;
}
