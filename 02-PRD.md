# Product Requirements Document (PRD)
## AI/LLM Visual Learning App

**Status:** Draft v1
**Owner:** (you)
**Related docs:** 01-PROJECT-PLAN.md, 03-TRD.md

---

## 1. Objective
Build a learning application, focused only on the LLM/AI-agent domain, that teaches through **visual diagrams first, text second**, includes an in-app chat tutor scoped to the app's own content, and maintains an always-fresh library of AI models.

## 2. Goals & non-goals

### Goals
- G1: A beginner with zero AI background can understand "what is an LLM," "what is RAG," and "how does an AI agent work" without leaving the app.
- G2: Every core concept is explorable as a diagram/flowchart before any long-form text is shown.
- G3: A chat assistant answers questions grounded in the app's curriculum (not open-ended internet answers).
- G4: A model library that's kept current, with clear "why this model matters" context, not just a spec sheet.
- G5: Works well on both laptop (web) and phone.

### Non-goals (for now — explicitly deferred)
- Deciding monetization/business model.
- Deciding whether this becomes a public product, internal tool, or open-source project.
- Certification/quizzes/gamification (V2 candidate).
- Supporting topics outside the LLM/AI-agent/RAG domain (no general "AI/ML" like classic ML, computer vision, robotics — stay scoped).

## 3. Personas
| Persona | Description | Key need |
|---|---|---|
| Curious Beginner | No coding/AI background | Simple visuals, plain language, no jargon walls |
| Student/Junior Dev | Some coding background | Wants the "why," then code-level detail |
| Builder | About to build an agent/RAG app | Wants accurate mental models + framework comparisons fast |

## 4. Core features (MVP scope marked)

### 4.1 Visual Topic Explorer — **MVP**
- Each topic opens as a **flowchart/diagram canvas**, not a text page.
- Nodes are clickable; clicking reveals an explanation panel (short text + optional deeper text).
- Some nodes expand into their **own sub-diagram** (progressive disclosure), e.g. Agent → Tool Use → Function Calling flow.
- Depth toggle: "Simple" vs "Detailed" explanation for the same node.
- Every technical term in any explanation is a **hover/click glossary link**.

**User story:** As a beginner, I want to click on "LLM" inside an agent diagram and instantly understand its role, without reading an unrelated wall of text.

### 4.2 Curriculum structure — **MVP**
Initial topic tree (expandable later):
1. LLM Basics — what is an LLM, tokens, context window, how text is generated
2. How Transformers Work — attention (conceptual, not math-heavy), training vs inference
3. Prompting — prompt structure, few-shot, system prompts, prompt patterns
4. RAG (Retrieval-Augmented Generation) — embeddings, vector databases, retrieval, augmentation, generation
5. AI Agents — architecture (LLM/brain, planning, memory, tool use, output), single-agent loop
6. Multi-Agent Systems — orchestration patterns (V1)
7. Fine-tuning vs Prompting vs RAG — when to use which (V1)
8. Evaluation — how do you know if a model/agent is good (V1)
9. Frameworks & Tools — LangChain, LlamaIndex, OpenAI Agents SDK, Anthropic's agent tooling, etc. — what each one is *for* (V1)

### 4.3 Chat Tutor — **MVP**
- Chat box available from anywhere in the app.
- Answers are grounded in the app's own curriculum content (retrieval over the app's topic/diagram content, not open internet).
- When relevant, the chat response can **deep-link to the diagram/node** that covers the answer ("see this in the RAG diagram →").
- If a question is outside the app's scope (e.g., general coding help unrelated to LLMs), the tutor says so rather than guessing.

**User story:** As a learner mid-diagram, I want to ask "why do we need a vector database?" and get an answer consistent with what the app teaches, with a link back to the relevant diagram.

### 4.4 Model Library — **MVP (static) → V1 (auto-updated)**
- Card-based directory of AI models: name, provider, release date, modality (text/image/audio/multimodal), open vs closed weight, notable strengths, "why it matters" summary.
- Filter/sort by provider, release date, popularity, open/closed.
- Compare view: pick 2–4 models side by side.
- "Last updated" timestamp always visible; MVP updates manually/weekly, V1 automates daily checks against a curated set of sources with human review before publish.

**User story:** As a builder, I want to quickly see what's new this week and how it compares to what I already know.

### 4.5 Search — **MVP**
- Global search across topics, glossary terms, and model library.

### 4.6 Progress tracking / bookmarks — **V1**
- Mark topics as "learned," bookmark specific nodes/diagrams for later.

### 4.7 Cross-platform — **MVP = responsive web (PWA-installable); V1 = native/wrapped mobile app**

## 5. UX principles
- **Diagram before paragraph** — always.
- **Progressive disclosure** — never show everything at once; click to go deeper.
- **No dead ends** — every explanation panel offers "go deeper," "ask the tutor," or "see related topic."
- **Consistent visual language** — same shapes/colors mean the same thing across all diagrams (e.g., LLM nodes always look the same regardless of topic) so learners build pattern recognition.

## 6. Success metrics (candidates — refine later)
- % of new users who complete at least one full topic (activation)
- Average nodes clicked per session (engagement depth)
- Chat tutor usage rate and "was this helpful" feedback
- Model library freshness (days since last update) — target: MVP weekly, V1 daily
- Return visit rate within 7 days

## 7. Risks / open questions
- **Accuracy risk**: AI/LLM space changes fast — wrong info in a learning app is worse than in a blog, since users trust it more. Mitigation: human review step before auto-updates go live (see TRD).
- **Scope creep**: temptation to cover general ML/AI — must stay disciplined to LLM/agent/RAG domain per your original ask.
- **Diagram authoring cost**: hand-crafted diagrams are the differentiator but are labor-intensive — need a repeatable diagram template/system (see TRD content pipeline).
- **Chat scoping**: preventing the tutor from answering outside the curriculum needs real guardrails, not just a prompt instruction.

## 8. MVP acceptance criteria
- [ ] 5 topics fully built with clickable diagrams and 2-depth explanations
- [ ] Glossary linking works across all 5 topics
- [ ] Chat tutor answers grounded only in the 5 topics + glossary, with source deep-links
- [ ] Model library with ≥30 models, filter + compare working
- [ ] Fully responsive on mobile browser and desktop
- [ ] Global search returns topics, glossary terms, and models
