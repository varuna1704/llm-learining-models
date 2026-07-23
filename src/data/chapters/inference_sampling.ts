import type { Topic } from '../curriculum';

export const inferenceSamplingTopic: Topic = {
  id: 'inference_sampling',
  title: 'Inference & Sampling',
  slug: 'inference-sampling',
  summary: 'Deconstruct how a trained LLM outputs responses token-by-token using temperature, top-p, and streaming logic.',
  rootDiagramId: 'sampling_root',
  subDiagrams: {
    sampling_root: {
      id: 'sampling_root',
      title: 'Token Generation & Sampling Flow',
      nodes: [
        {
          id: 'samp_logits',
          label: '1. Logits Output',
          x: 50,
          y: 150,
          width: 150,
          height: 70,
          type: 'llm',
          shortExplanation: 'Raw vocabulary scores calculated by the model\'s final layer.',
          simpleExplanation: 'The raw, unnormalized score sheet for every word in the dictionary.',
          detailedExplanation: `### 1. Learning Objective
Understand how models output raw logits and convert them to probability distributions.

### 2. Concept (What is it?)
Inference is the execution phase where a trained model predicts output. Sampling is the logic of choosing a token from the calculated logit scores.

### 3. Why do we need it?
Without sampling settings, models would either repeat the exact same text every run (greedy search) or output random, incoherent words.

### 4. Real-Life Analogy
Like choosing an item from a restaurant menu. Raw scores are your interest levels. Sampling settings determine whether you always pick your #1 favorite (greedy) or occasionally try your #2 or #3 choice for variety (temperature).

### 5. Without It
You cannot adjust the creativity, determinism, or diversity of the AI\'s replies.

### 6. Install
\`\`\`bash
pip install numpy
\`\`\`

### 7. Syntax
\`\`\`python
# Greedy selection: pick index with highest value
next_token = np.argmax(logits)
\`\`\`

### 8. Example
\`\`\`python
# Logits Softmax converting to probability
import numpy as np
logits = np.array([2.0, 1.0, 0.1]) # Scores for 3 tokens
probs = np.exp(logits) / np.sum(np.exp(logits))
print(probs) # [0.65, 0.24, 0.11]
\`\`\``
        },
        {
          id: 'samp_temp',
          label: '2. Temperature / Top-P',
          x: 250,
          y: 150,
          width: 160,
          height: 70,
          type: 'process',
          shortExplanation: 'Adjusts probability scaling to control response randomness.',
          simpleExplanation: 'A dial controlling if the AI chooses the most obvious word or gets creative.',
          detailedExplanation: `### 9. Example Code (Temperature scaling)
\`\`\`python
# Scaling logits by temperature T
def scale_logits(logits, T):
    if T <= 0: return np.argmax(logits) # Deterministic
    scaled = logits / T
    return np.exp(scaled) / np.sum(np.exp(scaled))
\`\`\`

### 10. Behind the Scenes
- **Temperature (T)** divides logits before softmax. T < 1 sharpens distributions (deterministic); T > 1 flattens them (creative).
- **Top-P (Nucleus)** filters candidate tokens to the smallest set whose combined probability exceeds P (e.g. 0.9), discarding unlikely tail words.

### 11. Project Usage
Configured in API calls in \`brain.py\` to balance factual correctness (low temp) and creative conversational replies (higher temp).

### 12. Code Walkthrough
- High temperature flattens distributions, increasing chances for lower-probability tokens.
- Top-P cuts off the "long tail" of low-probability words, preventing absolute gibberish.

### 13. Visual Flow
\`\`\`
Logits [2.0, 1.0] ↓ Temp T=0.7 ↓ Scaled [2.85, 1.42] ↓ Softmax ↓ Probs [0.80, 0.20]
\`\`\``
        },
        {
          id: 'samp_stream',
          label: '3. Token Streaming',
          x: 460,
          y: 150,
          width: 150,
          height: 70,
          type: 'output',
          shortExplanation: 'Outputs tokens in real-time as they are predicted.',
          simpleExplanation: 'Showing words on the screen immediately one-by-one as the AI creates them.',
          detailedExplanation: `### 14. Common Mistakes
- Setting temperature to 0 when you want creative writing.
- Mixing high temperature with very low top-p, which cancels out creative variations.

### 15. Mini Exercise
Write a function that accepts logits and returns the softmax distribution under a temperature of 0.5.

### 16. Challenge
Write a simulation of nucleus (top-p) sampling that drops all tokens whose cumulative sum exceeds 0.85, then re-normalizes the remaining tokens.

### 17. LLM Connection
#### Level 1: Python Basics
Standard array operations.
#### Level 2: My Project
Setting \`temperature=0.0\` in Claude requests to ensure consistent tool-calling JSON outputs.
#### Level 3: Production AI
Configuring streaming buffers on API gateways to reduce Time-To-First-Token (TTFT) in enterprise frontends.

### 18. Interview Questions
- How does temperature affect logit probabilities mathematically?
- What is the difference between Top-K and Top-P sampling?

### 19. Summary
Inference outputs logits, which are scaled by temperature and filtered by top-p before selection.

### 20. What's Next
Next, we study worked examples of libraries used in our assistant.`
        }
      ],
      edges: [
        { from: 'samp_logits', to: 'samp_temp', animated: true },
        { from: 'samp_temp', to: 'samp_stream', animated: true }
      ]
    }
  }
};
