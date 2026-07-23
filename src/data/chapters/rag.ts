import type { Topic } from '../curriculum';

export const ragTopic: Topic = {
  id: 'rag',
  title: 'Retrieval-Augmented Generation (RAG)',
  slug: 'retrieval-augmented-generation',
  summary: 'Eliminate LLM hallucinations by retrieving relevant text fragments and injecting them directly into the context window.',
  rootDiagramId: 'rag_root',
  subDiagrams: {
    rag_root: {
      id: 'rag_root',
      title: 'RAG Architecture Flow',
      nodes: [
        {
          id: 'rag_query',
          label: 'User Query',
          x: 50,
          y: 150,
          width: 140,
          height: 70,
          type: 'input',
          shortExplanation: 'The starting query from the user.',
          simpleExplanation: 'Your question, like "What is my grocery list?".',
          detailedExplanation: `### 1. Learning Objective
Understand how custom data is queried and retrieved to form an augmented prompt context.

### 2. Concept
Retrieval-Augmented Generation (RAG) is the process of retrieving documents matching a user query, injecting them as context, and prompting the LLM to write an answer grounded in that context.

### 3. Why do we need it?
LLMs are frozen in time at the end of their training. They do not know your private notes or real-time news.

### 4. Real-Life Analogy
Like an open-book exam. Instead of guessing from memory, the student (LLM) is handed a reference sheet (Retrieved Context) containing the answers.

### 5. Without It
The assistant would hallucinate factually incorrect facts or tell you it doesn\'t have access to your personal files.

### 6. Install
\`\`\`bash
pip install sentence-transformers
\`\`\`

### 7. Syntax
\`\`\`python
# Grounded Prompt construction
prompt = f"Answer using this context: {context}\\n\\nQuestion: {query}"
\`\`\`

### 8. Example
\`\`\`python
# Simple Context Injection
context = "Varuna\'s meeting is at 5 PM."
query = "When is Varuna\'s meeting?"
prompt = f"Context: {context}\\nQuestion: {query}\\nAnswer:"
# Claude returns: "Varuna\'s meeting is at 5 PM."
\`\`\``
        },
        {
          id: 'rag_retrieve',
          label: 'Semantic Retrieval',
          x: 240,
          y: 150,
          width: 150,
          height: 70,
          type: 'process',
          shortExplanation: 'Searches the database and pulls matching text chunks.',
          simpleExplanation: 'Finds paragraphs in your notes folder that have the closest meaning to your question.',
          detailedExplanation: `### 9. Example Code
\`\`\`python
# Retrieval matching logic
def retrieve(query, documents, threshold=0.5):
    # Semantic cosine match simulation
    return [doc for doc in documents if match_score(query, doc) > threshold]
\`\`\`

### 10. Behind the Scenes
The user query is vectorized, and a vector DB performs a cosine similarity lookup against stored document chunk vectors, returning the top K results.

### 11. Project Usage
Implemented in \`rag.py\` and accessed by the \`/ask\` and \`/search\` terminal commands.

### 12. Code Walkthrough
- The user query is checked against the pre-built note embedding indexes.
- If similarity is high, the matching notes are concatenated into a string block.

### 13. Visual Flow
\`\`\`
Query -> Embed Query -> Query Vector DB -> Extract Chunks -> Append to Prompt
\`\`\``
        },
        {
          id: 'rag_generate',
          label: 'Grounded Generation',
          x: 440,
          y: 150,
          width: 150,
          height: 70,
          type: 'llm',
          shortExplanation: 'The LLM processes the augmented prompt and writes a grounded answer.',
          simpleExplanation: 'The AI reads the notes you attached and answers based strictly on those facts.',
          detailedExplanation: `### 14. Common Mistakes
- Injecting too many chunks, which overflows the context window or dilutes the model\'s attention.
- Lack of metadata tracking, making it impossible to attribute sources.

### 15. Mini Exercise
Build a script that constructs a RAG prompt from a hardcoded list of text lines.

### 16. Challenge
Add a confidence threshold: if the closest retrieved document has a similarity score below 0.4, tell the user "I couldn\'t find any relevant notes to answer this question."

### 17. LLM Connection
#### Level 1: Python Basics
String concatenation to form prompts.
#### Level 2: My Project
Implementing note retrieval and injecting it into the Claude SDK payload.
#### Level 3: Production AI
Orchestrating enterprise RAG pipelines with hybrid keyword-semantic search and reranking layers.

### 18. Interview Questions
- How does RAG reduce LLM hallucinations?
- What is the difference between RAG and fine-tuning?

### 19. Summary
RAG feeds real-time database facts directly into the prompt context to keep LLM replies accurate.

### 20. What's Next
Next, we study how to wrap the LLM in an autonomous loop with short and long-term memory.`
        }
      ],
      edges: [
        { from: 'rag_query', to: 'rag_retrieve', animated: true },
        { from: 'rag_retrieve', to: 'rag_generate', animated: true }
      ]
    }
  }
};
