import type { Topic } from '../curriculum';

export const llmModelsTopic: Topic = {
  id: 'llm_models',
  title: 'LLM Models & Taxonomy',
  slug: 'llm-models',
  summary: 'Learn the classifications of modern frontier models, their stable taxonomy, and current state-of-the-art snapshots.',
  rootDiagramId: 'models_root',
  subDiagrams: {
    models_root: {
      id: 'models_root',
      title: 'LLM Classification Taxonomy',
      nodes: [
        {
          id: 'models_start',
          label: 'LLM Taxonomy Overview',
          x: 50,
          y: 150,
          width: 160,
          height: 70,
          type: 'concept',
          shortExplanation: 'Stable taxonomy of modern Large Language Models.',
          simpleExplanation: 'Categorizing AIs by who owns them, how big they are, and what special jobs they can do.',
          detailedExplanation: `### 1. Learning Objective
Understand how to categorize any Large Language Model based on its structural characteristics rather than memorizing names.

### 2. Concept (What is it?)
LLMs are categorized by their hosting type, size, and reasoning capabilities into a stable taxonomy: Closed-Source vs. Open-Weights, SLMs, Multimodal, and Reasoning models.

### 3. Why do we need it?
### WARNING
**IMPORTANT**: This is a dated snapshot. The taxonomy below is stable, but specific model names will change within weeks or months. Do not memorize specific names; learn the structural types.

### 4. Real-Life Analogy
Think of the LLM landscape like vehicles. You have heavy commercial trucks (Frontier APIs), compact commuter cars (SLMs), off-road vehicles (Domain-Specific), and automated racing cars (Reasoning models). Knowing the vehicle class tells you its capability, even if new car brands are launched daily.

### 5. Without It
If you do not learn the taxonomy, you will be overwhelmed by the "model of the week" hype, trying to switch libraries and APIs constantly without understanding when a change is architecturally necessary.

### 6. With It (LLM Connection)
#### Level 1: Python Basics
Selecting a model name string to initialize an API client.
#### Level 2: My Project
Writing a wrapper that easily switches between local open-weights (Llama) and cloud-hosted APIs (Claude).
#### Level 3: Production AI
Choosing the exact class of model (e.g., lightweight SLM vs heavy reasoning model) depending on the SLA and budget constraints.`
        },
        {
          id: 'models_closed',
          label: 'Closed-Source / API',
          x: 270,
          y: 50,
          width: 160,
          height: 70,
          type: 'llm',
          shortExplanation: 'Commercial models accessed exclusively via web APIs.',
          simpleExplanation: 'AI models run by big companies on their supercomputers. You pay per word and access them over the internet.',
          detailedExplanation: `### 1. Learning Objective
Understand commercial frontier models, their pricing structures, and why they are used.

### 2. Concept
Closed-source models (e.g., GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro) are hosted by providers who keep weights private and charge per input/output token.

### 3. Snapshot: July 2026 Model Specifications
| Model Name | Provider | Modality | Input Cost ($/M) | Output Cost ($/M) | Key Strength |
| --- | --- | --- | --- | --- | --- |
| **Claude 3.5 Sonnet** | Anthropic | Multimodal | $3.00 | $15.00 | Coding, logic, agent execution |
| **GPT-4o** | OpenAI | Omnimodal | $2.50 | $10.00 | Conversational speed, vision, coding |
| **Gemini 1.5 Pro** | Google | Multimodal | $1.25 | $5.00 | 2M context window, video parsing |

### 4. Code Example (Syntax)
\`\`\`python
# Initializing a closed-source frontier model
from anthropic import Anthropic
client = Anthropic(api_key="sk-...")
response = client.messages.create(
    model="claude-3-5-sonnet-latest",
    messages=[{"role": "user", "content": "Hello"}]
)
\`\`\`

### 5. LLM Connection
- **Python Basics**: Simple single-call scripts.
- **My Project**: Grounding Claude 3.5 Sonnet in custom memory.
- **Production AI**: Orchestrating agent nodes with low-cost fallbacks (e.g., GPT-4o mini).`
        },
        {
          id: 'models_open',
          label: 'Open-Weights / Local',
          x: 270,
          y: 250,
          width: 160,
          height: 70,
          type: 'llm',
          shortExplanation: 'Models whose parameters are open for download and local hosting.',
          simpleExplanation: 'AIs where you can download the actual brain files and run them on your own computer for free.',
          detailedExplanation: `### 1. Learning Objective
Understand the trade-offs of hosting open-weights models locally or in private clouds.

### 2. Concept
Open-weights models (e.g., Llama 3.1, DeepSeek-V3) allow complete access to network weights, enabling private hosting, fine-tuning, and zero-data-leakage compliance.

### 3. Snapshot: July 2026 Open-Weights
| Model Name | Provider | Size (Parameters) | Modality | Primary Use Case |
| --- | --- | --- | --- | --- |
| **Llama 3.1 70B** | Meta | 70 Billion | Text Only | General logic, local agents, fine-tuning |
| **DeepSeek-V3** | DeepSeek | 671B (MoE) | Text Only | High-performance open alternative |
| **Llama 3.1 8B** | Meta | 8 Billion | Text Only | Edge deployment, fast local pipelines |

### 4. Code Example (Local Run)
\`\`\`python
# Running local Llama 3.1 via Ollama
import requests

response = requests.post(
    "http://localhost:11434/api/generate",
    json={"model": "llama3.1", "prompt": "Why is the sky blue?"}
)
print(response.json()["response"])
\`\`\`

### 5. LLM Connection
- **Python Basics**: Calling local server endpoints.
- **My Project**: Swapping OpenAI with a local Llama model for offline use.
- **Production AI**: Serving high-throughput open weights on private GPU clusters to eliminate API rate limits.`
        },
        {
          id: 'models_reasoning',
          label: 'Reasoning Models',
          x: 480,
          y: 150,
          width: 160,
          height: 70,
          type: 'process',
          shortExplanation: 'Models that output chain-of-thought steps before answering.',
          simpleExplanation: 'AIs that take a deep breath and think step-by-step behind the scenes before showing you the answer.',
          detailedExplanation: `### 1. Learning Objective
Understand how reinforcement-learned reasoning models operate and when to use them.

### 2. Concept
Reasoning models (e.g., OpenAI o1, o3-mini, DeepSeek-R1) generate silent, structured reasoning steps (Chain-of-Thought) before writing the final output. This allows them to self-correct and solve complex math, logic, and coding problems.

### 3. Key Takeaway
**IMPORTANT**: You do not need to learn every new LLM name. Learn the Transformer fundamentals. Modern models are just advanced layers on top of the same self-attention and matrix mechanics.

### 4. Snapshot: July 2026 Reasoning Models
- **OpenAI o1**: State-of-the-art complex math and coding reasoning.
- **OpenAI o3-mini**: Fast reasoning model optimized for tool-calling and agents.
- **DeepSeek-R1**: High-performance open-weights reasoning model.

### 5. LLM Connection
- **Python Basics**: Querying a reasoning model directly.
- **My Project**: Using o3-mini to solve logical steps in agent planning.
- **Production AI**: Routing hard tasks to reasoning models and simple tasks to SLMs to balance speed, cost, and accuracy.`
        }
      ],
      edges: [
        { from: 'models_start', to: 'models_closed', animated: true },
        { from: 'models_start', to: 'models_open', animated: true },
        { from: 'models_closed', to: 'models_reasoning', animated: true },
        { from: 'models_open', to: 'models_reasoning', animated: true }
      ]
    }
  }
};
