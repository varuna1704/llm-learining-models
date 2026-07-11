# AI/LLM Visual Learning App — Project Plan

## 1. One-line vision
A visual-first, click-to-explore learning platform where anyone can go from "what is an LLM" to "how does a real AI agent work" — through diagrams, flowcharts, and an in-app AI tutor that answers questions using only the app's own curated knowledge base, kept fresh with daily updates on new/popular AI models.

## 2. The problem
- Blog posts and docs on LLMs/RAG/agents are text-heavy and assume prior knowledge.
- YouTube explainers are shallow or scattered across 50 different channels.
- Nothing lets a beginner **click into a diagram** ("what does this box do?") and drill down progressively.
- No single place tracks "what are the popular models right now and why they matter" in an always-updated way.

## 3. Who it's for
- **Absolute beginners** — non-technical people curious about AI ("just like me," as you said).
- **Students/junior devs** — want structured, visual fundamentals before jumping into code.
- **Builders** — people about to build their first AI agent/RAG app and want a mental model first.

## 4. Core pillars
1. **Visual-first learning** — every topic starts as a diagram/flowchart, not a wall of text. Click a node → it expands into an explanation, then optionally deeper text/code.
2. **Structured curriculum** — topics organized as a tree: LLM Basics → Transformers → Prompting → RAG → AI Agents → Multi-agent systems → Fine-tuning → Evaluation → Tools/Frameworks (LangChain, LlamaIndex, OpenAI SDK, etc.)
3. **Interactive "how it works" simulators** — e.g., click an AI Agent diagram: click "LLM" node → shows what the LLM's role is in that agent; click "Memory" → explains memory; click "Tool Use" → explains function calling. Same pattern for RAG (Embed → Vector DB → Retrieve → Augment → Generate).
4. **In-app AI Chat Tutor** — a chatbot restricted to answering from the app's own content (so answers stay consistent with what's taught, not generic internet answers).
5. **Live Model Library** — auto-updated database of AI models (OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek, Qwen, open-source Hugging Face releases, etc.) with a "why it matters" summary for each, refreshed daily.
6. **Cross-platform** — Web app (PWA, works on laptop) + Mobile app (same content, touch-first diagram interactions).

## 5. Suggested product name direction (just ideas, not decided)
- **LearnLLM** / **AgentLens** / **ModelMap** / **PromptSchool** / **NeuroPath** / **AI Atlas**

## 6. Phased roadmap

### Phase 0 — MVP (learning-only, no accounts needed)
- 4–5 core topics fully built out with diagrams: What is an LLM, How Transformers work, What is RAG, What is an AI Agent, Prompting basics.
- Static model library (manually curated, ~30 models) — daily-update pipeline not live yet, just a "last updated" date.
- Chat tutor answering from that curriculum content only.
- Web app only (mobile-responsive, not a native app yet).

### Phase 1 — V1
- Full topic tree (15–25 topics) including fine-tuning, evaluation, agent frameworks, multi-agent orchestration, tool use/function calling, embeddings/vector DBs.
- Daily automated model-tracking pipeline goes live.
- Native mobile app (or PWA install-to-home-screen if budget-constrained).
- Progress tracking (what you've learned), bookmarks, search.

### Phase 2 — V2 (decide direction later, as you said)
- User accounts, quizzes/certificates, community contributions to diagrams, personalized learning paths, possibly monetization (this is explicitly "decide later").

## 7. What "visual perspective first" means in practice (your example, formalized)
Flow for a topic like **"How an AI Agent works"**:
1. User opens topic → sees one clean flowchart of an agent's architecture (Input → LLM/Brain → Planning → Tool Use → Memory → Output).
2. User **clicks the "LLM" node** → a side panel/modal opens explaining just that node's role in an agent, with its own mini-diagram if needed.
3. Each node can go deeper (click again → sub-diagram, e.g. clicking "Tool Use" shows a flowchart of function calling).
4. At any point, user can ask the **chat tutor** a question — it answers using the same curriculum content, and can even highlight which diagram/node answers it.

## 8. Suggestions from me (beyond what you described)
- **"Explain like I'm 5 / like a developer" toggle** on every topic — same diagram, two depths of explanation.
- **Glossary layer**: any technical term (token, embedding, context window) is clickable inline everywhere in the app, not just in dedicated topics.
- **"Compare models" view** in the library — e.g., GPT vs Claude vs Gemini vs Llama side by side (context window, modality, open/closed, pricing tier, best-for).
- **Changelog feed** — a simple daily/weekly feed: "New model released: X" or "Y updated to version Z" — this satisfies your "daily updated" requirement without needing full automation on day one.
- **Offline mode** for mobile (core diagrams cached) since some learners will have patchy data.
- Start the model-tracking pipeline as **semi-automated** (pull from a couple of reliable sources + a human reviews before publishing) rather than fully automated from day one — reduces risk of wrong/junk info, which matters a lot for a learning product's credibility.

## 9. Next documents
- See `02-PRD.md` for detailed feature/user-story level requirements.
- See `03-TRD.md` for technical architecture and stack recommendations.
