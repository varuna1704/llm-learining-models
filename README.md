# 🎛️ ModelMap — AI & LLM Visual Learning Platform

ModelMap is an interactive, visual-first learning application designed to help users go from "what is an LLM" to understanding complex AI workflows (like RAG and Agents) using click-to-explore flowcharts, dynamic model specifications, and an in-app AI tutor.

---

## 🌟 Key Features

1. **Click-to-Explore Flowcharts**:
   - Visual diagrams for core concepts: **LLM Basics**, **Transformer Architecture**, **Prompt Construction**, **RAG**, and **AI Agents**.
   - Nodes expand into contextual side drawers explaining technical steps.
   - Zoom in/out, pan, and enter nested sub-diagrams (e.g., explore the *Self-Attention Layer* inside the Transformer, or *Function Calling* inside AI Agents).

2. **Themed Highlight & Glow Effects**:
   - Beautiful, smooth, and reactive hover states customized to each node type (e.g., input, process, LLM, database, memory, tool).

3. **AI Model Specifications Directory**:
   - A fully searchable database of top proprietary and open-weights models (OpenAI, Anthropic, Google, Meta, DeepSeek, Mistral, and more).
   - Filter models by provider, access type (Open vs. Closed), or modality (Text vs. Multimodal).
   - Side-by-side comparison matrix of up to 4 models detailing release dates, context window lengths, input/output costs, and strengths.

4. **Contextual AI Chat Tutor**:
   - Grounded chatbot helper that answers questions specifically tailored to the curriculum.
   - Deep-links directly to flowchart nodes from the tutor's answers.

5. **Inline Glossary & Tooltips**:
   - Instantly matches key terms (like *tokens*, *embeddings*, *context windows*, and *hallucinations*) inline with hovering tooltips and full definitions.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Build Tool**: Vite 8
- **Styling**: Vanilla CSS (Cyberpunk dark slate custom design system using CSS variables)
- **Linter**: Oxlint (High-performance JS/TS linter)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (LTS version recommended).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/varuna1704/llm-learining-models.git
   cd "model 1"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

Run the development server locally:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### Building for Production

Compile and bundle the application for production:
```bash
npm run build
```
The output will be generated in the `dist/` directory.

### Code Quality

Run the high-speed linter:
```bash
npm run lint
```
