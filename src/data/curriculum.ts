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

export interface Topic {
  id: string;
  title: string;
  slug: string;
  summary: string;
  rootDiagramId: string;
  subDiagrams: { [key: string]: SubDiagram };
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

import { llmModelsTopic } from './chapters/llm_models';
import { jsonMemoryTopic } from './chapters/json_memory';
import { tokenEmbeddingsAttentionTopic } from './chapters/token_embeddings_attention';
import { ragTopic } from './chapters/rag';
import { brainAgentLoopTopic } from './chapters/brain_agent_loop';
import { toolRegistryTopic } from './chapters/tool_registry';
import { inferenceSamplingTopic } from './chapters/inference_sampling';
import { workedExamplesTopic } from './chapters/worked_examples';
import { vectorSearchTopic } from './chapters/vector_search';
import { evaluationTopic } from './chapters/evaluation';
import { failureModesTopic } from './chapters/failure_modes';
import { securityTopic } from './chapters/security';
import { libraryBasicsTopic } from './chapters/library_basics';

export const CURRICULUM: Topic[] = [
  llmModelsTopic,
  jsonMemoryTopic,
  tokenEmbeddingsAttentionTopic,
  inferenceSamplingTopic,
  ragTopic,
  brainAgentLoopTopic,
  toolRegistryTopic,
  workedExamplesTopic,
  vectorSearchTopic,
  evaluationTopic,
  failureModesTopic,
  securityTopic,
  libraryBasicsTopic
];
