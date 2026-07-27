import type { QuizQuestion } from './curriculum';

export const QUIZZES: { [topicId: string]: QuizQuestion[] } = {
  llm_models: [
    {
      question: "What is the main difference between Closed-Source APIs and Open-Weights models?",
      options: [
        "Open-weights can be run locally on private hardware",
        "APIs are always cheaper to operate",
        "Open-weights are only created by academic research labs",
        "APIs are open-source and editable"
      ],
      correctAnswerIndex: 0,
      explanation: "Open-weights models allow access to the model parameters, meaning you can download and run them on your own hardware, whereas closed-source models require using an external cloud API."
    },
    {
      question: "Which category of model is optimized for small size and low power, often running on edge devices?",
      options: [
        "Frontier APIs",
        "SLMs (Small Language Models)",
        "Reasoning Models",
        "Vector Databases"
      ],
      correctAnswerIndex: 1,
      explanation: "SLMs (Small Language Models) are designed to have fewer parameters, making them cheap and fast enough to run locally or on resource-constrained devices."
    },
    {
      question: "What is the primary feature of 'Reasoning Models' (like OpenAI's o1 or DeepSeek-R1)?",
      options: [
        "They generate text much faster",
        "They run a chain of thought before returning the final token",
        "They are cheap to run",
        "They don't use self-attention query vectors"
      ],
      correctAnswerIndex: 1,
      explanation: "Reasoning models use dynamic compute-at-inference to execute internal planning and thinking cycles before generating the output."
    }
  ],
  json_memory: [
    {
      question: "Why is JSON a popular choice for persistent memory in simple agents?",
      options: [
        "It is a compiled binary format",
        "It is human-readable and standard across programming languages",
        "It runs automatically on disk drives",
        "It does not allow duplicate keys"
      ],
      correctAnswerIndex: 1,
      explanation: "JSON is human-readable, lightweight, and easily serialized/deserialized in Python, JavaScript, and other languages."
    },
    {
      question: "What is the risk of using a simple local file (like facts.json) as a database in a multi-user environment?",
      options: [
        "JSON cannot store strings",
        "Concurrent writes can corrupt the file",
        "It requires a cloud connection",
        "JSON files expire over time"
      ],
      correctAnswerIndex: 1,
      explanation: "Without transaction locks, concurrent writes from multiple processes can overwrite each other and corrupt the file."
    },
    {
      question: "When an agent loads its memory from a JSON file, what state does it represent in the agent loop?",
      options: [
        "Tool execution",
        "Reading long-term state/history on startup",
        "Generating logits",
        "BPE tokenization"
      ],
      correctAnswerIndex: 1,
      explanation: "Loading the JSON file on startup restores the agent's persistent memory state so it can recall facts from previous sessions."
    }
  ],
  token_embeddings_attention: [
    {
      question: "What is the goal of Byte-Pair Encoding (BPE)?",
      options: [
        "To compute cosine similarity",
        "To split text into sub-word tokens based on frequency",
        "To convert tokens to vector coordinates",
        "To run self-attention queries"
      ],
      correctAnswerIndex: 1,
      explanation: "BPE iteratively merges the most frequent pairs of bytes/characters to create a vocabulary of sub-words."
    },
    {
      question: "How does a dense embedding represent a word?",
      options: [
        "As a single unique integer index",
        "As a high-dimensional vector of floating-point numbers",
        "As an HTML string",
        "As a list of characters"
      ],
      correctAnswerIndex: 1,
      explanation: "Embeddings map tokens to a continuous vector space where semantically similar words are positioned closer together."
    },
    {
      question: "What is the function of the 'Query' vector in self-attention?",
      options: [
        "To represent what the current token is looking for",
        "To store the value of the token",
        "To tokenize input characters",
        "To filter out stop words"
      ],
      correctAnswerIndex: 0,
      explanation: "In self-attention, each token projects a Query vector which is matched against all tokens' Key vectors to determine attention weights."
    }
  ],
  inference_sampling: [
    {
      question: "How does a temperature of 0.0 affect model generation?",
      options: [
        "It makes the model highly random",
        "It makes the model deterministic (always picks the highest probability token)",
        "It stops token generation immediately",
        "It increases context length"
      ],
      correctAnswerIndex: 1,
      explanation: "A temperature of 0.0 makes the sampling greedy, always choosing the token with the maximum logit value."
    },
    {
      question: "What does Top-P (Nucleus) sampling do?",
      options: [
        "Filters tokens to the top K most likely options",
        "Filters tokens to the smallest set whose cumulative probability exceeds P",
        "Multiplies logits by P",
        "Forces the model to output punctuation"
      ],
      correctAnswerIndex: 1,
      explanation: "Top-P sampling selects from the smallest subset of tokens whose combined probability sums to at least P."
    },
    {
      question: "Why is token streaming preferred in conversational UIs?",
      options: [
        "It reduces the model's computation time",
        "It improves perceived latency by displaying tokens as they are generated",
        "It prevents hallucinations",
        "It reduces memory usage of the model"
      ],
      correctAnswerIndex: 1,
      explanation: "Displaying tokens one-by-one as they are decoded makes the interface feel highly responsive to users."
    }
  ],
  rag: [
    {
      question: "What is the primary benefit of RAG?",
      options: [
        "It fine-tunes the model's weights on private data",
        "It grounds the model's answers in external reference documents",
        "It speeds up token generation",
        "It allows running models without RAM"
      ],
      correctAnswerIndex: 1,
      explanation: "RAG retrieves context relevant to the user query and appends it to the prompt, ensuring factual, up-to-date responses without expensive training."
    },
    {
      question: "Why is document chunking necessary before indexing?",
      options: [
        "To fit documents within the model's context window limits",
        "To translate text to JSON",
        "To remove stop words",
        "To compress the files"
      ],
      correctAnswerIndex: 0,
      explanation: "Models have strict context length limits, and chunking ensures that only the most relevant, sized snippets are injected."
    },
    {
      question: "What component evaluates the similarity of the query vector to document vectors?",
      options: [
        "Tiktoken",
        "Vector Database",
        "System Prompt",
        "Logits sampler"
      ],
      correctAnswerIndex: 1,
      explanation: "Vector databases index high-dimensional dense embeddings to perform fast nearest-neighbor similarity searches."
    }
  ],
  brain_agent_loop: [
    {
      question: "What planning framework does the ReAct loop represent?",
      options: [
        "Random Actions",
        "Reasoning and Acting interleaved",
        "Recursive Attention",
        "Reaction-only prompting"
      ],
      correctAnswerIndex: 1,
      explanation: "ReAct coordinates agent reasoning ('Thought') and execution ('Action') in an alternating cycle to solve tasks."
    },
    {
      question: "What happens if an agent loop lacks an execution safety limit (max iterations)?",
      options: [
        "The model will crash instantly",
        "It may enter an infinite loop of calling tools",
        "The temperature increases",
        "It runs out of storage"
      ],
      correctAnswerIndex: 1,
      explanation: "Without a max iteration boundary, recursive failure states or loops can result in infinite tool calls and run up massive API bills."
    },
    {
      question: "What serves as the 'short-term memory' in an agent loop?",
      options: [
        "The persistent disk JSON file",
        "The accumulated conversation context history in the prompt",
        "The vector database",
        "The BPE tokenizer dictionary"
      ],
      correctAnswerIndex: 1,
      explanation: "The running log of thoughts, actions, and observations in the prompt functions as the agent's short-term context."
    }
  ],
  tool_registry: [
    {
      question: "Why do LLM tool registries require JSON schemas for functions?",
      options: [
        "To encrypt the code parameters",
        "To describe the function arguments so the LLM knows how to call it",
        "To compile the function to WASM",
        "To run unit tests"
      ],
      correctAnswerIndex: 1,
      explanation: "The LLM reads the description and properties in the JSON schema to structure the correct function arguments."
    },
    {
      question: "What is the role of the 'Dispatcher' in an agent architecture?",
      options: [
        "To generate embeddings",
        "To parse the model's tool call and execute the corresponding code",
        "To change the temperature",
        "To store vectors"
      ],
      correctAnswerIndex: 1,
      explanation: "The dispatcher matches the model's structured tool request to local functions, runs them, and formats the output back to the LLM."
    },
    {
      question: "If the LLM generates arguments that violate the JSON schema, what should the dispatcher do?",
      options: [
        "Fail silently and stop the agent",
        "Catch the error and feed it back to the LLM to correct itself",
        "Overwrite the arguments with defaults",
        "Re-embed the query"
      ],
      correctAnswerIndex: 1,
      explanation: "Feeding the validation error back to the model allows it to correct its output structure in the next loop."
    }
  ],
  worked_examples: [
    {
      question: "What is the purpose of the python-dotenv library?",
      options: [
        "To load environment variables (like API keys) from a local .env file",
        "To compile Python scripts",
        "To fetch weather API endpoints",
        "To run local open-weights AIs"
      ],
      correctAnswerIndex: 0,
      explanation: "`python-dotenv` loads key-value configurations from `.env` to prevent hardcoding sensitive credentials in source code."
    },
    {
      question: "When calling Anthropic's Claude API, what is the role of max_tokens?",
      options: [
        "It dictates the temperature",
        "It sets the limit on generated response tokens",
        "It limits the size of the input prompt",
        "It scales the dimension of vectors"
      ],
      correctAnswerIndex: 1,
      explanation: "`max_tokens` caps the length of the model's completion to prevent runaway generation."
    },
    {
      question: "Why is Pydantic commonly used in Python LLM applications?",
      options: [
        "To perform fast matrix math",
        "To validate and parse structured model outputs",
        "To index text files",
        "To draw flowcharts"
      ],
      correctAnswerIndex: 1,
      explanation: "Pydantic enables robust data validation and type enforcement, parsing LLM JSON strings into structured Python objects."
    }
  ],
  vector_search: [
    {
      question: "What is the formula for Cosine Similarity between unit-normalized vectors?",
      options: [
        "Sum of vector values",
        "Dot product of the two vectors",
        "Euclidean distance",
        "TF-IDF ratio"
      ],
      correctAnswerIndex: 1,
      explanation: "Since unit vectors have a magnitude of 1.0, their cosine similarity equals their simple dot product."
    },
    {
      question: "How does Dense Search differ from Sparse Search (TF-IDF)?",
      options: [
        "Dense search is always faster",
        "Dense search matches semantic concepts, while sparse matches exact keywords",
        "Dense search is stored in text files",
        "Dense search does not use embeddings"
      ],
      correctAnswerIndex: 1,
      explanation: "Dense search leverages deep learning representations to capture meaning and synonyms, whereas sparse matches raw vocabulary words."
    },
    {
      question: "What indexing technique is commonly used to speed up vector database lookups?",
      options: [
        "Tiktoken BPE dictionaries",
        "HNSW (Hierarchical Navigable Small World)",
        "JSON serialization",
        "Logits temperature scaling"
      ],
      correctAnswerIndex: 1,
      explanation: "HNSW builds graphs to find approximate nearest neighbors in logarithmic time instead of scanning every vector."
    }
  ],
  evaluation: [
    {
      question: "What is a 'Gold Standard' or 'Ground Truth' dataset?",
      options: [
        "A set of ideal prompts and expected outputs used to score models",
        "A collection of API keys",
        "A high-performance GPU cluster",
        "An encryption algorithm"
      ],
      correctAnswerIndex: 0,
      explanation: "Ground truths provide a reference benchmark to measure model accuracy, precision, or safety metrics."
    },
    {
      question: "Why is LLM-as-a-Judge evaluation used?",
      options: [
        "Because human evaluation is slow and exact text matching is too rigid",
        "Because it is completely free",
        "Because LLMs make zero evaluation errors",
        "To compile Python scripts"
      ],
      correctAnswerIndex: 0,
      explanation: "LLMs can grade complex text semantics on criteria like helpfulness, matching human preferences better than simple string distance."
    },
    {
      question: "What is the danger of evaluating prompts only on a single test prompt?",
      options: [
        "It causes API rate limits",
        "It leads to overfitting prompts to one example while degrading general performance",
        "It disables self-attention",
        "It corrupts the vector search index"
      ],
      correctAnswerIndex: 1,
      explanation: "Optimizing a prompt for one specific edge case can introduce regressions across other queries; evaluations require diverse datasets."
    }
  ],
  failure_modes: [
    {
      question: "What is an LLM 'Hallucination'?",
      options: [
        "Generating grammatically incorrect sentences",
        "Generating factual falsities with high confidence",
        "Refusing to answer the user query",
        "Calling tools with wrong schema types"
      ],
      correctAnswerIndex: 1,
      explanation: "Hallucinations occur when a model predicts fluent but incorrect or non-existent claims."
    },
    {
      question: "What is the primary cause of out-of-distribution schema drift?",
      options: [
        "Deploying a new model version that structures outputs differently than expected",
        "Running out of disk space",
        "Lowering the temperature to 0",
        "Using too many vector databases"
      ],
      correctAnswerIndex: 0,
      explanation: "Updating underlying LLMs can change how they structure JSON keys or formats, causing parsing failures."
    },
    {
      question: "How does defensive engineering handle API rate limits?",
      options: [
        "By resubmitting the request infinitely",
        "Implementing exponential backoff with jitter and retries",
        "Changing the temperature",
        "Using open-weights models only"
      ],
      correctAnswerIndex: 1,
      explanation: "Backoff pauses and retries requests after increasing wait times, preventing client throttling."
    }
  ],
  security: [
    {
      question: "What is a Prompt Injection attack?",
      options: [
        "Stealing the model's weights",
        "Malicious user inputs that hijack the model's system instructions",
        "Intercepting HTTPS traffic",
        "Flooding the server with requests"
      ],
      correctAnswerIndex: 1,
      explanation: "Prompt injection tricks the model into ignoring its preconfigured constraints and obeying hostile user commands instead."
    },
    {
      question: "Why is running LLM-generated code directly on the host machine dangerous?",
      options: [
        "It makes the model slow",
        "Malicious code can access, delete, or leak private files and keys",
        "It requires too much RAM",
        "It changes the tokenizer vocabulary"
      ],
      correctAnswerIndex: 1,
      explanation: "Arbitrary generated code can execute system commands, access files, or open connections; it must be sandboxed."
    },
    {
      question: "How do XML tag delimiters help mitigate injection?",
      options: [
        "They encrypt the user inputs",
        "They clearly demarcate untrusted user inputs from system instructions",
        "They lower the temperature",
        "They increase vector dimensions"
      ],
      correctAnswerIndex: 1,
      explanation: "Demarcators help the LLM maintain the distinction between structural instructions and raw text data."
    }
  ],
  library_basics: [
    {
      question: "What does the 'os' library do in Python?",
      options: [
        "Performs vector cosine similarity calculations",
        "Provides functions to interact with the operating system (paths, files, variables)",
        "Tokenizes strings",
        "Loads transformers"
      ],
      correctAnswerIndex: 1,
      explanation: "The `os` module allows Python scripts to read environment variables, check files, and interact with the filesystem."
    },
    {
      question: "Why is the 'pathlib' module preferred over 'os.path' in modern Python?",
      options: [
        "It uses object-oriented path structures instead of raw strings",
        "It is much faster to run",
        "It encrypts file contents",
        "It automatically loads JSON datasets"
      ],
      correctAnswerIndex: 0,
      explanation: "`pathlib.Path` offers a cleaner, cross-platform, object-oriented API for path manipulations."
    },
    {
      question: "What is the purpose of Python's 'typing' module?",
      options: [
        "To speed up string parsing",
        "To enable static type checking and improve code IDE completion",
        "To execute terminal commands",
        "To structure RAG chunks"
      ],
      correctAnswerIndex: 1,
      explanation: "Type hints enable static analysis tools (like mypy) and IDEs to flag type mismatches before runtime."
    }
  ]
};
