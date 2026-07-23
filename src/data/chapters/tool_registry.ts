import type { Topic } from '../curriculum';

export const toolRegistryTopic: Topic = {
  id: 'tool_registry',
  title: 'Tool Registry & Function Dispatching',
  slug: 'tool-registry',
  summary: 'Understand the tool registry pattern that maps string labels to real python callables, enabling secure function dispatching.',
  rootDiagramId: 'tool_registry_root',
  subDiagrams: {
    tool_registry_root: {
      id: 'tool_registry_root',
      title: 'Tool Dispatcher Architecture',
      nodes: [
        {
          id: 'reg_register',
          label: 'Function Registry',
          x: 50,
          y: 150,
          width: 150,
          height: 70,
          type: 'tool',
          shortExplanation: 'Maps callable functions to string identifiers in a dictionary.',
          simpleExplanation: 'A checklist linking text names to the actual python script actions.',
          detailedExplanation: `### 1. Learning Objective
Implement a secure, modular dictionary-based registry pattern to manage tool functions.

### 2. Concept (What is it?)
A Tool Registry flattens external classes and function methods into a centralized key-value directory mapped by strings.

### 3. Why do we need it?
Without a registry, routing commands requires complex \`if/elif\` code blocks that become unmaintainable as your application grows.

### 4. Real-Life Analogy
Like a switchboard. A customer asks for "sales" (String ID) and the operator connects them to the actual sales department (Callable Method).

### 5. Without It
Adding a tool means editing core loop routing conditional blocks in multiple files, increasing risk.

### 6. Install
No packages needed! Built-in Python features.

### 7. Syntax
\`\`\`python
# Storing references to functions
def hello(): return "Hi"
registry = {"say_hello": hello}
# Calling the function from its string key
print(registry["say_hello"]())
\`\`\`

### 8. Example
\`\`\`python
# Simple registry class
class Registry:
    def __init__(self):
        self._tools = {}
    def register(self, name, func):
        self._tools[name] = func
    def execute(self, name, *args):
        return self._tools[name](*args)
\`\`\``
        },
        {
          id: 'reg_dispatch',
          label: 'Dynamic Dispatcher',
          x: 250,
          y: 150,
          width: 150,
          height: 70,
          type: 'process',
          shortExplanation: 'Executes the function reference dynamically with parameters.',
          simpleExplanation: 'Runs the matching function immediately using the inputs provided by the user.',
          detailedExplanation: `### 9. Example Code
\`\`\`python
# Executing registered tools dynamically
from calculator import Calculator
calc = Calculator()
tools = {"add": calc.add}

def dispatch(name, args_dict):
    # unpack parameters directly into callable
    return tools[name](**args_dict)
\`\`\`

### 10. Behind the Scenes
Python functions are "first-class citizens", meaning they can be passed as variables and stored in lists or dictionaries. The dispatcher retrieves the reference and invokes it with parameter unpacking (\`*args\` or \`**kwargs\`).

### 11. Project Usage
Defined in \`tools.py\` via the \`ToolManager\` registry class to dispatch calculator, notes, and memory commands.

### 12. Code Walkthrough
- \`self.tools = {"add": self.calculator.add}\` mounts the method references.
- \`execute_tool(name, *args)\` routes calls.

### 13. Visual Flow
\`\`\`
Tool Request: "add", Args: [2, 3] ↓ Registry Lookup ↓ Invoke calc.add(2, 3) ↓ Return 5
\`\`\``
        },
        {
          id: 'reg_output',
          label: 'JSON Tool Schema',
          x: 450,
          y: 150,
          width: 150,
          height: 70,
          type: 'output',
          shortExplanation: 'The JSON description sent to the LLM defining the tool.',
          simpleExplanation: 'The written specification explaining parameters to the AI.',
          detailedExplanation: `### 14. Common Mistakes
- Storing invocation results \`{"add": add()}\` instead of function references \`{"add": add}\`.
- Failing to catch parameter mismatch exceptions.

### 15. Mini Exercise
Build a registry dictionary with two custom math functions and run them from user input.

### 16. Challenge
Write a decorator \`@register_tool(name)\` that automatically registers any python function to a global dict.

### 17. LLM Connection
#### Level 1: Python Basics
Storing callable references.
#### Level 2: My Project
Writing \`ToolManager\` to route local console commands.
#### Level 3: Production AI
Translating python registries into OpenAPI/JSON schemas sent to Claude/GPT for autonomous tool selection.

### 18. Interview Questions
- What does it mean that functions are first-class citizens in Python?
- How does keyword parameter unpacking work in Python?

### 19. Summary
Registries map text triggers to actual executable functions dynamically.

### 20. What's Next
Next, we examine Inference & Sampling to see how LLMs generate tokens.`
        }
      ],
      edges: [
        { from: 'reg_register', to: 'reg_dispatch', animated: true },
        { from: 'reg_dispatch', to: 'reg_output', animated: true }
      ]
    }
  }
};
