import type { Topic } from '../curriculum';

export const evaluationTopic: Topic = {
  id: 'evaluation',
  title: 'Evaluation & Testing',
  slug: 'evaluation',
  summary: 'Learn how to build a simple evaluation harness to test RAG retrieval and tool-calling accuracy programmatically.',
  rootDiagramId: 'evaluation_root',
  subDiagrams: {
    evaluation_root: {
      id: 'evaluation_root',
      title: 'AI Evaluation Pipeline',
      nodes: [
        {
          id: 'eval_cases',
          label: '1. Test Cases Definition',
          x: 50,
          y: 150,
          width: 150,
          height: 70,
          type: 'input',
          shortExplanation: 'Defines expected inputs and outputs for testing.',
          simpleExplanation: 'Writing down what we expect the AI to return for specific questions.',
          detailedExplanation: `### 1. Learning Objective
Create programmatic test cases to validate RAG retrieval and tool-calling inputs.

### 2. Concept (What is it?)
Evaluation is the systemic process of measuring model output quality against a ground-truth dataset.

### 3. Why do we need it?
Without a test suite, you can never tell if tweaking a system prompt made the assistant better or broke basic features.

### 4. Real-Life Analogy
Like grading a test paper. You do not just glance at the student\'s answers and say "looks fine"; you grade each question against an answer key (Ground Truth).

### 5. Without It
You will constantly introduce regressions, breaking tool-calling parameters while fixing spelling, without noticing it.

### 6. Install
No packages needed! Standard Python features.

### 7. Syntax
\`\`\`python
# Simple assertion structure
assert expected == actual, f"Failed! Expected {expected}, got {actual}"
\`\`\`

### 8. Example
\`\`\`python
# program test suite
TEST_CASES = [
    {"query": "/add 2 3", "expected": 5.0},
    {"query": "/remember age 25", "expected": "Saved fact"}
]
\`\`\``
        },
        {
          id: 'eval_harness',
          label: '2. Eval Harness Run',
          x: 250,
          y: 150,
          width: 150,
          height: 70,
          type: 'process',
          shortExplanation: 'Executes the commands programmatically and scores the outputs.',
          simpleExplanation: 'A script that automatically tests all questions and reports the score.',
          detailedExplanation: `### 9. Example Code
\`\`\`python
# Evaluation loop execution
def run_evals(agent, cases):
    passed = 0
    for case in cases:
        result = agent.execute(case["query"])
        if result == case["expected"]:
            passed += 1
    print(f"Accuracy: {passed / len(cases) * 100}%")
\`\`\`

### 10. Behind the Scenes
The eval harness loads configurations, boots the assistant state, runs the queries, catches exceptions, and computes final precision/recall scores.

### 11. Project Usage
Can be built as a separate script in the assistant root directory to run checks.

### 12. Code Walkthrough
- Define queries and target tool expectations.
- Loop and execute without waiting for user stdin.

### 13. Visual Flow
\`\`\`
Test Suite → Execute Tool/Query → Assert Output → Output Accuracy Score
\`\`\``
        },
        {
          id: 'eval_scoring',
          label: '3. Metric Scoring',
          x: 450,
          y: 150,
          width: 150,
          height: 70,
          type: 'output',
          shortExplanation: 'Reports final metrics: accuracy, precision, and tool-calling rates.',
          simpleExplanation: 'The final grade sheet showing what percentage of tests passed.',
          detailedExplanation: `### 14. Common Mistakes
- Manual testing only: hoping the app still works.
- Over-testing: writing assertions on model sentence flows that naturally vary.

### 15. Mini Exercise
Write a function that accepts a list of outputs and asserts that none are empty strings.

### 16. Challenge
Build a RAG evaluation script that checks if the retrieved text from your notes contains the correct target keywords.

### 17. LLM Connection
#### Level 1: Python Basics
Standard list loops and assertions.
#### Level 2: My Project
Building a test file to run tool and note-retrieval evaluations.
#### Level 3: Production AI
Using enterprise LLM-as-a-judge frameworks (e.g., Ragas, TruLens) running on CI/CD pipelines to review product deployments.

### 18. Interview Questions
- How do you evaluate a generative AI system where outputs vary?
- What are precision and recall in the context of RAG retrieval?

### 19. Summary
プログラム checks are the only way to scale and secure AI assistant features over time.

### 20. What's Next
Next, we study Failure Modes & Limitations.`
        }
      ],
      edges: [
        { from: 'eval_cases', to: 'eval_harness', animated: true },
        { from: 'eval_harness', to: 'eval_scoring', animated: true }
      ]
    }
  }
};
