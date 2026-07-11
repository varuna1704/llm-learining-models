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

export const CURRICULUM: Topic[] = [
  {
    id: 'llm_basics',
    title: 'LLM Basics',
    slug: 'llm-basics',
    summary: 'Learn how Large Language Models ingest prompts, break down text into tokens, and predict responses token-by-token.',
    rootDiagramId: 'llm_basics_root',
    subDiagrams: {
      llm_basics_root: {
        id: 'llm_basics_root',
        title: 'LLM Text Generation Flow',
        nodes: [
          {
            id: 'basics_input',
            label: 'User Prompt',
            x: 50,
            y: 150,
            width: 140,
            height: 70,
            type: 'input',
            shortExplanation: 'The raw text input submitted by the user.',
            simpleExplanation: 'This is the question or instruction you type, like "What is 2 + 2?".',
            detailedExplanation: 'The prompt is the starting point for any LLM transaction. It can range from a single word to entire books, depending on the model\'s **context window**. The client application can wrap your input with a **system prompt** before sending it to the model.'
          },
          {
            id: 'basics_tokenizer',
            label: 'Tokenizer',
            x: 240,
            y: 150,
            width: 140,
            height: 70,
            type: 'process',
            shortExplanation: 'Converts letters and words into numerical tokens.',
            simpleExplanation: 'A translator that cuts your words into puzzle pieces (tokens) and numbers them so the computer can read them.',
            detailedExplanation: 'LLMs cannot process text directly; they operate entirely on numbers. The **Tokenizer** cuts text into smaller chunks called **tokens**. Each token corresponds to a specific ID in a giant vocabulary lookup table (usually 30,000 to 100,000 unique entries). For example, the sentence "I love coding" is split into `[I] [love] [cod] [ing]` and represented as `[40, 1023, 2341, 198]`.'
          },
          {
            id: 'basics_brain',
            label: 'LLM Neural Net (Weights)',
            x: 430,
            y: 150,
            width: 160,
            height: 70,
            type: 'llm',
            shortExplanation: 'A giant network of mathematical equations that calculates probabilities.',
            simpleExplanation: 'The AI\'s brain, full of millions of dials (weights) set during training, calculating what word should come next.',
            detailedExplanation: 'At its core, an LLM is a giant deep-learning neural network (specifically, a **Transformer**). It takes the token IDs, passes them through billions of parameters (weights), and calculates a probability score for every token in its vocabulary. The question it answers is: *"Given these input tokens, what is the single most likely token to appear next?"*'
          },
          {
            id: 'basics_sampler',
            label: 'Sampler (Temp / Top-P)',
            x: 640,
            y: 150,
            width: 160,
            height: 70,
            type: 'concept',
            shortExplanation: 'Controls creativity by selecting the next token based on probabilities.',
            simpleExplanation: 'A filter that decides whether to pick the absolute most obvious word next, or choose a slightly unexpected, creative one.',
            detailedExplanation: 'The model doesn\'t always have to pick the token with the absolute highest probability. Settings like **Temperature** and Top-P adjust the selection. A temperature of `0` makes the model select the top-scoring token every time (deterministic). A higher temperature adds variety, making the output more creative but increasing the risk of **hallucinations**.'
          },
          {
            id: 'basics_loop',
            label: 'Loop (Autoregressive)',
            x: 430,
            y: 280,
            width: 160,
            height: 70,
            type: 'process',
            shortExplanation: 'Feeds the newly generated token back into the input to predict the next one.',
            simpleExplanation: 'The AI outputs one word, attaches it to the end of the original text, and repeats the process to write the next word.',
            detailedExplanation: 'LLMs generate text **autoregressively**—meaning one token at a time. Once a token is selected, it is appended to the bottom of the prompt, and the entire sequence is fed back into the LLM as input. The model runs the calculation again to predict the next token. This loop repeats until the model outputs a special "End of Text" (EOS) token or reaches the **context window** limit.'
          },
          {
            id: 'basics_output',
            label: 'Final Response',
            x: 850,
            y: 150,
            width: 140,
            height: 70,
            type: 'output',
            shortExplanation: 'The generated tokens converted back into human-readable text.',
            simpleExplanation: 'The complete answer, translated back into words, showing up on your screen.',
            detailedExplanation: 'Once the loop terminates, the generated sequence of tokens is sent to the detokenizer, which converts the numbers back into text (words, spaces, and punctuation) and streams it to the user interface in real-time.'
          }
        ],
        edges: [
          { from: 'basics_input', to: 'basics_tokenizer', animated: true },
          { from: 'basics_tokenizer', to: 'basics_brain', animated: true },
          { from: 'basics_brain', to: 'basics_sampler', animated: true },
          { from: 'basics_sampler', to: 'basics_output', animated: true },
          { from: 'basics_sampler', to: 'basics_loop', label: 'Feed back next token' },
          { from: 'basics_loop', to: 'basics_brain', animated: true }
        ]
      }
    }
  },
  {
    id: 'transformers',
    title: 'How Transformers Work',
    slug: 'how-transformers-work',
    summary: 'Understand the self-attention mechanism, neural weights, and structural layers of the Transformer architecture.',
    rootDiagramId: 'transformers_root',
    subDiagrams: {
      transformers_root: {
        id: 'transformers_root',
        title: 'Transformer Architecture Flow',
        nodes: [
          {
            id: 'trans_input',
            label: 'Input Tokens',
            x: 50,
            y: 150,
            width: 140,
            height: 70,
            type: 'input',
            shortExplanation: 'Numbered word parts prepared for mathematical processing.',
            simpleExplanation: 'The words of your prompt, broken down into numbers.',
            detailedExplanation: 'Text is input as a series of token IDs. In order for neural networks to process these, they must first be converted into dense vectors of numerical values.'
          },
          {
            id: 'trans_embedding',
            label: 'Input Embedding',
            x: 230,
            y: 150,
            width: 150,
            height: 70,
            type: 'process',
            shortExplanation: 'Converts token IDs into high-dimensional concept vectors.',
            simpleExplanation: 'Translates each token number into a long list of numbers that represent the meaning of the word.',
            detailedExplanation: 'The embedding layer maps each token ID to a dense vector (usually 4096 or 8192 dimensions in large models) representing the word\'s semantic meaning. Words with similar meanings have similar coordinates in this space.'
          },
          {
            id: 'trans_pos',
            label: 'Positional Encoding',
            x: 420,
            y: 150,
            width: 160,
            height: 70,
            type: 'concept',
            shortExplanation: 'Adds ordering information to the token vectors (since Transformers read everything at once).',
            simpleExplanation: 'Adds a stamp to each word showing its position in the sentence, so the AI knows word order matters.',
            detailedExplanation: 'Unlike old sequential AI models (like RNNs) that read word-by-word, Transformers process all words simultaneously. To keep track of word order, **Positional Encoding** adds coordinates to the embeddings. This helps the model distinguish between "dog bites man" and "man bites dog."'
          },
          {
            id: 'trans_attention',
            label: 'Self-Attention Layer',
            x: 620,
            y: 150,
            width: 160,
            height: 70,
            type: 'llm',
            shortExplanation: 'Calculates the context and relationships between words in the sentence.',
            simpleExplanation: 'The magic layer that lets the model link words together—like matching the word "it" in a story to the "rabbit" it refers to.',
            detailedExplanation: 'The core innovation of the Transformer. The **Self-Attention** layer calculates attention scores between all words in the input. For each word, it generates a query, key, and value vector, then computes a weighted sum of other words. This creates rich, contextual embeddings that capture exact relationships.',
            childDiagramId: 'sub_attention'
          },
          {
            id: 'trans_ffn',
            label: 'Feed Forward Network',
            x: 820,
            y: 150,
            width: 160,
            height: 70,
            type: 'process',
            shortExplanation: 'Processes each token vector individually to extract complex features.',
            simpleExplanation: 'A standard computing layer that refines the word vectors to understand deeper concepts.',
            detailedExplanation: 'After the attention layer blends contextual data across tokens, the **Feed Forward Network (FFN)** applies non-linear transformations to each token vector independently. This layer holds a large portion of the model\'s facts and knowledge.'
          },
          {
            id: 'trans_output',
            label: 'Logits & Next Token',
            x: 1020,
            y: 150,
            width: 150,
            height: 70,
            type: 'output',
            shortExplanation: 'Produces vocabulary scores to pick the final next word.',
            simpleExplanation: 'The output score sheet showing which word in the dictionary is the best match to write next.',
            detailedExplanation: 'The final layer maps the processed vectors back to the size of the vocabulary. The output represents raw values (logits), which are converted into probabilities using a Softmax function. The highest probability tokens are selected to write the next word.'
          }
        ],
        edges: [
          { from: 'trans_input', to: 'trans_embedding', animated: true },
          { from: 'trans_embedding', to: 'trans_pos', animated: true },
          { from: 'trans_pos', to: 'trans_attention', animated: true },
          { from: 'trans_attention', to: 'trans_ffn', animated: true },
          { from: 'trans_ffn', to: 'trans_output', animated: true }
        ]
      },
      sub_attention: {
        id: 'sub_attention',
        title: 'Detail: Self-Attention Mechanism',
        parentId: 'trans_attention',
        nodes: [
          {
            id: 'att_qkv',
            label: 'Query, Key, Value (QKV)',
            x: 100,
            y: 150,
            width: 180,
            height: 70,
            type: 'process',
            shortExplanation: 'Splits each word vector into three representations.',
            simpleExplanation: 'Turns each word into a question (Query), a catalog label (Key), and the actual word meaning (Value).',
            detailedExplanation: 'For each token vector, the model multiplies it by three separate learned weight matrices to create a **Query** vector, a **Key** vector, and a **Value** vector.'
          },
          {
            id: 'att_dot',
            label: 'Dot Product (QKᵀ)',
            x: 340,
            y: 150,
            width: 160,
            height: 70,
            type: 'concept',
            shortExplanation: 'Compares all queries against all keys to score word relationships.',
            simpleExplanation: 'Matches the questions of each word against the labels of all other words to see how much they relate.',
            detailedExplanation: 'The model takes the dot product of the Query matrix and the Key matrix. A high score means a query word (like "he") strongly relates to a key word (like "John").'
          },
          {
            id: 'att_softmax',
            label: 'Softmax (Weights)',
            x: 550,
            y: 150,
            width: 160,
            height: 70,
            type: 'process',
            shortExplanation: 'Normalizes the scores into percentages that sum to 1.',
            simpleExplanation: 'Turns relationship scores into clear percentages, e.g., "it" is 80% related to "dog" and 10% related to "park".',
            detailedExplanation: 'Scores are divided by the square root of the key dimension (for stability) and fed into a Softmax function, converting them into attention weights ranging between 0 and 1.'
          },
          {
            id: 'att_value',
            label: 'Multiply with Value (V)',
            x: 760,
            y: 150,
            width: 180,
            height: 70,
            type: 'output',
            shortExplanation: 'Multiplies weights by the Value vectors to form the contextual output.',
            simpleExplanation: 'Blends the actual word meanings based on the connection percentages to produce a new, smart word representation.',
            detailedExplanation: 'Finally, the attention weights are multiplied by the original Value vectors. Tokens with high attention weights contribute more to the output vector, creating a word representation rich with its context.'
          }
        ],
        edges: [
          { from: 'att_qkv', to: 'att_dot', animated: true },
          { from: 'att_dot', to: 'att_softmax', animated: true },
          { from: 'att_softmax', to: 'att_value', animated: true }
        ]
      }
    }
  },
  {
    id: 'prompting',
    title: 'Prompting Basics',
    slug: 'prompting-basics',
    summary: 'Master system instructions, few-shot templates, role playing, and context construction to program LLMs.',
    rootDiagramId: 'prompting_root',
    subDiagrams: {
      prompting_root: {
        id: 'prompting_root',
        title: 'Structured Prompt Construction',
        nodes: [
          {
            id: 'prompt_sys',
            label: 'System Prompt',
            x: 50,
            y: 80,
            width: 150,
            height: 70,
            type: 'input',
            shortExplanation: 'The background rules and behavioral boundaries for the model.',
            simpleExplanation: 'The golden rules for the AI, like "You are a polite Spanish teacher. Answer in short sentences."',
            detailedExplanation: 'The **System Prompt** sits at the top of the context and configures the AI\'s persona, response constraints, safety rules, and available tools.'
          },
          {
            id: 'prompt_examples',
            label: 'Few-Shot Examples',
            x: 50,
            y: 220,
            width: 150,
            height: 70,
            type: 'input',
            shortExplanation: 'Sample questions and answers demonstrating the desired format.',
            simpleExplanation: 'Example cards showing the AI exactly how you want it to format its answer.',
            detailedExplanation: 'Also known as **In-Context Learning**. Providing 1 to 5 pairs of examples helps the model understand complex formats and styling requirements far better than plain instructions alone.'
          },
          {
            id: 'prompt_user',
            label: 'User Query / Input',
            x: 250,
            y: 150,
            width: 150,
            height: 70,
            type: 'input',
            shortExplanation: 'The actual command or text to process.',
            simpleExplanation: 'Your current question or task, like "Translate: Good morning".',
            detailedExplanation: 'This is the dynamic portion of the prompt, representing the user\'s current request. In applications, it is concatenated with system rules and examples before being sent.'
          },
          {
            id: 'prompt_assembler',
            label: 'Context Assembler',
            x: 460,
            y: 150,
            width: 150,
            height: 70,
            type: 'process',
            shortExplanation: 'Merges all sections into one single token stream.',
            simpleExplanation: 'The organizer that stitches the rules, examples, and your question into one long text chain.',
            detailedExplanation: 'Before calling the API, the app binds the system rules, examples, user prompt, and conversation history together. It truncates old history if the total length approaches the **context window** boundary.'
          },
          {
            id: 'prompt_llm',
            label: 'LLM Prediction',
            x: 660,
            y: 150,
            width: 150,
            height: 70,
            type: 'llm',
            shortExplanation: 'Generates the response based on the combined instructions.',
            simpleExplanation: 'The AI processes the combined text and outputs a response matching the format you requested.',
            detailedExplanation: 'The LLM processes the complete context. Since it contains explicit system rules and few-shot formatting guides, the output is highly likely to adhere to the target format.'
          }
        ],
        edges: [
          { from: 'prompt_sys', to: 'prompt_assembler', animated: true },
          { from: 'prompt_examples', to: 'prompt_assembler', animated: true },
          { from: 'prompt_user', to: 'prompt_assembler', animated: true },
          { from: 'prompt_assembler', to: 'prompt_llm', animated: true }
        ]
      }
    }
  },
  {
    id: 'rag',
    title: 'Retrieval-Augmented Generation (RAG)',
    slug: 'retrieval-augmented-generation',
    summary: 'Explore embeddings, vector search, semantic lookup, and injecting document contexts to eliminate LLM hallucinations.',
    rootDiagramId: 'rag_root',
    subDiagrams: {
      rag_root: {
        id: 'rag_root',
        title: 'Standard RAG Architecture',
        nodes: [
          {
            id: 'rag_user',
            label: 'User Prompt',
            x: 50,
            y: 150,
            width: 140,
            height: 70,
            type: 'input',
            shortExplanation: 'The user\'s question (e.g., "What was our revenue in Q3?").',
            simpleExplanation: 'You ask a question about specific files, like "What is my project deadline?"',
            detailedExplanation: 'The process starts when a user asks a question about private data or documents that the LLM was not trained on.'
          },
          {
            id: 'rag_embedder',
            label: 'Embedding Model',
            x: 230,
            y: 150,
            width: 150,
            height: 70,
            type: 'process',
            shortExplanation: 'Translates the prompt into a mathematical coordinate vector.',
            simpleExplanation: 'Converts your question into a mathematical code that captures the meaning.',
            detailedExplanation: 'The system sends the prompt to an embedding model. This model outputs a vector of numbers representing the semantic meaning of your question.'
          },
          {
            id: 'rag_db',
            label: 'Vector Database',
            x: 420,
            y: 150,
            width: 150,
            height: 70,
            type: 'database',
            shortExplanation: 'Retrieves relevant document fragments matching the prompt\'s vector.',
            simpleExplanation: 'Searches through your documents and pulls out the paragraph with the closest matching meaning.',
            detailedExplanation: 'The system performs a vector similarity search (like cosine distance) comparing the prompt vector against pre-indexed document embeddings in the database. It retrieves the top-k most similar text chunks.',
            childDiagramId: 'sub_indexing'
          },
          {
            id: 'rag_augment',
            label: 'Augmented Context',
            x: 610,
            y: 150,
            width: 160,
            height: 70,
            type: 'concept',
            shortExplanation: 'Injects the retrieved text chunks directly into the prompt.',
            simpleExplanation: 'Stitches the found paragraph directly into the instructions before sending it to the AI.',
            detailedExplanation: 'The system rewrites the prompt: *"Answer the user\'s question based only on this context: [Retrieved Text Chunks]. Question: [User Prompt]"*.'
          },
          {
            id: 'rag_llm',
            label: 'Grounded LLM',
            x: 810,
            y: 150,
            width: 150,
            height: 70,
            type: 'llm',
            shortExplanation: 'Generates an accurate response using the provided documents.',
            simpleExplanation: 'The AI reads the attached facts and writes a correct response, pointing to the source.',
            detailedExplanation: 'Because the LLM receives the source facts inside its prompt, it does not have to guess or hallucinate. It summarizes the answer directly using the provided facts.'
          }
        ],
        edges: [
          { from: 'rag_user', to: 'rag_embedder', animated: true },
          { from: 'rag_embedder', to: 'rag_db', animated: true },
          { from: 'rag_db', to: 'rag_augment', label: 'Retrieved text chunks' },
          { from: 'rag_augment', to: 'rag_llm', animated: true }
        ]
      },
      sub_indexing: {
        id: 'sub_indexing',
        title: 'Detail: Document Chunking & Indexing Pipeline',
        parentId: 'rag_db',
        nodes: [
          {
            id: 'idx_docs',
            label: 'Raw Documents',
            x: 50,
            y: 150,
            width: 140,
            height: 70,
            type: 'input',
            shortExplanation: 'Private files, PDFs, logs, or databases.',
            simpleExplanation: 'Your raw files, PDFs, or instruction manuals.',
            detailedExplanation: 'The target information base that contains the answers we want the AI to retrieve.'
          },
          {
            id: 'idx_chunks',
            label: 'Text Chunking',
            x: 230,
            y: 150,
            width: 140,
            height: 70,
            type: 'process',
            shortExplanation: 'Splits long documents into smaller, overlapping sections.',
            simpleExplanation: 'Cuts the books into small, manageable paragraphs so we do not overwhelm the search.',
            detailedExplanation: 'To ensure search accuracy and stay within LLM token limits, documents are split into chunks (e.g. 500 characters) with a slight overlap (e.g. 50 characters) so context is not cut in half.'
          },
          {
            id: 'idx_embed',
            label: 'Bulk Embedding',
            x: 410,
            y: 150,
            width: 140,
            height: 70,
            type: 'process',
            shortExplanation: 'Generates vectors for all document chunks.',
            simpleExplanation: 'Generates a meaning-number-list for every single paragraph.',
            detailedExplanation: 'Each text chunk is processed by the embedding model to create its corresponding vector embedding.'
          },
          {
            id: 'idx_load',
            label: 'Vector DB Storage',
            x: 590,
            y: 150,
            width: 150,
            height: 70,
            type: 'database',
            shortExplanation: 'Saves text alongside its vector index for rapid search.',
            simpleExplanation: 'Saves both the paragraphs and their meaning-numbers in a smart cabinet (Vector DB) for instant searching.',
            detailedExplanation: 'The embeddings are loaded into the **Vector Database** alongside their metadata (raw text, file origin, page number). The database indexes the vectors for instant lookup.'
          }
        ],
        edges: [
          { from: 'idx_docs', to: 'idx_chunks', animated: true },
          { from: 'idx_chunks', to: 'idx_embed', animated: true },
          { from: 'idx_embed', to: 'idx_load', animated: true }
        ]
      }
    }
  },
  {
    id: 'ai_agents',
    title: 'AI Agents',
    slug: 'ai-agents',
    summary: 'Deconstruct autonomous agents into Planning, Memory, Tool Usage, and LLM-driven Execution loops.',
    rootDiagramId: 'agents_root',
    subDiagrams: {
      agents_root: {
        id: 'agents_root',
        title: 'Single-Agent Architecture',
        nodes: [
          {
            id: 'agt_user',
            label: 'User Request',
            x: 50,
            y: 150,
            width: 140,
            height: 70,
            type: 'input',
            shortExplanation: 'The initial goal assigned to the agent.',
            simpleExplanation: 'The high-level goal you give the AI, e.g., "Find the cheapest flight to Paris next week".',
            detailedExplanation: 'The user defines an end goal. Unlike a standard chatbot that responds once, an Agent is given autonomy to design and execute a multi-step plan to achieve it.'
          },
          {
            id: 'agt_brain',
            label: 'LLM (Brain)',
            x: 230,
            y: 150,
            width: 140,
            height: 70,
            type: 'llm',
            shortExplanation: 'The core decider that plans, reasons, and reads memories.',
            simpleExplanation: 'The brain of the agent, deciding what steps to take and what tools to use.',
            detailedExplanation: 'The LLM acts as the central controller. It receives the prompt, checks the state, retrieves memories, and decides whether the goal is achieved or if it needs to execute a tool.'
          },
          {
            id: 'agt_memory',
            label: 'Memory Bank',
            x: 230,
            y: 40,
            width: 140,
            height: 70,
            type: 'memory',
            shortExplanation: 'Tracks short-term chat logs and stores long-term logs.',
            simpleExplanation: 'The AI\'s notebook, holding conversation history (short-term) and facts learned over time (long-term).',
            detailedExplanation: 'Stores previous attempts, facts, and chat logs. Short-term memory keeps the conversational history. Long-term memory uses vector databases to retrieve relevant past experiences.',
            childDiagramId: 'sub_memory'
          },
          {
            id: 'agt_planning',
            label: 'Planning Module',
            x: 410,
            y: 150,
            width: 150,
            height: 70,
            type: 'concept',
            shortExplanation: 'Breaks goals into smaller sub-tasks (ReAct / Chain of Thought).',
            simpleExplanation: 'The thinking phase where the AI lists the steps it needs to take (e.g., "1. Check date. 2. Query flight API.").',
            detailedExplanation: 'Enables the agent to outline tasks. Frameworks like **ReAct** (Reason + Act) prompt the LLM to write "Thought: I need to check flights first," "Action: Call flight API," and "Observation: Flights cost $500."'
          },
          {
            id: 'agt_tools',
            label: 'Tool Execution',
            x: 590,
            y: 150,
            width: 150,
            height: 70,
            type: 'tool',
            shortExplanation: 'Runs external actions (Web search, calculator, databases).',
            simpleExplanation: 'The hands of the agent. The AI outputs a command, and the computer runs it (e.g., fetching actual flight prices).',
            detailedExplanation: 'The agent uses **Function Calling** to execute external operations. The application executes the tool and retrieves real-world feedback.',
            childDiagramId: 'sub_tools'
          },
          {
            id: 'agt_loop',
            label: 'Agent Loop (Feedback)',
            x: 410,
            y: 280,
            width: 160,
            height: 70,
            type: 'process',
            shortExplanation: 'Feeds tool feedback back to the brain to adjust the plan.',
            simpleExplanation: 'Checks the result of the tool. If not done, it loops back to the brain with the new info to try the next step.',
            detailedExplanation: 'The output of the tool (Observation) is appended to the agent\'s context. The brain reads this update and decides the next action. This loop continues until a final answer is resolved.'
          },
          {
            id: 'agt_output',
            label: 'Goal Completed',
            x: 780,
            y: 150,
            width: 140,
            height: 70,
            type: 'output',
            shortExplanation: 'The final resolved response returned to the user.',
            simpleExplanation: 'The agent finishes all steps and gives you the final answer: "Here is the cheapest flight for $480 on Tuesday."',
            detailedExplanation: 'When the brain determines that the task is finished, it halts the loop and formats a clean final report containing the answer and citation history.'
          }
        ],
        edges: [
          { from: 'agt_user', to: 'agt_brain', animated: true },
          { from: 'agt_brain', to: 'agt_memory', animated: true },
          { from: 'agt_memory', to: 'agt_brain', animated: true },
          { from: 'agt_brain', to: 'agt_planning', animated: true },
          { from: 'agt_planning', to: 'agt_tools', animated: true },
          { from: 'agt_tools', to: 'agt_loop', label: 'Tool Output (Observation)' },
          { from: 'agt_loop', to: 'agt_brain', animated: true },
          { from: 'agt_tools', to: 'agt_output', animated: true }
        ]
      },
      sub_memory: {
        id: 'sub_memory',
        title: 'Detail: Agent Memory Types',
        parentId: 'agt_memory',
        nodes: [
          {
            id: 'mem_sensory',
            label: 'Sensory Memory',
            x: 50,
            y: 150,
            width: 150,
            height: 70,
            type: 'concept',
            shortExplanation: 'Immediate context from the latest user message.',
            simpleExplanation: 'What the AI is reading or seeing at this exact split-second.',
            detailedExplanation: 'Transient inputs like raw sensory buffers or immediate prompt details that disappear once the execution step starts.'
          },
          {
            id: 'mem_short',
            label: 'Short-Term Memory',
            x: 240,
            y: 150,
            width: 160,
            height: 70,
            type: 'memory',
            shortExplanation: 'Active chat messages inside the prompt context.',
            simpleExplanation: 'The chat history of the current conversation, so the AI remembers what you said 2 minutes ago.',
            detailedExplanation: 'The running log of prompts, reasoning chain (thoughts), and tool results that fit directly inside the current context window.'
          },
          {
            id: 'mem_long',
            label: 'Long-Term Memory',
            x: 440,
            y: 150,
            width: 160,
            height: 70,
            type: 'memory',
            shortExplanation: 'Vector storage of past interactions across sessions.',
            simpleExplanation: 'The permanent database holding logs from last week, letting the AI remember your preferences over time.',
            detailedExplanation: 'A database that persists logs of past runs, user data, and factual context. It allows the agent to perform semantic lookups to recall historical settings and facts.'
          }
        ],
        edges: [
          { from: 'mem_sensory', to: 'mem_short', animated: true },
          { from: 'mem_short', to: 'mem_long', animated: true }
        ]
      },
      sub_tools: {
        id: 'sub_tools',
        title: 'Detail: Function Calling Flow',
        parentId: 'agt_tools',
        nodes: [
          {
            id: 'tl_desc',
            label: 'Tool Declarations',
            x: 50,
            y: 150,
            width: 160,
            height: 70,
            type: 'input',
            shortExplanation: 'JSON list describing functions, parameters, and types.',
            simpleExplanation: 'The list of instructions given to the AI explaining what buttons it can push, like a calculator or google search.',
            detailedExplanation: 'Developers define functions in JSON format, describing the tool name, its parameters, and variable types, which is appended to the system prompt.'
          },
          {
            id: 'tl_call',
            label: 'LLM Function Call',
            x: 250,
            y: 150,
            width: 160,
            height: 70,
            type: 'llm',
            shortExplanation: 'The model outputs a formatted JSON request to run a tool.',
            simpleExplanation: 'Instead of regular text, the AI writes a command: "Run the Calculator with parameters: 45 * 87".',
            detailedExplanation: 'When the LLM decides a tool is needed, it halts text generation and writes a structured JSON object matching the function schema.'
          },
          {
            id: 'tl_exec',
            label: 'App Execution',
            x: 450,
            y: 150,
            width: 160,
            height: 70,
            type: 'process',
            shortExplanation: 'The host system executes the code or API call.',
            simpleExplanation: 'The app checks the command, runs the calculator tool on the server, and retrieves the mathematical answer.',
            detailedExplanation: 'The client application parses the LLM\'s JSON output, calls the designated function (fetching APIs, querying databases, running code), and captures the output.'
          },
          {
            id: 'tl_res',
            label: 'Inject Observation',
            x: 650,
            y: 150,
            width: 160,
            height: 70,
            type: 'output',
            shortExplanation: 'Sends the function results back to the LLM.',
            simpleExplanation: 'The app appends the result ("3915") back into the prompt conversation so the AI can read it.',
            detailedExplanation: 'The execution results are formatted as a "tool response" and attached to the conversation history. The LLM reads this observation to plan its next response.'
          }
        ],
        edges: [
          { from: 'tl_desc', to: 'tl_call', animated: true },
          { from: 'tl_call', to: 'tl_exec', animated: true },
          { from: 'tl_exec', to: 'tl_res', animated: true }
        ]
      }
    }
  }
];
