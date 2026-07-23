import type { Topic } from '../curriculum';

export const vectorSearchTopic: Topic = {
  id: 'vector_search_practice',
  title: 'Vector Search in Practice',
  slug: 'vector-search-practice',
  summary: 'Compare TF-IDF keyword overlap with sentence-transformers search, then scale up to enterprise vector databases.',
  rootDiagramId: 'vector_search_root',
  subDiagrams: {
    vector_search_root: {
      id: 'vector_search_root',
      title: 'Vector Search Pipeline',
      nodes: [
        {
          id: 'v_search_tfidf',
          label: '1. TF-IDF Keyword Match',
          x: 50,
          y: 150,
          width: 160,
          height: 70,
          type: 'process',
          shortExplanation: 'Calculates term frequencies to score keyword overlap.',
          simpleExplanation: 'Finds matching words to search notes, without understanding the meaning.',
          detailedExplanation: `### 1. Learning Objective
Compare Term Frequency-Inverse Document Frequency (TF-IDF) with dense semantic embeddings.

### 2. Concept (What is it?)
TF-IDF is a statistical sparse-vector search technique that scores how important a word is to a document in a collection.

### 3. Why do we need it?
Without it, you have no local fallback if the user\'s machine cannot load deep sentence-transformer models.

### 4. Real-Life Analogy
Like using an index at the back of a textbook. You look up the exact word "cappuccino" and find page numbers. If the book says "coffee" instead, you will miss it because the exact spelling doesn\'t match.

### 5. Without It
If embedding servers are offline, local semantic searches will crash.

### 6. Install
\`\`\`bash
pip install scikit-learn
\`\`\`

### 7. Syntax
\`\`\`python
from sklearn.feature_extraction.text import TfidfVectorizer
vec = TfidfVectorizer()
sparse_matrix = vec.fit_transform(documents)
\`\`\`

### 8. Example
\`\`\`python
# Simple TF-IDF comparison
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

docs = ["I love warm coffee", "The stock market is down"]
vectorizer = TfidfVectorizer()
tfidf = vectorizer.fit_transform(docs)
query = vectorizer.transform(["I need coffee"])
print(cosine_similarity(query, tfidf)) # Match score
\`\`\``
        },
        {
          id: 'v_search_dense',
          label: '2. Dense Semantic Search',
          x: 250,
          y: 150,
          width: 160,
          height: 70,
          type: 'process',
          shortExplanation: 'Encodes entire sentence meanings using dense vectors.',
          simpleExplanation: 'Uses coordinate vectors to find notes matching the meaning of your question.',
          detailedExplanation: `### 9. Example Code (Dense vs Sparse)
\`\`\`python
# Hybrid Search Logic
def search(query, docs):
    try:
        # Try dense sentence-transformers
        return dense_search(query, docs)
    except ImportError:
        # Fallback to TF-IDF
        return tfidf_search(query, docs)
\`\`\`

### 10. Behind the Scenes
- **Sparse vectors** (TF-IDF) contain thousands of dimensions but mostly zeros, encoding only keyword frequencies.
- **Dense vectors** (sentence-transformers) represent compressed semantic concepts in 384 dimensions filled with non-zero decimals.

### 11. Project Usage
Implemented in \`rag.py\` as the dynamic search pipeline of the personal AI assistant.

### 12. Code Walkthrough
- \`rag.py\` builds a note search index on startup.
- If sentence-transformers loads, it calculates cosine similarity between the query vector and note vectors.
- If it fails, it runs the TF-IDF matching engine as a fallback.

### 13. Visual Flow
\`\`\`
Query -> Check imports -> [Transformer EMB] or [TF-IDF fallback] -> Compute Similarity -> Return results
\`\`\``
        },
        {
          id: 'v_search_prod',
          label: '3. Production Scales',
          x: 450,
          y: 150,
          width: 150,
          height: 70,
          type: 'database',
          shortExplanation: 'Scales database up to Pinecone, pgvector, or Weaviate.',
          simpleExplanation: 'Moving from local files to professional databases designed for millions of items.',
          detailedExplanation: `### 14. Common Mistakes
- Relying exclusively on TF-IDF when synonym matches are critical.
- Keeping indexes in memory instead of saving them, causing recalculation delays on every script run.

### 15. Mini Exercise
Build a script that calculates TF-IDF scores for 3 sentences.

### 16. Challenge
Write a hybrid search function that calculates both TF-IDF and dense similarity, normalizing and adding the scores together.

### 17. LLM Connection
#### Level 1: Python Basics
Basic array lists.
#### Level 2: My Project
Creating the local fallback logic in \`rag.py\`.
#### Level 3: Production AI
Setting up cloud-hosted Pinecone vector databases or pgvector extensions in PostgreSQL.

### 18. Interview Questions
- Contrast sparse vectors with dense vectors.
- When is a hybrid keyword-semantic search preferred in production?

### 19. Summary
Local searches use TF-IDF or dense sentence-transformers, scaling to cloud vector DBs for enterprise apps.

### 20. What's Next
Next, we examine the Evaluation chapter to measure RAG retrieval performance.`
        }
      ],
      edges: [
        { from: 'v_search_tfidf', to: 'v_search_dense', animated: true },
        { from: 'v_search_dense', to: 'v_search_prod', animated: true }
      ]
    }
  }
};
