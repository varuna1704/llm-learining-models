# Chapter: How an LLM Actually "Reads" Text
### Tokenization → Embeddings → Attention

> This is the chapter most tutorials skip. Everything else in your course (JSON memory, Tool Registry, Brain/Agent loop) is *around* the model. This chapter is *inside* it.

---

## PART 1 — TOKENIZATION

### 1. Learning Objective
Understand why a model can't read words, what a token actually is, and how text becomes numbers before anything "AI" happens.

### 2. Concept (What is it?)
Tokenization is the process of chopping text into small chunks — called **tokens** — and mapping each chunk to a number (an ID), because a neural network only understands numbers, never text.

### 3. Why do we need it?
A model can't do math on the letter "c" or the word "cat." Everything inside a neural network is matrix multiplication. Before any of that can happen, "Varuna is building an AI assistant" has to become something like `[3103, 374, 4857, 400, 15592, 18328]`.

### 4. Real-Life Analogy
Think of a translator at the United Nations. A diplomat doesn't speak in raw sound waves — the translator breaks their speech into recognizable words and hands the *meaning-carrying units* to the audience. Tokenization is that translator, standing between raw text and the model.

### 5. Without This Step
If you tried to feed raw characters into a model, "unbelievable" and "un" + "believable" would look totally unrelated to it — the model would need to relearn spelling from scratch for every single word combination in existence. Impossibly wasteful.

### 6. How Tokenization Solves It
Instead of whole words, most modern tokenizers use **subword tokenization** (Byte-Pair Encoding / BPE). Common words stay whole ("the", "is"). Rare or long words get split into meaningful pieces:

```
unbelievable  →  ["un", "believ", "able"]
```

This means the model already understands "un-" as a negation prefix and "-able" as a capability suffix, even for words it's never seen before.

### 7. Installation
```bash
pip install tiktoken
```

### 8. Basic Syntax
```python
import tiktoken

encoding = tiktoken.get_encoding("cl100k_base")
tokens = encoding.encode("your text here")
text_back = encoding.decode(tokens)
```

### 9. Simple Python Example
```python
import tiktoken

encoding = tiktoken.get_encoding("cl100k_base")

text = "Varuna is building an AI assistant"
tokens = encoding.encode(text)

print("Text:", text)
print("Token IDs:", tokens)
print("Token count:", len(tokens))

for t in tokens:
    print(t, "->", repr(encoding.decode([t])))
```

Output (approximate — exact IDs depend on the tokenizer version):
```
Text: Varuna is building an AI assistant
Token IDs: [11803, 6810, 374, 4857, 459, 15592, 18328]
Token count: 7

11803 -> 'Var'
6810  -> 'una'
374   -> ' is'
4857  -> ' building'
459   -> ' an'
15592 -> ' AI'
18328 -> ' assistant'
```

Notice: "Varuna" — a name the model has never specifically memorized — got split into "Var" + "una". Common words like " is" and " an" stayed whole, including the leading space (spaces are usually *part* of the token, not separate).

### 10. Behind the Scenes
```
Raw text
   ↓
Byte-Pair Encoding (merge frequent character pairs)
   ↓
Token list (subwords)
   ↓
Token IDs (integers, looked up in a fixed vocabulary)
   ↓
Ready for the model
```

### 11. How This Project Uses It
Every time your assistant sends a message to the Anthropic API, the SDK tokenizes your prompt *before* it ever reaches the model. This is also why your `memory.json` file size matters — more stored facts = more tokens = more cost and a longer prompt every single call.

### 12. Code Walkthrough
- `tiktoken.get_encoding(...)` loads a fixed vocabulary (a lookup table baked in at training time — you can't invent new tokens on the fly).
- `.encode()` runs the BPE merge algorithm and returns a list of integers.
- `.decode()` reverses it — but only losslessly for the *exact* tokens; you can't decode a random integer you made up.

### 13. Visual Flow Diagram
```
"unbelievable"
      ↓
 ["un","believ","able"]
      ↓
 [359, 12839, 481]
      ↓
   [Model Input]
```

### 14. Common Mistakes
- Assuming "1 token = 1 word" — it's closer to **1 token ≈ ¾ of an English word**, but varies a lot by language.
- Forgetting that whitespace and punctuation consume tokens too.
- Not realizing your context window is a token budget, not a character budget — a 200K "context window" is 200K tokens, not 200K letters.

### 15. Mini Exercise
Tokenize your own name, your project name, and a sentence about your assistant. Compare token counts. Which word split the most?

### 16. Challenge Exercise
Write a function `estimate_cost(text, price_per_1k_tokens)` that tokenizes text and returns the estimated API cost. Test it against your longest `memory.json` fact.

### 17. AI/LLM Connection
```
Python Basics
   ↓
tiktoken in a script
   ↓
Your Assistant's memory.json → tokens sent to Anthropic API
   ↓
Production: same BPE idea inside every frontier LLM (GPT, Claude, Gemini, Llama)
```

### 18. Interview Questions
- What's the difference between a token and a word?
- Why do models have a fixed vocabulary size instead of infinite tokens?
- Why does a longer conversation history cost more, even with the same "topic"?

### 19. Summary
- Models only understand numbers, not text.
- Tokenization breaks text into subwords and maps them to IDs.
- Context windows and API cost are measured in tokens, not characters.
- Rare words get split; common words stay whole.

### 20. What's Next
Now that text is a list of numbers, we need those numbers to actually *mean* something — that's embeddings.

---

## PART 2 — EMBEDDINGS

### 1. Learning Objective
Understand how a token ID (just an arbitrary integer) becomes a vector that captures *meaning*, and why that's the foundation of both LLMs and your RAG search.

### 2. Concept (What is it?)
An embedding is a list of numbers (a vector) that represents the *meaning* of a word or sentence, positioned in space such that similar meanings end up close together.

### 3. Why do we need it?
Token ID 6810 ("una") tells the model nothing about meaning — it's just a lookup index. Two token IDs that are numerically close (6810 vs 6811) are **not** semantically related. We need a representation where "king" and "queen" are mathematically close, and "king" and "banana" are mathematically far.

### 4. Real-Life Analogy
Imagine a map of a city where instead of streets, the *distance* between two locations represents how similar they are in meaning. "Coffee shop" and "café" would be right next to each other. "Coffee shop" and "airport" would be miles apart. Embeddings build exactly this kind of map, just in hundreds of invisible dimensions instead of two.

### 5. Without Embeddings
Your RAG search in the Personal AI Assistant would be reduced to exact keyword matching (which is exactly what TF-IDF does, and why you're also using sentence-transformers). Ask "What's my favorite drink?" and it would completely miss a stored fact that says "I love cappuccinos" — no shared keywords, zero match.

### 6. How Embeddings Solve It
A sentence-transformer model converts a whole sentence into a single vector (e.g., 384 numbers). "What's my favorite drink?" and "I love cappuccinos" produce vectors that are *close together* in that space, even though they don't share a single word — because the model learned meaning, not spelling.

### 7. Installation
```bash
pip install sentence-transformers
```

### 8. Basic Syntax
```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
vector = model.encode("some text")
```

### 9. Simple Python Example
```python
from sentence_transformers import SentenceTransformer
from sentence_transformers.util import cos_sim

model = SentenceTransformer("all-MiniLM-L6-v2")

sentence_a = "What's my favorite drink?"
sentence_b = "I love cappuccinos"
sentence_c = "The stock market closed lower today"

vec_a = model.encode(sentence_a)
vec_b = model.encode(sentence_b)
vec_c = model.encode(sentence_c)

print("Vector length:", len(vec_a))          # e.g. 384 numbers
print("A vs B similarity:", cos_sim(vec_a, vec_b).item())   # high, ~0.6-0.8
print("A vs C similarity:", cos_sim(vec_a, vec_c).item())   # low, ~0.0-0.2
```

Even though sentence A and B share zero words, cosine similarity shows them as close in meaning — while C (an unrelated topic) sits far away.

### 10. Behind the Scenes
```
"I love cappuccinos"
        ↓
Sentence-Transformer model
        ↓
[0.021, -0.184, 0.093, ... ] (384 numbers)
        ↓
Stored as a point in 384-dimensional space
        ↓
Compared to other points using cosine similarity
```

### 11. How This Project Uses It
This is exactly what powers the RAG half of your Personal AI Assistant. Every stored memory fact gets embedded once. When you ask a question, your question also gets embedded, and the assistant returns whichever stored facts have the *closest* vectors — not the ones with matching keywords.

### 12. Code Walkthrough
- `SentenceTransformer("all-MiniLM-L6-v2")` loads a small pretrained model — it already learned "meaning space" from millions of sentence pairs before you ever touched it.
- `.encode()` runs the sentence through that model and returns the final vector.
- `cos_sim()` measures the angle between two vectors — 1.0 means identical direction (same meaning), 0 means unrelated, -1 means opposite.

### 13. Visual Flow Diagram
```
Question: "what's my favorite drink?"
                ↓
          embedding vector
                ↓
   compare (cosine similarity) against
                ↓
  every fact vector in memory.json
                ↓
        return closest match
                ↓
        "I love cappuccinos"
```

### 14. Common Mistakes
- Confusing embeddings with tokens — tokens are per-word integers; embeddings are dense vectors that capture meaning (often one vector per *sentence* or *chunk*, not per token, when doing search).
- Assuming bigger vectors are always better — 384 dimensions is often plenty for a personal assistant; production search engines sometimes use 1000+.
- Forgetting to re-embed after editing stored facts — a stale vector points to meaning that no longer matches the text.

### 15. Mini Exercise
Embed three of your own memory facts and one unrelated sentence. Print the cosine similarity of each fact against a made-up question. Which one wins?

### 16. Challenge Exercise
Build a tiny `find_closest_fact(question, facts: list[str])` function that embeds all facts once, embeds the question, and returns the fact with the highest cosine similarity — this is a miniature vector database.

### 17. AI/LLM Connection
```
Python Basics
   ↓
sentence-transformers script
   ↓
Your Assistant: TF-IDF + sentence-transformer search
   ↓
Production: Pinecone / Weaviate / pgvector storing millions of embeddings for enterprise RAG
```

### 18. Interview Questions
- What's the difference between a token embedding and a sentence embedding?
- Why does cosine similarity work better than raw distance for comparing meaning?
- Why would you re-embed your data if you changed embedding models?

### 19. Summary
- Embeddings turn text into vectors that capture meaning, not spelling.
- Similar meanings land close together in vector space.
- This is the engine behind semantic search and RAG — including your own assistant.
- Cosine similarity is the standard way to measure "how close" two embeddings are.

### 20. What's Next
Embeddings give the model meaning for *individual* pieces of text. But a sentence's meaning also depends on *which words relate to which other words*. That's what attention solves.

---

## PART 3 — ATTENTION (and the Transformer, briefly)

### 1. Learning Objective
Understand, with an actual worked numeric example, how a model decides which words in a sentence matter most to each other — the core mechanism inside every modern LLM.

### 2. Concept (What is it?)
Attention is a mechanism that lets every token look at every other token in the input and decide, mathematically, how much to "pay attention" to each one when building its own updated meaning.

### 3. Why do we need it?
Consider: **"The trophy didn't fit in the suitcase because it was too big."** What does "it" refer to — the trophy or the suitcase? Humans resolve this instantly from context. A model needs a mechanism that lets the word "it" look back across the sentence and weigh "trophy" much more heavily than "suitcase." That mechanism is attention.

### 4. Real-Life Analogy
Picture a group project meeting. When you're forming your opinion on a decision, you don't weigh everyone's comment equally — you pay very close attention to the person who scoped the requirements, some attention to the person who tested it, and almost none to the person checking their phone. Attention is the model automatically learning *whose input matters most* for each word.

### 5. Without Attention
Older models (RNNs) processed text one word at a time in strict order and tried to compress the *entire* sentence's meaning into a single fixed memory as they went — by the time they reached word 30, information from word 2 was often lost. Long-range relationships like "it" → "trophy" fell apart in long sentences.

### 6. How Attention Solves It
Every token generates three vectors: a **Query** ("what am I looking for?"), a **Key** ("what do I contain?"), and a **Value** ("what information do I actually offer?"). Every token's Query is compared against every other token's Key to produce a weight — then those weights are used to blend all the Values together. Crucially, this happens for *all* tokens *simultaneously*, not one at a time — which is also why transformers are fast to train on GPUs.

### 7. Installation
```bash
pip install numpy
```
(No special library needed — we'll compute one attention step by hand to see exactly what happens.)

### 8. Basic Syntax
```
score = Query · Key         (dot product)
weight = softmax(score)     (turn scores into probabilities that sum to 1)
output = weight · Value      (weighted blend of all Values)
```

### 9. Simple Python Example
A tiny, from-scratch attention calculation over 3 toy words:

```python
import numpy as np

def softmax(x):
    e = np.exp(x - np.max(x))
    return e / e.sum()

# Pretend these are learned vectors for 3 tokens: "The", "cat", "sat"
# (In a real model these come from the embedding + training, not hand-typed)
Q = np.array([[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]])   # Query vectors
K = np.array([[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]])   # Key vectors
V = np.array([[1.0, 2.0], [3.0, 1.0], [2.0, 2.0]])   # Value vectors

for i, word in enumerate(["The", "cat", "sat"]):
    scores = Q[i] @ K.T                # how much word i relates to every word
    weights = softmax(scores)          # normalize into attention weights
    output = weights @ V               # blend the Values by those weights

    print(f"\nToken: '{word}'")
    print("Attention weights ->", np.round(weights, 2))
    print("Updated representation ->", np.round(output, 2))
```

Output (approximate):
```
Token: 'The'
Attention weights -> [0.42 0.16 0.42]
Updated representation -> [1.58 1.79]

Token: 'cat'
Attention weights -> [0.16 0.42 0.42]
Updated representation -> [2.11 1.68]

Token: 'sat'
Attention weights -> [0.24 0.24 0.52]
Updated representation -> [2.04 1.76]
```

Notice each token ends up with a *different* blend of the other tokens' Values, based on how related their Query/Key vectors were. That's the entire trick — repeated across many layers, with many of these "heads" running in parallel (multi-head attention), on real, trained vectors instead of the toy numbers above.

### 10. Behind the Scenes
```
Token embeddings
      ↓
Each token → Query, Key, Value vectors (via learned weight matrices)
      ↓
Query · Key (every pair)  →  raw scores
      ↓
softmax  →  attention weights (sum to 1)
      ↓
weights · Value  →  new, context-aware representation per token
      ↓
Repeat across many stacked layers (this stack = the Transformer)
```

### 11. How This Project Uses It
You never implement attention yourself — the Anthropic API handles it entirely inside the model. But it's *why* Claude can correctly answer a question that references something you said several messages ago in the same conversation: attention lets later tokens look back across the whole context window, not just the last few words.

### 12. Code Walkthrough
- `Q @ K.T` computes a similarity score between every pair of tokens in one matrix multiplication — this is why GPUs (built for matrix math) accelerate transformers so well.
- `softmax` turns raw scores into a clean probability distribution, so the weights are comparable and sum to 1.
- `weights @ V` is the actual "attention" step: a weighted average, not a hard pick — a token can partially attend to many others at once.

### 13. Visual Flow Diagram
```
"it" (in "...suitcase because it was too big")
        ↓
   Query("it")
        ↓
compares against Key("trophy"), Key("suitcase"), Key("big")...
        ↓
  high weight → "trophy"   (learned from training data patterns)
  low weight  → "suitcase"
        ↓
"it" representation gets pulled toward "trophy"'s meaning
```

### 14. Common Mistakes
- Thinking attention "looks up facts" — it's a *weighted blend* of context, not a database lookup.
- Assuming one attention pass is enough — real models stack dozens of layers, each refining the representation further.
- Forgetting that "multi-head" attention means several of these Query/Key/Value computations run in parallel per layer, each potentially learning a different kind of relationship (grammar, reference, topic).

### 15. Mini Exercise
Change the toy Q, K, V matrices above so that "sat" attends almost entirely to "cat" (weight close to 1.0) and barely to the others. What does that tell you about how the weights control meaning?

### 16. Challenge Exercise
Extend the toy example to 5 words and print a full 5×5 attention weight grid (a simple attention "heatmap" as raw numbers) — this is literally what visualization tools like BertViz render as colored squares.

### 17. AI/LLM Connection
```
Python Basics (numpy dot products)
        ↓
Toy attention on 3 words
        ↓
Your Assistant: relies on Claude's internal attention to track conversation context
        ↓
Production: stacked multi-head attention across 50-100+ layers = GPT / Claude / Gemini / Llama
```

### 18. Interview Questions
- What are Query, Key, and Value, and what role does each play?
- Why is attention computed for all tokens at once instead of sequentially like an RNN?
- What does "multi-head" attention add that single-head attention doesn't?
- Why does softmax matter in the attention formula?

### 19. Summary
- Attention lets every token weigh every other token's relevance to it.
- Query/Key/Value + softmax is the entire mechanical core.
- This replaced sequential (RNN-style) processing and enabled both long-range context and fast, parallel training.
- Stacking many attention layers is literally what a Transformer *is*.

### 20. What's Next
With tokenization, embeddings, and attention in place, you now have the actual "engine" underneath every model you'll use — GPT, Claude, Gemini, Llama, Qwen, DeepSeek. The next chapter can move to **how the model decides what token to generate next** (inference, sampling, temperature) — the step that turns this internal machinery into the actual reply you see on screen.
