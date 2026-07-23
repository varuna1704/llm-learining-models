import type { Topic } from '../curriculum';

export const failureModesTopic: Topic = {
  id: 'failure_modes',
  title: 'Failure Modes & Limitations',
  slug: 'failure-modes',
  summary: 'Anticipate and design mitigations for typical AI problems: hallucinations, context window overflow, rate limits, and cost blowups.',
  rootDiagramId: 'failure_root',
  subDiagrams: {
    failure_root: {
      id: 'failure_root',
      title: 'Failure Mitigations Flow',
      nodes: [
        {
          id: 'fail_hallucination',
          label: 'Hallucination & Cost',
          x: 50,
          y: 150,
          width: 150,
          height: 70,
          type: 'concept',
          shortExplanation: 'How to handle incorrect outputs and cost spikes.',
          simpleExplanation: 'How we stop the AI from making up facts or spending all our money.',
          detailedExplanation: `### 1. Learning Objective
Identify, debug, and design defensive patterns for common LLM runtime failure modes.

### 2. Concept (What is it?)
AI Engineering is less about writing code that works and more about writing defensive guardrails for when the model fails.

### 3. Why do we need it?
Models are probabilistic next-token predictors. They will occasionally fail, hallucinate, hit API rate limits, or generate cost blowups.

### 4. Real-Life Analogy
Like designing a building in an earthquake zone. You do not pretend earthquakes (errors) do not happen; you build dampening joints (mitigations) so the structure doesn\'t collapse.

### 5. Without It
A single infinite tool loop or rate limit drop will crash your application, resulting in a broken user experience.

### 6. Install
No packages needed! Standard error handling patterns.

### 7. Syntax
\`\`\`python
# Simple try-except with rate limit backoff
import time
for delay in [1, 2, 4]:
    try:
        response = call_api()
        break
    except RateLimitError:
        time.sleep(delay)
\`\`\`

### 8. Example
\`\`\`python
# Handing context window truncation safely
def trim_history(messages, max_tokens=100000):
    while estimate_tokens(messages) > max_tokens:
        messages.pop(1) # Drop oldest messages
    return messages
\`\`\``
        },
        {
          id: 'fail_ratelimits',
          label: 'Rate Limits & Errors',
          x: 250,
          y: 150,
          width: 150,
          height: 70,
          type: 'process',
          shortExplanation: 'Applies exponential backoff and request timeouts.',
          simpleExplanation: 'Retrying queries automatically when the server says it is busy.',
          detailedExplanation: `### 9. Example Code
\`\`\`python
# Exponential backoff handler
import time
def call_with_backoff(api_func, max_retries=3):
    for i in range(max_retries):
        try:
            return api_func()
        except Exception as e:
            if i == max_retries - 1: raise e
            time.sleep(2 ** i)
\`\`\`

### 10. Behind the Scenes
- **Hallucinations** are mitigated by forcing the model to cite specific context blocks.
- **Rate limits** are managed via retry queues and token bucket rate limits.
- **Cost blowup** is capped by strict max_tokens constraints on every completion call.

### 11. Project Usage
Configured in \`brain.py\` to intercept Anthropic API call timeouts and connection dropouts.

### 12. Code Walkthrough
- Encase calls in \`try/except\` blocks.
- Track total input/output tokens dynamically.

### 13. Visual Flow
\`\`\`
API Call -> Fail? -> Retry with exponential delay -> Fail again? -> Fallback to local response
\`\`\``
        },
        {
          id: 'fail_mitigate',
          label: 'Defensive Design',
          x: 450,
          y: 150,
          width: 150,
          height: 70,
          type: 'output',
          shortExplanation: 'Systemic guardrails (token budgets, fallback scripts).',
          simpleExplanation: 'Setting budgets and backup plans so the assistant remains stable.',
          detailedExplanation: `### 14. Common Mistakes
- Infinite recursive agent tool calls when a tool fails.
- Assuming connection lines are always open.

### 15. Mini Exercise
Write a function that counts tokens and prints a warning if you exceed 80% of a 100K token budget.

### 16. Challenge
Build an API client loop that catches standard HTTP connection errors and automatically drops to offline-mode TF-IDF search.

### 17. LLM Connection
#### Level 1: Python Basics
Basic exception handling.
#### Level 2: My Project
Trimming chat history inside the client app to prevent context limits.
#### Level 3: Production AI
Setting up distributed queues (e.g. Celery/RabbitMQ) and API request caches (e.g. Redis) to optimize cost and SLA bounds.

### 18. Interview Questions
- How do you mitigate the risk of an LLM producing a cost blowup in an autonomous loop?
- Explain the concept of exponential backoff.

### 19. Summary
Defensive coding, token budgeting, and retry loops are essential to secure production LLM applications.

### 20. What's Next
Next, we explore prompt security and defending tool access.`
        }
      ],
      edges: [
        { from: 'fail_hallucination', to: 'fail_ratelimits', animated: true },
        { from: 'fail_ratelimits', to: 'fail_mitigate', animated: true }
      ]
    }
  }
};
