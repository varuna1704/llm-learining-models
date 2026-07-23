import type { Topic } from '../curriculum';

export const brainAgentLoopTopic: Topic = {
  id: 'brain_agent_loop',
  title: 'Brain & Agent Loop',
  slug: 'brain-agent-loop',
  summary: 'Examine how the LLM serves as a central brain inside an autonomous execution loop, planning steps and using tool feedback.',
  rootDiagramId: 'agent_loop_root',
  subDiagrams: {
    agent_loop_root: {
      id: 'agent_loop_root',
      title: 'Autonomous Agent Loop',
      nodes: [
        {
          id: 'loop_input',
          label: 'User Request',
          x: 50,
          y: 150,
          width: 140,
          height: 70,
          type: 'input',
          shortExplanation: 'The user assigns a goal to the agent.',
          simpleExplanation: 'The objective you want the AI to achieve.',
          detailedExplanation: `### 1. Learning Objective
Understand how to construct an autonomous REPL loop that routes requests to an LLM.

### 2. Concept (What is it?)
An Agent Loop is an autoregressive execution architecture where the LLM evaluates the state, decides on actions, receives feedback, and loops until the goal is met.

### 3. Why do we need it?
Chatbots respond once and stop. Complex tasks require planning, verifying, and running multi-step tool commands.

### 4. Real-Life Analogy
Like a thermostat. It reads the temperature (Observation), decides to turn on the AC (Action), checks the temperature again (Feedback loop), and stops when cool.

### 5. Without It
You would have to manually execute every single sub-step and pass the output back to the LLM yourself.

### 6. Install
\`\`\`bash
pip install rich
\`\`\`

### 7. Syntax
\`\`\`python
while True:
    user_input = input("You: ")
    if user_input == "exit": break
    response = brain.think(user_input)
    print("AI:", response)
\`\`\`

### 8. Example
\`\`\`python
# Simple REPL state loop
class Agent:
    def __init__(self, brain):
        self.brain = brain
    def run(self):
        while True:
            cmd = input("> ")
            if cmd == "exit": break
            print(self.brain.think(cmd))
\`\`\``
        },
        {
          id: 'loop_eval',
          label: 'LLM Evaluator (Brain)',
          x: 240,
          y: 150,
          width: 150,
          height: 70,
          type: 'llm',
          shortExplanation: 'The central LLM brain determining the next action.',
          simpleExplanation: 'The AI processor deciding if it needs tools or if it has the final answer.',
          detailedExplanation: `### 9. Example Code (Thought Chain)
\`\`\`python
# ReAct pattern prompt instruction
system_prompt = """
You operate in a loop: Thought, Action, Observation.
Output Thought: <reasoning> and then Action: <tool_call_json>
"""
\`\`\`

### 10. Behind the Scenes
The LLM evaluates the conversation history in its context window. It acts as a state router, translating natural language objectives into structured JSON tool intents.

### 11. Project Usage
Implemented in \`main.py\` as the central command line REPL loop and in \`brain.py\` for Claude invocation.

### 12. Code Walkthrough
- \`main.py\` reads lines. Slash commands are intercepted.
- Regular queries are routed to \`Brain.think()\` where system instructions ground the response.

### 13. Visual Flow
\`\`\`
Prompt -> LLM Brain -> Tool Execution -> Observation -> Context Update -> Loop
\`\`\``
        },
        {
          id: 'loop_output',
          label: 'Execution Feedback',
          x: 440,
          y: 150,
          width: 150,
          height: 70,
          type: 'output',
          shortExplanation: 'Loops observation data back to the LLM.',
          simpleExplanation: 'Feeds the tool results back to the AI so it knows what happened.',
          detailedExplanation: `### 14. Common Mistakes
- Infinite loops when the LLM keeps invoking the same failing tool.
- Exceeding context limits due to appending duplicate system logs.

### 15. Mini Exercise
Implement a command loop in python that terminates only when the user types '/quit'.

### 16. Challenge
Write an agent loop in python with a max iteration limit of 5. If it takes more than 5 steps, exit with an error.

### 17. LLM Connection
#### Level 1: Python Basics
Basic while loops.
#### Level 2: My Project
Creating the console loop that routes slash commands.
#### Level 3: Production AI
Multi-agent systems using frameworks like LangGraph or Autogen with state databases.

### 18. Interview Questions
- What is the ReAct (Reason + Act) prompt pattern?
- How do you prevent infinite loops in autonomous agents?

### 19. Summary
The agent loop coordinates state, LLM routing, and tool outputs into a continuous feedback cycle.

### 20. What's Next
Next, we explore the Tool Registry, which acts as the hands of the AI.`
        }
      ],
      edges: [
        { from: 'loop_input', to: 'loop_eval', animated: true },
        { from: 'loop_eval', to: 'loop_output', animated: true }
      ]
    }
  }
};
