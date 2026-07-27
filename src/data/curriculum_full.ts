import { llmModelsTopic } from './chapters/llm_models';
import { jsonMemoryTopic } from './chapters/json_memory';
import { tokenEmbeddingsAttentionTopic } from './chapters/token_embeddings_attention';
import { inferenceSamplingTopic } from './chapters/inference_sampling';
import { ragTopic } from './chapters/rag';
import { brainAgentLoopTopic } from './chapters/brain_agent_loop';
import { toolRegistryTopic } from './chapters/tool_registry';
import { workedExamplesTopic } from './chapters/worked_examples';
import { vectorSearchTopic } from './chapters/vector_search';
import { evaluationTopic } from './chapters/evaluation';
import { failureModesTopic } from './chapters/failure_modes';
import { securityTopic } from './chapters/security';
import { libraryBasicsTopic } from './chapters/library_basics';

export const CURRICULUM_FULL = [
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
