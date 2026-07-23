import type { Topic } from '../curriculum';

export const tokenEmbeddingsAttentionTopic: Topic = {
  id: 'tokenization_embeddings_attention',
  title: 'Tokenization, Embeddings & Attention',
  slug: 'tokenization-embeddings-attention',
  summary: 'Explore the mathematical foundations of LLMs: how text is tokenized, vectorized into embeddings, and processed via self-attention.',
  rootDiagramId: 'tea_root',
  subDiagrams: {
    tea_root: {
      id: 'tea_root',
      title: 'Text Processing Engine Flow',
      nodes: [
        {
          id: 'tea_tokenization',
          label: '1. Tokenization',
          x: 50,
          y: 150,
          width: 150,
          height: 70,
          type: 'process',
          shortExplanation: 'Chops text into tokens and maps each token to a numerical ID.',
          simpleExplanation: 'Cuts your words into tiny spelling blocks and numbers them for the computer.',
          detailedExplanation: `### 1. Learning Objective
Understand how raw string characters are transformed into discrete subword integer tokens using Byte-Pair Encoding.

### 2. Concept (What is it?)
Tokenization is the process of chopping text into small chunks — called **tokens** — and mapping each chunk to a number (an ID).

### 3. Why do we need it?
A model cannot execute mathematical matrices directly on letters or words. Text must be represented as a sequence of integer IDs.

### 4. Real-Life Analogy
Like a translator at the United Nations breaking down speech into syllable-sized concept units that can be cross-referenced immediately.

### 5. Without It
If you feed raw words, the model would need an infinite vocabulary and would treat "unbelievable" and "believe" as completely unrelated.

### 6. Install
\`\`\`bash
pip install tiktoken
\`\`\`

### 7. Syntax
\`\`\`python
import tiktoken
enc = tiktoken.get_encoding("cl100k_base")
tokens = enc.encode("hello world")
\`\`\`

### 8. Example
\`\`\`python
import tiktoken
enc = tiktoken.get_encoding("cl100k_base")
text = "Varuna builds AI"
tokens = enc.encode(text)
print("IDs:", tokens) # e.g. [11803, 6810, 4857, 15592]
\`\`\`

### 9. Behind the Scenes
Byte-Pair Encoding (BPE) merges the most frequent character pairs iteratively to build a fixed vocabulary of subword tokens.

### 10. Project Usage
The Anthropic API counts and bills based on the tokens of the sent prompt and generated reply.

### 11. Code Walkthrough
- \`enc.encode(text)\` converts text into a list of integers.
- \`enc.decode(ids)\` reverses the mapping back to text.

### 12. Visual Diagram
\`\`\`
"unbelievable" ↓ BPE Merge ↓ ["un", "believ", "able"] ↓ Map IDs ↓ [359, 12839, 481]
\`\`\`

### 13. Common Mistakes
- Assuming 1 token = 1 word. It is actually **1 token ≈ 0.75 words**.
- Forgetting that spaces and punctuation consume tokens.

### 14. Mini Exercise
Tokenize your project name and print the token IDs and lengths.

### 15. Challenge
Write a cost calculator that computes the cost of a chat prompt given standard API rates ($3 per million tokens).

### 16. LLM Connection
- **Python Basics**: Counting tokens locally.
- **My Project**: Monitoring memory size to stay within context budgets.
- **Production AI**: Managing context windows to prevent token truncation in long chats.

### 17. Interview Qs
- Why are subword tokenizers preferred over character-level tokenizers?
- How does tokenization affect non-English languages?

### 18. Summary
Tokenization maps characters into numerical IDs using fixed-vocabulary subword tables.

### 19. What's Next
Next, we translate these flat token integers into rich concept vectors called embeddings.`,
          childDiagramId: 'sub_tea_tokenization'
        },
        {
          id: 'tea_embeddings',
          label: '2. Embeddings',
          x: 250,
          y: 150,
          width: 150,
          height: 70,
          type: 'process',
          shortExplanation: 'Converts token IDs into dense vector representations of semantic meaning.',
          simpleExplanation: 'Maps words onto a massive meaning map, placing similar concepts close together.',
          detailedExplanation: `### 1. Learning Objective
Understand how words and sentences are represented as points in high-dimensional vector space.

### 2. Concept
An embedding is a list of floating-point numbers (a vector) representing the semantic meaning of a segment of text.

### 3. Why do we need it?
Token IDs are arbitrary. We need a representation where "cappuccino" and "latte" are mathematically close, but "cappuccino" and "airplane" are far apart.

### 4. Real-Life Analogy
Imagine a massive library where books about coffee are grouped on one shelf and books about flight on another. The distance between shelves is like distance in vector space.

### 5. Without It
Keyword search fails on synonyms. Searching "beverage" would fail to find "cappuccino" because the spelling is different.

### 6. Install
\`\`\`bash
pip install sentence-transformers
\`\`\`

### 7. Syntax
\`\`\`python
from sentence_transformers import SentenceTransformer
model = SentenceTransformer("all-MiniLM-L6-v2")
vector = model.encode("latte")
\`\`\`

### 8. Example
\`\`\`python
from sentence_transformers import SentenceTransformer
from sentence_transformers.util import cos_sim
model = SentenceTransformer("all-MiniLM-L6-v2")
v1 = model.encode("I love cappuccinos")
v2 = model.encode("What's my favorite drink?")
print(cos_sim(v1, v2)) # High score (~0.7)
\`\`\`

### 9. Behind the Scenes
Embedding models project text into 384 or 1536 dimensions. Cosine similarity calculates the cosine of the angle between two vectors to determine semantic overlap.

### 10. Project Usage
Powers the semantic search routing in our assistant's notes database.

### 11. Code Walkthrough
- \`model.encode(text)\` processes text and returns a list of floats.
- \`cos_sim(v1, v2)\` measures alignment.

### 12. Visual Diagram
\`\`\`
"cappuccino" ↓ Model ↓ Vector: [0.12, -0.84, ...] ↓ Space Coordinate
\`\`\`

### 13. Common Mistakes
- Thinking embeddings are tokens.
- Comparing vectors from different embedding models.

### 14. Mini Exercise
Embed three statements and find the similarity between them.

### 15. Challenge
Build a small local semantic lookup script comparing a user query against a list of facts.

### 16. LLM Connection
- **Python Basics**: Generating vector arrays.
- **My Project**: Implementing semantic notes query.
- **Production AI**: Storing millions of documents in vector databases (e.g. Pinecone) for retrieval.

### 17. Interview Qs
- How does cosine similarity differ from Euclidean distance?
- What are the dimensions of standard text embeddings?

### 18. Summary
Embeddings translate spelling into semantic coordinate space vectors.

### 19. What's Next
Next, we explore how attention lets these vectors communicate and resolve context inside a sentence.`,
          childDiagramId: 'sub_tea_embeddings'
        },
        {
          id: 'tea_attention',
          label: '3. Attention',
          x: 450,
          y: 150,
          width: 150,
          height: 70,
          type: 'process',
          shortExplanation: 'Calculates the relative relevance of all tokens in a sentence to one another.',
          simpleExplanation: 'Calculates which words in a sentence relate to each other, like connecting "it" to "cappuccino".',
          detailedExplanation: `### 1. Learning Objective
Calculate self-attention weights manually using Query, Key, and Value matrices.

### 2. Concept
Self-Attention allows tokens in a sequence to update their semantic values by attending to other context tokens.

### 3. Why do we need it?
In "The bank of the river" vs. "The money in the bank", the word "bank" needs context weights to resolve its meaning.

### 4. Real-Life Analogy
A meeting where you pay varying levels of attention to different speakers based on the topic.

### 5. Without It
Older models (RNNs) forgot early words in long sentences because they processed sequentially.

### 6. Install
\`\`\`bash
pip install numpy
\`\`\`

### 7. Syntax
\`\`\`python
import numpy as np
scores = Q @ K.T
weights = softmax(scores)
output = weights @ V
\`\`\`

### 8. Example
\`\`\`python
import numpy as np
Q = np.array([[1, 0], [0, 1], [1, 1]]) # 3 words
K = np.array([[1, 0], [0, 1], [1, 1]])
V = np.array([[1, 2], [3, 1], [2, 2]])
scores = Q @ K.T
weights = np.exp(scores) / np.sum(np.exp(scores), axis=-1, keepdims=True)
output = weights @ V
print("Output:", output)
\`\`\`

### 9. Behind the Scenes
Tokens generate Query (Q), Key (K), and Value (V) projections. Dot products of Q and K are scaled, run through Softmax, and multiplied by V to blend vectors contextually.

### 10. Project Usage
Allows Claude to remember and resolve references across the long chat log history.

### 11. Code Walkthrough
- \`Q @ K.T\` measures Q-K similarity.
- \`softmax\` normalizes scores into weights.
- \`weights @ V\` blends values.

### 12. Visual Diagram
\`\`\`
Query("it") @ Key("cappuccino") → High Score → Softmax → Blend Value
\`\`\`

### 13. Common Mistakes
- Thinking attention is a dictionary database lookup.
- Underestimating stacked attention layers.

### 14. Mini Exercise
Modify the toy matrices so word 3 attends only to word 1.

### 15. Challenge
Extend the numpy calculation to support multi-head self-attention logic.

### 16. LLM Connection
- **Python Basics**: Vector dot products.
- **My Project**: Claude API handles attention; you manage the history length.
- **Production AI**: Stacking hundreds of attention heads across 96 layers in frontier models.

### 17. Interview Qs
- What are Query, Key, and Value vectors?
- Explain the role of Softmax in attention.

### 18. Summary
Attention blends token vectors dynamically using QKV dot-product probabilities.

### 19. What's Next
Next, we study how the model actually selects and generates the next token (Inference & Sampling).`,
          childDiagramId: 'sub_tea_attention'
        }
      ],
      edges: [
        { from: 'tea_tokenization', to: 'tea_embeddings', animated: true },
        { from: 'tea_embeddings', to: 'tea_attention', animated: true }
      ]
    },
    sub_tea_tokenization: {
      id: 'sub_tea_tokenization',
      title: 'Detail: Tokenization Mechanics',
      nodes: [
        {
          id: 'tok_bpe',
          label: 'Byte-Pair Encoding',
          x: 100,
          y: 100,
          width: 140,
          height: 60,
          type: 'process',
          shortExplanation: 'Merges frequent byte-pairs to build subwords.',
          simpleExplanation: 'Glues common letter groups together so the vocabulary stays small but smart.',
          detailedExplanation: 'BPE starts with characters and iteratively merges the most frequent pairs (e.g. "t"+"h" -> "th"). This allows splitting rare words while keeping common words intact.'
        },
        {
          id: 'tok_tiktoken',
          label: 'tiktoken Library',
          x: 280,
          y: 100,
          width: 140,
          height: 60,
          type: 'tool',
          shortExplanation: 'OpenAI\'s high-speed tokenizer library.',
          simpleExplanation: 'A super fast python tool to count and convert text to token numbers.',
          detailedExplanation: 'Tiktoken implements BPE in Rust for extremely fast performance. It supports cl100k_base (used by GPT-4 and Claude).'
        }
      ],
      edges: [
        { from: 'tok_bpe', to: 'tok_tiktoken', animated: true }
      ]
    },
    sub_tea_embeddings: {
      id: 'sub_tea_embeddings',
      title: 'Detail: Embedding Vector Space',
      nodes: [
        {
          id: 'emb_transformers',
          label: 'Sentence Transformers',
          x: 100,
          y: 100,
          width: 160,
          height: 60,
          type: 'tool',
          shortExplanation: 'Hugging Face framework for sentence embeddings.',
          simpleExplanation: 'Python tools that convert entire sentences into meaningful coordinate lists.',
          detailedExplanation: 'SentenceTransformers provides pre-trained models like all-MiniLM-L6-v2 which maps sentences to a dense 384-dimensional space.'
        },
        {
          id: 'emb_cosine',
          label: 'Cosine Similarity',
          x: 300,
          y: 100,
          width: 140,
          height: 60,
          type: 'concept',
          shortExplanation: 'Measures alignment of meaning vectors.',
          simpleExplanation: 'Calculates the angle between two meaning vectors to see how close their concepts are.',
          detailedExplanation: 'Cosine similarity computes (A·B)/(||A||*||B||). Values range from -1 to 1, where 1 means identical semantic directions.'
        }
      ],
      edges: [
        { from: 'emb_transformers', to: 'emb_cosine', animated: true }
      ]
    },
    sub_tea_attention: {
      id: 'sub_tea_attention',
      title: 'Detail: QKV Attention Math',
      nodes: [
        {
          id: 'att_dot_prod',
          label: 'Q @ K.T Dot Product',
          x: 100,
          y: 100,
          width: 150,
          height: 60,
          type: 'process',
          shortExplanation: 'Compares Query and Key matrices.',
          simpleExplanation: 'Multiplies matching matrices to score relationships between every word pair.',
          detailedExplanation: 'Computes matrix multiplication of Q and the transpose of K, calculating raw relationship scores before normalizing.'
        },
        {
          id: 'att_softmax_op',
          label: 'Softmax Activation',
          x: 280,
          y: 100,
          width: 150,
          height: 60,
          type: 'process',
          shortExplanation: 'Normalizes scores into weights.',
          simpleExplanation: 'Turns connection scores into clear percentages summing to 100%.',
          detailedExplanation: 'Applies exponentiation and scaling to ensure scores are transformed into a probability distribution representing relative attention weights.'
        }
      ],
      edges: [
        { from: 'att_dot_prod', to: 'att_softmax_op', animated: true }
      ]
    }
  }
};
