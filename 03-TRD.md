# Technical Requirements Document (TRD)
## AI/LLM Visual Learning App

**Status:** Draft v1
**Related docs:** 01-PROJECT-PLAN.md, 02-PRD.md

---

## 1. High-level architecture

```
┌─────────────────────────────┐        ┌──────────────────────────┐
│        CLIENT APPS          │        │        BACKEND            │
│  Web (Next.js/React, PWA)   │◄──────►│  API layer (Node/Python)  │
│  Mobile (React Native)      │        │                            │
└─────────────────────────────┘        │  - Content service         │
                                        │  - Chat/RAG service        │
                                        │  - Model-library service   │
                                        │  - Search service          │
                                        └───────────┬────────────────┘
                                                     │
                        ┌────────────────────────────┼──────────────────────────┐
                        ▼                            ▼                          ▼
              ┌──────────────────┐        ┌────────────────────┐    ┌───────────────────┐
              │ Content DB        │        │ Vector DB           │    │ Model-tracking     │
              │ (topics, nodes,   │        │ (embeddings of      │    │ pipeline (daily    │
              │ diagrams, JSON)   │        │ curriculum content   │    │ job + review queue)│
              └──────────────────┘        │ for RAG chat)        │    └───────────────────┘
                                           └────────────────────┘
```

## 2. Recommended stack (suggestions — adjust to your team's comfort)

| Layer | Recommendation | Why |
|---|---|---|
| Web frontend | **Next.js (React) + TypeScript** | SSR for fast first load, easy PWA setup, huge ecosystem |
| Diagram rendering | **React Flow** (for interactive clickable node graphs) + **Mermaid** (for simpler static flowcharts) | React Flow gives you click/expand/drag node interactions out of the box; Mermaid is fast for simple diagrams authored in text |
| Styling | Tailwind CSS | Fast iteration, consistent design tokens |
| Mobile | **React Native (Expo)** | Share logic/types with the web app; one codebase for iOS + Android |
| Backend API | **Node.js (NestJS or Express) or Python (FastAPI)** | Either is fine; FastAPI is a natural fit if your model-tracking pipeline is Python-heavy |
| Content storage | **Postgres** (structured: topics, nodes, edges, glossary, model library) | Relational fits a topic-tree + node-graph model well |
| Vector DB (for chat RAG) | **pgvector (inside Postgres)** to start, or **Pinecone/Qdrant** if you outgrow it | pgvector avoids a second database for MVP |
| Chat/LLM | Anthropic Claude API or OpenAI API, called server-side with **RAG grounded in your own content** | Never expose API keys client-side |
| Auth (when needed, V2) | Clerk/Auth0/Firebase Auth | Skip entirely for MVP — no accounts needed |
| Hosting | Vercel (web) + Render/Fly.io/Railway (backend) + Expo EAS (mobile builds) | Low-ops for a small team |

## 3. Content data model (simplified)

```
Topic
 ├─ id, title, slug, summary, order
 └─ Diagram (1 per topic, can be nested)
      ├─ Node
      │   ├─ id, label, type (llm|memory|tool|input|output|concept...)
      │   ├─ short_explanation
      │   ├─ detailed_explanation
      │   ├─ child_diagram_id (nullable — for "click to go deeper")
      │   └─ glossary_term_ids[]
      └─ Edge (node_from, node_to, label)

GlossaryTerm
 ├─ id, term, short_def, long_def, related_topic_ids[]

Model (library)
 ├─ id, name, provider, release_date, modality, open_weight (bool),
 │  strengths[], why_it_matters, source_url, last_verified_at

ChatMessage (session-scoped, not persisted long-term unless you add accounts)
 ├─ role, content, cited_node_ids[]
```

This structure lets the **same node-graph engine** power every topic — you're not hand-building custom UI per topic, just data.

## 4. Diagram/click-to-explore engine
- Build **one reusable "DiagramCanvas" component** (React Flow based) that takes a `Diagram` JSON object and renders it.
- Clicking a node opens a shared "ExplanationPanel" component — same UX pattern everywhere, so content authors only ever write data, not UI code.
- "Go deeper" = node has a `child_diagram_id` → canvas transitions to that diagram (breadcrumb trail shown so users can go back up).
- This means **non-engineers can eventually author new topics** by filling in a structured JSON/CMS form — important since diagram authoring is your biggest content bottleneck (flagged in PRD risks).

## 5. Chat Tutor (RAG) design
1. All curriculum content (topic summaries, node explanations, glossary) is chunked and embedded into the vector DB at publish time.
2. On a user question: embed the query → retrieve top-k relevant chunks from **your own content only** → pass those chunks + the question to the LLM with a system prompt that instructs it to answer **only from the provided context** and say "this isn't covered in the app yet" if it isn't.
3. Return the answer with **references to the source node/topic IDs** → frontend renders those as clickable deep-links.
4. Guardrail: if retrieval confidence is low (no chunk closely matches), don't call the LLM with a generic fallback — show "not covered yet" directly. This is what keeps the tutor "scoped," not just a prompt instruction.

## 6. Daily Model-Update Pipeline
Goal: keep the Model Library fresh without publishing wrong info.

**Sources to poll (examples, verify current availability before building):**
- Hugging Face "new models" feed/API
- LMSYS/Chatbot Arena leaderboard
- Official provider blogs/changelogs (OpenAI, Anthropic, Google DeepMind, Meta, Mistral, DeepSeek, Alibaba/Qwen, etc.) via RSS where available
- Papers with Code / arXiv for research-notable releases

**Pipeline (recommended for MVP → V1, semi-automated):**
1. Scheduled job (daily cron) pulls from sources above.
2. New/changed entries land in a **review queue** (not published directly).
3. A human (you, initially) reviews and approves — takes minutes/day for a curated set, not the entire firehose.
4. Approved entries get a short **"why it matters"** write-up (can be LLM-drafted, human-edited) and go live with `last_verified_at` timestamp updated.
5. Fully automated publishing (no human step) is a later optimization once you trust the source quality — flagged as a risk in the PRD.

## 7. Mobile-specific considerations
- Diagram interactions need to be touch-friendly: tap to open node, pinch-to-zoom on canvas, swipe to go back from a sub-diagram.
- Consider a simplified "linear" fallback view of each diagram for very small screens, in addition to the full canvas.
- Offline caching: bundle core MVP topics into the app so they work without connectivity; chat tutor requires connectivity (needs API calls).

## 8. Non-functional requirements
- **Performance**: diagram canvases should render in <1s on a mid-range phone; lazy-load sub-diagrams only when opened.
- **Accuracy/trust**: every model library entry shows its source link and last-verified date — transparency matters more than raw automation speed.
- **Scalability**: MVP traffic is low — a single Postgres instance + serverless API is enough; no need to over-engineer early.
- **Security**: LLM API keys stay server-side only; rate-limit the chat endpoint to prevent abuse/cost overrun.
- **Accessibility**: diagrams should have a text-equivalent view (screen-reader friendly) since visual-only content excludes some users.

## 9. Suggested build order (maps to PRD MVP)
1. Data model + Postgres schema for Topic/Diagram/Node/Glossary/Model.
2. DiagramCanvas + ExplanationPanel reusable components (web first).
3. Author the first 5 topics as data (LLM Basics, Transformers, Prompting, RAG, AI Agents).
4. Model library CRUD + static seed of ~30 models.
5. Chat RAG pipeline over the 5 topics + glossary.
6. Global search.
7. Responsive polish → PWA install support.
8. (V1) React Native app reusing the same API + component logic where possible.
9. (V1) Automate the model-update pipeline with the review-queue step.

## 10. Open technical decisions (to make before/at build start)
- Node vs Python backend (depends on who's building the model-tracking pipeline).
- Whether to author content as JSON files in-repo (fastest for MVP, git-versioned) vs a lightweight CMS (better once non-engineers author content).
- Which LLM provider for the chat tutor, and budget/rate-limit plan.
