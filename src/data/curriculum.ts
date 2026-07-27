export interface DiagramNode {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'input' | 'process' | 'database' | 'llm' | 'output' | 'memory' | 'tool' | 'concept';
  shortExplanation: string;
  detailedExplanation: string; // HTML or Markdown format
  simpleExplanation: string; // ELI5 simplified format
  childDiagramId?: string; // Links to nested sub-diagrams
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
}

export interface SubDiagram {
  id: string;
  title: string;
  parentId?: string; // links back to parent node ID
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface TopicMetadata {
  id: string;
  title: string;
  slug: string;
  summary: string;
  rootDiagramId: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Topic extends TopicMetadata {
  subDiagrams: { [key: string]: SubDiagram };
  quiz?: QuizQuestion[];
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  details: string;
}

export const GLOSSARY: { [key: string]: GlossaryTerm } = {
  token: {
    id: 'token',
    term: 'Token',
    definition: 'The basic unit of text processed by an LLM. A token represents a word, part of a word, or punctuation.',
    details: 'LLMs do not read text letter-by-letter or word-by-word. Instead, they break text down into tokens. In English, 1 token is roughly 4 characters or 0.75 words. For example, the word "amazing" might be split into "am" and "azing", while common words like "the" are usually a single token.'
  },
  context_window: {
    id: 'context_window',
    term: 'Context Window',
    definition: 'The maximum limit of tokens an LLM can read and consider at one time when generating a response.',
    details: 'Think of the context window as the model\'s short-term memory during a single conversation. It includes the entire prompt, system instructions, chat history, and the generated response. If a conversation exceeds this window, the model starts forgetting the earliest parts of the chat.'
  },
  embedding: {
    id: 'embedding',
    term: 'Embedding',
    definition: 'A list of numbers (a vector) representing the semantic meaning of a piece of text.',
    details: 'Embedding models translate words, sentences, or paragraphs into hundreds of dimensions of coordinates. Words with similar meanings (like "king" and "queen", or "dog" and "puppy") are positioned close to each other in this high-dimensional mathematical space.'
  },
  vector_database: {
    id: 'vector_database',
    term: 'Vector Database',
    definition: 'A specialized database designed to store and search embeddings efficiently.',
    details: 'Unlike regular databases that look for exact keyword matches, vector databases find items based on semantic similarity. They index and query embeddings in fractions of a second, making them the standard storage backend for RAG applications.'
  },
  attention: {
    id: 'attention',
    term: 'Attention Mechanism',
    definition: 'A mathematical formula that allows the LLM to focus on specific related words when processing a sentence.',
    details: 'Introduced in the 2017 "Attention Is All You Need" paper, Self-Attention calculates how much weight each word in a prompt should place on every other word. For example, in the sentence "The bank of the river," attention helps the model know "bank" refers to land, whereas in "The money in the bank," it refers to a financial institution.'
  },
  system_prompt: {
    id: 'system_prompt',
    term: 'System Prompt',
    definition: 'Core instructions given to an LLM before the user prompt to define its role, tone, and boundaries.',
    details: 'System prompts are injected at the very top of the context window. They set the rules for the assistant, e.g., "You are a helpful chemistry tutor. Keep answers brief and do not write code." The user cannot easily override this prompt during normal chat operations.'
  },
  function_calling: {
    id: 'function_calling',
    term: 'Function Calling / Tool Use',
    definition: 'An LLM ability to output a structured command (like JSON) specifying a tool and parameters to run.',
    details: 'LLMs cannot execute code or query databases directly. However, they can read a tool\'s description (e.g., a weather API tool) and generate a JSON query matching the tool\'s interface. The app host executes the tool and passes the results back to the LLM to finish its response.'
  },
  temperature: {
    id: 'temperature',
    term: 'Temperature',
    definition: 'A setting that controls the randomness/creativity of the model\'s generated text.',
    details: 'Temperature ranges from 0 to 2. A low temperature (e.g., 0.1) makes the model predictable, deterministic, and analytical. A high temperature (e.g., 0.9) makes the model more creative, diverse, but prone to hallucinations.'
  },
  hallucination: {
    id: 'hallucination',
    term: 'Hallucination',
    definition: 'A phenomenon where an LLM generates factually incorrect information confidently.',
    details: 'Because LLMs are next-token predictors rather than database search engines, they generate text based on probability. If they lack information on a topic, they will still try to write plausible-sounding sentences that may be entirely made up.'
  },
  fine_tuning: {
    id: 'fine_tuning',
    term: 'Fine-Tuning',
    definition: 'The process of training an existing pre-trained LLM on a specific dataset to customize its style, tone, or domain knowledge.',
    details: 'Unlike prompting, fine-tuning modifies the actual weights of the neural network. It requires substantial compute resources and training data. It is best used for teaching a model a specific writing style, formatting standard, or niche vocabulary rather than retrieval tasks.'
  }
};

export const CURRICULUM: TopicMetadata[] = [
  {
    id: 'llm_models',
    title: 'AI Model Library',
    slug: 'llm-models',
    summary: 'Learn the classifications of modern frontier models, their stable taxonomy, and current state-of-the-art snapshots.',
    rootDiagramId: 'models_root'
  },
  {
    id: 'json_memory',
    title: 'JSON & Persistable Memory',
    slug: 'json-memory',
    summary: 'Conceptualizes persistent storage of facts using a standard JSON file.',
    rootDiagramId: 'mem_flow_root'
  },
  {
    id: 'token_embeddings_attention',
    title: 'Tokenization, Embeddings & Attention',
    slug: 'token-embeddings-attention',
    summary: 'How the model reads text, processes Byte-Pair Encoding (BPE), and applies self-attention.',
    rootDiagramId: 'tea_flow_root'
  },
  {
    id: 'inference_sampling',
    title: 'Inference & Sampling',
    slug: 'inference-sampling',
    summary: 'Explores temperature, Top-P, Top-K, and how probabilities translate to sentences.',
    rootDiagramId: 'samp_flow_root'
  },
  {
    id: 'rag',
    title: 'Retrieval-Augmented Generation (RAG)',
    slug: 'rag',
    summary: 'Retrieval-Augmented Generation workflows (Embeddings → Vector DBs → Chunking → Context injection).',
    rootDiagramId: 'rag_flow_root'
  },
  {
    id: 'brain_agent_loop',
    title: 'Brain & Agent Loop',
    slug: 'brain-agent-loop',
    summary: 'Standard reasoning cycles: Plan, Act, Observe, Re-evaluate.',
    rootDiagramId: 'loop_flow_root'
  },
  {
    id: 'tool_registry',
    title: 'Tool Registry & Function Dispatching',
    slug: 'tool-registry',
    summary: 'Schema declarations, function calling, parameter validations, and execution.',
    rootDiagramId: 'reg_flow_root'
  },
  {
    id: 'worked_examples',
    title: 'Worked Examples & SDKs',
    slug: 'worked-examples',
    summary: 'Complete code walk-throughs for building search tools, weather fetchers, etc.',
    rootDiagramId: 'ex_flow_root'
  },
  {
    id: 'vector_search',
    title: 'Vector Search in Practice',
    slug: 'vector-search',
    summary: 'Deep dive into semantic similarity, cosine distance, and database indexing.',
    rootDiagramId: 'v_search_flow_root'
  },
  {
    id: 'evaluation',
    title: 'Evaluation & Testing',
    slug: 'evaluation',
    summary: 'Methods for grading prompts and model outputs against ground truths (eval frameworks).',
    rootDiagramId: 'eval_flow_root'
  },
  {
    id: 'failure_modes',
    title: 'Failure Modes & Limitations',
    slug: 'failure-modes',
    summary: 'Investigates hallucinations, prompt injections, output structure drift, and mitigation strategies.',
    rootDiagramId: 'fail_flow_root'
  },
  {
    id: 'security',
    title: 'LLM Security & Prompt Injection',
    slug: 'security',
    summary: 'Best practices on API key storage, input sanitization, and executing sandboxed code.',
    rootDiagramId: 'sec_flow_root'
  },
  {
    id: 'library_basics',
    title: 'Standard Libraries & Types',
    slug: 'library-basics',
    summary: 'Core library functions, sys, os, and built-ins required for building tools from scratch.',
    rootDiagramId: 'lib_flow_root'
  }
];

export const TOPIC_LOADERS: { [slug: string]: () => Promise<any> } = {
  'llm-models': () => import('./chapters/llm_models'),
  'json-memory': () => import('./chapters/json_memory'),
  'token-embeddings-attention': () => import('./chapters/token_embeddings_attention'),
  'inference-sampling': () => import('./chapters/inference_sampling'),
  'rag': () => import('./chapters/rag'),
  'brain-agent-loop': () => import('./chapters/brain_agent_loop'),
  'tool-registry': () => import('./chapters/tool_registry'),
  'worked-examples': () => import('./chapters/worked_examples'),
  'vector-search': () => import('./chapters/vector_search'),
  'evaluation': () => import('./chapters/evaluation'),
  'failure-modes': () => import('./chapters/failure_modes'),
  'security': () => import('./chapters/security'),
  'library-basics': () => import('./chapters/library_basics')
};

import { QUIZZES } from './quizzes';

export const loadTopicDetails = async (slug: string): Promise<Topic> => {
  const loader = TOPIC_LOADERS[slug];
  if (!loader) throw new Error(`Unknown topic slug: ${slug}`);
  const module = await loader();
  const keys = Object.keys(module);
  const topic = module[keys[0]] as Topic;
  topic.quiz = QUIZZES[topic.id] || [];
  return topic;
};
