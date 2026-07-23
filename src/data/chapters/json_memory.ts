import type { Topic } from '../curriculum';

export const jsonMemoryTopic: Topic = {
  id: 'json_memory',
  title: 'JSON & Persistable Memory',
  slug: 'json-memory',
  summary: 'Deconstruct how to build a persistable local fact memory database using JSON and Python serialization.',
  rootDiagramId: 'memory_root',
  subDiagrams: {
    memory_root: {
      id: 'memory_root',
      title: 'JSON Local Memory Flow',
      nodes: [
        {
          id: 'mem_flow_start',
          label: 'Client Save Fact',
          x: 50,
          y: 150,
          width: 140,
          height: 70,
          type: 'input',
          shortExplanation: 'The user wants to save a fact (e.g., "/remember name Varuna").',
          simpleExplanation: 'You type a command to save a detail in the assistant\'s memory.',
          detailedExplanation: `### 1. Learning Objective
Understand how text facts are converted into persistable structures and saved to disk.

### 2. Concept (What is it?)
Local memory persistence is the mechanism of saving key-value data to a file so it remains intact between program runs.

### 3. Why do we need it?
Without local file saving, variables like dictionaries evaporate the instant you close the console. Memory must be saved to disk.

### 4. Real-Life Analogy
It's like writing a phone number in a physical notebook. If you only keep it in your head (RAM), you'll forget it when you sleep (app quit). Writing it down (Disk) preserves it.

### 5. Without It
Every time you boot your AI assistant, it starts as a blank slate. You would have to re-introduce yourself every single run.

### 6. Code Diagram
\`\`\`
Client Input → Parse Key/Value → Update Dictionary → Serialize to JSON File
\`\`\`

### 7. Install
No external packages needed! We use Python's built-in \`json\` and \`os\` libraries.

### 8. Syntax
\`\`\`python
import json
# Serialization (Write)
json.dump(data, open("file.json", "w"), indent=2)
# Deserialization (Read)
data = json.load(open("file.json", "r"))
\`\`\``
        },
        {
          id: 'mem_flow_serialize',
          label: 'JSON Serialization',
          x: 240,
          y: 150,
          width: 150,
          height: 70,
          type: 'process',
          shortExplanation: 'Converts the in-memory dictionary to a formatted string.',
          simpleExplanation: 'Translates the active Python dictionary into a text format that can be saved.',
          detailedExplanation: `### 9. Example
\`\`\`python
import json

memory = {"user_name": "Varuna", "project": "ModelMap"}
# Write indented JSON to file
with open("data/memory.json", "w") as f:
    json.dump(memory, f, indent=2)
\`\`\`

### 10. Behind the Scenes
Serialization takes complex nested objects in memory (RAM) and flattens them into a linear stream of bytes (UTF-8 string) matching the standard JSON specification.

### 11. Project Usage
Used in \`memory.py\` to store key-value facts and in \`notes.py\` to manage notes lists.

### 12. Code Walkthrough
- \`json.dump(data, f, indent=2)\` writes formatted JSON to the file handle \`f\`. The \`indent=2\` parameter makes the file human-readable.
- The path is resolved dynamically via \`config.py\` to ensure portability across operating systems.

### 13. Visual Flow
\`\`\`
[Memory Dictionary]  →  json.dump()  →  "memory.json" File on Disk
\`\`\``
        },
        {
          id: 'mem_flow_disk',
          label: 'Disk File Storage',
          x: 440,
          y: 150,
          width: 150,
          height: 70,
          type: 'database',
          shortExplanation: 'Saves JSON data safely to data/memory.json.',
          simpleExplanation: 'The physical file on your hard drive holding the saved text facts.',
          detailedExplanation: `### 14. Common Mistakes
- Writing to a file without closing it (which is resolved by using Python's \`with open()\` context manager).
- Overwriting the entire file with a single key instead of loading, updating, and saving the dictionary.
- Parsing corrupted or empty files, which leads to crashing on startup.

### 15. Mini Exercise
Open your terminal, write a short script that creates a dictionary, writes it to a file, reads it back, and asserts that the data is identical.

### 16. Challenge
Implement atomic writes: write to a temporary file (e.g., \`memory.json.tmp\`) first, then rename it to \`memory.json\` to prevent file corruption if the program crashes mid-write.

### 17. LLM Connection
#### Level 1: Python Basics
Saving local state variables as JSON.
#### Level 2: My Project
Providing a local key-value lookup tool to the agent so it can retrieve system configuration parameters.
#### Level 3: Production AI
Translating local JSON stores into scalable Redis or PostgreSQL key-value stores for multi-tenant SaaS assistant backends.

### 18. Interview Questions
- Why is it important to use a context manager (\`with open\`) when handling file operations in Python?
- What are the formatting differences between JSON and Python dictionaries?
- How do you handle a \`JSONDecodeError\` when reading a corrupted configuration file?

### 19. Summary
JSON serialization is the bedrock of local persistence for text-based facts. It flattens in-memory data structures to disk losslessly.

### 20. What's Next
Next, we explore how to expose this data store as a tool to the LLM via a structured Tool Registry.`
        }
      ],
      edges: [
        { from: 'mem_flow_start', to: 'mem_flow_serialize', animated: true },
        { from: 'mem_flow_serialize', to: 'mem_flow_disk', animated: true }
      ]
    }
  }
};
